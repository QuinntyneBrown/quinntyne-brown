"use strict";
var PhotoSearchAction = (function () {
    function PhotoSearchAction(id, results) {
        this.id = id;
        this.results = results;
    }
    return PhotoSearchAction;
}());
exports.PhotoSearchAction = PhotoSearchAction;
var AddOrUpdatePhotoAction = (function () {
    function AddOrUpdatePhotoAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdatePhotoAction;
}());
exports.AddOrUpdatePhotoAction = AddOrUpdatePhotoAction;
var AllPhotosAction = (function () {
    function AllPhotosAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllPhotosAction;
}());
exports.AllPhotosAction = AllPhotosAction;
var RemovePhotoAction = (function () {
    function RemovePhotoAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemovePhotoAction;
}());
exports.RemovePhotoAction = RemovePhotoAction;
var PhotosFilterAction = (function () {
    function PhotosFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return PhotosFilterAction;
}());
exports.PhotosFilterAction = PhotosFilterAction;
var SetCurrentPhotoAction = (function () {
    function SetCurrentPhotoAction(entity) {
        this.entity = entity;
    }
    return SetCurrentPhotoAction;
}());
exports.SetCurrentPhotoAction = SetCurrentPhotoAction;
var AddOrUpdatePhotoSuccessAction = (function () {
    function AddOrUpdatePhotoSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdatePhotoSuccessAction;
}());
exports.AddOrUpdatePhotoSuccessAction = AddOrUpdatePhotoSuccessAction;
var CurrentPhotoRemovedAction = (function () {
    function CurrentPhotoRemovedAction() {
    }
    return CurrentPhotoRemovedAction;
}());
exports.CurrentPhotoRemovedAction = CurrentPhotoRemovedAction;
var PhotoUploadAction = (function () {
    function PhotoUploadAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return PhotoUploadAction;
}());
exports.PhotoUploadAction = PhotoUploadAction;
