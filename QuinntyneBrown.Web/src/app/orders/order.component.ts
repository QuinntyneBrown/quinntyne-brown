import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./order.component.html"),
    styles: [require("./order.component.scss")],
    selector: "order",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent { }
