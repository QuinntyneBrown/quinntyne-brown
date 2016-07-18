import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "../actions/app.actions";
import { PropertyPickedAction } from "../actions/property.actions";
import { AppActionCreator } from "../action-creators/app.action-creator";
import { App } from "../models/app.model";
import { PropertyActionCreator } from "../action-creators/property.action-creator";

@Component({
    routes: ["/admin/apps","/admin/app/edit/:appId"],
    template: require("./apps-container.component.html"),
    styles: [require("./apps-container.component.scss")],
    selector: "apps-container",
    viewProviders: ["$location","$routeParams","appActionCreator","invokeAsync","propertyActionCreator"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "appActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, appActionCreator: AppActionCreator) => {
    let appId = $route.current.params.appId;
    let promises = [invokeAsync(appActionCreator.all)];
    if (appId) { promises.push(invokeAsync({ action: appActionCreator.getById, params: { id: appId } })) };
    return $q.all(promises);
}])
export class AppsContainerComponent { 
    constructor(private $location: angular.ILocationService,
        private $routeParams: angular.route.IRouteParamsService,
        private appActionCreator: AppActionCreator,
        private _invokeAsync,
        private propertyActionCreator: PropertyActionCreator) { }
    storeOnChange = state => {        
        this.entities = state.apps;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentAppAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/apps");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentAppAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/app/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateAppAction)
            this.entity = new App();

        if (state.lastTriggeredByAction instanceof actions.RemoveAppAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["appId"]), items: this.entities }) as App;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/apps"); }
        }

        if (state.lastTriggeredByAction instanceof PropertyPickedAction && this.entity && this.entity.id) {
            this.entity.properties.push(state.lastTriggeredByAction.entity);
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["appId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["appId"]), items: this.entities }) as App;
        } else {
            this.entity = new App();
        }
    }

    edit = entity => this.appActionCreator.edit(entity);
    remove = entity => this.appActionCreator.remove(entity);
    create = entity => this.appActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.appActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/apps") {
                this.entity = new App();
            } else {
                this.$location.path("/admin/apps")
            }
        });        
    };
    addOrUpdateProperty = () => this.propertyActionCreator.openPropertyPickerModal();
    addOrUpdateUI = () => alert("add or update ui");
    entity: App;
    entities: Array<App>;
}
