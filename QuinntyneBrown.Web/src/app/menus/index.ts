import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { MenuEditorComponent } from "./menu-editor.component";
import { MenuListComponent } from "./menu-list.component";
import { MenuComponent } from "./menu.component";
import { MenusContainerComponent } from "./menus-container.component";
import { MenuActionCreator } from "./menu.action-creator";
import { MenuService } from "./menu.service";
import *  as reducers from "./menu.reducers";
import *  as actions from "./menu.actions";

const appMenusModule = angular.module("quinntynebrown.menus", []);

bootstrap(appMenusModule, {
    components: [MenuComponent, MenuEditorComponent, MenusContainerComponent, MenuListComponent],
    providers: [MenuActionCreator, MenuService],
    reducers: reducers,
    actions: actions
});

export * from "./menus.routes";
