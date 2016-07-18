import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./menu-item-list.component.html"),
    styles: [require("./menu-item-list.component.scss")],
    selector: "menu-item-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemListComponent {
    constructor() { }     
}
