const API = require("../../../utils/API.js")
import {
  $wuxSelect
} from '../../../dist/index'

Page({
  data: {
    bulidingList: "",
    weekNameList: ["一", "二", "三", "四", "五", "六", "日"],
    weekIndex: 1,
    classList: [],
    weekList: [],
    freeClassroomList: [],
    buliding: "",
    week: undefined,
    class_: undefined,
    weekName: undefined
  },
  getFreeClassroomList: function() {
    var that = this
    var building = that.data.buliding
    API.newAPI({
      url: "GetIdleClassroom",
      data: {
        building: building,
        "class": this.data.class_ + "-" + this.data.weekIndex,
        week: "w" + this.data.week,
      },
      callBack: (data) => {
        that.setData({
          freeClassroomList: data
        })
      }
    })
    // API.getData("getfreeclassroom",{
    //   op: 2,
    //   building: building,
    //   class_with_week: this.data.class_ + "-" + this.data.weekIndex,
    //   week: "w" + this.data.week,
    // },(data)=>{
    //   that.setData({
    //     freeClassroomList: data
    //   })
    // })
  },
  next: function() {
    var day = (new Date()).getDay()
    if (day == 0) {
      day = 6
    } else {
      day -= 1
    }
    var weekNow = Math.floor(((new Date()).getTime() - (new Date(getApp().globalData.firstWeek)).getTime()) / (24 * 3600 * 1000 * 7)) + 1
    this.setData({
      week: weekNow,
      weekIndex: day + 1,
      weekName: this.data.weekNameList[day]
    })
    setTimeout(this.getFreeClassroomList, 200)
    //this.getFreeClassroomList()
  },
  onLoad: function() {
    var classList = Array(11)
    var weekList = Array(20)
    var bulidingList = undefined
    for (let i = 0; i < 11; i++) {
      classList[i] = i + 1
    }
    for (let i = 0; i < 20; i++) {
      weekList[i] = i + 1
    }
    var that = this
    API.newAPI({
      url: "GetBuildingList",
      data: {},
      callBack: (data) => {
        that.setData({
          bulidingList: data,
          buliding: data[0]
        })
        that.setData({
          weekList: weekList,
          classList: classList,
          week: weekList[0],
          class_: classList[0],
          weekName: that.data.weekNameList[0]
        })
        setTimeout(that.next, 500)
      }
    })
    // API.getData("getfreeclassroom",{
    //   op: 1,
    // },(data)=>{
    //   that.setData({
    //     bulidingList: data,
    //     buliding: data[0]
    //   })
    //   that.setData({
    //     weekList: weekList,
    //     classList: classList,
    //     week: weekList[0],
    //     class_: classList[0],
    //     weekName: that.data.weekNameList[0]
    //   })
    //   setTimeout(that.next, 500)
    // })
  },

  onClick1() {
    $wuxSelect('#wux-select').open({
      value: this.data.buliding,
      options: this.data.bulidingList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            buliding: value,
          })
          this.getFreeClassroomList()
        }
      },
    })
  },
  onClick2() {
    var options = this.data.weekList.map(
      function(item, index) {
        return "第" + item + "周"
      })
    $wuxSelect('#wux-select').open({
      value: "第" + this.data.week + "周",
      options: options,
      onConfirm: (value, index, options) => {
        console.log(value.length == 4 ? value[1] + value[2] : value[1])
        if (index !== -1) {
          this.setData({
            week: value.length == 4 ? value[1] + value[2] : value[1],
          })
          setTimeout(this.getFreeClassroomList, 200)
        }
      },
    })
  },
  onClick3() {
    var options = this.data.weekNameList.map(
      function(item, index) {
        return "周" + item
      })
    $wuxSelect('#wux-select').open({
      value: "周" + this.data.weekName,
      options: options,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            weekName: value[1],
            weekIndex: index + 1
          })
          setTimeout(this.getFreeClassroomList, 200)
        }
      },
    })
  },
  onClick4() {
    var options = this.data.classList.map(
      function(item, index) {
        return "第" + item + "小节"
      })
    $wuxSelect('#wux-select').open({
      value: "第" + this.data.class_ + "小节",
      options: options,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            class_: value.length == 5 ? value[1] + value[2] : value[1],
          })
          setTimeout(this.getFreeClassroomList, 200)
        }
      },
    })

  },
})