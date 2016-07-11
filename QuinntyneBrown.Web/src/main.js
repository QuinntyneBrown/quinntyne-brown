"use strict";
require("./app/articles");
require("./app/customers");
require("./app/galleries");
require("./app/login");
require("./app/photos");
require("./app/shared");
var articles_1 = require("./app/articles");
var customers_1 = require("./app/customers");
var galleries_1 = require("./app/galleries");
var login_1 = require("./app/login");
var photos_1 = require("./app/photos");
var photographers_1 = require("./app/photographers");
var core_1 = require("angular-rx-ui/src/components/core");
var authorization_guard_1 = require("angular-rx-ui/src/components/routing/authorization-guard");
var route_change_success_is_admin_reducer_1 = require("angular-rx-ui/src/components/routing/route-change-success-is-admin.reducer");
var quinntynebrownAppModule = angular.module("quinntynebrownApp", [
    "components",
    "quinntynebrown.articles",
    "quinntynebrown.customers",
    "quinntynebrown.galleries",
    "quinntynebrown.login",
    "quinntynebrown.photos",
    "quinntynebrown.photographers",
    "quinntynebrown.shared"
]);
core_1.bootstrap(quinntynebrownAppModule, {
    api: "api",
    loginRedirectUrl: "/",
    html5Mode: true,
    guards: [authorization_guard_1.authorizationGuard],
    run: [route_change_success_is_admin_reducer_1.routeChangeSuccessIsAdminReducer],
    routes: articles_1.ArticlesRoutes.concat(customers_1.CustomersRoutes, galleries_1.GalleriesRoutes, login_1.LoginRoutes, photos_1.PhotosRoutes, photographers_1.PhotographersRoutes)
});
//# sourceMappingURL=main.js.map