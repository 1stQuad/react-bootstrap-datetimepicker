import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DateTimePickerDate from './DateTimePickerDate.js';
import DateTimePickerTime from './DateTimePickerTime.js';
import Constants from './Constants.js';

export default class DateTimePicker extends Component {
  static propTypes = {
    showDatePicker: PropTypes.bool,
    showTimePicker: PropTypes.bool,
    subtractMonth: PropTypes.func.isRequired,
    addMonth: PropTypes.func.isRequired,
    viewDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    showToday: PropTypes.bool,
    viewMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mode: PropTypes.oneOf([
      Constants.MODE_DATE,
      Constants.MODE_MONTH,
      Constants.MODE_DATETIME,
      Constants.MODE_TIME,
    ]),
    daysOfWeekDisabled: PropTypes.array,
    setSelectedMonth: PropTypes.func.isRequired,
    setSelectedDate: PropTypes.func.isRequired,
    subtractYear: PropTypes.func.isRequired,
    addYear: PropTypes.func.isRequired,
    setViewMonth: PropTypes.func.isRequired,
    setViewYear: PropTypes.func.isRequired,
    subtractHour: PropTypes.func.isRequired,
    addHour: PropTypes.func.isRequired,
    subtractMinute: PropTypes.func.isRequired,
    addMinute: PropTypes.func.isRequired,
    addDecade: PropTypes.func.isRequired,
    subtractDecade: PropTypes.func.isRequired,
    togglePeriod: PropTypes.func.isRequired,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    widgetClasses: PropTypes.object,
    widgetStyle: PropTypes.object,
    togglePicker: PropTypes.func,
    setSelectedHour: PropTypes.func,
    setSelectedMinute: PropTypes.func,
    setToday: PropTypes.func,
    calculatePosition: PropTypes.func,
  };

  renderDatePicker = () => {
    if (this.props.showDatePicker) {
      return (
        <li>
          <DateTimePickerDate
            addDecade={this.props.addDecade}
            addMonth={this.props.addMonth}
            addYear={this.props.addYear}
            daysOfWeekDisabled={this.props.daysOfWeekDisabled}
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
            selectedDate={this.props.selectedDate}
            setSelectedMonth={this.props.setSelectedMonth}
            setSelectedDate={this.props.setSelectedDate}
            setViewMonth={this.props.setViewMonth}
            setViewYear={this.props.setViewYear}
            showToday={this.props.showToday}
            subtractDecade={this.props.subtractDecade}
            subtractMonth={this.props.subtractMonth}
            subtractYear={this.props.subtractYear}
            viewDate={this.props.viewDate}
            viewMode={this.props.viewMode}
            mode={this.props.mode}
            calculatePosition={this.props.calculatePosition}
          />
        </li>
      );
    }
  };

  componentWillUpdate = (nextProps, newState) => {
    this.shouldCalculatePosition = false;
    if (nextProps.showTimePicker !== this.props.showTimePicker) {
      this.shouldCalculatePosition = true;
    }
  };

  componentDidUpdate = () => {
    if (this.shouldCalculatePosition) {
      this.props.calculatePosition();
    }
  };

  renderTimePicker = () => {
    if (this.props.showTimePicker) {
      return (
        <li>
          <DateTimePickerTime
            addHour={this.props.addHour}
            addMinute={this.props.addMinute}
            mode={this.props.mode}
            selectedDate={this.props.selectedDate}
            setSelectedHour={this.props.setSelectedHour}
            setSelectedMinute={this.props.setSelectedMinute}
            subtractHour={this.props.subtractHour}
            subtractMinute={this.props.subtractMinute}
            togglePeriod={this.props.togglePeriod}
            viewDate={this.props.viewDate}
          />
        </li>
      );
    }
  };

  renderSwitchButton = () => {
    return this.props.mode === Constants.MODE_DATETIME ? (
      <li>
        <span
          className="btn picker-switch"
          onClick={this.props.togglePicker}
          style={{ width: '100%' }}
        >
          <span
            className={classNames(
              'glyphicon',
              this.props.showTimePicker
                ? 'glyphicon-calendar'
                : 'glyphicon-time',
            )}
          />
        </span>
      </li>
    ) : this.props.mode === Constants.MODE_DATE ? (
      <li>
        <span
          className="btn btn-today"
          onClick={this.props.setToday}
          style={{ width: '100%' }}
        >
          Today
        </span>
      </li>
    ) : null;
  };

  render() {
    const widgetClass = classNames(
      'bootstrap-datetimepicker-widget',
      'dropdown-menu',
      this.props.widgetClasses,
    );

    return (
      <div className={widgetClass} style={this.props.widgetStyle}>
        <ul className="list-unstyled">
          {this.renderDatePicker()}

          {this.renderSwitchButton()}

          {this.renderTimePicker()}
        </ul>
      </div>
    );
  }
}
