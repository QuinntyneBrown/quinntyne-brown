import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./article-page-container.component.html"),
    styles: [require("./article-page-container.component.scss")],
    selector: "article-page-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePageContainerComponent {
    constructor() { }
}
