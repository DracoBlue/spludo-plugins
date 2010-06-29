/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

user_manager = null;

if (typeof config.get('auth', {}).user_manager_engine === "undefined") {
    throw new Error('Please configure auth.user_manager_engine and auth.user_manager_engine_options in your (local.)config.js.');
}

bootstrap_manager.whenReady(['lib'], function() {
    var engine = config.get('auth', {}).user_manager_engine;
    
    user_manager = new GLOBAL[engine](config.get('auth', {}).user_manager_engine_options || {});
    Logging.prototype.fatal('loaded!');
});