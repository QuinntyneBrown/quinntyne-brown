import * as actions from "./menu.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeMenuReducer = (state, action) => {
    if (action instanceof actions.RemoveMenuAction)
        pluckOut({ items: state.menus, value: action.entity.id });
    return state;
}

export const addMenuReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateMenuAction) {
        addOrUpdate({ items: state.menus, item: action.entity });
    }
    return state;
}

export const allMenusReducer = (state, action) => {
    if (action instanceof actions.AllMenusAction) {
        state.menus = action.entities;
    }
    return state;
}

export const setCurrentMenuReducer = (state, action) => {
    if (action instanceof actions.SetCurrentMenuAction) {
        state.currentMenuId = action.id;
    }
    return state;
}
