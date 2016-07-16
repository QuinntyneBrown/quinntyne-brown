import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "../actions/section.actions";
import { SectionActionCreator } from "../action-creators/section.action-creator";
import { Section } from "../models/section.model";

@Component({
    routes: ["/admin/sections","/admin/section/edit/:sectionId"],
    template: require("./sections-container.component.html"),
    styles: [require("./sections-container.component.scss")],
    selector: "sections-container",
    viewProviders: ["$location","$routeParams","sectionActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "sectionActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, sectionActionCreator: SectionActionCreator) => {
    let sectionId = $route.current.params.sectionId;
    let promises = [invokeAsync(sectionActionCreator.all)];
    if (sectionId) { promises.push(invokeAsync({ action: sectionActionCreator.getById, params: { id: sectionId } })) };
    return $q.all(promises);
}])
export class SectionsContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private sectionActionCreator: SectionActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.sections;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentSectionAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/sections");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentSectionAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/section/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateSectionAction)
            this.entity = new Section();

        if (state.lastTriggeredByAction instanceof actions.RemoveSectionAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["sectionId"]), items: this.entities }) as Section;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/sections"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["sectionId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["sectionId"]), items: this.entities }) as Section;
        } else {
            this.entity = new Section();
        }
    }

    edit = entity => this.sectionActionCreator.edit(entity);
    remove = entity => this.sectionActionCreator.remove(entity);
    create = entity => this.sectionActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.sectionActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/sections") {
                this.entity = new Section();
            } else {
                this.$location.path("/admin/sections")
            }
        });        
    };
    entity: Section;
    entities: Array<Section>;
}
