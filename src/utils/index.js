/**
 * Created by PanJiaChen on 16/11/18.
 */
export function menuTransTree(data,type='menus') {
  const menuFristList = []
  const menusTree = []
	console.log(data)
  data.forEach(item => {
    const tmp_obj = {id: item.id,parentId:0, label: item.title, data: item}
    if(name.name)
    if(type==='buttons'){
      tmp_obj.children=[]
      for(const _key in  item.buttons){
        tmp_obj.children.push({id:_key+'-'+item.id,parentId: item.id,label:transBtnName(_key)})
      }
    }
    if (item.parentId === 0) {
				menuFristList.push(item)
				const has_child=data.find(_itm=>{
					return _itm.parentId===item.id
				})
				if(has_child){
					delete tmp_obj.children
				}
				menusTree.push(tmp_obj)
    } else {
    	console.log(item.name)
			if(item.name!=='system-menus'&&item.name!=='system-roles'&&item.name!=='store-list') {
				for (let i = 0; i < menusTree.length; i++) {
					if (item.parentId === menusTree[i].id) {
						tmp_obj.parentId = menusTree[i].id
						if (menusTree[i].hasOwnProperty('children')) {
							menusTree[i].children.push(tmp_obj)
						} else {
							menusTree[i].children = [tmp_obj]
						}
						break
					}
				}
			}
    }
  })
  return {menusTree, menuFristList}
}
export function transBtnName(str){
  let name=''
  switch (str){
    case 'view':
      name='查看'
      break
    case 'add':
      name='添加'
      break
    case 'delete':
      name='删除'
      break
    default:
      name='编辑'
      break
  }
  return name
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
