import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './PruebaDisponible.css';
import { useDrag } from 'react-dnd';

function PruebaDisponible({ prueba, showVersionManager }) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'prueba', value: prueba },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <>
            <React.Fragment>
                <div className="testContainer">
                    <div className="versions-icon"><button className="btn btn-info btn-sm shadow-none" onClick={() => showVersionManager(prueba)}><em className="fas fa-sm fa-pen text-white" /></button></div>
                    <div
                        ref={drag}
                        className="pruebaDisponibleWebConfig"
                        onClick={() => { }}
                        style={{
                            opacity: isDragging ? 0.5 : 1,
                        }}
                    >
                        {prueba.shortName}
                    </div>
                </div>
            </React.Fragment>
        </>
    );
}

export default withRouter(PruebaDisponible);
