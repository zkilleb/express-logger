import * as fs from 'fs';
import dayjs from 'dayjs';
import { colors } from './colors';

export function middlewareLogger({
  filename,
  filepath,
  dateFormat,
  includeReq = true,
  includeRes = true,
  outputFormat,
  consoleOnly,
}: IConfig = {}) {
  return (req: any, res: any, next: any) => {
    const formattedFilename = prepareFilename(filename, outputFormat);
    let formattedFilepath = '';
    if (filepath) {
      if (filepath[filepath.length - 1] !== '/')
        formattedFilepath = `${filepath}/`;
      else formattedFilepath = filepath;
    }
    try {
      const reqResult = prepareReqLogLine(req, dateFormat, includeReq);
      let resLine = '';
      let oldWrite = res.write;
      let oldEnd = res.end;

      let chunks: any = [];

      res.write = function (chunk: any) {
        chunks.push(chunk);

        return oldWrite.apply(res, arguments);
      };

      res.end = function (chunk: any) {
        if (chunk) chunks.push(chunk);

        let body = Buffer.concat(chunks).toString('utf8');

        if (includeRes) {
          resLine = `${dayjs().format(
            dateFormat ? dateFormat : 'MM-DD-YYYY T HH:mm:ss',
          )} RESPONSE: ${res.statusCode} ${body}`;
        }
        oldEnd.apply(res, arguments);
        if (consoleOnly) {
          colorLogToConsole(reqResult, resLine);
        } else {
          fs.appendFile(
            `${formattedFilepath}${formattedFilename}`,
            `${reqResult}${
              reqResult !== '' && resLine !== '' ? '\n' : ''
            }${resLine}\n`,
            (err) => {
              if (err) console.error(err);
            },
          );
        }
      };
    } catch (e) {
      console.error(e);
    }
    next();
  };
}

export function prepareReqLogLine(
  req: any,
  dateFormat?: string,
  includeReq?: boolean,
) {
  let reqLine = '';
  if (includeReq) {
    reqLine = `${dayjs().format(
      dateFormat ? dateFormat : 'MM-DD-YYYY T HH:mm:ss',
    )} REQUEST: ${req.method} ${req.url} ${
      req.params && Object.keys(req.params).length !== 0
        ? `params: ${JSON.stringify(req.params)}`
        : ''
    } ${
      req.query && Object.keys(req.query).length !== 0
        ? `query: ${JSON.stringify(req.query)}`
        : ''
    } ${
      req.body && Object.keys(req.body).length !== 0
        ? `body: ${JSON.stringify(req.body)}`
        : ''
    }`;
  }
  return reqLine;
}

export function prepareFilename(filename?: string, outputFormat?: string) {
  return `${dayjs().format('MM-DD-YYYY')}-${filename ?? 'logfile'}${
    outputFormat ?? '.log'
  }`;
}

export function colorLogToConsole(req: string, res: string) {
  let logOutput: string[] = [];
  if (req !== '') logOutput.push(' ' + req + '\n');
  if (res !== '') {
    const splitRes = res.split(/(RESPONSE:)/g);
    logOutput.push(splitRes[0] + splitRes[1]);
    const statusCode = splitRes[2].slice(0, 4);
    if (statusCode[1] === '2' || statusCode[1] === '1') {
      logOutput.push(colors.green);
    } else if (statusCode[1] === '3') {
      logOutput.push(colors.yellow);
    } else if (statusCode[1] === '4' || statusCode[1] === '5') {
      logOutput.push(colors.red);
    }
    logOutput.push(statusCode.trim());
    logOutput.push(colors.reset);
    logOutput.push(`${splitRes[2].replace(statusCode, '')}\n`);
  }
  console.log(...logOutput, colors.reset);
}

interface IConfig {
  filename?: string;
  filepath?: string;
  dateFormat?: string;
  includeReq?: boolean;
  includeRes?: boolean;
  outputFormat?: string;
  consoleOnly?: boolean;
}
