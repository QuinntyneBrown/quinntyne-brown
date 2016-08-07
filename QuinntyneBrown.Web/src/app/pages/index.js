"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var article_page_container_component_1 = require("./article-page-container.component");
var biography_page_container_component_1 = require("./biography-page-container.component");
var checkout_page_container_component_1 = require("./checkout-page-container.component");
var home_page_container_component_1 = require("./home-page-container.component");
var purchase_page_container_component_1 = require("./purchase-page-container.component");
var thank_you_page_container_component_1 = require("./thank-you-page-container.component");
var pagesModule = angular.module("quinntynebrown.pages", []);
core_1.bootstrap(pagesModule, {
    components: [
        article_page_container_component_1.ArticlePageContainerComponent,
        biography_page_container_component_1.BiographyPageContainerComponent,
        checkout_page_container_component_1.CheckoutPageContainerComponent,
        home_page_container_component_1.HomePageContainerComponent,
        purchase_page_container_component_1.PurchasePageContainerComponent,
        thank_you_page_container_component_1.ThankYouPageContainerComponent
    ]
});
__export(require("./pages.routes"));
