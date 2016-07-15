import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./quote-list.component.html"),
    styles: [require("./quote-list.component.scss")],
    selector: "quote-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteListComponent {
    constructor() { }     
}
