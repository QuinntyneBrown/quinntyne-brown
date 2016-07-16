import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./social-share-item-list.component.html"),
    styles: [require("./social-share-item-list.component.scss")],
    selector: "social-share-item-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialShareItemListComponent {
    constructor() { }     
}
