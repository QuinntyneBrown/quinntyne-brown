import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./order-editor.component.html"),
    styles: [require("./order-editor.component.scss")],
    selector: "order-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEditorComponent { }


