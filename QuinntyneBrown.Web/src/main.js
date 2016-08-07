"use strict";
require("./app/articles");
require("./app/contacts");
require("./app/content-aggregation");
require("./app/customers");
require("./app/galleries");
require("./app/login");
require("./app/menu-items");
require("./app/menus");
require("./app/orders");
require("./app/pages");
require("./app/photos");
require("./app/products");
require("./app/quotes");
require("./app/shared");
require("./app/social-share-items");
var reducers = require("./app/app.reducers");
var articles_1 = require("./app/articles");
var contacts_1 = require("./app/contacts");
var customers_1 = require("./app/customers");
var galleries_1 = require("./app/galleries");
var login_1 = require("./app/login");
var menu_items_1 = require("./app/menu-items");
var menus_1 = require("./app/menus");
var photos_1 = require("./app/photos");
var photographers_1 = require("./app/photographers");
var products_1 = require("./app/products");
var quotes_1 = require("./app/quotes");
var orders_1 = require("./app/orders");
var pages_1 = require("./app/pages");
var content_aggregation_1 = require("./app/content-aggregation");
var social_share_items_1 = require("./app/social-share-items");
var core_1 = require("angular-rx-ui/src/components/core");
var authorization_guard_1 = require("angular-rx-ui/src/components/routing/authorization-guard");
var app_guard_1 = require("./app/routing/app-guard");
var route_change_success_is_admin_reducer_1 = require("angular-rx-ui/src/components/routing/route-change-success-is-admin.reducer");
var app_component_1 = require("./app/app.component");
var admin_app_component_1 = require("./app/admin-app.component");
var quinntynebrownAppModule = angular.module("quinntynebrownApp", [
    "components",
    "app.contentAggregation",
    "quinntynebrown.articles",
    "quinntynebrown.contacts",
    "quinntynebrown.customers",
    "quinntynebrown.galleries",
    "quinntynebrown.login",
    "quinntynebrown.menus",
    "quinntynebrown.menuItems",
    "quinntynebrown.orders",
    "quinntynebrown.pages",
    "quinntynebrown.photos",
    "quinntynebrown.photographers",
    "quinntynebrown.products",
    "quinntynebrown.quotes",
    "quinntynebrown.shared",
    "quinntynebrown.socialShareItems"
]);
core_1.bootstrap(quinntynebrownAppModule, {
    api: "api",
    components: [app_component_1.AppComponent, admin_app_component_1.AdminAppComponent],
    loginRedirectUrl: "/",
    html5Mode: true,
    guards: [authorization_guard_1.authorizationGuard, app_guard_1.appGuard],
    run: [route_change_success_is_admin_reducer_1.routeChangeSuccessIsAdminReducer],
    reducers: reducers,
    routes: articles_1.ArticlesRoutes.concat(contacts_1.ContactsRoutes, content_aggregation_1.ContentAggregationRoutes, customers_1.CustomersRoutes, galleries_1.GalleriesRoutes, login_1.LoginRoutes, menu_items_1.MenuItemsRoutes, menus_1.MenusRoutes, orders_1.OrdersRoutes, pages_1.PagesRoutes, photos_1.PhotosRoutes, photographers_1.PhotographersRoutes, products_1.ProductsRoutes, quotes_1.QuotesRoutes, social_share_items_1.SocialShareItemsRoutes)
});
