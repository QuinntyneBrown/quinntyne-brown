"use strict";
require("angular-rx-ui/src/components/core");
var core_1 = require("angular-rx-ui/src/components/core");
var customer_component_1 = require("./customer.component");
var customer_action_creator_1 = require("./customer.action-creator");
var reducers = require("./customer.reducers");
var actions = require("./customer.actions");
var customersModule = angular.module("app.customer", []);
core_1.bootstrap(customersModule, {
    components: [customer_component_1.CustomerComponent],
    providers: [customer_action_creator_1.CustomerActionCreator],
    reducers: reducers,
    actions: actions
});
//# sourceMappingURL=index.js.map