import { CanActivate, ChangeDetectionStrategy, Component, IAppState } from "angular-rx-ui/src/components/core";
import { PhotoActionCreator } from "./photo.action-creator";
import { PhotoUploadAction } from "./photo.actions";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";

@Component({
    template: require("./photo-upload-modal.component.html"),
    styles: require("./photo-upload-modal.component.scss"),
    selector: "photo-upload-modal",
    viewProviders: ["modalActionCreator"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoUploadModalComponent {
    constructor(private modalActionCreator: ModalActionCreator) { }

    storeOnChange = (state) => {
        if (state.lastTriggeredByAction instanceof PhotoUploadAction) {            
            this.close();
        }
    }

    close = () => this.modalActionCreator.close();

}
