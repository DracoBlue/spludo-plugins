Sass for Spludo's CombineCss
=====================

This plugin is a small plugin which allows the usage of .sass files with the
[combine-css plugin] [combine-css-plugin]. It uses the [sass.js] library by
[visionmedia].

  [combine-css-plugin]: http://github.com/DracoBlue/spludo-plugins/tree/master/combine-css/
  [visionmedia]: http://github.com/visionmedia/sass
  [sass-js]: http://github.com/visionmedia/sass.js
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
    combine_css.addFile('static/screen/global.sass', 'screen.css', 'screen');
    combine_css.addFile('static/screen/player.sass', 'screen.css', 'screen');

As you can see, the files `global.sass` and `media.sass` are added to the
combined `screen.css`.

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
    
## Development Mode

But when you are in a development environment, you may not want to generate the
minimized, compressed and merged css file. Instead you want the single files.

    config.setValues({
        "combine-css": {
            combine: false
        }
    });

This will not create just a single file but force `combine_css.getHeader` to
return all `<link>`-tags directly to the static files.

Since the static files could be `sass` files, it will return in this case a
dynamic css file. This css file starts always with the combined filename (e.g.
screen.css + slash and the static filename).

    // Example Output for combine_css.getHeaders('screen.css') with
    // options: combine=false
    <link href="static/base.css" media="screen" />
    <link href="screen.css/static/screen/global.sass" media="screen" />
    <link href="screen.css/static/screen/player.sass" media="screen" />

