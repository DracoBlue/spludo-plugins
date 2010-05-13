/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");

new TestSuite("plugins.combine-css.getCombinedFileContents", {

    testingCombinedFile: function() {
        static_files_manager.addFile('css/test_css_file1.css', __dirname + '/test-data/test_css_file1.css');
        static_files_manager.addFile('css/test_css_file2.css', __dirname + '/test-data/test_css_file2.css');
        
        var test_combine_css =  new CombineCss({
            base_url: 'http://spludo.com/',
            compress: false,
            combine: true,
            minify: false
        });
        
        test_combine_css.addFile('static/css/test_css_file1.css', 'screenCombinedFile.css');
        test_combine_css.addFile('static/css/test_css_file2.css', 'screenCombinedFile.css');
        
//        equal('<link rel="stylesheet" type="text/css" href="http://spludo.com/screenCombinedFile.css" media="screen"/>', test_combine_css.getHeader('screenCombinedFile.css'));

        var real_contents = fs.readFileSync(__dirname + '/test-data/test_css_file1.css') + "\n\n" + fs.readFileSync(__dirname + '/test-data/test_css_file2.css');
        return function(cb) {
            test_combine_css.getCombinedFileContents("screenCombinedFile.css")(function(contents) {
                equal('<link rel="stylesheet" type="text/css" href="http://spludo.com/screenCombinedFile.css" media="screen"/>', test_combine_css.getHeader('screenCombinedFile.css'));
                static_files_manager.removeFile('css/test_css_file1.css');
                static_files_manager.removeFile('css/test_css_file2.css');
                equal(contents, real_contents);
                Logging.prototype.fatal(contents, real_contents);
                cb();
            });
        };
    }
});


new TestSuite("plugins.combine-css.Configuration", {
/*
    testingCombineOn: function() {
        static_files_manager.addFile('css/test_css_file1.css', __dirname + '/test-data/test_css_file1.css');
        static_files_manager.addFile('css/test_css_file2.css', __dirname + '/test-data/test_css_file2.css');
        
        var test_combine_css =  new CombineCss({
            base_url: 'http://spludo.com/',
            compress: false,
            combine: true,
            minify: false
        });
        
        test_combine_css.addFile('static/css/test_css_file1.css', 'screenCombineOn.css');
        test_combine_css.addFile('static/css/test_css_file2.css', 'screenCombineOn.css');
        
        equal('<link rel="stylesheet" type="text/css" href="http://spludo.com/screenCombineOn.css" media="screen"/>', test_combine_css.getHeader('screenCombineOn.css'));
        
        static_files_manager.removeFile('css/test_css_file1.css');
        static_files_manager.removeFile('css/test_css_file2.css');
    },

    testingCombineOff: function() {
        static_files_manager.addFile('css/test_css_file1.css', __dirname + '/test-data/test_css_file1.css');
        static_files_manager.addFile('css/test_css_file2.css', __dirname + '/test-data/test_css_file2.css');
        
        var test_combine_css =  new CombineCss({
            base_url: 'http://spludo.com/',
            compress: false,
            combine: false,
            minify: false
        });
        
        test_combine_css.addFile('static/css/test_css_file1.css', 'screenCombineOff.css');
        test_combine_css.addFile('static/css/test_css_file2.css', 'screenCombineOff.css');
        
        var expected_result = [
            '<link rel="stylesheet" type="text/css" href="static/css/test_css_file1.css" media="screen"/>',
            '<link rel="stylesheet" type="text/css" href="static/css/test_css_file2.css" media="screen"/>'
        ].join('');
        
        equal(expected_result, test_combine_css.getHeader('screenCombineOff.css'));
        
        static_files_manager.removeFile('css/test_css_file1.css');
        static_files_manager.removeFile('css/test_css_file2.css');
    }
  */  
});
