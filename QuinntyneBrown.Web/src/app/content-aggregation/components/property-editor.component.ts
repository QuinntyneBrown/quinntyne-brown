import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./property-editor.component.html"),
    styles: [require("./property-editor.component.scss")],
    selector: "property-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyEditorComponent {}


