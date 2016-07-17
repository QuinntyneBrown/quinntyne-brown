import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";
import { Property } from "../models/property.model";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { PropertyActionCreator } from "../action-creators/property.action-creator";

@Component({
    template: require("./property-picker-modal.component.html"),
    styles: [require("./property-picker-modal.component.scss")],
    selector: "property-picker-modal",
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: ["modalActionCreator","propertyActionCreator"]
})
export class PropertyPickerModalComponent {
    constructor(private modalActionCreator: ModalActionCreator, private propertyActionCreator:PropertyActionCreator) { }
    storeOnChange = state => this.entities = state.properties;
    entities: Array<Property>;
    pageNumber: number = 1;
    pageSize: number = 4;
    select = options => {
        this.propertyActionCreator.pick(options.entity);
        this.modalActionCreator.close();
    } 

}
