import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllMenusAction, RemoveMenuAction, MenusFilterAction, SetCurrentMenuAction,AddOrUpdateMenuAction, AddOrUpdateMenuSuccessAction, CurrentMenuRemovedAction } from "./menu.actions";

@Service({
    serviceName: "menuActionCreator",
    viewProviders: ["$location", "dispatcher", "menuService", "guid", "invokeAsync","modalActionCreator"]
})
export class MenuActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, menuService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,menuService,dispatcher,guid,AddOrUpdateMenuAction,AllMenusAction,RemoveMenuAction,SetCurrentMenuAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateMenuSuccessAction(options.entity));

    currentMenuRemoved = () => this.dispatcher.dispatch(new CurrentMenuRemovedAction());

    openAllMenusModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-menu-modal></all-menu-modal>" });
        });
    }
}



