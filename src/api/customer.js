import fetch from '@/utils/fetch'

// query => 获取指定页面的信息
export function fetchAuditList(query) {
  return fetch({
    url: '/customer/list',
    method: 'get',
    params: { 'page': query }
  })
}

export function fetchArticle() {
  return fetch({
    url: '/article/detail',
    method: 'get'
  })
}

export function fetchPv(pv) {
  return fetch({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

