"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var apps_container_component_1 = require("./apps-container.component");
var properties_container_component_1 = require("./properties-container.component");
var sections_container_component_1 = require("./sections-container.component");
var uis_container_component_1 = require("./uis-container.component");
var contentAggregationContainersModule = angular.module("app.contentAggregation.containers", []);
core_1.bootstrap(contentAggregationContainersModule, {
    components: [
        apps_container_component_1.AppsContainerComponent,
        properties_container_component_1.PropertiesContainerComponent,
        sections_container_component_1.SectionsContainerComponent,
        uis_container_component_1.UIsContainerComponent
    ]
});
__export(require("./apps-container.component"));
__export(require("./properties-container.component"));
__export(require("./sections-container.component"));
__export(require("./uis-container.component"));
