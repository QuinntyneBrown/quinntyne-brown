import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import {
    AllPropertiesAction,
    RemovePropertyAction,
    PropertysFilterAction,
    SetCurrentPropertyAction,
    AddOrUpdatePropertyAction,
    AddOrUpdatePropertySuccessAction,
    CurrentPropertyRemovedAction,
    PropertyPickedAction
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

    openPropertyPickerModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<property-picker-modal></property-picker-modal>" });
        });
    }

    pick = entity => this.dispatcher.dispatch(new PropertyPickedAction(entity));

    openEditPropertyModal = (options = { property: null }) => {
        this.modalActionCreator.open({ html: `<edit-property-modal property='${JSON.stringify(options.property)}'></edit-property-modal>` });
    }
}



