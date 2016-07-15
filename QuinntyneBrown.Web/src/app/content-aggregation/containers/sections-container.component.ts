import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./sections-container.component.html"),
    styles: [require("./sections-container.component.scss")],
    selector: "sections-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionsContainerComponent {
    constructor() { }
}
