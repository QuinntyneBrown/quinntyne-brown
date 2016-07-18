import { Action } from "angular-rx-ui/src/components/core"

export class AddOrUpdateMenuItemAction { constructor(public id, public entity) { } }

export class AllMenuItemsAction { constructor(public id, public entities) { } }

export class RemoveMenuItemAction { constructor(public id, public entity) { } }

export class MenuItemsFilterAction { constructor(public id, public term) { } }

export class SetCurrentMenuItemAction { constructor(public entity) { } }

export class AddOrUpdateMenuItemSuccessAction { constructor(public entity) { } }

export class CurrentMenuItemRemovedAction { constructor() { } }
