import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./menu-item.actions";
import { MenuItemActionCreator } from "./menu-item.action-creator";
import { MenuItem } from "./menu-item.model";

@Component({
    routes: ["/admin/menuitems","/admin/menuitem/edit/:menuItemId"],
    template: require("./menu-items-container.component.html"),
    styles: [require("./menu-items-container.component.scss")],
    selector: "menu-items-container",
    viewProviders: ["$location","$routeParams","menuItemActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "menuItemActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, menuItemActionCreator: MenuItemActionCreator) => {
    let menuItemId = $route.current.params.menuItemId;
    let promises = [invokeAsync(menuItemActionCreator.all)];
    if (menuItemId) { promises.push(invokeAsync({ action: menuItemActionCreator.getById, params: { id: menuItemId } })) };
    return $q.all(promises);
}])
export class MenuItemsContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private menuItemActionCreator: MenuItemActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.menuItems;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuItemAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/menuitems");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuItemAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/menuitem/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateMenuItemAction)
            this.entity = new MenuItem();

        if (state.lastTriggeredByAction instanceof actions.RemoveMenuItemAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["menuItemId"]), items: this.entities }) as MenuItem;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/menuitems"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["menuItemId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["menuItemId"]), items: this.entities }) as MenuItem;
        } else {
            this.entity = new MenuItem();
        }
    }

    edit = entity => this.menuItemActionCreator.edit(entity);
    remove = entity => this.menuItemActionCreator.remove(entity);
    create = entity => this.menuItemActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.menuItemActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/menuitems") {
                this.entity = new MenuItem();
            } else {
                this.$location.path("/admin/menuitems")
            }
        });        
    };
    entity: MenuItem;
    entities: Array<MenuItem>;
}
