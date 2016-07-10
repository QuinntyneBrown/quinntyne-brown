import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./article.component.html"),
    styles: [require("./article.component.scss")],
    selector: "article",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent {
    constructor() { }
}
