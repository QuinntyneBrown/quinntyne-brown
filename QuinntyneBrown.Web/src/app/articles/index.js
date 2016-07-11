"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var article_editor_container_component_1 = require("./article-editor-container.component");
var articles_container_component_1 = require("./articles-container.component");
var article_container_component_1 = require("./article-container.component");
var core_1 = require("angular-rx-ui/src/components/core");
var articlesModule = angular.module("quinntynebrown.articles", []);
core_1.bootstrap(articlesModule, {
    components: [article_container_component_1.ArticleContainerComponent, article_editor_container_component_1.ArticleEditorContainerComponent, articles_container_component_1.ArticlesContainerComponent],
});
__export(require("./articles.routes"));
//# sourceMappingURL=index.js.map