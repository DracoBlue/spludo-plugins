Haml-Views for Spludo
==========================

This small plugin enables the possibility to use `*.haml` file extensions in
the views folder of a plugin or the application and parse it as haml text.

When executing the `haml` file, `context` is the `this` object. There are also
the local variables for `inner` and `params` defined.

This extension uses the [haml-js][haml-js-website] library by creationix,
which is released under the MIT open source license.

  [haml-js-website]: http://github.com/creationix/haml-js

  
Example:
-------------------

 
Create a files called `views/HamlTest.haml`:

    %h1 Members
    
    %h2= "Profile of " + this.first_name
    
    .profile
      .left.column
        #first_name= this.first_name
        #age= this.age
      .right.column
        #description= this.email

Create a controller in `controllers/main-controllers.js`:

    new Controller('hello', {
        "execute": function(params, context) {
            return function(cb) {
                context.view_name = 'HamlTest';
                
                context.first_name = "alice";
                context.age = 24;
                context.email = 'alice@example.org';
                
                cb();
            }
        }
    });
      
Now open your browser at the location `/hello` and you'll get the entire haml
as html and with the locals replaced.

    <h1>Members</h1>
    <h2>Profile of alice</h2>
    <div class="profile">
        <div class="left column">
            <div id="first_name">alice</div>
            <div id="age">24</div>
        </div>
        <div class="right column">
            <div id="description">alice@example.org</div>
        </div>
    </div>