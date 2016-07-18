import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./home-page-container.component.html"),
    styles: [require("./home-page-container.component.scss")],
    selector: "home-page-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageContainerComponent {
    constructor() { }
}
