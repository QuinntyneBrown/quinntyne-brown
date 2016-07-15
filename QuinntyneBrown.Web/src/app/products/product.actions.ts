import { Action } from "angular-rx-ui/src/components/core";

export class AddOrUpdateProductAction { constructor(public id, public entity) { } }

export class AllProductsAction { constructor(public id, public entities) { } }

export class RemoveProductAction { constructor(public id, public entity) { } }

export class ProductsFilterAction { constructor(public id, public term) { } }

export class SetCurrentProductAction { constructor(public entity) { } }

export class AddOrUpdateProductSuccessAction { constructor(public entity) { } }

export class CurrentProductRemovedAction { constructor() { } }
