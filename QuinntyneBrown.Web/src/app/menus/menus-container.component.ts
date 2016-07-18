import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./menu.actions";
import { MenuActionCreator } from "./menu.action-creator";
import { Menu } from "./menu.model";

@Component({
    routes: ["/admin/menus","/admin/menu/edit/:menuId"],
    template: require("./menus-container.component.html"),
    styles: [require("./menus-container.component.scss")],
    selector: "menus-container",
    viewProviders: ["$location","$routeParams","menuActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "menuActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, menuActionCreator: MenuActionCreator) => {
    let menuId = $route.current.params.menuId;
    let promises = [invokeAsync(menuActionCreator.all)];
    if (menuId) { promises.push(invokeAsync({ action: menuActionCreator.getById, params: { id: menuId } })) };
    return $q.all(promises);
}])
export class MenusContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private menuActionCreator: MenuActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.menus;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/menus");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentMenuAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/menu/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateMenuAction)
            this.entity = new Menu();

        if (state.lastTriggeredByAction instanceof actions.RemoveMenuAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["menuId"]), items: this.entities }) as Menu;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/menus"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["menuId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["menuId"]), items: this.entities }) as Menu;
        } else {
            this.entity = new Menu();
        }
    }

    edit = entity => this.menuActionCreator.edit(entity);
    remove = entity => this.menuActionCreator.remove(entity);
    create = entity => this.menuActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.menuActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/menus") {
                this.entity = new Menu();
            } else {
                this.$location.path("/admin/menus")
            }
        });        
    };
    entity: Menu;
    entities: Array<Menu>;
}
