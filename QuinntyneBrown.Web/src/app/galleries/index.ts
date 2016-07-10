import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { GalleryComponent } from "./gallery.component";
import { GalleriesContainerComponent } from "./galleries-container.component";
import { GalleryEditorContainerComponent } from "./gallery-editor-container.component";
import { GalleryActionCreator } from "./gallery.action-creator";
import * as reducers from "./gallery.reducers";
import * as actions from "./gallery.actions";

let galleriesModule = (<any>angular.module("quinntynebrown.galleries", []));

bootstrap(galleriesModule, {
    components: [GalleryComponent, GalleryEditorContainerComponent, GalleriesContainerComponent],
    providers: [GalleryActionCreator],
    reducers: reducers,
    actions: actions
});

export * from "./galleries.routes";