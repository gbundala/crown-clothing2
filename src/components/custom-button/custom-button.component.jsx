import React from 'react';
import './custom-button.styles.scss';

const CustomButton = ({ children, ...otherProps }) => {
    return (
        <button className='custom-button' {...otherProps}>
            {children}
        </button>
    );
}

export default CustomButton;

//children are anything that are in the CustomButton tags 
//where it is rendered i.e. in the sign-in.component 
//in this case it is the words 'Sign in'