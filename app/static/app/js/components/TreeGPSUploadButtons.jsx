import React from 'react';
import '../css/TreeGPSUploadButtons.scss';
import PropTypes from 'prop-types';
import { _ } from '../classes/gettext';

class TreeGPSUploadButtons extends React.Component {
    static propTypes = {
        buttonClass: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = { jsonData: null };
        this.fileInputRef = React.createRef();
    }

    handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            try {
                const json = JSON.parse(text);
                this.setState({ jsonData: json });
                const { view } = Potree.saveProject(window.viewer);
                console.log(view);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };
        reader.readAsText(file);
    };

    handleButtonClick = () => {
        this.fileInputRef.current.click();
    };

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