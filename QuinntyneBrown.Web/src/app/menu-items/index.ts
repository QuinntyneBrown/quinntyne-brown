import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { MenuItemEditorComponent } from "./menu-item-editor.component";
import { MenuItemListComponent } from "./menu-item-list.component";
import { MenuItemComponent } from "./menu-item.component";
import { MenuItemsContainerComponent } from "./menu-items-container.component";
import { MenuItemActionCreator } from "./menu-item.action-creator";
import { MenuItemService } from "./menu-item.service";
import * as reducers from "./menu-item.reducers";
import * as actions from "./menu-item.actions";

const appMenuItemsModule = angular.module("quinntynebrown.menu-items", []);

bootstrap(appMenuItemsModule, {
    components: [MenuItemComponent, MenuItemEditorComponent, MenuItemsContainerComponent, MenuItemListComponent],
    providers: [MenuItemActionCreator, MenuItemService],
    reducers: reducers,
    actions: actions
});

export * from "./menu-items.routes";
