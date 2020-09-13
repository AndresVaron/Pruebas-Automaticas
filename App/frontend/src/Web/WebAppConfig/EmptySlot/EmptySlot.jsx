import React from 'react';
import { withRouter } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import './EmptySlot.css';
import RightArrowIcon from '../../../Media/Icons/right-arrow.svg';

function EmptySlot(props) {
    let className = '';
    if (props.position === 'CENTER') {
        className = 'emptySlotConfigContainerFillWebCenter';
    } else if (props.position === 'BOTTOM') {
        className = 'emptySlotConfigContainerFillWebBottom';
    } else if (props.position === 'TOP') {
        className = 'emptySlotConfigContainerFillWebTop';
    } else if (props.position === 'LEFT') {
        className = 'emptySlotConfigContainerFillWebLeft';
    } else if (props.position === 'RIGHT') {
        className = 'emptySlotConfigContainerFillWebRight';
    }
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'prueba',
        canDrop: () => true,
        drop: (e) => {
            props.dropped(e.value);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });
    return (
        <div
            className={'emptySlotConfigContainerFillWeb ' + className}
            style={{ height: props.height, width: props.width }}
            ref={drop}
        >
            {isOver && canDrop && props.position === 'LEFT' && (
                <div className="leftArrowConfigWeb">
                    <img
                        alt=""
                        src={RightArrowIcon}
                        className="arrowConfigWeb"
                    />
                </div>
            )}
            {isOver && canDrop && (
                <div className="containerOutLineConfigWebPipeline"></div>
            )}
            {isOver && canDrop && props.position === 'RIGHT' && (
                <div className="rightArrowConfigWeb">
                    <img
                        alt=""
                        src={RightArrowIcon}
                        className="arrowConfigWeb"
                    />
                </div>
            )}
        </div>
    );
}

export default withRouter(EmptySlot);
