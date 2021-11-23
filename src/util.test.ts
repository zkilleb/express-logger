import { prepareReqLogLine } from './util';
import dayjs from 'dayjs';

describe('Test prepareReqLogLine()', () => {
  test('prepareReqLogLine without request', () => {
    expect(prepareReqLogLine({}, { includeReq: false })).toEqual('');
  });

  test('prepareReqLogLine without params, query or body', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      query: {},
    };
    expect(prepareReqLogLine(testObj, { includeReq: true })).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test   \n`,
    );
  });

  test('prepareReqLogLine with params', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      params: { title: 'test' },
      query: {},
    };
    expect(prepareReqLogLine(testObj, { includeReq: true })).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"}  \n`,
    );
  });

  test('prepareReqLogLine with params and query', () => {
    const testObj = {
      url: '/tests/test',
      method: 'GET',
      params: { title: 'test' },
      query: { query: 'query' },
    };
    expect(prepareReqLogLine(testObj, { includeReq: true })).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} \n`,
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
    expect(prepareReqLogLine(testObj, { includeReq: true })).toEqual(
      `${dayjs().format(
        'MM-DD-YYYY T HH:mm:ss',
      )} REQUEST: GET /tests/test params: {"title":"test"} query: {"query":"query"} body: {"body":"body"}\n`,
    );
  });
});
