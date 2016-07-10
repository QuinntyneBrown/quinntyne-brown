import { CanActivate, ChangeDetectionStrategy, Component } from "angular-rx-ui/src/components/core";

@Component({
    template: require("./articles-container.component.html"),
    styles: [require("./articles-container.component.scss")],
    selector: "articles-container",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesContainerComponent { }
