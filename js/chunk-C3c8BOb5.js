import{d as l,u as a,c as t,a as e,b as n,F as s,B as u,t as o,j as r,o as c,C as i}from"./chunk-BraE6NOK.js";const y={class:"overflow-x-auto"},d={class:"table min-w-[600px]"},p={key:0},b=["innerHTML"],k={key:1},m=["onClick"],f={key:1},h={colspan:"5",class:"text-center"},v=l({__name:"index",props:{data:{type:Array,default:[]},tableColumns:{type:Array,default:[]}},setup(l){const v=l,{t:x}=a(),C=t((()=>v.tableColumns.filter((l=>!l.actions)))),_=t((()=>v.tableColumns.filter((l=>l.actions))));return(a,t)=>(c(),e("div",y,[n("table",d,[n("thead",null,[n("tr",null,[t[0]||(t[0]=n("th",null,null,-1)),(c(!0),e(s,null,u(C.value,((l,a)=>(c(),e("th",{key:a},o(l.label),1)))),128)),(c(!0),e(s,null,u(_.value,((l,a)=>(c(),e("th",{key:a},o(r(x)("table.operation")),1)))),128)),t[1]||(t[1]=n("th",null,null,-1))])]),l.data.length>0?(c(),e("tbody",p,[(c(!0),e(s,null,u(l.data,(l=>(c(),e("tr",{key:l.id,class:"hover"},[n("th",null,o(l.id),1),(c(!0),e(s,null,u(C.value,((a,t)=>(c(),e("td",{key:t},[a.formatValue?(c(),e("span",{key:0,innerHTML:a.formatValue(l)},null,8,b)):(c(),e("span",k,o(l[a.props]),1))])))),128)),(c(!0),e(s,null,u(_.value,((a,t)=>(c(),e("td",{key:t,class:"flex gap-2"},[(c(!0),e(s,null,u(a.actions,(a=>(c(),e("button",{key:a.name,class:i(["btn btn-xs",a.type]),onClick:t=>a.onClick(l)},o(a.label),11,m)))),128))])))),128))])))),128))])):(c(),e("tbody",f,[n("tr",null,[n("td",h,o(r(x)("table.noneData")),1)])]))])]))}});export{v as _};
