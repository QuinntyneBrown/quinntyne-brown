"use strict";
var photos_container_component_1 = require("./photos-container.component");
exports.PhotosRoutes = [
    {
        path: "/admin/photos",
        component: photos_container_component_1.PhotosContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/product/edit/:photoId",
        component: photos_container_component_1.PhotosContainerComponent,
        authorizationRequired: true
    }
];
