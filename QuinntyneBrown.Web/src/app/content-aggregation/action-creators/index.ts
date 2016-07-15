import { bootstrap } from "angular-rx-ui/src/components/core";
import { AppActionCreator } from "./app.action-creator";
import { PropertyActionCreator } from "./property.action-creator";
import { SectionActionCreator } from "./section.action-creator";
import { UIActionCreator } from "./ui.action-creator";

const contentAggregationActionCreatorsModule = angular.module("app.contentAggregation.action-creators", []);

bootstrap(contentAggregationActionCreatorsModule, {
    providers: [AppActionCreator, PropertyActionCreator, SectionActionCreator, UIActionCreator]
});
