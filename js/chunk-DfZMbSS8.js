import{u as e,d as l,i as t,_ as a}from"./chunk-B9lHjrML.js";import{d as s,u as n,l as o,s as u,r as i,h as c,w as r,a as d,b as p,m as b,t as m,j as f,F as v,B as x,C,q as h,D as w,E as g,H as k,G as y,o as U}from"./chunk-BraE6NOK.js";const z={class:"flex w-full gap-3"},P={role:"alert",class:"w-full my-4 alert alert-info"},L={class:"p-0 m-0"},D={class:"max-w-xs mb-10 form-control"},j={class:"flex flex-col items-center gap-2 pt-5"},V={class:"w-1/2 max-w-xs mb-10 form-control"},A={class:"label"},$={class:"label-text"},S=["onUpdate:modelValue","placeholder"],H={class:"w-1/2 max-w-xs mb-10 form-control"},M={class:"label"},N={class:"label-text"},O=["checked","onChange"],_={class:"w-1/2 max-w-xs mb-10 form-control"},q={class:"label"},B={class:"label-text"},I=["onUpdate:modelValue","placeholder","onChange"],T=["data-tip"],E=["value","max"],F={class:"w-1/2 max-w-xs mb-10 form-control"},G={class:"label"},R={class:"label-text"},J=["checked","onChange"],K={class:"w-full max-w-xs mb-10 form-control"},Q={class:"label"},W={class:"label-text"},X=["onUpdate:modelValue"],Y={key:0,value:{id:"",name:"",url:""}},Z={disabled:"",selected:""},ee=["value"],le={key:0,class:"w-full max-w-xs mb-10 form-control"},te={class:"label"},ae={class:"label-text"},se=["onClick"],ne={key:0,class:"flex flex-wrap w-full h-full gap-1 p-0 pt-1 m-0 cursor-pointer"},oe=["data-tip"],ue={key:1,class:"btn btn-secondary btn-xs"},ie={class:"w-full max-w-xs mb-10 form-control"},ce={class:"label"},re={class:"label-text"},de={class:"flex gap-2"},pe=["onClick"],be=s({__name:"PrizeConfig",setup(s){const{t:be}=n(),me=o.createInstance({name:"imgStore"}),fe=e().prizeConfig,ve=e().globalConfig,{getPrizeConfig:xe,getCurrentPrize:Ce}=u(fe),{getImageList:he}=u(ve),we=i(xe),ge=i([]),ke=i();function ye(){const e={id:(new Date).getTime().toString(),name:t.global.t("data.prizeName"),sort:0,isAll:!1,count:1,isUsedCount:0,picture:{id:"",name:"",url:""},separateCount:{enable:!1,countList:[]},desc:"",isUsed:!1,isShow:!0,frequency:1};fe.addPrizeConfig(e)}function Ue(e){ke.value.separateCount.countList=e,ke.value=null}function ze(){fe.resetDefault()}function Pe(e,l){const t=we.value.indexOf(e);1===l?(we.value.splice(t,1),we.value.splice(t-1,0,e)):(we.value.splice(t,1),we.value.splice(t+1,0,e))}async function Le(){await fe.deleteAllPrizeConfig()}return c((()=>{!async function(){(await me.keys()).length>0&&me.iterate(((e,l)=>{ge.value.push({key:l,value:e})}))}()})),r((()=>we.value),(e=>{fe.setPrizeConfig(e)}),{deep:!0}),(e,t)=>{var s,n;const o=a;return U(),d("div",null,[p("h2",null,m(f(be)("viewTitle.prizeManagement")),1),p("div",z,[p("button",{class:"btn btn-info btn-sm",onClick:ye},m(f(be)("button.add")),1),p("button",{class:"btn btn-info btn-sm",onClick:ze},m(f(be)("button.resetDefault")),1),p("button",{class:"btn btn-error btn-sm",onClick:Le},m(f(be)("button.allDelete")),1)]),p("div",P,[t[0]||(t[0]=p("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",class:"w-6 h-6 stroke-current shrink-0"},[p("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})],-1)),p("span",null,m(f(be)("dialog.tipResetPrize")),1)]),p("ul",L,[(U(!0),d(v,null,x(we.value,(e=>(U(),d("li",{key:e.id,class:C(["flex gap-10",f(Ce).id===e.id?"border-1 border-dotted rounded-xl":null])},[p("label",D,[p("div",j,[b(o,{class:C(["cursor-pointer hover:text-blue-400",0===we.value.indexOf(e)?"opacity-0 cursor-default":""]),name:"up",onClick:l=>Pe(e,1)},null,8,["class","onClick"]),b(o,{class:C(["cursor-pointer hover:text-blue-400",we.value.indexOf(e)===we.value.length-1?"opacity-0 cursor-default":""]),name:"down",onClick:l=>Pe(e,0)},null,8,["class","onClick"])])]),p("label",V,[p("div",A,[p("span",$,m(f(be)("table.prizeName")),1)]),w(p("input",{"onUpdate:modelValue":l=>e.name=l,type:"text",placeholder:f(be)("placeHolder.name"),class:"w-full max-w-xs input-sm input input-bordered"},null,8,S),[[g,e.name]])]),p("label",H,[p("div",M,[p("span",N,m(f(be)("table.fullParticipation")),1)]),p("input",{type:"checkbox",checked:e.isAll,class:"mt-2 border-solid checkbox checkbox-secondary border-1",onChange:l=>e.isAll=!e.isAll},null,40,O)]),p("label",_,[p("div",q,[p("span",B,m(f(be)("table.numberParticipants")),1)]),w(p("input",{"onUpdate:modelValue":l=>e.count=l,type:"number",placeholder:f(be)("placeHolder.winnerCount"),class:"w-full max-w-xs p-0 m-0 input-sm input input-bordered",onChange:l=>function(e){let l=-1;for(let t=0;t<we.value.length;t++)if(we.value[t].id===e.id){l=t;break}l>-1&&(we.value[l].separateCount.countList=[],we.value[l].isUsed?we.value[l].isUsedCount=we.value[l].count:we.value[l].isUsedCount=0)}(e)},null,40,I),[[g,e.count]]),p("div",{class:"tooltip tooltip-bottom","data-tip":`${f(be)("table.isDone")+e.isUsedCount}/${e.count}`},[p("progress",{class:"w-full progress",value:e.isUsedCount,max:e.count},null,8,E)],8,T)]),p("label",F,[p("div",G,[p("span",R,m(f(be)("table.isDone")),1)]),p("input",{type:"checkbox",checked:e.isUsed,class:"mt-2 border-solid checkbox checkbox-secondary border-1",onChange:l=>function(e){e.isUsed?e.isUsedCount=0:e.isUsedCount=e.count,e.separateCount.countList=[],e.isUsed=!e.isUsed}(e)},null,40,J)]),p("label",K,[p("div",Q,[p("span",W,m(f(be)("table.image")),1)]),w(p("select",{"onUpdate:modelValue":l=>e.picture=l,class:"w-full max-w-xs select select-warning select-sm"},[e.picture.id?(U(),d("option",Y,"❌")):h("",!0),p("option",Z,m(f(be)("table.selectPicture")),1),(U(!0),d(v,null,x(f(he),(e=>(U(),d("option",{key:e.id,value:e},m(e.name),9,ee)))),128))],8,X),[[k,e.picture]])]),e.separateCount?(U(),d("label",le,[p("div",te,[p("span",ae,m(f(be)("table.onceNumber")),1)]),p("div",{class:"flex justify-start w-full h-full",onClick:l=>function(e){ke.value=e,ke.value.isUsedCount=0,ke.value.isUsed=!1,ke.value.separateCount.countList.length>1||(ke.value.separateCount={enable:!0,countList:[{id:"0",count:e.count,isUsedCount:0}]})}(e)},[e.separateCount.countList.length?(U(),d("ul",ne,[(U(!0),d(v,null,x(e.separateCount.countList,(e=>(U(),d("li",{key:e.id,class:"relative flex items-center justify-center w-8 h-8 bg-slate-600/60 separated"},[p("div",{class:"flex items-center justify-center w-full h-full tooltip","data-tip":`${f(be)("tooltip.doneCount")+e.isUsedCount}/${e.count}`},[p("div",{class:"absolute left-0 z-50 h-full bg-blue-300/80",style:y(`width:${100*e.isUsedCount/e.count}%`)},null,4),p("span",null,m(e.count),1)],8,oe)])))),128))])):(U(),d("button",ue,m(f(be)("button.setting")),1))],8,se)])):h("",!0),p("label",ie,[p("div",ce,[p("span",re,m(f(be)("table.operation")),1)]),p("div",de,[p("button",{class:"btn btn-error btn-sm",onClick:l=>function(e){fe.deletePrizeConfig(e.id)}(e)},m(f(be)("button.delete")),9,pe)])])],2)))),128))]),b(l,{"total-number":null==(s=ke.value)?void 0:s.count,"separated-number":null==(n=ke.value)?void 0:n.separateCount.countList,onSubmitData:Ue},null,8,["total-number","separated-number"])])}}});export{be as default};
