"use strict";
var contact_container_component_1 = require("./contact-container.component");
var contacts_container_component_1 = require("./contacts-container.component");
exports.ContactsRoutes = [
    {
        path: "/contact",
        component: contact_container_component_1.ContactContainerComponent
    },
    {
        path: "/admin/contacts",
        component: contacts_container_component_1.ContactsContainerComponent,
        authorizationRequired: true
    }
];
