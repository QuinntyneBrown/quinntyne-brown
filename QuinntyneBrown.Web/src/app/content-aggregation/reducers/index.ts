import { bootstrap } from "angular-rx-ui/src/components/core";

import * as AppReducers from "./app.reducers";
import * as PropertyReducers from "./property.reducers";
import * as SectionReducers from "./section.reducers";
import * as UIReducers from "./ui.reducers";

const contentAggregationReducersModule = angular.module("app.contentAggregation.reducers", []);

bootstrap(contentAggregationReducersModule, {
    reducers:[AppReducers, PropertyReducers, SectionReducers, UIReducers]
});
