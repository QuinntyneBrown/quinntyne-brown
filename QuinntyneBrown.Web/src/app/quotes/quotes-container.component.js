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
var actions = require("./quote.actions");
var quote_action_creator_1 = require("./quote.action-creator");
var quote_model_1 = require("./quote.model");
var QuotesContainerComponent = (function () {
    function QuotesContainerComponent($location, $routeParams, quoteActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.quoteActionCreator = quoteActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.quotes;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentQuoteAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/quotes");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentQuoteAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/quote/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateQuoteAction)
                _this.entity = new quote_model_1.Quote();
            if (state.lastTriggeredByAction instanceof actions.RemoveQuoteAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["quoteId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/quotes");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["quoteId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["quoteId"]), items: _this.entities });
            }
            else {
                _this.entity = new quote_model_1.Quote();
            }
        };
        this.edit = function (entity) { return _this.quoteActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.quoteActionCreator.remove(entity); };
        this.create = function (entity) { return _this.quoteActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.quoteActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/quotes") {
                    _this.entity = new quote_model_1.Quote();
                }
                else {
                    _this.$location.path("/admin/quotes");
                }
            });
        };
    }
    QuotesContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/quotes", "/admin/quote/edit/:quoteId"],
            template: require("./quotes-container.component.html"),
            styles: [require("./quotes-container.component.scss")],
            selector: "quotes-container",
            viewProviders: ["$location", "$routeParams", "quoteActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "quoteActionCreator", function ($q, $route, invokeAsync, quoteActionCreator) {
                var quoteId = $route.current.params.quoteId;
                var promises = [invokeAsync(quoteActionCreator.all)];
                if (quoteId) {
                    promises.push(invokeAsync({ action: quoteActionCreator.getById, params: { id: quoteId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, quote_action_creator_1.QuoteActionCreator, Object])
    ], QuotesContainerComponent);
    return QuotesContainerComponent;
}());
exports.QuotesContainerComponent = QuotesContainerComponent;
