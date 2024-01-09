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
        // this.fileInputRef.current.click();

        const closestPoint = this.getClosestPoint({ x: 357469.7, y: 4175482.52, z: -89.01 });
        console.log('closestPoint:', closestPoint);
        this.addPoint(closestPoint);
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

    getClosestPoint = (targetPoint) => {  // targetPoint: { x: x, y: y }
        const pointsBoxes = this.findPointsBoxesContaining(targetPoint);
        const points = this.getPointsInPointsBoxes(pointsBoxes);
        const distances = points.map(point => this.getDistance(point, targetPoint));
        const minDistance = Math.min(...distances);
        const index = distances.indexOf(minDistance);
        return points[index];
    }

    findPointsBoxesContaining = (point) => {
        const boxes = [];

        const queue = [viewer.scene.pointclouds[0].children[0]];
        while (queue.length > 0) {
            const pointsBox = queue.pop();

            if (!this.isThisPointsBoxContaining(pointsBox, point))  // not containing
                continue;

            if (pointsBox.children.length) {  // not a leaf node
                queue.push(...pointsBox.children);
                continue;
            }

            boxes.push(pointsBox);  // this box contains the point and leaf node
        }

        return boxes;
    }

    isThisPointsBoxContaining = (pointsBox, point) => {
        const { min, max } = pointsBox.geometry.boundingBox;
        const { x, y } = point;
        return (
            min.x <= x && x <= max.x
            && min.y <= y && y <= max.y
        );
    }

    getPointsInPointsBoxes = (pointsBoxes) => {
        const points = [];

        pointsBoxes.forEach(pointsBox => {
            const offset = pointsBox.position;
            const { array, count, itemSize } = pointsBox?.geometry?.attributes?.position;
            for (let i = 0; i < (count * itemSize); i += itemSize) {
                points.push({
                    x: array[i] + offset.x,
                    y: array[i + 1] + offset.y,
                    z: array[i + 2] + offset.z
                });
            }
        });

        return points;
    }

    getDistance = (point1, point2) => {
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    addPointsOnPointCloud = (utmPoints) => {
        // this.addPoints(utmPoints);
    }

    addPoints = (points) => points.map(point => this.addPoint(point));

    addPoint = (point) => {
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

        measure.addMarker([point.x, point.y, point.z]);

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