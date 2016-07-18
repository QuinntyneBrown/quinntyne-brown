import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { PhotoEditorComponent } from "./photo-editor.component";
import { PhotoListComponent } from "./photo-list.component";
import { PhotoComponent } from "./photo.component";
import { PhotosContainerComponent } from "./photos-container.component";
import { PhotoActionCreator } from "./photo.action-creator";
import { PhotoService } from "./photo.service";
import *  as reducers from "./photo.reducers";
import *  as actions from "./photo.actions";

const appPhotosModule = angular.module("app.photos", []);

bootstrap(appPhotosModule, {
    components: [PhotoComponent, PhotoEditorComponent, PhotosContainerComponent, PhotoListComponent],
    providers: [PhotoActionCreator, PhotoService],
    reducers: reducers,
    actions: actions
});

export * from "./photos.routes";
