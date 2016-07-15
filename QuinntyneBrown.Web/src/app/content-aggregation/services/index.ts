import { bootstrap } from "angular-rx-ui/src/components/core";
import { AppService } from "./app.service";
import { PropertyService } from "./property.service";
import { SectionService } from "./section.service";
import { UIService } from "./ui.service";

const contentAggregationServicesModule = angular.module("app.contentAggregation.services", []);

bootstrap(contentAggregationServicesModule, {
    providers: [AppService,PropertyService, SectionService, UIService]
});

export * from "./app.service";
export * from "./property.service";
export * from "./section.service";
export * from "./ui.service";
