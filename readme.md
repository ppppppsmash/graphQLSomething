### Apollo Docs
https://www.apollographql.com/docs/apollo-server/

### local server
node ./src/server.js

### local playground
http://localhost:4000

```
# Write your query or mutation here
query {
  feed
}

query {
  feed {
    id
    description
    url
  }
}

mutation {
  post(url: "https://yahoo.co.jp", description: "テキスト") {
    id
    description
    url
  }
}
```

### hacker news for developer
https://news.ycombinator.com/

npx prisma init
npx prisma migrate dev
