"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var gallery_component_1 = require("./gallery.component");
var galleries_container_component_1 = require("./galleries-container.component");
var featured_gallery_container_component_1 = require("./featured-gallery-container.component");
var gallery_editor_container_component_1 = require("./gallery-editor-container.component");
var gallery_action_creator_1 = require("./gallery.action-creator");
var reducers = require("./gallery.reducers");
var actions = require("./gallery.actions");
var galleriesModule = angular.module("quinntynebrown.galleries", []);
core_1.bootstrap(galleriesModule, {
    components: [gallery_component_1.GalleryComponent, gallery_editor_container_component_1.GalleryEditorContainerComponent, galleries_container_component_1.GalleriesContainerComponent, featured_gallery_container_component_1.FeaturedGalleryContainerComponent],
    providers: [gallery_action_creator_1.GalleryActionCreator],
    reducers: reducers,
    actions: actions
});
__export(require("./galleries.routes"));
