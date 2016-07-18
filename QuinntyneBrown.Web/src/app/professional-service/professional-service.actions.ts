import { Action } from "angular-rx-ui/src/components/core"

export class AddOrUpdateProfessionalServiceAction { constructor(public id, public entity) { } }

export class AllProfessionalServicesAction { constructor(public id, public entities) { } }

export class RemoveProfessionalServiceAction { constructor(public id, public entity) { } }

export class ProfessionalServicesFilterAction { constructor(public id, public term) { } }

export class SetCurrentProfessionalServiceAction { constructor(public entity) { } }

export class AddOrUpdateProfessionalServiceSuccessAction { constructor(public entity) { } }

export class CurrentProfessionalServiceRemovedAction { constructor() { } }
