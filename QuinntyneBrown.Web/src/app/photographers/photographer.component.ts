import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./photographer.component.html"),
    styles: [require("./photographer.component.scss")],
    selector: "photographer",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotographerComponent { }
