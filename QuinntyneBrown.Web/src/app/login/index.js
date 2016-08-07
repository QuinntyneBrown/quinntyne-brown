"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var login_container_component_1 = require("./login-container.component");
var loginModule = angular.module("quinntynebrown.login", []);
core_1.bootstrap(loginModule, {
    components: [login_container_component_1.LoginContainerComponent]
});
__export(require("./login.routes"));
