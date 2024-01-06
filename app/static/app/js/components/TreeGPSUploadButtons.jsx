import React from 'react';
import * as utm from 'utm';
import { v4 as uuidv4 } from 'uuid';

import '../css/TreeGPSUploadButtons.scss';
import PropTypes from 'prop-types';
import { _ } from '../classes/gettext';

class TreeGPSUploadButtons extends React.Component {
    static propTypes = {
        buttonClass: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.fileInputRef = React.createRef();
    }

    handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            try {
                const gpsData = JSON.parse(text);
                const utmPoints = this.gpsToUtm(gpsData);
                this.addPointsOnPointCloud(utmPoints);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };
        reader.readAsText(file);
    };

    handleButtonClick = () => {
        this.fileInputRef.current.click();
    };

    gpsToUtm = (gpsData) => {
        return gpsData.map(point => {
            const { lat, lon } = point;
            const utmData = utm.fromLatLon(lat, lon);
            return {
                x: utmData.easting,
                y: utmData.northing
            };
        });
    };

    addPointsOnPointCloud = (utmPoints) => {
        this.addPoints(utmPoints);
    }

    addPoints = (points) => {
        const measure = new Potree.Measure();

        measure.uuid = uuidv4();
        measure.name = 'Point';
        measure.showDistances = false;
        measure.showCoordinates = true;
        measure.showArea = false;
        measure.closed = false;
        measure.showAngles = false;
        measure.showHeight = false;
        measure.showCircle = false;
        measure.showAzimuth = false;
        measure.showEdges = true;

        for (const point of points) {
            measure.addMarker(point);
        }

        window.viewer.scene.addMeasurement(measure);
    }

    render() {
        return (
            <div className="tree-gps-upload-buttons">
                <input
                    type="file"
                    ref={this.fileInputRef}
                    onChange={this.handleFileUpload}
                    accept=".json"
                    style={{ display: 'none' }}
                />
                <button type="button" className={"btn btn-sm " + this.props.buttonClass} onClick={this.handleButtonClick}>
                    <i className="glyphicon glyphicon-tree-conifer"></i>
                </button>
            </div>
        );
    }
}

export default TreeGPSUploadButtons;