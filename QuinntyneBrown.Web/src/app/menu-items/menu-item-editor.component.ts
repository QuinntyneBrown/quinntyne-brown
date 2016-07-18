import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./menu-item-editor.component.html"),
    styles: [require("./menu-item-editor.component.scss")],
    selector: "menu-item-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemEditorComponent {}


