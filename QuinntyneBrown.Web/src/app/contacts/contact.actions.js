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
var AddOrUpdateContactAction = (function () {
    function AddOrUpdateContactAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    AddOrUpdateContactAction = __decorate([
        core_1.Action({
            type: "contact.addOrUpdatecontactAction"
        }), 
        __metadata('design:paramtypes', [Object, Object])
    ], AddOrUpdateContactAction);
    return AddOrUpdateContactAction;
}());
exports.AddOrUpdateContactAction = AddOrUpdateContactAction;
var AllContactsAction = (function () {
    function AllContactsAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    AllContactsAction = __decorate([
        core_1.Action({
            type: "contact.allcontactsAction"
        }), 
        __metadata('design:paramtypes', [Object, Object])
    ], AllContactsAction);
    return AllContactsAction;
}());
exports.AllContactsAction = AllContactsAction;
var RemoveContactAction = (function () {
    function RemoveContactAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    RemoveContactAction = __decorate([
        core_1.Action({
            type: "contact.removecontactAction"
        }), 
        __metadata('design:paramtypes', [Object, Object])
    ], RemoveContactAction);
    return RemoveContactAction;
}());
exports.RemoveContactAction = RemoveContactAction;
var ContactsFilterAction = (function () {
    function ContactsFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    ContactsFilterAction = __decorate([
        core_1.Action({
            type: "contact.sFilterActioncontactsFilterAction"
        }), 
        __metadata('design:paramtypes', [Object, Object])
    ], ContactsFilterAction);
    return ContactsFilterAction;
}());
exports.ContactsFilterAction = ContactsFilterAction;
var SetCurrentContactAction = (function () {
    function SetCurrentContactAction(entity) {
        this.entity = entity;
    }
    SetCurrentContactAction = __decorate([
        core_1.Action({
            type: "contact.setCurrentcontactAction"
        }), 
        __metadata('design:paramtypes', [Object])
    ], SetCurrentContactAction);
    return SetCurrentContactAction;
}());
exports.SetCurrentContactAction = SetCurrentContactAction;
var AddOrUpdateContactSuccessAction = (function () {
    function AddOrUpdateContactSuccessAction(entity) {
        this.entity = entity;
    }
    AddOrUpdateContactSuccessAction = __decorate([
        core_1.Action({
            type: "contact.addOrUpdatecontactSuccessAction"
        }), 
        __metadata('design:paramtypes', [Object])
    ], AddOrUpdateContactSuccessAction);
    return AddOrUpdateContactSuccessAction;
}());
exports.AddOrUpdateContactSuccessAction = AddOrUpdateContactSuccessAction;
var CurrentContactRemovedAction = (function () {
    function CurrentContactRemovedAction() {
    }
    CurrentContactRemovedAction = __decorate([
        core_1.Action({
            type: "contact.currentcontactRemovedAction"
        }), 
        __metadata('design:paramtypes', [])
    ], CurrentContactRemovedAction);
    return CurrentContactRemovedAction;
}());
exports.CurrentContactRemovedAction = CurrentContactRemovedAction;
