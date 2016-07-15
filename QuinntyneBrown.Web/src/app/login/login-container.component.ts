import { CanActivate, ChangeDetectionStrategy, Component, ILoginRedirect } from "angular-rx-ui/src/components/core";
import { UserLoggedInAction } from "angular-rx-ui/src/components/login/login.actions";


@Component({
    template: require("./login-container.component.html"),
    styles: [require("./login-container.component.scss")],
    selector: "da-login-container",
    viewProviders:["loginRedirect"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginContainerComponent {
    constructor(private loginRedirect: ILoginRedirect) { }
    storeOnChange = state => {
        if (state.lastTriggeredByActionType == "login.userLoggedInAction")
            this.loginRedirect.redirectPreLogin();        
    }
}
