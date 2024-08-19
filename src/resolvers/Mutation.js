// schema.graphqlを参照している

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const APP_SECRET = require("../utils");

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
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId }}
    }
  })
};

module.exports = {
  signup,
  login,
  post,
};