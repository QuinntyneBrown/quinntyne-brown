import * as actions from "./menu-item.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeMenuItemReducer = (state, action) => {
    if (action instanceof actions.RemoveMenuItemAction)
        pluckOut({ items: state.menuItems, value: action.entity.id });
    return state;
}

export const addMenuItemReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateMenuItemAction) {
        addOrUpdate({ items: state.menuItems, item: action.entity });
    }
    return state;
}

export const allMenuItemsReducer = (state, action) => {
    if (action instanceof actions.AllMenuItemsAction) {
        state.menuItems = action.entities;
    }
    return state;
}

export const setCurrentMenuItemReducer = (state, action) => {
    if (action instanceof actions.SetCurrentMenuItemAction) {
        state.currentMenuItemId = action.id;
    }
    return state;
}
