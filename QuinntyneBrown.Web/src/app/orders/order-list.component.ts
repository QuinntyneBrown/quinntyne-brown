import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./order-list.component.html"),
    styles: [require("./order-list.component.scss")],
    selector: "order-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent {
    constructor() { }     
}
