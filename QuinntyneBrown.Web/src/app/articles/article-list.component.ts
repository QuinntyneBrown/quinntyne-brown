import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./article-list.component.html"),
    styles: [require("./article-list.component.scss")],
    selector: "article-list",
    inputs: ['entities','edit','remove'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent {
    constructor() { }     
}
