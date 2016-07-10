import { provide, provideAction, bootstrap } from "angular-rx-ui/src/components/core";
import { PhotoComponent } from "./photo.component";
import { PhotoActionCreator } from "./photo.action-creator";
import * as reducers from "./photo.reducers";
import * as actions from "./photo.actions";

let photosModule = (<any>angular.module("app.photo", []));

bootstrap(photosModule, {
    components: [PhotoComponent],
    providers: [PhotoActionCreator],
    reducers: reducers,
    actions: actions
});

