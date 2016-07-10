import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./gallery-container.component.html"),
    styles: [require("./gallery-container.component.scss")],
    selector: "gallery-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryContainerComponent { }
