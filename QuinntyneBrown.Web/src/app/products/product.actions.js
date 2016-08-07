"use strict";
var AddOrUpdateProductAction = (function () {
    function AddOrUpdateProductAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return AddOrUpdateProductAction;
}());
exports.AddOrUpdateProductAction = AddOrUpdateProductAction;
var AllProductsAction = (function () {
    function AllProductsAction(id, entities) {
        this.id = id;
        this.entities = entities;
    }
    return AllProductsAction;
}());
exports.AllProductsAction = AllProductsAction;
var RemoveProductAction = (function () {
    function RemoveProductAction(id, entity) {
        this.id = id;
        this.entity = entity;
    }
    return RemoveProductAction;
}());
exports.RemoveProductAction = RemoveProductAction;
var ProductsFilterAction = (function () {
    function ProductsFilterAction(id, term) {
        this.id = id;
        this.term = term;
    }
    return ProductsFilterAction;
}());
exports.ProductsFilterAction = ProductsFilterAction;
var SetCurrentProductAction = (function () {
    function SetCurrentProductAction(entity) {
        this.entity = entity;
    }
    return SetCurrentProductAction;
}());
exports.SetCurrentProductAction = SetCurrentProductAction;
var AddOrUpdateProductSuccessAction = (function () {
    function AddOrUpdateProductSuccessAction(entity) {
        this.entity = entity;
    }
    return AddOrUpdateProductSuccessAction;
}());
exports.AddOrUpdateProductSuccessAction = AddOrUpdateProductSuccessAction;
var CurrentProductRemovedAction = (function () {
    function CurrentProductRemovedAction() {
    }
    return CurrentProductRemovedAction;
}());
exports.CurrentProductRemovedAction = CurrentProductRemovedAction;
