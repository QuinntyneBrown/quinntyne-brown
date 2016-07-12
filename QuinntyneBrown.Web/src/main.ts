require("./app/articles");
require("./app/contacts");
require("./app/customers");
require("./app/galleries");
require("./app/login");
require("./app/photos");
require("./app/shared");

import { ArticlesRoutes } from "./app/articles";
import { ContactsRoutes } from "./app/contacts";
import { CustomersRoutes } from "./app/customers";
import { GalleriesRoutes } from "./app/galleries";
import { LoginRoutes } from "./app/login";
import { PhotosRoutes } from "./app/photos";
import { PhotographersRoutes } from "./app/photographers";

import { provide, provideRoutePromise, bootstrap } from "angular-rx-ui/src/components/core";
import { authorizationGuard } from "angular-rx-ui/src/components/routing/authorization-guard";
import { routeChangeSuccessIsAdminReducer } from "angular-rx-ui/src/components/routing/route-change-success-is-admin.reducer";

const quinntynebrownAppModule = angular.module("quinntynebrownApp", [
    "components",
    "quinntynebrown.articles",
    "quinntynebrown.contacts",
    "quinntynebrown.customers",
    "quinntynebrown.galleries",
    "quinntynebrown.login",
    "quinntynebrown.photos",
    "quinntynebrown.photographers",
    "quinntynebrown.shared"    
]);

bootstrap(quinntynebrownAppModule, {
    api: "api",
    loginRedirectUrl: "/",
    html5Mode: true,
    guards: [authorizationGuard],
    run:[routeChangeSuccessIsAdminReducer],
    routes: [
        ...ArticlesRoutes,
        ...ContactsRoutes,
        ...CustomersRoutes,
        ...GalleriesRoutes,
        ...LoginRoutes,
        ...PhotosRoutes,
        ...PhotographersRoutes
    ]
});
