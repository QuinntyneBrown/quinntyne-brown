"use strict";
var containers_1 = require("./containers");
exports.ContentAggregationRoutes = [
    {
        path: "/admin/apps",
        component: containers_1.AppsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/app/edit/:appId",
        component: containers_1.AppsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/properties",
        component: containers_1.PropertiesContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/property/edit/:propertyId",
        component: containers_1.PropertiesContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/sections",
        component: containers_1.SectionsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/section/edit/:sectionid",
        component: containers_1.SectionsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/uis",
        component: containers_1.UIsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/ui/edit/:uiid",
        component: containers_1.UIsContainerComponent,
        authorizationRequired: true
    }
];
