# explogger

A node library for logging requests and responses of express endpoints using middleware

## Usage

```javascript
import { middlewareLogger } from 'explogger';

app.use(
  middlewareLogger({
    filename: 'logfile',
    includeReq: true,
    includeRes: true,
    dateFormat: 'MM-YYYY',
  }),
);
```

**Configuration Options**

The contents of the provided middlewareLogger can be modified to get different configuration options. All fields are optional

`filename`: String name of the file to be logged. Defaults to `MM-DD-YYYY-logfile.txt`

`filepath`: String name of the file path to log to. Defaults to the current directory.

`includeReq`: Boolean to determine whether to include the request as part of the log. Defaults to true.

`includeRes`: Boolean to determine whether to include the respone as part of the log. Defaults to true.

`dateFormat`: String to determine how to format the dates for the logfile. [Any valid DayJs formatting option will work](https://day.js.org/docs/en/display/format). Will default to `MM-DD-YYYY T HH:mm:ss`.

**Example output**

```
11-2021 REQUEST: GET request path
11-2021 RESPONSE: 200 response body
```

## License

ISC
