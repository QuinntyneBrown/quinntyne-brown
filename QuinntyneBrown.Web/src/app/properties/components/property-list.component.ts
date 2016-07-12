import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./property-list.component.html"),
    styles: [require("./property-list.component.scss")],
    selector: "property-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyListComponent {
    constructor() { }     
}
