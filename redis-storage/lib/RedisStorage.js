/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var crypto = require('crypto');
var redis_client = require("../lib/redis-client");

/**
 * @class The redis db storage.
 * 
 * @since 0.1
 * @author DracoBlue
 */
RedisStorage = function(name, options) {
    var self = this;

    var port = options.port || 27017;
    var host = options.host || '127.0.0.1';
    var client_options = options.client_options || {};
    var database = options.database || "0";
    
    this.collection_name = options.collection;

    delete options.port;
    delete options.host;
    delete options.connection_options;
    
    this.setOptions(options);

    var database_connection = null;
    
    this.getDatabaseConnection = function() {
        return function(cb) {
            self.log("getDatabaseConnection ");
            if (database_connection === null) {
                database_connection = redis_client.createClient(port, host, client_options);
                database_connection.select(database);
                cb(database_connection);
            } else {
                cb(database_connection);
            }
        };
    };
    
    this.closeDatabaseConnection = function() {
        return function(cb) {
            self.log("close!");
            if (database_connection) {
                database_connection.close();
                database_connection = null;
                cb(true);
            } else {
                cb(false);
            }
        };
    };
    
    storage_manager.addStorage(name, self);
};

extend(true, RedisStorage.prototype, Options.prototype, Logging.prototype);

RedisStorage.prototype.logging_prefix = 'RedisStorage';

RedisStorage.prototype.set = function(key, value) {
    var self = this;
    return function(cb) {
        self.log("set", key, value);
        self.getDatabaseConnection()(function(connection) {
            self.log("set has connection");
            connection.set(key, value, function (error) {
                if (error) {
                    cb(false);
                } else {
                    self.log("updated", key);
                    cb(true);
                }
            });
        });
    };
};

RedisStorage.prototype.get = function(key) {
    var self = this;
    return function(cb) {
        self.log("get", key);
        self.getDatabaseConnection()(function(connection) {
            self.log("get has connection");
            connection.get(key, function (error, value) {
                if (error || value === null) {
                    cb();
                } else {
                    self.log("received", key, value.toString());
                    cb(value);
                }
            });
        });
    };
};

RedisStorage.prototype.has = function(key) {
    var self = this;
    
    return function(cb) {
        self.get(key)(function(value) {
            cb((typeof value === 'undefined') ? false : true);
        });
    };
};

RedisStorage.prototype.remove = function(key) {
    var self = this;
    return function(cb) {
        self.log("remove", key);
        self.getDatabaseConnection()(function(connection) {
            self.log("del has connection");
            connection.del(key, function (error) {
                if (error) {
                    cb(false);
                } else {
                    self.log("deleted", key);
                    cb(true);
                }
            });
        });
    };
};

/**
 * Shutdown the storage
 */
RedisStorage.prototype.shutdown = function() {
    var self = this;
    
    return function(cb) {
        self.log("shutdown");
        self.closeDatabaseConnection()(function() {
            cb();
        });
    };
};
