import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './PruebaDisponible.css';
import { useDrag } from 'react-dnd';
import Select from 'react-select';

function PruebaDisponible({ prueba, showVersionManager }) {
    const [version, setVersion] = useState(
        prueba.versions.length > 0
            ? prueba.versions[prueba.versions.length - 1]
            : undefined
    );
    const [{ isDragging }, drag] = useDrag({
        item: {
            type: 'prueba',
            value: {
                prueba: prueba,
                version: version,
            },
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const customStyles = {
        option: (base) => ({
            ...base,
            color: '#1d2f6f',
        }),
        container: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
        }),
        singleValue: (base) => ({
            ...base,
            color: 'white',
        }),
        control: (base, state) => ({
            ...base,
            background: 'transparent',
            // Removes weird border around container
            boxShadow: state.isFocused ? null : null,
            border: 'none',
        }),
        menu: (base) => ({
            ...base,
            // override border radius to match the box
            borderRadius: 0,
            // kill the gap
            marginTop: 0,
        }),
        menuList: (base) => ({
            ...base,
            color: '#1d2f6f',
        }),
        indicatorSeparator: (base) => ({
            ...base,
            display: 'none',
        }),
        indicatorsContainer: (base) => ({
            ...base,
            width: 25,
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
            width: 20,
            color: 'white',
            cursor: 'pointer',
        }),
    };
    return (
        <>
            <React.Fragment>
                <div className="testContainer">
                    <div className="versions-icon">
                        <button
                            className="btn btn-info btn-sm shadow-none"
                            onClick={() => showVersionManager(prueba)}
                        >
                            <em className="fas fa-sm fa-pen text-white" />
                        </button>
                    </div>
                    <div
                        ref={drag}
                        className="pruebaDisponibleWebConfig"
                        style={{
                            opacity: isDragging ? 0.5 : 1,
                        }}
                    >
                        <label>{prueba.shortName}</label>
                        <div className="containerSelectTestVersion">
                            <Select
                                styles={customStyles}
                                onChange={(inputValue) => {
                                    setVersion(inputValue.value);
                                }}
                                defaultValue={{
                                    label: version.version,
                                    value: version,
                                }}
                                options={prueba.versions.map((version) => {
                                    return {
                                        label: version.version,
                                        value: version,
                                    };
                                })}
                                classNamePrefix="select-test-version"
                                className="selectWebAppVersionDisponible"
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#ffffff',
                                        primary: '#fffff',
                                    },
                                })}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </>
    );
}

export default withRouter(PruebaDisponible);
