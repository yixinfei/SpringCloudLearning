(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d053d"],{6805:function(e,t,l){"use strict";l.r(t);var a=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("section",[l("div",{staticClass:"table"},[l("div",{staticClass:"container"},[l("div",{staticClass:"handle-box"},[l("el-col",{staticClass:"toolbar",staticStyle:{"padding-bottom":"0px"},attrs:{span:24}},[l("el-form",{attrs:{inline:!0,model:e.queryinfo}},[l("el-form-item",[e._v(" 姓名： "),l("el-input",{staticStyle:{width:"200px",heght:"30px"},attrs:{placeholder:"请输入姓名",size:"mini",clearable:""},model:{value:e.queryinfo.mc,callback:function(t){e.$set(e.queryinfo,"mc",t)},expression:"queryinfo.mc"}})],1),l("el-form-item",[e._v(" 警号： "),l("el-input",{staticStyle:{width:"200px",heght:"30px"},attrs:{placeholder:"请输入警号",size:"mini",clearable:""},model:{value:e.queryinfo.mc,callback:function(t){e.$set(e.queryinfo,"mc",t)},expression:"queryinfo.mc"}})],1),l("el-form-item",[l("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"mini"},on:{click:function(t){return e.getRjxzList()}}},[e._v("搜索")])],1)],1)],1)],1),l("el-button",{attrs:{type:"success",icon:"el-icon-circle-plus-outline",size:"mini",round:""},on:{click:e.handleAdd}},[e._v("新增")]),l("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"mini",round:""},on:{click:e.handleDeleteList}},[e._v("删除")]),[l("el-table",{ref:"multipleTable",staticClass:"el-tb-edit mgt20",attrs:{data:e.tableData,size:"mini","highlight-current-row":"",border:""},on:{"selection-change":e.handleSelectionChange}},[l("el-table-column",{attrs:{type:"selection",width:"40"}}),l("el-table-column",{attrs:{type:"index",label:"序号"}}),l("el-table-column",{attrs:{prop:"mc",label:"姓名"}}),l("el-table-column",{attrs:{prop:"xb",label:"性别"}}),l("el-table-column",{attrs:{prop:"mz",label:"民族"}}),l("el-table-column",{attrs:{prop:"jh",label:"警号"}}),l("el-table-column",{attrs:{prop:"ssdw",label:"所属单位"}}),l("el-table-column",{attrs:{fixed:"right",label:"操作",width:"250"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-button",{attrs:{type:"primary",plain:"",size:"small"},on:{click:function(l){return e.handleEdit(t.$index,t.row)}}},[e._v("编辑")])]}}])})],1),l("br"),l("el-pagination",{attrs:{"current-page":e.queryinfo.pagenum,"page-sizes":[10,20,50,100],"page-size":e.queryinfo.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:e.totalpage},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})]],2)]),l("el-dialog",{attrs:{title:"新增",width:"400px",visible:e.addFormVisible,"before-close":e.addCancel},on:{"update:visible":function(t){e.addFormVisible=t}}},[l("el-form",{ref:"addForm",attrs:{model:e.addForm,"label-width":"80px",rules:e.addFormRules}},[l("el-form-item",{attrs:{label:"姓名",prop:"name"}},[l("el-input",{attrs:{"auto-complete":"off",placeholder:"请输入姓名"},model:{value:e.addForm.mc,callback:function(t){e.$set(e.addForm,"mc",t)},expression:"addForm.mc"}})],1),l("br"),l("el-form-item",{attrs:{label:"性别",prop:"xb"}},[[l("el-radio",{attrs:{label:"1"},model:{value:e.addForm.xb,callback:function(t){e.$set(e.addForm,"xb",t)},expression:"addForm.xb"}},[e._v("男")]),l("el-radio",{attrs:{label:"2"},model:{value:e.addForm.xb,callback:function(t){e.$set(e.addForm,"xb",t)},expression:"addForm.xb"}},[e._v("女")])]],2),l("br"),l("el-form-item",{staticStyle:{width:"100%"},attrs:{label:"民族",prop:"name"}},[l("el-select",{staticStyle:{width:"100%"},attrs:{placeholder:"请选择"},model:{value:e.addForm.mz,callback:function(t){e.$set(e.addForm,"mz",t)},expression:"addForm.mz"}},e._l(e.options,(function(e){return l("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1),l("br"),l("el-form-item",{attrs:{label:"警号",prop:"name"}},[l("el-input",{attrs:{"auto-complete":"off",placeholder:"请输入警号"},model:{value:e.addForm.mc,callback:function(t){e.$set(e.addForm,"mc",t)},expression:"addForm.mc"}})],1),l("br"),l("el-form-item",{attrs:{label:"所属单位",prop:"name"}},[l("el-input",{attrs:{"auto-complete":"off",placeholder:"请输入所属单位"},model:{value:e.addForm.mc,callback:function(t){e.$set(e.addForm,"mc",t)},expression:"addForm.mc"}})],1),l("br")],1),l("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:e.addCancel}},[e._v("取消")]),l("el-button",{attrs:{type:"primary"},on:{click:e.addSubmit}},[e._v("提交")])],1)],1)],1)},o=[],r={data:function(){return{queryinfo:{mc:"",pagenum:1,pagesize:10},totalpage:0,tableData:[],selectList:[],deleteListId:[],addFormVisible:!1,addForm:{mc:"",mz:"",xb:"1"},file:"",fileList:[],progressFlag:"",progressPercent:0,options:[{value:"01",label:"汉族"},{value:"02",label:"蒙古族"}]}},computed:{},mounted:function(){},methods:{handleAdd:function(){this.addFormVisible=!0}}},i=r,n=l("2877"),s=Object(n["a"])(i,a,o,!1,null,null,null);t["default"]=s.exports}}]);
//# sourceMappingURL=chunk-2d0d053d.5906670d.js.map