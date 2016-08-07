"use strict";
var core_1 = require("angular-rx-ui/src/components/core");
var app_editor_component_1 = require("./app-editor.component");
var app_list_component_1 = require("./app-list.component");
var app_component_1 = require("./app.component");
var property_editor_component_1 = require("./property-editor.component");
var property_list_component_1 = require("./property-list.component");
var property_component_1 = require("./property.component");
var property_paged_list_component_1 = require("./property-paged-list.component");
var property_picker_modal_component_1 = require("./property-picker-modal.component");
var section_editor_component_1 = require("./section-editor.component");
var section_list_component_1 = require("./section-list.component");
var section_component_1 = require("./section.component");
var ui_editor_component_1 = require("./ui-editor.component");
var ui_list_component_1 = require("./ui-list.component");
var ui_component_1 = require("./ui.component");
var contentAggregationComponentsModule = angular.module("app.contentAggregation.components", []);
core_1.bootstrap(contentAggregationComponentsModule, {
    components: [
        app_editor_component_1.AppEditorComponent,
        app_list_component_1.AppListComponent,
        app_component_1.AppComponent,
        property_component_1.PropertyComponent,
        property_editor_component_1.PropertyEditorComponent,
        property_list_component_1.PropertyListComponent,
        property_paged_list_component_1.PropertyPagedListComponent,
        property_picker_modal_component_1.PropertyPickerModalComponent,
        section_editor_component_1.SectionEditorComponent,
        section_list_component_1.SectionListComponent,
        section_component_1.SectionComponent,
        ui_editor_component_1.UIEditorComponent,
        ui_list_component_1.UIListComponent,
        ui_component_1.UIComponent
    ]
});
