import { AllAppsAction } from "./content-aggregation/actions/app.actions";

export const allAppsReducer = (state, action) => {
    if (action instanceof AllAppsAction) {
        state.app = action.entities[0];
    }
    return state;
}