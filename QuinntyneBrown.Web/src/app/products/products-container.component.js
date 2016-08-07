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
var actions = require("./product.actions");
var product_action_creator_1 = require("./product.action-creator");
var product_model_1 = require("./product.model");
var ProductsContainerComponent = (function () {
    function ProductsContainerComponent($location, $routeParams, productActionCreator, _invokeAsync) {
        var _this = this;
        this.$location = $location;
        this.$routeParams = $routeParams;
        this.productActionCreator = productActionCreator;
        this._invokeAsync = _invokeAsync;
        this.storeOnChange = function (state) {
            _this.entities = state.products;
            if (state.lastTriggeredByAction instanceof actions.SetCurrentProductAction && !state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/products");
            if (state.lastTriggeredByAction instanceof actions.SetCurrentProductAction && state.lastTriggeredByAction.entity)
                _this.$location.path("/admin/product/edit/" + state.lastTriggeredByAction.entity.id);
            if (state.lastTriggeredByAction instanceof actions.AddOrUpdateProductAction)
                _this.entity = new product_model_1.Product();
            if (state.lastTriggeredByAction instanceof actions.RemoveProductAction && _this.entity && _this.entity.id) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["productId"]), items: _this.entities });
                if (Object.keys(_this.entity).length === 0) {
                    _this.$location.path("/admin/products");
                }
            }
        };
        this.ngOnInit = function () {
            if (_this.$routeParams["productId"]) {
                _this.entity = core_1.pluck({ value: Number(_this.$routeParams["productId"]), items: _this.entities });
            }
            else {
                _this.entity = new product_model_1.Product();
            }
        };
        this.edit = function (entity) { return _this.productActionCreator.edit(entity); };
        this.remove = function (entity) { return _this.productActionCreator.remove(entity); };
        this.create = function (entity) { return _this.productActionCreator.create(); };
        this.addOrUpdate = function (options) {
            _this._invokeAsync({
                action: _this.productActionCreator.addOrUpdate,
                params: { data: options.data }
            }).then(function () {
                if (_this.$location.path() === "/admin/products") {
                    _this.entity = new product_model_1.Product();
                }
                else {
                    _this.$location.path("/admin/products");
                }
            });
        };
    }
    ProductsContainerComponent = __decorate([
        core_1.Component({
            routes: ["/admin/products", "/admin/product/edit/:productId"],
            template: require("./products-container.component.html"),
            styles: [require("./products-container.component.scss")],
            selector: "products-container",
            viewProviders: ["$location", "$routeParams", "productActionCreator", "invokeAsync"],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }),
        core_1.CanActivate(["$q", "$route", "invokeAsync", "productActionCreator", function ($q, $route, invokeAsync, productActionCreator) {
                var productId = $route.current.params.productId;
                var promises = [invokeAsync(productActionCreator.all)];
                if (productId) {
                    promises.push(invokeAsync({ action: productActionCreator.getById, params: { id: productId } }));
                }
                ;
                return $q.all(promises);
            }]), 
        __metadata('design:paramtypes', [Object, Object, product_action_creator_1.ProductActionCreator, Object])
    ], ProductsContainerComponent);
    return ProductsContainerComponent;
}());
exports.ProductsContainerComponent = ProductsContainerComponent;
