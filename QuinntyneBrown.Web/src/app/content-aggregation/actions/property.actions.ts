
export class AddOrUpdatePropertyAction { constructor(public id, public entity) { } }

export class AllPropertiesAction { constructor(public id, public entities) { } }

export class RemovePropertyAction { constructor(public id, public entity) { } }

export class PropertysFilterAction { constructor(public id, public term) { } }

export class SetCurrentPropertyAction { constructor(public entity) { } }

export class AddOrUpdatePropertySuccessAction { constructor(public entity) { } }

export class CurrentPropertyRemovedAction { constructor() { } }

export class PropertyPickedAction { constructor(public entity) { } }
