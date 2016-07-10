"use strict";
var article_editor_container_component_1 = require("./article-editor-container.component");
var articles_container_component_1 = require("./articles-container.component");
var article_container_component_1 = require("./article-container.component");
exports.ArticlesRoutes = [
    {
        path: "/blog",
        component: articles_container_component_1.ArticlesContainerComponent
    },
    {
        path: "/article/:slug",
        component: article_container_component_1.ArticleContainerComponent
    },
    {
        path: "/admin/articles",
        component: article_editor_container_component_1.ArticleEditorContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/article/:articleid",
        component: article_editor_container_component_1.ArticleEditorContainerComponent,
        authorizationRequired: true
    }
];
//# sourceMappingURL=articles.routes.js.map