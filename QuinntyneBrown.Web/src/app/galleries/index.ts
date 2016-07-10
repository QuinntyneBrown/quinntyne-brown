require("../core");

import { provide, provideAction } from "../core";
import { GalleryComponent } from "./gallery.component";
import { GalleryActionCreator } from "./gallery.action-creator";
import *  as reducers from "./gallery.reducers";
import *  as actions from "./gallery.actions";

var app = (<any>angular.module("app.gallery", [
    "app.core"    
]));

provide(app,GalleryActionCreator);

app.component(GalleryComponent);

app.config(["reducersProvider", reducersProvider => {	
    for (var reducer in reducers) { reducersProvider.configure(reducers[reducer]); }
}]);

for (var action in actions) { provideAction(app, actions[action]); }
