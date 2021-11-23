import * as fs from 'fs';
import dayjs from 'dayjs';

export function middlewareLogger(options: IConfig) {
  return (req: any, res: any, next: any) => {
    const filename = options.filename
      ? `${dayjs().format('MM-DD-YYYY')}-${options.filename}`
      : `logfile-${dayjs().format('MM-DD-YYYY')}.txt`;
    let filepath = '';
    if (options.filepath) {
      if (options.filepath[options.filepath.length - 1] !== '/')
        filepath = `${options.filepath}/`;
      else filepath = options.filepath;
    }
    try {
      const reqResult = prepareReqLogLine(req, options);
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

        if (options.includeRes) {
          resLine = `${dayjs().format(
            options.dateFormat ? options.dateFormat : 'MM-DD-YYYY T HH:mm:ss',
          )} RESPONSE: ${res.statusCode} ${body}`;
        }
        oldEnd.apply(res, arguments);
        fs.appendFile(
          `${filepath}${filename}`,
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

export function prepareReqLogLine(req: any, options: IConfig) {
  let reqLine = '';
  if (options.includeReq) {
    reqLine = `${dayjs().format(
      options.dateFormat ? options.dateFormat : 'MM-DD-YYYY T HH:mm:ss',
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
