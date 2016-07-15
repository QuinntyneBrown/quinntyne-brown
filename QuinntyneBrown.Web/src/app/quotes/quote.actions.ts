import { Action } from "angular-rx-ui/src/components/core"

export class AddOrUpdateQuoteAction { constructor(public id, public entity) { } }

export class AllQuotesAction { constructor(public id, public entities) { } }

export class RemoveQuoteAction { constructor(public id, public entity) { } }

export class QuotesFilterAction { constructor(public id, public term) { } }

export class SetCurrentQuoteAction { constructor(public entity) { } }

export class AddOrUpdateQuoteSuccessAction { constructor(public entity) { } }

export class CurrentQuoteRemovedAction { constructor() { } }
