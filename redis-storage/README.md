RedisStorage for Spludo
==========================

This small plugin enables the possibility to use a redis database as storage
for the spludo framework.

To make this extension work, you need
[redis-node-client][redis-node-client-website] library by fictorial, which is
released under the MIT License.

  [redis-node-client-website]: http://github.com/fictorial/redis-node-client


Installation:
--------------

After putting the entire contents of the redis-storage plugin into a single
folder in your applications plugins folder, it may look like this:

    myapp/
        plugins/
            redis-storage/
                README.md
                lib/
                    index.js
                    RedisStorage.js
                tests/
                    redis-tests.js

Now please download the redis-node-client plugin from the 
[redis-node-client website][redis-node-client-website]. Put the redis-client.js
into your `plugins/redis-storage/lib` folder. The `redis-storage` folder will
look like this now:

    myapp/
        plugins/
            redis-storage/
                README.md
                lib/
                    index.js
                    RedisStorage.js
                    redis-client.js
                tests/
                    redis-tests.js


Example:
---------

    var redis_storage = new RedisStorage("test_redis_db", {
        "host": "127.0.0.1",
        "port": "6379",
        "database": "0"
    });

    redis_storage.set("hans", "da")(function(was_working) {
        // data set!
    });

For more information on storage engines please check the [spludo page about
storage engines][userguide-storage].

  [userguide-storage]: http://spludo.com/user-guide/storage/
    