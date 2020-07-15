import React from 'react';
import './header.styles.scss';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/crown.svg';
import { auth } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';

const Header = ({ currentUser }) => {
    return (
        <div className='header'>
            <Link className='logo-container' to='/'>
                <Logo className='logo' />
            </Link>
            <div className='options'>
                <Link className='option' to='/shop'>
                    SHOP
                </Link>
                <Link className='option' to='/contact'>
                    CONTACT
                </Link>
                {
                    currentUser ? (
                    <div className='option' onClick={() => auth.signOut()}>SIGN OUT</div> 
                    ) : (
                    <Link className='option' to='/signin'>
                        SIGN IN
                    </Link>)
                }
                
            </div>
        </div>
    );
}

//this is the function that allows us to access the state from reducers.
const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(Header);

//connect is a higher order component (HOC) that lets us modify 
//our react components to lets us have access to redux stuff in our
//react components (to things related to redux)
//a HOC is a component that takes in another component as its parameter
//and returns a 'supped up' component; in this case -- one that can
//take things related to redux hence the ability of the header component 
//to connet to reducers and pull in the 'currentUser' state
//NOTE: we are getting the state from the root reducer, that pulls
//from the user reducer that ultimately gets its state updated from
//the actions of the 'user.actions.js'.
//the mapStateToProps and reducers we will use anywhere that 
//we would need props from our reducers