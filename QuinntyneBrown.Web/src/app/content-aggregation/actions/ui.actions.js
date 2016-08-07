"use strict";
var AddOrUpdateUIAction = (function () {
    function AddOrUpdateUIAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateUIAction;
}());
exports.AddOrUpdateUIAction = AddOrUpdateUIAction;
var AllUIsAction = (function () {
    function AllUIsAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllUIsAction;
}());
exports.AllUIsAction = AllUIsAction;
var RemoveUIAction = (function () {
    function RemoveUIAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveUIAction;
}());
exports.RemoveUIAction = RemoveUIAction;
var UIsFilterAction = (function () {
    function UIsFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return UIsFilterAction;
}());
exports.UIsFilterAction = UIsFilterAction;
var SetCurrentUIAction = (function () {
    function SetCurrentUIAction(entity) {
        this.entity = entity;
    }
    return SetCurrentUIAction;
}());
exports.SetCurrentUIAction = SetCurrentUIAction;
var AddOrUpdateUISuccessAction = (function () {
    function AddOrUpdateUISuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateUISuccessAction;
}());
exports.AddOrUpdateUISuccessAction = AddOrUpdateUISuccessAction;
var CurrentUIRemovedAction = (function () {
    function CurrentUIRemovedAction() {
    }
    return CurrentUIRemovedAction;
}());
exports.CurrentUIRemovedAction = CurrentUIRemovedAction;
