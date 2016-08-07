"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var menu_item_editor_component_1 = require("./menu-item-editor.component");
var menu_item_list_component_1 = require("./menu-item-list.component");
var menu_item_component_1 = require("./menu-item.component");
var menu_items_container_component_1 = require("./menu-items-container.component");
var menu_item_action_creator_1 = require("./menu-item.action-creator");
var menu_item_service_1 = require("./menu-item.service");
var reducers = require("./menu-item.reducers");
var actions = require("./menu-item.actions");
var appMenuItemsModule = angular.module("quinntynebrown.menuItems", []);
core_1.bootstrap(appMenuItemsModule, {
    components: [menu_item_component_1.MenuItemComponent, menu_item_editor_component_1.MenuItemEditorComponent, menu_items_container_component_1.MenuItemsContainerComponent, menu_item_list_component_1.MenuItemListComponent],
    providers: [menu_item_action_creator_1.MenuItemActionCreator, menu_item_service_1.MenuItemService],
    reducers: reducers,
    actions: actions
});
__export(require("./menu-items.routes"));
