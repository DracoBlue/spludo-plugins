/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
var sys = require("sys");

var haml = require("haml");

/**
 * @class A HamlView, which reads a template file and executes it.
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
HamlView = function(name, content_file, encoding) {
    encoding = encoding || "utf8";
    
    var view = this;
    this.content_file = content_file;

    var file_content = "";

    
    try {
        file_content = fs.readFileSync(content_file, encoding);
    } catch (e) {
        throw new Error("Cannot read Haml-File at " + content_file);
    }
    
    view.content = file_content;
    
    view.haml_content_compiled = haml(file_content);
    
    view_manager.addView(name, view);
};

HamlView.prototype.render = function(params, context, inner) {
    var self = this;
    return function(cb) {
        cb(self.haml_content_compiled.call(context, { params: params, inner: inner}));
    };
};
