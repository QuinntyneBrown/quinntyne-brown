require("./shared.scss");

import { bootstrap } from "angular-rx-ui/src/components/core";
import { AppFooterComponent } from "./app-footer/app-footer.component";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { AdminHeaderComponent } from "./admin-header/admin-header.component";

const sharedModule = (<any>angular.module("quinntynebrown.shared", []));

bootstrap(sharedModule, {
    components: [AppFooterComponent, AppHeaderComponent, AdminHeaderComponent],
});
