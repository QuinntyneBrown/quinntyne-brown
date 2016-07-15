import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllOrdersAction, RemoveOrderAction, OrdersFilterAction, SetCurrentOrderAction,AddOrUpdateOrderAction, AddOrUpdateOrderSuccessAction, CurrentOrderRemovedAction } from "./order.actions";

@Service({
    serviceName: "orderActionCreator",
    viewProviders: ["$location", "dispatcher", "orderService", "guid", "invokeAsync","modalActionCreator"]
})
export class OrderActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, orderService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,orderService,dispatcher,guid,AddOrUpdateOrderAction,AllOrdersAction,RemoveOrderAction,SetCurrentOrderAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateOrderSuccessAction(options.entity));

    currentOrderRemoved = () => this.dispatcher.dispatch(new CurrentOrderRemovedAction());

    openAllOrdersModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-order-modal></all-order-modal>" });
        });
    }
}



