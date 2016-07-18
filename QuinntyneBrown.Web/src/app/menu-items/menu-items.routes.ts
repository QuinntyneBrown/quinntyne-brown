import { MenuItemsContainerComponent  } from "./menu-items-container.component";

import { IRouteConfig } from "angular-rx-ui/src/components/core";

export const MenuItemsRoutes: Array<IRouteConfig> = [
    {
        path: "/admin/menuitems",
        component: MenuItemsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/menuitem/:menuItemId",
        component: MenuItemsContainerComponent,
        authorizationRequired: true
    }
];