"use strict";
require("../core");
var core_1 = require("../core");
var gallery_component_1 = require("./gallery.component");
var gallery_action_creator_1 = require("./gallery.action-creator");
var reducers = require("./gallery.reducers");
var actions = require("./gallery.actions");
var app = angular.module("app.gallery", [
    "app.core"
]);
core_1.provide(app, gallery_action_creator_1.GalleryActionCreator);
app.component(gallery_component_1.GalleryComponent);
app.config(["reducersProvider", function (reducersProvider) {
        for (var reducer in reducers) {
            reducersProvider.configure(reducers[reducer]);
        }
    }]);
for (var action in actions) {
    core_1.provideAction(app, actions[action]);
}
//# sourceMappingURL=index.js.map