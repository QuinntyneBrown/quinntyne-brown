import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./social-share-item.actions";
import { SocialShareItemActionCreator } from "./social-share-item.action-creator";
import { SocialShareItem } from "./social-share-item.model";

@Component({
    routes: ["/admin/socialshareitems","/admin/socialshareitem/edit/:socialShareItemId"],
    template: require("./social-share-items-container.component.html"),
    styles: [require("./social-share-items-container.component.scss")],
    selector: "social-share-items-container",
    viewProviders: ["$location","$routeParams","socialShareItemActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "socialShareItemActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, socialShareItemActionCreator: SocialShareItemActionCreator) => {
    let socialShareItemId = $route.current.params.socialShareItemId;
    let promises = [invokeAsync(socialShareItemActionCreator.all)];
    if (socialShareItemId) { promises.push(invokeAsync({ action: socialShareItemActionCreator.getById, params: { id: socialShareItemId } })) };
    return $q.all(promises);
}])
export class SocialShareItemsContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private socialShareItemActionCreator: SocialShareItemActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.socialShareItems;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentSocialShareItemAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/socialshareitems");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentSocialShareItemAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/socialshareitem/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateSocialShareItemAction)
            this.entity = new SocialShareItem();

        if (state.lastTriggeredByAction instanceof actions.RemoveSocialShareItemAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["socialShareItemId"]), items: this.entities }) as SocialShareItem;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/socialshareitems"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["socialShareItemId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["socialShareItemId"]), items: this.entities }) as SocialShareItem;
        } else {
            this.entity = new SocialShareItem();
        }
    }

    edit = entity => this.socialShareItemActionCreator.edit(entity);
    remove = entity => this.socialShareItemActionCreator.remove(entity);
    create = entity => this.socialShareItemActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.socialShareItemActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/socialshareitems") {
                this.entity = new SocialShareItem();
            } else {
                this.$location.path("/admin/socialshareitems")
            }
        });        
    };
    entity: SocialShareItem;
    entities: Array<SocialShareItem>;
}
