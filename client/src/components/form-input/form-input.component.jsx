import React from 'react';
import './form-input.styles.scss';

const FormInput = ({ handleChange, label, ...otherProps }) => {
    return (
        <div className='group' >
            <input className='form-input' onChange={handleChange} {...otherProps} />
            {
                label ? (
                    <label
                        className={`${
                            otherProps.value.length ? 'shrink' : ''
                        } form-input-label`}
                    >
                        {label}
                    </label>
                ) : null
            }
        </div>
    );
}

export default FormInput;

//the label will always have the className 'form-input-label'
//unless the user has typed something (otherProps.value.length)
//then the 'shrink' className will take place