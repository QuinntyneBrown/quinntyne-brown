"use strict";
var products_container_component_1 = require("./products-container.component");
exports.ProductsRoutes = [
    {
        path: "/admin/products",
        component: products_container_component_1.ProductsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/product/edit/:productId",
        component: products_container_component_1.ProductsContainerComponent,
        authorizationRequired: true
    }
];
