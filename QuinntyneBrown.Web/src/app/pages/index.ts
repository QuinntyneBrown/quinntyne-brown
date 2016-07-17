import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { BiographyPageContainerComponent } from "./biography-page-container.component";
import { ThankYouPageContainerComponent } from "./thank-you-page-container.component";

const pagesModule = (<any>angular.module("quinntynebrown.pages", []));

bootstrap(pagesModule, {
    components: [BiographyPageContainerComponent, ThankYouPageContainerComponent]
});

export * from "./pages.routes";