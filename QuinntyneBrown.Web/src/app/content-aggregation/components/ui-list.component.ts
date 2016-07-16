import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./ui-list.component.html"),
    styles: [require("./ui-list.component.scss")],
    selector: "ui-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UIListComponent {
    constructor() { }     
}
