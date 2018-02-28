import React from 'react';
import TestUtils from 'react-dom/test-utils';

jest.dontMock('moment');
jest.dontMock('../DateTimePickerDate.js');

describe('DateTimePickerDate', function() {
  const moment = require('moment');
  const DateTimePickerDate = require('../DateTimePickerDate.js');

  let subtractMonthMock,
    addMonthMock,
    viewDate,
    selectedDate,
    setSelectedMonthMock,
    setSelectedDateMock,
    subtractYearMock,
    addYearMock,
    setViewMonthMock,
    setViewYearMock,
    addDecadeMock,
    subtractDecadeMock;

  beforeEach(() => {
    subtractMonthMock = jest.genMockFunction();
    addMonthMock = jest.genMockFunction();
    viewDate = moment();
    selectedDate = moment();
    setSelectedMonthMock = jest.genMockFunction();
    setSelectedDateMock = jest.genMockFunction();
    subtractYearMock = jest.genMockFunction();
    addYearMock = jest.genMockFunction();
    setViewMonthMock = jest.genMockFunction();
    setViewYearMock = jest.genMockFunction();
    addDecadeMock = jest.genMockFunction();
    subtractDecadeMock = jest.genMockFunction();
  });

  function render(args) {
    let { viewMode, mode } = args;
    return TestUtils.renderIntoDocument(
      <DateTimePickerDate
        subtractMonth={subtractMonthMock}
        addMonth={addMonthMock}
        viewDate={viewDate}
        selectedDate={selectedDate}
        viewMode={viewMode}
        mode={mode}
        setSelectedMonth={setSelectedMonthMock}
        setSelectedDate={setSelectedDateMock}
        subtractYear={subtractYearMock}
        addYear={addYearMock}
        setViewMonth={setViewMonthMock}
        setViewYear={setViewYearMock}
        addDecade={addDecadeMock}
        subtractDecade={subtractDecadeMock}
      />,
    );
  }

  describe('initial state', function() {
    describe('when it is a regular date picker', function() {
      it('shows days by default', function() {
        let picker = render({});

        expect(picker.state.daysDisplayed).toBe(true);
      });

      it('shows days when that is the view mode', function() {
        let picker = render({ viewMode: 'days' });

        expect(picker.state.daysDisplayed).toBe(true);
      });

      it('shows months when that is the view mode', function() {
        let picker = render({ viewMode: 'months' });

        expect(picker.state.monthsDisplayed).toBe(true);
      });

      it('shows years when that is the view mode', function() {
        let picker = render({ viewMode: 'years' });

        expect(picker.state.yearsDisplayed).toBe(true);
      });
    });

    describe('when it is a month picker', function() {
      it('shows months by default', function() {
        let picker = render({ mode: 'month' });

        expect(picker.state.monthsDisplayed).toBe(true);
      });

      it('shows months when the view mode is explicitly days', function() {
        let picker = render({ viewMode: 'days', mode: 'month' });

        expect(picker.state.monthsDisplayed).toBe(true);
      });

      it('shows months when that is the view mode', function() {
        let picker = render({ viewMode: 'months', mode: 'month' });

        expect(picker.state.monthsDisplayed).toBe(true);
      });

      it('shows years when that is the view mode', function() {
        let picker = render({ viewMode: 'years', mode: 'month' });

        expect(picker.state.yearsDisplayed).toBe(true);
      });
    });
  });
});
