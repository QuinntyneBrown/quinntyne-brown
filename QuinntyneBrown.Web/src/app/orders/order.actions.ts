import { Action } from "angular-rx-ui/src/components/core"

export class AddOrUpdateOrderAction { constructor(public id, public entity) { } }

export class AllOrdersAction { constructor(public id, public entities) { } }

export class RemoveOrderAction { constructor(public id, public entity) { } }

export class OrdersFilterAction { constructor(public id, public term) { } }

export class SetCurrentOrderAction { constructor(public entity) { } }

export class AddOrUpdateOrderSuccessAction { constructor(public entity) { } }

export class CurrentOrderRemovedAction { constructor() { } }
