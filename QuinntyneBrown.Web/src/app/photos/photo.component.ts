import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./photo.component.html"),
    styles: [require("./photo.component.scss")],
    selector: "photo",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoComponent { }
