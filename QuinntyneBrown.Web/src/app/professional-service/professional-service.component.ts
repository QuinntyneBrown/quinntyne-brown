import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./professional-service.component.html"),
    styles: [require("./professional-service.component.scss")],
    selector: "professional-service",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalServiceComponent {
    constructor() { }
}
