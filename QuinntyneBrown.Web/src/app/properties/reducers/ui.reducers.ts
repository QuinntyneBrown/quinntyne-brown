import * as actions from "../actions/ui.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeUiReducer = (state, action) => {
    if (action instanceof actions.RemoveUIAction)
        pluckOut({ items: state.uis, value: action.entity.id });
    return state;
}

export const addUiReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateUIAction) {
        addOrUpdate({ items: state.uis, item: action.entity });
    }
    return state;
}

export const allUisReducer = (state, action) => {
    if (action instanceof actions.AllUIsAction) {
        state.uis = action.entities;
    }
    return state;
}

export const setCurrentUiReducer = (state, action) => {
    if (action instanceof actions.SetCurrentUIAction) {
        state.currentUiId = action.id;
    }
    return state;
}
