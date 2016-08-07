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
var actions = require("../actions/section.actions");
var section_action_creator_1 = require("../action-creators/section.action-creator");
var section_model_1 = require("../models/section.model");
var SectionsContainerComponent = (function () {
    function SectionsContainerComponent($location, $routeParams, sectionActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.sectionActionCreator = sectionActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.sections;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentSectionAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/sections");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentSectionAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/section/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateSectionAction)
                _this.entity = new section_model_1.Section();
            if (state.lastTriggeredByAction instanceof actions.RemoveSectionAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["sectionId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/sections");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["sectionId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["sectionId"]), items: _this.entities });
            }
            else {
                _this.entity = new section_model_1.Section();
            }
        };
        this.edit = function (entity) { return _this.sectionActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.sectionActionCreator.remove(entity); };
        this.create = function (entity) { return _this.sectionActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.sectionActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/sections") {
                    _this.entity = new section_model_1.Section();
                }
                else {
                    _this.$location.path("/admin/sections");
                }
            });
        };
    }
    SectionsContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/sections", "/admin/section/edit/:sectionId"],
            template: require("./sections-container.component.html"),
            styles: [require("./sections-container.component.scss")],
            selector: "sections-container",
            viewProviders: ["$location", "$routeParams", "sectionActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "sectionActionCreator", function ($q, $route, invokeAsync, sectionActionCreator) {
                var sectionId = $route.current.params.sectionId;
                var promises = [invokeAsync(sectionActionCreator.all)];
                if (sectionId) {
                    promises.push(invokeAsync({ action: sectionActionCreator.getById, params: { id: sectionId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, section_action_creator_1.SectionActionCreator, Object])
    ], SectionsContainerComponent);
    return SectionsContainerComponent;
}());
exports.SectionsContainerComponent = SectionsContainerComponent;
