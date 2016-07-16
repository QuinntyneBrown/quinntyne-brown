import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./section-list.component.html"),
    styles: [require("./section-list.component.scss")],
    selector: "section-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionListComponent {
    constructor() { }     
}
