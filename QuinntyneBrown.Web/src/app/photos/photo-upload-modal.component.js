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
var photo_actions_1 = require("./photo.actions");
var modal_action_creator_1 = require("angular-rx-ui/src/components/modal/modal.action-creator");
var PhotoUploadModalComponent = (function () {
    function PhotoUploadModalComponent(modalActionCreator) {
        var _this = this;
        this.modalActionCreator = modalActionCreator;
        this.storeOnChange = function (state) {
            if (state.lastTriggeredByAction instanceof photo_actions_1.PhotoUploadAction) {
                _this.close();
            }
        };
        this.close = function () { return _this.modalActionCreator.close(); };
    }
    PhotoUploadModalComponent = __decorate([
        core_1.Component({
            template: require("./photo-upload-modal.component.html"),
            styles: require("./photo-upload-modal.component.scss"),
            selector: "photo-upload-modal",
            viewProviders: ["modalActionCreator"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [modal_action_creator_1.ModalActionCreator])
    ], PhotoUploadModalComponent);
    return PhotoUploadModalComponent;
}());
exports.PhotoUploadModalComponent = PhotoUploadModalComponent;
