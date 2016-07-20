import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./article-editor.component.html"),
    styles: [require("./article-editor.component.scss")],
    selector: "article-editor",
    inputs: ['entity','addOrUpdate','remove','create'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleEditorComponent {}


