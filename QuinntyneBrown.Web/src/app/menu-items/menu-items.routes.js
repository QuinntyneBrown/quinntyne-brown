"use strict";
var menu_items_container_component_1 = require("./menu-items-container.component");
exports.MenuItemsRoutes = [
    {
        path: "/admin/menuitems",
        component: menu_items_container_component_1.MenuItemsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/menuitem/:menuItemId",
        component: menu_items_container_component_1.MenuItemsContainerComponent,
        authorizationRequired: true
    }
];
