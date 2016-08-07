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
var contact_action_creator_1 = require("./contact.action-creator");
var ContactEditorComponent = (function () {
    function ContactEditorComponent(contactActionCreator) {
        var _this = this;
        this.contactActionCreator = contactActionCreator;
        this.onTryToSaveContact = function (options) {
            _this.contactActionCreator.addOrUpdate({
                data: options.data
            });
        };
    }
    ContactEditorComponent = __decorate([
        core_1.Component({
            template: require("./contact-editor.component.html"),
            styles: [require("./contact-editor.component.scss")],
            selector: "contact-editor",
            inputs: ["entity"],
            viewProviders: ["contactActionCreator"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [contact_action_creator_1.ContactActionCreator])
    ], ContactEditorComponent);
    return ContactEditorComponent;
}());
exports.ContactEditorComponent = ContactEditorComponent;
