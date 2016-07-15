import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";
import { ContactActionCreator } from "./contact.action-creator";
import { Contact } from "./contact.model";
import { AddOrUpdateContactAction } from "./contact.actions";

@Component({
    template: require("./contact-container.component.html"),
    styles: [require("./contact-container.component.scss")],
    selector: "contact-container",
    viewProviders:["contactActionCreator"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactContainerComponent {
    constructor(private contactActionCreator: ContactActionCreator) { }

    storeOnChange = state => {
        if (state.lastTriggeredByAction instanceof AddOrUpdateContactAction)
        {
            this.contactReceived = true;
            this.entity = new Contact();
        }
    }
    public entity: Contact = new Contact();
    public contactReceived: boolean = false;
}
