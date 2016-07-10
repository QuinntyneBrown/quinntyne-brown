import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { PhotographerComponent } from "./photographer.component";
import { PhotographerActionCreator } from "./photographer.action-creator";
import * as reducers from "./photographer.reducers";
import * as actions from "./photographer.actions";

let photographersModule = (<any>angular.module("quinntynebrown.photographers", []));

bootstrap(photographersModule, {
    components: [PhotographerComponent],
    providers: [PhotographerActionCreator],
    reducers: reducers,
    actions: actions
});

export * from "./photographers.routes";