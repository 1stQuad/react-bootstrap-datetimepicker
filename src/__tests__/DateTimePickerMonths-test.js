import React from 'react';
import TestUtils from 'react-dom/test-utils';

jest.dontMock('moment');
jest.dontMock('../DateTimePickerMonths.js');

describe('DateTimePickerMonths', function() {
  const moment = require('moment');
  const DateTimePickerMonths = require('../DateTimePickerMonths.js');
  let subtractYearMock,
    addYearMock,
    setViewMonthMock,
    setSelectedMonthMock,
    showYearsMock,
    months;

  beforeEach(() => {
    subtractYearMock = jest.genMockFunction();
    addYearMock = jest.genMockFunction();
    showYearsMock = jest.genMockFunction();
    setViewMonthMock = jest.genMockFunction();
    setSelectedMonthMock = jest.genMockFunction();
    months = TestUtils.renderIntoDocument(
      <DateTimePickerMonths
        addYear={addYearMock}
        selectedDate={moment()}
        setViewMonth={setViewMonthMock}
        showYears={showYearsMock}
        subtractYear={subtractYearMock}
        viewDate={moment()}
        minDate={moment().subtract(1, 'months')}
        maxDate={moment().add(1, 'months')}
        setSelectedMonth={setSelectedMonthMock}
        mode={'date'}
      />,
    );
  });

  describe('Controls', function() {
    it('calls subtractYear when clicking the prev arrow', function() {
      const prevArrow = TestUtils.findRenderedDOMComponentWithClass(
        months,
        'prev',
      );
      TestUtils.Simulate.click(prevArrow);
      expect(subtractYearMock.mock.calls.length).toBe(1);
    });

    it('calls addYear when clicking the next arrow', function() {
      const nextArrow = TestUtils.findRenderedDOMComponentWithClass(
        months,
        'next',
      );
      TestUtils.Simulate.click(nextArrow);
      expect(addYearMock.mock.calls.length).toBe(1);
    });

    it('calls showYears when clicking the year', function() {
      const year = TestUtils.findRenderedDOMComponentWithClass(
        months,
        'switch',
      );
      TestUtils.Simulate.click(year);
      expect(showYearsMock.mock.calls.length).toBe(1);
    });

    it('calls setViewMonth when clicking a month', function() {
      const month = TestUtils.findRenderedDOMComponentWithClass(
        months,
        'active',
      );
      TestUtils.Simulate.click(month);
      expect(setViewMonthMock.mock.calls.length).toBe(1);
    });

    describe('when the date picker mode is set to month picker', function() {
      it('calls setSelectedMonth when clicking a month', function() {
        months = TestUtils.renderIntoDocument(
          <DateTimePickerMonths
            addYear={addYearMock}
            selectedDate={moment()}
            setViewMonth={setViewMonthMock}
            showYears={showYearsMock}
            subtractYear={subtractYearMock}
            viewDate={moment()}
            setSelectedMonth={setSelectedMonthMock}
            mode={'month'}
          />,
        );

        const month = TestUtils.findRenderedDOMComponentWithClass(
          months,
          'active',
        );
        TestUtils.Simulate.click(month);
        expect(setSelectedMonthMock.mock.calls.length).toBe(1);
      });
    });
  });

  describe('UI', function() {
    it('renders 12 months', function() {
      const monthList = TestUtils.scryRenderedDOMComponentsWithClass(
        months,
        'month',
      );
      expect(monthList.length).toBe(12);
    });

    it('rendersJanuary through December', function() {
      const monthList = TestUtils.scryRenderedDOMComponentsWithClass(
        months,
        'month',
      );
      expect(monthList.map(x => x.textContent)).toEqual([
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]);
    });

    it("has an active month that is now's month", function() {
      const active = TestUtils.findRenderedDOMComponentWithClass(
        months,
        'active',
      );
      expect(active.textContent).toBe(moment().format('MMM'));
    });

    it('has no active month that if viewDate is another year than selectedDate', function() {
      months = TestUtils.renderIntoDocument(
        <DateTimePickerMonths
          addYear={addYearMock}
          selectedDate={moment()}
          setViewMonth={setViewMonthMock}
          showYears={showYearsMock}
          subtractYear={subtractYearMock}
          viewDate={moment().add(2, 'year')}
          setSelectedMonth={setSelectedMonthMock}
          mode={'date'}
        />,
      );
      const active = TestUtils.scryRenderedDOMComponentsWithClass(
        months,
        'active',
      );
      expect(active.length).toBe(0);
    });

    it('disable months outside the minDate / maxDate range', function() {
      const active = TestUtils.findRenderedDOMComponentWithClass(
        months,
        'active',
      );
      const monthList = TestUtils.scryRenderedDOMComponentsWithClass(
        months,
        'month',
      );
      const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const currentMonth = labels.indexOf(active.textContent);
      let month;

      monthList.forEach(item => {
        month = labels.indexOf(item.textContent);
        if (month < currentMonth - 1 || month > currentMonth + 1)
          expect(item.className).toMatch(/softDisabled/);
        else expect(item.className).not.toMatch(/softDisabled/);
      });
    });
  });
});
