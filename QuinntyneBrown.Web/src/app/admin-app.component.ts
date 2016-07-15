import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./admin-app.component.html"),
    styles: [require("./admin-app.component.scss")],
    selector: "admin-app",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAppComponent {
    currentUser;
    storeOnChange = state => this.currentUser = state.currentUser;
}
