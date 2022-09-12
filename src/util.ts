import * as fs from 'fs';
import dayjs from 'dayjs';

export function middlewareLogger({
  filename,
  filepath,
  dateFormat,
  includeReq = true,
  includeRes = true,
}: IConfig) {
  return (req: any, res: any, next: any) => {
    const formattedFilename = filename
      ? `${dayjs().format('MM-DD-YYYY')}-${filename}`
      : `${dayjs().format('MM-DD-YYYY')}-logfile.txt`;
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
          )} RESPONSE: ${res.statusCode} ${body}\n`;
        }
        oldEnd.apply(res, arguments);
        fs.appendFile(
          `${formattedFilepath}${formattedFilename}`,
          `${reqResult}${resLine}`,
          (err) => {
            if (err) console.error(err);
          },
        );
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
    }\n`;
  }
  return reqLine;
}

interface IConfig {
  filename?: string;
  filepath?: string;
  dateFormat?: string;
  includeReq?: boolean;
  includeRes?: boolean;
}
