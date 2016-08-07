"use strict";
var core_1 = require("angular-rx-ui/src/components/core");
var appActions = require("./app.actions");
var propertyActions = require("./property.actions");
var sectionActions = require("./section.actions");
var uiActions = require("./ui.actions");
var contentAggregationActionsModule = angular.module("app.contentAggregation.actions", []);
core_1.bootstrap(contentAggregationActionsModule, {
    actions: [appActions, propertyActions, sectionActions, uiActions]
});
