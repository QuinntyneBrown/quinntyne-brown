import * as actions from "./professional-service.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeProfessionalServiceReducer = (state, action) => {
    if (action instanceof actions.RemoveProfessionalServiceAction)
        pluckOut({ items: state.professionalServices, value: action.entity.id });
    return state;
}

export const addProfessionalServiceReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateProfessionalServiceAction) {
        addOrUpdate({ items: state.professionalServices, item: action.entity });
    }
    return state;
}

export const allProfessionalServicesReducer = (state, action) => {
    if (action instanceof actions.AllProfessionalServicesAction) {
        state.professionalServices = action.entities;
    }
    return state;
}

export const setCurrentProfessionalServiceReducer = (state, action) => {
    if (action instanceof actions.SetCurrentProfessionalServiceAction) {
        state.currentProfessionalServiceId = action.id;
    }
    return state;
}
