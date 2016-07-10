require("./app/articles");
require("./app/customers");
require("./app/galleries");
require("./app/login");
require("./app/photos");

import { ArticlesRoutes, ArticleEditorContainerComponent, ArticlesContainerComponent, ArticleContainerComponent } from "./app/articles";
import {  } from "./app/customers";
import {  } from "./app/galleries";
import { LoginRoutes, LoginContainerComponent } from "./app/login";
import {  } from "./app/photos";

import { provide, provideRoutePromise, bootstrap } from "angular-rx-ui/src/components/core";
import { authorizationGuard } from "angular-rx-ui/src/components/routing/authorization-guard";
import { routeChangeSuccessIsAdminReducer } from "angular-rx-ui/src/components/routing/route-change-success-is-admin.reducer";

const quinntynebrownAppModule = angular.module("quinntynebrownApp", [
    "components",
    "quinntynebrown.articles",
    "quinntynebrown.customers",
    "quinntynebrown.galleries",
    "quinntynebrown.login",
    "quinntynebrown.photos"    
]);

bootstrap(quinntynebrownAppModule, {
    api: "api",
    loginRedirectUrl: "/",
    html5Mode: true,
    guards: [authorizationGuard],
    run:[routeChangeSuccessIsAdminReducer],
    routes: [
        ...ArticlesRoutes,
        ...LoginRoutes
    ]
});
