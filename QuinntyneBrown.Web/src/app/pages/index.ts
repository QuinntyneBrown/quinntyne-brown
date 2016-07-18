import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { ArticlePageContainerComponent } from "./article-page-container.component";
import { BiographyPageContainerComponent } from "./biography-page-container.component";
import { CheckoutPageContainerComponent } from "./checkout-page-container.component";
import { HomePageContainerComponent } from "./home-page-container.component";
import { PurchasePageContainerComponent } from "./purchase-page-container.component";
import { ThankYouPageContainerComponent } from "./thank-you-page-container.component";

const pagesModule = (<any>angular.module("quinntynebrown.pages", []));

bootstrap(pagesModule, {
    components: [
        ArticlePageContainerComponent,
        BiographyPageContainerComponent,
        CheckoutPageContainerComponent,
        HomePageContainerComponent,
        PurchasePageContainerComponent,
        ThankYouPageContainerComponent
    ]
});

export * from "./pages.routes";