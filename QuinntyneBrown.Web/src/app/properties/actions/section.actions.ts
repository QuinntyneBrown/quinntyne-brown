export class AddOrUpdateSectionAction { constructor(public id, public entity) { } }

export class AllSectionsAction { constructor(public id, public entities) { } }

export class RemoveSectionAction { constructor(public id, public entity) { } }

export class SectionsFilterAction { constructor(public id, public term) { } }

export class SetCurrentSectionAction { constructor(public entity) { } }

export class AddOrUpdateSectionSuccessAction { constructor(public entity) { } }

export class CurrentSectionRemovedAction { constructor() { } }
