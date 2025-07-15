// utils/queueAction.js
const QueuedAction = require('../models/QueuedAction');

const queueAction = async (userId, actionType, data) => {
  try {
    const queuedAction = new QueuedAction({
      userId,
      actionType,
      data,
    });
    await queuedAction.save();
    return { success: true, queuedActionId: queuedAction._id };
  } catch (error) {
    console.error('Queue action error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = queueAction;