/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var crypto = require('crypto');
var mongodb = require('mongodb');
var mongodb_object_id = require('mongodb/bson/bson').ObjectID;

/**
 * @class The mongo db storage.
 * 
 * @since 0.1
 * @author DracoBlue
 */
MongoDbStorage = function(name, options) {
    var self = this;

    var database_name = options.database;
    var username = options.username;
    var password = options.password;
    var port = options.port || 27017;
    var host = options.host || '127.0.0.1';

    this.collection_name = options.collection;

    delete options.database;
    delete options.username;
    delete options.password;
    delete options.collection;
    delete options.port;
    delete options.host;
    
    this.setOptions(options);

    var database_connection = null;
    
    this.getDatabaseConnection = function() {
        return function(cb) {
            self.log("getDatabaseConnection ");
            if (database_connection === null) {
                var tmp_client = new mongodb.Db(database_name, new mongodb.Server(host, port, {auto_reconnect: true}, {}));
                tmp_client.open(function(){
                    self.log("copnnection open", database_name);
                    database_connection = tmp_client;
                    cb(database_connection);
                });
            } else {
                cb(database_connection);
            }
        };
    };
    
    this.closeDatabaseConnection = function() {
        return function(cb) {
            self.log("close!");
            if (database_connection) {
                database_connection.close(function() {
                    database_connection = null;
                    cb(true);
                });
            } else {
                cb(false);
            }
        };
    };
    
    storage_manager.addStorage(name, self);
};

extend(true, MongoDbStorage.prototype, Options.prototype, Logging.prototype);

MongoDbStorage.prototype.logging_prefix = 'MongoDbStorage';

MongoDbStorage.prototype.set = function(key, value) {
    var self = this;
    return function(cb) {
        self.log("set", key, value);
        key = self.calculateKey(key);
        self.getDatabaseConnection()(function(connection) {
            self.log("set has connection");
            connection.collection(self.collection_name, function(error, collection) {
                self.log("got collection", self.collection_name);
                if (error) {
                    cb(false);
                } else {
                    self.log("updating", self.collection_name, key.toHexString());
                    collection.save({_id: key, "value": value}, function(error, result) {
                        if (error) {
                            cb(false);
                        } else {
                            cb(true);
                        }
                    });
                }
            });
        });
    };
};

MongoDbStorage.prototype.get = function(key) {
    var self = this;
    return function(cb) {
        self.log("get", key);
        key = self.calculateKey(key);
        self.log("get calculated key", key);
        self.getDatabaseConnection()(function(connection) {
            connection.collection(self.collection_name, function(error, collection) {
                if (error) {
                    cb();
                } else {
                    collection.findOne(key,{"fields": ["value"]}, function(error, result) {
                        if (error) {
                            cb();
                        } else {
                            if (result && result.value) {
                                cb(result.value);
                            } else {
                                cb();
                            }
                        }
                    });
                }
            });
        });
    };
};

MongoDbStorage.prototype.has = function(key) {
    var self = this;
    
    return function(cb) {
        self.get(key)(function(value) {
            cb((typeof value === 'undefined') ? false : true);
        });
    };
};

MongoDbStorage.prototype.remove = function(key) {
    var self = this;
    return function(cb) {
        self.log("remove", key);
        key = self.calculateKey(key);
        self.getDatabaseConnection()(function(connection) {
            self.log("remove has connection");
            connection.collection(self.collection_name, function(error, collection) {
                self.log("got collection", self.collection_name);
                if (error) {
                    cb(false);
                } else {
                    self.log("removing", self.collection_name, key.toHexString());
                    collection.remove({"_id":key}, function(error, result) {
                        if (error) {
                            cb(false);
                        } else {
                            cb(true);
                        }
                    });
                }
            });
        });
    };
};

MongoDbStorage.prototype.calculateKey = function(long_key) {
    this.log('calculateKey', long_key);
    long_key = crypto.createHmac("md5",String(long_key)).digest("binary").substr(0, 12);
    return new mongodb_object_id(long_key);
};

/**
 * Shutdown the storage
 */
MongoDbStorage.prototype.shutdown = function() {
    var self = this;
    
    return function(cb) {
        self.log("shutdown");
        self.closeDatabaseConnection()(function() {
            cb();
        });
    };
};
