import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./purchase-page-container.component.html"),
    styles: [require("./purchase-page-container.component.scss")],
    selector: "purchase-page-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchasePageContainerComponent {
    constructor() { }
}
