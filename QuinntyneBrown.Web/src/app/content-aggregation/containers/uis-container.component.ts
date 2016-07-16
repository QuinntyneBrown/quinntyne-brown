import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "../actions/ui.actions";
import { UIActionCreator } from "../action-creators/ui.action-creator";
import { UI } from "../models/ui.model";

@Component({
    routes: ["/admin/uis","/admin/ui/edit/:uiId"],
    template: require("./uis-container.component.html"),
    styles: [require("./uis-container.component.scss")],
    selector: "uis-container",
    viewProviders: ["$location","$routeParams","uiActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "uiActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, uiActionCreator: UIActionCreator) => {
    let uiId = $route.current.params.uiId;
    let promises = [invokeAsync(uiActionCreator.all)];
    if (uiId) { promises.push(invokeAsync({ action: uiActionCreator.getById, params: { id: uiId } })) };
    return $q.all(promises);
}])
export class UIsContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private uiActionCreator: UIActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.uis;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentUIAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/uis");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentUIAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/ui/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateUIAction)
            this.entity = new UI();

        if (state.lastTriggeredByAction instanceof actions.RemoveUIAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["uiId"]), items: this.entities }) as UI;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/uis"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["uiId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["uiId"]), items: this.entities }) as UI;
        } else {
            this.entity = new UI();
        }
    }

    edit = entity => this.uiActionCreator.edit(entity);
    remove = entity => this.uiActionCreator.remove(entity);
    create = entity => this.uiActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.uiActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/uis") {
                this.entity = new UI();
            } else {
                this.$location.path("/admin/uis")
            }
        });        
    };
    entity: UI;
    entities: Array<UI>;
}
