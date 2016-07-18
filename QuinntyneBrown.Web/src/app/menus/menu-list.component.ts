import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./menu-list.component.html"),
    styles: [require("./menu-list.component.scss")],
    selector: "menu-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuListComponent {
    constructor() { }     
}
