import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllMenuItemsAction, RemoveMenuItemAction, MenuItemsFilterAction, SetCurrentMenuItemAction,AddOrUpdateMenuItemAction, AddOrUpdateMenuItemSuccessAction, CurrentMenuItemRemovedAction } from "./menu-item.actions";

@Service({
    serviceName: "menuItemActionCreator",
    viewProviders: ["$location", "dispatcher", "menuItemService", "guid", "invokeAsync","modalActionCreator"]
})
export class MenuItemActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, menuItemService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,menuItemService,dispatcher,guid,AddOrUpdateMenuItemAction,AllMenuItemsAction,RemoveMenuItemAction,SetCurrentMenuItemAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateMenuItemSuccessAction(options.entity));

    currentMenuItemRemoved = () => this.dispatcher.dispatch(new CurrentMenuItemRemovedAction());

    openAllMenuItemsModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-menu-item-modal></all-menu-item-modal>" });
        });
    }
}



