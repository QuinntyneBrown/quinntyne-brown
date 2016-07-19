import { IRoutePromise } from "angular-rx-ui/src/components/core/route-resolver";
import { Store } from "angular-rx-ui/src/components/core";
import { AppActionCreator } from "../content-aggregation/action-creators/app.action-creator";

export let appGuard: IRoutePromise = {
    promise: [
        "$q",
        "$route",
        "invokeAsync",
        "appActionCreator",
        "store",
    (
        $q: angular.IQService,
        $route: angular.route.IRouteService,
        invokeAsync,
        appActionCreator: AppActionCreator,
        store: Store<any>
    ) => invokeAsync({ action: appActionCreator.getById, params: { id: 2 } })],
    route:"*"
};


