const jwt = require("jsonwebtoken");
APP_SECRET = "GraphQL-is-awesome";

// トークンを複合するため
function getTokenPayload(token) {
  // トークン化されたものの前の情報(user.id)を複合
  return jwt.verify(token, APP_SECRET);
}

// ユーザIDを取得するため
function getUserId(req, authToken) {
  if (req) {
    // ヘッダーの確認
    const authHeader = req.headers.authorization;

    // 権限があるなら
    if (authHeader) {
      const token = authHeader.replace("Bearer", "");

      if (!token) {
        throw new Error("トークンが見つかりませんでした");
      }

      // そのトークンを複合
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if(authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません");
}

module.exports = {
  APP_SECRET,
  getUserId,
}