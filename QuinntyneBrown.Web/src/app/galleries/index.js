"use strict";
var core_1 = require("angular-rx-ui/src/components/core");
var gallery_component_1 = require("./gallery.component");
var gallery_editor_container_component_1 = require("./gallery-editor-container.component");
var gallery_action_creator_1 = require("./gallery.action-creator");
var reducers = require("./gallery.reducers");
var actions = require("./gallery.actions");
var galleriesModule = angular.module("quinntynebrown.galleries", []);
core_1.bootstrap(galleriesModule, {
    components: [gallery_component_1.GalleryComponent, gallery_editor_container_component_1.GalleryEditorContainerComponent],
    providers: [gallery_action_creator_1.GalleryActionCreator],
    reducers: reducers,
    actions: actions
});
//# sourceMappingURL=index.js.map