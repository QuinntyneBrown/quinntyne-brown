"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var article_editor_component_1 = require("./article-editor.component");
var article_list_component_1 = require("./article-list.component");
var article_component_1 = require("./article.component");
var articles_container_component_1 = require("./articles-container.component");
var article_action_creator_1 = require("./article.action-creator");
var article_service_1 = require("./article.service");
var reducers = require("./article.reducers");
var actions = require("./article.actions");
var appArticlesModule = angular.module("quinntynebrown.articles", []);
core_1.bootstrap(appArticlesModule, {
    components: [article_component_1.ArticleComponent, article_editor_component_1.ArticleEditorComponent, articles_container_component_1.ArticlesContainerComponent, article_list_component_1.ArticleListComponent],
    providers: [article_action_creator_1.ArticleActionCreator, article_service_1.ArticleService],
    reducers: reducers,
    actions: actions
});
__export(require("./articles.routes"));
