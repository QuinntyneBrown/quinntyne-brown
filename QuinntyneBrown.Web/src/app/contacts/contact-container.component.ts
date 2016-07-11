import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./contact-container.component.html"),
    styles: [require("./contact-container.component.scss")],
    selector: "contact-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactContainerComponent {
    constructor() { }
}
