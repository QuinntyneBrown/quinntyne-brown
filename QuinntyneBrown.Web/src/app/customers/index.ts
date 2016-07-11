import { provide, provideAction, bootstrap } from "angular-rx-ui/src/components/core";
import { CustomerComponent } from "./customer.component";
import { CustomerActionCreator } from "./customer.action-creator";
import *  as reducers from "./customer.reducers";
import *  as actions from "./customer.actions";

let customersModule = (<any>angular.module("quinntynebrown.customers", []));

bootstrap(customersModule, {
    components: [CustomerComponent],
    providers: [CustomerActionCreator],
    reducers: reducers,
    actions: actions
});

export * from "./customers.routes";