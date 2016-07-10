import { ArticleEditorContainerComponent }  from "./article-editor-container.component";
import { ArticlesContainerComponent } from "./articles-container.component";
import { ArticleContainerComponent } from "./article-container.component";

import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";

const articlesModule = (<any>angular.module("quinntynebrown.articles", []));

bootstrap(articlesModule, {
    components: [ArticleContainerComponent, ArticleEditorContainerComponent, ArticlesContainerComponent],
});

export * from "./articles.routes";