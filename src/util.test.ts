import { colorLogToConsole, prepareFilename, prepareReqLogLine } from './util';
import { colors } from './colors';
import dayjs from 'dayjs';

describe('Test prepareReqLogLine()', () => {
  test('prepareReqLogLine without request', () => {
    expect(prepareReqLogLine({}, undefined, false)).toEqual('');
  });

  test('prepareReqLogLine without params, query or body', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      query: {},
    };
    expect(prepareReqLogLine(testObj, undefined, true)).toEqual(
      `${dayjs().format('MM-DD-YYYY T HH:mm:ss')} REQUEST: GET /tests/test   `,
    );
  });

  test('prepareReqLogLine with params', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      params: { title: 'test' },
      query: {},
    };
    expect(prepareReqLogLine(testObj, undefined, true)).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"}  `,
    );
  });

  test('prepareReqLogLine with params and query', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      params: { title: 'test' },
      query: { query: 'query' },
    };
    expect(prepareReqLogLine(testObj, undefined, true)).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} `,
    );
  });

  test('prepareReqLogLine with params, body and query', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      params: { title: 'test' },
      query: { query: 'query' },
      body: { body: 'body' },
    };
    expect(prepareReqLogLine(testObj, undefined, true)).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} body: {"body":"body"}`,
    );
  });

  test('prepareReqLogLine with different date format', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      params: { title: 'test' },
      query: { query: 'query' },
    };
    expect(prepareReqLogLine(testObj, 'MM-DD-YYYY', true)).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} `,
    );
  });
});

describe('Test prepareFilename()', () => {
  test('prepareFilename without name or extension', () => {
    expect(prepareFilename()).toEqual(
      `${dayjs().format('MM-DD-YYYY')}-logfile.log`,
    );
  });

  test('prepareFilename with name', () => {
    expect(prepareFilename('testfile')).toEqual(
      `${dayjs().format('MM-DD-YYYY')}-testfile.log`,
    );
  });

  test('prepareFilename with name and extension', () => {
    expect(prepareFilename('testfile', '.txt')).toEqual(
      `${dayjs().format('MM-DD-YYYY')}-testfile.txt`,
    );
  });
});

describe('Test colorLogToConsole()', () => {
  let logSpy: any;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log');
  });

  test('colorLogToConsole without req or res', () => {
    colorLogToConsole('', '');
    expect(logSpy).toHaveBeenCalledWith(colors.reset);
  });

  test('colorLogToConsole with req', () => {
    colorLogToConsole(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} body: {"body":"body"}`,
      '',
    );
    expect(logSpy).toHaveBeenCalledWith(
      ` ${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} body: {"body":"body"}\n`,
      colors.reset,
    );
  });

  test('colorLogToConsole with res', () => {
    colorLogToConsole(
      '',
      `${dayjs().format('MM-DD-YYYY T HH:mm:ss')} RESPONSE:  304`,
    );
    expect(logSpy).toHaveBeenCalledWith(
      `${dayjs().format('MM-DD-YYYY T HH:mm:ss')} RESPONSE:`,
      '30',
      colors.reset,
      '4\n',
      colors.reset,
    );
  });

  test('colorLogToConsole with req and res', () => {
    colorLogToConsole(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} body: {"body":"body"}`,
      `${dayjs().format('MM-DD-YYYY T HH:mm:ss')} RESPONSE:  304`,
    );
    expect(logSpy).toHaveBeenCalledWith(colors.reset);
    expect(logSpy).toHaveBeenCalledWith(
      ` ${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} body: {"body":"body"}\n`,
      colors.reset,
    );
    expect(logSpy).toHaveBeenCalledWith(
      `${dayjs().format('MM-DD-YYYY T HH:mm:ss')} RESPONSE:`,
      '30',
      colors.reset,
      '4\n',
      colors.reset,
    );
  });
});
