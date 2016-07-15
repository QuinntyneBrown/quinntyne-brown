import { IRouteConfig } from "angular-rx-ui/src/components/core";

import {
    AppsContainerComponent,
    PropertiesContainerComponent,
    SectionsContainerComponent,
    UIsContainerComponent
} from "./containers";

export const ContentAggregationRoutes: Array<IRouteConfig> = [
    {
        path: "/admin/apps",
        component: AppsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/app/:appid",
        component: AppsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/properties",
        component: PropertiesContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/properties/:propertyid",
        component: PropertiesContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/sections",
        component: SectionsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/sections/:sectionid",
        component: SectionsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/uis",
        component: UIsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/properties/:uiid",
        component: UIsContainerComponent,
        authorizationRequired: true
    }
];