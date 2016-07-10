import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./customer.component.html"),
    styles: [require("./customer.component.scss")],
    selector: "customer",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerComponent {
    constructor() { }
}
