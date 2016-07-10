import { ArticleEditorContainerComponent } from "./article-editor-container.component";
import { ArticlesContainerComponent } from "./articles-container.component";
import { ArticleContainerComponent } from "./article-container.component";

import { IRouteConfig } from "angular-rx-ui/src/components/core";

export const ArticlesRoutes: Array<IRouteConfig> = [
    {
        path: "/",
        component: ArticlesContainerComponent
    },
    {
        path: "/article/:slug",
        component: ArticleContainerComponent
    },
    {
        path: "/admin",
        component: ArticleEditorContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/article/:articleid",
        component: ArticleEditorContainerComponent,
        authorizationRequired: true
    }
]