export enum OrderFrom {
  XIANYU = '闲鱼',
  TAOBAO = '淘宝',
  WECHAT = '微信',
  WECHAT_MOMENTS = '微信朋友圈',
  FRIEND_RECOMMEND = '好友推荐',
  OTHERS = '其他',
}

export enum OrderStatus {
  INIT = 0, // 在聊
  DEAL = 10, // 接单，用户已下单、付款
  DELIVERY = 20, // 交付，已交付用户
  NONE = 99, // 未成单
}
