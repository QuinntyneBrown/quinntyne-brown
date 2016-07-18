import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./professional-service-list.component.html"),
    styles: [require("./professional-service-list.component.scss")],
    selector: "professional-service-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalServiceListComponent {
    constructor() { }     
}
