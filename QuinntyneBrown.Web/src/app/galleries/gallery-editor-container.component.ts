import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./gallery-editor-container.component.html"),
    styles: [require("./gallery-editor-container.component.scss")],
    selector: "gallery-editor-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryEditorContainerComponent { }
