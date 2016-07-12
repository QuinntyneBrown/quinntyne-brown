export class AddOrUpdateUIAction { constructor(public id, public entity) { } }

export class AllUIsAction { constructor(public id, public entities) { } }

export class RemoveUIAction { constructor(public id, public entity) { } }

export class UIsFilterAction { constructor(public id, public term) { } }

export class SetCurrentUIAction { constructor(public entity) { } }

export class AddOrUpdateUISuccessAction { constructor(public entity) { } }

export class CurrentUIRemovedAction { constructor() { } }
