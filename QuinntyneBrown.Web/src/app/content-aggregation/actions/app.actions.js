"use strict";
var AddOrUpdateAppAction = (function () {
    function AddOrUpdateAppAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateAppAction;
}());
exports.AddOrUpdateAppAction = AddOrUpdateAppAction;
var AllAppsAction = (function () {
    function AllAppsAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllAppsAction;
}());
exports.AllAppsAction = AllAppsAction;
var RemoveAppAction = (function () {
    function RemoveAppAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveAppAction;
}());
exports.RemoveAppAction = RemoveAppAction;
var AppsFilterAction = (function () {
    function AppsFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return AppsFilterAction;
}());
exports.AppsFilterAction = AppsFilterAction;
var SetCurrentAppAction = (function () {
    function SetCurrentAppAction(entity) {
        this.entity = entity;
    }
    return SetCurrentAppAction;
}());
exports.SetCurrentAppAction = SetCurrentAppAction;
var AddOrUpdateAppSuccessAction = (function () {
    function AddOrUpdateAppSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateAppSuccessAction;
}());
exports.AddOrUpdateAppSuccessAction = AddOrUpdateAppSuccessAction;
var CurrentAppRemovedAction = (function () {
    function CurrentAppRemovedAction() {
    }
    return CurrentAppRemovedAction;
}());
exports.CurrentAppRemovedAction = CurrentAppRemovedAction;
