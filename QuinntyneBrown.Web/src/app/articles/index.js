"use strict";
require("angular-rx-ui/src/components/core");
var core_1 = require("angular-rx-ui/src/components/core");
var article_component_1 = require("./article.component");
var article_action_creator_1 = require("./article.action-creator");
var reducers = require("./article.reducers");
var actions = require("./article.actions");
var app = angular.module("app.article", [
    "app.core"
]);
core_1.provide(app, article_action_creator_1.ArticleActionCreator);
app.component(article_component_1.ArticleComponent);
app.config(["reducersProvider", function (reducersProvider) {
        for (var reducer in reducers) {
            reducersProvider.configure(reducers[reducer]);
        }
    }]);
for (var action in actions) {
    core_1.provideAction(app, actions[action]);
}
//# sourceMappingURL=index.js.map