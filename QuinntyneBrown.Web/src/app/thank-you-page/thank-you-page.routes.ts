import { IRouteConfig } from "angular-rx-ui/src/components/core";
import { ThankYouPageContainerComponent } from "./thank-you-page-container.component";

export const ThankYouPageRoutes: Array<IRouteConfig> = [
    {
        path: "/thankyou",
        component: ThankYouPageContainerComponent
    }
];