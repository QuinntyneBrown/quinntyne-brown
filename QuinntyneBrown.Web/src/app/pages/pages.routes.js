"use strict";
var biography_page_container_component_1 = require("./biography-page-container.component");
var thank_you_page_container_component_1 = require("./thank-you-page-container.component");
exports.PagesRoutes = [
    {
        path: "/about",
        component: biography_page_container_component_1.BiographyPageContainerComponent
    },
    {
        path: "/thankyou",
        component: thank_you_page_container_component_1.ThankYouPageContainerComponent
    }
];
