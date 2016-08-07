"use strict";
var AddOrUpdateSectionAction = (function () {
    function AddOrUpdateSectionAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateSectionAction;
}());
exports.AddOrUpdateSectionAction = AddOrUpdateSectionAction;
var AllSectionsAction = (function () {
    function AllSectionsAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllSectionsAction;
}());
exports.AllSectionsAction = AllSectionsAction;
var RemoveSectionAction = (function () {
    function RemoveSectionAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveSectionAction;
}());
exports.RemoveSectionAction = RemoveSectionAction;
var SectionsFilterAction = (function () {
    function SectionsFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return SectionsFilterAction;
}());
exports.SectionsFilterAction = SectionsFilterAction;
var SetCurrentSectionAction = (function () {
    function SetCurrentSectionAction(entity) {
        this.entity = entity;
    }
    return SetCurrentSectionAction;
}());
exports.SetCurrentSectionAction = SetCurrentSectionAction;
var AddOrUpdateSectionSuccessAction = (function () {
    function AddOrUpdateSectionSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateSectionSuccessAction;
}());
exports.AddOrUpdateSectionSuccessAction = AddOrUpdateSectionSuccessAction;
var CurrentSectionRemovedAction = (function () {
    function CurrentSectionRemovedAction() {
    }
    return CurrentSectionRemovedAction;
}());
exports.CurrentSectionRemovedAction = CurrentSectionRemovedAction;
