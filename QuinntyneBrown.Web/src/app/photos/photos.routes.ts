import { IRouteConfig } from "angular-rx-ui/src/components/core";
import { PhotosContainerComponent } from "./photos-container.component";

export const PhotosRoutes: Array<IRouteConfig> = [
    {
        path: "/admin/photos",
        component: PhotosContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/product/edit/:photoId",
        component: PhotosContainerComponent,
        authorizationRequired: true
    }
];