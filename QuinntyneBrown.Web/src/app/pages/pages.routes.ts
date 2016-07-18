import { IRouteConfig } from "angular-rx-ui/src/components/core";
import { ArticlePageContainerComponent } from "./article-page-container.component";
import { BiographyPageContainerComponent } from "./biography-page-container.component";
import { CheckoutPageContainerComponent } from "./checkout-page-container.component";
import { HomePageContainerComponent } from "./home-page-container.component";
import { PurchasePageContainerComponent } from "./purchase-page-container.component";
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