"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var modal_action_creator_1 = require("angular-rx-ui/src/components/modal/modal.action-creator");
var photo_actions_1 = require("./photo.actions");
var PhotoActionCreator = (function (_super) {
    __extends(PhotoActionCreator, _super);
    function PhotoActionCreator($location, dispatcher, photoService, guid, invokeAsync, modalActionCreator) {
        var _this = this;
        _super.call(this, $location, photoService, dispatcher, guid, photo_actions_1.AddOrUpdatePhotoAction, photo_actions_1.AllPhotosAction, photo_actions_1.RemovePhotoAction, photo_actions_1.SetCurrentPhotoAction);
        this.invokeAsync = invokeAsync;
        this.modalActionCreator = modalActionCreator;
        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new photo_actions_1.AddOrUpdatePhotoSuccessAction(options.entity)); };
        this.currentPhotoRemoved = function () { return _this.dispatcher.dispatch(new photo_actions_1.CurrentPhotoRemovedAction()); };
        this.upload = function (dragEvent) {
            dragEvent.stopPropagation();
            dragEvent.preventDefault();
            var newId = _this.guid();
            if (dragEvent.dataTransfer && dragEvent.dataTransfer.files) {
                var packageFiles = function (fileList) {
                    var formData = new FormData();
                    for (var i = 0; i < fileList.length; i++) {
                        formData.append(fileList[i].name, fileList[i]);
                    }
                    return formData;
                };
                _this.service
                    .tryToUpload({ data: packageFiles(dragEvent.dataTransfer.files) })
                    .then(function (response) {
                    _this.dispatcher.dispatch(new photo_actions_1.PhotoUploadAction(newId, response.files));
                });
            }
            return newId;
        };
        this.openPhotoUploadModal = function () {
            _this.modalActionCreator.open({ html: "<photo-upload-modal></photo-upload-modal>" });
        };
        this.openPhotoPickerModal = function () {
            _this.invokeAsync(_this.all).then(function (results) {
                _this.modalActionCreator.open({ html: "<photo-picker-modal></photo-picker-modal>" });
            });
        };
        this.search = function (options) {
            var id = _this.guid();
            _this.service.search({ params: { searchText: options.searchText } })
                .then(function (results) {
                _this.dispatcher.dispatch(new photo_actions_1.PhotoSearchAction(id, results));
            });
            return id;
        };
    }
    PhotoActionCreator = __decorate([
        core_1.Service({
            serviceName: "photoActionCreator",
            viewProviders: [
                "$location", "dispatcher", "photoService", "guid", "invokeAsync", "modalActionCreator"
            ]
        }), 
        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
    ], PhotoActionCreator);
    return PhotoActionCreator;
}(core_1.BaseActionCreator));
exports.PhotoActionCreator = PhotoActionCreator;
