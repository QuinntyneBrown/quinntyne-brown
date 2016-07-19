import { IRoutePromise } from "angular-rx-ui/src/components/core/route-resolver";
import { AppActionCreator } from "../content-aggregation/action-creators/app.action-creator";

export let appGuard: IRoutePromise = {
    promise: [
    "$q",
    "$route",
    "invokeAsync",
    "appActionCreator",
    (
        $q: angular.IQService,
        $route: angular.route.IRouteService,
        invokeAsync,
        appActionCreator: AppActionCreator) => invokeAsync(appActionCreator.all)
    ],
    route:"*"
};


