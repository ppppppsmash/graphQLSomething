// 誰によって投稿されたのか
function postedBy(parent, args, context) {
  return context.prisma.link.
    findUnique({
      where: { id: parent.id },
    })
    .postedBy(); // リゾルバをスキーマではなくfields(schema.graphqlのLinkのpostedBy)のためにつけるので、最後fieldsをつける必要があり
}

function votes(parent, args, context) {
  return context.prisma.link.findUnique({
    where: { id: parent.id },
  }).votes();
}

module.exports = {
  postedBy,
  votes,
}