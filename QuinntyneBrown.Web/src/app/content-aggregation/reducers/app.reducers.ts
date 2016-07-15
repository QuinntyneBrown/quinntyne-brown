import * as actions from "../actions/app.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeAppReducer = (state, action) => {
    if (action instanceof actions.RemoveAppAction)
        pluckOut({ items: state.apps, value: action.entity.id });
    return state;
}

export const addAppReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateAppAction) {
        addOrUpdate({ items: state.apps, item: action.entity });
    }
    return state;
}

export const allAppsReducer = (state, action) => {
    if (action instanceof actions.AllAppsAction) {
        state.apps = action.entities;
    }
    return state;
}

export const setCurrentAppReducer = (state, action) => {
    if (action instanceof actions.SetCurrentAppAction) {
        state.currentAppId = action.id;
    }
    return state;
}
