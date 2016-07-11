import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import {
    AllContactsAction,
    RemoveContactAction,
    ContactsFilterAction,
    SetCurrentContactAction,
    AddOrUpdateContactSuccessAction,
    CurrentContactRemovedAction,
    AddOrUpdateContactAction
} from "./contact.actions";

@Service({
    serviceName: "contactActionCreator",
    viewProviders: ["$location", "dispatcher", "contactService", "guid", "invokeAsync","modalActionCreator"]
})
export class ContactActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, contactService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location, contactService, dispatcher, guid, AddOrUpdateContactAction,AllContactsAction,RemoveContactAction,SetCurrentContactAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateContactSuccessAction(options.entity));

    currentContactRemoved = () => this.dispatcher.dispatch(new CurrentContactRemovedAction());

    openAllContactsModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-contact-modal></all-contact-modal>" });
        });
    }
}



