import React from 'react';
import { withRouter } from 'react-router-dom';
import './PruebaDisponible.css';
import { useDrag } from 'react-dnd';

function PruebaDisponible(props) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'prueba', value: props.prueba },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <React.Fragment>
            <div
                ref={drag}
                className="pruebaDisponibleWebConfig"
                onClick={() => {}}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                }}
            >
                {props.prueba.short}
            </div>
        </React.Fragment>
    );
}

export default withRouter(PruebaDisponible);
