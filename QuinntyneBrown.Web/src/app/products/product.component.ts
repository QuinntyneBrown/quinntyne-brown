import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./product.component.html"),
    styles: [require("./product.component.scss")],
    selector: "product",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent { }
