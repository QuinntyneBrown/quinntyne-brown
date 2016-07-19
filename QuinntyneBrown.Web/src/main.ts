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


import { ArticlesRoutes } from "./app/articles";
import { ContactsRoutes } from "./app/contacts";
import { CustomersRoutes } from "./app/customers";
import { GalleriesRoutes } from "./app/galleries";
import { LoginRoutes } from "./app/login";
import { MenuItemsRoutes } from "./app/menu-items";
import { MenusRoutes } from "./app/menus";
import { PhotosRoutes } from "./app/photos";
import { PhotographersRoutes } from "./app/photographers";
import { ProductsRoutes } from "./app/products";
import { QuotesRoutes } from "./app/quotes";
import { OrdersRoutes } from "./app/orders";
import { PagesRoutes } from "./app/pages";
import { ContentAggregationRoutes } from "./app/content-aggregation";
import { SocialShareItemsRoutes } from "./app/social-share-items";


import { provide, provideRoutePromise, bootstrap } from "angular-rx-ui/src/components/core";
import { authorizationGuard } from "angular-rx-ui/src/components/routing/authorization-guard";
import { appGuard } from "./app/routing/app-guard";
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

bootstrap(quinntynebrownAppModule, {
    api: "api",
    components:[AppComponent, AdminAppComponent],
    loginRedirectUrl: "/",
    html5Mode: true,
    guards: [authorizationGuard, appGuard],
    run:[routeChangeSuccessIsAdminReducer],
    routes: [        
        ...ArticlesRoutes,
        ...ContactsRoutes,
        ...ContentAggregationRoutes,
        ...CustomersRoutes,
        ...GalleriesRoutes,
        ...LoginRoutes,
        ...MenuItemsRoutes,
        ...MenusRoutes,
        ...OrdersRoutes,
        ...PagesRoutes,
        ...PhotosRoutes,
        ...PhotographersRoutes,
        ...ProductsRoutes,
        ...QuotesRoutes,
        ...SocialShareItemsRoutes
    ]
});
