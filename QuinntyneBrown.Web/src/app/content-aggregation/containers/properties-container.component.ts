import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";
import * as actions from "../actions/property.actions";
import { PropertyActionCreator } from "../action-creators/property.action-creator";
import { pluck } from "angular-rx-ui/src/components/core/pluck";
import { Property } from "../models/property.model";

@Component({
    routes: ["/admin/properties","/admin/property/edit/:propertyId"],
    template: require("./properties-container.component.html"),
    styles: [require("./properties-container.component.scss")],
    selector: "properties-container",
    viewProviders: ["$location","$routeParams","propertyActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "propertyActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, propertyActionCreator: PropertyActionCreator) => {
    var propertyId = $route.current.params.propertyId;
    var promises = [invokeAsync(propertyActionCreator.all)];
    if (propertyId) { promises.push(invokeAsync({ action: propertyActionCreator.getById, params: { id: propertyId } })) };
    return $q.all(promises);
}])
export class PropertiesContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private propertyActionCreator: PropertyActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.properties;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentPropertyAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/properties");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentPropertyAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/property/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdatePropertyAction)
            this.entity = new Property();

        if (state.lastTriggeredByAction instanceof actions.RemovePropertyAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["propertyId"]), items: this.entities }) as Property;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/properties"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["propertyId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["propertyId"]), items: this.entities }) as Property;
        } else {
            this.entity = new Property();
        }
    }

    edit = entity => this.propertyActionCreator.edit(entity);
    remove = entity => this.propertyActionCreator.remove(entity);
    create = entity => this.propertyActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.propertyActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/properties") {
                this.entity = new Property();
            } else {
                this.$location.path("/admin/properties")
            }
        });        
    };
    entity: Property;
    entities: Array<Property>;
}
