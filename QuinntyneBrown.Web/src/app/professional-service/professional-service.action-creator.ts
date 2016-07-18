import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllProfessionalServicesAction, RemoveProfessionalServiceAction, ProfessionalServicesFilterAction, SetCurrentProfessionalServiceAction,AddOrUpdateProfessionalServiceAction, AddOrUpdateProfessionalServiceSuccessAction, CurrentProfessionalServiceRemovedAction } from "./professional-service.actions";

@Service({
    serviceName: "professionalServiceActionCreator",
    viewProviders: ["$location", "dispatcher", "professionalServiceService", "guid", "invokeAsync","modalActionCreator"]
})
export class ProfessionalServiceActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, professionalServiceService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,professionalServiceService,dispatcher,guid,AddOrUpdateProfessionalServiceAction,AllProfessionalServicesAction,RemoveProfessionalServiceAction,SetCurrentProfessionalServiceAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateProfessionalServiceSuccessAction(options.entity));

    currentProfessionalServiceRemoved = () => this.dispatcher.dispatch(new CurrentProfessionalServiceRemovedAction());

    openAllProfessionalServicesModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-professional-service-modal></all-professional-service-modal>" });
        });
    }
}



