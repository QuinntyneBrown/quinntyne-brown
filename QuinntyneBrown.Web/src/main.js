"use strict";
var articles_1 = require("./app/articles");
var login_1 = require("./app/login");
var core_1 = require("angular-rx-ui/src/components/core");
var appModule = angular.module("quinntynebrownApp", ["components"]);
appModule.component(articles_1.ArticleEditorContainerComponent);
appModule.component(articles_1.ArticleContainerComponent);
appModule.component(articles_1.ArticlesContainerComponent);
appModule.component(login_1.LoginContainerComponent);
core_1.bootstrap(appModule, {
    api: "api",
    loginRedirectUrl: "/",
    html5Mode: true,
    routes: articles_1.ArticlesRoutes.concat(login_1.LoginRoutes)
});
//# sourceMappingURL=main.js.map