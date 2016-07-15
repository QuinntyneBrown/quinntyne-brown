import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllProductsAction, RemoveProductAction, ProductsFilterAction, SetCurrentProductAction,AddOrUpdateProductAction, AddOrUpdateProductSuccessAction, CurrentProductRemovedAction } from "./product.actions";

@Service({
    serviceName: "productActionCreator",
    viewProviders: ["$location", "dispatcher", "productService", "guid", "invokeAsync","modalActionCreator"]
})
export class ProductActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, productService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,productService,dispatcher,guid,AddOrUpdateProductAction,AllProductsAction,RemoveProductAction,SetCurrentProductAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateProductSuccessAction(options.entity));

    currentProductRemoved = () => this.dispatcher.dispatch(new CurrentProductRemovedAction());

    openAllProductsModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-product-modal></all-product-modal>" });
        });
    }
}



