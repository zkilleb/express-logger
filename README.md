# explogger

A node library for logging requests and responses of express endpoints using middleware

## Usage

```javascript
import { middlewareLogger } from 'express-logger';

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

`filename`: String name of the file to be logged. Defaults to `logfile-MM-DD-YYYY.txt`

`filepath`: String name of the file path to log to. Defaults to the current directory.

`includeReq`: Boolean to determine whether to include the request as part of the log. Defaults to false.

`includeRes`: Boolean to determine whether to include the respone as part of the log. Defaults to false.

`dateFormat`: String to determine how to format the dates for the logfile. [Any valid DayJs formatting option will work](https://day.js.org/docs/en/display/format). Will default to `MM-DD-YYYY T HH:mm:ss`.

**Example output**

```
11-2021 REQUEST: GET /keyword-search/django
11-2021 RESPONSE: 200 [{"adult":false,"backdrop_path":"/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg","genre_ids":[18,37],"id":68718,"original_language":"en","original_title":"Django Unchained","overview":"With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.","popularity":56.922,"poster_path":"/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg","release_date":"2012-12-25","title":"Django Unchained","video":false,"vote_average":8.1,"vote_count":21541},{"adult":false,"backdrop_path":"/emAXJbyBPcMpLeK2OdlgqIHORT2.jpg","genre_ids":[28,37],"id":10772,"original_language":"it","original_title":"Django","overview":"A coffin-dragging gunslinger and a half-breed prostitute become embroiled in a bitter feud between a merciless masked clan and a band of Mexican revolutionaries.","popularity":13.491,"poster_path":"/n2y7yoMUef9Fooiq6yFFvPABB0a.jpg","release_date":"1966-04-05","title":"Django","video":false,"vote_average":7.2,"vote_count":615},{"adult":false,"backdrop_path":"/xxkg8Z26EHpcrPyynsSapieY26v.jpg","genre_ids":[18,36,10402],"id":436334,"original_language":"fr","original_title":"Django","overview":"The story of Django Reinhardt, famous guitarist and composer, and his flight from German-occupied
```

## License

ISC
