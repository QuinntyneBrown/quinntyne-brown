import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./professional-service.actions";
import { ProfessionalServiceActionCreator } from "./professional-service.action-creator";
import { ProfessionalService } from "./professional-service.model";

@Component({
    routes: ["/admin/professionalservices","/admin/professionalservice/edit/:professionalServiceId"],
    template: require("./professional-services-container.component.html"),
    styles: [require("./professional-services-container.component.scss")],
    selector: "professional-services-container",
    viewProviders: ["$location","$routeParams","professionalServiceActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "professionalServiceActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, professionalServiceActionCreator: ProfessionalServiceActionCreator) => {
    let professionalServiceId = $route.current.params.professionalServiceId;
    let promises = [invokeAsync(professionalServiceActionCreator.all)];
    if (professionalServiceId) { promises.push(invokeAsync({ action: professionalServiceActionCreator.getById, params: { id: professionalServiceId } })) };
    return $q.all(promises);
}])
export class ProfessionalServicesContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private professionalServiceActionCreator: ProfessionalServiceActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.professionalServices;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentProfessionalServiceAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/professionalservices");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentProfessionalServiceAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/professionalservice/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateProfessionalServiceAction)
            this.entity = new ProfessionalService();

        if (state.lastTriggeredByAction instanceof actions.RemoveProfessionalServiceAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["professionalServiceId"]), items: this.entities }) as ProfessionalService;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/professionalservices"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["professionalServiceId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["professionalServiceId"]), items: this.entities }) as ProfessionalService;
        } else {
            this.entity = new ProfessionalService();
        }
    }

    edit = entity => this.professionalServiceActionCreator.edit(entity);
    remove = entity => this.professionalServiceActionCreator.remove(entity);
    create = entity => this.professionalServiceActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.professionalServiceActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/professionalservices") {
                this.entity = new ProfessionalService();
            } else {
                this.$location.path("/admin/professionalservices")
            }
        });        
    };
    entity: ProfessionalService;
    entities: Array<ProfessionalService>;
}
