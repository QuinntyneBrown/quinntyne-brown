"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("angular-rx-ui/src/components/core");
var quote_editor_component_1 = require("./quote-editor.component");
var quote_list_component_1 = require("./quote-list.component");
var quote_component_1 = require("./quote.component");
var quotes_container_component_1 = require("./quotes-container.component");
var quote_action_creator_1 = require("./quote.action-creator");
var quote_service_1 = require("./quote.service");
var reducers = require("./quote.reducers");
var actions = require("./quote.actions");
var appQuotesModule = angular.module("quinntynebrown.quotes", []);
core_1.bootstrap(appQuotesModule, {
    components: [quote_component_1.QuoteComponent, quote_editor_component_1.QuoteEditorComponent, quotes_container_component_1.QuotesContainerComponent, quote_list_component_1.QuoteListComponent],
    providers: [quote_action_creator_1.QuoteActionCreator, quote_service_1.QuoteService],
    reducers: reducers,
    actions: actions
});
__export(require("./quotes.routes"));
