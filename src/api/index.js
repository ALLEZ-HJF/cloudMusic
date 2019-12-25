import ajax from './ajax'
// 获取主页轮播图
export const reqIndexBanner = () => ajax('/banner', {}, 'POST')
