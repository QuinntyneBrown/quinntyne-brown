"use strict";
var AddOrUpdateMenuItemAction = (function () {
    function AddOrUpdateMenuItemAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateMenuItemAction;
}());
exports.AddOrUpdateMenuItemAction = AddOrUpdateMenuItemAction;
var AllMenuItemsAction = (function () {
    function AllMenuItemsAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllMenuItemsAction;
}());
exports.AllMenuItemsAction = AllMenuItemsAction;
var RemoveMenuItemAction = (function () {
    function RemoveMenuItemAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveMenuItemAction;
}());
exports.RemoveMenuItemAction = RemoveMenuItemAction;
var MenuItemsFilterAction = (function () {
    function MenuItemsFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return MenuItemsFilterAction;
}());
exports.MenuItemsFilterAction = MenuItemsFilterAction;
var SetCurrentMenuItemAction = (function () {
    function SetCurrentMenuItemAction(entity) {
        this.entity = entity;
    }
    return SetCurrentMenuItemAction;
}());
exports.SetCurrentMenuItemAction = SetCurrentMenuItemAction;
var AddOrUpdateMenuItemSuccessAction = (function () {
    function AddOrUpdateMenuItemSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateMenuItemSuccessAction;
}());
exports.AddOrUpdateMenuItemSuccessAction = AddOrUpdateMenuItemSuccessAction;
var CurrentMenuItemRemovedAction = (function () {
    function CurrentMenuItemRemovedAction() {
    }
    return CurrentMenuItemRemovedAction;
}());
exports.CurrentMenuItemRemovedAction = CurrentMenuItemRemovedAction;
