SitemapManager for Spludo
==========================

This plugin implements the [sitemaps protocol 0.9] [sitemaps-protocol] and gives a
simple interface to create and render sitemaps. It is also capable of managing
multiple files and offers an interface to generate sitemap entries on the fly.

  [sitemaps-protocol]: http://www.sitemaps.org/protocol.php

  
Example:
-------------------

In your `myapp/lib/index.js` append:

    bootstrap_manager.whenReady(["plugin.sitemap"], function() {
        sitemap_manager.addUrl('', {
            'lastmod': new Date(),
            'changefreq': 'daily'
        });
        sitemap_manager.addUrl('downloads/');
        sitemap_manager.addUrl('plugins/');
        sitemap_manager.addUrl('license/');
    });

Configure your sitemap base url, by appending this to your `myapp/config.js` or
`myapp/local.config.js`:

    config.setValues({
        "sitemap": {
            "base_url": "http://example.org/"
        }
    });

and it will generate a sitemap, looking like that at `http://example.org/sitemap.xml`:

    <?xml version="1.0" encoding="UTF-8"?>
    <urset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        <url>
            <loc>http://example.org/</loc>
            <priority>0.8</priority>
            <changefreq>daily</changefreq>
            <lastmod>2010-05-10</lastmod>
        </url>
        <url>
            <loc>http://example.org/downloads/</loc>
        </url>
        <url>
            <loc>http://example.org/plugins/</loc>
        </url>
        <url>
            <loc>http://example.org/license/</loc>
        </url>
    </urlset>

You are even able to register functions which generate the sitemap entries
on the fly:

    bootstrap_manager.whenReady(["plugin.sitemap"], function() {
        sitemap_manager.addSource(function() {
            var sites = [];
            
            sites.push({"loc":'downloads/'})
            sites.push({"loc":'plugins/'})
            sites.push({"loc":'license/'})
            
            return sites;
        });
    });

Additionally to `SitemapManager#addSource` and `SitemapManager#addUrl` there
is also a `SitemapManager#addSitemapSource(sitemap_name, ...)` and
`SitemapManager#addSitemapUrl(sitemap_name, ...)`. Those two functions take
a first extra parameter which is the name of the sitemap.

So:

    bootstrap_manager.whenReady(["plugin.sitemap"], function() {
        sitemap_manager.addSitemapUrl('mysitemap.xml', 'downloads/', {
            'lastmod': new Date(),
            'changefreq': 'daily'
        });
    });

creates a new sitemap at `http://example.org/mysitemap.xml`.