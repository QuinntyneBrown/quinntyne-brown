import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./article-container.component.html"),
    styles: [require("./article-container.component.scss")],
    selector: "article-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleContainerComponent {
    constructor() { }
}
