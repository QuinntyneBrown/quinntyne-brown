"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular-rx-ui/src/components/core");
var actions = require("./photo.actions");
var photo_action_creator_1 = require("./photo.action-creator");
var photo_model_1 = require("./photo.model");
var PhotosContainerComponent = (function () {
    function PhotosContainerComponent($location, $routeParams, photoActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.photoActionCreator = photoActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.photos;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentPhotoAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/photos");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentPhotoAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/photo/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdatePhotoAction)
                _this.entity = new photo_model_1.Photo();
            if (state.lastTriggeredByAction instanceof actions.RemovePhotoAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["photoId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/photos");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["photoId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["photoId"]), items: _this.entities });
            }
            else {
                _this.entity = new photo_model_1.Photo();
            }
        };
        this.upload = function () { return _this.photoActionCreator.openPhotoUploadModal(); };
        this.edit = function (entity) { return _this.photoActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.photoActionCreator.remove(entity); };
        this.create = function (entity) { return _this.photoActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.photoActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/photos") {
                    _this.entity = new photo_model_1.Photo();
                }
                else {
                    _this.$location.path("/admin/photos");
                }
            });
        };
    }
    PhotosContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/photos", "/admin/photo/edit/:photoId"],
            template: require("./photos-container.component.html"),
            styles: [require("./photos-container.component.scss")],
            selector: "photos-container",
            viewProviders: ["$location", "$routeParams", "photoActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "photoActionCreator", function ($q, $route, invokeAsync, photoActionCreator) {
                var photoId = $route.current.params.photoId;
                var promises = [invokeAsync(photoActionCreator.all)];
                if (photoId) {
                    promises.push(invokeAsync({ action: photoActionCreator.getById, params: { id: photoId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, photo_action_creator_1.PhotoActionCreator, Object])
    ], PhotosContainerComponent);
    return PhotosContainerComponent;
}());
exports.PhotosContainerComponent = PhotosContainerComponent;
