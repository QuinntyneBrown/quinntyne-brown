import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { QuoteEditorComponent } from "./quote-editor.component";
import { QuoteListComponent } from "./quote-list.component";
import { QuoteComponent } from "./quote.component";
import { QuotesContainerComponent } from "./quotes-container.component";
import { QuoteActionCreator } from "./quote.action-creator";
import { QuoteService } from "./quote.service";
import * as reducers from "./quote.reducers";
import * as actions from "./quote.actions";

const appQuotesModule = angular.module("quinntynebrown.quotes", []);

bootstrap(appQuotesModule, {
    components: [QuoteComponent, QuoteEditorComponent, QuotesContainerComponent, QuoteListComponent],
    providers: [QuoteActionCreator, QuoteService],
    reducers: reducers,
    actions: actions
});

export * from "./quotes.routes";
