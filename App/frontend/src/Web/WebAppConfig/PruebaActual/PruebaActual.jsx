import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './PruebaActual.css';
import DeleteIcon from '../../../Media/Icons/delete.svg';

function PruebaActual(props) {
    const [hovering, setHovering] = useState(false);
    return (
        <React.Fragment>
            <div
                className="pruebaActualWebConfig"
                onClick={() => {
                    props.borrar();
                }}
                onMouseEnter={() => {
                    setHovering(true);
                }}
                onMouseLeave={() => {
                    setHovering(false);
                }}
            >
                {hovering && (
                    <div className="containerDeleteIconPruebaActualWebConfig">
                        <img src={DeleteIcon} alt="" />
                    </div>
                )}
                {props.prueba.prueba.shortName}
                <label>{props.prueba.version.version}</label>
            </div>
        </React.Fragment>
    );
}

export default withRouter(PruebaActual);
