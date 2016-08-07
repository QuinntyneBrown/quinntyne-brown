"use strict";
require("./shared.scss");
var core_1 = require("angular-rx-ui/src/components/core");
var app_footer_component_1 = require("./app-footer/app-footer.component");
var app_header_component_1 = require("./app-header/app-header.component");
var admin_header_component_1 = require("./admin-header/admin-header.component");
var sharedModule = angular.module("quinntynebrown.shared", []);
core_1.bootstrap(sharedModule, {
    components: [app_footer_component_1.AppFooterComponent, app_header_component_1.AppHeaderComponent, admin_header_component_1.AdminHeaderComponent],
});
