import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./thank-you-page-container.component.html"),
    styles: [require("./thank-you-page-container.component.scss")],
    selector: "thank-you-page-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThankYouPageContainerComponent {
    constructor() { }
}
