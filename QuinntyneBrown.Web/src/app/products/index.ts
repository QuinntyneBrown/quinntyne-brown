import { provide, provideAction,bootstrap } from "angular-rx-ui/src/components/core";
import { ProductEditorComponent } from "./product-editor.component";
import { ProductListComponent } from "./product-list.component";
import { ProductComponent } from "./product.component";
import { ProductsContainerComponent } from "./products-container.component";
import { ProductActionCreator } from "./product.action-creator";
import { ProductService } from "./product.service";
import *  as reducers from "./product.reducers";
import *  as actions from "./product.actions";

const quinntynebrownProductsModule = angular.module("quinntynebrown.products", []);

bootstrap(quinntynebrownProductsModule, {
    components: [ProductComponent, ProductEditorComponent, ProductsContainerComponent, ProductListComponent],
    providers: [ProductActionCreator, ProductService],
    reducers: reducers,
    actions: actions
});

export * from "./products.routes";