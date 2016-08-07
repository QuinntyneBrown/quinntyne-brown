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
var modal_action_creator_1 = require("angular-rx-ui/src/components/modal/modal.action-creator");
var PhotoPickerModalComponent = (function () {
    function PhotoPickerModalComponent(modalActionCreator) {
        var _this = this;
        this.modalActionCreator = modalActionCreator;
        this.storeOnChange = function (state) { return _this.entities = state.photos; };
        this.close = function () { return _this.modalActionCreator.close(); };
    }
    PhotoPickerModalComponent = __decorate([
        core_1.Component({
            template: require("./photo-picker-modal.component.html"),
            styles: require("./photo-picker-modal.component.scss"),
            selector: "photo-picker-modal",
            viewProviders: ["modalActionCreator"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [modal_action_creator_1.ModalActionCreator])
    ], PhotoPickerModalComponent);
    return PhotoPickerModalComponent;
}());
exports.PhotoPickerModalComponent = PhotoPickerModalComponent;
