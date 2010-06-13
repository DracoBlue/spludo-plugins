/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
var sys = require("sys");
require("./../lib/MysqlStorage");

new TestSuite("plugins.mysql-storage.MysqlStorage", {

    testingUsualStorageFunctions: function() {
        var mysql_storage = new MysqlStorage("test_mysql_db", {
            "host": "127.0.0.1",
            "port": 3306,
            "table": "sessions",
            "username": "nodejs_test",
            "password": "CfqLvssdXmN6VuPx",
            "database": "nodejs_test"
        });

        return function(cb) {
            mysql_storage.set("hans", "da")(function(was_working) {
                equal(was_working, true, "It can be set");
                mysql_storage.get("hans")(function(value) {
                    equal(value, "da", "It is returned now");
                    mysql_storage.has("hans")(function(value) {
                        equal(value, true, "It is available now");
                        mysql_storage.remove("hans")(function(value) {
                            equal(value, true, "It can be removed");
                            mysql_storage.has("hans")(function(value) {
                                equal(value, false, "It is not available now");
                                cb();
                            });
                        });
                    });
                });
            });
        };
    },
    
    testingPerformance: function() {
        var mysql_storage = new MysqlStorage("performance_test_mysql_db", {
            "host": "127.0.0.1",
            "port": 3306,
            "table": "sessions",
            "username": "nodejs_test",
            "password": "CfqLvssdXmN6VuPx",
            "database": "nodejs_test"
        });

        return function(cb) {
            mysql_storage.set("hans", "da")(function(was_working) {
                var now = new Date();
                sys.debug("start" + now + ':' + (now.getSeconds() + now.getMilliseconds()/1000));

                var request_chain = [];
                for (var i=0; i < 10000; i++) {
                    request_chain.push(function(chain_cb) {
                        mysql_storage.get("hans")(function(value) {
                            chain_cb();
                        });
                    })
                }
                
                group.apply(this, request_chain)(function() {
                    var now = new Date();
                    sys.debug("finish" + now + ':' + (now.getSeconds() + now.getMilliseconds()/1000));
                    cb();
                });
            });
        };
    }
});
