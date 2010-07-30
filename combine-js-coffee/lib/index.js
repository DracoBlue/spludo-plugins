var coffee_script = require("./coffee-script/lib/coffee-script");

bootstrap_manager.whenReady(["plugin.combine-js"], function() {
    combine_js.addCompiler('coffee', function(file_contents) {
        return function(cb) {
            var compiled_file_contents = coffee_script.compile(file_contents);
            cb(compiled_file_contents);
        };
    });
});
