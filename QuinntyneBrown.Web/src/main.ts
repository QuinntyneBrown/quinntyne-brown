require("./app/articles");
require("./app/contacts");
require("./app/content-aggregation");
require("./app/customers");
require("./app/galleries");
require("./app/login");
require("./app/orders");
require("./app/photos");
require("./app/products");
require("./app/quotes");
require("./app/shared");

import { ArticlesRoutes } from "./app/articles";
import { ContactsRoutes } from "./app/contacts";
import { CustomersRoutes } from "./app/customers";
import { GalleriesRoutes } from "./app/galleries";
import { LoginRoutes } from "./app/login";
import { PhotosRoutes } from "./app/photos";
import { PhotographersRoutes } from "./app/photographers";
import { ProductsRoutes } from "./app/products";
import { QuotesRoutes } from "./app/quotes";
import { OrdersRoutes } from "./app/orders";
import { ContentAggregationRoutes } from "./app/content-aggregation";

import { provide, provideRoutePromise, bootstrap } from "angular-rx-ui/src/components/core";
import { authorizationGuard } from "angular-rx-ui/src/components/routing/authorization-guard";
import { routeChangeSuccessIsAdminReducer } from "angular-rx-ui/src/components/routing/route-change-success-is-admin.reducer";

import { AppComponent } from "./app/app.component";
import { AdminAppComponent } from "./app/admin-app.component";

const quinntynebrownAppModule = angular.module("quinntynebrownApp", [
    "components",
    "app.contentAggregation",
    "quinntynebrown.articles",
    "quinntynebrown.contacts",
    "quinntynebrown.customers",
    "quinntynebrown.galleries",
    "quinntynebrown.login",
    "quinntynebrown.orders",
    "quinntynebrown.photos",
    "quinntynebrown.photographers",
    "quinntynebrown.products",
    "quinntynebrown.quotes",
    "quinntynebrown.shared"    
]);

bootstrap(quinntynebrownAppModule, {
    api: "http://www.quinntynebrown.com/api",
    components:[AppComponent, AdminAppComponent],
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
        ...OrdersRoutes,
        ...PhotosRoutes,
        ...PhotographersRoutes,
        ...QuotesRoutes
    ]
});
