import { createSelector } from "reselect";
import memoize from 'lodash.memoize';

const COLLECTION_ID_MAP = {
    hats: 1,
    sneakers: 2,
    jackets: 3,
    womens: 4,
    mens: 5
};

const selectShop = state => state.shop;

const selectCollections = state => state.shop.collections; 

export const selectShopCollections = createSelector(
    [selectShop],
    shop => shop.collections
);

export const selectCollection = memoize(collectionUrlParam => createSelector(
    [selectCollections],
    collections => collections.find(
        collection => collection.id === COLLECTION_ID_MAP[collectionUrlParam]
    )
));
//we have memoized the outpout of this selector here due to the collectionUrlParam
//In this case collectionUrlParam is a dynamic argument meaning it can change, 
//so to memoize selectCollection we actually have to memoize the whole function 
//using a memoize helper function