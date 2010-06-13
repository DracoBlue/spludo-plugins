/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
var sys = require("sys");
require("./../lib/MongoDbStorage");

new TestSuite("plugins.mongodb-storage.MongoDbStorage", {

    testingUsualStorageFunctions: function() {
        var mongo_storage = new MongoDbStorage("test_mongo_db", {
            "host": "127.0.0.1",
            "port": "8089",
            "collection": "sessions",
            "database": "nodejs_test"
        });

        sys.debug("asdasdas" + sys.inspect(["connection"]));
        
        return function(cb) {
            mongo_storage.set("hans", "da")(function(was_working) {
                equal(was_working, true, "It can be set");
                mongo_storage.get("hans")(function(value) {
                    equal(value, "da", "It is returned now");
                    mongo_storage.has("hans")(function(value) {
                        equal(value, true, "It is available now");
                        mongo_storage.remove("hans")(function(value) {
                            equal(value, true, "It can be removed");
                            mongo_storage.has("hans")(function(value) {
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
        var mongo_storage = new MongoDbStorage("performance_test_mongo_db", {
            "host": "127.0.0.1",
            "port": "8089",
            "collection": "sessions",
            "database": "nodejs_test"
        });

        return function(cb) {
            mongo_storage.set("hans", "da")(function(was_working) {
                var now = new Date();
                sys.debug("start" + now + ':' + (now.getSeconds() + now.getMilliseconds()/1000));

                var request_chain = [];
                for (var i=0; i < 10000; i++) {
                    request_chain.push(function(chain_cb) {
                        mongo_storage.get("hans")(function(value) {
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
