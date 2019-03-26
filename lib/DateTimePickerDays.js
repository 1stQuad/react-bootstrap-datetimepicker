'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var isoWeekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
var weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

var DateTimePickerDays = (function (_Component) {
    _inherits(DateTimePickerDays, _Component);

    function DateTimePickerDays() {
        var _this = this;

        _classCallCheck(this, DateTimePickerDays);

        _get(Object.getPrototypeOf(DateTimePickerDays.prototype), 'constructor', this).apply(this, arguments);

        this.renderDays = function () {
            var cells, classes, days, html, month, nextMonth, prevMonth, minDate, maxDate, row, year;
            year = _this.props.viewDate.year();
            month = _this.props.viewDate.month();
            prevMonth = _this.props.viewDate.clone().subtract(1, 'months');
            days = prevMonth.daysInMonth();
            prevMonth.date(days).startOf(_this.props.startOfWeek);
            nextMonth = _moment2['default'].utc(prevMonth).clone().add(42, 'd');
            minDate = _this.props.minDate ? _moment2['default'].utc(_this.props.minDate).clone().subtract(1, 'days') : _this.props.minDate;
            maxDate = _this.props.maxDate ? _moment2['default'].utc(_this.props.maxDate).clone() : _this.props.maxDate;
            html = [];
            cells = [];
            while (prevMonth.isBefore(nextMonth)) {
                classes = {
                    day: true
                };
                if (prevMonth.year() < year || prevMonth.year() === year && prevMonth.month() < month) {
                    classes.old = true;
                } else if (prevMonth.year() > year || prevMonth.year() === year && prevMonth.month() > month) {
                    classes['new'] = true;
                }
                if (prevMonth.isSame(_moment2['default'].utc({
                    y: _this.props.selectedDate.year(),
                    M: _this.props.selectedDate.month(),
                    d: _this.props.selectedDate.date()
                }))) {
                    classes.active = true;
                }
                if (_this.props.showToday) {
                    if (prevMonth.isSame(_moment2['default'].utc(), 'day')) {
                        classes.today = true;
                    }
                }
                if (minDate && prevMonth.isBefore(minDate) || minDate && prevMonth.isSame(minDate) || maxDate && prevMonth.isAfter(maxDate) || maxDate && prevMonth.isSame(maxDate)) {
                    classes.softDisabled = true;
                }
                if (!classes.softDisabled && _this.props.availableDatesStringArray.length > 0) {
                    var date = prevMonth.toDate();
                    if (_this.props.availableDatesStringArray.indexOf(date.getUTCDate() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear()) === -1) classes.softDisabled = true;
                }

                if (!classes.softDisabled && _this.props.daysOfWeekDisabled.length > 0) {
                    if (_this.props.daysOfWeekDisabled.indexOf(prevMonth.day()) !== -1) classes.softDisabled = true;
                }
                cells.push(_react2['default'].createElement(
                    'td',
                    {
                        className: (0, _classnames2['default'])(classes),
                        key: prevMonth.month() + '-' + prevMonth.date(),
                        onClick: !classes.softDisabled ? _this.props.setSelectedDate : undefined
                    },
                    prevMonth.date()
                ));
                if (prevMonth.weekday() === _moment2['default'].utc().endOf(_this.props.startOfWeek).weekday()) {
                    row = _react2['default'].createElement(
                        'tr',
                        { key: prevMonth.month() + '-' + prevMonth.date() },
                        cells
                    );
                    html.push(row);
                    cells = [];
                }
                var tmpPrevMonth = prevMonth.clone();
                prevMonth.add(1, 'd');

                // handle a bug in JS engine of PhantomJS where if a day in the month is Daylight Saving Time,
                // when adding a day, it'll return the same day but the hour is changed to 23:00.
                if (tmpPrevMonth.date() === prevMonth.date()) {
                    prevMonth.add(1, 'h');
                }
            }
            return html;
        };
    }

    _createClass(DateTimePickerDays, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: 'datepicker-days', style: { display: 'block' } },
                _react2['default'].createElement(
                    'table',
                    { className: 'table-condensed' },
                    _react2['default'].createElement(
                        'thead',
                        null,
                        _react2['default'].createElement(
                            'tr',
                            null,
                            _react2['default'].createElement(
                                'th',
                                { className: 'prev', onClick: this.props.subtractMonth },
                                _react2['default'].createElement('span', { className: 'fa fa-chevron-left' })
                            ),
                            _react2['default'].createElement(
                                'th',
                                {
                                    className: 'switch',
                                    colSpan: '5',
                                    onClick: this.props.showMonths
                                },
                                _moment2['default'].months()[this.props.viewDate.month()],
                                ' ',
                                this.props.viewDate.year()
                            ),
                            _react2['default'].createElement(
                                'th',
                                { className: 'next', onClick: this.props.addMonth },
                                _react2['default'].createElement('span', { className: 'fa fa-chevron-right' })
                            )
                        ),
                        _react2['default'].createElement(
                            'tr',
                            null,
                            this.renderWeekHeader()
                        )
                    ),
                    _react2['default'].createElement(
                        'tbody',
                        null,
                        this.renderDays()
                    )
                )
            );
        }
    }, {
        key: 'renderWeekHeader',
        value: function renderWeekHeader() {
            var days = [];
            var dayList = this.props.startOfWeek === 'isoWeek' ? isoWeekDays : weekDays;
            dayList.forEach(function (day) {
                return days.push(_react2['default'].createElement(
                    'th',
                    { className: 'dow', key: day },
                    day
                ));
            });
            return days;
        }
    }], [{
        key: 'propTypes',
        value: {
            subtractMonth: _propTypes2['default'].func.isRequired,
            addMonth: _propTypes2['default'].func.isRequired,
            viewDate: _propTypes2['default'].object.isRequired,
            selectedDate: _propTypes2['default'].object.isRequired,
            showToday: _propTypes2['default'].bool,
            daysOfWeekDisabled: _propTypes2['default'].array,
            setSelectedDate: _propTypes2['default'].func.isRequired,
            showMonths: _propTypes2['default'].func.isRequired,
            minDate: _propTypes2['default'].object,
            maxDate: _propTypes2['default'].object,
            startOfWeek: _propTypes2['default'].string,
            availableDatesStringArray: _propTypes2['default'].arrayOf(_propTypes2['default'].string)
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            showToday: true,
            daysOfWeekDisabled: [],
            startOfWeek: 'isoWeek'
        },
        enumerable: true
    }]);

    return DateTimePickerDays;
})(_react.Component);

exports['default'] = DateTimePickerDays;
module.exports = exports['default'];