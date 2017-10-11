import Mock from 'mockjs'
import {
  param2Obj
} from '@/utils'

const List = []
const total = 100
const count = 30

for (let i = 0; i < total; i++) {
  List.push(Mock.mock({
    'id': /\d{7}/, // 客户编号
    time1: '@datetime', // 注册时间
    author: '@cname', // 认领人
    time2: '@datetime', // 认领时间
    auditor: '@cname', // 审核人
    time3: '@datetime', // 审核时间
    name: '@cname', // 姓名
    mobile: /13\d{9}/,
    cardId: '@id', // 身份证ID
    'state|1': ['已注册', '资料未完善', '等待审核中', '等待通过', '认证通过', '认证通过', '身份证已经注册', '永久拒绝', '用户已销户'],
    'creditStatus|1': ['正常', '永久冻结'],
    'loanStatus|1': ['未借款', '已借款'],
    'quota|1-100': 1,   // 额度
    company: '@ctitle(8)',   // 公司
    'registerStatus|1': ['H5', '代理', '第三方平台'],  // 注册类型
    title: '@ctitle(10, 20)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }))
}

/**
 * 将mock数组的值进行分组
 *
 * @param {any} arr
 * @param {any} count
 * @returns
 */
function sortArr(arr, count) {
  const result = []
  while (arr.length > 0) {
    result.push(arr.splice(0, count))
  }
  return result
}

export default {
  getList: config => {
    const param = param2Obj(config.url) || { page: 1 }
    const result = sortArr(List.concat(), count)
    return {
      total: List.length,
      items: result[param.page - 1]
    }
  },
  getPv: () => ({
    pvData: [{
      key: 'PC网站',
      pv: 1024
    }, {
      key: 'mobile网站',
      pv: 1024
    }, {
      key: 'ios',
      pv: 1024
    }, {
      key: 'android',
      pv: 1024
    }]
  }),
  getArticle: () => ({
    id: 120000000001,
    author: {
      key: 'mockPan'
    },
    source_name: '原创作者',
    category_item: [{
      key: 'global',
      name: '全球'
    }],
    comment_disabled: false,
    content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
    content_short: '我是测试数据',
    display_time: +new Date(),
    image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    platforms: ['a-platform'],
    source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
    status: 'published',
    tags: [],
    title: ''
  })
}
