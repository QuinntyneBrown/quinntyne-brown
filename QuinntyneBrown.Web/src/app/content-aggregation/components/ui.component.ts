import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./ui.component.html"),
    styles: [require("./ui.component.scss")],
    selector: "ui",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UIComponent {
    constructor() { }
}
