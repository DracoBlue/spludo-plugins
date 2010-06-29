Auth for Spludo
================

This small plugin enables the /login and /logout route for spludo. It uses
the configured `user_manager` engine and checks whether the login is valid
or not.

Example:
-------------------

Download the [json-file-user-manager][json-file-user-manager-plugin] plugin
and install it (by putting the entire folder in your plugins folder).

  [json-file-user-manager-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/json-file-user-manager/

Add this to your (`local.`)`config.js`:

    config.setValues({
        "auth": {
            "user_manager_engine": "JsonFileUserManager",
            "user_manager_engine_options": {
                "file_name": __dirname + '/etc/users.json'
            }
        }
    });

Now create a file at `etc/users.json`:

    [
        {
            "id": 1,
            "login": "admin",
            "password": "1234",
            "properties": {
                "first_name": "Alice"
            }
        }
    ]

Now open your browser at the location `/login` and you'll get a nice login,
where you can auth by using admin:1234 as login.