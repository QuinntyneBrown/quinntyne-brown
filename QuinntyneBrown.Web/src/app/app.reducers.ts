import { AddOrUpdateAppAction } from "./content-aggregation/actions/app.actions";
import { appProperties } from "./app.constants";

export const allAppsReducer = (state, action) => {
    if (action instanceof AddOrUpdateAppAction) {
        state.app = state.app || { properties: [] };

        for (var i = 0; i < action.entity.properties.length; i++) {
            if (action.entity.properties[i].name === appProperties.biography)
                state.app.biographyHtmlBody = action.entity.properties[i].htmlBody; 
            
            if (action.entity.properties[i].name === appProperties.products)
                state.app.products = JSON.parse(action.entity.properties[i].value);            
        }
    }
    return state;
}