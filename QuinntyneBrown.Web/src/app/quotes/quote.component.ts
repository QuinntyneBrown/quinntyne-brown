import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./quote.component.html"),
    styles: [require("./quote.component.scss")],
    selector: "quote",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteComponent {
    constructor() { }
}
