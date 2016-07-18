import { Property } from "./property.model";
import { UI } from "./ui.model";

export class App { 
	id:number;
    name: string;
    properties: Array<Property> = [];
    uis: Array<UI> = [];
}
