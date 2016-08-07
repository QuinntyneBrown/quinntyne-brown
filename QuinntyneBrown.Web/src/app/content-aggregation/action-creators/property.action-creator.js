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
var property_actions_1 = require("../actions/property.actions");
var PropertyActionCreator = (function (_super) {
    __extends(PropertyActionCreator, _super);
    function PropertyActionCreator($location, dispatcher, propertyService, guid, invokeAsync, modalActionCreator) {
        var _this = this;
        _super.call(this, $location, propertyService, dispatcher, guid, property_actions_1.AddOrUpdatePropertyAction, property_actions_1.AllPropertiesAction, property_actions_1.RemovePropertyAction, property_actions_1.SetCurrentPropertyAction);
        this.invokeAsync = invokeAsync;
        this.modalActionCreator = modalActionCreator;
        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new property_actions_1.AddOrUpdatePropertySuccessAction(options.entity)); };
        this.currentPropertyRemoved = function () { return _this.dispatcher.dispatch(new property_actions_1.CurrentPropertyRemovedAction()); };
        this.openAllPropertysModal = function () {
            _this.invokeAsync(_this.all).then(function (results) {
                _this.modalActionCreator.open({ html: "<all-property-modal></all-property-modal>" });
            });
        };
        this.openPropertyPickerModal = function () {
            _this.invokeAsync(_this.all).then(function (results) {
                _this.modalActionCreator.open({ html: "<property-picker-modal></property-picker-modal>" });
            });
        };
        this.pick = function (entity) { return _this.dispatcher.dispatch(new property_actions_1.PropertyPickedAction(entity)); };
        this.openEditPropertyModal = function (options) {
            if (options === void 0) { options = { property: null }; }
            _this.modalActionCreator.open({ html: "<edit-property-modal property='" + JSON.stringify(options.property) + "'></edit-property-modal>" });
        };
    }
    PropertyActionCreator = __decorate([
        core_1.Service({
            serviceName: "propertyActionCreator",
            viewProviders: ["$location", "dispatcher", "propertyService", "guid", "invokeAsync", "modalActionCreator"]
        }), 
        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
    ], PropertyActionCreator);
    return PropertyActionCreator;
}(core_1.BaseActionCreator));
exports.PropertyActionCreator = PropertyActionCreator;
