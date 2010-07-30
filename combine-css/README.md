CombineCss for Spludo
=====================

This plugin combines multiple css files into one. It respects the url-path in
the css file and rewrites it to the proper path.

By using the [sass plugin] [combine-css-sass-plugin] it's even possible to use
and render sass files on the fly.

  [combine-css-sass-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/combine-css-sass/

Example:
-------------------

Configure the plugin in your `myapp/lib/index.js`:

    config.setValues({
        "combine_css": {
            "base_url": "http://example.org/",
            "combine": true
        }
    });

Create a file called `myapp/lib/index.js` or append to the existing one.

    combine_css.addFile('static/base.css', 'screen.css', 'screen');
    combine_css.addFile('static/screen/global.css', 'screen.css', 'screen');
    combine_css.addFile('static/screen/player.css', 'screen.css', 'screen');

As you can see, the files `base.css`, `global.css` and `media.css` are added to
the combined `screen.css`.

If you want to generate the header includes for the css files now, you can
easily use the following lines:

    <%= combine_css.getHeader('screen.css') %>

You should put that into the `<head>`-section of your `HtmlLayout`.

Out-of-the-box it will work like a charm and generate a `<link>`-tag and add
the proper media.
    
    // Example Output for combine_css.getHeaders('screen.css') with
    // default options
    <link href="screen.css" media="screen" />

You can now open http://example.org/screen.css and see your
generated css file.
    
### Development Mode

But when you are in a development environment, you may not want to generate the
minimized, compressed and merged css file. Instead you want the single files.

    config.setValues({
        "combine_css": {
            combine: false
        }
    });

This will not create just a single file but force `combine_css.getHeader` to
return all `<link>`-tags directly to the static files.

    // Example Output for combine_css.getHeaders('screen.css') with
    // options: combine=false
    <link href="static/base.css" media="screen" />
    <link href="static/screen/global.css" media="screen" />
    <link href="static/screen/player.css" media="screen" />
    
TODO
----

There are some features planned for this plugin.

- compress those files (with a provider-like interface to plug in any
  compression tool you want)
- cache for the combined files
- export tool + cdn functionality, to disable any generation on production
  machine and use a cdn host to serve the generated files.
- allow combined filenames, which are not in the root of the application.
