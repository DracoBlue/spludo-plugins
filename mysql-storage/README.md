MysqlStorage for Spludo
==========================

This small plugin enables the possibility to use a mysql database as storage
for the spludo framework.

To make this extension work, you need [node-mysql][node-mysql-website]
library by masuidrive, which is released under the MIT open source license.

  [node-mysql-website]: http://github.com/masuidrive/node-mysql


Installation:
--------------

After putting the entire contents of the mysql-storage plugin into a single
folder in your applications plugins folder, it may look like this:

    myapp/
        plugins/
            mysql-storage/
                README.md
                lib/
                    index.js
                    MysqlStorage.js
                tests/
                    mysql-tests.js

Now please download the node-mysql plugin from the 
[node-mysql website][node-mysql-website]. Put all contents into your
`plugins/mysql-storage/lib` folder. The `mysql-storage` folder will look like this
now:

    mysql-storage/
        README.md
        lib/
            index.js
            mysql.js
            MysqlStorage.js
            mysql/
                auth.js
                charset.js
                connection.js
                constants.js
                ...
        tests/
            mysql-tests.js


Example:
---------

    var mysql_storage = new MysqlStorage("test_mysql_db", {
        "host": "127.0.0.1",
        "port": 3306,
        "table": "sessions",
        "username": "nodejs_test",
        "password": "thisisnotmypassword",
        "database": "nodejs_test"
    });

    mysql_storage.set("hans", "da")(function(was_working) {
        // data set!
    });

For more information on storage engines please check the [spludo page about
storage engines][userguide-storage].

  [userguide-storage]: http://spludo.com/user-guide/storage/
    