import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';

jest.dontMock('moment');
jest.dontMock('../DateTimeField.js');

function shallowRender(component) {
  const shallowRenderer = new ShallowRenderer();
  shallowRenderer.render(component);
  return shallowRenderer.getRenderOutput();
}

describe('DateTimeField', function() {
  const moment = require('moment');
  const DateTimeField = require('../DateTimeField.js');
  const happyDate = moment('1990-06-05 07:30');
  let createParent, TestParent;

  describe('By default', function() {
    it('shows the right date for a given dateTime and inputFormat', function() {
      const component = TestUtils.renderIntoDocument(
        <DateTimeField dateTime={happyDate.format('x')} />,
      );
      const input = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'input',
      );
      expect(input.value).toBe('06/05/90 7:30 AM');
    });

    describe('when the defaultText prop is set', function() {
      it('initialises the value to a provided dateTime prop', function() {
        const component = TestUtils.renderIntoDocument(
          <DateTimeField defaultText="Foo" dateTime={happyDate.format('x')} />,
        );
        const input = TestUtils.findRenderedDOMComponentWithTag(
          component,
          'input',
        );
        expect(input.value).toBe('06/05/90 7:30 AM');
      });

      it('initialises the value to a blank string with an empty string dateTime', function() {
        const component = TestUtils.renderIntoDocument(
          <DateTimeField defaultText="Foo" dateTime="" />,
        );
        const input = TestUtils.findRenderedDOMComponentWithTag(
          component,
          'input',
        );
        expect(input.value).toBe('');
      });
    });
  });

  describe('When changing props', function() {
    beforeEach(() => {
      TestParent = React.createFactory(
        class extends React.Component {
          static displayName = 'AnonymousTestComponent';

          constructor(props) {
            super(props);

            this.state = {
              dateTime: happyDate.format('x'),
              ...this.props,
            };
          }

          render() {
            return <DateTimeField {...this.state} />;
          }
        },
      );
      createParent = (initalState) => TestUtils.renderIntoDocument(TestParent(initalState)); // eslint-disable-line
    });

    it('changes the displayed date when dateTime changes', function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      expect(input.value).toBe('06/05/90 7:30 AM');
      Parent.setState({ dateTime: moment('1981-06-04 05:45').format('x') });
      expect(input.value).toBe('06/04/81 5:45 AM');
    });

    it('changes the displayed format when string type inputFormat changes, with no inputDisplayFormat', function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      expect(input.value).toBe('06/05/90 7:30 AM');
      Parent.setState({ inputFormat: 'x' });
      expect(input.value).toBe(happyDate.format('x'));
    });

    it('changes the displayed empty when input is null', function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');

      Parent.setState({ dateTime: null });
      expect(input.value).toBe('');
    });

    it('changes the displayed empty when input is empty string', function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');

      Parent.setState({ dateTime: '' });
      expect(input.value).toBe('');
    });

    it('changes the displayed format when array inputFormat changes, with no inputDisplayFormat', function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      expect(input.value).toBe('06/05/90 7:30 AM');
      Parent.setState({
        dateTime: moment('1981-06-04 05:45').format('x'),
        inputFormat: ['MM YYYY', 'M YYYY'],
      });
      // inputDisplayFormat is set based on inputFormat, which is an array and first one is chosen
      expect(input.value).toBe('06 1981');
    });

    it('changes the displayed format when string inputDisplayFormat changes, with no inputFormat', function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      expect(input.value).toBe('06/05/90 7:30 AM');
      Parent.setState({ inputDisplayFormat: 'DD MMM YYYY H:mm' });
      expect(input.value).toBe('05 Jun 1990 7:30');
    });

    it('changes the displayed format when inputDisplayFormat changes, with inputFormat', function() {
      const Parent = createParent();
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      expect(input.value).toBe('06/05/90 7:30 AM');
      Parent.setState({
        inputDisplayFormat: 'DD MMM YYYY H:mm',
        inputFormat: 'x',
      });
      expect(input.value).toBe('05 Jun 1990 7:30');
    });

    it("doesn't change the defaultText if dateTime didn't change", function() {
      const Parent = createParent({ defaultText: 'Pick a date' });
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      expect(input.getAttribute('placeholder')).toBe('Pick a date');
      Parent.setState({});
      expect(input.getAttribute('placeholder')).toBe('Pick a date');
    });

    it('should call the onChange callback', function() {
      const onChangeMock = jest.genMockFunction();
      const Parent = createParent({ onChange: onChangeMock });
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      input.value = '2:13 AM';
      TestUtils.Simulate.change(input);

      expect(onChangeMock.mock.calls.length).toBe(1);
    });

    it('should call the onBlur callback', function() {
      const onBlurMock = jest.genMockFunction();
      const Parent = createParent({ onBlur: onBlurMock });
      const input = TestUtils.findRenderedDOMComponentWithTag(Parent, 'input');
      input.value = '2:13 AM';
      TestUtils.Simulate.change(input);
      TestUtils.Simulate.blur(input);

      expect(onBlurMock.mock.calls.length).toBe(1);
    });
  });

  describe('formatValueForEvent', () => {
    let component, setStateMock, yearDigitsMock, inputFormat;
    beforeEach(() => {
      inputFormat = ['DD/MM/YYYY', 'DD/MM/YY', 'D/M/YYYY'];
      component = TestUtils.renderIntoDocument(
        <DateTimeField
          dateTime={happyDate.format('x')}
          inputFormat={inputFormat}
        />,
      );
      setStateMock = jest.genMockFunction();
      yearDigitsMock = jest.genMockFunction();
      component.setState = setStateMock;
      component.setIsValid = jest.genMockFunction();
    });

    describe('on change', () => {
      it('calls setState twice when the year is 4 digits and is valid', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 4);
        const date = '12/12/2016';
        const selectedValue = moment(date, inputFormat, true).format();
        const viewDate = moment(date, inputFormat, true)
          .startOf('month')
          .format();

        component.formatValueForEvent('onChange', { target: { value: date } });

        expect(setStateMock.mock.calls.length).toBe(2);
        expect(setStateMock.mock.calls[0][0].selectedDate.format()).toEqual(
          selectedValue,
        );
        expect(setStateMock.mock.calls[0][0].viewDate.format()).toEqual(
          viewDate,
        );
        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/12/2016');
      });

      it('calls setState once when the year is 3 digits', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 3);

        component.formatValueForEvent('onChange', {
          target: { value: '12/12/201' },
        });

        expect(setStateMock.mock.calls.length).toBe(1);
        expect(setStateMock.mock.calls[0][0].inputValue).toEqual('12/12/201');
      });

      it('calls setState once when year is 2 digits but the event is not a blur', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 2);

        component.formatValueForEvent('onChange', {
          target: { value: '12/12/16' },
        });

        expect(setStateMock.mock.calls.length).toBe(1);
        expect(setStateMock.mock.calls[0][0].inputValue).toEqual('12/12/16');
      });

      it('should not format input when event is onChange', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 4);
        const date = '12/1/2016';

        component.formatValueForEvent('onChange', date);

        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/1/2016');
      });
    });

    describe('on blur', () => {
      it('calls setState twice when year is 2 digits and is valid', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 2);
        const date = '12/12/16';
        const selectedValue = moment(date, inputFormat, true).format();
        const viewDate = moment(date, inputFormat, true)
          .startOf('month')
          .format();

        component.formatValueForEvent('onBlur', { target: { value: date } });

        expect(setStateMock.mock.calls.length).toBe(2);
        expect(setStateMock.mock.calls[0][0].selectedDate.format()).toEqual(
          selectedValue,
        );
        expect(setStateMock.mock.calls[0][0].viewDate.format()).toEqual(
          viewDate,
        );
        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/12/2016');
      });

      it('calls setState twice when year is 4 digits and is valid', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 4);
        const date = '12/12/2016';
        const selectedValue = moment(date, inputFormat, true).format();
        const viewDate = moment(date, inputFormat, true)
          .startOf('month')
          .format();
        component.formatValueForEvent('onBlur', { target: { value: date } });

        expect(setStateMock.mock.calls.length).toBe(2);
        expect(setStateMock.mock.calls[0][0].selectedDate.format()).toEqual(
          selectedValue,
        );
        expect(setStateMock.mock.calls[0][0].viewDate.format()).toEqual(
          viewDate,
        );
        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/12/2016');
      });

      it('calls setState once when year is 3 digits', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 3);
        const event = { target: { value: '12/12/201' } };

        component.formatValueForEvent('onBlur', event);

        expect(setStateMock.mock.calls.length).toBe(1);
        expect(setStateMock.mock.calls[0][0].inputValue).toEqual('12/12/201');
      });

      it('should format input when event is onBlur', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 4);
        const date = '12/1/2016';

        component.formatValueForEvent('onBlur', date);

        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/01/2016');
      });
    });

    describe('on Enter key press', () => {
      it('calls setState twice when year is 2 digits and is valid', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 2);
        const date = '12/12/16';
        const selectedValue = moment(date, inputFormat, true).format();
        const viewDate = moment(date, inputFormat, true)
          .startOf('month')
          .format();

        component.formatValueForEvent('onEnterKeyDown', {
          target: { value: date },
        });

        expect(setStateMock.mock.calls.length).toBe(2);
        expect(setStateMock.mock.calls[0][0].selectedDate.format()).toEqual(
          selectedValue,
        );
        expect(setStateMock.mock.calls[0][0].viewDate.format()).toEqual(
          viewDate,
        );
        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/12/2016');
      });

      it('calls setState twice when year is 4 digits and is valid', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 4);
        const date = '12/12/2016';
        const selectedValue = moment(date, inputFormat, true).format();
        const viewDate = moment(date, inputFormat, true)
          .startOf('month')
          .format();
        component.formatValueForEvent('onEnterKeyDown', {
          target: { value: date },
        });

        expect(setStateMock.mock.calls.length).toBe(2);
        expect(setStateMock.mock.calls[0][0].selectedDate.format()).toEqual(
          selectedValue,
        );
        expect(setStateMock.mock.calls[0][0].viewDate.format()).toEqual(
          viewDate,
        );
        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/12/2016');
      });

      it('calls setState once when year is 3 digits', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 3);
        const event = { target: { value: '12/12/201' } };

        component.formatValueForEvent('onEnterKeyDown', event);

        expect(setStateMock.mock.calls.length).toBe(1);
        expect(setStateMock.mock.calls[0][0].inputValue).toEqual('12/12/201');
      });

      it('should format input when event is enter key press', () => {
        component.yearDigits = yearDigitsMock.mockImplementation(() => 4);
        const date = '12/1/2016';

        component.formatValueForEvent('onEnterKeyDown', date);

        expect(setStateMock.mock.calls[1][0].inputValue).toEqual('12/01/2016');
      });
    });
  });

  describe('yearDigits', () => {
    let component;

    describe('on date mode', () => {
      it('returns the number of digits of the year', () => {
        component = TestUtils.renderIntoDocument(
          <DateTimeField
            dateTime={happyDate.format('x')}
            inputFormat="DD/MM/YY"
            mode="date"
          />,
        );
        expect(component.yearDigits('12/10/2016')).toEqual(4);
        expect(component.yearDigits('12.10.20')).toEqual(2);
        expect(component.yearDigits('12 10 ')).toEqual(0);
        expect(component.yearDigits('12-10')).toEqual(0);
      });
    });

    describe('on month mode', () => {
      it('returns the number of digits of the year', () => {
        component = TestUtils.renderIntoDocument(
          <DateTimeField
            dateTime={happyDate.format('x')}
            inputFormat="MM/YYYY"
            mode="month"
          />,
        );
        expect(component.yearDigits('10/2016')).toEqual(4);
        expect(component.yearDigits('10 20')).toEqual(2);
        expect(component.yearDigits('10-')).toEqual(0);
        expect(component.yearDigits('1')).toEqual(0);
      });
    });
  });

  describe('onKeyDown', () => {
    let component, formatValueForEventMock;

    beforeEach(() => {
      formatValueForEventMock = jest.genMockFunction();
      component = TestUtils.renderIntoDocument(
        <DateTimeField
          dateTime={happyDate.format('x')}
          inputFormat="DD/MM/YYYY"
          onEnterKeyDown={formatValueForEventMock}
        />,
      );
      component.formatValueForEvent = formatValueForEventMock;
    });

    it('calls formatValueForEvent when the Enter key is pressed', () => {
      const event = { key: 'Enter' };

      component.onKeyDown(event);

      expect(formatValueForEventMock.mock.calls.length).toBe(1);
      expect(formatValueForEventMock.mock.calls[0][0]).toEqual(
        'onEnterKeyDown',
      );
      expect(formatValueForEventMock.mock.calls[0][1]).toEqual(event);
    });

    it('does not call formatValueForEvent when any key other than Enter has been pressed', () => {
      const event = { key: 'a' };

      component.onKeyDown(event);

      expect(formatValueForEventMock.mock.calls.length).toBe(0);
    });
  });
});
