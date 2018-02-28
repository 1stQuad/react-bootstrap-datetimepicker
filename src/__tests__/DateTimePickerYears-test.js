import React from 'react';
import TestUtils from 'react-dom/test-utils';

jest.dontMock('moment');
jest.dontMock('../DateTimePickerYears.js');

describe('DateTimePickerYears', function() {
  const moment = require('moment');
  const DateTimePickerYears = require('../DateTimePickerYears.js');
  let subtractDecadeMock, addDecadeMock, setViewYearMock, years;

  beforeEach(() => {
    subtractDecadeMock = jest.genMockFunction();
    addDecadeMock = jest.genMockFunction();
    setViewYearMock = jest.genMockFunction();
    years = TestUtils.renderIntoDocument(
      <DateTimePickerYears
        addDecade={addDecadeMock}
        selectedDate={moment()}
        setViewYear={setViewYearMock}
        subtractDecade={subtractDecadeMock}
        minDate={moment().subtract(1, 'years')}
        maxDate={moment().add(1, 'years')}
        viewDate={moment()}
      />,
    );
  });

  describe('Controls', function() {
    it('calls subtractDecade when clicking the prev arrow', function() {
      const prevArrow = TestUtils.findRenderedDOMComponentWithClass(
        years,
        'prev',
      );
      TestUtils.Simulate.click(prevArrow);
      expect(subtractDecadeMock.mock.calls.length).toBe(1);
    });

    it('calls addDecade when clicking the next arrow', function() {
      const nextArrow = TestUtils.findRenderedDOMComponentWithClass(
        years,
        'next',
      );
      TestUtils.Simulate.click(nextArrow);
      expect(addDecadeMock.mock.calls.length).toBe(1);
    });

    it('calls setViewYear when clicking a year', function() {
      const year = TestUtils.findRenderedDOMComponentWithClass(years, 'active');
      TestUtils.Simulate.click(year);
      expect(setViewYearMock.mock.calls.length).toBe(1);
    });
  });

  describe('UI', function() {
    it('renders 12 years', function() {
      const yearList = TestUtils.scryRenderedDOMComponentsWithClass(
        years,
        'year',
      );
      expect(yearList.length).toBe(12);
    });

    it('renders the decade plus two extra', function() {
      const yearList = TestUtils.scryRenderedDOMComponentsWithClass(
        years,
        'year',
      );
      const beginningDecade = parseInt(
        moment()
          .format('GGGG')
          .substr(0, 3) + 0,
      ); // will produce 2010 for 2015.
      let array = [];
      for (let i = 0; i < 12; i++) {
        array.push(beginningDecade + i - 1);
      } // [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]

      expect(yearList.map(x => parseInt(x.textContent))).toEqual(array);
    });

    it("has an active year that is now's year", function() {
      const active = TestUtils.findRenderedDOMComponentWithClass(
        years,
        'active',
      );
      expect(parseInt(active.textContent)).toBe(
        parseInt(moment().format('GGGG')),
      );
    });

    it('has no active year that if viewDate is another decade than selectedDate', function() {
      years = TestUtils.renderIntoDocument(
        <DateTimePickerYears
          addDecade={addDecadeMock}
          selectedDate={moment()}
          setViewYear={setViewYearMock}
          subtractDecade={subtractDecadeMock}
          viewDate={moment().add(12, 'year')}
        />,
      );
      const active = TestUtils.scryRenderedDOMComponentsWithClass(
        years,
        'active',
      );
      expect(active.length).toBe(0);
    });

    it('disable years outside the minDate / maxDate range', function() {
      const active = TestUtils.findRenderedDOMComponentWithClass(
        years,
        'active',
      );
      const yearList = TestUtils.scryRenderedDOMComponentsWithClass(
        years,
        'year',
      );
      const currentYear = +active.textContent;
      let year;

      yearList.forEach(item => {
        year = +item.textContent;
        if (year < currentYear - 1 || year > currentYear + 1)
          expect(item.className).toMatch(/softDisabled/);
        else expect(item.className).not.toMatch(/softDisabled/);
      });
    });
  });
});
