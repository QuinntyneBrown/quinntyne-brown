import * as actions from "./product.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeProductReducer = (state, action) => {
    if (action instanceof actions.RemoveProductAction)
        pluckOut({ items: state.products, value: action.entity.id });
    return state;
}

export const addProductReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateProductAction) {
        addOrUpdate({ items: state.products, item: action.entity });
    }
    return state;
}

export const allProductsReducer = (state, action) => {
    if (action instanceof actions.AllProductsAction) {
        state.products = action.entities;
    }
    return state;
}

export const setCurrentProductReducer = (state, action) => {
    if (action instanceof actions.SetCurrentProductAction) {
        state.currentProductId = action.id;
    }
    return state;
}
