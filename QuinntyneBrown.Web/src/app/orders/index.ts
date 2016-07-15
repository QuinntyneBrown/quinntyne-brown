import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { OrderEditorComponent } from "./order-editor.component";
import { OrderListComponent } from "./order-list.component";
import { OrderComponent } from "./order.component";
import { OrdersContainerComponent } from "./orders-container.component";
import { OrderActionCreator } from "./order.action-creator";
import { OrderService } from "./order.service";
import *  as reducers from "./order.reducers";
import *  as actions from "./order.actions";

const appOrdersModule = angular.module("quinntynebrown.orders", []);

bootstrap(appOrdersModule, {
    components: [OrderComponent, OrderEditorComponent, OrdersContainerComponent, OrderListComponent],
    providers: [OrderActionCreator, OrderService],
    reducers: reducers,
    actions: actions
});

export * from "./orders.routes";
