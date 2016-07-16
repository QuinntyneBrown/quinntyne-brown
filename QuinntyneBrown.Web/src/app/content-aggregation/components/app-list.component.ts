import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./app-list.component.html"),
    styles: [require("./app-list.component.scss")],
    selector: "app-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppListComponent {
    constructor() { }     
}
