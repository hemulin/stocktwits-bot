const extractCommonData = ctx => {
  return {
    isGroup: ctx.message.chat.type === 'group',
    groupId: ctx.message.chat.id,
    username: ctx.from.username || ctx.from.first_name
  };
};

module.exports = {
  extractCommonData
};
