CoffeeScript for Spludo's CombineJs
=====================

This plugin is a small plugin which allows the usage of .coffee files with the
[combine-js plugin] [combine-js-plugin]. It uses the [coffeescript] library by
[jashkenas].

  [combine-js-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/combine-js/
  [jashkenas]: http://github.com/jashkenas
  [coffeescript]: http://jashkenas.github.com/coffee-script/

Installation:
--------------

After putting the entire contents of the combine-js-coffee plugin into a single
folder in your applications plugins folder, it may look like this:

    myapp/
        plugins/
            combine-js-coffee/
                README.md
                lib/
                    index.js

Now please download the  plugin from the 
[coffee script website][coffeescript]. Put all contents into your
`plugins/combine-js-coffee/lib` folder. The `combine-js-coffee` folder will look like this
now:

    combine-js-coffee/
        README.md
        lib/
            index.js
            coffee-script
                Cakefile
                index.html
                LICENSE
                package.json
                ...
                
Example:
-------------------

Configure the plugin in your `myapp/lib/index.js`:

    config.setValues({
        "combine_js": {
            "base_url": "http://example.org/",
            "combine": true
        }
    });

Create a file called `myapp/lib/index.js` or append to the existing one.

    combine_js.addFile('static/base.js', 'main.js');
    combine_js.addFile('static/screen/global.coffee', 'main.js');
    combine_js.addFile('static/screen/player.coffee', 'main.js');

As you can see, the files `global.coffee` and `media.coffee` are added to the
combined `main.js`.

If you want to generate the header includes for the js files now, you can
easily use the following lines:

    <%= combine_js.getHeader('main.js') %>

You should put that into the `<head>`-section of your `HtmlLayout`.

Out-of-the-box it will work like a charm and generate a `<script>`-tag.
    
    // Example Output for combine_js.getHeaders('main.js') with
    // default options
    <script type="text/javascript" src="main.js"> </script>

You can now open http://example.org/main.js and see your
generated js file.
    
## Development Mode

But when you are in a development environment, you may not want to generate the
minimized, compressed and merged js file. Instead you want the single files.

    config.setValues({
        "combine_js": {
            combine: false
        }
    });

This will not create just a single file but force `combine_js.getHeader` to
return all `<script>`-tags directly to the static files.

Since the static files could be `coffee` files, it will return in this case a
dynamic javascript file. This javascript file starts always with the combined
filename (e.g. main.js + slash and the static filename).

    // Example Output for combine_js.getHeaders('main.js') with
    // options: combine=false
    <script type="text/javascript" src="static/base.js"> </script>
    <script type="text/javascript" src="main.js/static/screen/global.coffee"> </script>
    <script type="text/javascript" src="main.js/static/screen/player.coffee"> </script>

