import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import {
    AllSectionsAction,
    RemoveSectionAction,
    SectionsFilterAction,
    SetCurrentSectionAction,
    AddOrUpdateSectionAction,
    AddOrUpdateSectionSuccessAction,
    CurrentSectionRemovedAction
} from "../actions/section.actions";

@Service({
    serviceName: "sectionActionCreator",
    viewProviders: ["$location", "dispatcher", "sectionService", "guid", "invokeAsync","modalActionCreator"]
})
export class SectionActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, sectionService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,sectionService,dispatcher,guid,AddOrUpdateSectionAction,AllSectionsAction,RemoveSectionAction,SetCurrentSectionAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateSectionSuccessAction(options.entity));

    currentSectionRemoved = () => this.dispatcher.dispatch(new CurrentSectionRemovedAction());

    openAllSectionsModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-section-modal></all-section-modal>" });
        });
    }
}



