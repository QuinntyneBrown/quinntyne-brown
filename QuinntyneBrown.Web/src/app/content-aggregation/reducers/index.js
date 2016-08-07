"use strict";
var core_1 = require("angular-rx-ui/src/components/core");
var AppReducers = require("./app.reducers");
var PropertyReducers = require("./property.reducers");
var SectionReducers = require("./section.reducers");
var UIReducers = require("./ui.reducers");
var contentAggregationReducersModule = angular.module("app.contentAggregation.reducers", []);
core_1.bootstrap(contentAggregationReducersModule, {
    reducers: [AppReducers, PropertyReducers, SectionReducers, UIReducers]
});
