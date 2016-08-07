"use strict";
var actions = require("./professional-service.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeProfessionalServiceReducer = function (state, action) {
    if (action instanceof actions.RemoveProfessionalServiceAction)
        core_1.pluckOut({ items: state.professionalServices, value: action.entity.id });
    return state;
};
exports.addProfessionalServiceReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateProfessionalServiceAction) {
        core_1.addOrUpdate({ items: state.professionalServices, item: action.entity });
    }
    return state;
};
exports.allProfessionalServicesReducer = function (state, action) {
    if (action instanceof actions.AllProfessionalServicesAction) {
        state.professionalServices = action.entities;
    }
    return state;
};
exports.setCurrentProfessionalServiceReducer = function (state, action) {
    if (action instanceof actions.SetCurrentProfessionalServiceAction) {
        state.currentProfessionalServiceId = action.id;
    }
    return state;
};
