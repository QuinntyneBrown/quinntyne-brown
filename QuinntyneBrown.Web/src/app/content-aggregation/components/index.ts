import { bootstrap } from "angular-rx-ui/src/components/core";
import { PropertyEditorComponent } from "./property-editor.component";
import { PropertyListComponent } from "./property-list.component";
import { PropertyComponent } from "./property.component";

const contentAggregationComponentsModule = angular.module("app.contentAggregation.components", []);

bootstrap(contentAggregationComponentsModule, {
    components: [
        PropertyComponent,
        PropertyEditorComponent,
        PropertyListComponent
    ]
});
