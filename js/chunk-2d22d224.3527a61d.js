(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d22d224"],{f5cb:function(e,t,l){"use strict";l.r(t);var a=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",[l("form-group",{attrs:{list:e.formData,url:e.url}})],1)},n=[],i=function(){var e=this,t=e.$createElement,l=e._self._c||t;return Object.keys(e.valueList).length?l("Form",{ref:"form",attrs:{"label-width":e.labelWidth,model:e.valueList,rules:e.rules}},[e._l(e.list,(function(t,a){return l("FormItem",{key:e._uid+"_"+a,attrs:{label:t.label,"label-position":"left",prop:t.name,error:e.errorStore[t.name]},nativeOn:{click:function(l){return e.handleFocus(t.name)}}},[l(t.type,{tag:"component",attrs:{range:t.range},model:{value:e.valueList[t.name],callback:function(l){e.$set(e.valueList,t.name,l)},expression:"valueList[item.name]"}},[t.children?e._l(t.children.list,(function(n,i){return l(t.children.type,{key:e._uid+"_"+a+"_"+i,tag:"component",attrs:{label:n.label,value:n.value}},[e._v(e._s(n.title))])})):e._e()],2)],1)})),l("FormItem",[l("Button",{attrs:{type:"primary"},on:{click:e.handleSubmit}},[e._v("提交")]),l("Button",{on:{click:e.handleReset}},[e._v("重置")])],1)],2):e._e()},r=[],u=(l("fe59"),l("053b"),l("513c"),l("08ba"),l("aa6a")),o={name:"FormGroup",data:function(){return{initValueList:[],rules:{},valueList:{},errorStore:{}}},props:{list:{type:Array,default:function(){return[]}},labelWidth:{type:Number,default:100},url:{type:String,required:!0}},watch:{list:function(){this.setInitValue()}},methods:{setInitValue:function(){var e={},t={},l={},a={};this.list.forEach((function(n){e[n.name]=n.rule,t[n.name]=n.value,l[n.name]=n.value,a[n.name]=""})),this.rules=e,this.valueList=t,this.initValueList=l,this.errorStore=a,console.log(l)},handleSubmit:function(){this.$refs.form.validate((function(e){}))},handleReset:function(){this.valueList=Object(u["a"])(this.initValueList)},handleFocus:function(e){this.errorStore[e]=""}},mounted:function(){this.setInitValue()}},s=o,c=l("9ca4"),m=Object(c["a"])(s,i,r,!1,null,null,null),d=m.exports,p=d,h={name:"page-form-group",components:{FormGroup:p},data:function(){return{url:"",formData:[{name:"name",type:"i-input",value:"",label:"姓名",rule:[{required:!0,message:"The name cannot be empty",trigger:"blur"}]},{name:"range",type:"slider",value:[10,40],range:!0,label:"范围"},{name:"sex",type:"i-select",value:"",label:"性别",children:{type:"i-option",list:[{value:"man",title:"男"},{value:"woman",title:"女"}]}},{name:"education",type:"radio-group",value:1,label:"学历",children:{type:"radio",list:[{label:1,title:"本科"},{label:2,title:"研究生"},{label:3,title:"博士"}]}},{name:"skill",type:"checkbox-group",value:[],label:"技能",children:{type:"checkbox",list:[{label:1,title:"Vue"},{label:2,title:"Nodejs"},{label:3,title:"MySql"}]}},{name:"inWork",type:"i-switch",value:!0,label:"在职"}]}},created:function(){},mounted:function(){},methods:{}},b=h,f=Object(c["a"])(b,a,n,!1,null,"233108d2",null);t["default"]=f.exports}}]);