import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./login-container.component.html"),
    styles: [require("./login-container.component.scss")],
    selector: "da-login-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginContainerComponent { }
