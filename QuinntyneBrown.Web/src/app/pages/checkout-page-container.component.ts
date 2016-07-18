import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./checkout-page-container.component.html"),
    styles: [require("./checkout-page-container.component.scss")],
    selector: "checkout-page-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutPageContainerComponent {
    constructor() { }
}
