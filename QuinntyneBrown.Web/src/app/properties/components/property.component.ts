import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./property.component.html"),
    styles: [require("./property.component.scss")],
    selector: "property",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComponent {
    constructor() { }
}
