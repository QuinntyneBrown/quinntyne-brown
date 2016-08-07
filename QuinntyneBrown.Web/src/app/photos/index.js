"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var photo_editor_component_1 = require("./photo-editor.component");
var photo_list_component_1 = require("./photo-list.component");
var photo_component_1 = require("./photo.component");
var photos_container_component_1 = require("./photos-container.component");
var photo_upload_modal_component_1 = require("./photo-upload-modal.component");
var photo_upload_component_1 = require("./photo-upload.component");
var photo_action_creator_1 = require("./photo.action-creator");
var photo_service_1 = require("./photo.service");
var reducers = require("./photo.reducers");
var actions = require("./photo.actions");
var appPhotosModule = angular.module("quinntynebrown.photos", []);
core_1.bootstrap(appPhotosModule, {
    components: [photo_component_1.PhotoComponent, photo_editor_component_1.PhotoEditorComponent, photos_container_component_1.PhotosContainerComponent, photo_list_component_1.PhotoListComponent, photo_upload_component_1.PhotoUploadComponent, photo_upload_modal_component_1.PhotoUploadModalComponent],
    providers: [photo_action_creator_1.PhotoActionCreator, photo_service_1.PhotoService],
    reducers: reducers,
    actions: actions
});
__export(require("./photos.routes"));
