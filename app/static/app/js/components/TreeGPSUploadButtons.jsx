import React from 'react';
import '../css/TreeGPSUploadButtons.scss';
import PropTypes from 'prop-types';
import ExportAssetDialog from './ExportAssetDialog';
import { _ } from '../classes/gettext';

class TreeGPSUploadButtons extends React.Component {
    static defaultProps = {
        disabled: false,
        direction: "down", // or "up",
        buttonClass: "btn-primary",
        task: null,
        showLabel: true
    };

    static propTypes = {
        disabled: PropTypes.bool,
        task: PropTypes.object.isRequired,
        direction: PropTypes.string,
        buttonClass: PropTypes.string,
        showLabel: PropTypes.bool,
        onModalOpen: PropTypes.func,
        onModalClose: PropTypes.func
    };

    constructor(props) {
        super();

        this.state = {
            exportDialogProps: null
        }
    }

    onHide = () => {
        this.setState({ exportDialogProps: null });
        if (this.props.onModalClose) this.props.onModalClose();
    }

    render() {
        return (<div className={"tree-gps-upload-buttons " + (this.props.showLabel ? "btn-group" : "") + " " + (this.props.direction === "up" ? "dropup" : "")}>

            {this.state.exportDialogProps ?
                <ExportAssetDialog task={this.props.task}
                    asset={this.state.exportDialogProps.asset}
                    exportFormats={this.state.exportDialogProps.exportFormats}
                    exportParams={this.state.exportDialogProps.exportParams}
                    onHide={this.onHide}
                    assetLabel={this.state.exportDialogProps.assetLabel}
                />
                : ""}

            <button type="button" className={"btn btn-sm " + this.props.buttonClass} disabled={this.props.disabled} data-toggle="dropdown">
                <i className="glyphicon glyphicon-download"></i>{this.props.showLabel ? " " + _("Upload Trees GPS") : ""}
            </button>
            {this.props.showLabel ?
                <button type="button" className={"btn btn-sm dropdown-toggle " + this.props.buttonClass} data-toggle="dropdown" disabled={this.props.disabled}>
                    <span className="caret"></span>
                </button> : ""}
            <ul className="dropdown-menu">
            </ul>
        </div>);
    }
}

export default TreeGPSUploadButtons;