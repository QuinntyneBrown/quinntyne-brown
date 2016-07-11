import { Action } from "angular-rx-ui/src/components/core";

@Action({
    type: "contact.addOrUpdatecontactAction"
})
export class AddOrUpdateContactAction { constructor(public id, public entity) { } }

@Action({
    type: "contact.allcontactsAction"
})
export class AllContactsAction { constructor(public id, public entities) { } }

@Action({
    type: "contact.removecontactAction"
})
export class RemoveContactAction { constructor(public id, public entity) { } }

@Action({
    type: "contact.sFilterActioncontactsFilterAction"
})
export class ContactsFilterAction { constructor(public id, public term) { } }

@Action({
    type: "contact.setCurrentcontactAction"
})
export class SetCurrentContactAction { constructor(public entity) { } }

@Action({
    type: "contact.addOrUpdatecontactSuccessAction"
})
export class AddOrUpdateContactSuccessAction { constructor(public entity) { } }

@Action({
    type: "contact.currentcontactRemovedAction"
})
export class CurrentContactRemovedAction { constructor() { } }
