export class AddOrUpdateAppAction { constructor(public id, public entity) { } }

export class AllAppsAction { constructor(public id, public entities) { } }

export class RemoveAppAction { constructor(public id, public entity) { } }

export class AppsFilterAction { constructor(public id, public term) { } }

export class SetCurrentAppAction { constructor(public entity) { } }

export class AddOrUpdateAppSuccessAction { constructor(public entity) { } }

export class CurrentAppRemovedAction { constructor() { } }
