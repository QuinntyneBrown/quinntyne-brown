import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./photo-editor-container.component.html"),
    styles: [require("./photo-editor-container.component.scss")],
    selector: "photo-editor-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoEditorContainerComponent {
    constructor() { }
}
