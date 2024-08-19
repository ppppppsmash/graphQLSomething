// 誰によって投稿されたのか
function postedBy(parent, args, context) {
  return context.prisma.link.
    findUnique({
      where: { id: parent.id },
    })
    .postedBy(); // リゾルバをスキーマではなくfields(schema.graphqlのLinkのpostedBy)のためにつけるので、最後fieldsをつける必要があり
}

module.exports = {
  postedBy,
}