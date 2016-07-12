import * as actions from "../actions/section.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeSectionReducer = (state, action) => {
    if (action instanceof actions.RemoveSectionAction)
        pluckOut({ items: state.sections, value: action.entity.id });
    return state;
}

export const addSectionReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateSectionAction) {
        addOrUpdate({ items: state.sections, item: action.entity });
    }
    return state;
}

export const allSectionsReducer = (state, action) => {
    if (action instanceof actions.AllSectionsAction) {
        state.sections = action.entities;
    }
    return state;
}

export const setCurrentSectionReducer = (state, action) => {
    if (action instanceof actions.SetCurrentSectionAction) {
        state.currentSectionId = action.id;
    }
    return state;
}
