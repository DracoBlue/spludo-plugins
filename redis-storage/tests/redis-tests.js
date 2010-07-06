/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

var fs = require("fs");
var sys = require("sys");
require("./../lib/RedisStorage");

new TestSuite("plugins.redisdb-storage.RedisStorage", {

    testingUsualStorageFunctions: function() {
        var redis_storage = new RedisStorage("test_redis_db", {
            "host": "127.0.0.1",
            "port": "8096",
            "database": "0"
        });

        sys.debug("asdasdas" + sys.inspect(["connection"]));
        
        return function(cb) {
            redis_storage.set("hans", "da")(function(was_working) {
                equal(was_working, true, "It can be set");
                redis_storage.get("hans")(function(value) {
                    equal(value, "da", "It is returned now");
                    redis_storage.has("hans")(function(value) {
                        equal(value, true, "It is available now");
                        redis_storage.remove("hans")(function(value) {
                            equal(value, true, "It can be removed");
                            redis_storage.has("hans")(function(value) {
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
        var redis_storage = new RedisStorage("performance_test_redis_db", {
            "host": "127.0.0.1",
            "port": "8096",
            "database": "0"
        });

        return function(cb) {
            redis_storage.set("hans", "da")(function(was_working) {
                var now = new Date();
                sys.debug("redis start" + now + ':' + (now.getSeconds() + now.getMilliseconds()/1000));

                var request_chain = [];
                for (var i=0; i < 10000; i++) {
                    request_chain.push(function(chain_cb) {
                        redis_storage.get("hans")(function(value) {
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
