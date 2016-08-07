"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require("./action-creators");
require("./actions");
require("./components");
require("./containers");
require("./models");
require("./reducers");
require("./services");
var app = angular.module("app.contentAggregation", [
    "app.contentAggregation.action-creators",
    "app.contentAggregation.actions",
    "app.contentAggregation.components",
    "app.contentAggregation.containers",
    "app.contentAggregation.action-creators",
    "app.contentAggregation.reducers",
    "app.contentAggregation.services"
]);
__export(require("./content-aggregation.routes"));
