import React, { Component } from "react";
import DateTimeField from "react-bootstrap-datetimepicker";
import moment from 'moment';

class ParentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      format: "YYYY-MM-DD",
      inputFormat: "YYYY-MM-DD",
      mode: "date"
    };
  }

  handleChange = (newDate) => {
    console.log("newDate", newDate);
    return this.setState({date: newDate});
  }

  render() {
      const minimalDate = moment('01.01.2017', 'DD.MM.YYYY');
      const {date, format, mode, inputFormat} = this.state;
      console.log(minimalDate);
    return (<DateTimeField
      dateTime={date}
      format={format}
      minDate={minimalDate}
      inputFormat={inputFormat}
      onChange={this.handleChange}
      viewMode={mode}
    />);
  }
}
module.exports = ParentComponent;
