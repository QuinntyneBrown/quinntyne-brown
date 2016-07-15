import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./quote-editor.component.html"),
    styles: [require("./quote-editor.component.scss")],
    selector: "quote-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteEditorComponent {}


