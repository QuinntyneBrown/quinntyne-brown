import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./gallery.component.html"),
    styles: [require("./gallery.component.scss")],
    selector: "gallery",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
    constructor() { }
}
