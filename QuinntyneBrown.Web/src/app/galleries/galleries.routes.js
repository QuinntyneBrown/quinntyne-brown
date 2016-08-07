"use strict";
var gallery_editor_container_component_1 = require("./gallery-editor-container.component");
var gallery_container_component_1 = require("./gallery-container.component");
var featured_gallery_container_component_1 = require("./featured-gallery-container.component");
exports.GalleriesRoutes = [
    {
        path: "/",
        component: featured_gallery_container_component_1.FeaturedGalleryContainerComponent,
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
