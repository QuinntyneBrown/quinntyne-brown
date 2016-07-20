import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./article.actions";
import { ArticleActionCreator } from "./article.action-creator";
import { Article } from "./article.model";

@Component({
    routes: ["/admin/articles","/admin/article/edit/:articleId"],
    template: require("./articles-container.component.html"),
    styles: [require("./articles-container.component.scss")],
    selector: "articles-container",
    viewProviders: ["$location","$routeParams","articleActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
@CanActivate(["$q", "$route", "invokeAsync", "articleActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, articleActionCreator: ArticleActionCreator) => {
    let articleId = $route.current.params.articleId;
    let promises = [invokeAsync(articleActionCreator.all)];
    if (articleId) { promises.push(invokeAsync({ action: articleActionCreator.getById, params: { id: articleId } })) };
    return $q.all(promises);
}])
export class ArticlesContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private articleActionCreator: ArticleActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.articles;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentArticleAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/articles");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentArticleAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/article/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateArticleAction)
            this.entity = new Article();

        if (state.lastTriggeredByAction instanceof actions.RemoveArticleAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["articleId"]), items: this.entities }) as Article;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/articles"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["articleId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["articleId"]), items: this.entities }) as Article;
        } else {
            this.entity = new Article();
        }
    }

    edit = entity => this.articleActionCreator.edit(entity);
    remove = entity => this.articleActionCreator.remove(entity);
    create = entity => this.articleActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.articleActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/articles") {
                this.entity = new Article();
            } else {
                this.$location.path("/admin/articles")
            }
        });        
    };
    entity: Article;
    entities: Array<Article>;
}
