// schema.graphqlを参照している

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { APP_SECRET } = require("../utils");

// ユーザの新規登録リゾルバ
async function signup(parent, args, context) {
  // パスワードの設定
  const password = await bcrypt.hash(args.password, 10);

  // ユーザの新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password, // args.passwordをhash化したpasswordに更新する
    }
  });

  const token = jwt.sign({
    userId: user.id
  }, APP_SECRET);

  return {
    token,
    user
  }
}

// ユーザーのプロフィール更新リゾルバ
async function updateProfile(parent, args, context) {
  const { userId } = context;

  if (!userId) {
    throw new Error("認証が必要です");
  }

  const updatedUser = await context.prisma.user.update({
    where: { id: userId },
    data: {
      name: args.name,
      email: args.email,
      // パスワードが提供された場合のみ更新
      ...(args.password && { password: await bcrypt.hash(args.password, 10) }),
    },
  });

  return updatedUser;
}

// ニュース投稿の削除リゾルバ
async function deletePost(parent, args, context) {
  const { userId } = context;

  if (!userId) {
    throw new Error("認証が必要です");
  }

  const post = await context.prisma.link.findUnique({
    where: { id: args.id },
    include: { postedBy: true },
  });

  if (!post) {
    throw new Error("投稿が見つかりません");
  }

  if (post.postedBy.id !== userId) {
    throw new Error("この投稿を削除する権限がありません");
  }

  return await context.prisma.link.delete({
    where: { id: args.id },
  });
}

// ニュース投稿の更新リゾルバ
async function updatePost(parent, args, context) {
  const { userId } = context;

  if (!userId) {
    throw new Error("認証が必要です");
  }

  const post = await context.prisma.link.findUnique({
    where: { id: args.id },
    include: { postedBy: true },
  });

  if (!post) {
    throw new Error("投稿が見つかりません");
  }

  if (post.postedBy.id !== userId) {
    throw new Error("この投稿を更新する権限がありません");
  }

  return await context.prisma.link.update({
    where: { id: args.id },
    data: {
      url: args.url,
      description: args.description,
    },
  });
}


async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("ユーザは存在しません");
  }

  // パスワードの比較
  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("無効なパスワードです");
  }

  // パスワードが正しいとき
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  }
};

// ニュース投稿時リゾルバ
async function post(parent, args, context) {
  // ./src/server.js ApolloServerのcontextにuserIdを追加している
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId }}
    }
  });

  // 送信
  context.pubsub.publish("NEW_LINK", newLink);
  return newLink;
}

module.exports = {
  signup,
  login,
  post,
};
