import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./menu-editor.component.html"),
    styles: [require("./menu-editor.component.scss")],
    selector: "menu-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuEditorComponent {}


