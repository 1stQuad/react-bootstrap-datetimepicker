import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class DateTimePickerYears extends Component {
  static propTypes = {
    subtractDecade: PropTypes.func.isRequired,
    addDecade: PropTypes.func.isRequired,
    viewDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    setViewYear: PropTypes.func.isRequired,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
  };

  renderYears = () => {
    var classes, year, years, minDate, maxDate;
    minDate = this.props.minDate
      ? this.props.minDate.clone()
      : this.props.minDate;
    maxDate = this.props.maxDate
      ? this.props.maxDate.clone()
      : this.props.maxDate;
    years = [];
    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
    year--;
    for (let i = -1; i < 11; i++) {
      classes = {
        year: true,
        active: this.props.selectedDate.year() === year,
        softDisabled:
          (minDate && year < minDate.year()) ||
          (maxDate && year > maxDate.year()),
      };
      years.push(
        <span
          className={classnames(classes)}
          key={year}
          onClick={this.props.setViewYear}
        >
          {year}
        </span>,
      );
      year++;
    }
    return years;
  };

  render() {
    var year;
    year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
    return (
      <div className="datepicker-years" style={{ display: 'block' }}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractDecade}>
                <span className="glyphicon glyphicon-chevron-left" />
              </th>

              <th className="switch" colSpan="5">
                {year} - {year + 9}
              </th>

              <th className="next" onClick={this.props.addDecade}>
                <span className="glyphicon glyphicon-chevron-right" />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="7">{this.renderYears()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
