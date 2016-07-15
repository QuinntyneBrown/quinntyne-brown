import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllQuotesAction, RemoveQuoteAction, QuotesFilterAction, SetCurrentQuoteAction,AddOrUpdateQuoteAction, AddOrUpdateQuoteSuccessAction, CurrentQuoteRemovedAction } from "./quote.actions";

@Service({
    serviceName: "quoteActionCreator",
    viewProviders: ["$location", "dispatcher", "quoteService", "guid", "invokeAsync","modalActionCreator"]
})
export class QuoteActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, quoteService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,quoteService,dispatcher,guid,AddOrUpdateQuoteAction,AllQuotesAction,RemoveQuoteAction,SetCurrentQuoteAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateQuoteSuccessAction(options.entity));

    currentQuoteRemoved = () => this.dispatcher.dispatch(new CurrentQuoteRemovedAction());

    openAllQuotesModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-quote-modal></all-quote-modal>" });
        });
    }
}



