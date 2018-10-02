/**
 * Created by yangjie on 2018/9/24.
 */

;(function(){
    var datepicker = {};
    //获取日历数据
    datepicker.getMonthData = function(year,month){
      var ret = [];
      if(!year || !month){
          var today = new Date();
          year = today.getFullYear();
          month = today.getMonth()+1;
      }
      //获取当月第一天
      var firstDay = new Date(year,month-1,1);
      //获取第一天是星期几
      var firstDayWeekDay = firstDay.getDay();
      if(firstDayWeekDay===0){ firstDayWeekDay = 7;}
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

        return ret;
    };
    //日期组件的数据渲染
    datepicker.buildUI = function(year,month){
        var monthData = datepicker.getMonthData(year,month);

        var html = ' <div class="ui-datepicker-header"> '+
            //datepicker头部区
            '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a> '+
            '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a> '+
            '<span class="ui-datepicker-curr-month">2016-12</span> '+
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
                    for(var i=0;i<monthData.length;i++){
                        var date = monthData[i];
                        if(i%7===0){
                            html += '<tr>';
                        }
                        html += '<td>' + date.showDate + '</td>';
                        if(i%7===6){
                            html += '</tr>';
                        }
                    }

                html += '</tbody> '+
                 '</table> '+
            '</div>';

        return html;
    };

    datepicker.init = function($dom){
        var html = datepicker.buildUI();
        $dom.innerHTML = html;
    }


    //将datepicker对象暴露出去
    window.datepicker = datepicker;
})();