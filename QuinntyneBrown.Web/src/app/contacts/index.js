"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var contact_container_component_1 = require("./contact-container.component");
var contacts_container_component_1 = require("./contacts-container.component");
var contact_editor_component_1 = require("./contact-editor.component");
var contact_action_creator_1 = require("./contact.action-creator");
var contact_service_1 = require("./contact.service");
var contactsModule = angular.module("quinntynebrown.contacts", []);
core_1.bootstrap(contactsModule, {
    components: [contact_container_component_1.ContactContainerComponent, contacts_container_component_1.ContactsContainerComponent, contact_editor_component_1.ContactEditorComponent],
    providers: [contact_action_creator_1.ContactActionCreator, contact_service_1.ContactService]
});
__export(require("./contacts.routes"));
