import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./social-share-item.component.html"),
    styles: [require("./social-share-item.component.scss")],
    selector: "social-share-item",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialShareItemComponent {
    constructor() { }
}
