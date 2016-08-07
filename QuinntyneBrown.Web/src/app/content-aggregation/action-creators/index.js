"use strict";
var core_1 = require("angular-rx-ui/src/components/core");
var app_action_creator_1 = require("./app.action-creator");
var property_action_creator_1 = require("./property.action-creator");
var section_action_creator_1 = require("./section.action-creator");
var ui_action_creator_1 = require("./ui.action-creator");
var contentAggregationActionCreatorsModule = angular.module("app.contentAggregation.action-creators", []);
core_1.bootstrap(contentAggregationActionCreatorsModule, {
    providers: [app_action_creator_1.AppActionCreator, property_action_creator_1.PropertyActionCreator, section_action_creator_1.SectionActionCreator, ui_action_creator_1.UIActionCreator]
});
