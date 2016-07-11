import { provide, provideAction, bootstrap } from "angular-rx-ui/src/components/core";
import { LoginContainerComponent } from "./login-container.component";

const loginModule = (<any>angular.module("quinntynebrown.login", []));

bootstrap(loginModule, {
    components: [LoginContainerComponent]
});

export * from "./login.routes";