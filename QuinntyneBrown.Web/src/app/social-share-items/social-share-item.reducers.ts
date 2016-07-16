import * as actions from "./social-share-item.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeSocialShareItemReducer = (state, action) => {
    if (action instanceof actions.RemoveSocialShareItemAction)
        pluckOut({ items: state.socialShareItems, value: action.entity.id });
    return state;
}

export const addSocialShareItemReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateSocialShareItemAction) {
        addOrUpdate({ items: state.socialShareItems, item: action.entity });
    }
    return state;
}

export const allSocialShareItemsReducer = (state, action) => {
    if (action instanceof actions.AllSocialShareItemsAction) {
        state.socialShareItems = action.entities;
    }
    return state;
}

export const setCurrentSocialShareItemReducer = (state, action) => {
    if (action instanceof actions.SetCurrentSocialShareItemAction) {
        state.currentSocialShareItemId = action.id;
    }
    return state;
}
