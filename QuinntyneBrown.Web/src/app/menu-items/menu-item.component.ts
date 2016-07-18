import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./menu-item.component.html"),
    styles: [require("./menu-item.component.scss")],
    selector: "menu-item",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemComponent {
    constructor() { }
}
