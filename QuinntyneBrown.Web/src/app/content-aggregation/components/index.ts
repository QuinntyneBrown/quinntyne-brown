import { bootstrap } from "angular-rx-ui/src/components/core";

import { AppEditorComponent} from "./app-editor.component";
import { AppListComponent } from "./app-list.component";
import { AppComponent } from "./app.component";
import { PropertyEditorComponent } from "./property-editor.component";
import { PropertyListComponent } from "./property-list.component";
import { PropertyComponent } from "./property.component";
import { PropertyPagedListComponent } from "./property-paged-list.component";
import { PropertyPickerModalComponent } from "./property-picker-modal.component";
import { SectionEditorComponent } from "./section-editor.component";
import { SectionListComponent } from "./section-list.component";
import { SectionComponent } from "./section.component";
import { UIEditorComponent } from "./ui-editor.component";
import { UIListComponent } from "./ui-list.component";
import { UIComponent } from "./ui.component";

const contentAggregationComponentsModule = angular.module("app.contentAggregation.components", []);

bootstrap(contentAggregationComponentsModule, {
    components: [
        AppEditorComponent,
        AppListComponent,
        AppComponent,
        PropertyComponent,
        PropertyEditorComponent,
        PropertyListComponent,
        PropertyPagedListComponent,
        PropertyPickerModalComponent,
        SectionEditorComponent,
        SectionListComponent,
        SectionComponent,
        UIEditorComponent,
        UIListComponent,
        UIComponent
    ]
});
