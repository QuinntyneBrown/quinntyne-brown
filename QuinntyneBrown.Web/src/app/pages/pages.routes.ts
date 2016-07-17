import { IRouteConfig } from "angular-rx-ui/src/components/core";
import { BiographyPageContainerComponent } from "./biography-page-container.component";
import { ThankYouPageContainerComponent } from "./thank-you-page-container.component";

export const PagesRoutes: Array<IRouteConfig> = [
    {
        path: "/about",
        component: BiographyPageContainerComponent
    },
    {
        path: "/thankyou",
        component: ThankYouPageContainerComponent
    }
];