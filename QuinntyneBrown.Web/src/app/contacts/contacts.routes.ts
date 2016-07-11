import { IRouteConfig } from "angular-rx-ui/src/components/core";
import { ContactContainerComponent  } from "./contact-container.component";

export const PhotographersRoutes: Array<IRouteConfig> = [
    {
        path: "/contact",
        component: ContactContainerComponent
    }
];