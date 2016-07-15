import * as actions from "../actions/property.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removePropertyReducer = (state, action) => {
    if (action instanceof actions.RemovePropertyAction)
        pluckOut({ items: state.properties, value: action.entity.id });
    return state;
}

export const addPropertyReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdatePropertyAction) {
        addOrUpdate({ items: state.properties, item: action.entity });
    }
    return state;
}

export const allPropertiesReducer = (state, action) => {
    if (action instanceof actions.AllPropertiesAction) {
        state.properties = action.entities;
    }
    return state;
}

export const setCurrentPropertyReducer = (state, action) => {
    if (action instanceof actions.SetCurrentPropertyAction) {
        state.currentPropertyId = action.id;
    }
    return state;
}
