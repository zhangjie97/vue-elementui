import Vue from 'vue'


// 日期时间格式化
Vue.filter('dateTimeFormat', (value, format = 'YYYY-MM-dd HH:mm:ss') => {
  if (!value) return '';
  let date = '';
  if(format == 'YYYY-MM-dd HH:mm:ss'){
    let yyyy = value.slice(0,4);
    let mm = value.slice(4,6);
    let dd = value.slice(6,8);
    let hh = value.slice(8,10);
    let ii = value.slice(10,12);
    let ss = value.slice(12,14);
    date = yyyy + '-'+ mm + '-'+ dd + ' '+hh+':'+ ii +':'+ ss;
  }

  if(format == 'YYYY-MM-dd'){
    let yyyy = value.slice(0,4);
    let mm = value.slice(4,6);
    let dd = value.slice(6,8);
    date = yyyy + '-'+ mm + '-'+ dd;
  }


  if(format == 'YYYY-MM'){
    let yyyy = value.slice(0,4);
    let mm = value.slice(4,6);
    date = yyyy + '-'+ mm;
  }


  if(format == 'YYYY-MM-dd HH:mm'){
    let yyyy = value.slice(0,4);
    let mm = value.slice(4,6);
    let dd = value.slice(6,8);
    let hh = value.slice(8,10);
    let ii = value.slice(10,12);
    date = yyyy + '-'+ mm + '-'+ dd + ' '+hh+':'+ ii;
  }


  if(format == 'YYYY年MM月DD日HH时mm分'){
    let yyyy = value.slice(0,4);
    let mm = value.slice(4,6);
    let dd = value.slice(6,8);
    let hh = value.slice(8,10);
    let ii = value.slice(10,12);
    date = yyyy + '年'+ mm + '月'+ dd +'日'+hh+'时'+ ii+'分';
  }

  if(format == 'YYYY年MM月DD日'){
    let yyyy = value.slice(0,4);
    let mm = value.slice(4,6);
    let dd = value.slice(6,8);
    date = yyyy + '年'+ mm + '月'+ dd +'日';
  }

  if(format == 'HH:mm:ss'){
    let hh = value.slice(0,2);
    let ii = value.slice(2,4);
    let ss = value.slice(4,6);
    date = hh+':'+ ii +':'+ ss;
  }


  if(format == 'HH:mm'){
    let hh = value.slice(0,2);
    let ii = value.slice(2,4);
    date = hh+':'+ ii;
  }

  return date;
})



