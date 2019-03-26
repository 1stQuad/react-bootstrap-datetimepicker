import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from "moment/moment";

export default class DateTimePickerYears extends Component {
    static propTypes = {
        subtractDecade: PropTypes.func.isRequired,
        addDecade: PropTypes.func.isRequired,
        viewDate: PropTypes.object.isRequired,
        selectedDate: PropTypes.object.isRequired,
        setViewYear: PropTypes.func.isRequired,
        minDate: PropTypes.object,
        maxDate: PropTypes.object,
        availableDatesStringArray: PropTypes.array(PropTypes.string)
    };

    renderYears = () => {
        var classes, year, years, minDate, maxDate;
        minDate = this.props.minDate
            ? moment.utc(this.props.minDate).clone()
            : this.props.minDate;
        maxDate = this.props.maxDate
            ? moment.utc(this.props.maxDate).clone()
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

            if(!classes.softDisabled && this.props.availableDatesStringArray) {
                if (this.props.availableDatesStringArray.indexOf(year.toString()) === -1)
                    classes.softDisabled = true;
            }

            years.push(
                <span
                    className={classnames(classes)}
                    key={year}
                    onClick={!classes.softDisabled ? this.props.setViewYear : undefined}
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
            <div className="datepicker-years" style={{display: 'block'}}>
                <table className="table-condensed">
                    <thead>
                    <tr>
                        <th className="prev" onClick={this.props.subtractDecade}>
                            <span className="fa fa-chevron-left"/>
                        </th>

                        <th className="switch" colSpan="5">
                            {year} - {year + 9}
                        </th>

                        <th className="next" onClick={this.props.addDecade}>
                            <span className="fa fa-chevron-right"/>
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
