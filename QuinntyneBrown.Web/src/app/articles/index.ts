require("angular-rx-ui/src/components/core");

import { provide, provideAction } from "angular-rx-ui/src/components/core";
import { ArticleComponent } from "./article.component";
import { ArticleActionCreator } from "./article.action-creator";
import *  as reducers from "./article.reducers";
import *  as actions from "./article.actions";

var app = (<any>angular.module("app.article", [
    "app.core"    
]));

provide(app,ArticleActionCreator);

app.component(ArticleComponent);

app.config(["reducersProvider", reducersProvider => {	
    for (var reducer in reducers) { reducersProvider.configure(reducers[reducer]); }
}]);

for (var action in actions) { provideAction(app, actions[action]); }
