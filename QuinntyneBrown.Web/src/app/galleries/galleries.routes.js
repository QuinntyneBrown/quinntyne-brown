"use strict";
var gallery_editor_container_component_1 = require("./gallery-editor-container.component");
var galleries_container_component_1 = require("./galleries-container.component");
var gallery_container_component_1 = require("./gallery-container.component");
exports.GalleriesRoutes = [
    {
        path: "/",
        component: galleries_container_component_1.GalleriesContainerComponent,
    },
    {
        path: "/gallery/:slug",
        component: gallery_container_component_1.GalleryContainerComponent
    },
    {
        path: "/admin",
        component: gallery_editor_container_component_1.GalleryEditorContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/gallery/:galleryid",
        component: gallery_editor_container_component_1.GalleryEditorContainerComponent,
        authorizationRequired: true
    }
];
//# sourceMappingURL=galleries.routes.js.map