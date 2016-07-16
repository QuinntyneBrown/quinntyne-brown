import { provide, provideAction, bootstrap } from "angular-rx-ui/src/components/core";
import { SocialShareItemEditorComponent } from "./social-share-item-editor.component";
import { SocialShareItemListComponent } from "./social-share-item-list.component";
import { SocialShareItemComponent } from "./social-share-item.component";
import { SocialShareItemsContainerComponent } from "./social-share-items-container.component";
import { SocialShareItemActionCreator } from "./social-share-item.action-creator";
import { SocialShareItemService } from "./social-share-item.service";
import * as reducers from "./social-share-item.reducers";
import * as actions from "./social-share-item.actions";

const appSocialShareItemsModule = angular.module("quinntynebrown.socialShareItems", []);

bootstrap(appSocialShareItemsModule, {
    components: [SocialShareItemComponent, SocialShareItemEditorComponent, SocialShareItemsContainerComponent, SocialShareItemListComponent],
    providers: [SocialShareItemActionCreator, SocialShareItemService],
    reducers: reducers,
    actions: actions
});

export * from "./social-share-items.routes";
