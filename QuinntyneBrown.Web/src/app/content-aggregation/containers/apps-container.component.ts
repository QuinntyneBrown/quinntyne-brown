import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./apps-container.component.html"),
    styles: [require("./apps-container.component.scss")],
    selector: "apps-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppsContainerComponent {
    constructor() { }
}
