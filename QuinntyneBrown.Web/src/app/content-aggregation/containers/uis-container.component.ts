import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./uis-container.component.html"),
    styles: [require("./uis-container.component.scss")],
    selector: "uis-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UIsContainerComponent { }
