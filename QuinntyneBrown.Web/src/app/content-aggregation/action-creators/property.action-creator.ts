import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import {
    AllPropertiesAction,
    RemovePropertyAction,
    PropertysFilterAction,
    SetCurrentPropertyAction,
    AddOrUpdatePropertyAction,
    AddOrUpdatePropertySuccessAction,
    CurrentPropertyRemovedAction
} from "../actions/property.actions";

@Service({
    serviceName: "propertyActionCreator",
    viewProviders: ["$location", "dispatcher", "propertyService", "guid", "invokeAsync","modalActionCreator"]
})
export class PropertyActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, propertyService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,propertyService,dispatcher,guid,AddOrUpdatePropertyAction,AllPropertiesAction,RemovePropertyAction,SetCurrentPropertyAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdatePropertySuccessAction(options.entity));

    currentPropertyRemoved = () => this.dispatcher.dispatch(new CurrentPropertyRemovedAction());

    openAllPropertysModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-property-modal></all-property-modal>" });
        });
    }
}



