import { createSelector } from "reselect";
import memoize from 'lodash.memoize';

const selectShop = state => state.shop;

const selectCollections = state => state.shop.collections; 

export const selectShopCollections = createSelector(
    [selectShop],
    shop => shop.collections
);

export const selectCollectionsForPreview = createSelector(
    [selectShopCollections],
    collections => collections ? Object.keys(collections).map(key => collections[key]) : [] //we get the value of our collection object at that key.
);

export const selectCollection = memoize(collectionUrlParam => createSelector(
    [selectCollections],
    collections => (collections ? collections[collectionUrlParam] : null)
));

export const selectIsCollectionFetching = createSelector(
    [selectShop], //as we want the shop object
    shop => shop.isFetching
);

export const selectIsCollectionsLoaded = createSelector(
    [selectShop],
    shop => !!shop.collections //we call '!!' to turn any value into a boolean
); //if our collections is loaded we get true otherwise we get false

//we have memoized the outpout of this selector here due to the collectionUrlParam
//In this case collectionUrlParam is a dynamic argument meaning it can change, 
//so to memoize selectCollection we actually have to memoize the whole function 
//using a memoize helper function