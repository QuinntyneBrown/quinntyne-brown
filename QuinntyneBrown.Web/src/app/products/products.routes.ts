import { IRouteConfig } from "angular-rx-ui/src/components/core";
import { ProductsContainerComponent } from "./products-container.component";

export const ProductsRoutes: Array<IRouteConfig> = [
    {
        path: "/admin/products",
        component: ProductsContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/product/edit/:productId",
        component: ProductsContainerComponent,
        authorizationRequired: true
    }
];