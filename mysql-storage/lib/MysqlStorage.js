/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var crypto = require('crypto');
var mysql = require('mysql');

/**
 * @class The memory storage.
 * 
 * @since 0.1
 * @author DracoBlue
 */
MysqlStorage = function(name, options) {
    var self = this;

    var database_name = options.database;
    var username = options.username;
    var password = options.password;
    var port = options.port || 3306;
    var host = options.host || 'localhost';

    this.table_name = options.table;

    delete options.database;
    delete options.username;
    delete options.password;
    delete options.table;
    delete options.port;
    delete options.host;
    
    this.setOptions(options);

    var database_connection = null;
    
    this.getDatabaseConnection = function() {
        return function(cb) {
            self.log("getDatabaseConnection ");
            if (database_connection === null) {
                var tmp_client = new mysql.Connection(host, username, password, database_name, port);
                tmp_client.connect(function(){
                    /*
                     * Success!
                     */
                    self.log("connection open", database_name);
                    database_connection = tmp_client;
                    cb(database_connection);
                }, function() {
                    /*
                     * Error!
                     */
                    self.log("connection failed", database_name);
                    cb(null);
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

extend(true, MysqlStorage.prototype, Options.prototype, Logging.prototype);

MysqlStorage.prototype.logging_prefix = 'MysqlStorage';

MysqlStorage.prototype.set = function(key, value) {
    var self = this;
    return function(cb) {
        self.log("set", key, value);
        self.getDatabaseConnection()(function(connection) {
            self.log("set has connection");
            self.log("updating", self.table_name, key);
            var sql_query = "REPLACE INTO " + self.table_name + " (`key`,`value`) VALUES ('" + key + "', '" + value + "');";
            connection.query(sql_query, function() {
                /*
                 * Success!
                 */
                cb(true);
            }, function() {
                /*
                 * Error!
                 */
                cb(false);
            });
        });
    };
};

MysqlStorage.prototype.get = function(key) {
    var self = this;
    return function(cb) {
        self.log("get", key);
        self.getDatabaseConnection()(function(connection) {
            var sql_query = "SELECT `value` FROM " + self.table_name + " WHERE `key` = '" + key + "';";
            connection.query(sql_query, function(result) {
                /*
                 * Success!
                 */
                if (result.records.length) {
                    cb(result.records[0][0]);
                } else {
                    cb();
                }
            }, function() {
                /*
                 * Error!
                 */
                self.error('error when executing sql query: ' + sql_query);
                cb();
            });
        });
    };
};

MysqlStorage.prototype.has = function(key) {
    var self = this;
    
    return function(cb) {
        self.get(key)(function(value) {
            cb((typeof value === 'undefined') ? false : true);
        });
    };
};

MysqlStorage.prototype.remove = function(key) {
    var self = this;
    return function(cb) {
        self.log("remove", key);
        self.getDatabaseConnection()(function(connection) {
            self.log("remove has connection");
            self.log("removing", self.table_name, key);
            var sql_query = "DELETE FROM " + self.table_name + " WHERE `key` = '" + key + "';";
            connection.query(sql_query, function() {
                /*
                 * Success!
                 */
                cb(true);
            }, function() {
                /*
                 * Error!
                 */
                self.error('error when executing sql query: ' + sql_query);
                cb(false);
            });
        });
    };
};

/**
 * Shutdown the storage
 */
MysqlStorage.prototype.shutdown = function() {
    var self = this;
    
    return function(cb) {
        self.log("shutdown");
        self.closeDatabaseConnection()(function() {
            cb();
        });
    };
};
