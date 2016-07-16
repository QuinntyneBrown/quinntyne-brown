import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./section.component.html"),
    styles: [require("./section.component.scss")],
    selector: "section",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent {
    constructor() { }
}
