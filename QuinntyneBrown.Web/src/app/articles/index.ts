import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { ArticleEditorComponent } from "./article-editor.component";
import { ArticleListComponent } from "./article-list.component";
import { ArticleComponent } from "./article.component";
import { ArticlesContainerComponent } from "./articles-container.component";
import { ArticleActionCreator } from "./article.action-creator";
import { ArticleService } from "./article.service";
import *  as reducers from "./article.reducers";
import *  as actions from "./article.actions";

const appArticlesModule = angular.module("quinntynebrown.articles", []);

bootstrap(appArticlesModule, {
    components: [ArticleComponent, ArticleEditorComponent, ArticlesContainerComponent, ArticleListComponent],
    providers: [ArticleActionCreator, ArticleService],
    reducers: reducers,
    actions: actions
});

export * from "./articles.routes";
