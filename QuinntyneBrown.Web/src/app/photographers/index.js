"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var photographer_component_1 = require("./photographer.component");
var photographer_action_creator_1 = require("./photographer.action-creator");
var reducers = require("./photographer.reducers");
var actions = require("./photographer.actions");
var photographersModule = angular.module("quinntynebrown.photographers", []);
core_1.bootstrap(photographersModule, {
    components: [photographer_component_1.PhotographerComponent],
    providers: [photographer_action_creator_1.PhotographerActionCreator],
    reducers: reducers,
    actions: actions
});
__export(require("./photographers.routes"));
//# sourceMappingURL=index.js.map