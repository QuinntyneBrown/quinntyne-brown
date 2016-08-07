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
var property_action_creator_1 = require("../action-creators/property.action-creator");
var PropertyPickerModalComponent = (function () {
    function PropertyPickerModalComponent(modalActionCreator, propertyActionCreator) {
        var _this = this;
        this.modalActionCreator = modalActionCreator;
        this.propertyActionCreator = propertyActionCreator;
        this.storeOnChange = function (state) { return _this.entities = state.properties; };
        this.pageNumber = 1;
        this.pageSize = 4;
        this.select = function (options) {
            _this.propertyActionCreator.pick(options.entity);
            _this.modalActionCreator.close();
        };
    }
    PropertyPickerModalComponent = __decorate([
        core_1.Component({
            template: require("./property-picker-modal.component.html"),
            styles: [require("./property-picker-modal.component.scss")],
            selector: "property-picker-modal",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            viewProviders: ["modalActionCreator", "propertyActionCreator"]
        }), 
        __metadata('design:paramtypes', [modal_action_creator_1.ModalActionCreator, property_action_creator_1.PropertyActionCreator])
    ], PropertyPickerModalComponent);
    return PropertyPickerModalComponent;
}());
exports.PropertyPickerModalComponent = PropertyPickerModalComponent;
