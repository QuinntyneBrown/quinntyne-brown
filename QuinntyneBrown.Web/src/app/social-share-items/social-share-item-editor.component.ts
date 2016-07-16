import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./social-share-item-editor.component.html"),
    styles: [require("./social-share-item-editor.component.scss")],
    selector: "social-share-item-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialShareItemEditorComponent {}


