require("../core/core.module");

import { provide, provideAction } from "../core";
import { PropertyEditorComponent } from "./property-editor.component";
import { PropertyListComponent } from "./property-list.component";
import { PropertyComponent } from "./property.component";
import { PropertysContainerComponent } from "./propertys-container.component";
import { PropertyActionCreator } from "./property.action-creator";
import { PropertyService } from "./property.service";
import *  as reducers from "./property.reducers";
import *  as actions from "./property.actions";

var app = (<any>angular.module("app.property", [
    "app.core"    
]));

provide(app,PropertyActionCreator);
provide(app,PropertyService);
app.component(PropertyEditorComponent);
app.component(PropertyListComponent);
app.component(PropertyComponent);
app.component(PropertysContainerComponent);

app.config(["reducersProvider", reducersProvider => {	
    for (var reducer in reducers) { reducersProvider.configure(reducers[reducer]); }
}]);

for (var action in actions) { provideAction(app, actions[action]); }
