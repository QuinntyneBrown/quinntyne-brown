"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular-rx-ui/src/components/core");
var actions = require("./professional-service.actions");
var professional_service_action_creator_1 = require("./professional-service.action-creator");
var professional_service_model_1 = require("./professional-service.model");
var ProfessionalServicesContainerComponent = (function () {
    function ProfessionalServicesContainerComponent($location, $routeParams, professionalServiceActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.professionalServiceActionCreator = professionalServiceActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.professionalServices;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentProfessionalServiceAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/professionalservices");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentProfessionalServiceAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/professionalservice/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateProfessionalServiceAction)
                _this.entity = new professional_service_model_1.ProfessionalService();
            if (state.lastTriggeredByAction instanceof actions.RemoveProfessionalServiceAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["professionalServiceId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/professionalservices");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["professionalServiceId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["professionalServiceId"]), items: _this.entities });
            }
            else {
                _this.entity = new professional_service_model_1.ProfessionalService();
            }
        };
        this.edit = function (entity) { return _this.professionalServiceActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.professionalServiceActionCreator.remove(entity); };
        this.create = function (entity) { return _this.professionalServiceActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.professionalServiceActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/professionalservices") {
                    _this.entity = new professional_service_model_1.ProfessionalService();
                }
                else {
                    _this.$location.path("/admin/professionalservices");
                }
            });
        };
    }
    ProfessionalServicesContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/professionalservices", "/admin/professionalservice/edit/:professionalServiceId"],
            template: require("./professional-services-container.component.html"),
            styles: [require("./professional-services-container.component.scss")],
            selector: "professional-services-container",
            viewProviders: ["$location", "$routeParams", "professionalServiceActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "professionalServiceActionCreator", function ($q, $route, invokeAsync, professionalServiceActionCreator) {
                var professionalServiceId = $route.current.params.professionalServiceId;
                var promises = [invokeAsync(professionalServiceActionCreator.all)];
                if (professionalServiceId) {
                    promises.push(invokeAsync({ action: professionalServiceActionCreator.getById, params: { id: professionalServiceId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, professional_service_action_creator_1.ProfessionalServiceActionCreator, Object])
    ], ProfessionalServicesContainerComponent);
    return ProfessionalServicesContainerComponent;
}());
exports.ProfessionalServicesContainerComponent = ProfessionalServicesContainerComponent;
