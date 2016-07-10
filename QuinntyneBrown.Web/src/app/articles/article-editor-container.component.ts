import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./article-editor-container.component.html"),
    styles: [require("./article-editor-container.component.scss")],
    selector: "article-editor-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleEditorContainerComponent { }
