import { Component, ChangeDetectionStrategy } from "angular-rx-ui/src/components/core";
import { PhotoActionCreator } from "./photo.action-creator";

@Component({
    template: require("./photo-upload.component.html"),
    styles: require("./photo-upload.component.scss"),
    selector: "photo-upload",
    viewProviders: ["$element", "photoActionCreator"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoUploadComponent {
    constructor(private $element: ng.IAugmentedJQuery,
        private photoActionCreator: PhotoActionCreator
    ) { }

    ngOnInit = () => {
        this.drop.addEventListener("dragover", (dragEvent: DragEvent) => {
            dragEvent.stopPropagation();
            dragEvent.preventDefault();
        }, false);

        this.drop.addEventListener("drop", this.photoActionCreator.upload, false);
    }

    ngOnDestroy = () => this.drop.removeEventListener("drop", this.photoActionCreator.upload, false);

    get drop() {
        return this.$element.find(".drop-zone")[0];
    }

}