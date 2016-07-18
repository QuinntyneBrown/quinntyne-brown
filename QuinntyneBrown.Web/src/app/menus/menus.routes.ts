import { MenusContainerComponent  } from "./menus-container.component";

import { IRouteConfig } from "angular-rx-ui/src/components/core";

export const MenusRoutes: Array<IRouteConfig> = [
    {
        path: "/admin/menus",
        component: MenusContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/menu/:menuId",
        component: MenusContainerComponent,
        authorizationRequired: true
    }
];