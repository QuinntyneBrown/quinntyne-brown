import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./contacts-container.component.html"),
    styles: [require("./contacts-container.component.scss")],
    selector: "contacts-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsContainerComponent { }
