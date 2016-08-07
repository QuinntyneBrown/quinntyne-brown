"use strict";
var AddOrUpdatePropertyAction = (function () {
    function AddOrUpdatePropertyAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdatePropertyAction;
}());
exports.AddOrUpdatePropertyAction = AddOrUpdatePropertyAction;
var AllPropertiesAction = (function () {
    function AllPropertiesAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllPropertiesAction;
}());
exports.AllPropertiesAction = AllPropertiesAction;
var RemovePropertyAction = (function () {
    function RemovePropertyAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemovePropertyAction;
}());
exports.RemovePropertyAction = RemovePropertyAction;
var PropertysFilterAction = (function () {
    function PropertysFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return PropertysFilterAction;
}());
exports.PropertysFilterAction = PropertysFilterAction;
var SetCurrentPropertyAction = (function () {
    function SetCurrentPropertyAction(entity) {
        this.entity = entity;
    }
    return SetCurrentPropertyAction;
}());
exports.SetCurrentPropertyAction = SetCurrentPropertyAction;
var AddOrUpdatePropertySuccessAction = (function () {
    function AddOrUpdatePropertySuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdatePropertySuccessAction;
}());
exports.AddOrUpdatePropertySuccessAction = AddOrUpdatePropertySuccessAction;
var CurrentPropertyRemovedAction = (function () {
    function CurrentPropertyRemovedAction() {
    }
    return CurrentPropertyRemovedAction;
}());
exports.CurrentPropertyRemovedAction = CurrentPropertyRemovedAction;
var PropertyPickedAction = (function () {
    function PropertyPickedAction(entity) {
        this.entity = entity;
    }
    return PropertyPickedAction;
}());
exports.PropertyPickedAction = PropertyPickedAction;
