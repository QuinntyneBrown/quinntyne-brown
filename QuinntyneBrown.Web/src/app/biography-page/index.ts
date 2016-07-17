import { bootstrap, provide, provideAction } from "angular-rx-ui/src/components/core";
import { BiographyPageContainerComponent } from "./biography-page-container.component";

let bioModule = (<any>angular.module("quinntynebrown.biographyPage", []));

bootstrap(bioModule, {
    components: [BiographyPageContainerComponent]
});

export * from "./biography-page.routes";