"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var professional_service_editor_component_1 = require("./professional-service-editor.component");
var professional_service_list_component_1 = require("./professional-service-list.component");
var professional_service_component_1 = require("./professional-service.component");
var professional_services_container_component_1 = require("./professional-services-container.component");
var professional_service_action_creator_1 = require("./professional-service.action-creator");
var professional_service_service_1 = require("./professional-service.service");
var reducers = require("./professional-service.reducers");
var actions = require("./professional-service.actions");
var appProfessionalServicesModule = angular.module("app.professional-services", []);
core_1.bootstrap(appProfessionalServicesModule, {
    components: [professional_service_component_1.ProfessionalServiceComponent, professional_service_editor_component_1.ProfessionalServiceEditorComponent, professional_services_container_component_1.ProfessionalServicesContainerComponent, professional_service_list_component_1.ProfessionalServiceListComponent],
    providers: [professional_service_action_creator_1.ProfessionalServiceActionCreator, professional_service_service_1.ProfessionalServiceService],
    reducers: reducers,
    actions: actions
});
__export(require("./professional-services.routes"));
