import { GalleryEditorContainerComponent  } from "./gallery-editor-container.component";
import { GalleriesContainerComponent  } from "./galleries-container.component";
import { GalleryContainerComponent  } from "./gallery-container.component";
import { FeaturedGalleryContainerComponent } from "./featured-gallery-container.component";
import { IRouteConfig } from "angular-rx-ui/src/components/core";

export const GalleriesRoutes: Array<IRouteConfig> = [
    {
        path: "/",
        component: FeaturedGalleryContainerComponent,
    },
    {
        path: "/gallery/:slug",
        component: GalleryContainerComponent
    },
    {
        path: "/admin",
        component: GalleryEditorContainerComponent,
        authorizationRequired: true
    },
    {
        path: "/admin/gallery/:galleryid",
        component: GalleryEditorContainerComponent,
        authorizationRequired: true
    }
];