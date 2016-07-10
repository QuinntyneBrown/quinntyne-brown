import { provide, provideAction, bootstrap } from "angular-rx-ui/src/components/core";
import { PhotoComponent } from "./photo.component";
import { PhotoEditorContainerComponent } from "./photo-editor-container.component";
import { PhotoActionCreator } from "./photo.action-creator";
import * as reducers from "./photo.reducers";
import * as actions from "./photo.actions";

let photosModule = (<any>angular.module("quinntynebrown.photos", []));

bootstrap(photosModule, {
    components: [PhotoComponent, PhotoEditorContainerComponent],
    providers: [PhotoActionCreator],
    reducers: reducers,
    actions: actions
});

export * from "./photos.routes";

