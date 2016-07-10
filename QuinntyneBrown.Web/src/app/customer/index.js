"use strict";
require("angular-rx-ui/src/components/core");
var core_1 = require("angular-rx-ui/src/components/core");
var customer_component_1 = require("./customer.component");
var customer_action_creator_1 = require("./customer.action-creator");
var reducers = require("./customer.reducers");
var actions = require("./customer.actions");
var app = angular.module("app.customer", [
    "app.core"
]);
core_1.provide(app, customer_action_creator_1.CustomerActionCreator);
app.component(customer_component_1.CustomerComponent);
app.config(["reducersProvider", function (reducersProvider) {
        for (var reducer in reducers) {
            reducersProvider.configure(reducers[reducer]);
        }
    }]);
for (var action in actions) {
    core_1.provideAction(app, actions[action]);
}
//# sourceMappingURL=index.js.map