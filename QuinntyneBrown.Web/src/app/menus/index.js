"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var menu_editor_component_1 = require("./menu-editor.component");
var menu_list_component_1 = require("./menu-list.component");
var menu_component_1 = require("./menu.component");
var menus_container_component_1 = require("./menus-container.component");
var menu_action_creator_1 = require("./menu.action-creator");
var menu_service_1 = require("./menu.service");
var reducers = require("./menu.reducers");
var actions = require("./menu.actions");
var appMenusModule = angular.module("quinntynebrown.menus", []);
core_1.bootstrap(appMenusModule, {
    components: [menu_component_1.MenuComponent, menu_editor_component_1.MenuEditorComponent, menus_container_component_1.MenusContainerComponent, menu_list_component_1.MenuListComponent],
    providers: [menu_action_creator_1.MenuActionCreator, menu_service_1.MenuService],
    reducers: reducers,
    actions: actions
});
__export(require("./menus.routes"));
