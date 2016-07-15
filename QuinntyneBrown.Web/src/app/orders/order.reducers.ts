import * as actions from "./order.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeOrderReducer = (state, action) => {
    if (action instanceof actions.RemoveOrderAction)
        pluckOut({ items: state.orders, value: action.entity.id });
    return state;
}

export const addOrderReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateOrderAction) {
        addOrUpdate({ items: state.orders, item: action.entity });
    }
    return state;
}

export const allOrdersReducer = (state, action) => {
    if (action instanceof actions.AllOrdersAction) {
        state.orders = action.entities;
    }
    return state;
}

export const setCurrentOrderReducer = (state, action) => {
    if (action instanceof actions.SetCurrentOrderAction) {
        state.currentOrderId = action.id;
    }
    return state;
}
