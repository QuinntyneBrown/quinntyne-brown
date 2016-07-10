import { ArticlesRoutes, ArticleEditorContainerComponent, ArticlesContainerComponent, ArticleContainerComponent } from "./app/articles";

import { LoginRoutes, LoginContainerComponent } from "./app/login";

import { provide, provideRoutePromise } from "angular-rx-ui/src/components/core";

import { bootstrap } from "angular-rx-ui/src/components/core";

const appModule = angular.module("quinntynebrownApp", ["components"]) as any;

appModule.component(ArticleEditorContainerComponent);
appModule.component(ArticleContainerComponent);
appModule.component(ArticlesContainerComponent);
appModule.component(LoginContainerComponent);


bootstrap(appModule, {
    api: "api",
    loginRedirectUrl: "/",
    html5Mode:true,
    routes: [
        ...ArticlesRoutes,
        ...LoginRoutes
    ]
});
