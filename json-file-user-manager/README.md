JsonFileUserManager for Spludo
===============================

This is a user manager engine implemented by using a .json file as only
resource to load and store the users.

Example:
-------------------

You may download/install the [auth][auth-plugin] plugin and configure it like this.

  [auth-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/auth/

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