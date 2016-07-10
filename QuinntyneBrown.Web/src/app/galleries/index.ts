import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { GalleryComponent } from "./gallery.component";
import { GalleryActionCreator } from "./gallery.action-creator";
import * as reducers from "./gallery.reducers";
import * as actions from "./gallery.actions";

let galleriesModule = (<any>angular.module("quinntynebrown.gallery", []));

bootstrap(galleriesModule, {
    components: [GalleryComponent],
    providers: [GalleryActionCreator],
    reducers: reducers,
    actions: actions
});
