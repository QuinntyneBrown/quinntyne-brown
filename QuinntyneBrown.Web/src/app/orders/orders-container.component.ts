import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./order.actions";
import { OrderActionCreator } from "./order.action-creator";
import { Order } from "./order.model";

@Component({
    routes: ["/admin/orders","/admin/order/edit/:orderId"],
    template: require("./orders-container.component.html"),
    styles: [require("./orders-container.component.scss")],
    selector: "orders-container",
    viewProviders: ["$location","$routeParams","orderActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "orderActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, orderActionCreator: OrderActionCreator) => {
    var orderId = $route.current.params.orderId;
    var promises = [invokeAsync(orderActionCreator.all)];
    if (orderId) { promises.push(invokeAsync({ action: orderActionCreator.getById, params: { id: orderId } })) };
    return $q.all(promises);
}])
export class OrdersContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private orderActionCreator: OrderActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.orders;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentOrderAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/orders");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentOrderAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/order/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateOrderAction)
            this.entity = new Order();

        if (state.lastTriggeredByAction instanceof actions.RemoveOrderAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["orderId"]), items: this.entities }) as Order;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/orders"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["orderId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["orderId"]), items: this.entities }) as Order;
        } else {
            this.entity = new Order();
        }
    }

    edit = entity => this.orderActionCreator.edit(entity);
    remove = entity => this.orderActionCreator.remove(entity);
    create = entity => this.orderActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.orderActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/orders") {
                this.entity = new Order();
            } else {
                this.$location.path("/admin/orders")
            }
        });        
    };
    entity: Order;
    entities: Array<Order>;
}
