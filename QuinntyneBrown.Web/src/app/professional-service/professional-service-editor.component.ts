import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./professional-service-editor.component.html"),
    styles: [require("./professional-service-editor.component.scss")],
    selector: "professional-service-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalServiceEditorComponent {}


