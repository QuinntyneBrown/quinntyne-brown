import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import {
    AllUIsAction,
    RemoveUIAction,
    UIsFilterAction,
    SetCurrentUIAction,
    AddOrUpdateUIAction,
    AddOrUpdateUISuccessAction,
    CurrentUIRemovedAction
} from "../actions/ui.actions";

@Service({
    serviceName: "uiActionCreator",
    viewProviders: ["$location", "dispatcher", "uiService", "guid", "invokeAsync","modalActionCreator"]
})
export class UIActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, uiService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,uiService,dispatcher,guid,AddOrUpdateUIAction,AllUIsAction,RemoveUIAction,SetCurrentUIAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateUISuccessAction(options.entity));

    currentUiRemoved = () => this.dispatcher.dispatch(new CurrentUIRemovedAction());

    openAllUisModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-ui-modal></all-ui-modal>" });
        });
    }
}



