/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
var sys = require("sys");

var mu = require("mu");

/**
 * @class A MustacheView, which reads a template file and executes it.
 * 
 * @param {String}
 *            name
 * @param {String}
 *            content_file
 * @param {String}
 *            [encoding="utf8"]
 * @since 0.1
 * @author DracoBlue
 */
MustacheView = function(name, content_file, encoding) {
    encoding = encoding || "utf8";
    
    var view = this;
    this.content_file = content_file;

    var file_content = "";

    try {
        file_content = fs.readFileSync(content_file, encoding);
    } catch (e) {
        throw new Error("Cannot read Mustache-File at " + content_file);
    }
    
    view.content = file_content;
    
    view.mustache_content_compiled = mu.compileText(file_content);
    
    view_manager.addView(name, view);
};

MustacheView.prototype.render = function(params, context, inner) {
    var self = this;
    return function(cb) {
        var mu_context = {};
        extend(true, mu_context, context);
        mu_context.inner = inner;
        
        var body = [];
        var compiler = self.mustache_content_compiled(mu_context);
        compiler.addListener('data', function (c) {
            body.push(c);
        });
        compiler.addListener('end', function() {
            cb(body.join(""));
        });
    };
};
