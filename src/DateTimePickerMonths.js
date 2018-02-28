import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import Constants from './Constants.js';

export default class DateTimePickerMonths extends Component {
  static propTypes = {
    subtractYear: PropTypes.func.isRequired,
    addYear: PropTypes.func.isRequired,
    viewDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    showYears: PropTypes.func.isRequired,
    setViewMonth: PropTypes.func.isRequired,
    setSelectedMonth: PropTypes.func.isRequired,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    mode: PropTypes.oneOf([
      Constants.MODE_DATE,
      Constants.MODE_MONTH,
      Constants.MODE_DATETIME,
    ]),
  };

  renderMonths = () => {
    var classes, month, months, monthsShort, minDate, maxDate, currentMonth;
    const onClick =
      this.props.mode === Constants.MODE_MONTH
        ? this.props.setSelectedMonth
        : this.props.setViewMonth;
    month = this.props.selectedDate.month();
    monthsShort = moment.monthsShort();
    minDate = this.props.minDate
      ? this.props.minDate.clone().subtract(1, 'months')
      : this.props.minDate;
    maxDate = this.props.maxDate
      ? this.props.maxDate.clone()
      : this.props.maxDate;
    months = [];
    currentMonth = moment([this.props.viewDate.year(), 0, 1]);
    for (let i = 0; i < 12; i++) {
      classes = {
        month: true,
        active:
          i === month &&
          this.props.viewDate.year() === this.props.selectedDate.year(),
        softDisabled:
          (minDate && currentMonth.isBefore(minDate)) ||
          (maxDate && currentMonth.isAfter(maxDate)),
      };
      months.push(
        <span className={classnames(classes)} key={i} onClick={onClick}>
          {monthsShort[i]}
        </span>,
      );
      currentMonth.add(1, 'months');
    }
    return months;
  };

  render() {
    return (
      <div className="datepicker-months" style={{ display: 'block' }}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractYear}>
                <span className="glyphicon glyphicon-chevron-left" />
              </th>

              <th className="switch" colSpan="5" onClick={this.props.showYears}>
                {this.props.viewDate.year()}
              </th>

              <th className="next" onClick={this.props.addYear}>
                <span className="glyphicon glyphicon-chevron-right" />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="7">{this.renderMonths()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
