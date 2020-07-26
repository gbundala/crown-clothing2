import React, { Component } from 'react';
import CollectionOverview from '../../components/collection-overview/collection-overview.component';
import { Route } from 'react-router-dom';
import CollectionPage from '../collection/collection.component';
import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';
import { updateCollections } from '../../redux/shop/shop.actions';
import { connect } from 'react-redux';
import WithSpinner from '../../components/with-spinner/with-spinner.component';

const CollectionsOverviewWithSpinner = WithSpinner(CollectionOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends Component {
    state = {
        loading: true,
    }; //react will invoke constructor and super under the hood as long as this is a class component 

    unsubscribeFromSnapshot = null; //the unsubscribe method necessary to unmount

    componentDidMount() {
        const { updateCollections } = this.props;
        const collectionRef = firestore.collection('collections');

        collectionRef.get().then(snapshot => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            updateCollections(collectionsMap);
            this.setState({ loading: false });
        });

    // collectionRef.onSnapshot(async snapshot => {
    //     const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
    //     updateCollections(collectionsMap);
    //     this.setState({ loading: false });
    // });
};

    render() {
        const { match } = this.props;
        const { loading } = this.state;

        return (
            <div className='shop-page'>
               <Route 
                exact 
                path={`${match.path}`} 
                render={(props) => (
                    <CollectionsOverviewWithSpinner isLoading={loading} {...props} />
                )}
                />
               <Route 
                path={`${match.path}/:collectionId`} 
                render={(props) => (
                    <CollectionPageWithSpinner isLoading={loading} {...props} />
                )}
                />  
            </div>
            //the props in the render above are the history, match & location from the react-router ownProps
        );
    };
};

const mapDispatchToProps = dispatch => ({
    updateCollections: collectionsMap => 
        dispatch(updateCollections(collectionsMap))
});

export default connect(null, mapDispatchToProps)(ShopPage);
