import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { ContactContainerComponent } from "./contact-container.component";
import { ContactsContainerComponent } from "./contacts-container.component";
import { ContactEditorComponent } from "./contact-editor.component";
import { ContactActionCreator } from "./contact.action-creator";
import * as actions from "./contact.actions";
import { ContactService } from "./contact.service";

let contactsModule = (<any>angular.module("quinntynebrown.contacts", []));

bootstrap(contactsModule, {
    components: [ContactContainerComponent, ContactsContainerComponent, ContactEditorComponent],
    providers: [ContactActionCreator, ContactService]
});

export * from "./contacts.routes";