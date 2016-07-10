import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./app-header.component.html"),
    styles: [require("./app-header.component.scss")],
    selector: "app-header",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent { }
