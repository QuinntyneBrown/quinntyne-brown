"use strict";
var actions = require("./quote.actions");
var core_1 = require("angular-rx-ui/src/components/core");
exports.removeQuoteReducer = function (state, action) {
    if (action instanceof actions.RemoveQuoteAction)
        core_1.pluckOut({ items: state.quotes, value: action.entity.id });
    return state;
};
exports.addQuoteReducer = function (state, action) {
    if (action instanceof actions.AddOrUpdateQuoteAction) {
        core_1.addOrUpdate({ items: state.quotes, item: action.entity });
    }
    return state;
};
exports.allQuotesReducer = function (state, action) {
    if (action instanceof actions.AllQuotesAction) {
        state.quotes = action.entities;
    }
    return state;
};
exports.setCurrentQuoteReducer = function (state, action) {
    if (action instanceof actions.SetCurrentQuoteAction) {
        state.currentQuoteId = action.id;
    }
    return state;
};
