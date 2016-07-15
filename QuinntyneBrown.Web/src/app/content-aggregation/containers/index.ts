import { bootstrap } from "angular-rx-ui/src/components/core";
import { AppsContainerComponent } from "./apps-container.component";
import { PropertiesContainerComponent } from "./properties-container.component";
import { SectionsContainerComponent } from "./sections-container.component";
import { UIsContainerComponent } from "./uis-container.component";

const contentAggregationContainersModule = angular.module("app.contentAggregation.containers", []);

bootstrap(contentAggregationContainersModule, {
    components: [
        AppsContainerComponent,
        PropertiesContainerComponent,
        SectionsContainerComponent,
        UIsContainerComponent
    ]
});

export * from "./apps-container.component";
export * from "./properties-container.component";
export * from "./sections-container.component";
export * from "./uis-container.component";