import React, { Component } from 'react';
import CollectionOverview from '../../components/collection-overview/collection-overview.component';
import { Route } from 'react-router-dom';
import CollectionPage from '../collection/collection.component';
import { fetchCollectionsStartAsync } from '../../redux/shop/shop.actions';
import { connect } from 'react-redux';
import WithSpinner from '../../components/with-spinner/with-spinner.component';
import { createStructuredSelector } from 'reselect';
import { selectIsCollectionFetching, selectIsCollectionsLoaded } from '../../redux/shop/shop.selectors';

const CollectionsOverviewWithSpinner = WithSpinner(CollectionOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends Component {
    
    componentDidMount() {
        const { fetchCollectionsStartAsync } = this.props;

        fetchCollectionsStartAsync();
        
    };

    render() {
        const { match, isCollectionFetching, isCollectionsLoaded } = this.props;

        return (
            <div className='shop-page'>
               <Route 
                exact 
                path={`${match.path}`} 
                render={(props) => (
                    <CollectionsOverviewWithSpinner isLoading={isCollectionFetching} {...props} />
                )}
                />
               <Route 
                path={`${match.path}/:collectionId`} 
                render={(props) => (
                    <CollectionPageWithSpinner isLoading={!isCollectionsLoaded} {...props} />
                )}
                />  
            </div>
            //the props in the render above are the history, match & location from the react-router ownProps
        );
    };
};

const mapStateToProps = createStructuredSelector({
    isCollectionFetching: selectIsCollectionFetching,
    isCollectionsLoaded: selectIsCollectionsLoaded,
});

const mapDispatchToProps = dispatch => ({
    fetchCollectionsStartAsync: () => dispatch(fetchCollectionsStartAsync())
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage);
