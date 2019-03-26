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

var _momentMoment = require("moment/moment");

var _momentMoment2 = _interopRequireDefault(_momentMoment);

var DateTimePickerYears = (function (_Component) {
    _inherits(DateTimePickerYears, _Component);

    function DateTimePickerYears() {
        var _this = this;

        _classCallCheck(this, DateTimePickerYears);

        _get(Object.getPrototypeOf(DateTimePickerYears.prototype), 'constructor', this).apply(this, arguments);

        this.renderYears = function () {
            var classes, year, years, minDate, maxDate;
            minDate = _this.props.minDate ? _momentMoment2['default'].utc(_this.props.minDate).clone() : _this.props.minDate;
            maxDate = _this.props.maxDate ? _momentMoment2['default'].utc(_this.props.maxDate).clone() : _this.props.maxDate;
            years = [];
            year = parseInt(_this.props.viewDate.year() / 10, 10) * 10;
            year--;
            for (var i = -1; i < 11; i++) {
                classes = {
                    year: true,
                    active: _this.props.selectedDate.year() === year,
                    softDisabled: minDate && year < minDate.year() || maxDate && year > maxDate.year()
                };

                if (!classes.softDisabled && _this.props.availableDatesStringArray.length > 0) {
                    if (_this.props.availableDatesStringArray.indexOf(year.toString()) === -1) classes.softDisabled = true;
                }

                years.push(_react2['default'].createElement(
                    'span',
                    {
                        className: (0, _classnames2['default'])(classes),
                        key: year,
                        onClick: !classes.softDisabled ? _this.props.setViewYear : undefined
                    },
                    year
                ));
                year++;
            }
            return years;
        };
    }

    _createClass(DateTimePickerYears, [{
        key: 'render',
        value: function render() {
            var year;
            year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
            return _react2['default'].createElement(
                'div',
                { className: 'datepicker-years', style: { display: 'block' } },
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
                                { className: 'prev', onClick: this.props.subtractDecade },
                                _react2['default'].createElement('span', { className: 'fa fa-chevron-left' })
                            ),
                            _react2['default'].createElement(
                                'th',
                                { className: 'switch', colSpan: '5' },
                                year,
                                ' - ',
                                year + 9
                            ),
                            _react2['default'].createElement(
                                'th',
                                { className: 'next', onClick: this.props.addDecade },
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
                                this.renderYears()
                            )
                        )
                    )
                )
            );
        }
    }], [{
        key: 'propTypes',
        value: {
            subtractDecade: _propTypes2['default'].func.isRequired,
            addDecade: _propTypes2['default'].func.isRequired,
            viewDate: _propTypes2['default'].object.isRequired,
            selectedDate: _propTypes2['default'].object.isRequired,
            setViewYear: _propTypes2['default'].func.isRequired,
            minDate: _propTypes2['default'].object,
            maxDate: _propTypes2['default'].object,
            availableDatesStringArray: _propTypes2['default'].arrayOf(_propTypes2['default'].string)
        },
        enumerable: true
    }]);

    return DateTimePickerYears;
})(_react.Component);

exports['default'] = DateTimePickerYears;
module.exports = exports['default'];