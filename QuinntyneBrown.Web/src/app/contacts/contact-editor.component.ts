import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";
import { ContactActionCreator } from "./contact.action-creator";

@Component({
    template: require("./contact-editor.component.html"),
    styles: [require("./contact-editor.component.scss")],
    selector: "contact-editor",
    inputs: ["entity"],
    viewProviders: ["contactActionCreator"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactEditorComponent {
    constructor(private contactActionCreator: ContactActionCreator) { }

    public onTryToSaveContact = options => {
        this.contactActionCreator.addOrUpdate({
            data: options.data
        });
    }
}
