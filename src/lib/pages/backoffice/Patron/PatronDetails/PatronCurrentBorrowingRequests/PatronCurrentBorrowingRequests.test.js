import { BackOfficeRoutes, ILLRoutes } from '@routes/urls';
import documentTestData from '@testData/documents.json';
import testData from '@testData/ill_borrowing_requests.json';
import libraryTestData from '@testData/ill_libraries.json';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PatronCurrentBorrowingRequests from './PatronCurrentBorrowingRequests';

jest.mock('@config');
ILLRoutes.borrowingRequestDetailsFor = jest.fn((pid) => `url/${pid}`);
BackOfficeRoutes.documentDetailsFor = jest.fn((pid) => `url/${pid}`);
let mockViewDetails = jest.fn();

const data = {
  hits: [
    {
      id: 1,
      pid: 'borrowing-request1',
      metadata: {
        ...testData[0],
        provider: { ...libraryTestData[0] },
        document: {
          ...documentTestData[0],
        },
      },
    },
    {
      id: 2,
      pid: 'borrowing-request2',
      metadata: {
        ...testData[1],
        provider: { ...libraryTestData[1] },
        document: {
          ...documentTestData[0],
        },
      },
    },
  ],
  total: 2,
};

describe('PatronCurrentBorrowingRequests tests', () => {
  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    if (component) {
      component.unmount();
    }
  });

  const patron = {
    user_pid: '2',
  };

  it('should load the details component', () => {
    const mockedFetchPatronCurrentBorrowingRequests = jest.fn();

    const component = shallow(
      <PatronCurrentBorrowingRequests
        data={{ hits: [], total: 0 }}
        isLoading={false}
        patronDetails={patron}
        fetchPatronCurrentBorrowingRequests={
          mockedFetchPatronCurrentBorrowingRequests
        }
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render show a message with no user borrowing requests', () => {
    const mockedFetchPatronCurrentBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronCurrentBorrowingRequests
          patronDetails={patron}
          data={{ hits: [], total: 0 }}
          isLoading={false}
          fetchPatronCurrentBorrowingRequests={
            mockedFetchPatronCurrentBorrowingRequests
          }
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const message = component
      .find('Message')
      .filterWhere((element) => element.prop('data-test') === 'no-results');
    expect(message).toHaveLength(1);
  });

  it('should render patron borrowing requests', () => {
    const mockedFetchPatronCurrentBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronCurrentBorrowingRequests
          patronDetails={patron}
          data={data}
          isLoading={false}
          fetchPatronCurrentBorrowingRequests={
            mockedFetchPatronCurrentBorrowingRequests
          }
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const rows = component
      .find('TableRow')
      .filterWhere(
        (element) =>
          element.prop('data-test') === 'borrowing-request1' ||
          element.prop('data-test') === 'borrowing-request2'
      );
    expect(rows).toHaveLength(2);

    const footer = component
      .find('TableRow')
      .filterWhere((element) => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(0);
  });

  it('should render the see all button when showing only a few patron borrowing requests', () => {
    const mockedFetchPatronCurrentBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronCurrentBorrowingRequests
          patronDetails={patron}
          data={data}
          isLoading={false}
          fetchPatronCurrentBorrowingRequests={
            mockedFetchPatronCurrentBorrowingRequests
          }
          showMaxRequests={1}
        />
      </BrowserRouter>
    );

    expect(component).toMatchSnapshot();
    const footer = component
      .find('TableFooter')
      .filterWhere((element) => element.prop('data-test') === 'footer');
    expect(footer).toHaveLength(1);
  });

  it('should go to loan details when clicking on a patron loan', () => {
    const mockedFetchPatronCurrentBorrowingRequests = jest.fn();
    component = mount(
      <BrowserRouter>
        <PatronCurrentBorrowingRequests
          patronDetails={patron}
          data={data}
          isLoading={false}
          fetchPatronCurrentBorrowingRequests={
            mockedFetchPatronCurrentBorrowingRequests
          }
          showMaxRequests={1}
        />
      </BrowserRouter>
    );

    const firstId = data.hits[0].pid;
    component
      .find('TableCell')
      .filterWhere((element) => element.prop('data-test') === `0-${firstId}`)
      .find('Link')
      .simulate('click');
    expect(ILLRoutes.borrowingRequestDetailsFor).toHaveBeenCalled();
  });
});
