import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./photo-list.component.html"),
    styles: [require("./photo-list.component.scss")],
    selector: "photo-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoListComponent {
    constructor() { }     
}
