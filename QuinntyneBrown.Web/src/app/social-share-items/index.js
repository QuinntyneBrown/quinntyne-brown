"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var social_share_item_editor_component_1 = require("./social-share-item-editor.component");
var social_share_item_list_component_1 = require("./social-share-item-list.component");
var social_share_item_component_1 = require("./social-share-item.component");
var social_share_items_container_component_1 = require("./social-share-items-container.component");
var social_share_item_action_creator_1 = require("./social-share-item.action-creator");
var social_share_item_service_1 = require("./social-share-item.service");
var reducers = require("./social-share-item.reducers");
var actions = require("./social-share-item.actions");
var appSocialShareItemsModule = angular.module("quinntynebrown.socialShareItems", []);
core_1.bootstrap(appSocialShareItemsModule, {
    components: [social_share_item_component_1.SocialShareItemComponent, social_share_item_editor_component_1.SocialShareItemEditorComponent, social_share_items_container_component_1.SocialShareItemsContainerComponent, social_share_item_list_component_1.SocialShareItemListComponent],
    providers: [social_share_item_action_creator_1.SocialShareItemActionCreator, social_share_item_service_1.SocialShareItemService],
    reducers: reducers,
    actions: actions
});
__export(require("./social-share-items.routes"));
