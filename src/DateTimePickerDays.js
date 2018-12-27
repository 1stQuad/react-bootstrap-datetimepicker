import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

const isoWeekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default class DateTimePickerDays extends Component {
  static propTypes = {
    subtractMonth: PropTypes.func.isRequired,
    addMonth: PropTypes.func.isRequired,
    viewDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    showToday: PropTypes.bool,
    daysOfWeekDisabled: PropTypes.array,
    setSelectedDate: PropTypes.func.isRequired,
    showMonths: PropTypes.func.isRequired,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    startOfWeek: PropTypes.string,
  };

  static defaultProps = {
    showToday: true,
    daysOfWeekDisabled: [],
    startOfWeek: 'isoWeek',
  };

  renderDays = () => {
    let cells = [];
    let classes;
    let row;
    const year = this.props.viewDate.year();
    const month = this.props.viewDate.month();
    const prevMonth = this.props.viewDate.clone().subtract(1, 'months');
    let days = prevMonth.daysInMonth();
    prevMonth.date(days).startOf(this.props.startOfWeek);
    const nextMonth = moment(prevMonth)
      .clone()
      .add(42, 'd');
    const minDate = this.props.minDate
      ? this.props.minDate.clone().subtract(1, 'days')
      : this.props.minDate;
    const maxDate = this.props.maxDate
      ? this.props.maxDate.clone()
      : this.props.maxDate;
    let html = [];

    while (prevMonth.isBefore(nextMonth)) {
      classes = {
        day: true,
      };
      if (
        prevMonth.year() < year ||
        (prevMonth.year() === year && prevMonth.month() < month)
      ) {
        classes.old = true;
      } else if (
        prevMonth.year() > year ||
        (prevMonth.year() === year && prevMonth.month() > month)
      ) {
        classes.new = true;
      }
      if (
        prevMonth.isSame(
          moment({
            y: this.props.selectedDate.year(),
            M: this.props.selectedDate.month(),
            d: this.props.selectedDate.date(),
          }),
        )
      ) {
        classes.active = true;
      }
      if (this.props.showToday) {
        if (prevMonth.isSame(moment(), 'day')) {
          classes.today = true;
        }
      }
      if (
        (minDate && prevMonth.isBefore(minDate)) ||
        (minDate && prevMonth.isSame(minDate)) ||
        (maxDate && prevMonth.isAfter(maxDate)) ||
        (maxDate && prevMonth.isSame(maxDate))
      ) {
        classes.softDisabled = true;
      }
      if (this.props.daysOfWeekDisabled.length > 0)
        classes.softDisabled =
          this.props.daysOfWeekDisabled.indexOf(prevMonth.day()) !== -1;
      cells.push(
        <td
          className={classnames(classes)}
          key={prevMonth.month() + '-' + prevMonth.date()}
          onClick={
            !classes.softDisabled ? this.props.setSelectedDate : undefined
          }
        >
          {prevMonth.date()}
        </td>,
      );
      if (
        prevMonth.weekday() ===
        moment()
          .endOf(this.props.startOfWeek)
          .weekday()
      ) {
        row = <tr key={prevMonth.month() + '-' + prevMonth.date()}>{cells}</tr>;
        html.push(row);
        cells = [];
      }
      const tmpPrevMonth = prevMonth.clone();
      prevMonth.add(1, 'd');

      // handle a bug in JS engine of PhantomJS where if a day in the month is Daylight Saving Time,
      // when adding a day, it'll return the same day but the hour is changed to 23:00.
      if (tmpPrevMonth.date() === prevMonth.date()) {
        prevMonth.add(1, 'h');
      }
    }
    return html;
  };

  render() {
    return (
      <div className="datepicker-days" style={{ display: 'block' }}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractMonth}>
                <span className="fa fa-chevron-left" />
              </th>

              <th
                className="switch"
                colSpan="5"
                onClick={this.props.showMonths}
              >
                {moment.months()[this.props.viewDate.month()]}{' '}
                {this.props.viewDate.year()}
              </th>

              <th className="next" onClick={this.props.addMonth}>
                <span className="fa fa-chevron-right" />
              </th>
            </tr>

            <tr>{this.renderWeekHeader()}</tr>
          </thead>

          <tbody>{this.renderDays()}</tbody>
        </table>
      </div>
    );
  }

  renderWeekHeader() {
    let days = [];
    const dayList =
      this.props.startOfWeek === 'isoWeek' ? isoWeekDays : weekDays;
    dayList.forEach(day =>
      days.push(
        <th className="dow" key={day}>
          {day}
        </th>,
      ),
    );
    return days;
  }
}
