"use strict";
var AddOrUpdateQuoteAction = (function () {
    function AddOrUpdateQuoteAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateQuoteAction;
}());
exports.AddOrUpdateQuoteAction = AddOrUpdateQuoteAction;
var AllQuotesAction = (function () {
    function AllQuotesAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllQuotesAction;
}());
exports.AllQuotesAction = AllQuotesAction;
var RemoveQuoteAction = (function () {
    function RemoveQuoteAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveQuoteAction;
}());
exports.RemoveQuoteAction = RemoveQuoteAction;
var QuotesFilterAction = (function () {
    function QuotesFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return QuotesFilterAction;
}());
exports.QuotesFilterAction = QuotesFilterAction;
var SetCurrentQuoteAction = (function () {
    function SetCurrentQuoteAction(entity) {
        this.entity = entity;
    }
    return SetCurrentQuoteAction;
}());
exports.SetCurrentQuoteAction = SetCurrentQuoteAction;
var AddOrUpdateQuoteSuccessAction = (function () {
    function AddOrUpdateQuoteSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateQuoteSuccessAction;
}());
exports.AddOrUpdateQuoteSuccessAction = AddOrUpdateQuoteSuccessAction;
var CurrentQuoteRemovedAction = (function () {
    function CurrentQuoteRemovedAction() {
    }
    return CurrentQuoteRemovedAction;
}());
exports.CurrentQuoteRemovedAction = CurrentQuoteRemovedAction;
