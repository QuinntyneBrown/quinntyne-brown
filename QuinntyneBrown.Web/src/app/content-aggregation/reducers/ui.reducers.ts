import * as actions from "../actions/ui.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeUIReducer = (state, action) => {
    if (action instanceof actions.RemoveUIAction)
        pluckOut({ items: state.uis, value: action.entity.id });
    return state;
}

export const addUIReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateUIAction) {
        addOrUpdate({ items: state.uis, item: action.entity });
    }
    return state;
}

export const allUIsReducer = (state, action) => {
    if (action instanceof actions.AllUIsAction) {
        state.uis = action.entities;
    }
    return state;
}

export const setCurrentUIReducer = (state, action) => {
    if (action instanceof actions.SetCurrentUIAction) {
        state.currentUiId = action.id;
    }
    return state;
}
