/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
/**
 * @class A UserManager which uses just one single json file to store all
 *        accounts.
 * 
 * @extends Logging
 * 
 * @since 0.1
 * @author DracoBlue
 */
JsonFileUserManager = function(options) {
    this.trace('JsonFileUserManager', arguments);
    if (typeof options.file_name === "undefined") {
        throw new Error('The required option file_name is not set!');
    }
    
    this.file_name = options.file_name;
    this.data = JSON.parse(fs.readFileSync(this.file_name).toString());
};

extend(true, JsonFileUserManager.prototype, Logging.prototype);

JsonFileUserManager.prototype.logging_prefix = 'JsonFileUserManager';

JsonFileUserManager.prototype.checkLogin = function(username, password) {
    var self = this;
    
    this.trace('checkLogin', arguments);
    return function(cb) {
        var data = self.data;
        var data_length = data.length;
        
        for (var i = 0; i < data_length; i++) {
            var user = data[i];
            if (user.login === username && user.password === password) {
                cb(true, user.id, user.properties || {});
                return ;
            }
        }
        
        cb(false);
    };
};