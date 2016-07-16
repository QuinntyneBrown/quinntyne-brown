import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllSocialShareItemsAction, RemoveSocialShareItemAction, SocialShareItemsFilterAction, SetCurrentSocialShareItemAction,AddOrUpdateSocialShareItemAction, AddOrUpdateSocialShareItemSuccessAction, CurrentSocialShareItemRemovedAction } from "./social-share-item.actions";

@Service({
    serviceName: "socialShareItemActionCreator",
    viewProviders: ["$location", "dispatcher", "socialShareItemService", "guid", "invokeAsync","modalActionCreator"]
})
export class SocialShareItemActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, socialShareItemService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,socialShareItemService,dispatcher,guid,AddOrUpdateSocialShareItemAction,AllSocialShareItemsAction,RemoveSocialShareItemAction,SetCurrentSocialShareItemAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateSocialShareItemSuccessAction(options.entity));

    currentSocialShareItemRemoved = () => this.dispatcher.dispatch(new CurrentSocialShareItemRemovedAction());

    openAllSocialShareItemsModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-social-share-item-modal></all-social-share-item-modal>" });
        });
    }
}



