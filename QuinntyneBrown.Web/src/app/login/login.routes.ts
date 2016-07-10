import { LoginContainerComponent } from "./login-container.component";
import { IRouteConfig } from "angular-rx-ui/src/components/core";

export const LoginRoutes: Array<IRouteConfig> = [
    {
        path: "/login",
        component: LoginContainerComponent
    }
]