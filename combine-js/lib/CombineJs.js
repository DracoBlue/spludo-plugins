/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
var path = require('path');

/**
 * @class A combine tool for css file available for the spludo framework.
 * 
 * @since 0.1 
 * @author DracoBlue
 */
CombineJs = function(options) {
    this.setOptions(options);
    
    if (!this.options.base_url) {
        throw new Error('Please configure combine_js.base_url in your (local.)config.js!');
    }

    this.combined_files = {};
    this.source_file_cache = {};
    
    this.compilers = {};
};

extend(true, CombineJs.prototype, Options.prototype, Logging.prototype);

CombineJs.prototype.logging_prefix = 'CombineJs';

CombineJs.prototype.getCombinedFile = function(combined_file_name) {
    this.trace('getCombinedFile', arguments);
    var self = this;

    var combined_file = null;
    
    if (typeof this.combined_files[combined_file_name] === 'undefined') {
        new Controller(combined_file_name, {
            "execute": function(params, context) {
                return function(cb) {
                    self.getCombinedFileContents(combined_file_name)(function(contents) {
                        context.headers['Content-Type'] = 'text/plain';
                        cb(contents);
                    });
                };
            }
        }); 
        this.combined_files[combined_file_name] = {
            "files": [],
            "raw_files": []
        };
    }
    
    combined_file = this.combined_files[combined_file_name];
        
    return combined_file;
};

CombineJs.prototype.addCompiler = function(file_extension, compiler_function) {
    this.compilers[file_extension] = compiler_function;
};

CombineJs.prototype.addFile = function(source_file_name, combined_file_name) {
    var self = this;
    
    this.trace('addFile', arguments);
    var combined_file = this.getCombinedFile(combined_file_name);
    if (path.extname(source_file_name).substr(1) === 'js') {
        combined_file.raw_files.push(source_file_name);
        combined_file.files.push(source_file_name);
    } else {
        combined_file.raw_files.push(source_file_name);
        /*
         * The file for a not .js file (so one which needs to be preprocessed)
         * is always combined_file_name + '/' + source_file_name.
         * 
         * So if we have /main.js and js/base/global.coffee it will result in
         * /main.js/js/base/global.coffee
         */
        var precompile_url = combined_file_name + '/' + source_file_name;
        combined_file.files.push(precompile_url);

        var relative_combined_folder = path.normalize(self.options.base_url + path.dirname(combined_file_name) + '/');
        
        new Controller(precompile_url, {
            "execute": function(params, context) {
                return function(cb) {
                    self.getCompiledFileContents(relative_combined_folder, source_file_name)(function(contents) {
                        context.headers['Content-Type'] = 'text/plain';
                        cb(contents);
                    });
                };
            }
        });
    }
    this.log('push');
};

CombineJs.prototype.getFromFileCache = function(source_file_name) {
    var self = this;
    
    return function(cb) {
        if (self.source_file_cache[source_file_name]) {
            cb(self.source_file_cache[source_file_name]);
        } else {
            var absolute_source_file_name = static_files_manager.getFileAbsolutePath(source_file_name);            
            fs.readFile(absolute_source_file_name, function(err, file_content) {
                file_content = file_content.toString();
                self.source_file_cache[source_file_name] = file_content;
                cb(file_content);
            });
        }
    };
};

CombineJs.prototype.getCompiledFileContents = function(relative_combined_folder, source_file_name) {
    var self = this;
    
    return function(cb) {
        self.getFromFileCache(source_file_name)(function(contents) {
            var file_extension = path.extname(source_file_name).substr(1);
            if (self.compilers[file_extension]) {
                self.compilers[file_extension](contents)(function(compiled_contents) {
                    cb(compiled_contents);
                });
            } else {
                self.error('getCompiledFileContents', 'Compiler ' + file_extension + ' not found!');
                cb();
            }
        });
    };
};

CombineJs.prototype.getCombinedFileContents = function(combined_file_name) {
    var self = this;
    
    if (typeof this.combined_files[combined_file_name] === 'undefined') {
        throw new Error('Combined file ' + combined_file_name + ' not found!');
    }

    var combined_file = this.combined_files[combined_file_name];
    var relative_combined_folder = path.normalize(self.options.base_url + path.dirname(combined_file_name) + '/');
    
    return function(cb) {
        var files_group = [];
        
        var file_contents = {};
        
        var combined_files = combined_file.raw_files;
        var combined_files_length = combined_files.length;
        for (var c = 0; c < combined_files_length; c++) {
            (function(source_file_name, needs_compiling) {
                files_group.push(function(chain_cb) {
                    /*
                     * No precompiling?
                     */
                    if (needs_compiling) {
                        self.getFromFileCache(source_file_name)(function(contents) {
                            self.log("gotFileFromCache", source_file_name, contents.length);
                            file_contents[source_file_name] = contents;
                            chain_cb();
                        });
                    } else {
                        /*
                         * Precompile!
                         */
                        self.getCompiledFileContents(relative_combined_folder, source_file_name)(function(contents) {
                            file_contents[source_file_name] = contents;
                            chain_cb();
                        });
                    }
                });
            })(combined_files[c], combined_file.raw_files[c] === combined_file.files[c]);
        }
        
        group.apply(this, files_group)(function() {
            var response = [];
            
            for (var c = 0; c < combined_files_length; c++) {
                response.push(file_contents[combined_files[c]]);
            }
            
            cb(response.join("\n\n"));
        });
    };
};

CombineJs.prototype.getHeader = function(combined_file_name) {
    this.log('getHeader', combined_file_name);
    if (typeof this.combined_files[combined_file_name] === 'undefined') {
        throw new Error('Combined file ' + combined_file_name + ' not found!');
    }

    var combined_file = this.combined_files[combined_file_name];
    
    var response = [];
    
    var files = [];
    
    /*
     * We need to combine it!
     */
    if (this.options.combine) {
        files.push(this.options.base_url + combined_file_name);
    } else {
        /*
         * Otherwise, we just need to return it.
         */
        var combined_files = combined_file.files;
        var combined_files_length = combined_files.length;
        for (var c = 0; c < combined_files_length; c++) {
            files.push(combined_files[c]);
        }
    }
    
    var files_length = files.length;
    
    for (var i = 0; i < files_length; i++) {
        response.push('<script type="text/javascript" src="');
        response.push(files[i]);
        response.push('"> </script>');
    }
    
    return response.join('');
};

