import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { ThankYouPageContainerComponent } from "./thank-you-page-container.component";

let bioModule = (<any>angular.module("quinntynebrown.thankYouPage", []));

bootstrap(bioModule, {
    components: [ThankYouPageContainerComponent]
});

export * from "./thank-you-page.routes";