"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var DateTimePickerDays = (function (_Component) {
  _inherits(DateTimePickerDays, _Component);

  function DateTimePickerDays() {
    var _this = this;

    _classCallCheck(this, DateTimePickerDays);

    _get(Object.getPrototypeOf(DateTimePickerDays.prototype), "constructor", this).apply(this, arguments);

    this.renderDays = function () {
      var cells, classes, days, html, month, nextMonth, prevMonth, minDate, maxDate, row, year;
      year = _this.props.viewDate.year();
      month = _this.props.viewDate.month();
      prevMonth = _this.props.viewDate.clone().subtract(1, "months");
      days = prevMonth.daysInMonth();
      prevMonth.date(days).startOf("week");
      nextMonth = (0, _moment2["default"])(prevMonth).clone().add(42, "d");
      minDate = _this.props.minDate ? _this.props.minDate.clone().subtract(1, "days") : _this.props.minDate;
      maxDate = _this.props.maxDate ? _this.props.maxDate.clone() : _this.props.maxDate;
      html = [];
      cells = [];
      while (prevMonth.isBefore(nextMonth)) {
        classes = {
          day: true
        };
        if (prevMonth.year() < year || prevMonth.year() === year && prevMonth.month() < month) {
          classes.old = true;
        } else if (prevMonth.year() > year || prevMonth.year() === year && prevMonth.month() > month) {
          classes["new"] = true;
        }
        if (prevMonth.isSame((0, _moment2["default"])({
          y: _this.props.selectedDate.year(),
          M: _this.props.selectedDate.month(),
          d: _this.props.selectedDate.date()
        }))) {
          classes.active = true;
        }
        if (_this.props.showToday) {
          if (prevMonth.isSame((0, _moment2["default"])(), "day")) {
            classes.today = true;
          }
        }
        if (minDate && prevMonth.isBefore(minDate) || maxDate && prevMonth.isAfter(maxDate)) {
          classes.softDisabled = true;
        }
        if (_this.props.daysOfWeekDisabled.length > 0) classes.softDisabled = _this.props.daysOfWeekDisabled.indexOf(prevMonth.day()) !== -1;
        cells.push(_react2["default"].createElement(
          "td",
          { className: (0, _classnames2["default"])(classes), key: prevMonth.month() + "-" + prevMonth.date(), onClick: _this.props.setSelectedDate },
          prevMonth.date()
        ));
        if (prevMonth.weekday() === (0, _moment2["default"])().endOf("week").weekday()) {
          row = _react2["default"].createElement(
            "tr",
            { key: prevMonth.month() + "-" + prevMonth.date() },
            cells
          );
          html.push(row);
          cells = [];
        }
        var tmpPrevMonth = prevMonth.clone();
        prevMonth.add(1, "d");

        // handle a bug in JS engine of PhantomJS where if a day in the month is Daylight Saving Time,
        // when adding a day, it'll return the same day but the hour is changed to 23:00.
        if (tmpPrevMonth.date() === prevMonth.date()) {
          prevMonth.add(1, "h");
        }
      }
      return html;
    };
  }

  _createClass(DateTimePickerDays, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { className: "datepicker-days", style: { display: "block" } },
        _react2["default"].createElement(
          "table",
          { className: "table-condensed" },
          _react2["default"].createElement(
            "thead",
            null,
            _react2["default"].createElement(
              "tr",
              null,
              _react2["default"].createElement(
                "th",
                { className: "prev", onClick: this.props.subtractMonth },
                _react2["default"].createElement("span", { className: "glyphicon glyphicon-chevron-left" })
              ),
              _react2["default"].createElement(
                "th",
                { className: "switch", colSpan: "5", onClick: this.props.showMonths },
                _moment2["default"].months()[this.props.viewDate.month()],
                " ",
                this.props.viewDate.year()
              ),
              _react2["default"].createElement(
                "th",
                { className: "next", onClick: this.props.addMonth },
                _react2["default"].createElement("span", { className: "glyphicon glyphicon-chevron-right" })
              )
            ),
            _react2["default"].createElement(
              "tr",
              null,
              _react2["default"].createElement(
                "th",
                { className: "dow" },
                "Su"
              ),
              _react2["default"].createElement(
                "th",
                { className: "dow" },
                "Mo"
              ),
              _react2["default"].createElement(
                "th",
                { className: "dow" },
                "Tu"
              ),
              _react2["default"].createElement(
                "th",
                { className: "dow" },
                "We"
              ),
              _react2["default"].createElement(
                "th",
                { className: "dow" },
                "Th"
              ),
              _react2["default"].createElement(
                "th",
                { className: "dow" },
                "Fr"
              ),
              _react2["default"].createElement(
                "th",
                { className: "dow" },
                "Sa"
              )
            )
          ),
          _react2["default"].createElement(
            "tbody",
            null,
            this.renderDays()
          )
        )
      );
    }
  }], [{
    key: "propTypes",
    value: {
      subtractMonth: _propTypes2["default"].func.isRequired,
      addMonth: _propTypes2["default"].func.isRequired,
      viewDate: _propTypes2["default"].object.isRequired,
      selectedDate: _propTypes2["default"].object.isRequired,
      showToday: _propTypes2["default"].bool,
      daysOfWeekDisabled: _propTypes2["default"].array,
      setSelectedDate: _propTypes2["default"].func.isRequired,
      showMonths: _propTypes2["default"].func.isRequired,
      minDate: _propTypes2["default"].object,
      maxDate: _propTypes2["default"].object
    },
    enumerable: true
  }, {
    key: "defaultProps",
    value: {
      showToday: true
    },
    enumerable: true
  }]);

  return DateTimePickerDays;
})(_react.Component);

exports["default"] = DateTimePickerDays;
module.exports = exports["default"];