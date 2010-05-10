/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

/**
 * @class A sitemap manager for the spludo framework.
 * 
 * @since 0.1 
 * @author DracoBlue
 */
SitemapManager = function(options) {
    this.setOptions(options);
    
    if (!this.options.base_url) {
        throw new Error('Please configure sitemap.base_url in your (local.)config.js!');
    }

    this.sitemaps = {};
};

extend(true, SitemapManager.prototype, Options.prototype, Logging.prototype);

SitemapManager.prototype.getSitemap = function(sitemap_name) {
    var self = this;
    sitemap_name = sitemap_name || 'sitemap.xml';
    if (typeof this.sitemaps[sitemap_name] === 'undefined') {
        new Controller(sitemap_name, {
            "execute": function(params, context) {
                return function(cb) {
                    context.headers['Content-Type'] = 'text/xml';
                    cb(self.getSitemapXml(sitemap_name));
                };
            }
        }); 
        this.sitemaps[sitemap_name] = {
            "sources": [],
            "sites": []
        };
    }
    
    return this.sitemaps[sitemap_name];
};

SitemapManager.prototype.getSitemapXml = function(sitemap_name, context) {
    var sitemap = this.getSitemap(sitemap_name);
    
    var sitemap_sites = sitemap.sites;
    var sitemap_sites_length = sitemap.sites.length;
    var sitemap_sources = sitemap.sources;
    var sitemap_sources_length = sitemap.sources.length;
    
    var i = 0;
    
    var sites = [];
    
    for (i = 0; i<sitemap_sites_length; i++) {
        sites.push(sitemap_sites[i]);
    }
    
    for (i = 0; i<sitemap_sources_length; i++) {
        var sitemap_source_sites = sitemap_sources[i]();
        var sitemap_source_sites_length = sitemap_source_sites.length;
        
        for (var s = 0; s < sitemap_source_sites_length; s++) {
            sites.push(sitemap_source_sites[s]);
        }
    }

    var sites_length = sites.length;
    
    var xml = [];
    
    xml.push('<?xml version="1.0" encoding="UTF-8"?>' + "\n");
    xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' + "\n");
    xml.push('    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' + "\n");
    xml.push('    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' + "\n");
    
    for (i=0; i < sites_length; i++) {
        var site = sites[i];
        xml.push('<url>');
        xml.push('<loc>');
        if (!site.absolute) {
            xml.push(this.options.base_url);
        }
        xml.push(StringToolkit.encodeXml(site.loc));
        xml.push('</loc>');
        
        if (typeof site.priority !== 'undefined') {
            xml.push('<priority>');
            xml.push(StringToolkit.encodeXml(String(site.priority)));
            xml.push('</priority>');
        }
        
        if (typeof site.changefreq !== 'undefined') {
            xml.push('<changefreq>');
            xml.push(StringToolkit.encodeXml(String(site.changefreq)));
            xml.push('</changefreq>');
        }
        
        if (typeof site.lastmod !== 'undefined') {
            xml.push('<lastmod>');
            if (site.lastmod instanceof Date) {
                xml.push(site.lastmod.getFullYear() + '-');
                if (site.lastmod.getMonth() < 9) {
                    xml.push('0');
                }
                xml.push((site.lastmod.getMonth() + 1) + '-');
                if (site.lastmod.getDate() < 10) {
                    xml.push('0');
                }
                xml.push(site.lastmod.getDate());
            } else {
                xml.push(StringToolkit.encodeXml(String(site.lastmod)));
            }
            xml.push('</lastmod>');
        }
        
        xml.push('</url>');
    }
    xml.push("\n" + '</urlset>');
    
    return xml.join('');
};

SitemapManager.prototype.addSource = function(generator_function) {
    this.addSitemapSource('sitemap.xml', generator_function);
};

SitemapManager.prototype.addUrl = function(site_location, options) {
    this.addSitemapUrl('sitemap.xml', site_location, options);
};

SitemapManager.prototype.addSitemapUrl = function(sitemap_name, site_location, options) {
    this.log('addSitemapUrl', arguments);
    var sitemap = this.getSitemap(sitemap_name);
    var site = {};
    extend(true, site, options);
    
    if (typeof site.absolute === 'undefined') {
        if (site_location.substr(0,5) !== 'http:' && site_location.substr(0,5) !== 'https:') {
            site.absolute = false;
        } else {
            site.absolute = true;
        }
    }
    
    site.loc = site_location;
    
    sitemap.sites.push(site);
};

SitemapManager.prototype.addSitemapSource = function(sitemap_name, generator_function) {
    this.log('addSitemapSource', arguments);
    var sitemap = this.getSitemap(sitemap_name);
    sitemap.sources.push(generator_function);
};

