import { Action } from "angular-rx-ui/src/components/core"

export class AddOrUpdateSocialShareItemAction { constructor(public id, public entity) { } }

export class AllSocialShareItemsAction { constructor(public id, public entities) { } }

export class RemoveSocialShareItemAction { constructor(public id, public entity) { } }

export class SocialShareItemsFilterAction { constructor(public id, public term) { } }

export class SetCurrentSocialShareItemAction { constructor(public entity) { } }

export class AddOrUpdateSocialShareItemSuccessAction { constructor(public entity) { } }

export class CurrentSocialShareItemRemovedAction { constructor() { } }
