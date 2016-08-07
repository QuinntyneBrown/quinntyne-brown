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
var actions = require("./social-share-item.actions");
var social_share_item_action_creator_1 = require("./social-share-item.action-creator");
var social_share_item_model_1 = require("./social-share-item.model");
var SocialShareItemsContainerComponent = (function () {
    function SocialShareItemsContainerComponent($location, $routeParams, socialShareItemActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.socialShareItemActionCreator = socialShareItemActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.socialShareItems;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentSocialShareItemAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/socialshareitems");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentSocialShareItemAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/socialshareitem/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateSocialShareItemAction)
                _this.entity = new social_share_item_model_1.SocialShareItem();
            if (state.lastTriggeredByAction instanceof actions.RemoveSocialShareItemAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["socialShareItemId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/socialshareitems");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["socialShareItemId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["socialShareItemId"]), items: _this.entities });
            }
            else {
                _this.entity = new social_share_item_model_1.SocialShareItem();
            }
        };
        this.edit = function (entity) { return _this.socialShareItemActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.socialShareItemActionCreator.remove(entity); };
        this.create = function (entity) { return _this.socialShareItemActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.socialShareItemActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/socialshareitems") {
                    _this.entity = new social_share_item_model_1.SocialShareItem();
                }
                else {
                    _this.$location.path("/admin/socialshareitems");
                }
            });
        };
    }
    SocialShareItemsContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/socialshareitems", "/admin/socialshareitem/edit/:socialShareItemId"],
            template: require("./social-share-items-container.component.html"),
            styles: [require("./social-share-items-container.component.scss")],
            selector: "social-share-items-container",
            viewProviders: ["$location", "$routeParams", "socialShareItemActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "socialShareItemActionCreator", function ($q, $route, invokeAsync, socialShareItemActionCreator) {
                var socialShareItemId = $route.current.params.socialShareItemId;
                var promises = [invokeAsync(socialShareItemActionCreator.all)];
                if (socialShareItemId) {
                    promises.push(invokeAsync({ action: socialShareItemActionCreator.getById, params: { id: socialShareItemId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, social_share_item_action_creator_1.SocialShareItemActionCreator, Object])
    ], SocialShareItemsContainerComponent);
    return SocialShareItemsContainerComponent;
}());
exports.SocialShareItemsContainerComponent = SocialShareItemsContainerComponent;
