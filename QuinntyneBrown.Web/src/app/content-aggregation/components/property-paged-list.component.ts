import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";
import { IPagedList, toPageListFromInMemory } from "angular-rx-ui/src/components/paged-list";
import { Property } from "../models/property.model";

@Component({
    template: require("./property-paged-list.component.html"),
    styles: [require("./property-paged-list.component.scss")],
    selector: "property-paged-list",
    inputs: ['entities', 'edit', 'remove', 'pageNumber', 'pageSize','select'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyPagedListComponent {
    ngOnInit = () => {
        this.pagedList = toPageListFromInMemory<Property>(this.entities, this.pageNumber, this.pageSize)
    }; 

    next = () => {
        if (this.pageNumber == this.pagedList.totalPages) {
            this.pageNumber = 1;
        } else {
            this.pageNumber = this.pageNumber + 1;
        }
        this.ngOnInit();
    }

    previous = () => {
        if (this.pageNumber == 1) {
            this.pageNumber = this.pagedList.totalPages;
        } else {
            this.pageNumber = this.pageNumber - 1;
        }
        this.ngOnInit();
    }

    entities: Array<Property>;
    pagedList: IPagedList<Property>;
    pageNumber: number;
    pageSize: number;
}


