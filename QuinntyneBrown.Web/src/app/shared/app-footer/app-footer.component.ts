import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./app-footer.component.html"),
    styles: [require("./app-footer.component.scss")],
    selector: "app-footer",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppFooterComponent { }
