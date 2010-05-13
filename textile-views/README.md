Textile-Views for Spludo
==========================

This small plugin enables the possibility to use `*.textile` file extensions in
the views folder of a plugin or the application and parse it as textile text.

This extension uses the [textile.js][textile-js] library by ben-daglish,
which is released under a "do what you like with it" license.

  [textile-js]: http://www.ben-daglish.net/textile.shtml
  [textism]: http://textism.com/tools/textile/?sample=2
  
Example:
-------------------

Create a files called `views/TextileTest.textile` (sample from [textism]):

    h2{color:green}. This is a title
    
    h3. This is a subhead
    
    p{color:red}. This is some text of dubious character. Isn't the use of "quotes" just lazy writing -- and theft of 'intellectual property' besides? I think the time has come to see a block quote.
    
    Simple list:
    
    # one
    # two
    # three
    

Create a controller in `controllers/main-controllers.js`:

    new Controller('hello', {
        "execute": function(params, context) {
            return function(cb) {
                context.view_name = 'TextileTest';
                cb();
            }
        }
    });
      
Now open your browser at the location `/hello` and you'll get everything as
nice html code:

    <h2 style="color:green;">This is a title</h2>

    <h3>This is a subhead</h3>
    
    <p style="color:red;">This is some text of dubious character. Isn&#8217;t
    the use of &#8220;quotes&#8221; just lazy writing &#8212; and theft of
    &#8217;intellectual property&#8217; besides? I think the time has come to
    see a block quote.</p>
    
    <p>Simple list:</p>
    
    <ol>
        <li>one</li>
        <li>two</li>
        <li>three</li>
    </ol>
