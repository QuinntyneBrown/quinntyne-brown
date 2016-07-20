import * as actions from "./article.actions";
import { addOrUpdate, pluckOut } from "angular-rx-ui/src/components/core";

export const removeArticleReducer = (state, action) => {
    if (action instanceof actions.RemoveArticleAction)
        pluckOut({ items: state.articles, value: action.entity.id });
    return state;
}

export const addArticleReducer = (state, action) => {
    if (action instanceof actions.AddOrUpdateArticleAction) {
        addOrUpdate({ items: state.articles, item: action.entity });
    }
    return state;
}

export const allArticlesReducer = (state, action) => {
    if (action instanceof actions.AllArticlesAction) {
        state.articles = action.entities;
    }
    return state;
}

export const setCurrentArticleReducer = (state, action) => {
    if (action instanceof actions.SetCurrentArticleAction) {
        state.currentArticleId = action.id;
    }
    return state;
}
