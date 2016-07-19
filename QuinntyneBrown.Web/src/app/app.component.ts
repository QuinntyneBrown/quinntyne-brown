import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";
import { AppActionCreator } from "./content-aggregation/action-creators/app.action-creator";

@Component({
    template: require("./app.component.html"),
    styles: [require("./app.component.scss")],
    selector: "root-app",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent { }
