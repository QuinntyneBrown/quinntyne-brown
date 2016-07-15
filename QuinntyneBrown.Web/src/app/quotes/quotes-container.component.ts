import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./quote.actions";
import { QuoteActionCreator } from "./quote.action-creator";
import { Quote } from "./quote.model";

@Component({
    routes: ["/admin/quotes","/admin/quote/edit/:quoteId"],
    template: require("./quotes-container.component.html"),
    styles: [require("./quotes-container.component.scss")],
    selector: "quotes-container",
    viewProviders: ["$location","$routeParams","quoteActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "quoteActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, quoteActionCreator: QuoteActionCreator) => {
    var quoteId = $route.current.params.quoteId;
    var promises = [invokeAsync(quoteActionCreator.all)];
    if (quoteId) { promises.push(invokeAsync({ action: quoteActionCreator.getById, params: { id: quoteId } })) };
    return $q.all(promises);
}])
export class QuotesContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private quoteActionCreator: QuoteActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.quotes;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentQuoteAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/quotes");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentQuoteAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/quote/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateQuoteAction)
            this.entity = new Quote();

        if (state.lastTriggeredByAction instanceof actions.RemoveQuoteAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["quoteId"]), items: this.entities }) as Quote;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/quotes"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["quoteId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["quoteId"]), items: this.entities }) as Quote;
        } else {
            this.entity = new Quote();
        }
    }

    edit = entity => this.quoteActionCreator.edit(entity);
    remove = entity => this.quoteActionCreator.remove(entity);
    create = entity => this.quoteActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.quoteActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/quotes") {
                this.entity = new Quote();
            } else {
                this.$location.path("/admin/quotes")
            }
        });        
    };
    entity: Quote;
    entities: Array<Quote>;
}
