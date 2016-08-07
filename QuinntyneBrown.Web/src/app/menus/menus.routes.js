"use strict";
var menus_container_component_1 = require("./menus-container.component");
exports.MenusRoutes = [
    {
        path: "/admin/menus",
        component: menus_container_component_1.MenusContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/menu/:menuId",
        component: menus_container_component_1.MenusContainerComponent,
        authorizationRequired: true
    }
];
