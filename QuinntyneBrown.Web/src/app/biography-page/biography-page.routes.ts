import { IRouteConfig } from "angular-rx-ui/src/components/core";
import { BiographyPageContainerComponent } from "./biography-page-container.component";

export const BiographyPageRoutes: Array<IRouteConfig> = [
    {
        path: "/about",
        component: BiographyPageContainerComponent
    }
];