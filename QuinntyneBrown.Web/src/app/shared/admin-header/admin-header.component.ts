import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./admin-header.component.html"),
    styles: [require("./admin-header.component.scss")],
    selector: "admin-header",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHeaderComponent { }
