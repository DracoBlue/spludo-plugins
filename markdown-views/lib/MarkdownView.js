/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
var sys = require("sys");

require("Showdown");

var markdown_views_converter = new Showdown.converter();
    
/**
 * @class A MarkdownView, which reads a template file and executes it.
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
MarkdownView = function(name, content_file, encoding) {
    encoding = encoding || "utf8";
    
    var view = this;
    this.content_file = content_file;

    var file_content = "";

    
    try {
        file_content = fs.readFileSync(content_file, encoding);
    } catch (e) {
        throw new Error("Cannot read Markdown-File at " + content_file);
    }
    
    view.content = file_content;
    
    view_manager.addView(name, view);
};

var markdown_view_format = {};

MarkdownView.prototype.render = function(params, context, inner) {
    var file_name = this.content_file;
    
    if (typeof markdown_view_format[file_name] === "undefined") {

        var content = this.content;

        try {
            markdown_view_format[file_name] = markdown_views_converter.makeHtml(this.content);
        } catch (e) {
            throw new Error("Syntax Error in .markdown-File: " + e.message, file_name, 0);
        }
    }

    return function(cb) {
        cb(markdown_view_format[file_name]);
    };
};
