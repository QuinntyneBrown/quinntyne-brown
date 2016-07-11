import * as actions from "./contact.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeContactReducer = (state, action) => {
    if (action instanceof actions.RemoveContactAction)
        pluckOut({ items: state.contacts, value: action.entity.id });
    return state;
}

export const addContactReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateContactAction) {
        addOrUpdate({ items: state.contacts, item: action.entity });
    }
    return state;
}

export const allContactsReducer = (state, action) => {
    if (action instanceof actions.AllContactsAction) {
        state.contacts = action.entities;
    }
    return state;
}

export const setCurrentContactReducer = (state, action) => {
    if (action instanceof actions.SetCurrentContactAction) {
        state.currentContactId = action.id;
    }
    return state;
}
