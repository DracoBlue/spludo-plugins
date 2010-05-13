/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

/**
 * @class A combine tool for css file available for the spludo framework.
 * 
 * @since 0.1 
 * @author DracoBlue
 */
CombineCss = function(options) {
    this.setOptions(options);
    
    if (!this.options.base_url) {
        throw new Error('Please configure combine_css.base_url in your (local.)config.js!');
    }

    this.combined_files = {};
    this.source_file_cache = {};
    
    this.compilers = {};
};

extend(true, CombineCss.prototype, Options.prototype, Logging.prototype);

var fs = require("fs");
var path = require('path');


CombineCss.prototype.getCombinedFile = function(combined_file_name, media_type) {
    this.log('getCombinedFile', combined_file_name, media_type);
    var self = this;

    media_type = media_type || "screen";
    
    var combined_file = null;
    
    if (typeof this.combined_files[combined_file_name] === 'undefined') {
        new Controller(combined_file_name, {
            "execute": function(params, context) {
                return function(cb) {
                    self.getCombinedFileContents(combined_file_name)(function(contents) {
                        context.headers['Content-Type'] = 'text/css';
                        cb(contents);
                    });
                };
            }
        }); 
        this.combined_files[combined_file_name] = {
            "files": [],
            "raw_files": [],
            "media_type": media_type
        };
    }
    
    combined_file = this.combined_files[combined_file_name];
        
    if (combined_file.media_type !== media_type) {
        throw new Error('The combined_file is already ' + combined_file.media_type + ', but you are trying to change it to' + media_type);
    }
    
    return combined_file;
};

CombineCss.prototype.addCompiler = function(file_extension, compiler_function) {
    this.compilers[file_extension] = compiler_function;
};

CombineCss.prototype.addFile = function(source_file_name, combined_file_name, media_type) {
    var self = this;
    
    this.log('addFile', combined_file_name, this.combined_files);
    var combined_file = this.getCombinedFile(combined_file_name, media_type);
    if (path.extname(source_file_name).substr(1) === 'css') {
        combined_file.raw_files.push(source_file_name);
        combined_file.files.push(source_file_name);
    } else {
        combined_file.raw_files.push(source_file_name);
        /*
         * The file for a not .css file (so one which needs to be preprocessed)
         * is always combined_file_name + '/' + source_file_name.
         * 
         * So if we have /screen.css and css/base/global.sass it will result in
         * /screen.css/css/base/global.sass
         */
        var precompile_url = combined_file_name + '/' + source_file_name;
        combined_file.files.push(precompile_url);

        var relative_combined_folder = path.normalize(self.options.base_url + path.dirname(combined_file_name) + '/');
        
        new Controller(precompile_url, {
            "execute": function(params, context) {
                return function(cb) {
                    self.getCompiledFileContents(relative_combined_folder, source_file_name)(function(contents) {
                        context.headers['Content-Type'] = 'text/css';
                        cb(contents);
                    });
                };
            }
        });
    }
    this.log('push');
};

CombineCss.prototype.getFromFileCache = function(source_file_name) {
    var self = this;
    
    return function(cb) {
        if (self.source_file_cache[source_file_name]) {
            cb(self.source_file_cache[source_file_name]);
        } else {
            var absolute_source_file_name = static_files_manager.getFileAbsolutePath(source_file_name);            
            fs.readFile(absolute_source_file_name, function(err, file_content) {
                self.source_file_cache[source_file_name] = file_content;
                cb(file_content);
            });
        }
    };
};

CombineCss.prototype.getCompiledFileContents = function(relative_combined_folder, source_file_name) {
    var self = this;
    
    return function(cb) {
        self.getFromFileCache(source_file_name)(function(contents) {
            var file_extension = path.extname(source_file_name).substr(1);
            if (self.compilers[file_extension]) {
                self.compilers[file_extension](contents)(function(compiled_contents) {
                    cb(self.fixUrls(relative_combined_folder, source_file_name, compiled_contents));
                });
            } else {
                self.error('getCompiledFileContents', 'Compiler ' + file_extension + ' not found!');
                cb();
            }
        });
    };
};

CombineCss.prototype.fixUrls =  function(relative_combined_folder, relative_file_name, file_contents) {
    var relative_file_folder = path.normalize(this.options.base_url + path.dirname(relative_file_name) + '/');
    if (relative_file_folder.indexOf(relative_combined_folder) !== 0) {
        throw new Error('The combined folder must be the base url.');
    }
    
    var to_relative_folder = relative_file_folder.substr(relative_combined_folder.length - 1);
    
    file_contents = file_contents.replace(/url\(\"/g,"url(\"" + to_relative_folder);
    file_contents = file_contents.replace(/url\(\'/g,"url('" + to_relative_folder);
    file_contents = file_contents.replace(/url\(\.\//g,"url(");
    file_contents = file_contents.replace(/url\(([^\'\"])/g,"url(" + to_relative_folder + "$1");
    
    return file_contents;
};

CombineCss.prototype.getCombinedFileContents = function(combined_file_name) {
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
                            file_contents[source_file_name] = self.fixUrls(relative_combined_folder, source_file_name, contents);
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

CombineCss.prototype.getHeader = function(combined_file_name) {
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
        response.push('<link rel="stylesheet" type="text/css" href="');
        response.push(files[i]);
        response.push('" media="' + combined_file.media_type + '"/>');
    }
    
    return response.join('');
};

