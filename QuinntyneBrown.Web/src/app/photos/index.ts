require("../core");

import { provide, provideAction } from "../core";
import { PhotoComponent } from "./photo.component";
import { PhotoActionCreator } from "./photo.action-creator";
import *  as reducers from "./photo.reducers";
import *  as actions from "./photo.actions";

var app = (<any>angular.module("app.photo", [
    "app.core"    
]));

provide(app,PhotoActionCreator);

app.component(PhotoComponent);

app.config(["reducersProvider", reducersProvider => {	
    for (var reducer in reducers) { reducersProvider.configure(reducers[reducer]); }
}]);

for (var action in actions) { provideAction(app, actions[action]); }
