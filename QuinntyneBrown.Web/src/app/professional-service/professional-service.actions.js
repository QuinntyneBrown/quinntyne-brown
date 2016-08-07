"use strict";
var AddOrUpdateProfessionalServiceAction = (function () {
    function AddOrUpdateProfessionalServiceAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateProfessionalServiceAction;
}());
exports.AddOrUpdateProfessionalServiceAction = AddOrUpdateProfessionalServiceAction;
var AllProfessionalServicesAction = (function () {
    function AllProfessionalServicesAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllProfessionalServicesAction;
}());
exports.AllProfessionalServicesAction = AllProfessionalServicesAction;
var RemoveProfessionalServiceAction = (function () {
    function RemoveProfessionalServiceAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveProfessionalServiceAction;
}());
exports.RemoveProfessionalServiceAction = RemoveProfessionalServiceAction;
var ProfessionalServicesFilterAction = (function () {
    function ProfessionalServicesFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return ProfessionalServicesFilterAction;
}());
exports.ProfessionalServicesFilterAction = ProfessionalServicesFilterAction;
var SetCurrentProfessionalServiceAction = (function () {
    function SetCurrentProfessionalServiceAction(entity) {
        this.entity = entity;
    }
    return SetCurrentProfessionalServiceAction;
}());
exports.SetCurrentProfessionalServiceAction = SetCurrentProfessionalServiceAction;
var AddOrUpdateProfessionalServiceSuccessAction = (function () {
    function AddOrUpdateProfessionalServiceSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateProfessionalServiceSuccessAction;
}());
exports.AddOrUpdateProfessionalServiceSuccessAction = AddOrUpdateProfessionalServiceSuccessAction;
var CurrentProfessionalServiceRemovedAction = (function () {
    function CurrentProfessionalServiceRemovedAction() {
    }
    return CurrentProfessionalServiceRemovedAction;
}());
exports.CurrentProfessionalServiceRemovedAction = CurrentProfessionalServiceRemovedAction;
