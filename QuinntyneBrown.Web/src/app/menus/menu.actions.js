"use strict";
var AddOrUpdateMenuAction = (function () {
    function AddOrUpdateMenuAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateMenuAction;
}());
exports.AddOrUpdateMenuAction = AddOrUpdateMenuAction;
var AllMenusAction = (function () {
    function AllMenusAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllMenusAction;
}());
exports.AllMenusAction = AllMenusAction;
var RemoveMenuAction = (function () {
    function RemoveMenuAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveMenuAction;
}());
exports.RemoveMenuAction = RemoveMenuAction;
var MenusFilterAction = (function () {
    function MenusFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return MenusFilterAction;
}());
exports.MenusFilterAction = MenusFilterAction;
var SetCurrentMenuAction = (function () {
    function SetCurrentMenuAction(entity) {
        this.entity = entity;
    }
    return SetCurrentMenuAction;
}());
exports.SetCurrentMenuAction = SetCurrentMenuAction;
var AddOrUpdateMenuSuccessAction = (function () {
    function AddOrUpdateMenuSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateMenuSuccessAction;
}());
exports.AddOrUpdateMenuSuccessAction = AddOrUpdateMenuSuccessAction;
var CurrentMenuRemovedAction = (function () {
    function CurrentMenuRemovedAction() {
    }
    return CurrentMenuRemovedAction;
}());
exports.CurrentMenuRemovedAction = CurrentMenuRemovedAction;
