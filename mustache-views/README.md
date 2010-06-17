Mustache-Views for Spludo
==========================

This small plugin enables the possibility to use `*.mu` file extensions in
the views folder of a plugin or the application and parse it as mustache text.

When executing the `mustache` file, `context` is the context object. There is
also an additional `context.inner` set, which contains `inner`'s content.

This extension uses the [Mu][mu-website] library by raycmorgan *installed*,
which is released under the MIT open source license.

  [mu-website]: http://github.com/raycmorgan/Mu

Installation:
--------------

After putting the entire contents of the mustache-views plugin into a single
folder in your applications plugins folder, it may look like this:

    myapp/
        plugins/
            mustache-views/
                README.md
                lib/
                    index.js
                    MustacheView.js

Now please download the mu plugin from the 
[mu website][mu-website]. Put all contents into your
`plugins/mustache-views/lib` folder. The `mustache-views` folder will look like this
now:

    mustache-views/
        README.md
        lib/
            index.js
            mu.js
            MustacheView.js
            mu/
                compiler.js
                parser.js
                preprocessor.js

Example:
-------------------
 
Create a files called `views/MustacheTest.mu`:

    <h1>Members</h1>
    <h2>Profile of {{first_name}}</h2>

    {{first_name}} is {{age}} years old.
        
    {{#in_team}}
    Part of the team. Email at {{email}}
    {{/in_team}}

Create a controller in `controllers/main-controllers.js`:

    new Controller('hello', {
        "execute": function(params, context) {
            return function(cb) {
                context.view_name = 'HamlTest';
                
                context.first_name = "alice";
                context.age = 24;
                context.in_team = true;
                context.email = 'alice@example.org';
                
                cb();
            }
        }
    });
      
Now open your browser at the location `/hello` and you'll get the entire mustache
as html and with the locals replaced.

    <h1>Members</h1>
    <h2>Profile of alice</h2>
    
    Alice is 24 years old.
    
    Part of the team. Email at alice@example.org
