"use strict";
var articles_container_component_1 = require("./articles-container.component");
exports.ArticlesRoutes = [
    {
        path: "/admin/articles",
        component: articles_container_component_1.ArticlesContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/article/:articleid",
        component: articles_container_component_1.ArticlesContainerComponent,
        authorizationRequired: true
    }
];
