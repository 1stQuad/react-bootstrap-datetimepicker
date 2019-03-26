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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ConstantsJs = require('./Constants.js');

var _ConstantsJs2 = _interopRequireDefault(_ConstantsJs);

var DateTimePickerMonths = (function (_Component) {
    _inherits(DateTimePickerMonths, _Component);

    function DateTimePickerMonths() {
        var _this = this;

        _classCallCheck(this, DateTimePickerMonths);

        _get(Object.getPrototypeOf(DateTimePickerMonths.prototype), 'constructor', this).apply(this, arguments);

        this.renderMonths = function () {
            var classes, month, months, monthsShort, minDate, maxDate, currentMonth;
            var onClick = _this.props.mode === _ConstantsJs2['default'].MODE_MONTH ? _this.props.setSelectedMonth : _this.props.setViewMonth;
            month = _this.props.selectedDate.month();
            monthsShort = _moment2['default'].monthsShort();
            minDate = _this.props.minDate ? _moment2['default'].utc(_this.props.minDate).clone().subtract(1, 'months') : _this.props.minDate;
            maxDate = _this.props.maxDate ? _moment2['default'].utc(_this.props.maxDate).clone() : _this.props.maxDate;
            months = [];
            currentMonth = _moment2['default'].utc([_this.props.viewDate.year(), 0, 1]);
            for (var i = 0; i < 12; i++) {
                classes = {
                    month: true,
                    active: i === month && _this.props.viewDate.year() === _this.props.selectedDate.year(),
                    softDisabled: minDate && currentMonth.isBefore(minDate) || maxDate && currentMonth.isAfter(maxDate)
                };

                if (!classes.softDisabled && _this.props.availableDatesStringArray.length > 0) {
                    var date = currentMonth.toDate();
                    if (_this.props.availableDatesStringArray.indexOf(date.getUTCMonth() + '-' + date.getUTCFullYear()) === -1) classes.softDisabled = true;
                }

                months.push(_react2['default'].createElement(
                    'span',
                    { className: (0, _classnames2['default'])(classes), key: i, onClick: !classes.softDisabled ? onClick : undefined },
                    monthsShort[i]
                ));
                currentMonth.add(1, 'months');
            }
            return months;
        };
    }

    _createClass(DateTimePickerMonths, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: 'datepicker-months', style: { display: 'block' } },
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
                                { className: 'prev', onClick: this.props.subtractYear },
                                _react2['default'].createElement('span', { className: 'fa fa-chevron-left' })
                            ),
                            _react2['default'].createElement(
                                'th',
                                { className: 'switch', colSpan: '5', onClick: this.props.showYears },
                                this.props.viewDate.year()
                            ),
                            _react2['default'].createElement(
                                'th',
                                { className: 'next', onClick: this.props.addYear },
                                _react2['default'].createElement('span', { className: 'fa fa-chevron-right' })
                            )
                        )
                    ),
                    _react2['default'].createElement(
                        'tbody',
                        null,
                        _react2['default'].createElement(
                            'tr',
                            null,
                            _react2['default'].createElement(
                                'td',
                                { colSpan: '7' },
                                this.renderMonths()
                            )
                        )
                    )
                )
            );
        }
    }], [{
        key: 'propTypes',
        value: {
            subtractYear: _propTypes2['default'].func.isRequired,
            addYear: _propTypes2['default'].func.isRequired,
            viewDate: _propTypes2['default'].object.isRequired,
            selectedDate: _propTypes2['default'].object.isRequired,
            showYears: _propTypes2['default'].func.isRequired,
            setViewMonth: _propTypes2['default'].func.isRequired,
            setSelectedMonth: _propTypes2['default'].func.isRequired,
            minDate: _propTypes2['default'].object,
            maxDate: _propTypes2['default'].object,
            mode: _propTypes2['default'].oneOf([_ConstantsJs2['default'].MODE_DATE, _ConstantsJs2['default'].MODE_MONTH, _ConstantsJs2['default'].MODE_DATETIME]),
            availableDatesStringArray: _propTypes2['default'].arrayOf(_propTypes2['default'].string)
        },
        enumerable: true
    }]);

    return DateTimePickerMonths;
})(_react.Component);

exports['default'] = DateTimePickerMonths;
module.exports = exports['default'];