import * as actions from "./property.actions";
import { addOrUpdate, pluckOut } from "../core";

export const removePropertyReducer = (state, action) => {
    if (action instanceof actions.RemovePropertyAction)
        pluckOut({ items: state.propertys, value: action.entity.id });
    return state;
}

export const addPropertyReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdatePropertyAction) {
        addOrUpdate({ items: state.propertys, item: action.entity });
    }
    return state;
}

export const allPropertysReducer = (state, action) => {
    if (action instanceof actions.AllPropertysAction) {
        state.propertys = action.entities;
    }
    return state;
}

export const setCurrentPropertyReducer = (state, action) => {
    if (action instanceof actions.SetCurrentPropertyAction) {
        state.currentPropertyId = action.id;
    }
    return state;
}
