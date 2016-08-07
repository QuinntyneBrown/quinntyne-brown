"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var app_service_1 = require("./app.service");
var property_service_1 = require("./property.service");
var section_service_1 = require("./section.service");
var ui_service_1 = require("./ui.service");
var contentAggregationServicesModule = angular.module("app.contentAggregation.services", []);
core_1.bootstrap(contentAggregationServicesModule, {
    providers: [app_service_1.AppService, property_service_1.PropertyService, section_service_1.SectionService, ui_service_1.UIService]
});
__export(require("./app.service"));
__export(require("./property.service"));
__export(require("./section.service"));
__export(require("./ui.service"));
