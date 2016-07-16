import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./ui-editor.component.html"),
    styles: [require("./ui-editor.component.scss")],
    selector: "ui-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UIEditorComponent {}


