"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var product_editor_component_1 = require("./product-editor.component");
var product_list_component_1 = require("./product-list.component");
var product_component_1 = require("./product.component");
var products_container_component_1 = require("./products-container.component");
var product_action_creator_1 = require("./product.action-creator");
var product_service_1 = require("./product.service");
var reducers = require("./product.reducers");
var actions = require("./product.actions");
var quinntynebrownProductsModule = angular.module("quinntynebrown.products", []);
core_1.bootstrap(quinntynebrownProductsModule, {
    components: [product_component_1.ProductComponent, product_editor_component_1.ProductEditorComponent, products_container_component_1.ProductsContainerComponent, product_list_component_1.ProductListComponent],
    providers: [product_action_creator_1.ProductActionCreator, product_service_1.ProductService],
    reducers: reducers,
    actions: actions
});
__export(require("./products.routes"));
