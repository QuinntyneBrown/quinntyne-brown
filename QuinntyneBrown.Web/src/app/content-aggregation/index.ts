require("./action-creators");
require("./actions");
require("./components");
require("./containers");
require("./models");
require("./reducers");
require("./services");

var app = (<any>angular.module("app.contentAggregation", [
    "app.contentAggregation.action-creators",
    "app.contentAggregation.actions",
    "app.contentAggregation.components",
    "app.contentAggregation.containers",
    "app.contentAggregation.action-creators",
    "app.contentAggregation.reducers",
    "app.contentAggregation.services"    
]));

export * from "./content-aggregation.routes";