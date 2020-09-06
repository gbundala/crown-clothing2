import React from 'react';
import './menu-item.styles.scss';
import { withRouter } from 'react-router-dom';

const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => (
    <div className={`${size} menu-item`} onClick={() => history.push(`${match.url}${linkUrl}`)} >
        <div className='background-image' style={{backgroundImage: `url(${imageUrl})`}} />
        <div className='content'>
            <h1 className='title'>{title.toUpperCase()}</h1>
            <span className='subtitle'>SHOP NOW</span>
        </div>
    </div>
);

export default withRouter(MenuItem);
//withRouter is a React Router implementation that is a HOC
//it takes in the MenuItem and returns a more powerful MenuItem 
//that can take in the history props from the react-router-dom
//to be able to implement the onClick method that will send us 
//to the menu item detailed list