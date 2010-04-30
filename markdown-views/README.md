Markdown-Views for Spludo
==========================

This small plugin enables the possibility to use `*.md` file extensions in the
views folder of a plugin or the application and parse it as markdown text.

This extension uses the [Showdown.js][showdown-website] library by attacklab,
which is released under a BSD-style open source license.

  [showdown-website]: http://attacklab.net/showdown/

  
Example:
-------------------

Create a files called `views/MdTest.md`:

    Level1 Heading!
    ==========================
    
    - This
    - is
    - helpful!
    
    The very first [spludo][spludo-website]-plugin ever has rendered this
    content! It was supported by the awesome
    [Showdown.js][showdown-website] library by attacklab
    
      [spludo-website]: http://spludo.com/
      [showdown-website]: http://attacklab.net/showdown/

Create a controller in `controllers/main-controllers.js`:

    new Controller('hello', {
        "execute": function(params, context) {
            return function(cb) {
                context.view_name = 'MdTest';
                cb();
            }
        }
    });
      
Now open your browser at the location `/hello` and you'll get a nice `h1`,
some `li` within an `ul` and of course the links to spludo and the showdown
release.