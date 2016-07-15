import { bootstrap } from "angular-rx-ui/src/components/core";
import * as appActions from "./app.actions";
import * as propertyActions from "./property.actions";
import * as sectionActions from "./section.actions";
import * as uiActions from "./ui.actions";

const contentAggregationActionsModule = angular.module("app.contentAggregation.actions", []);

bootstrap(contentAggregationActionsModule, {
    actions:[appActions, propertyActions, sectionActions, uiActions]
});
