
import { provide, provideAction } from "angular-rx-ui/src/components/core";
import { PropertyEditorComponent } from "./components/property-editor.component";
import { PropertyListComponent } from "./components/property-list.component";
import { PropertyComponent } from "./components/property.component";
import { PropertiesContainerComponent } from "./containers/properties-container.component";
import { PropertyActionCreator } from "./action-creators/property.action-creator";
import { PropertyService } from "./services/property.service";
import *  as reducers from "./reducers/property.reducers";
import *  as actions from "./actions/property.actions";

var app = (<any>angular.module("app.property", [
    "app.core"    
]));

provide(app,PropertyActionCreator);
provide(app,PropertyService);
app.component(PropertyEditorComponent);
app.component(PropertyListComponent);
app.component(PropertyComponent);
app.component(PropertiesContainerComponent);

app.config(["reducersProvider", reducersProvider => {	
    for (var reducer in reducers) { reducersProvider.configure(reducers[reducer]); }
}]);

for (var action in actions) { provideAction(app, actions[action]); }
