import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./photo-editor.component.html"),
    styles: [require("./photo-editor.component.scss")],
    selector: "photo-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoEditorComponent {}


