import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import {
    AllAppsAction,
    RemoveAppAction,
    AppsFilterAction,
    SetCurrentAppAction,
    AddOrUpdateAppAction,
    AddOrUpdateAppSuccessAction,
    CurrentAppRemovedAction
} from "../actions/app.actions";

@Service({
    serviceName: "appActionCreator",
    viewProviders: ["$location", "dispatcher", "appService", "guid", "invokeAsync","modalActionCreator"]
})
export class AppActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, appService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,appService,dispatcher,guid,AddOrUpdateAppAction,AllAppsAction,RemoveAppAction,SetCurrentAppAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateAppSuccessAction(options.entity));

    currentAppRemoved = () => this.dispatcher.dispatch(new CurrentAppRemovedAction());

    openAllAppsModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-app-modal></all-app-modal>" });
        });
    }
}



