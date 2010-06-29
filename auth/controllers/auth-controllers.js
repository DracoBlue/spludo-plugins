/*
 * This file is part of the Spludo Framework.
 * Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

new Controller("login", {
    execute: function(params, context) {
        return function(cb) {
            context.layout_name = "HtmlLayout";
    
            var username = context.params["login-username"];
            var password = context.params["login-password"];
            
            user_manager.checkLogin(username, password)(function(is_valid, user_id, properties) {
                if (is_valid) {
                    session_manager.createSession({user_id: user_id, user_name: username})(function(session_id) {
                        context.session_id = session_id;
                        ContextToolkit.applyRedirect(context, "/");
                        cb();
                    });
                } else {
                    context.view_name = "LoginInput";
                    cb();
                }
            });
        };
    }
});

new Controller("logout", {
    execute: function(params, context) {
        return function(cb) {
            context.layout_name = "HtmlLayout";
    
            session_manager.removeSession(context.session_id)(function() {
                context.session_id = null;
            
                ContextToolkit.applyRedirect(context, "/");
                cb();
            });
        }
    }
});
