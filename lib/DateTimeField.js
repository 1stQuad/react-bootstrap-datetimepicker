'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _DateTimePickerJs = require('./DateTimePicker.js');

var _DateTimePickerJs2 = _interopRequireDefault(_DateTimePickerJs);

var _ConstantsJs = require('./Constants.js');

var _ConstantsJs2 = _interopRequireDefault(_ConstantsJs);

var DateTimeField = (function (_Component) {
  _inherits(DateTimeField, _Component);

  _createClass(DateTimeField, null, [{
    key: 'defaultProps',
    value: {
      dateTime: (0, _moment2['default'])().format('x'),
      format: 'x',
      showToday: true,
      viewMode: 'days',
      daysOfWeekDisabled: [],
      inputRef: 'inputDateTime',
      size: _ConstantsJs2['default'].SIZE_MEDIUM,
      mode: _ConstantsJs2['default'].MODE_DATETIME,
      onChange: function onChange(x) {
        console.log(x);
      },
      onBlur: function onBlur() {},
      onEnterKeyDown: function onEnterKeyDown() {}
    },
    enumerable: true
  }]);

  function DateTimeField(props) {
    var _this = this;

    _classCallCheck(this, DateTimeField);

    _get(Object.getPrototypeOf(DateTimeField.prototype), 'constructor', this).call(this, props);

    this.getDefaultDateFormat = function () {
      switch (_this.props.mode) {
        case _ConstantsJs2['default'].MODE_TIME:
          return 'h:mm A';
        case _ConstantsJs2['default'].MODE_DATE:
          return 'MM/DD/YY';
        case _ConstantsJs2['default'].MODE_MONTH:
          return 'MM/YY';
        default:
          return 'MM/DD/YY h:mm A';
      }
    };

    this.resolvePropsInputDisplayFormat = function () {
      var props = arguments.length <= 0 || arguments[0] === undefined ? _this.props : arguments[0];

      if (props.inputDisplayFormat) {
        return props.inputDisplayFormat;
      } else if (props.inputFormat && typeof props.inputFormat === 'string') {
        return props.inputFormat;
      } else if (props.inputFormat && Array.isArray(props.inputFormat)) {
        return props.inputFormat[0];
      }
      return _this.getDefaultDateFormat();
    };

    this.resolvePropsInputFormat = function () {
      if (_this.props.inputFormat) {
        return _this.props.inputFormat;
      }
      return _this.getDefaultDateFormat();
    };

    this.componentWillReceiveProps = function (nextProps) {
      var state = {};
      state.inputDisplayFormat = _this.resolvePropsInputDisplayFormat(nextProps);

      if (!nextProps.dateTime) {
        var now = (0, _moment2['default'])().format(nextProps.format);
        state.viewDate = (0, _moment2['default'])(now, nextProps.format, true).startOf('month');
        state.selectedDate = (0, _moment2['default'])(now, nextProps.format, true);
        state.inputValue = '';
      } else if (_moment2['default'].isMoment(nextProps.dateTime)) {
        state.viewDate = (0, _moment2['default'])(nextProps.dateTime).startOf('month');
        state.selectedDate = (0, _moment2['default'])(nextProps.dateTime);
        state.inputValue = (0, _moment2['default'])(nextProps.dateTime).format(state.inputDisplayFormat);
      } else if ((0, _moment2['default'])(nextProps.dateTime, nextProps.format, true).isValid()) {
        state.viewDate = (0, _moment2['default'])(nextProps.dateTime, nextProps.format, true).startOf('month');
        state.selectedDate = (0, _moment2['default'])(nextProps.dateTime, nextProps.format, true);
        state.inputValue = (0, _moment2['default'])(nextProps.dateTime, nextProps.format, true).format(state.inputDisplayFormat);
      }
      return _this.setState(state);
    };

    this.onChange = function (event) {
      _this.formatValueForEvent('onChange', event);
    };

    this.onBlur = function (event) {
      _this.formatValueForEvent('onBlur', event);
    };

    this.onKeyDown = function (event) {
      if (event.key === 'Enter') {
        _this.formatValueForEvent('onEnterKeyDown', event);
      }
    };

    this.checkIsValid = function (value) {
      return (0, _moment2['default'])(value, _this.state.inputFormat, true).isValid() || value === _this.props.defaultText || value === '';
    };

    this.setIsValid = function (isValid) {
      return _this.setState({
        isValid: isValid
      });
    };

    this.setSelectedMonth = function (e) {
      var target = e.target;

      if (target.className && !target.className.match(/disabled/g)) {
        _this.setIsValid(true);
        return _this.setState({
          selectedDate: (0, _moment2['default'])(_this.state.viewDate.clone().toDate()).month(e.target.innerHTML).date(1).hour(_this.state.selectedDate.hours()).minute(_this.state.selectedDate.minutes())
        }, function () {
          this.closePicker();
          this.props.onChange(this.state.selectedDate);
          return this.setState({
            inputValue: this.state.selectedDate.format(this.state.inputDisplayFormat)
          });
        });
      }
    };

    this.setSelectedDate = function (e) {
      var target = e.target;

      if (target.className && !target.className.match(/disabled/g)) {
        _this.setIsValid(true);
        var month = undefined;
        if (target.className.indexOf('new') >= 0) month = _this.state.viewDate.month() + 1;else if (target.className.indexOf('old') >= 0) month = _this.state.viewDate.month() - 1;else month = _this.state.viewDate.month();
        return _this.setState({
          selectedDate: (0, _moment2['default'])(_this.state.viewDate).month(month).date(parseInt(e.target.innerHTML)).hour(_this.state.selectedDate.hours()).minute(_this.state.selectedDate.minutes())
        }, function () {
          this.closePicker();
          this.props.onChange(this.state.selectedDate);
          return this.setState({
            inputValue: this.state.selectedDate.format(this.state.inputDisplayFormat)
          });
        });
      }
    };

    this.setSelectedHour = function (e) {
      _this.setIsValid(true);
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().hour(parseInt(e.target.innerHTML)).minute(_this.state.selectedDate.minutes())
      }, function () {
        this.closePicker();

        this.props.onChange(this.state.selectedDate);
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputDisplayFormat)
        });
      });
    };

    this.setSelectedMinute = function (e) {
      _this.setIsValid(true);
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().hour(_this.state.selectedDate.hours()).minute(parseInt(e.target.innerHTML))
      }, function () {
        this.closePicker();
        this.props.onChange(this.state.selectedDate);
        return this.setState({
          inputValue: this.state.selectedDate.format(this.state.inputDisplayFormat)
        });
      });
    };

    this.setViewMonth = function (month) {
      return _this.setState({
        viewDate: _this.state.viewDate.clone().month(month)
      });
    };

    this.setViewYear = function (year) {
      return _this.setState({
        viewDate: _this.state.viewDate.clone().year(year)
      });
    };

    this.addMinute = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().add(1, 'minutes')
      }, function () {
        this.props.onChange(this.state.selectedDate);
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputDisplayFormat())
        });
      });
    };

    this.addHour = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().add(1, 'hours')
      }, function () {
        this.props.onChange(this.state.selectedDate);
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputDisplayFormat())
        });
      });
    };

    this.addMonth = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(1, 'months')
      });
    };

    this.addYear = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(1, 'years')
      });
    };

    this.addDecade = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.add(10, 'years')
      });
    };

    this.subtractMinute = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().subtract(1, 'minutes')
      }, function () {
        _this.props.onChange(_this.state.selectedDate);
        return _this.setState({
          inputValue: _this.state.selectedDate.format(_this.resolvePropsInputDisplayFormat())
        });
      });
    };

    this.subtractHour = function () {
      return _this.setState({
        selectedDate: _this.state.selectedDate.clone().subtract(1, 'hours')
      }, function () {
        _this.props.onChange(_this.state.selectedDate);
        return _this.setState({
          inputValue: _this.state.selectedDate.format(_this.resolvePropsInputDisplayFormat())
        });
      });
    };

    this.subtractMonth = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(1, 'months')
      });
    };

    this.subtractYear = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(1, 'years')
      });
    };

    this.subtractDecade = function () {
      return _this.setState({
        viewDate: _this.state.viewDate.subtract(10, 'years')
      });
    };

    this.togglePeriod = function () {
      if (_this.state.selectedDate.hour() > 12) {
        return _this.onChange(_this.state.selectedDate.clone().subtract(12, 'hours').format(_this.state.inputDisplayFormat));
      } else {
        return _this.onChange(_this.state.selectedDate.clone().add(12, 'hours').format(_this.state.inputDisplayFormat));
      }
    };

    this.togglePicker = function () {
      return _this.setState({
        showDatePicker: !_this.state.showDatePicker,
        showTimePicker: !_this.state.showTimePicker
      });
    };

    this.setToday = function () {
      var today = (0, _moment2['default'])();
      if (_this.props.dateTime && _moment2['default'].isMoment(_this.props.dateTime) && _this.props.dateTime.isUtc()) {
        today.utc();
      }
      _this.setIsValid(true);
      return _this.setState({
        selectedDate: today
      }, function () {
        this.closePicker();
        this.props.onChange(today);
        return this.setState({
          inputValue: this.state.selectedDate.format(this.resolvePropsInputDisplayFormat())
        });
      });
    };

    this.calculatePosition = function (options) {
      var classes = undefined,
          gBCR = undefined,
          offset = undefined,
          placePosition = undefined,
          scrollTop = undefined,
          styles = undefined,
          widgetOffsetHeight = undefined,
          clientHeight = undefined,
          height = undefined;

      classes = {};
      if (options) {
        classes['months'] = options.monthsDisplayed;
        classes['years'] = options.yearsDisplayed;
        classes['days'] = options.daysDisplayed;
        classes['time'] = options.timeDisplayed;
      }
      gBCR = _this.wrapper.getBoundingClientRect();

      offset = {
        top: gBCR.top + window.pageYOffset - document.documentElement.clientTop,
        left: 0
      };
      offset.top = offset.top + _this.datetimepicker.offsetHeight;
      //Support for both old version of react and new version (v1.4.2) of react
      //The new version of react return the child refs as a component rather than a DomNode
      widgetOffsetHeight = _this.widget.offsetHeight || _reactDom2['default'].findDOMNode(_this.widget).offsetHeight; // eslint-disable-line react/no-find-dom-node
      clientHeight = _this.widget.clientHeight || _reactDom2['default'].findDOMNode(_this.widget).clientHeight; // eslint-disable-line react/no-find-dom-node
      height = _this.widget.height || _reactDom2['default'].findDOMNode(_this.widget).height; // eslint-disable-line react/no-find-dom-node

      scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      placePosition = _this.props.direction === 'up' ? 'top' : _this.props.direction === 'bottom' ? 'bottom' : _this.props.direction === 'auto' ? offset.top + widgetOffsetHeight > window.offsetHeight + scrollTop && widgetOffsetHeight + _this.datetimepicker.offsetHeight > offset.top ? 'top' : 'bottom' : void 0;
      if (placePosition === 'top') {
        offset.top = -widgetOffsetHeight - 2;
        classes.top = true;
        classes.bottom = false;
      } else {
        offset.top = 35;
        classes.top = false;
        classes.bottom = true;
      }
      styles = {
        display: 'block',
        position: 'absolute',
        top: offset.top,
        left: offset.left,
        right: 40
      };
      return _this.setState({
        widgetStyle: styles,
        widgetClasses: classes
      });
    };

    this.onClick = function () {
      var displayOptions = {};

      if (_this.state.showPicker) {
        return _this.closePicker();
      } else {
        _this.setState({
          showPicker: true
        });
        displayOptions.yearsDisplayed = _this.props.mode === 'year';
        displayOptions.monthsDisplayed = _this.props.mode === 'month';
        displayOptions.daysDisplayed = _this.props.mode === 'date';
        displayOptions.timeDisplayed = _this.props.mode === 'time';

        _this.calculatePosition(displayOptions);
      }
    };

    this.closePicker = function () {
      var style = _extends({}, _this.state.widgetStyle);
      style.left = -9999;
      style.display = 'block';
      return _this.setState({
        showPicker: false,
        widgetStyle: style
      });
    };

    this.size = function () {
      switch (_this.props.size) {
        case _ConstantsJs2['default'].SIZE_SMALL:
          return 'form-control-sm';
        case _ConstantsJs2['default'].SIZE_LARGE:
          return 'form-control-lg';
      }

      return '';
    };

    this.renderOverlay = function () {
      var styles = {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: '999'
      };
      if (_this.state.showPicker) {
        return _react2['default'].createElement('div', { onClick: _this.closePicker, style: styles });
      } else {
        return _react2['default'].createElement('span', null);
      }
    };

    var dateTime = (0, _moment2['default'])().format(props.format);
    if (props.dateTime && _moment2['default'].isMoment(props.dateTime)) {
      dateTime = props.dateTime;
    } else if ((0, _moment2['default'])(props.dateTime, props.format, true).isValid()) {
      dateTime = (0, _moment2['default'])(props.dateTime, props.format, true);
    }

    this.state = {
      showDatePicker: props.mode !== _ConstantsJs2['default'].MODE_TIME,
      showTimePicker: props.mode === _ConstantsJs2['default'].MODE_TIME,
      inputDisplayFormat: this.resolvePropsInputDisplayFormat(),
      inputFormat: this.resolvePropsInputFormat(),
      buttonIcon: props.mode === _ConstantsJs2['default'].MODE_TIME ? 'fa-clock-o' : 'fa-calendar',
      widgetStyle: {
        display: 'block',
        position: 'absolute',
        left: -9999,
        zIndex: '9999 !important'
      },
      viewDate: (0, _moment2['default'])(dateTime, this.props.format).startOf('month'),
      selectedDate: (0, _moment2['default'])(dateTime, this.props.format),
      inputValue: props.dateTime ? (0, _moment2['default'])(dateTime, this.props.format).format(this.resolvePropsInputDisplayFormat()) : '',
      isValid: true
    };
  }

  _createClass(DateTimeField, [{
    key: 'formatValueForEvent',
    value: function formatValueForEvent(eventName, event) {
      var value = event.target == null ? event : event.target.value;
      var inputDate = (0, _moment2['default'])(value, this.state.inputFormat, true);
      var yearDigits = this.yearDigits(value);
      var yearIsDone = yearDigits === 4 || yearDigits === 2 && (eventName === 'onEnterKeyDown' || eventName === 'onBlur');
      var formatValue = value;

      this.setIsValid(this.checkIsValid(value));

      if (yearIsDone && inputDate.isValid()) {
        this.setState({
          selectedDate: inputDate,
          viewDate: inputDate.clone().startOf('month')
        });

        formatValue = inputDate.format(this.state.inputDisplayFormat);
      }

      return this.setState({
        inputValue: formatValue
      }, function () {
        return this.props[eventName](inputDate, formatValue);
      });
    }
  }, {
    key: 'yearDigits',
    value: function yearDigits(value) {
      var separator = value.match(/\W/);
      if (separator) {
        separator = separator[0];
      }
      if (this.props.mode === 'date') {
        return value.split(separator)[2] ? value.split(separator)[2].length : 0;
      } else if (this.props.mode === 'month') {
        return value.split(separator)[1] ? value.split(separator)[1].length : 0;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2['default'].createElement(
        'div',
        { className: 'bootstrap-datetimepicker-wrap',
          ref: function (el) {
            _this2.wrapper = el;
          } },
        this.renderOverlay(),
        _react2['default'].createElement(_DateTimePickerJs2['default'], {
          addDecade: this.addDecade,
          addHour: this.addHour,
          addMinute: this.addMinute,
          addMonth: this.addMonth,
          addYear: this.addYear,
          daysOfWeekDisabled: this.props.daysOfWeekDisabled,
          maxDate: this.props.maxDate,
          minDate: this.props.minDate,
          mode: this.props.mode,
          ref: function (el) {
            _this2.widget = el;
          },
          selectedDate: this.state.selectedDate,
          setSelectedMonth: this.setSelectedMonth,
          setSelectedDate: this.setSelectedDate,
          setSelectedHour: this.setSelectedHour,
          setSelectedMinute: this.setSelectedMinute,
          setViewMonth: this.setViewMonth,
          setViewYear: this.setViewYear,
          setToday: this.setToday,
          showDatePicker: this.state.showDatePicker,
          showTimePicker: this.state.showTimePicker,
          showPeriod: this.props.showPeriod,
          disabled: this.props.disabled,
          showToday: this.props.showToday,
          subtractDecade: this.subtractDecade,
          subtractHour: this.subtractHour,
          subtractMinute: this.subtractMinute,
          subtractMonth: this.subtractMonth,
          subtractYear: this.subtractYear,
          togglePeriod: this.togglePeriod,
          togglePicker: this.togglePicker,
          viewDate: this.state.viewDate,
          viewMode: this.props.viewMode,
          widgetClasses: this.state.widgetClasses,
          widgetStyle: this.state.widgetStyle,
          calculatePosition: this.calculatePosition
        }),
        _react2['default'].createElement(
          'div',
          {
            className: (0, _classnames2['default'])('date ', {
              'has-error': !this.state.isValid
            }),
            onClick: this.onClick,
            ref: function (el) {
              _this2.datetimepicker = el;
            }
          },
          _react2['default'].createElement('input', _extends({
            className: "form-control " + this.size(),
            onChange: this.onChange,
            onBlur: this.onBlur,
            type: 'text',
            tabIndex: this.props.tabIndex,
            value: this.state.inputValue,
            ref: function (el) {
              _this2[_this2.props.inputRef] = el;
            },
            disabled: this.props.disabled,
            onKeyDown: this.onKeyDown,
            name: this.props.name,
            placeholder: this.props.defaultText
          }, this.props.inputProps)),
          _react2['default'].createElement(
            'span',
            {
              className: 'input-group-addon',
              onBlur: this.onBlur,
              hidden: !this.props.showInputIcon,
              ref: function (el) {
                _this2.dtpbutton = el;
              }
            },
            _react2['default'].createElement('span', { className: (0, _classnames2['default'])('fa', this.state.buttonIcon) })
          )
        )
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      dateTime: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number, _propTypes2['default'].instanceOf(_moment2['default'])]),
      onChange: _propTypes2['default'].func,
      onBlur: _propTypes2['default'].func,
      onEnterKeyDown: _propTypes2['default'].func,
      format: _propTypes2['default'].string,
      inputRef: _propTypes2['default'].string,
      inputProps: _propTypes2['default'].object,
      inputFormat: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].arrayOf(_propTypes2['default'].string)]),
      inputDisplayFormat: _propTypes2['default'].string,
      defaultText: _propTypes2['default'].string,
      mode: _propTypes2['default'].oneOf([_ConstantsJs2['default'].MODE_DATE, _ConstantsJs2['default'].MODE_MONTH, _ConstantsJs2['default'].MODE_DATETIME, _ConstantsJs2['default'].MODE_TIME]),
      minDate: _propTypes2['default'].object,
      maxDate: _propTypes2['default'].object,
      direction: _propTypes2['default'].string,
      showToday: _propTypes2['default'].bool,
      viewMode: _propTypes2['default'].string,
      size: _propTypes2['default'].oneOf([_ConstantsJs2['default'].SIZE_SMALL, _ConstantsJs2['default'].SIZE_MEDIUM, _ConstantsJs2['default'].SIZE_LARGE]),
      showPeriod: _propTypes2['default'].bool,
      showInputIcon: _propTypes2['default'].bool,
      disabled: _propTypes2['default'].bool,
      daysOfWeekDisabled: _propTypes2['default'].arrayOf(_propTypes2['default'].number),
      isValid: _propTypes2['default'].bool,
      name: _propTypes2['default'].string,
      tabIndex: _propTypes2['default'].string
    },
    enumerable: true
  }]);

  return DateTimeField;
})(_react.Component);

exports['default'] = DateTimeField;
module.exports = exports['default'];