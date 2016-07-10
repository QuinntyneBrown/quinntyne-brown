"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var photo_component_1 = require("./photo.component");
var photo_editor_container_component_1 = require("./photo-editor-container.component");
var photo_action_creator_1 = require("./photo.action-creator");
var reducers = require("./photo.reducers");
var actions = require("./photo.actions");
var photosModule = angular.module("quinntynebrown.photos", []);
core_1.bootstrap(photosModule, {
    components: [photo_component_1.PhotoComponent, photo_editor_container_component_1.PhotoEditorContainerComponent],
    providers: [photo_action_creator_1.PhotoActionCreator],
    reducers: reducers,
    actions: actions
});
__export(require("./photos.routes"));
//# sourceMappingURL=index.js.map