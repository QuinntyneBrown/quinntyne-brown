import { IDispatcher, BaseActionCreator, Service } from "angular-rx-ui/src/components/core";
import { ModalActionCreator } from "angular-rx-ui/src/components/modal/modal.action-creator";
import { AllArticlesAction, RemoveArticleAction, ArticlesFilterAction, SetCurrentArticleAction,AddOrUpdateArticleAction, AddOrUpdateArticleSuccessAction, CurrentArticleRemovedAction } from "./article.actions";

@Service({
    serviceName: "articleActionCreator",
    viewProviders: ["$location", "dispatcher", "articleService", "guid", "invokeAsync","modalActionCreator"]
})
export class ArticleActionCreator extends BaseActionCreator {
    constructor($location: angular.ILocationService, dispatcher: IDispatcher, articleService, guid, private invokeAsync, private modalActionCreator: ModalActionCreator) {
        super($location,articleService,dispatcher,guid,AddOrUpdateArticleAction,AllArticlesAction,RemoveArticleAction,SetCurrentArticleAction)
    }    

	addOrUpdateSuccess = options => this.dispatcher.dispatch(new AddOrUpdateArticleSuccessAction(options.entity));

    currentArticleRemoved = () => this.dispatcher.dispatch(new CurrentArticleRemovedAction());

    openAllArticlesModal = () => {
        this.invokeAsync(this.all).then(results => {
            this.modalActionCreator.open({ html: "<all-article-modal></all-article-modal>" });
        });
    }
}



