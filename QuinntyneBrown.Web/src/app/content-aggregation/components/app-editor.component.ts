import { CanActivate, ChangeDetectionStrategy, Component, pluckOut } from "angular-rx-ui/src/components/core";
import { App } from "../models/app.model";

@Component({
    template: require("./app-editor.component.html"),
    styles: [require("./app-editor.component.scss")],
    selector: "app-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppEditorComponent {
    public removeProperty = options => pluckOut({ items: this.entity.properties, value: options.property.id });
    public removeUI = options => pluckOut({ items: this.entity.uis, value: options.ui.id });
    public entity: App;
}


