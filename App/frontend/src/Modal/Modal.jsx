import React from 'react';
import closeIcon from '../Media/Icons/close.svg';

const Modal = ({ children, setShowModal, loading }) => {
    return (
        <>
            <div className="curtain"></div>
            <div className="modalLayout">
                <div className="modalContent">
                    <div>
                        <img
                            alt="Close modal icon"
                            src={closeIcon}
                            className="closeButtonModal"
                            onClick={() => !loading && setShowModal(false)}
                        />
                    </div>
                    <div class="modalContenChildren">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;