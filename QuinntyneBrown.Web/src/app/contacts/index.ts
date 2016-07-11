import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { ContactContainerComponent } from "./contact-container.component";


let contactsModule = (<any>angular.module("quinntynebrown.contacts", []));

bootstrap(contactsModule, {
    components: [ContactContainerComponent],
});

export * from "./contacts.routes";