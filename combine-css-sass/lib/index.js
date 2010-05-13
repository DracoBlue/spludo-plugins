var sass = require("./sass");

bootstrap_manager.whenReady(["plugin.combine-css"], function() {
    combine_css.addCompiler('sass', function(file_contents) {
        return function(cb) {
            var compiled_file_contents = sass.render(file_contents, {
                cache: false
            });
            cb(compiled_file_contents);
        };
    });
});
