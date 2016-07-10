require("angular-rx-ui/src/components/core");

import { provide, provideAction } from "angular-rx-ui/src/components/core";
import { CustomerComponent } from "./customer.component";
import { CustomerActionCreator } from "./customer.action-creator";
import *  as reducers from "./customer.reducers";
import *  as actions from "./customer.actions";

var app = (<any>angular.module("app.customer", [
    "app.core"    
]));

provide(app,CustomerActionCreator);

app.component(CustomerComponent);

app.config(["reducersProvider", reducersProvider => {	
    for (var reducer in reducers) { reducersProvider.configure(reducers[reducer]); }
}]);

for (var action in actions) { provideAction(app, actions[action]); }
