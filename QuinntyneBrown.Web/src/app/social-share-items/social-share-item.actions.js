"use strict";
var AddOrUpdateSocialShareItemAction = (function () {
    function AddOrUpdateSocialShareItemAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateSocialShareItemAction;
}());
exports.AddOrUpdateSocialShareItemAction = AddOrUpdateSocialShareItemAction;
var AllSocialShareItemsAction = (function () {
    function AllSocialShareItemsAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllSocialShareItemsAction;
}());
exports.AllSocialShareItemsAction = AllSocialShareItemsAction;
var RemoveSocialShareItemAction = (function () {
    function RemoveSocialShareItemAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveSocialShareItemAction;
}());
exports.RemoveSocialShareItemAction = RemoveSocialShareItemAction;
var SocialShareItemsFilterAction = (function () {
    function SocialShareItemsFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return SocialShareItemsFilterAction;
}());
exports.SocialShareItemsFilterAction = SocialShareItemsFilterAction;
var SetCurrentSocialShareItemAction = (function () {
    function SetCurrentSocialShareItemAction(entity) {
        this.entity = entity;
    }
    return SetCurrentSocialShareItemAction;
}());
exports.SetCurrentSocialShareItemAction = SetCurrentSocialShareItemAction;
var AddOrUpdateSocialShareItemSuccessAction = (function () {
    function AddOrUpdateSocialShareItemSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateSocialShareItemSuccessAction;
}());
exports.AddOrUpdateSocialShareItemSuccessAction = AddOrUpdateSocialShareItemSuccessAction;
var CurrentSocialShareItemRemovedAction = (function () {
    function CurrentSocialShareItemRemovedAction() {
    }
    return CurrentSocialShareItemRemovedAction;
}());
exports.CurrentSocialShareItemRemovedAction = CurrentSocialShareItemRemovedAction;
