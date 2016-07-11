import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { ContactContainerComponent } from "./contact-container.component";
import { ContactActionCreator } from "./contact.action-creator";
import * as actions from "./contact.actions";
import {  } from "./contact.service";

let contactsModule = (<any>angular.module("quinntynebrown.contacts", []));

bootstrap(contactsModule, {
    components: [ContactContainerComponent],
});

export * from "./contacts.routes";