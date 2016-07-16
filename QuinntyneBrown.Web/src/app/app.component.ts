import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./app.component.html"),
    styles: [require("./app.component.scss")],
    selector: "root-app",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent { }
