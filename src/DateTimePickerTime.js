import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DateTimePickerMinutes from './DateTimePickerMinutes';
import DateTimePickerHours from './DateTimePickerHours';
import Constants from './Constants.js';

export default class DateTimePickerTime extends Component {
    static propTypes = {
        setSelectedHour: PropTypes.func.isRequired,
        setSelectedMinute: PropTypes.func.isRequired,
        subtractHour: PropTypes.func.isRequired,
        addHour: PropTypes.func.isRequired,
        subtractMinute: PropTypes.func.isRequired,
        addMinute: PropTypes.func.isRequired,
        viewDate: PropTypes.object.isRequired,
        selectedDate: PropTypes.object.isRequired,
        togglePeriod: PropTypes.func.isRequired,
        showPeriod: PropTypes.bool,
        showPicker: PropTypes.bool,
        unlimited: PropTypes.bool,
        mode: PropTypes.oneOf([
            Constants.MODE_DATE,
            Constants.MODE_DATETIME,
            Constants.MODE_TIME,
        ]),
    };

    state = {
        minutesDisplayed: false,
        hoursDisplayed: false,
    };

    goBack = () => {
        return this.setState({
            minutesDisplayed: false,
            hoursDisplayed: false,
        });
    };

    showMinutes = () => {
        return this.setState({
            minutesDisplayed: true,
        });
    };

    showHours = () => {
        return this.setState({
            hoursDisplayed: true,
        });
    };

    setSelectedMinute = event => {
        this.goBack();
        this.props.setSelectedMinute(event);
    };

    setSelectedHour = event => {
        this.goBack();
        this.props.setSelectedHour(event);
    };

    renderMinutes = () => {
        if (this.state.minutesDisplayed) {
            return <DateTimePickerMinutes
                {...this.props}
                setSelectedMinute={this.setSelectedMinute}
                onSwitch={this.goBack}/>;
        } else {
            return null;
        }
    };

    renderHours = () => {
        if (this.state.hoursDisplayed) {
            return <DateTimePickerHours
                {...this.props}
                setSelectedHour={this.setSelectedHour}
                onSwitch={this.goBack}/>;
        } else {
            return null;
        }
    };

    renderPicker = () => {
        if (!this.state.minutesDisplayed && !this.state.hoursDisplayed) {
            return (
                <div className="timepicker-picker">
                    <table className="table-condensed">
                        <tbody>
                        <tr>
                            <td>
                                <a className="btn" onClick={this.props.addHour}>
                                    <span className="fa fa-chevron-up"/>
                                </a>
                            </td>

                            <td className="separator"/>

                            <td>
                                <a className="btn" onClick={this.props.addMinute}>
                                    <span className="fa fa-chevron-up"/>
                                </a>
                            </td>

                            <td className="separator" hidden={!this.props.showPeriod}/>
                        </tr>

                        <tr>
                            <td>
                                <span className="timepicker-hour" onClick={this.showHours}>
                                {this.props.selectedDate.format('HH')}
                                </span>
                            </td>
                            <td className="separator">:</td>
                            <td>
                                <span className="timepicker-minute" onClick={this.showMinutes}>
                                {this.props.selectedDate.format('mm')}
                                </span>
                            </td>
                            <td className="separator" hidden={!this.props.showPeriod}/>
                            <td hidden={!this.props.showPeriod}>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.props.togglePeriod}
                                    type="button"
                                >
                                    {this.props.selectedDate.format('A')}
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <a className="btn" onClick={this.props.subtractHour}>
                                    <span className="fa fa-chevron-down"/>
                                </a>
                            </td>

                            <td className="separator"/>

                            <td>
                                <a className="btn" onClick={this.props.subtractMinute}>
                                    <span className="fa fa-chevron-down"/>
                                </a>
                            </td>

                            <td className="separator" hidden={!this.props.showPeriod}/>
                        </tr>
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return '';
        }
    };

    componentWillReceiveProps(newProps) {
        if (!this.props.showPicker && newProps.showPicker && (this.state.minutesDisplayed || this.state.hoursDisplayed)) {
            this.goBack();
        }
    }

    render() {
        return (
            <div className="timepicker">
                {this.renderPicker()}

                {this.renderHours()}

                {this.renderMinutes()}
            </div>
        );
    }
}

module.exports = DateTimePickerTime;
