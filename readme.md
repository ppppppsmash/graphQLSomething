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

mutation {
  signup(email: "pppppp@gmail.com", password: "xxx", name: "kurosawa") {
    token
    user {
      id
    }
  }
}

mutation {
  login(email: "pppppp@gmail.com", password: "xxx") {
    token
    user {
      id
      email
      links {
        url
        description
      }
    }
  }
}


// リアルタイム通信①
mutation {
  post(url: "yahoo.com", description: "Yahooサイト") {
    id
    description
    url
  }
}

subscription {
  newLink {
    id
    url
    description
    postedBy {
			id
      name
      email
    }
  }
}
// ↑リアルタイム通信

// リアルタイム通信②
mutation {
  vote(linkId: 1) {
    link {
      url
      description
    }
    user {
      name
      email
    }
  }
}

// ↑リアルタイム通信②

subscription {
  newVote {
    id
    link {
      url
      description
    }
    user {
      name
      email
    }
  }
}

```

### hacker news for developer
https://news.ycombinator.com/

npx prisma init
npx prisma migrate dev
npx prisma generate

### prisma studio
npx prisma studio