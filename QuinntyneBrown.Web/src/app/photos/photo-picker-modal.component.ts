import { CanActivate, ChangeDetectionStrategy, Component, IAppState } from "angular-rx-ui/src/components/core";
import { PhotoActionCreator } from "./photo.action-creator";
import { PhotoUploadAction } from "./photo.actions";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { Photo } from "./photo.model";

@Component({
    template: require("./photo-picker-modal.component.html"),
    styles: require("./photo-picker-modal.component.scss"),
    selector: "photo-picker-modal",
    viewProviders: ["modalActionCreator"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoPickerModalComponent {
    constructor(private modalActionCreator: ModalActionCreator) { }

    storeOnChange = (state) => this.entities = state.photos;

    entities: Array<Photo>;
    close = () => this.modalActionCreator.close();

}
