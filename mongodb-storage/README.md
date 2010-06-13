MongodbStorage for Spludo
==========================

This small plugin enables the possibility to use a mongodb database as storage
for the spludo framework.

To make this extension work, you need
[node-mongodb-native][mongodb-native-website] library by christkv, which is
released under the Apache License, Version 2.0.

  [mongodb-native-website]: http://github.com/christkv/node-mongodb-native


Installation:
--------------

After putting the entire contents of the mongodb-storage plugin into a single
folder in your applications plugins folder, it may look like this:

    myapp/
        plugins/
            mongodb-storage/
                README.md
                lib/
                    index.js
                    MongodbStorage.js
                tests/
                    mongodb-tests.js

Now please download the node-mongodb-native plugin from the 
[node-mongodb-native website][mongodb-native-website]. Put all contents into your
`plugins/mongodb-storage/lib` folder. The `mongodb-storage` folder will look like this
now:

    mongodb-storage/
        README.md
        lib/
            index.js
            MongodbStorage.js
            mongodb/
                bjson/
                commands/
                ...
                admin.js
                collection.js
                ...
        tests/
            mongodb-tests.js

Example:
---------

    var mongodb_storage = new MongoDbStorage("test_mongo_db", {
        "host": "127.0.0.1",
        "port": "8089",
        "collection": "sessions",
        "database": "nodejs_test"
    });

    mongodb_storage.set("hans", "da")(function(was_working) {
        // data set!
    });

For more information on storage engines please check the [spludo page about
storage engines][userguide-storage].

  [userguide-storage]: http://spludo.com/user-guide/storage/
    