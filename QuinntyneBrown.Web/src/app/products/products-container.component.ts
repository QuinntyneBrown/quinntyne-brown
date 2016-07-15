import { CanActivate, ChangeDetectionStrategy, Component, pluck } from "angular-rx-ui/src/components/core";
import * as actions from "./product.actions";
import { ProductActionCreator } from "./product.action-creator";
import { Product } from "./product.model";

@Component({
    routes: ["/admin/products","/admin/product/edit/:productId"],
    template: require("./products-container.component.html"),
    styles: [require("./products-container.component.scss")],
    selector: "products-container",
    viewProviders: ["$location","$routeParams","productActionCreator","invokeAsync"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
    @CanActivate(["$q", "$route", "invokeAsync", "productActionCreator", ($q: angular.IQService, $route: angular.route.IRouteService, invokeAsync, productActionCreator: ProductActionCreator) => {
    var productId = $route.current.params.productId;
    var promises = [invokeAsync(productActionCreator.all)];
    if (productId) { promises.push(invokeAsync({ action: productActionCreator.getById, params: { id: productId } })) };
    return $q.all(promises);
}])
export class ProductsContainerComponent { 
    constructor(private $location: angular.ILocationService, private $routeParams: angular.route.IRouteParamsService, private productActionCreator: ProductActionCreator, private _invokeAsync) { }
    storeOnChange = state => {        
        this.entities = state.products;

		if (state.lastTriggeredByAction instanceof actions.SetCurrentProductAction && !state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/products");

        if (state.lastTriggeredByAction instanceof actions.SetCurrentProductAction && state.lastTriggeredByAction.entity) 
            this.$location.path("/admin/product/edit/" + state.lastTriggeredByAction.entity.id);
        
		if (state.lastTriggeredByAction instanceof actions.AddOrUpdateProductAction)
            this.entity = new Product();

        if (state.lastTriggeredByAction instanceof actions.RemoveProductAction && this.entity && this.entity.id) {
            this.entity = pluck({ value: Number(this.$routeParams["productId"]), items: this.entities }) as Product;
            if (Object.keys(this.entity).length === 0) { this.$location.path("/admin/products"); }
        }
    }

    ngOnInit = () => {
        if (this.$routeParams["productId"]) {
            this.entity = pluck({ value: Number(this.$routeParams["productId"]), items: this.entities }) as Product;
        } else {
            this.entity = new Product();
        }
    }

    edit = entity => this.productActionCreator.edit(entity);
    remove = entity => this.productActionCreator.remove(entity);
    create = entity => this.productActionCreator.create();
    addOrUpdate = options => {
        this._invokeAsync({
            action: this.productActionCreator.addOrUpdate,
            params: { data: options.data }
        }).then(() => {
            if (this.$location.path() === "/admin/products") {
                this.entity = new Product();
            } else {
                this.$location.path("/admin/products")
            }
        });        
    };
    entity: Product;
    entities: Array<Product>;
}
