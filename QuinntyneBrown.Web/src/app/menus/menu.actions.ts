import { Action } from "angular-rx-ui/src/components/core"

export class AddOrUpdateMenuAction { constructor(public id, public entity) { } }

export class AllMenusAction { constructor(public id, public entities) { } }

export class RemoveMenuAction { constructor(public id, public entity) { } }

export class MenusFilterAction { constructor(public id, public term) { } }

export class SetCurrentMenuAction { constructor(public entity) { } }

export class AddOrUpdateMenuSuccessAction { constructor(public entity) { } }

export class CurrentMenuRemovedAction { constructor() { } }
