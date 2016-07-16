import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./section-editor.component.html"),
    styles: [require("./section-editor.component.scss")],
    selector: "section-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionEditorComponent {}


