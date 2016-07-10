"use strict";
require("../core");
var core_1 = require("../core");
var photo_component_1 = require("./photo.component");
var photo_action_creator_1 = require("./photo.action-creator");
var reducers = require("./photo.reducers");
var actions = require("./photo.actions");
var app = angular.module("app.photo", [
    "app.core"
]);
core_1.provide(app, photo_action_creator_1.PhotoActionCreator);
app.component(photo_component_1.PhotoComponent);
app.config(["reducersProvider", function (reducersProvider) {
        for (var reducer in reducers) {
            reducersProvider.configure(reducers[reducer]);
        }
    }]);
for (var action in actions) {
    core_1.provideAction(app, actions[action]);
}
//# sourceMappingURL=index.js.map