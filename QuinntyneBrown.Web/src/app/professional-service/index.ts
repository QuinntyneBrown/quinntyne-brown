import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { ProfessionalServiceEditorComponent } from "./professional-service-editor.component";
import { ProfessionalServiceListComponent } from "./professional-service-list.component";
import { ProfessionalServiceComponent } from "./professional-service.component";
import { ProfessionalServicesContainerComponent } from "./professional-services-container.component";
import { ProfessionalServiceActionCreator } from "./professional-service.action-creator";
import { ProfessionalServiceService } from "./professional-service.service";
import *  as reducers from "./professional-service.reducers";
import *  as actions from "./professional-service.actions";

const appProfessionalServicesModule = angular.module("app.professional-services", []);

bootstrap(appProfessionalServicesModule, {
    components: [ProfessionalServiceComponent, ProfessionalServiceEditorComponent, ProfessionalServicesContainerComponent, ProfessionalServiceListComponent],
    providers: [ProfessionalServiceActionCreator, ProfessionalServiceService],
    reducers: reducers,
    actions: actions
});

export * from "./professional-services.routes";
