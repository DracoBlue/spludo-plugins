CombineJs for Spludo
=====================

This plugin combines multiple js files into one.

By using the [coffee plugin] [combine-js-coffee-plugin] it's even possible to use
and coffee script files on the fly.

  [combine-js-coffee-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/combine-js-coffee/

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
    combine_js.addFile('static/screen/global.js', 'main.js');
    combine_js.addFile('static/screen/player.js', 'main.js');

As you can see, the files `base.js`, `global.js` and `media.js` are added to
the combined `main.js`.

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
    
### Development Mode

But when you are in a development environment, you may not want to generate the
minimized, compressed and merged js file. Instead you want the single files.

    config.setValues({
        "combine_js": {
            combine: false
        }
    });

This will not create just a single file but force `combine_js.getHeader` to
return all `<script>`-tags directly to the static files.

    // Example Output for combine_js.getHeaders('main.js') with
    // options: combine=false
    <script type="text/javascript" src="static/base.js"> </script>
    <script type="text/javascript" src="static/screen/global.js"> </script>
    <script type="text/javascript" src="static/screen/player.js"> </script>
    
TODO
----

There are some features planned for this plugin.

- compress those files (with a provider-like interface to plug in any
  compression tool you want)
- cache for the combined files
- export tool + cdn functionality, to disable any generation on production
  machine and use a cdn host to serve the generated files.
- allow combined filenames, which are not in the root of the application.