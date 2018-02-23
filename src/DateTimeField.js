import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import moment from 'moment';
import classnames from 'classnames';
import DateTimePicker from './DateTimePicker.js';
import Constants from './Constants.js';

export default class DateTimeField extends Component {
  static defaultProps = {
    dateTime: moment().format('x'),
    format: 'x',
    showToday: true,
    viewMode: 'days',
    daysOfWeekDisabled: [],
    inputRef: 'inputDateTime',
    size: Constants.SIZE_MEDIUM,
    mode: Constants.MODE_DATETIME,
    onChange: x => {
      console.log(x);
    },
    onBlur: () => {},
    onEnterKeyDown: () => {},
  };

  constructor(props) {
    super(props);

    var dateTime = moment().format(props.format);
    if (props.dateTime && moment.isMoment(props.dateTime)) {
      dateTime = props.dateTime;
    } else if (moment(props.dateTime, props.format, true).isValid()) {
      dateTime = moment(props.dateTime, props.format, true);
    }

    this.state = {
      showDatePicker: props.mode !== Constants.MODE_TIME,
      showTimePicker: props.mode === Constants.MODE_TIME,
      inputDisplayFormat: this.resolvePropsInputDisplayFormat(),
      inputFormat: this.resolvePropsInputFormat(),
      buttonIcon:
        props.mode === Constants.MODE_TIME
          ? 'glyphicon-time'
          : 'glyphicon-calendar',
      widgetStyle: {
        display: 'block',
        position: 'absolute',
        left: -9999,
        zIndex: '9999 !important',
      },
      viewDate: moment(dateTime, this.props.format).startOf('month'),
      selectedDate: moment(dateTime, this.props.format),
      inputValue: props.dateTime
        ? moment(dateTime, this.props.format).format(this.resolvePropsInputDisplayFormat())
        : '',
      isValid: true,
    };
  }

  getDefaultDateFormat = () => {
    switch (this.props.mode) {
      case Constants.MODE_TIME:
        return 'h:mm A';
      case Constants.MODE_DATE:
        return 'MM/DD/YY';
      case Constants.MODE_MONTH:
        return 'MM/YY';
      default:
        return 'MM/DD/YY h:mm A';
    }
  };

  resolvePropsInputDisplayFormat = (props = this.props) => {
    if (props.inputDisplayFormat) {
      return props.inputDisplayFormat;
    } else if (props.inputFormat && typeof props.inputFormat === 'string') {
      return props.inputFormat;
    } else if (props.inputFormat && Array.isArray(props.inputFormat)) {
      return props.inputFormat[0];
    }
    return this.getDefaultDateFormat();
  };

  resolvePropsInputFormat = () => {
    if (this.props.inputFormat) {
      return this.props.inputFormat;
    }
    return this.getDefaultDateFormat();
  };

  static propTypes = {
    dateTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(moment),
    ]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onEnterKeyDown: PropTypes.func,
    format: PropTypes.string,
    inputRef: PropTypes.string,
    inputProps: PropTypes.object,
    inputFormat: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    inputDisplayFormat: PropTypes.string,
    defaultText: PropTypes.string,
    mode: PropTypes.oneOf([
      Constants.MODE_DATE,
      Constants.MODE_MONTH,
      Constants.MODE_DATETIME,
      Constants.MODE_TIME,
    ]),
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    direction: PropTypes.string,
    showToday: PropTypes.bool,
    viewMode: PropTypes.string,
    size: PropTypes.oneOf([
      Constants.SIZE_SMALL,
      Constants.SIZE_MEDIUM,
      Constants.SIZE_LARGE,
    ]),
    daysOfWeekDisabled: PropTypes.arrayOf(PropTypes.number),
    isValid: PropTypes.bool,
    name: PropTypes.string,
    tabIndex: PropTypes.string,
  };

  componentWillReceiveProps = nextProps => {
    let state = {};
    state.inputDisplayFormat = this.resolvePropsInputDisplayFormat(nextProps);

    if (!nextProps.dateTime) {
      var now = moment().format(nextProps.format);
      state.viewDate = moment(now, nextProps.format, true).startOf('month');
      state.selectedDate = moment(now, nextProps.format, true);
      state.inputValue = '';
    } else if (moment.isMoment(nextProps.dateTime)) {
      state.viewDate = moment(nextProps.dateTime).startOf('month');
      state.selectedDate = moment(nextProps.dateTime);
      state.inputValue = moment(nextProps.dateTime).format(
        state.inputDisplayFormat,
      );
    } else if (moment(nextProps.dateTime, nextProps.format, true).isValid()) {
      state.viewDate = moment(
        nextProps.dateTime,
        nextProps.format,
        true,
      ).startOf('month');
      state.selectedDate = moment(nextProps.dateTime, nextProps.format, true);
      state.inputValue = moment(
        nextProps.dateTime,
        nextProps.format,
        true,
      ).format(state.inputDisplayFormat);
    }
    return this.setState(state);
  };

  formatValueForEvent(eventName, event) {
    const value = event.target == null ? event : event.target.value;
    const inputDate = moment(value, this.state.inputFormat, true);
    const yearDigits = this.yearDigits(value);
    const yearIsDone =
      yearDigits === 4 ||
      (yearDigits === 2 &&
        (eventName === 'onEnterKeyDown' || eventName === 'onBlur'));
    let formatValue = value;

    this.setIsValid(this.checkIsValid(value));

    if (yearIsDone && inputDate.isValid()) {
      this.setState({
        selectedDate: inputDate,
        viewDate: inputDate.clone().startOf('month'),
      });

      formatValue = inputDate.format(this.state.inputDisplayFormat);
    }

    return this.setState(
      {
        inputValue: eventName === 'onChange' ? value : formatValue,
      },
      function() {
        return this.props[eventName](
          inputDate.format(this.props.format),
          formatValue,
        );
      },
    );
  }

  yearDigits(value) {
    let separator = value.match(/\W/);
    if (separator) {
      separator = separator[0];
    }
    if (this.props.mode === 'date') {
      return value.split(separator)[2] ? value.split(separator)[2].length : 0;
    } else if (this.props.mode === 'month') {
      return value.split(separator)[1] ? value.split(separator)[1].length : 0;
    }
  }

  onChange = event => {
    this.formatValueForEvent('onChange', event);
  };

  onBlur = event => {
    this.formatValueForEvent('onBlur', event);
  };

  onKeyDown = event => {
    if (event.key === 'Enter') {
      this.formatValueForEvent('onEnterKeyDown', event);
    }
  };

  checkIsValid = value => {
    return (
      moment(value, this.state.inputFormat, true).isValid() ||
      value === this.props.defaultText ||
      value === ''
    );
  };

  setIsValid = isValid => {
    return this.setState({
      isValid: isValid,
    });
  };

  setSelectedMonth = e => {
    const { target } = e;
    if (target.className && !target.className.match(/disabled/g)) {
      this.setIsValid(true);
      return this.setState(
        {
          selectedDate: moment(this.state.viewDate.clone().toDate())
            .month(e.target.innerHTML)
            .date(1)
            .hour(this.state.selectedDate.hours())
            .minute(this.state.selectedDate.minutes()),
        },
        function() {
          this.closePicker();
          this.props.onChange(
            this.state.selectedDate.format(this.props.format),
          );
          return this.setState({
            inputValue: this.state.selectedDate.format(
              this.state.inputDisplayFormat,
            ),
          });
        },
      );
    }
  };

  setSelectedDate = e => {
    const { target } = e;

    if (target.className && !target.className.match(/disabled/g)) {
      this.setIsValid(true);
      let month;
      if (target.className.indexOf('new') >= 0)
        month = this.state.viewDate.month() + 1;
      else if (target.className.indexOf('old') >= 0)
        month = this.state.viewDate.month() - 1;
      else month = this.state.viewDate.month();
      return this.setState(
        {
          selectedDate: moment(this.state.viewDate)
            .month(month)
            .date(parseInt(e.target.innerHTML))
            .hour(this.state.selectedDate.hours())
            .minute(this.state.selectedDate.minutes()),
        },
        function() {
          this.closePicker();
          this.props.onChange(
            this.state.selectedDate.format(this.props.format),
          );
          return this.setState({
            inputValue: this.state.selectedDate.format(
              this.state.inputDisplayFormat,
            ),
          });
        },
      );
    }
  };

  setSelectedHour = e => {
    this.setIsValid(true);
    return this.setState(
      {
        selectedDate: this.state.selectedDate
          .clone()
          .hour(parseInt(e.target.innerHTML))
          .minute(this.state.selectedDate.minutes()),
      },
      function() {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(
            this.state.inputDisplayFormat,
          ),
        });
      },
    );
  };

  setSelectedMinute = e => {
    this.setIsValid(true);
    return this.setState(
      {
        selectedDate: this.state.selectedDate
          .clone()
          .hour(this.state.selectedDate.hours())
          .minute(parseInt(e.target.innerHTML)),
      },
      function() {
        this.closePicker();
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(
            this.state.inputDisplayFormat,
          ),
        });
      },
    );
  };

  setViewMonth = month => {
    return this.setState({
      viewDate: this.state.viewDate.clone().month(month),
    });
  };

  setViewYear = year => {
    return this.setState({
      viewDate: this.state.viewDate.clone().year(year),
    });
  };

  addMinute = () => {
    return this.setState(
      {
        selectedDate: this.state.selectedDate.clone().add(1, 'minutes'),
      },
      function() {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(
            this.resolvePropsInputDisplayFormat(),
          ),
        });
      },
    );
  };

  addHour = () => {
    return this.setState(
      {
        selectedDate: this.state.selectedDate.clone().add(1, 'hours'),
      },
      function() {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(
            this.resolvePropsInputDisplayFormat(),
          ),
        });
      },
    );
  };

  addMonth = () => {
    return this.setState({
      viewDate: this.state.viewDate.add(1, 'months'),
    });
  };

  addYear = () => {
    return this.setState({
      viewDate: this.state.viewDate.add(1, 'years'),
    });
  };

  addDecade = () => {
    return this.setState({
      viewDate: this.state.viewDate.add(10, 'years'),
    });
  };

  subtractMinute = () => {
    return this.setState(
      {
        selectedDate: this.state.selectedDate.clone().subtract(1, 'minutes'),
      },
      () => {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(
            this.resolvePropsInputDisplayFormat(),
          ),
        });
      },
    );
  };

  subtractHour = () => {
    return this.setState(
      {
        selectedDate: this.state.selectedDate.clone().subtract(1, 'hours'),
      },
      () => {
        this.props.onChange(this.state.selectedDate.format(this.props.format));
        return this.setState({
          inputValue: this.state.selectedDate.format(
            this.resolvePropsInputDisplayFormat(),
          ),
        });
      },
    );
  };

  subtractMonth = () => {
    return this.setState({
      viewDate: this.state.viewDate.subtract(1, 'months'),
    });
  };

  subtractYear = () => {
    return this.setState({
      viewDate: this.state.viewDate.subtract(1, 'years'),
    });
  };

  subtractDecade = () => {
    return this.setState({
      viewDate: this.state.viewDate.subtract(10, 'years'),
    });
  };

  togglePeriod = () => {
    if (this.state.selectedDate.hour() > 12) {
      return this.onChange(
        this.state.selectedDate
          .clone()
          .subtract(12, 'hours')
          .format(this.state.inputDisplayFormat),
      );
    } else {
      return this.onChange(
        this.state.selectedDate
          .clone()
          .add(12, 'hours')
          .format(this.state.inputDisplayFormat),
      );
    }
  };

  togglePicker = () => {
    return this.setState({
      showDatePicker: !this.state.showDatePicker,
      showTimePicker: !this.state.showTimePicker,
    });
  };

  setToday = () => {
    var today = moment();
    if (
      this.props.dateTime &&
      moment.isMoment(this.props.dateTime) &&
      this.props.dateTime.isUtc()
    ) {
      today.utc();
    }
    this.setIsValid(true);
    return this.setState(
      {
        selectedDate: today,
      },
      function() {
        this.closePicker();
        this.props.onChange(today);
        return this.setState({
          inputValue: this.state.selectedDate.format(
            this.resolvePropsInputDisplayFormat(),
          ),
        });
      },
    );
  };

  calculatePosition = options => {
    let classes,
      gBCR,
      offset,
      placePosition,
      scrollTop,
      styles,
      widgetOffsetHeight,
      clientHeight,
      height;

    classes = {};
    if (options) {
      classes['months'] = options.monthsDisplayed;
      classes['years'] = options.yearsDisplayed;
      classes['days'] = options.daysDisplayed;
      classes['time'] = options.timeDisplayed;
    }
    gBCR = this.dtpbutton.getBoundingClientRect();

    offset = {
      top: gBCR.top + window.pageYOffset - document.documentElement.clientTop,
      left: 0,
    };
    offset.top = offset.top + this.datetimepicker.offsetHeight;
    //Support for both old version of react and new version (v1.4.2) of react
    //The new version of react return the child refs as a component rather than a DomNode
    widgetOffsetHeight =
      this.widget.offsetHeight ||
      ReactDOM.findDOMNode(this.widget).offsetHeight; // eslint-disable-line react/no-find-dom-node
    clientHeight =
      this.widget.clientHeight ||
      ReactDOM.findDOMNode(this.widget).clientHeight; // eslint-disable-line react/no-find-dom-node
    height = this.widget.height || ReactDOM.findDOMNode(this.widget).height; // eslint-disable-line react/no-find-dom-node

    scrollTop =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    placePosition =
      this.props.direction === 'up'
        ? 'top'
        : this.props.direction === 'bottom'
          ? 'bottom'
          : this.props.direction === 'auto'
            ? offset.top + widgetOffsetHeight >
                window.offsetHeight + scrollTop &&
              widgetOffsetHeight + this.datetimepicker.offsetHeight > offset.top
              ? 'top'
              : 'bottom'
            : void 0;
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
      right: 40,
    };
    return this.setState({
      widgetStyle: styles,
      widgetClasses: classes,
    });
  };

  onClick = () => {
    let displayOptions = {};

    if (this.state.showPicker) {
      return this.closePicker();
    } else {
      this.setState({
        showPicker: true,
      });
      displayOptions.yearsDisplayed = this.props.mode === 'year';
      displayOptions.monthsDisplayed = this.props.mode === 'month';
      displayOptions.daysDisplayed = this.props.mode === 'date';
      displayOptions.timeDisplayed = this.props.mode === 'time';

      this.calculatePosition(displayOptions);
    }
  };

  closePicker = () => {
    let style = { ...this.state.widgetStyle };
    style.left = -9999;
    style.display = 'block';
    return this.setState({
      showPicker: false,
      widgetStyle: style,
    });
  };

  size = () => {
    switch (this.props.size) {
      case Constants.SIZE_SMALL:
        return 'form-group-sm';
      case Constants.SIZE_LARGE:
        return 'form-group-lg';
    }

    return '';
  };

  renderOverlay = () => {
    const styles = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: '999',
    };
    if (this.state.showPicker) {
      return <div onClick={this.closePicker} style={styles} />;
    } else {
      return <span />;
    }
  };

  render() {
    return (
      <div className="bootstrap-datetimepicker-wrap">
        {this.renderOverlay()}
        <DateTimePicker
          addDecade={this.addDecade}
          addHour={this.addHour}
          addMinute={this.addMinute}
          addMonth={this.addMonth}
          addYear={this.addYear}
          daysOfWeekDisabled={this.props.daysOfWeekDisabled}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          mode={this.props.mode}
          ref={el => {
            this.widget = el;
          }}
          selectedDate={this.state.selectedDate}
          setSelectedMonth={this.setSelectedMonth}
          setSelectedDate={this.setSelectedDate}
          setSelectedHour={this.setSelectedHour}
          setSelectedMinute={this.setSelectedMinute}
          setViewMonth={this.setViewMonth}
          setViewYear={this.setViewYear}
          setToday={this.setToday}
          showDatePicker={this.state.showDatePicker}
          showTimePicker={this.state.showTimePicker}
          showToday={this.props.showToday}
          subtractDecade={this.subtractDecade}
          subtractHour={this.subtractHour}
          subtractMinute={this.subtractMinute}
          subtractMonth={this.subtractMonth}
          subtractYear={this.subtractYear}
          togglePeriod={this.togglePeriod}
          togglePicker={this.togglePicker}
          viewDate={this.state.viewDate}
          viewMode={this.props.viewMode}
          widgetClasses={this.state.widgetClasses}
          widgetStyle={this.state.widgetStyle}
          calculatePosition={this.calculatePosition}
        />
        <div
          className={classnames('input-group date ' + this.size(), {
            'has-error': !this.state.isValid,
          })}
          ref={el => {
            this.datetimepicker = el;
          }}
        >
          <input
            className="form-control"
            onChange={this.onChange}
            onBlur={this.onBlur}
            type="text"
            tabIndex={this.props.tabIndex}
            value={this.state.inputValue}
            ref={el => {
              this[this.props.inputRef] = el;
            }}
            onKeyDown={this.onKeyDown}
            name={this.props.name}
            placeholder={this.props.defaultText}
            {...this.props.inputProps}
          />
          <span
            className="input-group-addon"
            onBlur={this.onBlur}
            onClick={this.onClick}
            ref={el => {
              this.dtpbutton = el;
            }}
          >
            <span className={classnames('glyphicon', this.state.buttonIcon)} />
          </span>
        </div>
      </div>
    );
  }
}
