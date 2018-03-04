### Developing [RESTful API](https://en.wikipedia.org/wiki/Representational_state_transfer) with [Express](https://expressjs.com/), [tabel ORM](http://tabel.fractaltech.in/) and [PostgreSQL](https://www.postgresql.org/)

[**TDD**](https://en.wikipedia.org/wiki/Test-driven_development)



**Install postgress**

Set up  `postgres`  and `redis` on your system.

A repository for helping in instalations. [Link Here](https://github.com/dg92/node-express-postgres-redis-starter-kit)

Postgres docs : [Link](https://www.postgresql.org/download/)

Redis docs: [Link](https://redis.io/download)

-----------



**Configure [Tabel](http://tabel.fractaltech.in/) ORM**

```bash
npm install config tabel pg

mkdir config

touch config/default.js
```
Copy config for orm from [Tabel](http://tabel.fractaltech.in/) docs and update db name, user and password. 

------------



**Migrations**

```bash

mkdir migerations

touch migrate.js

```

/migrate.js

```js
const migrate = require('tabel/lib/migrate');
const ormConfig = require('config');

migrate(ormConfig);
```
After adding above content to migrate.js run following migerate commonds from base path:
```sh
node migrate.js make CreateUsersTable
node migrate.js make CreatePostsTable
```

Now there should appear the migeration files in /migerations as <TIME_STAMP>_CreateUsersTable.js and <TIME_STAMP>__CreatePostsTable.js with content 

```js
function up(knex) {

}

function down(knex) {

}

module.exports = {up, down};
```
update these file contents then run 
```bash
node migrate.js latest
```

now we can verify it in psql it should show blank tables created :

```bash
 api_dev=# \dt
```

List of relations               

| Schema | Name   | Type                 | Owner |
| ------ | ------ | -------------------- | ----- |
| public | knex_migrations      | table | dev  |
| public | knex_migrations_lock | table | dev  |
| public | posts                | table | dev  |
| public | users                | table | dev  |

-------------



**Table Definitions**

Define Tables, a single file is sufficient to define tables but we can have a break down table specific files (modules) for definition as follow:

```bash
mkdir orm
mkdir orm/tables
touch orm/index.js
mkdir orm/tables
touch orm/tables/users.js
touch orm/tables/posts.js
```
Add definition as in full config section of [tabel docs](http://tabel.fractaltech.in/table-definitions.html#Full-Config) for posts and users both.

Example:
```js
'use strict';

module.exports = function(orm) {
  orm.defineTable({
    name: 'users',
    props: {
      key: 'id',
      autoId: false,
      perPage: 25,
      timestamps: true
    },
    scopes: {},
    joints: {
      joinComments() {
        return this.joinPosts().join(
          'comments',
          'comments.post_id',
          '=',
          'posts.id'
        );
      },
      joinPosts() {
        return this.join('posts', 'users.id', '=', 'posts.author_id');
      }
    },
    relations: {
      posts: function() {
        return this.hasMany('posts', 'author_id');
      }
    }
  });
};

```
and require the two definitions in orm/tables/index.js

```js
module.exports = function(orm) {
  require('./users')(orm);
  require('./posts')(orm);
};
```
now require the tables in orm/index.js

```js
const Tabel = require('tabel');
const config = require('config');
const orm = new Tabel(config);

require('./tables')(orm);

module.exports = orm.exports;
```

--------------



**Seeds**

To seed some sample (fake data):

```
mkdir seeds
touch seeds/post.js
touch seeds/user.js
```
In seed files `insert` some data into table using tabel orm methods according to schema in migerations , I have used [Faker.js](https://github.com/marak/Faker.js/).

`npm install faker`

Example Posts :

```js
const faker = require('faker');
const { table } = require('../orm');

var seed = Promise.all(
  [1, 2, 3].map(function(n) {
    return table('posts').insert([
      {
        id: faker.random.uuid(),
        author_id: faker.random.uuid(),
        title: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
        slug: faker.lorem.sentence().replace(/ /g, '-')
      }
    ]);
  })
);

seed.then(d => {
  console.log('seeded Posts', d);
});

```

--------


**Server**

Now we make an app (express app) and define routes. Before that let's verify if everything is working now by logging query results to console.

```bash
mkdir server
touch index.js
```

Adding a query and console log for the result in /server/index.js

```js
const { table } = require('../orm');

const posts = table('posts').all();

posts.then(d => console.log(d));

```

Now run `node sever` from command from root of project. It should print the list of posts we have seeded in posts table.

------------------------



Next we need to define an express app and add test for routes and then add routes and controllers for creating end points for REST API.

-------------



**Test**

Lets write a quick test :

`npm install  chai-http --save-dev`

create a new file *routes.index.test.js* in test directory

`touch test/routes.index.test.js`

```js
'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server');

describe('routes : index', () => {
  describe('GET /', () => {
    it('should return json', (done) => {
      chai.request(server)
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        res.body.message.should.eql('hello, world!');
        done();
      }); 
    });
  });
});
```

  run test `npm test` it should return 

```bash
 1) routes : index
       GET /
         should return json:
     TypeError: app.address is not a function
```



As we have not defined any route yet and no server is running , lets define an express app in *server/index.js*

`npm install express --save`

```js
'use strict';

const config =  require('config');
const PORT = config.port || 4000;
const express =  require('express');

var app = express();

app.use('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'hello, world!'
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
```

run `npm start ` and nevigate to `http://localhost:4000/` 

response should be :

```js
{
    status	"success"
	message	"hello, world!"
}
```

Now kill the server and run `npm test`  , it should pass now:

```bash
routes : index
    GET /
      ✓ should return json

  sample Test
    1) It should fail


  1 passing (33ms)
  1 failing

  1) sample Test
       It should fail:

      AssertionError: expected 'bar' to have a length of 4 but got 3
      + expected - actual

      -3
      +4

      at Context.it (test/sample.js:13:21)
```



Create a new folder called “routes” within “server”, and then add an *index.js*  file to it:

*/server/routes/index.js*

```js
'use strict';

const express = require("express");
const router = express.Router();

module.exports = function () {

  router.route('/')
  .get((req, res) => {
      res.json({
      status: 'success',
      message: 'hello, world!'
    });
  });

  return router;
};
```

Update the *server/index.js* to use routes

```js
'use strict';

const config =  require('config');
const PORT = config.port || 4000;
const express =  require('express');
const routes = require('./routes');

var app = express();

app.use('/', routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
```

So we have moved our route `/`  to routes, ensure that tests still pass by running `npm test`.





------



**Routes**



We’ll take a test-first approach in writing our routes so add an module template first for posts routes.

/posts

create a file posts.js inside routes with following route definition and export it :

```js
'use strict';

const express = require('express');
const router = express.Router();

module.exports = function(app, db) {
  return router;
};
```

Update *routes/index.js*

```js
'use strict';

const express = require("express");
const router = express.Router();
const posts = require('./posts');

module.exports = function (app, db) {

  router.use('/api/posts', posts(app, db));
  
  router.route('*').all(function(req, res) {
    res.json({
      message: 'hello, world!',
      status: 'success'
    });
  });

  return router;
};
```

In  *server/index.js* define db and pass table and app to routes:

```js
"use strict";

const config = require("config");
const { table } = require("../orm");
const PORT = config.port || 4000;
const express = require("express");
const routes = require("./routes");

var app = express();

app.use("/", routes(app, table));

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
```



Get all Posts :

To get started from test first , add  file *routes.posts.test.js* in test :

```js
'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../server');


describe('GET /api/posts', () => {
  it('should return all posts', done => {
    chai
      .request(server)
      .get('/api/posts')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {'status': 'success'}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {'data': [3 post objects]}
        res.body.data.length.should.eql(6);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id',
          'title',
          'body',
          'slug',
          'author_id',
          'created_at',
          'updated_at'
        );
        done();
      });
  });
});

```

Run `npm test`

It should fail as we have not added route in posts.js in routes . Lets add route to return posts:

*/routes/posts.js*

```js
'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app, db) => {

  router.route('/').get(async (req, res) => {  
    const posts = await db('posts').all()
    
    res.json({
      data: posts,
      status: 'success'
    });
    
  });

  return router;
};

```

now run test again , it should pass this time.

```bash
 GET /api/posts
    ✓ should return all posts
```

-----------------------

