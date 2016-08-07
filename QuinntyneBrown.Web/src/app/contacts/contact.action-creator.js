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
var contact_actions_1 = require("./contact.actions");
var ContactActionCreator = (function (_super) {
    __extends(ContactActionCreator, _super);
    function ContactActionCreator($location, dispatcher, contactService, guid, invokeAsync, modalActionCreator) {
        var _this = this;
        _super.call(this, $location, contactService, dispatcher, guid, contact_actions_1.AddOrUpdateContactAction, contact_actions_1.AllContactsAction, contact_actions_1.RemoveContactAction, contact_actions_1.SetCurrentContactAction);
        this.invokeAsync = invokeAsync;
        this.modalActionCreator = modalActionCreator;
        this.addOrUpdateSuccess = function (options) { return _this.dispatcher.dispatch(new contact_actions_1.AddOrUpdateContactSuccessAction(options.entity)); };
        this.currentContactRemoved = function () { return _this.dispatcher.dispatch(new contact_actions_1.CurrentContactRemovedAction()); };
        this.openAllContactsModal = function () {
            _this.invokeAsync(_this.all).then(function (results) {
                _this.modalActionCreator.open({ html: "<all-contact-modal></all-contact-modal>" });
            });
        };
    }
    ContactActionCreator = __decorate([
        core_1.Service({
            serviceName: "contactActionCreator",
            viewProviders: ["$location", "dispatcher", "contactService", "guid", "invokeAsync", "modalActionCreator"]
        }), 
        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, modal_action_creator_1.ModalActionCreator])
    ], ContactActionCreator);
    return ContactActionCreator;
}(core_1.BaseActionCreator));
exports.ContactActionCreator = ContactActionCreator;
