import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./menu.component.html"),
    styles: [require("./menu.component.scss")],
    selector: "menu",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    constructor() { }
}
