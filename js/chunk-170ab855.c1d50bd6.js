(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-170ab855"],{"2bf7":function(e,t,n){"use strict";var a=n("ab83"),i=n.n(a);i.a},ab83:function(e,t,n){},f4de:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"page-edit-table"},[n("i-edit-table",{attrs:{columns:e.columns},on:{"on-edit":e.editHandle},model:{value:e.tableData,callback:function(t){e.tableData=t},expression:"tableData"}})],1)},i=[],l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Table",{attrs:{columns:e.insideColumns,data:e.value}})},s=[],u=(n("b4fb"),n("2eeb"),{name:"i-edit-table",props:{columns:{type:Array,default:function(){return[]},require:!0},value:{type:Array,require:!0,default:function(){return[]}}},data:function(){return{insideColumns:[],inputValue:"",edittingId:""}},mounted:function(){this.handleColumns()},watch:{columns:function(){this.handleColumns()}},methods:{handleColumns:function(){var e=this;this.$createElement;this.insideColumns=this.columns.map((function(t){return!t.render&&t.editable&&(t.render=function(t,n){var a=n.row,i=n.index,l=n.column,s="".concat(a._index,"_").concat(l.key)===e.edittingId;return t("div",{class:"editCell",style:"display:flex;align-items: center;"},[s?t("i-input",{style:"width:70%",on:{input:e.handleInput},attrs:{value:a[l.key]}}):t("p",{class:"clamp",attrs:{title:a[l.key]},style:"-webkit-box-orient: vertical"},[a[l.key]]),t("i-button",{style:"margin-left:10px",attrs:{size:"small"},on:{click:e.handleClick.bind(e,{row:a,index:i,column:l})}},[s?"保存":"修改"])])}),t}))},handleClick:function(e){var t=e.row,n=e.index,a=e.column;if(this.edittingId==="".concat(t._index,"_").concat(a.key)){var i=a.rule;if(i&&!i.reg.test(this.inputValue))return void this.$Message.error(i.info);var l=this.value;l[n][a.key]!==this.inputValue&&(l[n][a.key]=this.inputValue,this.$emit("on-edit",{row:t,index:n,column:a,newValue:this.inputValue})),this.inputValue="",this.edittingId=""}else this.edittingId="".concat(t._index,"_").concat(a.key),this.inputValue=t[a.key]},handleInput:function(e){this.inputValue=e}}}),o=u,r=(n("2bf7"),n("9ca4")),d=Object(r["a"])(o,l,s,!1,null,null,null),c=d.exports,m=c,h={name:"editTable",components:{IEditTable:m},data:function(){return{columns:[{title:"Name",key:"name",editable:!0},{title:"Age",key:"age"},{title:"Address",key:"address"}],tableData:[{name:"John Brown",age:18,address:"New York No. 1 Lake Park",date:"2016-10-03"},{name:"Jim Green",age:24,address:"London No. 1 Lake Park",date:"2016-10-01"},{name:"Joe Black",age:30,address:"Sydney No. 1 Lake Park",date:"2016-10-02"}]}},methods:{editHandle:function(e){console.log(e)}}},f=h,p=Object(r["a"])(f,a,i,!1,null,"190e17ac",null);t["default"]=p.exports}}]);