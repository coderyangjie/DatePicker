/**
 * Created by yangjie on 2018/9/24.
 */

;(function(){
    var datepicker = {};
    //获取日历数据
    datepicker.getMonthData = function(year,month){
      var ret = [];
      if(year===undefined || month===undefined){
          var today = new Date();
          year = today.getFullYear();
          month = today.getMonth()+1;
      }
      //获取当月第一天
      var firstDay = new Date(year,month-1,1);
      //获取第一天是星期几
      var firstDayWeekDay = firstDay.getDay();
      if(firstDayWeekDay===0){ firstDayWeekDay = 7;}
      //重新获取year和month,这样就不存在越界的问题
      year = firstDay.getFullYear();
      month = firstDay.getMonth()+1;

      //获取上个月的最后一天
      var lastDayOfLastMonth = new Date(year,month-1,0);
      var lastDateOfLastMonth = lastDayOfLastMonth.getDate();
      //在日历的第一行要显示多少个上一个月的日期
       var preMonthDayCount = firstDayWeekDay-1;
       //获取当月的最后一天
        var lastDay = new Date(year,month,0);
        var lastDate = lastDay.getDate();

        for(var i=0;i<7*6;i++){
            var date = i+1-preMonthDayCount;
            var showDate = date;
            var thisMonth = month;
            if(date<=0){
                //上一个月
                thisMonth = month - 1;
                showDate = lastDateOfLastMonth + date;
            }else if(date>lastDate){
                //下一个月
                thisMonth = month + 1;
                showDate = showDate - lastDate;
            }

            if(thisMonth===0) thisMonth = 12;
            if(thisMonth===13) thisMonth = 1;

            ret.push({
               month:thisMonth,
                date:date,
                showDate:showDate
            });
        }

        return {
            year:year,
            month:month,
            days:ret
        };
    };

    //将monthData暴露出来，以便使用
    var monthData;
    //日期组件的数据渲染
    datepicker.buildUI = function(year,month){
        monthData = datepicker.getMonthData(year,month);

        var html = ' <div class="ui-datepicker-header"> '+
            //datepicker头部区
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a> '+
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a> '+
            '<span class="ui-datepicker-curr-month">' + monthData.year + '-' + padding(monthData.month) + '</span> '+
            '</div> '+
            //datepicker主体区
            '<div class="ui-datepicker-body"> '+
                '<table> '+
                     '<thead> '+
                         '<tr> '+
                             '<th>一</th> '+
                             '<th>二</th> '+
                             '<th>三</th> '+
                             '<th>四</th> '+
                             '<th>五</th> '+
                            '<th>六</th> '+
                            '<th>日</th> '+
                        '</tr> '+
                    '</thead> '+
                    '<tbody> ';
                    for(var i=0;i<monthData.days.length;i++){
                        var date = monthData.days[i];
                        if(i%7===0){
                            html += '<tr>';
                        }
                        //给不是当月的日期加上不一样的颜色，并且使其不能选择
                        if(monthData.month!==date.month){
                            html += '<td data-date="' + date.date + '" style="background: #f0f0f0;" data-month="other">' + date.showDate + '</td>';

                        }else{
                            html += '<td data-date="' + date.date + '" data-month="this">' + date.showDate + '</td>';
                        }

                        if(i%7===6){
                            html += '</tr>';
                        }
                    }

                html += '</tbody> '+
                 '</table> '+
            '</div>';

        return html;
    };

    var $wrapper; //日历组件最外层的包裹div元素

    //数据渲染函数
    datepicker.render = function(direction){
        var year,month;
        if(monthData){
            year = monthData.year;
            month = monthData.month;
        }

        if(direction === 'prev'){ month--;}
        if(direction === 'next'){ month++;}
        var html = datepicker.buildUI(year,month);

        $wrapper = document.querySelector('.ui-datepicker-wrapper');
        //如果$wrapper没有定义，即第一次渲染，则新建div
        if(!$wrapper){
            $wrapper = document.createElement('div');
            $wrapper.className = 'ui-datepicker-wrapper';
            //将日历组件div添加到body中
            document.body.appendChild($wrapper);
        }
        $wrapper.innerHTML = html;

    };

    datepicker.init = function(input){
        //日历数据渲染
        datepicker.render();

        var $input = document.querySelector(input);
        var isOpen = false;

        //点击输入框显示和隐藏日历组件
        $input.addEventListener('click',function(e){
            if(isOpen){
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen=false;
            }else{
                $wrapper.classList.add('ui-datepicker-wrapper-show');
                var left = $input.offsetLeft;
                var top = $input.offsetTop;
                var height = $input.offsetHeight;
                $wrapper.style.top = top + height + 2 + 'px';
                $wrapper.style.left = left + 'px';
                isOpen = true;

            }
            stopBubble(e);
        },false);

        //如果日历组件显示时，点击其他的地方，关闭日历组件
        document.addEventListener('click',function(e){
            //关闭日历组件
            $wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen=false;
        },false);



        //阻止冒泡函数
        function stopBubble(e) {
            if (e && e.stopPropagation) {
                e.stopPropagation(); //w3c
            } else {
                window.event.cancelBubble = true; //IE
            }
          /*  e=e||window.event;
            e.stopPropagation();*/
        }

                //月份切换功能
        $wrapper.addEventListener('click',function(e){
            stopBubble(e);
            var $target = e.target;
            if(!$target.classList.contains('ui-datepicker-btn')){ return;}

            //上一页
            if($target.classList.contains('ui-datepicker-prev-btn')){
                datepicker.render('prev');
            }else if($target.classList.contains('ui-datepicker-next-btn')){ //下一页
                datepicker.render('next');
            }


        },false);

        //点击日期选择事件
        $wrapper.addEventListener('click',function(e){
            stopBubble(e);
            var $target = e.target;
            //如果不是点击的td（日期），就返回
            if($target.tagName.toLowerCase() !== 'td'){ return; }
            if($target.dataset.month=='this'){
                var date = new Date(monthData.year,monthData.month - 1,$target.dataset.date);
                //将格式化后的日期赋值给输入框
                $input.value = format(date);
                //关闭日历组件
                $wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen=false;
            }




        },false);

    };

    //日期格式化函数
    function format(date){
        var ret = '';
        ret += date.getFullYear() + '-';
        ret += padding(date.getMonth() + 1) + '-';
        ret += padding(date.getDate());

        return ret;
    }

    //数字格式化
    function padding(num){
        if(num<=9){
            return '0' + num;
        }
        return num;
    }


    //将datepicker对象暴露出去
    window.datepicker = datepicker;
})();