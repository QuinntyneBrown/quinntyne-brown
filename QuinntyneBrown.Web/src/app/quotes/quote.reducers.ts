import * as actions from "./quote.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeQuoteReducer = (state, action) => {
    if (action instanceof actions.RemoveQuoteAction)
        pluckOut({ items: state.quotes, value: action.entity.id });
    return state;
}

export const addQuoteReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateQuoteAction) {
        addOrUpdate({ items: state.quotes, item: action.entity });
    }
    return state;
}

export const allQuotesReducer = (state, action) => {
    if (action instanceof actions.AllQuotesAction) {
        state.quotes = action.entities;
    }
    return state;
}

export const setCurrentQuoteReducer = (state, action) => {
    if (action instanceof actions.SetCurrentQuoteAction) {
        state.currentQuoteId = action.id;
    }
    return state;
}
