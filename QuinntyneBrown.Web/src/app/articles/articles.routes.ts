import { ArticlesContainerComponent } from "./articles-container.component";
import { ArticleEditorComponent } from "./article-editor.component";

import { IRouteConfig } from "angular-rx-ui/src/components/core";

export const ArticlesRoutes: Array<IRouteConfig> = [
    {
        path: "/admin/articles",
        component: ArticlesContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/article/:articleid",
        component: ArticlesContainerComponent,
        authorizationRequired: true
    }
];