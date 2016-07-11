import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./featured-gallery-container.component.html"),
    styles: [require("./featured-gallery-container.component.scss")],
    selector: "featured-gallery-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedGalleryContainerComponent { }
