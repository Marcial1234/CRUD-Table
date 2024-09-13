Installation:
------------

```bash
$ npm install
```


Run:
------------

```bash
$ npm start
```


API:
------------

Base url: `http://localhost:3000`


```bash
GET /devices
```


```bash
GET /devices/:id
```


```bash
DELETE /devices/:id
```


```bash
POST /devices
```
> |  Request Body                                                           | content-type          |
> |:------------------------------------------------------------------------|:----------------------|
> | `{"system_name": "DESKTOP-ONE","type": "WINDOWS","hdd_capacity": "92"}` | `application/json`    |


```bash
PUT /devices/:id
```
> |  Request Body                                                            | content-type          |
> |:-------------------------------------------------------------------------|:----------------------|
> | `{"system_name": "DESKTOP-OFFICE","type": "MAC","hdd_capacity": "500"}`  | `application/json`    |
