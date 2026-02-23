(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();/**
* @vue/shared v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Vo(i){const e=Object.create(null);for(const t of i.split(","))e[t]=1;return t=>t in e}const X={},wi=[],gt=()=>{},la=()=>!1,kn=i=>i.charCodeAt(0)===111&&i.charCodeAt(1)===110&&(i.charCodeAt(2)>122||i.charCodeAt(2)<97),jo=i=>i.startsWith("onUpdate:"),ye=Object.assign,zo=(i,e)=>{const t=i.indexOf(e);t>-1&&i.splice(t,1)},fd=Object.prototype.hasOwnProperty,Y=(i,e)=>fd.call(i,e),M=Array.isArray,Ci=i=>Sn(i)==="[object Map]",aa=i=>Sn(i)==="[object Set]",H=i=>typeof i=="function",de=i=>typeof i=="string",It=i=>typeof i=="symbol",ie=i=>i!==null&&typeof i=="object",ca=i=>(ie(i)||H(i))&&H(i.then)&&H(i.catch),da=Object.prototype.toString,Sn=i=>da.call(i),pd=i=>Sn(i).slice(8,-1),ha=i=>Sn(i)==="[object Object]",Uo=i=>de(i)&&i!=="NaN"&&i[0]!=="-"&&""+parseInt(i,10)===i,os=Vo(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Tn=i=>{const e=Object.create(null);return(t=>e[t]||(e[t]=i(t)))},gd=/-\w/g,We=Tn(i=>i.replace(gd,e=>e.slice(1).toUpperCase())),bd=/\B([A-Z])/g,ci=Tn(i=>i.replace(bd,"-$1").toLowerCase()),_n=Tn(i=>i.charAt(0).toUpperCase()+i.slice(1)),Gn=Tn(i=>i?`on${_n(i)}`:""),Lt=(i,e)=>!Object.is(i,e),Zs=(i,...e)=>{for(let t=0;t<i.length;t++)i[t](...e)},ua=(i,e,t,s=!1)=>{Object.defineProperty(i,e,{configurable:!0,enumerable:!1,writable:s,value:t})},qo=i=>{const e=parseFloat(i);return isNaN(e)?i:e};let Mr;const An=()=>Mr||(Mr=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Go(i){if(M(i)){const e={};for(let t=0;t<i.length;t++){const s=i[t],n=de(s)?xd(s):Go(s);if(n)for(const o in n)e[o]=n[o]}return e}else if(de(i)||ie(i))return i}const md=/;(?![^(]*\))/g,vd=/:([^]+)/,yd=/\/\*[^]*?\*\//g;function xd(i){const e={};return i.replace(yd,"").split(md).forEach(t=>{if(t){const s=t.split(vd);s.length>1&&(e[s[0].trim()]=s[1].trim())}}),e}function Oi(i){let e="";if(de(i))e=i;else if(M(i))for(let t=0;t<i.length;t++){const s=Oi(i[t]);s&&(e+=s+" ")}else if(ie(i))for(const t in i)i[t]&&(e+=t+" ");return e.trim()}const $d="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",wd=Vo($d);function fa(i){return!!i||i===""}const pa=i=>!!(i&&i.__v_isRef===!0),Ks=i=>de(i)?i:i==null?"":M(i)||ie(i)&&(i.toString===da||!H(i.toString))?pa(i)?Ks(i.value):JSON.stringify(i,ga,2):String(i),ga=(i,e)=>pa(e)?ga(i,e.value):Ci(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((t,[s,n],o)=>(t[Wn(s,o)+" =>"]=n,t),{})}:aa(e)?{[`Set(${e.size})`]:[...e.values()].map(t=>Wn(t))}:It(e)?Wn(e):ie(e)&&!M(e)&&!ha(e)?String(e):e,Wn=(i,e="")=>{var t;return It(i)?`Symbol(${(t=i.description)!=null?t:e})`:i};/**
* @vue/reactivity v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Be;class Cd{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=Be,!e&&Be&&(this.index=(Be.scopes||(Be.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].pause();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes)for(e=0,t=this.scopes.length;e<t;e++)this.scopes[e].resume();for(e=0,t=this.effects.length;e<t;e++)this.effects[e].resume()}}run(e){if(this._active){const t=Be;try{return Be=this,e()}finally{Be=t}}}on(){++this._on===1&&(this.prevScope=Be,Be=this)}off(){this._on>0&&--this._on===0&&(Be=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let t,s;for(t=0,s=this.effects.length;t<s;t++)this.effects[t].stop();for(this.effects.length=0,t=0,s=this.cleanups.length;t<s;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){for(t=0,s=this.scopes.length;t<s;t++)this.scopes[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const n=this.parent.scopes.pop();n&&n!==this&&(this.parent.scopes[this.index]=n,n.index=this.index)}this.parent=void 0}}}function kd(){return Be}let ee;const Qn=new WeakSet;class ba{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Be&&Be.active&&Be.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Qn.has(this)&&(Qn.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||va(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Hr(this),ya(this);const e=ee,t=Ke;ee=this,Ke=!0;try{return this.fn()}finally{xa(this),ee=e,Ke=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Yo(e);this.deps=this.depsTail=void 0,Hr(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Qn.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Co(this)&&this.run()}get dirty(){return Co(this)}}let ma=0,rs,ls;function va(i,e=!1){if(i.flags|=8,e){i.next=ls,ls=i;return}i.next=rs,rs=i}function Wo(){ma++}function Qo(){if(--ma>0)return;if(ls){let e=ls;for(ls=void 0;e;){const t=e.next;e.next=void 0,e.flags&=-9,e=t}}let i;for(;rs;){let e=rs;for(rs=void 0;e;){const t=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(s){i||(i=s)}e=t}}if(i)throw i}function ya(i){for(let e=i.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function xa(i){let e,t=i.depsTail,s=t;for(;s;){const n=s.prevDep;s.version===-1?(s===t&&(t=n),Yo(s),Sd(s)):e=s,s.dep.activeLink=s.prevActiveLink,s.prevActiveLink=void 0,s=n}i.deps=e,i.depsTail=t}function Co(i){for(let e=i.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&($a(e.dep.computed)||e.dep.version!==e.version))return!0;return!!i._dirty}function $a(i){if(i.flags&4&&!(i.flags&16)||(i.flags&=-17,i.globalVersion===vs)||(i.globalVersion=vs,!i.isSSR&&i.flags&128&&(!i.deps&&!i._dirty||!Co(i))))return;i.flags|=2;const e=i.dep,t=ee,s=Ke;ee=i,Ke=!0;try{ya(i);const n=i.fn(i._value);(e.version===0||Lt(n,i._value))&&(i.flags|=128,i._value=n,e.version++)}catch(n){throw e.version++,n}finally{ee=t,Ke=s,xa(i),i.flags&=-3}}function Yo(i,e=!1){const{dep:t,prevSub:s,nextSub:n}=i;if(s&&(s.nextSub=n,i.prevSub=void 0),n&&(n.prevSub=s,i.nextSub=void 0),t.subs===i&&(t.subs=s,!s&&t.computed)){t.computed.flags&=-5;for(let o=t.computed.deps;o;o=o.nextDep)Yo(o,!0)}!e&&!--t.sc&&t.map&&t.map.delete(t.key)}function Sd(i){const{prevDep:e,nextDep:t}=i;e&&(e.nextDep=t,i.prevDep=void 0),t&&(t.prevDep=e,i.nextDep=void 0)}let Ke=!0;const wa=[];function kt(){wa.push(Ke),Ke=!1}function St(){const i=wa.pop();Ke=i===void 0?!0:i}function Hr(i){const{cleanup:e}=i;if(i.cleanup=void 0,e){const t=ee;ee=void 0;try{e()}finally{ee=t}}}let vs=0,Td=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}};class Jo{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!ee||!Ke||ee===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==ee)t=this.activeLink=new Td(ee,this),ee.deps?(t.prevDep=ee.depsTail,ee.depsTail.nextDep=t,ee.depsTail=t):ee.deps=ee.depsTail=t,Ca(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const s=t.nextDep;s.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=s),t.prevDep=ee.depsTail,t.nextDep=void 0,ee.depsTail.nextDep=t,ee.depsTail=t,ee.deps===t&&(ee.deps=s)}return t}trigger(e){this.version++,vs++,this.notify(e)}notify(e){Wo();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{Qo()}}}function Ca(i){if(i.dep.sc++,i.sub.flags&4){const e=i.dep.computed;if(e&&!i.dep.subs){e.flags|=20;for(let s=e.deps;s;s=s.nextDep)Ca(s)}const t=i.dep.subs;t!==i&&(i.prevSub=t,t&&(t.nextSub=i)),i.dep.subs=i}}const ko=new WeakMap,ni=Symbol(""),So=Symbol(""),ys=Symbol("");function ge(i,e,t){if(Ke&&ee){let s=ko.get(i);s||ko.set(i,s=new Map);let n=s.get(t);n||(s.set(t,n=new Jo),n.map=s,n.key=t),n.track()}}function $t(i,e,t,s,n,o){const r=ko.get(i);if(!r){vs++;return}const l=a=>{a&&a.trigger()};if(Wo(),e==="clear")r.forEach(l);else{const a=M(i),d=a&&Uo(t);if(a&&t==="length"){const c=Number(s);r.forEach((h,g)=>{(g==="length"||g===ys||!It(g)&&g>=c)&&l(h)})}else switch((t!==void 0||r.has(void 0))&&l(r.get(t)),d&&l(r.get(ys)),e){case"add":a?d&&l(r.get("length")):(l(r.get(ni)),Ci(i)&&l(r.get(So)));break;case"delete":a||(l(r.get(ni)),Ci(i)&&l(r.get(So)));break;case"set":Ci(i)&&l(r.get(ni));break}}Qo()}function gi(i){const e=Q(i);return e===i?e:(ge(e,"iterate",ys),qe(i)?e:e.map(et))}function In(i){return ge(i=Q(i),"iterate",ys),i}function Ft(i,e){return Tt(i)?oi(i)?Ri(et(e)):Ri(e):et(e)}const _d={__proto__:null,[Symbol.iterator](){return Yn(this,Symbol.iterator,i=>Ft(this,i))},concat(...i){return gi(this).concat(...i.map(e=>M(e)?gi(e):e))},entries(){return Yn(this,"entries",i=>(i[1]=Ft(this,i[1]),i))},every(i,e){return vt(this,"every",i,e,void 0,arguments)},filter(i,e){return vt(this,"filter",i,e,t=>t.map(s=>Ft(this,s)),arguments)},find(i,e){return vt(this,"find",i,e,t=>Ft(this,t),arguments)},findIndex(i,e){return vt(this,"findIndex",i,e,void 0,arguments)},findLast(i,e){return vt(this,"findLast",i,e,t=>Ft(this,t),arguments)},findLastIndex(i,e){return vt(this,"findLastIndex",i,e,void 0,arguments)},forEach(i,e){return vt(this,"forEach",i,e,void 0,arguments)},includes(...i){return Jn(this,"includes",i)},indexOf(...i){return Jn(this,"indexOf",i)},join(i){return gi(this).join(i)},lastIndexOf(...i){return Jn(this,"lastIndexOf",i)},map(i,e){return vt(this,"map",i,e,void 0,arguments)},pop(){return Yi(this,"pop")},push(...i){return Yi(this,"push",i)},reduce(i,...e){return Lr(this,"reduce",i,e)},reduceRight(i,...e){return Lr(this,"reduceRight",i,e)},shift(){return Yi(this,"shift")},some(i,e){return vt(this,"some",i,e,void 0,arguments)},splice(...i){return Yi(this,"splice",i)},toReversed(){return gi(this).toReversed()},toSorted(i){return gi(this).toSorted(i)},toSpliced(...i){return gi(this).toSpliced(...i)},unshift(...i){return Yi(this,"unshift",i)},values(){return Yn(this,"values",i=>Ft(this,i))}};function Yn(i,e,t){const s=In(i),n=s[e]();return s!==i&&!qe(i)&&(n._next=n.next,n.next=()=>{const o=n._next();return o.done||(o.value=t(o.value)),o}),n}const Ad=Array.prototype;function vt(i,e,t,s,n,o){const r=In(i),l=r!==i&&!qe(i),a=r[e];if(a!==Ad[e]){const h=a.apply(i,o);return l?et(h):h}let d=t;r!==i&&(l?d=function(h,g){return t.call(this,Ft(i,h),g,i)}:t.length>2&&(d=function(h,g){return t.call(this,h,g,i)}));const c=a.call(r,d,s);return l&&n?n(c):c}function Lr(i,e,t,s){const n=In(i);let o=t;return n!==i&&(qe(i)?t.length>3&&(o=function(r,l,a){return t.call(this,r,l,a,i)}):o=function(r,l,a){return t.call(this,r,Ft(i,l),a,i)}),n[e](o,...s)}function Jn(i,e,t){const s=Q(i);ge(s,"iterate",ys);const n=s[e](...t);return(n===-1||n===!1)&&er(t[0])?(t[0]=Q(t[0]),s[e](...t)):n}function Yi(i,e,t=[]){kt(),Wo();const s=Q(i)[e].apply(i,t);return Qo(),St(),s}const Id=Vo("__proto__,__v_isRef,__isVue"),ka=new Set(Object.getOwnPropertyNames(Symbol).filter(i=>i!=="arguments"&&i!=="caller").map(i=>Symbol[i]).filter(It));function Ed(i){It(i)||(i=String(i));const e=Q(this);return ge(e,"has",i),e.hasOwnProperty(i)}class Sa{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,s){if(t==="__v_skip")return e.__v_skip;const n=this._isReadonly,o=this._isShallow;if(t==="__v_isReactive")return!n;if(t==="__v_isReadonly")return n;if(t==="__v_isShallow")return o;if(t==="__v_raw")return s===(n?o?Nd:Ia:o?Aa:_a).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(s)?e:void 0;const r=M(e);if(!n){let a;if(r&&(a=_d[t]))return a;if(t==="hasOwnProperty")return Ed}const l=Reflect.get(e,t,me(e)?e:s);if((It(t)?ka.has(t):Id(t))||(n||ge(e,"get",t),o))return l;if(me(l)){const a=r&&Uo(t)?l:l.value;return n&&ie(a)?_o(a):a}return ie(l)?n?_o(l):Zo(l):l}}class Ta extends Sa{constructor(e=!1){super(!1,e)}set(e,t,s,n){let o=e[t];const r=M(e)&&Uo(t);if(!this._isShallow){const d=Tt(o);if(!qe(s)&&!Tt(s)&&(o=Q(o),s=Q(s)),!r&&me(o)&&!me(s))return d||(o.value=s),!0}const l=r?Number(t)<e.length:Y(e,t),a=Reflect.set(e,t,s,me(e)?e:n);return e===Q(n)&&(l?Lt(s,o)&&$t(e,"set",t,s):$t(e,"add",t,s)),a}deleteProperty(e,t){const s=Y(e,t);e[t];const n=Reflect.deleteProperty(e,t);return n&&s&&$t(e,"delete",t,void 0),n}has(e,t){const s=Reflect.has(e,t);return(!It(t)||!ka.has(t))&&ge(e,"has",t),s}ownKeys(e){return ge(e,"iterate",M(e)?"length":ni),Reflect.ownKeys(e)}}class Od extends Sa{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}}const Rd=new Ta,Pd=new Od,Dd=new Ta(!0);const To=i=>i,js=i=>Reflect.getPrototypeOf(i);function Fd(i,e,t){return function(...s){const n=this.__v_raw,o=Q(n),r=Ci(o),l=i==="entries"||i===Symbol.iterator&&r,a=i==="keys"&&r,d=n[i](...s),c=t?To:e?Ri:et;return!e&&ge(o,"iterate",a?So:ni),{next(){const{value:h,done:g}=d.next();return g?{value:h,done:g}:{value:l?[c(h[0]),c(h[1])]:c(h),done:g}},[Symbol.iterator](){return this}}}}function zs(i){return function(...e){return i==="delete"?!1:i==="clear"?void 0:this}}function Bd(i,e){const t={get(n){const o=this.__v_raw,r=Q(o),l=Q(n);i||(Lt(n,l)&&ge(r,"get",n),ge(r,"get",l));const{has:a}=js(r),d=e?To:i?Ri:et;if(a.call(r,n))return d(o.get(n));if(a.call(r,l))return d(o.get(l));o!==r&&o.get(n)},get size(){const n=this.__v_raw;return!i&&ge(Q(n),"iterate",ni),n.size},has(n){const o=this.__v_raw,r=Q(o),l=Q(n);return i||(Lt(n,l)&&ge(r,"has",n),ge(r,"has",l)),n===l?o.has(n):o.has(n)||o.has(l)},forEach(n,o){const r=this,l=r.__v_raw,a=Q(l),d=e?To:i?Ri:et;return!i&&ge(a,"iterate",ni),l.forEach((c,h)=>n.call(o,d(c),d(h),r))}};return ye(t,i?{add:zs("add"),set:zs("set"),delete:zs("delete"),clear:zs("clear")}:{add(n){!e&&!qe(n)&&!Tt(n)&&(n=Q(n));const o=Q(this);return js(o).has.call(o,n)||(o.add(n),$t(o,"add",n,n)),this},set(n,o){!e&&!qe(o)&&!Tt(o)&&(o=Q(o));const r=Q(this),{has:l,get:a}=js(r);let d=l.call(r,n);d||(n=Q(n),d=l.call(r,n));const c=a.call(r,n);return r.set(n,o),d?Lt(o,c)&&$t(r,"set",n,o):$t(r,"add",n,o),this},delete(n){const o=Q(this),{has:r,get:l}=js(o);let a=r.call(o,n);a||(n=Q(n),a=r.call(o,n)),l&&l.call(o,n);const d=o.delete(n);return a&&$t(o,"delete",n,void 0),d},clear(){const n=Q(this),o=n.size!==0,r=n.clear();return o&&$t(n,"clear",void 0,void 0),r}}),["keys","values","entries",Symbol.iterator].forEach(n=>{t[n]=Fd(n,i,e)}),t}function Xo(i,e){const t=Bd(i,e);return(s,n,o)=>n==="__v_isReactive"?!i:n==="__v_isReadonly"?i:n==="__v_raw"?s:Reflect.get(Y(t,n)&&n in s?t:s,n,o)}const Md={get:Xo(!1,!1)},Hd={get:Xo(!1,!0)},Ld={get:Xo(!0,!1)};const _a=new WeakMap,Aa=new WeakMap,Ia=new WeakMap,Nd=new WeakMap;function Vd(i){switch(i){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function jd(i){return i.__v_skip||!Object.isExtensible(i)?0:Vd(pd(i))}function Zo(i){return Tt(i)?i:Ko(i,!1,Rd,Md,_a)}function zd(i){return Ko(i,!1,Dd,Hd,Aa)}function _o(i){return Ko(i,!0,Pd,Ld,Ia)}function Ko(i,e,t,s,n){if(!ie(i)||i.__v_raw&&!(e&&i.__v_isReactive))return i;const o=jd(i);if(o===0)return i;const r=n.get(i);if(r)return r;const l=new Proxy(i,o===2?s:t);return n.set(i,l),l}function oi(i){return Tt(i)?oi(i.__v_raw):!!(i&&i.__v_isReactive)}function Tt(i){return!!(i&&i.__v_isReadonly)}function qe(i){return!!(i&&i.__v_isShallow)}function er(i){return i?!!i.__v_raw:!1}function Q(i){const e=i&&i.__v_raw;return e?Q(e):i}function Ud(i){return!Y(i,"__v_skip")&&Object.isExtensible(i)&&ua(i,"__v_skip",!0),i}const et=i=>ie(i)?Zo(i):i,Ri=i=>ie(i)?_o(i):i;function me(i){return i?i.__v_isRef===!0:!1}function ut(i){return qd(i,!1)}function qd(i,e){return me(i)?i:new Gd(i,e)}class Gd{constructor(e,t){this.dep=new Jo,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:Q(e),this._value=t?e:et(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){const t=this._rawValue,s=this.__v_isShallow||qe(e)||Tt(e);e=s?e:Q(e),Lt(e,t)&&(this._rawValue=e,this._value=s?e:et(e),this.dep.trigger())}}function Wd(i){return me(i)?i.value:i}const Qd={get:(i,e,t)=>e==="__v_raw"?i:Wd(Reflect.get(i,e,t)),set:(i,e,t,s)=>{const n=i[e];return me(n)&&!me(t)?(n.value=t,!0):Reflect.set(i,e,t,s)}};function Ea(i){return oi(i)?i:new Proxy(i,Qd)}class Yd{constructor(e,t,s){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Jo(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=vs-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=s}notify(){if(this.flags|=16,!(this.flags&8)&&ee!==this)return va(this,!0),!0}get value(){const e=this.dep.track();return $a(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function Jd(i,e,t=!1){let s,n;return H(i)?s=i:(s=i.get,n=i.set),new Yd(s,n,t)}const Us={},hn=new WeakMap;let Kt;function Xd(i,e=!1,t=Kt){if(t){let s=hn.get(t);s||hn.set(t,s=[]),s.push(i)}}function Zd(i,e,t=X){const{immediate:s,deep:n,once:o,scheduler:r,augmentJob:l,call:a}=t,d=E=>n?E:qe(E)||n===!1||n===0?wt(E,1):wt(E);let c,h,g,$,T=!1,R=!1;if(me(i)?(h=()=>i.value,T=qe(i)):oi(i)?(h=()=>d(i),T=!0):M(i)?(R=!0,T=i.some(E=>oi(E)||qe(E)),h=()=>i.map(E=>{if(me(E))return E.value;if(oi(E))return d(E);if(H(E))return a?a(E,2):E()})):H(i)?e?h=a?()=>a(i,2):i:h=()=>{if(g){kt();try{g()}finally{St()}}const E=Kt;Kt=c;try{return a?a(i,3,[$]):i($)}finally{Kt=E}}:h=gt,e&&n){const E=h,N=n===!0?1/0:n;h=()=>wt(E(),N)}const W=kd(),L=()=>{c.stop(),W&&W.active&&zo(W.effects,c)};if(o&&e){const E=e;e=(...N)=>{E(...N),L()}}let z=R?new Array(i.length).fill(Us):Us;const O=E=>{if(!(!(c.flags&1)||!c.dirty&&!E))if(e){const N=c.run();if(n||T||(R?N.some((te,ke)=>Lt(te,z[ke])):Lt(N,z))){g&&g();const te=Kt;Kt=c;try{const ke=[N,z===Us?void 0:R&&z[0]===Us?[]:z,$];z=N,a?a(e,3,ke):e(...ke)}finally{Kt=te}}}else c.run()};return l&&l(O),c=new ba(h),c.scheduler=r?()=>r(O,!1):O,$=E=>Xd(E,!1,c),g=c.onStop=()=>{const E=hn.get(c);if(E){if(a)a(E,4);else for(const N of E)N();hn.delete(c)}},e?s?O(!0):z=c.run():r?r(O.bind(null,!0),!0):c.run(),L.pause=c.pause.bind(c),L.resume=c.resume.bind(c),L.stop=L,L}function wt(i,e=1/0,t){if(e<=0||!ie(i)||i.__v_skip||(t=t||new Map,(t.get(i)||0)>=e))return i;if(t.set(i,e),e--,me(i))wt(i.value,e,t);else if(M(i))for(let s=0;s<i.length;s++)wt(i[s],e,t);else if(aa(i)||Ci(i))i.forEach(s=>{wt(s,e,t)});else if(ha(i)){for(const s in i)wt(i[s],e,t);for(const s of Object.getOwnPropertySymbols(i))Object.prototype.propertyIsEnumerable.call(i,s)&&wt(i[s],e,t)}return i}/**
* @vue/runtime-core v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Os(i,e,t,s){try{return s?i(...s):i()}catch(n){En(n,e,t)}}function bt(i,e,t,s){if(H(i)){const n=Os(i,e,t,s);return n&&ca(n)&&n.catch(o=>{En(o,e,t)}),n}if(M(i)){const n=[];for(let o=0;o<i.length;o++)n.push(bt(i[o],e,t,s));return n}}function En(i,e,t,s=!0){const n=e?e.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:r}=e&&e.appContext.config||X;if(e){let l=e.parent;const a=e.proxy,d=`https://vuejs.org/error-reference/#runtime-${t}`;for(;l;){const c=l.ec;if(c){for(let h=0;h<c.length;h++)if(c[h](i,a,d)===!1)return}l=l.parent}if(o){kt(),Os(o,null,10,[i,a,d]),St();return}}Kd(i,t,n,s,r)}function Kd(i,e,t,s=!0,n=!1){if(n)throw i;console.error(i)}const _e=[];let ft=-1;const ki=[];let Bt=null,bi=0;const Oa=Promise.resolve();let un=null;function eh(i){const e=un||Oa;return i?e.then(this?i.bind(this):i):e}function th(i){let e=ft+1,t=_e.length;for(;e<t;){const s=e+t>>>1,n=_e[s],o=xs(n);o<i||o===i&&n.flags&2?e=s+1:t=s}return e}function tr(i){if(!(i.flags&1)){const e=xs(i),t=_e[_e.length-1];!t||!(i.flags&2)&&e>=xs(t)?_e.push(i):_e.splice(th(e),0,i),i.flags|=1,Ra()}}function Ra(){un||(un=Oa.then(Da))}function ih(i){M(i)?ki.push(...i):Bt&&i.id===-1?Bt.splice(bi+1,0,i):i.flags&1||(ki.push(i),i.flags|=1),Ra()}function Nr(i,e,t=ft+1){for(;t<_e.length;t++){const s=_e[t];if(s&&s.flags&2){if(i&&s.id!==i.uid)continue;_e.splice(t,1),t--,s.flags&4&&(s.flags&=-2),s(),s.flags&4||(s.flags&=-2)}}}function Pa(i){if(ki.length){const e=[...new Set(ki)].sort((t,s)=>xs(t)-xs(s));if(ki.length=0,Bt){Bt.push(...e);return}for(Bt=e,bi=0;bi<Bt.length;bi++){const t=Bt[bi];t.flags&4&&(t.flags&=-2),t.flags&8||t(),t.flags&=-2}Bt=null,bi=0}}const xs=i=>i.id==null?i.flags&2?-1:1/0:i.id;function Da(i){try{for(ft=0;ft<_e.length;ft++){const e=_e[ft];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Os(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;ft<_e.length;ft++){const e=_e[ft];e&&(e.flags&=-2)}ft=-1,_e.length=0,Pa(),un=null,(_e.length||ki.length)&&Da()}}let pe=null,Fa=null;function fn(i){const e=pe;return pe=i,Fa=i&&i.type.__scopeId||null,e}function en(i,e=pe,t){if(!e||i._n)return i;const s=(...n)=>{s._d&&Zr(-1);const o=fn(e);let r;try{r=i(...n)}finally{fn(o),s._d&&Zr(1)}return r};return s._n=!0,s._c=!0,s._d=!0,s}function sh(i,e){if(pe===null)return i;const t=Dn(pe),s=i.dirs||(i.dirs=[]);for(let n=0;n<e.length;n++){let[o,r,l,a=X]=e[n];o&&(H(o)&&(o={mounted:o,updated:o}),o.deep&&wt(r),s.push({dir:o,instance:t,value:r,oldValue:void 0,arg:l,modifiers:a}))}return i}function Yt(i,e,t,s){const n=i.dirs,o=e&&e.dirs;for(let r=0;r<n.length;r++){const l=n[r];o&&(l.oldValue=o[r].value);let a=l.dir[s];a&&(kt(),bt(a,t,8,[i.el,l,i,e]),St())}}const nh=Symbol("_vte"),oh=i=>i.__isTeleport,rh=Symbol("_leaveCb");function ir(i,e){i.shapeFlag&6&&i.component?(i.transition=e,ir(i.component.subTree,e)):i.shapeFlag&128?(i.ssContent.transition=e.clone(i.ssContent),i.ssFallback.transition=e.clone(i.ssFallback)):i.transition=e}function sr(i,e){return H(i)?ye({name:i.name},e,{setup:i}):i}function Ba(i){i.ids=[i.ids[0]+i.ids[2]+++"-",0,0]}const pn=new WeakMap;function as(i,e,t,s,n=!1){if(M(i)){i.forEach((T,R)=>as(T,e&&(M(e)?e[R]:e),t,s,n));return}if(Si(s)&&!n){s.shapeFlag&512&&s.type.__asyncResolved&&s.component.subTree.component&&as(i,e,t,s.component.subTree);return}const o=s.shapeFlag&4?Dn(s.component):s.el,r=n?null:o,{i:l,r:a}=i,d=e&&e.r,c=l.refs===X?l.refs={}:l.refs,h=l.setupState,g=Q(h),$=h===X?la:T=>Y(g,T);if(d!=null&&d!==a){if(Vr(e),de(d))c[d]=null,$(d)&&(h[d]=null);else if(me(d)){d.value=null;const T=e;T.k&&(c[T.k]=null)}}if(H(a))Os(a,l,12,[r,c]);else{const T=de(a),R=me(a);if(T||R){const W=()=>{if(i.f){const L=T?$(a)?h[a]:c[a]:a.value;if(n)M(L)&&zo(L,o);else if(M(L))L.includes(o)||L.push(o);else if(T)c[a]=[o],$(a)&&(h[a]=c[a]);else{const z=[o];a.value=z,i.k&&(c[i.k]=z)}}else T?(c[a]=r,$(a)&&(h[a]=r)):R&&(a.value=r,i.k&&(c[i.k]=r))};if(r){const L=()=>{W(),pn.delete(i)};L.id=-1,pn.set(i,L),Ve(L,t)}else Vr(i),W()}}}function Vr(i){const e=pn.get(i);e&&(e.flags|=8,pn.delete(i))}An().requestIdleCallback;An().cancelIdleCallback;const Si=i=>!!i.type.__asyncLoader,Ma=i=>i.type.__isKeepAlive;function lh(i,e){Ha(i,"a",e)}function ah(i,e){Ha(i,"da",e)}function Ha(i,e,t=be){const s=i.__wdc||(i.__wdc=()=>{let n=t;for(;n;){if(n.isDeactivated)return;n=n.parent}return i()});if(On(e,s,t),t){let n=t.parent;for(;n&&n.parent;)Ma(n.parent.vnode)&&ch(s,e,t,n),n=n.parent}}function ch(i,e,t,s){const n=On(e,i,s,!0);Na(()=>{zo(s[e],n)},t)}function On(i,e,t=be,s=!1){if(t){const n=t[i]||(t[i]=[]),o=e.__weh||(e.__weh=(...r)=>{kt();const l=Rs(t),a=bt(e,t,i,r);return l(),St(),a});return s?n.unshift(o):n.push(o),o}}const Et=i=>(e,t=be)=>{(!ws||i==="sp")&&On(i,(...s)=>e(...s),t)},dh=Et("bm"),nr=Et("m"),hh=Et("bu"),uh=Et("u"),La=Et("bum"),Na=Et("um"),fh=Et("sp"),ph=Et("rtg"),gh=Et("rtc");function bh(i,e=be){On("ec",i,e)}const mh="components";function vh(i,e){return xh(mh,i,!0,e)||i}const yh=Symbol.for("v-ndc");function xh(i,e,t=!0,s=!1){const n=pe||be;if(n){const o=n.type;{const l=fu(o,!1);if(l&&(l===e||l===We(e)||l===_n(We(e))))return o}const r=jr(n[i]||o[i],e)||jr(n.appContext[i],e);return!r&&s?o:r}}function jr(i,e){return i&&(i[e]||i[We(e)]||i[_n(We(e))])}function zr(i,e,t,s){let n;const o=t,r=M(i);if(r||de(i)){const l=r&&oi(i);let a=!1,d=!1;l&&(a=!qe(i),d=Tt(i),i=In(i)),n=new Array(i.length);for(let c=0,h=i.length;c<h;c++)n[c]=e(a?d?Ri(et(i[c])):et(i[c]):i[c],c,void 0,o)}else if(typeof i=="number"){n=new Array(i);for(let l=0;l<i;l++)n[l]=e(l+1,l,void 0,o)}else if(ie(i))if(i[Symbol.iterator])n=Array.from(i,(l,a)=>e(l,a,void 0,o));else{const l=Object.keys(i);n=new Array(l.length);for(let a=0,d=l.length;a<d;a++){const c=l[a];n[a]=e(i[c],c,a,o)}}else n=[];return n}function $h(i,e){for(let t=0;t<e.length;t++){const s=e[t];if(M(s))for(let n=0;n<s.length;n++)i[s[n].name]=s[n].fn;else s&&(i[s.name]=s.key?(...n)=>{const o=s.fn(...n);return o&&(o.key=s.key),o}:s.fn)}return i}function Xn(i,e,t={},s,n){if(pe.ce||pe.parent&&Si(pe.parent)&&pe.parent.ce){const d=Object.keys(t).length>0;return e!=="default"&&(t.name=e),Xe(),bn(Ae,null,[Ge("slot",t,s)],d?-2:64)}let o=i[e];o&&o._c&&(o._d=!1),Xe();const r=o&&Va(o(t)),l=t.key||r&&r.key,a=bn(Ae,{key:(l&&!It(l)?l:`_${e}`)+(!r&&s?"_fb":"")},r||[],r&&i._===1?64:-2);return a.scopeId&&(a.slotScopeIds=[a.scopeId+"-s"]),o&&o._c&&(o._d=!0),a}function Va(i){return i.some(e=>lr(e)?!(e.type===_t||e.type===Ae&&!Va(e.children)):!0)?i:null}const Ao=i=>i?lc(i)?Dn(i):Ao(i.parent):null,cs=ye(Object.create(null),{$:i=>i,$el:i=>i.vnode.el,$data:i=>i.data,$props:i=>i.props,$attrs:i=>i.attrs,$slots:i=>i.slots,$refs:i=>i.refs,$parent:i=>Ao(i.parent),$root:i=>Ao(i.root),$host:i=>i.ce,$emit:i=>i.emit,$options:i=>za(i),$forceUpdate:i=>i.f||(i.f=()=>{tr(i.update)}),$nextTick:i=>i.n||(i.n=eh.bind(i.proxy)),$watch:i=>Ph.bind(i)}),Zn=(i,e)=>i!==X&&!i.__isScriptSetup&&Y(i,e),wh={get({_:i},e){if(e==="__v_skip")return!0;const{ctx:t,setupState:s,data:n,props:o,accessCache:r,type:l,appContext:a}=i;if(e[0]!=="$"){const g=r[e];if(g!==void 0)switch(g){case 1:return s[e];case 2:return n[e];case 4:return t[e];case 3:return o[e]}else{if(Zn(s,e))return r[e]=1,s[e];if(n!==X&&Y(n,e))return r[e]=2,n[e];if(Y(o,e))return r[e]=3,o[e];if(t!==X&&Y(t,e))return r[e]=4,t[e];Io&&(r[e]=0)}}const d=cs[e];let c,h;if(d)return e==="$attrs"&&ge(i.attrs,"get",""),d(i);if((c=l.__cssModules)&&(c=c[e]))return c;if(t!==X&&Y(t,e))return r[e]=4,t[e];if(h=a.config.globalProperties,Y(h,e))return h[e]},set({_:i},e,t){const{data:s,setupState:n,ctx:o}=i;return Zn(n,e)?(n[e]=t,!0):s!==X&&Y(s,e)?(s[e]=t,!0):Y(i.props,e)||e[0]==="$"&&e.slice(1)in i?!1:(o[e]=t,!0)},has({_:{data:i,setupState:e,accessCache:t,ctx:s,appContext:n,props:o,type:r}},l){let a;return!!(t[l]||i!==X&&l[0]!=="$"&&Y(i,l)||Zn(e,l)||Y(o,l)||Y(s,l)||Y(cs,l)||Y(n.config.globalProperties,l)||(a=r.__cssModules)&&a[l])},defineProperty(i,e,t){return t.get!=null?i._.accessCache[e]=0:Y(t,"value")&&this.set(i,e,t.value,null),Reflect.defineProperty(i,e,t)}};function Ur(i){return M(i)?i.reduce((e,t)=>(e[t]=null,e),{}):i}let Io=!0;function Ch(i){const e=za(i),t=i.proxy,s=i.ctx;Io=!1,e.beforeCreate&&qr(e.beforeCreate,i,"bc");const{data:n,computed:o,methods:r,watch:l,provide:a,inject:d,created:c,beforeMount:h,mounted:g,beforeUpdate:$,updated:T,activated:R,deactivated:W,beforeDestroy:L,beforeUnmount:z,destroyed:O,unmounted:E,render:N,renderTracked:te,renderTriggered:ke,errorCaptured:Je,serverPrefetch:mt,expose:ot,inheritAttrs:rt,components:Pt,directives:Ls,filters:Un}=e;if(d&&kh(d,s,null),r)for(const oe in r){const Z=r[oe];H(Z)&&(s[oe]=Z.bind(t))}if(n){const oe=n.call(t,t);ie(oe)&&(i.data=Zo(oe))}if(Io=!0,o)for(const oe in o){const Z=o[oe],Wt=H(Z)?Z.bind(t,t):H(Z.get)?Z.get.bind(t,t):gt,Ns=!H(Z)&&H(Z.set)?Z.set.bind(t):gt,Qt=cc({get:Wt,set:Ns});Object.defineProperty(s,oe,{enumerable:!0,configurable:!0,get:()=>Qt.value,set:lt=>Qt.value=lt})}if(l)for(const oe in l)ja(l[oe],s,t,oe);if(a){const oe=H(a)?a.call(t):a;Reflect.ownKeys(oe).forEach(Z=>{Eh(Z,oe[Z])})}c&&qr(c,i,"c");function Se(oe,Z){M(Z)?Z.forEach(Wt=>oe(Wt.bind(t))):Z&&oe(Z.bind(t))}if(Se(dh,h),Se(nr,g),Se(hh,$),Se(uh,T),Se(lh,R),Se(ah,W),Se(bh,Je),Se(gh,te),Se(ph,ke),Se(La,z),Se(Na,E),Se(fh,mt),M(ot))if(ot.length){const oe=i.exposed||(i.exposed={});ot.forEach(Z=>{Object.defineProperty(oe,Z,{get:()=>t[Z],set:Wt=>t[Z]=Wt,enumerable:!0})})}else i.exposed||(i.exposed={});N&&i.render===gt&&(i.render=N),rt!=null&&(i.inheritAttrs=rt),Pt&&(i.components=Pt),Ls&&(i.directives=Ls),mt&&Ba(i)}function kh(i,e,t=gt){M(i)&&(i=Eo(i));for(const s in i){const n=i[s];let o;ie(n)?"default"in n?o=tn(n.from||s,n.default,!0):o=tn(n.from||s):o=tn(n),me(o)?Object.defineProperty(e,s,{enumerable:!0,configurable:!0,get:()=>o.value,set:r=>o.value=r}):e[s]=o}}function qr(i,e,t){bt(M(i)?i.map(s=>s.bind(e.proxy)):i.bind(e.proxy),e,t)}function ja(i,e,t,s){let n=s.includes(".")?Ga(t,s):()=>t[s];if(de(i)){const o=e[i];H(o)&&sn(n,o)}else if(H(i))sn(n,i.bind(t));else if(ie(i))if(M(i))i.forEach(o=>ja(o,e,t,s));else{const o=H(i.handler)?i.handler.bind(t):e[i.handler];H(o)&&sn(n,o,i)}}function za(i){const e=i.type,{mixins:t,extends:s}=e,{mixins:n,optionsCache:o,config:{optionMergeStrategies:r}}=i.appContext,l=o.get(e);let a;return l?a=l:!n.length&&!t&&!s?a=e:(a={},n.length&&n.forEach(d=>gn(a,d,r,!0)),gn(a,e,r)),ie(e)&&o.set(e,a),a}function gn(i,e,t,s=!1){const{mixins:n,extends:o}=e;o&&gn(i,o,t,!0),n&&n.forEach(r=>gn(i,r,t,!0));for(const r in e)if(!(s&&r==="expose")){const l=Sh[r]||t&&t[r];i[r]=l?l(i[r],e[r]):e[r]}return i}const Sh={data:Gr,props:Wr,emits:Wr,methods:ss,computed:ss,beforeCreate:Te,created:Te,beforeMount:Te,mounted:Te,beforeUpdate:Te,updated:Te,beforeDestroy:Te,beforeUnmount:Te,destroyed:Te,unmounted:Te,activated:Te,deactivated:Te,errorCaptured:Te,serverPrefetch:Te,components:ss,directives:ss,watch:_h,provide:Gr,inject:Th};function Gr(i,e){return e?i?function(){return ye(H(i)?i.call(this,this):i,H(e)?e.call(this,this):e)}:e:i}function Th(i,e){return ss(Eo(i),Eo(e))}function Eo(i){if(M(i)){const e={};for(let t=0;t<i.length;t++)e[i[t]]=i[t];return e}return i}function Te(i,e){return i?[...new Set([].concat(i,e))]:e}function ss(i,e){return i?ye(Object.create(null),i,e):e}function Wr(i,e){return i?M(i)&&M(e)?[...new Set([...i,...e])]:ye(Object.create(null),Ur(i),Ur(e??{})):e}function _h(i,e){if(!i)return e;if(!e)return i;const t=ye(Object.create(null),i);for(const s in e)t[s]=Te(i[s],e[s]);return t}function Ua(){return{app:null,config:{isNativeTag:la,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Ah=0;function Ih(i,e){return function(s,n=null){H(s)||(s=ye({},s)),n!=null&&!ie(n)&&(n=null);const o=Ua(),r=new WeakSet,l=[];let a=!1;const d=o.app={_uid:Ah++,_component:s,_props:n,_container:null,_context:o,_instance:null,version:gu,get config(){return o.config},set config(c){},use(c,...h){return r.has(c)||(c&&H(c.install)?(r.add(c),c.install(d,...h)):H(c)&&(r.add(c),c(d,...h))),d},mixin(c){return o.mixins.includes(c)||o.mixins.push(c),d},component(c,h){return h?(o.components[c]=h,d):o.components[c]},directive(c,h){return h?(o.directives[c]=h,d):o.directives[c]},mount(c,h,g){if(!a){const $=d._ceVNode||Ge(s,n);return $.appContext=o,g===!0?g="svg":g===!1&&(g=void 0),i($,c,g),a=!0,d._container=c,c.__vue_app__=d,Dn($.component)}},onUnmount(c){l.push(c)},unmount(){a&&(bt(l,d._instance,16),i(null,d._container),delete d._container.__vue_app__)},provide(c,h){return o.provides[c]=h,d},runWithContext(c){const h=Ti;Ti=d;try{return c()}finally{Ti=h}}};return d}}let Ti=null;function Eh(i,e){if(be){let t=be.provides;const s=be.parent&&be.parent.provides;s===t&&(t=be.provides=Object.create(s)),t[i]=e}}function tn(i,e,t=!1){const s=au();if(s||Ti){let n=Ti?Ti._context.provides:s?s.parent==null||s.ce?s.vnode.appContext&&s.vnode.appContext.provides:s.parent.provides:void 0;if(n&&i in n)return n[i];if(arguments.length>1)return t&&H(e)?e.call(s&&s.proxy):e}}const Oh=Symbol.for("v-scx"),Rh=()=>tn(Oh);function sn(i,e,t){return qa(i,e,t)}function qa(i,e,t=X){const{immediate:s,deep:n,flush:o,once:r}=t,l=ye({},t),a=e&&s||!e&&o!=="post";let d;if(ws){if(o==="sync"){const $=Rh();d=$.__watcherHandles||($.__watcherHandles=[])}else if(!a){const $=()=>{};return $.stop=gt,$.resume=gt,$.pause=gt,$}}const c=be;l.call=($,T,R)=>bt($,c,T,R);let h=!1;o==="post"?l.scheduler=$=>{Ve($,c&&c.suspense)}:o!=="sync"&&(h=!0,l.scheduler=($,T)=>{T?$():tr($)}),l.augmentJob=$=>{e&&($.flags|=4),h&&($.flags|=2,c&&($.id=c.uid,$.i=c))};const g=Zd(i,e,l);return ws&&(d?d.push(g):a&&g()),g}function Ph(i,e,t){const s=this.proxy,n=de(i)?i.includes(".")?Ga(s,i):()=>s[i]:i.bind(s,s);let o;H(e)?o=e:(o=e.handler,t=e);const r=Rs(this),l=qa(n,o.bind(s),t);return r(),l}function Ga(i,e){const t=e.split(".");return()=>{let s=i;for(let n=0;n<t.length&&s;n++)s=s[t[n]];return s}}const Dh=(i,e)=>e==="modelValue"||e==="model-value"?i.modelModifiers:i[`${e}Modifiers`]||i[`${We(e)}Modifiers`]||i[`${ci(e)}Modifiers`];function Fh(i,e,...t){if(i.isUnmounted)return;const s=i.vnode.props||X;let n=t;const o=e.startsWith("update:"),r=o&&Dh(s,e.slice(7));r&&(r.trim&&(n=t.map(c=>de(c)?c.trim():c)),r.number&&(n=t.map(qo)));let l,a=s[l=Gn(e)]||s[l=Gn(We(e))];!a&&o&&(a=s[l=Gn(ci(e))]),a&&bt(a,i,6,n);const d=s[l+"Once"];if(d){if(!i.emitted)i.emitted={};else if(i.emitted[l])return;i.emitted[l]=!0,bt(d,i,6,n)}}const Bh=new WeakMap;function Wa(i,e,t=!1){const s=t?Bh:e.emitsCache,n=s.get(i);if(n!==void 0)return n;const o=i.emits;let r={},l=!1;if(!H(i)){const a=d=>{const c=Wa(d,e,!0);c&&(l=!0,ye(r,c))};!t&&e.mixins.length&&e.mixins.forEach(a),i.extends&&a(i.extends),i.mixins&&i.mixins.forEach(a)}return!o&&!l?(ie(i)&&s.set(i,null),null):(M(o)?o.forEach(a=>r[a]=null):ye(r,o),ie(i)&&s.set(i,r),r)}function Rn(i,e){return!i||!kn(e)?!1:(e=e.slice(2).replace(/Once$/,""),Y(i,e[0].toLowerCase()+e.slice(1))||Y(i,ci(e))||Y(i,e))}function Qr(i){const{type:e,vnode:t,proxy:s,withProxy:n,propsOptions:[o],slots:r,attrs:l,emit:a,render:d,renderCache:c,props:h,data:g,setupState:$,ctx:T,inheritAttrs:R}=i,W=fn(i);let L,z;try{if(t.shapeFlag&4){const E=n||s,N=E;L=pt(d.call(N,E,c,h,$,g,T)),z=l}else{const E=e;L=pt(E.length>1?E(h,{attrs:l,slots:r,emit:a}):E(h,null)),z=e.props?l:Mh(l)}}catch(E){ds.length=0,En(E,i,1),L=Ge(_t)}let O=L;if(z&&R!==!1){const E=Object.keys(z),{shapeFlag:N}=O;E.length&&N&7&&(o&&E.some(jo)&&(z=Hh(z,o)),O=Pi(O,z,!1,!0))}return t.dirs&&(O=Pi(O,null,!1,!0),O.dirs=O.dirs?O.dirs.concat(t.dirs):t.dirs),t.transition&&ir(O,t.transition),L=O,fn(W),L}const Mh=i=>{let e;for(const t in i)(t==="class"||t==="style"||kn(t))&&((e||(e={}))[t]=i[t]);return e},Hh=(i,e)=>{const t={};for(const s in i)(!jo(s)||!(s.slice(9)in e))&&(t[s]=i[s]);return t};function Lh(i,e,t){const{props:s,children:n,component:o}=i,{props:r,children:l,patchFlag:a}=e,d=o.emitsOptions;if(e.dirs||e.transition)return!0;if(t&&a>=0){if(a&1024)return!0;if(a&16)return s?Yr(s,r,d):!!r;if(a&8){const c=e.dynamicProps;for(let h=0;h<c.length;h++){const g=c[h];if(r[g]!==s[g]&&!Rn(d,g))return!0}}}else return(n||l)&&(!l||!l.$stable)?!0:s===r?!1:s?r?Yr(s,r,d):!0:!!r;return!1}function Yr(i,e,t){const s=Object.keys(e);if(s.length!==Object.keys(i).length)return!0;for(let n=0;n<s.length;n++){const o=s[n];if(e[o]!==i[o]&&!Rn(t,o))return!0}return!1}function Nh({vnode:i,parent:e},t){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===i&&(s.el=i.el),s===i)(i=e.vnode).el=t,e=e.parent;else break}}const Qa={},Ya=()=>Object.create(Qa),Ja=i=>Object.getPrototypeOf(i)===Qa;function Vh(i,e,t,s=!1){const n={},o=Ya();i.propsDefaults=Object.create(null),Xa(i,e,n,o);for(const r in i.propsOptions[0])r in n||(n[r]=void 0);t?i.props=s?n:zd(n):i.type.props?i.props=n:i.props=o,i.attrs=o}function jh(i,e,t,s){const{props:n,attrs:o,vnode:{patchFlag:r}}=i,l=Q(n),[a]=i.propsOptions;let d=!1;if((s||r>0)&&!(r&16)){if(r&8){const c=i.vnode.dynamicProps;for(let h=0;h<c.length;h++){let g=c[h];if(Rn(i.emitsOptions,g))continue;const $=e[g];if(a)if(Y(o,g))$!==o[g]&&(o[g]=$,d=!0);else{const T=We(g);n[T]=Oo(a,l,T,$,i,!1)}else $!==o[g]&&(o[g]=$,d=!0)}}}else{Xa(i,e,n,o)&&(d=!0);let c;for(const h in l)(!e||!Y(e,h)&&((c=ci(h))===h||!Y(e,c)))&&(a?t&&(t[h]!==void 0||t[c]!==void 0)&&(n[h]=Oo(a,l,h,void 0,i,!0)):delete n[h]);if(o!==l)for(const h in o)(!e||!Y(e,h))&&(delete o[h],d=!0)}d&&$t(i.attrs,"set","")}function Xa(i,e,t,s){const[n,o]=i.propsOptions;let r=!1,l;if(e)for(let a in e){if(os(a))continue;const d=e[a];let c;n&&Y(n,c=We(a))?!o||!o.includes(c)?t[c]=d:(l||(l={}))[c]=d:Rn(i.emitsOptions,a)||(!(a in s)||d!==s[a])&&(s[a]=d,r=!0)}if(o){const a=Q(t),d=l||X;for(let c=0;c<o.length;c++){const h=o[c];t[h]=Oo(n,a,h,d[h],i,!Y(d,h))}}return r}function Oo(i,e,t,s,n,o){const r=i[t];if(r!=null){const l=Y(r,"default");if(l&&s===void 0){const a=r.default;if(r.type!==Function&&!r.skipFactory&&H(a)){const{propsDefaults:d}=n;if(t in d)s=d[t];else{const c=Rs(n);s=d[t]=a.call(null,e),c()}}else s=a;n.ce&&n.ce._setProp(t,s)}r[0]&&(o&&!l?s=!1:r[1]&&(s===""||s===ci(t))&&(s=!0))}return s}const zh=new WeakMap;function Za(i,e,t=!1){const s=t?zh:e.propsCache,n=s.get(i);if(n)return n;const o=i.props,r={},l=[];let a=!1;if(!H(i)){const c=h=>{a=!0;const[g,$]=Za(h,e,!0);ye(r,g),$&&l.push(...$)};!t&&e.mixins.length&&e.mixins.forEach(c),i.extends&&c(i.extends),i.mixins&&i.mixins.forEach(c)}if(!o&&!a)return ie(i)&&s.set(i,wi),wi;if(M(o))for(let c=0;c<o.length;c++){const h=We(o[c]);Jr(h)&&(r[h]=X)}else if(o)for(const c in o){const h=We(c);if(Jr(h)){const g=o[c],$=r[h]=M(g)||H(g)?{type:g}:ye({},g),T=$.type;let R=!1,W=!0;if(M(T))for(let L=0;L<T.length;++L){const z=T[L],O=H(z)&&z.name;if(O==="Boolean"){R=!0;break}else O==="String"&&(W=!1)}else R=H(T)&&T.name==="Boolean";$[0]=R,$[1]=W,(R||Y($,"default"))&&l.push(h)}}const d=[r,l];return ie(i)&&s.set(i,d),d}function Jr(i){return i[0]!=="$"&&!os(i)}const or=i=>i==="_"||i==="_ctx"||i==="$stable",rr=i=>M(i)?i.map(pt):[pt(i)],Uh=(i,e,t)=>{if(e._n)return e;const s=en((...n)=>rr(e(...n)),t);return s._c=!1,s},Ka=(i,e,t)=>{const s=i._ctx;for(const n in i){if(or(n))continue;const o=i[n];if(H(o))e[n]=Uh(n,o,s);else if(o!=null){const r=rr(o);e[n]=()=>r}}},ec=(i,e)=>{const t=rr(e);i.slots.default=()=>t},tc=(i,e,t)=>{for(const s in e)(t||!or(s))&&(i[s]=e[s])},qh=(i,e,t)=>{const s=i.slots=Ya();if(i.vnode.shapeFlag&32){const n=e._;n?(tc(s,e,t),t&&ua(s,"_",n,!0)):Ka(e,s)}else e&&ec(i,e)},Gh=(i,e,t)=>{const{vnode:s,slots:n}=i;let o=!0,r=X;if(s.shapeFlag&32){const l=e._;l?t&&l===1?o=!1:tc(n,e,t):(o=!e.$stable,Ka(e,n)),r=e}else e&&(ec(i,e),r={default:1});if(o)for(const l in n)!or(l)&&r[l]==null&&delete n[l]},Ve=Xh;function Wh(i){return Qh(i)}function Qh(i,e){const t=An();t.__VUE__=!0;const{insert:s,remove:n,patchProp:o,createElement:r,createText:l,createComment:a,setText:d,setElementText:c,parentNode:h,nextSibling:g,setScopeId:$=gt,insertStaticContent:T}=i,R=(u,f,b,w=null,v=null,y=null,S=void 0,k=null,C=!!f.dynamicChildren)=>{if(u===f)return;u&&!Ji(u,f)&&(w=Vs(u),lt(u,v,y,!0),u=null),f.patchFlag===-2&&(C=!1,f.dynamicChildren=null);const{type:x,ref:D,shapeFlag:_}=f;switch(x){case Pn:W(u,f,b,w);break;case _t:L(u,f,b,w);break;case nn:u==null&&z(f,b,w,S);break;case Ae:Pt(u,f,b,w,v,y,S,k,C);break;default:_&1?N(u,f,b,w,v,y,S,k,C):_&6?Ls(u,f,b,w,v,y,S,k,C):(_&64||_&128)&&x.process(u,f,b,w,v,y,S,k,C,Wi)}D!=null&&v?as(D,u&&u.ref,y,f||u,!f):D==null&&u&&u.ref!=null&&as(u.ref,null,y,u,!0)},W=(u,f,b,w)=>{if(u==null)s(f.el=l(f.children),b,w);else{const v=f.el=u.el;f.children!==u.children&&d(v,f.children)}},L=(u,f,b,w)=>{u==null?s(f.el=a(f.children||""),b,w):f.el=u.el},z=(u,f,b,w)=>{[u.el,u.anchor]=T(u.children,f,b,w,u.el,u.anchor)},O=({el:u,anchor:f},b,w)=>{let v;for(;u&&u!==f;)v=g(u),s(u,b,w),u=v;s(f,b,w)},E=({el:u,anchor:f})=>{let b;for(;u&&u!==f;)b=g(u),n(u),u=b;n(f)},N=(u,f,b,w,v,y,S,k,C)=>{if(f.type==="svg"?S="svg":f.type==="math"&&(S="mathml"),u==null)te(f,b,w,v,y,S,k,C);else{const x=u.el&&u.el._isVueCE?u.el:null;try{x&&x._beginPatch(),mt(u,f,v,y,S,k,C)}finally{x&&x._endPatch()}}},te=(u,f,b,w,v,y,S,k)=>{let C,x;const{props:D,shapeFlag:_,transition:P,dirs:B}=u;if(C=u.el=r(u.type,y,D&&D.is,D),_&8?c(C,u.children):_&16&&Je(u.children,C,null,w,v,Kn(u,y),S,k),B&&Yt(u,null,w,"created"),ke(C,u,u.scopeId,S,w),D){for(const K in D)K!=="value"&&!os(K)&&o(C,K,null,D[K],y,w);"value"in D&&o(C,"value",null,D.value,y),(x=D.onVnodeBeforeMount)&&ht(x,w,u)}B&&Yt(u,null,w,"beforeMount");const U=Yh(v,P);U&&P.beforeEnter(C),s(C,f,b),((x=D&&D.onVnodeMounted)||U||B)&&Ve(()=>{x&&ht(x,w,u),U&&P.enter(C),B&&Yt(u,null,w,"mounted")},v)},ke=(u,f,b,w,v)=>{if(b&&$(u,b),w)for(let y=0;y<w.length;y++)$(u,w[y]);if(v){let y=v.subTree;if(f===y||nc(y.type)&&(y.ssContent===f||y.ssFallback===f)){const S=v.vnode;ke(u,S,S.scopeId,S.slotScopeIds,v.parent)}}},Je=(u,f,b,w,v,y,S,k,C=0)=>{for(let x=C;x<u.length;x++){const D=u[x]=k?Mt(u[x]):pt(u[x]);R(null,D,f,b,w,v,y,S,k)}},mt=(u,f,b,w,v,y,S)=>{const k=f.el=u.el;let{patchFlag:C,dynamicChildren:x,dirs:D}=f;C|=u.patchFlag&16;const _=u.props||X,P=f.props||X;let B;if(b&&Jt(b,!1),(B=P.onVnodeBeforeUpdate)&&ht(B,b,f,u),D&&Yt(f,u,b,"beforeUpdate"),b&&Jt(b,!0),(_.innerHTML&&P.innerHTML==null||_.textContent&&P.textContent==null)&&c(k,""),x?ot(u.dynamicChildren,x,k,b,w,Kn(f,v),y):S||Z(u,f,k,null,b,w,Kn(f,v),y,!1),C>0){if(C&16)rt(k,_,P,b,v);else if(C&2&&_.class!==P.class&&o(k,"class",null,P.class,v),C&4&&o(k,"style",_.style,P.style,v),C&8){const U=f.dynamicProps;for(let K=0;K<U.length;K++){const J=U[K],De=_[J],Fe=P[J];(Fe!==De||J==="value")&&o(k,J,De,Fe,v,b)}}C&1&&u.children!==f.children&&c(k,f.children)}else!S&&x==null&&rt(k,_,P,b,v);((B=P.onVnodeUpdated)||D)&&Ve(()=>{B&&ht(B,b,f,u),D&&Yt(f,u,b,"updated")},w)},ot=(u,f,b,w,v,y,S)=>{for(let k=0;k<f.length;k++){const C=u[k],x=f[k],D=C.el&&(C.type===Ae||!Ji(C,x)||C.shapeFlag&198)?h(C.el):b;R(C,x,D,null,w,v,y,S,!0)}},rt=(u,f,b,w,v)=>{if(f!==b){if(f!==X)for(const y in f)!os(y)&&!(y in b)&&o(u,y,f[y],null,v,w);for(const y in b){if(os(y))continue;const S=b[y],k=f[y];S!==k&&y!=="value"&&o(u,y,k,S,v,w)}"value"in b&&o(u,"value",f.value,b.value,v)}},Pt=(u,f,b,w,v,y,S,k,C)=>{const x=f.el=u?u.el:l(""),D=f.anchor=u?u.anchor:l("");let{patchFlag:_,dynamicChildren:P,slotScopeIds:B}=f;B&&(k=k?k.concat(B):B),u==null?(s(x,b,w),s(D,b,w),Je(f.children||[],b,D,v,y,S,k,C)):_>0&&_&64&&P&&u.dynamicChildren?(ot(u.dynamicChildren,P,b,v,y,S,k),(f.key!=null||v&&f===v.subTree)&&ic(u,f,!0)):Z(u,f,b,D,v,y,S,k,C)},Ls=(u,f,b,w,v,y,S,k,C)=>{f.slotScopeIds=k,u==null?f.shapeFlag&512?v.ctx.activate(f,b,w,S,C):Un(f,b,w,v,y,S,C):Or(u,f,C)},Un=(u,f,b,w,v,y,S)=>{const k=u.component=lu(u,w,v);if(Ma(u)&&(k.ctx.renderer=Wi),cu(k,!1,S),k.asyncDep){if(v&&v.registerDep(k,Se,S),!u.el){const C=k.subTree=Ge(_t);L(null,C,f,b),u.placeholder=C.el}}else Se(k,u,f,b,v,y,S)},Or=(u,f,b)=>{const w=f.component=u.component;if(Lh(u,f,b))if(w.asyncDep&&!w.asyncResolved){oe(w,f,b);return}else w.next=f,w.update();else f.el=u.el,w.vnode=f},Se=(u,f,b,w,v,y,S)=>{const k=()=>{if(u.isMounted){let{next:_,bu:P,u:B,parent:U,vnode:K}=u;{const ct=sc(u);if(ct){_&&(_.el=K.el,oe(u,_,S)),ct.asyncDep.then(()=>{u.isUnmounted||k()});return}}let J=_,De;Jt(u,!1),_?(_.el=K.el,oe(u,_,S)):_=K,P&&Zs(P),(De=_.props&&_.props.onVnodeBeforeUpdate)&&ht(De,U,_,K),Jt(u,!0);const Fe=Qr(u),at=u.subTree;u.subTree=Fe,R(at,Fe,h(at.el),Vs(at),u,v,y),_.el=Fe.el,J===null&&Nh(u,Fe.el),B&&Ve(B,v),(De=_.props&&_.props.onVnodeUpdated)&&Ve(()=>ht(De,U,_,K),v)}else{let _;const{el:P,props:B}=f,{bm:U,m:K,parent:J,root:De,type:Fe}=u,at=Si(f);Jt(u,!1),U&&Zs(U),!at&&(_=B&&B.onVnodeBeforeMount)&&ht(_,J,f),Jt(u,!0);{De.ce&&De.ce._def.shadowRoot!==!1&&De.ce._injectChildStyle(Fe);const ct=u.subTree=Qr(u);R(null,ct,b,w,u,v,y),f.el=ct.el}if(K&&Ve(K,v),!at&&(_=B&&B.onVnodeMounted)){const ct=f;Ve(()=>ht(_,J,ct),v)}(f.shapeFlag&256||J&&Si(J.vnode)&&J.vnode.shapeFlag&256)&&u.a&&Ve(u.a,v),u.isMounted=!0,f=b=w=null}};u.scope.on();const C=u.effect=new ba(k);u.scope.off();const x=u.update=C.run.bind(C),D=u.job=C.runIfDirty.bind(C);D.i=u,D.id=u.uid,C.scheduler=()=>tr(D),Jt(u,!0),x()},oe=(u,f,b)=>{f.component=u;const w=u.vnode.props;u.vnode=f,u.next=null,jh(u,f.props,w,b),Gh(u,f.children,b),kt(),Nr(u),St()},Z=(u,f,b,w,v,y,S,k,C=!1)=>{const x=u&&u.children,D=u?u.shapeFlag:0,_=f.children,{patchFlag:P,shapeFlag:B}=f;if(P>0){if(P&128){Ns(x,_,b,w,v,y,S,k,C);return}else if(P&256){Wt(x,_,b,w,v,y,S,k,C);return}}B&8?(D&16&&Gi(x,v,y),_!==x&&c(b,_)):D&16?B&16?Ns(x,_,b,w,v,y,S,k,C):Gi(x,v,y,!0):(D&8&&c(b,""),B&16&&Je(_,b,w,v,y,S,k,C))},Wt=(u,f,b,w,v,y,S,k,C)=>{u=u||wi,f=f||wi;const x=u.length,D=f.length,_=Math.min(x,D);let P;for(P=0;P<_;P++){const B=f[P]=C?Mt(f[P]):pt(f[P]);R(u[P],B,b,null,v,y,S,k,C)}x>D?Gi(u,v,y,!0,!1,_):Je(f,b,w,v,y,S,k,C,_)},Ns=(u,f,b,w,v,y,S,k,C)=>{let x=0;const D=f.length;let _=u.length-1,P=D-1;for(;x<=_&&x<=P;){const B=u[x],U=f[x]=C?Mt(f[x]):pt(f[x]);if(Ji(B,U))R(B,U,b,null,v,y,S,k,C);else break;x++}for(;x<=_&&x<=P;){const B=u[_],U=f[P]=C?Mt(f[P]):pt(f[P]);if(Ji(B,U))R(B,U,b,null,v,y,S,k,C);else break;_--,P--}if(x>_){if(x<=P){const B=P+1,U=B<D?f[B].el:w;for(;x<=P;)R(null,f[x]=C?Mt(f[x]):pt(f[x]),b,U,v,y,S,k,C),x++}}else if(x>P)for(;x<=_;)lt(u[x],v,y,!0),x++;else{const B=x,U=x,K=new Map;for(x=U;x<=P;x++){const Ne=f[x]=C?Mt(f[x]):pt(f[x]);Ne.key!=null&&K.set(Ne.key,x)}let J,De=0;const Fe=P-U+1;let at=!1,ct=0;const Qi=new Array(Fe);for(x=0;x<Fe;x++)Qi[x]=0;for(x=B;x<=_;x++){const Ne=u[x];if(De>=Fe){lt(Ne,v,y,!0);continue}let dt;if(Ne.key!=null)dt=K.get(Ne.key);else for(J=U;J<=P;J++)if(Qi[J-U]===0&&Ji(Ne,f[J])){dt=J;break}dt===void 0?lt(Ne,v,y,!0):(Qi[dt-U]=x+1,dt>=ct?ct=dt:at=!0,R(Ne,f[dt],b,null,v,y,S,k,C),De++)}const Dr=at?Jh(Qi):wi;for(J=Dr.length-1,x=Fe-1;x>=0;x--){const Ne=U+x,dt=f[Ne],Fr=f[Ne+1],Br=Ne+1<D?Fr.el||Fr.placeholder:w;Qi[x]===0?R(null,dt,b,Br,v,y,S,k,C):at&&(J<0||x!==Dr[J]?Qt(dt,b,Br,2):J--)}}},Qt=(u,f,b,w,v=null)=>{const{el:y,type:S,transition:k,children:C,shapeFlag:x}=u;if(x&6){Qt(u.component.subTree,f,b,w);return}if(x&128){u.suspense.move(f,b,w);return}if(x&64){S.move(u,f,b,Wi);return}if(S===Ae){s(y,f,b);for(let _=0;_<C.length;_++)Qt(C[_],f,b,w);s(u.anchor,f,b);return}if(S===nn){O(u,f,b);return}if(w!==2&&x&1&&k)if(w===0)k.beforeEnter(y),s(y,f,b),Ve(()=>k.enter(y),v);else{const{leave:_,delayLeave:P,afterLeave:B}=k,U=()=>{u.ctx.isUnmounted?n(y):s(y,f,b)},K=()=>{y._isLeaving&&y[rh](!0),_(y,()=>{U(),B&&B()})};P?P(y,U,K):K()}else s(y,f,b)},lt=(u,f,b,w=!1,v=!1)=>{const{type:y,props:S,ref:k,children:C,dynamicChildren:x,shapeFlag:D,patchFlag:_,dirs:P,cacheIndex:B}=u;if(_===-2&&(v=!1),k!=null&&(kt(),as(k,null,b,u,!0),St()),B!=null&&(f.renderCache[B]=void 0),D&256){f.ctx.deactivate(u);return}const U=D&1&&P,K=!Si(u);let J;if(K&&(J=S&&S.onVnodeBeforeUnmount)&&ht(J,f,u),D&6)ud(u.component,b,w);else{if(D&128){u.suspense.unmount(b,w);return}U&&Yt(u,null,f,"beforeUnmount"),D&64?u.type.remove(u,f,b,Wi,w):x&&!x.hasOnce&&(y!==Ae||_>0&&_&64)?Gi(x,f,b,!1,!0):(y===Ae&&_&384||!v&&D&16)&&Gi(C,f,b),w&&Rr(u)}(K&&(J=S&&S.onVnodeUnmounted)||U)&&Ve(()=>{J&&ht(J,f,u),U&&Yt(u,null,f,"unmounted")},b)},Rr=u=>{const{type:f,el:b,anchor:w,transition:v}=u;if(f===Ae){hd(b,w);return}if(f===nn){E(u);return}const y=()=>{n(b),v&&!v.persisted&&v.afterLeave&&v.afterLeave()};if(u.shapeFlag&1&&v&&!v.persisted){const{leave:S,delayLeave:k}=v,C=()=>S(b,y);k?k(u.el,y,C):C()}else y()},hd=(u,f)=>{let b;for(;u!==f;)b=g(u),n(u),u=b;n(f)},ud=(u,f,b)=>{const{bum:w,scope:v,job:y,subTree:S,um:k,m:C,a:x}=u;Xr(C),Xr(x),w&&Zs(w),v.stop(),y&&(y.flags|=8,lt(S,u,f,b)),k&&Ve(k,f),Ve(()=>{u.isUnmounted=!0},f)},Gi=(u,f,b,w=!1,v=!1,y=0)=>{for(let S=y;S<u.length;S++)lt(u[S],f,b,w,v)},Vs=u=>{if(u.shapeFlag&6)return Vs(u.component.subTree);if(u.shapeFlag&128)return u.suspense.next();const f=g(u.anchor||u.el),b=f&&f[nh];return b?g(b):f};let qn=!1;const Pr=(u,f,b)=>{u==null?f._vnode&&lt(f._vnode,null,null,!0):R(f._vnode||null,u,f,null,null,null,b),f._vnode=u,qn||(qn=!0,Nr(),Pa(),qn=!1)},Wi={p:R,um:lt,m:Qt,r:Rr,mt:Un,mc:Je,pc:Z,pbc:ot,n:Vs,o:i};return{render:Pr,hydrate:void 0,createApp:Ih(Pr)}}function Kn({type:i,props:e},t){return t==="svg"&&i==="foreignObject"||t==="mathml"&&i==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:t}function Jt({effect:i,job:e},t){t?(i.flags|=32,e.flags|=4):(i.flags&=-33,e.flags&=-5)}function Yh(i,e){return(!i||i&&!i.pendingBranch)&&e&&!e.persisted}function ic(i,e,t=!1){const s=i.children,n=e.children;if(M(s)&&M(n))for(let o=0;o<s.length;o++){const r=s[o];let l=n[o];l.shapeFlag&1&&!l.dynamicChildren&&((l.patchFlag<=0||l.patchFlag===32)&&(l=n[o]=Mt(n[o]),l.el=r.el),!t&&l.patchFlag!==-2&&ic(r,l)),l.type===Pn&&l.patchFlag!==-1&&(l.el=r.el),l.type===_t&&!l.el&&(l.el=r.el)}}function Jh(i){const e=i.slice(),t=[0];let s,n,o,r,l;const a=i.length;for(s=0;s<a;s++){const d=i[s];if(d!==0){if(n=t[t.length-1],i[n]<d){e[s]=n,t.push(s);continue}for(o=0,r=t.length-1;o<r;)l=o+r>>1,i[t[l]]<d?o=l+1:r=l;d<i[t[o]]&&(o>0&&(e[s]=t[o-1]),t[o]=s)}}for(o=t.length,r=t[o-1];o-- >0;)t[o]=r,r=e[r];return t}function sc(i){const e=i.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:sc(e)}function Xr(i){if(i)for(let e=0;e<i.length;e++)i[e].flags|=8}const nc=i=>i.__isSuspense;function Xh(i,e){e&&e.pendingBranch?M(i)?e.effects.push(...i):e.effects.push(i):ih(i)}const Ae=Symbol.for("v-fgt"),Pn=Symbol.for("v-txt"),_t=Symbol.for("v-cmt"),nn=Symbol.for("v-stc"),ds=[];let je=null;function Xe(i=!1){ds.push(je=i?null:[])}function Zh(){ds.pop(),je=ds[ds.length-1]||null}let $s=1;function Zr(i,e=!1){$s+=i,i<0&&je&&e&&(je.hasOnce=!0)}function oc(i){return i.dynamicChildren=$s>0?je||wi:null,Zh(),$s>0&&je&&je.push(i),i}function ti(i,e,t,s,n,o){return oc(he(i,e,t,s,n,o,!0))}function bn(i,e,t,s,n){return oc(Ge(i,e,t,s,n,!0))}function lr(i){return i?i.__v_isVNode===!0:!1}function Ji(i,e){return i.type===e.type&&i.key===e.key}const rc=({key:i})=>i??null,on=({ref:i,ref_key:e,ref_for:t})=>(typeof i=="number"&&(i=""+i),i!=null?de(i)||me(i)||H(i)?{i:pe,r:i,k:e,f:!!t}:i:null);function he(i,e=null,t=null,s=0,n=null,o=i===Ae?0:1,r=!1,l=!1){const a={__v_isVNode:!0,__v_skip:!0,type:i,props:e,key:e&&rc(e),ref:e&&on(e),scopeId:Fa,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:s,dynamicProps:n,dynamicChildren:null,appContext:null,ctx:pe};return l?(ar(a,t),o&128&&i.normalize(a)):t&&(a.shapeFlag|=de(t)?8:16),$s>0&&!r&&je&&(a.patchFlag>0||o&6)&&a.patchFlag!==32&&je.push(a),a}const Ge=Kh;function Kh(i,e=null,t=null,s=0,n=null,o=!1){if((!i||i===yh)&&(i=_t),lr(i)){const l=Pi(i,e,!0);return t&&ar(l,t),$s>0&&!o&&je&&(l.shapeFlag&6?je[je.indexOf(i)]=l:je.push(l)),l.patchFlag=-2,l}if(pu(i)&&(i=i.__vccOpts),e){e=eu(e);let{class:l,style:a}=e;l&&!de(l)&&(e.class=Oi(l)),ie(a)&&(er(a)&&!M(a)&&(a=ye({},a)),e.style=Go(a))}const r=de(i)?1:nc(i)?128:oh(i)?64:ie(i)?4:H(i)?2:0;return he(i,e,t,s,n,r,o,!0)}function eu(i){return i?er(i)||Ja(i)?ye({},i):i:null}function Pi(i,e,t=!1,s=!1){const{props:n,ref:o,patchFlag:r,children:l,transition:a}=i,d=e?nu(n||{},e):n,c={__v_isVNode:!0,__v_skip:!0,type:i.type,props:d,key:d&&rc(d),ref:e&&e.ref?t&&o?M(o)?o.concat(on(e)):[o,on(e)]:on(e):o,scopeId:i.scopeId,slotScopeIds:i.slotScopeIds,children:l,target:i.target,targetStart:i.targetStart,targetAnchor:i.targetAnchor,staticCount:i.staticCount,shapeFlag:i.shapeFlag,patchFlag:e&&i.type!==Ae?r===-1?16:r|16:r,dynamicProps:i.dynamicProps,dynamicChildren:i.dynamicChildren,appContext:i.appContext,dirs:i.dirs,transition:a,component:i.component,suspense:i.suspense,ssContent:i.ssContent&&Pi(i.ssContent),ssFallback:i.ssFallback&&Pi(i.ssFallback),placeholder:i.placeholder,el:i.el,anchor:i.anchor,ctx:i.ctx,ce:i.ce};return a&&s&&ir(c,a.clone(c)),c}function tu(i=" ",e=0){return Ge(Pn,null,i,e)}function iu(i,e){const t=Ge(nn,null,i);return t.staticCount=e,t}function su(i="",e=!1){return e?(Xe(),bn(_t,null,i)):Ge(_t,null,i)}function pt(i){return i==null||typeof i=="boolean"?Ge(_t):M(i)?Ge(Ae,null,i.slice()):lr(i)?Mt(i):Ge(Pn,null,String(i))}function Mt(i){return i.el===null&&i.patchFlag!==-1||i.memo?i:Pi(i)}function ar(i,e){let t=0;const{shapeFlag:s}=i;if(e==null)e=null;else if(M(e))t=16;else if(typeof e=="object")if(s&65){const n=e.default;n&&(n._c&&(n._d=!1),ar(i,n()),n._c&&(n._d=!0));return}else{t=32;const n=e._;!n&&!Ja(e)?e._ctx=pe:n===3&&pe&&(pe.slots._===1?e._=1:(e._=2,i.patchFlag|=1024))}else H(e)?(e={default:e,_ctx:pe},t=32):(e=String(e),s&64?(t=16,e=[tu(e)]):t=8);i.children=e,i.shapeFlag|=t}function nu(...i){const e={};for(let t=0;t<i.length;t++){const s=i[t];for(const n in s)if(n==="class")e.class!==s.class&&(e.class=Oi([e.class,s.class]));else if(n==="style")e.style=Go([e.style,s.style]);else if(kn(n)){const o=e[n],r=s[n];r&&o!==r&&!(M(o)&&o.includes(r))&&(e[n]=o?[].concat(o,r):r)}else n!==""&&(e[n]=s[n])}return e}function ht(i,e,t,s=null){bt(i,e,7,[t,s])}const ou=Ua();let ru=0;function lu(i,e,t){const s=i.type,n=(e?e.appContext:i.appContext)||ou,o={uid:ru++,vnode:i,type:s,parent:e,appContext:n,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Cd(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(n.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Za(s,n),emitsOptions:Wa(s,n),emit:null,emitted:null,propsDefaults:X,inheritAttrs:s.inheritAttrs,ctx:X,data:X,props:X,attrs:X,slots:X,refs:X,setupState:X,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=e?e.root:o,o.emit=Fh.bind(null,o),i.ce&&i.ce(o),o}let be=null;const au=()=>be||pe;let mn,Ro;{const i=An(),e=(t,s)=>{let n;return(n=i[t])||(n=i[t]=[]),n.push(s),o=>{n.length>1?n.forEach(r=>r(o)):n[0](o)}};mn=e("__VUE_INSTANCE_SETTERS__",t=>be=t),Ro=e("__VUE_SSR_SETTERS__",t=>ws=t)}const Rs=i=>{const e=be;return mn(i),i.scope.on(),()=>{i.scope.off(),mn(e)}},Kr=()=>{be&&be.scope.off(),mn(null)};function lc(i){return i.vnode.shapeFlag&4}let ws=!1;function cu(i,e=!1,t=!1){e&&Ro(e);const{props:s,children:n}=i.vnode,o=lc(i);Vh(i,s,o,e),qh(i,n,t||e);const r=o?du(i,e):void 0;return e&&Ro(!1),r}function du(i,e){const t=i.type;i.accessCache=Object.create(null),i.proxy=new Proxy(i.ctx,wh);const{setup:s}=t;if(s){kt();const n=i.setupContext=s.length>1?uu(i):null,o=Rs(i),r=Os(s,i,0,[i.props,n]),l=ca(r);if(St(),o(),(l||i.sp)&&!Si(i)&&Ba(i),l){if(r.then(Kr,Kr),e)return r.then(a=>{el(i,a)}).catch(a=>{En(a,i,0)});i.asyncDep=r}else el(i,r)}else ac(i)}function el(i,e,t){H(e)?i.type.__ssrInlineRender?i.ssrRender=e:i.render=e:ie(e)&&(i.setupState=Ea(e)),ac(i)}function ac(i,e,t){const s=i.type;i.render||(i.render=s.render||gt);{const n=Rs(i);kt();try{Ch(i)}finally{St(),n()}}}const hu={get(i,e){return ge(i,"get",""),i[e]}};function uu(i){const e=t=>{i.exposed=t||{}};return{attrs:new Proxy(i.attrs,hu),slots:i.slots,emit:i.emit,expose:e}}function Dn(i){return i.exposed?i.exposeProxy||(i.exposeProxy=new Proxy(Ea(Ud(i.exposed)),{get(e,t){if(t in e)return e[t];if(t in cs)return cs[t](i)},has(e,t){return t in e||t in cs}})):i.proxy}function fu(i,e=!0){return H(i)?i.displayName||i.name:i.name||e&&i.__name}function pu(i){return H(i)&&"__vccOpts"in i}const cc=(i,e)=>Jd(i,e,ws),gu="3.5.25";/**
* @vue/runtime-dom v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Po;const tl=typeof window<"u"&&window.trustedTypes;if(tl)try{Po=tl.createPolicy("vue",{createHTML:i=>i})}catch{}const dc=Po?i=>Po.createHTML(i):i=>i,bu="http://www.w3.org/2000/svg",mu="http://www.w3.org/1998/Math/MathML",yt=typeof document<"u"?document:null,il=yt&&yt.createElement("template"),vu={insert:(i,e,t)=>{e.insertBefore(i,t||null)},remove:i=>{const e=i.parentNode;e&&e.removeChild(i)},createElement:(i,e,t,s)=>{const n=e==="svg"?yt.createElementNS(bu,i):e==="mathml"?yt.createElementNS(mu,i):t?yt.createElement(i,{is:t}):yt.createElement(i);return i==="select"&&s&&s.multiple!=null&&n.setAttribute("multiple",s.multiple),n},createText:i=>yt.createTextNode(i),createComment:i=>yt.createComment(i),setText:(i,e)=>{i.nodeValue=e},setElementText:(i,e)=>{i.textContent=e},parentNode:i=>i.parentNode,nextSibling:i=>i.nextSibling,querySelector:i=>yt.querySelector(i),setScopeId(i,e){i.setAttribute(e,"")},insertStaticContent(i,e,t,s,n,o){const r=t?t.previousSibling:e.lastChild;if(n&&(n===o||n.nextSibling))for(;e.insertBefore(n.cloneNode(!0),t),!(n===o||!(n=n.nextSibling)););else{il.innerHTML=dc(s==="svg"?`<svg>${i}</svg>`:s==="mathml"?`<math>${i}</math>`:i);const l=il.content;if(s==="svg"||s==="mathml"){const a=l.firstChild;for(;a.firstChild;)l.appendChild(a.firstChild);l.removeChild(a)}e.insertBefore(l,t)}return[r?r.nextSibling:e.firstChild,t?t.previousSibling:e.lastChild]}},yu=Symbol("_vtc");function xu(i,e,t){const s=i[yu];s&&(e=(e?[e,...s]:[...s]).join(" ")),e==null?i.removeAttribute("class"):t?i.setAttribute("class",e):i.className=e}const sl=Symbol("_vod"),$u=Symbol("_vsh"),wu=Symbol(""),Cu=/(?:^|;)\s*display\s*:/;function ku(i,e,t){const s=i.style,n=de(t);let o=!1;if(t&&!n){if(e)if(de(e))for(const r of e.split(";")){const l=r.slice(0,r.indexOf(":")).trim();t[l]==null&&rn(s,l,"")}else for(const r in e)t[r]==null&&rn(s,r,"");for(const r in t)r==="display"&&(o=!0),rn(s,r,t[r])}else if(n){if(e!==t){const r=s[wu];r&&(t+=";"+r),s.cssText=t,o=Cu.test(t)}}else e&&i.removeAttribute("style");sl in i&&(i[sl]=o?s.display:"",i[$u]&&(s.display="none"))}const nl=/\s*!important$/;function rn(i,e,t){if(M(t))t.forEach(s=>rn(i,e,s));else if(t==null&&(t=""),e.startsWith("--"))i.setProperty(e,t);else{const s=Su(i,e);nl.test(t)?i.setProperty(ci(s),t.replace(nl,""),"important"):i[s]=t}}const ol=["Webkit","Moz","ms"],eo={};function Su(i,e){const t=eo[e];if(t)return t;let s=We(e);if(s!=="filter"&&s in i)return eo[e]=s;s=_n(s);for(let n=0;n<ol.length;n++){const o=ol[n]+s;if(o in i)return eo[e]=o}return e}const rl="http://www.w3.org/1999/xlink";function ll(i,e,t,s,n,o=wd(e)){s&&e.startsWith("xlink:")?t==null?i.removeAttributeNS(rl,e.slice(6,e.length)):i.setAttributeNS(rl,e,t):t==null||o&&!fa(t)?i.removeAttribute(e):i.setAttribute(e,o?"":It(t)?String(t):t)}function al(i,e,t,s,n){if(e==="innerHTML"||e==="textContent"){t!=null&&(i[e]=e==="innerHTML"?dc(t):t);return}const o=i.tagName;if(e==="value"&&o!=="PROGRESS"&&!o.includes("-")){const l=o==="OPTION"?i.getAttribute("value")||"":i.value,a=t==null?i.type==="checkbox"?"on":"":String(t);(l!==a||!("_value"in i))&&(i.value=a),t==null&&i.removeAttribute(e),i._value=t;return}let r=!1;if(t===""||t==null){const l=typeof i[e];l==="boolean"?t=fa(t):t==null&&l==="string"?(t="",r=!0):l==="number"&&(t=0,r=!0)}try{i[e]=t}catch{}r&&i.removeAttribute(n||e)}function mi(i,e,t,s){i.addEventListener(e,t,s)}function Tu(i,e,t,s){i.removeEventListener(e,t,s)}const cl=Symbol("_vei");function _u(i,e,t,s,n=null){const o=i[cl]||(i[cl]={}),r=o[e];if(s&&r)r.value=s;else{const[l,a]=Au(e);if(s){const d=o[e]=Ou(s,n);mi(i,l,d,a)}else r&&(Tu(i,l,r,a),o[e]=void 0)}}const dl=/(?:Once|Passive|Capture)$/;function Au(i){let e;if(dl.test(i)){e={};let s;for(;s=i.match(dl);)i=i.slice(0,i.length-s[0].length),e[s[0].toLowerCase()]=!0}return[i[2]===":"?i.slice(3):ci(i.slice(2)),e]}let to=0;const Iu=Promise.resolve(),Eu=()=>to||(Iu.then(()=>to=0),to=Date.now());function Ou(i,e){const t=s=>{if(!s._vts)s._vts=Date.now();else if(s._vts<=t.attached)return;bt(Ru(s,t.value),e,5,[s])};return t.value=i,t.attached=Eu(),t}function Ru(i,e){if(M(e)){const t=i.stopImmediatePropagation;return i.stopImmediatePropagation=()=>{t.call(i),i._stopped=!0},e.map(s=>n=>!n._stopped&&s&&s(n))}else return e}const hl=i=>i.charCodeAt(0)===111&&i.charCodeAt(1)===110&&i.charCodeAt(2)>96&&i.charCodeAt(2)<123,Pu=(i,e,t,s,n,o)=>{const r=n==="svg";e==="class"?xu(i,s,r):e==="style"?ku(i,t,s):kn(e)?jo(e)||_u(i,e,t,s,o):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Du(i,e,s,r))?(al(i,e,s),!i.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&ll(i,e,s,r,o,e!=="value")):i._isVueCE&&(/[A-Z]/.test(e)||!de(s))?al(i,We(e),s,o,e):(e==="true-value"?i._trueValue=s:e==="false-value"&&(i._falseValue=s),ll(i,e,s,r))};function Du(i,e,t,s){if(s)return!!(e==="innerHTML"||e==="textContent"||e in i&&hl(e)&&H(t));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&i.tagName==="IFRAME"||e==="form"||e==="list"&&i.tagName==="INPUT"||e==="type"&&i.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const n=i.tagName;if(n==="IMG"||n==="VIDEO"||n==="CANVAS"||n==="SOURCE")return!1}return hl(e)&&de(t)?!1:e in i}const ul=i=>{const e=i.props["onUpdate:modelValue"]||!1;return M(e)?t=>Zs(e,t):e};function Fu(i){i.target.composing=!0}function fl(i){const e=i.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const io=Symbol("_assign");function pl(i,e,t){return e&&(i=i.trim()),t&&(i=qo(i)),i}const Bu={created(i,{modifiers:{lazy:e,trim:t,number:s}},n){i[io]=ul(n);const o=s||n.props&&n.props.type==="number";mi(i,e?"change":"input",r=>{r.target.composing||i[io](pl(i.value,t,o))}),(t||o)&&mi(i,"change",()=>{i.value=pl(i.value,t,o)}),e||(mi(i,"compositionstart",Fu),mi(i,"compositionend",fl),mi(i,"change",fl))},mounted(i,{value:e}){i.value=e??""},beforeUpdate(i,{value:e,oldValue:t,modifiers:{lazy:s,trim:n,number:o}},r){if(i[io]=ul(r),i.composing)return;const l=(o||i.type==="number")&&!/^0\d/.test(i.value)?qo(i.value):i.value,a=e??"";l!==a&&(document.activeElement===i&&i.type!=="range"&&(s&&e===t||n&&i.value.trim()===a)||(i.value=a))}},Mu=["ctrl","shift","alt","meta"],Hu={stop:i=>i.stopPropagation(),prevent:i=>i.preventDefault(),self:i=>i.target!==i.currentTarget,ctrl:i=>!i.ctrlKey,shift:i=>!i.shiftKey,alt:i=>!i.altKey,meta:i=>!i.metaKey,left:i=>"button"in i&&i.button!==0,middle:i=>"button"in i&&i.button!==1,right:i=>"button"in i&&i.button!==2,exact:(i,e)=>Mu.some(t=>i[`${t}Key`]&&!e.includes(t))},Lu=(i,e)=>{const t=i._withMods||(i._withMods={}),s=e.join(".");return t[s]||(t[s]=((n,...o)=>{for(let r=0;r<e.length;r++){const l=Hu[e[r]];if(l&&l(n,e))return}return i(n,...o)}))},Nu=ye({patchProp:Pu},vu);let gl;function Vu(){return gl||(gl=Wh(Nu))}const ju=((...i)=>{const e=Vu().createApp(...i),{mount:t}=e;return e.mount=s=>{const n=Uu(s);if(!n)return;const o=e._component;!H(o)&&!o.render&&!o.template&&(o.template=n.innerHTML),n.nodeType===1&&(n.textContent="");const r=t(n,!1,zu(n));return n instanceof Element&&(n.removeAttribute("v-cloak"),n.setAttribute("data-v-app","")),r},e});function zu(i){if(i instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&i instanceof MathMLElement)return"mathml"}function Uu(i){return de(i)?document.querySelector(i):i}const cr=(i,e)=>{const t=i.__vccOpts||i;for(const[s,n]of e)t[s]=n;return t},qu=sr({name:"ToggleQuickPickOption",props:{selected:{type:Boolean,default:!1},checked:{type:Boolean,default:!1},bold:{type:Boolean,default:!1},isServer:{type:Boolean,default:!1}},emits:["toggle"],setup(i,{emit:e}){const t=ut(null);return sn(()=>i.checked,o=>{t.value&&(t.value.checked=o)}),{checkboxRef:t,toggleCheckbox:()=>{e("toggle",!i.checked)},handleCheckboxChange:o=>{o.stopPropagation(),e("toggle",o.target.checked)}}}}),Gu=["checked"],Wu={class:"quick-pick-option-content"},Qu={class:"option-description"},Yu={class:"quick-pick-option-metadata"},Ju={key:0,appearance:"icon"};function Xu(i,e,t,s,n,o){return Xe(),ti("section",{class:Oi(["quick-pick-option",{selected:i.selected,"server-option":i.isServer}]),onClick:e[2]||(e[2]=(...r)=>i.toggleCheckbox&&i.toggleCheckbox(...r))},[he("vscode-checkbox",{ref:"checkboxRef",checked:i.checked,onClick:e[0]||(e[0]=Lu(()=>{},["stop"])),onChange:e[1]||(e[1]=(...r)=>i.handleCheckboxChange&&i.handleCheckboxChange(...r))},null,40,Gu),he("div",Wu,[he("div",{class:Oi(["option-label",{bold:i.bold}])},[Xn(i.$slots,"default")],2),he("div",Qu,[Xn(i.$slots,"description")])]),he("div",Yu,[Xn(i.$slots,"metadata"),i.isServer&&i.selected?(Xe(),ti("vscode-button",Ju,[...e[3]||(e[3]=[he("vscode-icon",{name:"settings-gear"},null,-1)])])):su("",!0)])],2)}const Zu=cr(qu,[["render",Xu]]),Ku=sr({name:"QuickPick",components:{ToggleQuickPickOption:Zu},setup(){const i=ut(0),e=ut(!0),t=ut(null),s=ut(null),n=ut(null),o=ut(null),r=ut([{name:"filesystem",options:[{label:"MCP Server: filesystem",description:"",metadata:"from claude_desktop_config.json",checked:!0,bold:!0},{label:"read_file",description:"Read the complete contents of a file from the file system.",checked:!0},{label:"read_multiple_file",description:"Read the complete contents of multiple files simultaneously.",checked:!0},{label:"write_file",description:"Create a new file or completely overwrite an existing file with new content.",checked:!0},{label:"edit_file",description:"Make line based edits to a file.",checked:!0},{label:"create_directory",description:"Create a new directory or ensure a directory exists.",checked:!0},{label:"list_directory",description:"Get a detailed list of all files and directories in a specified path.",checked:!0}]},{name:"cloudflare",options:[{label:"MCP Server: cloudflare",description:"",metadata:"from .cursor/mcp.json",checked:!0,bold:!0},{label:"r2_list_buckets",description:"List all R2 buckets in your account.",checked:!0},{label:"r2_create_bucket",description:"Create a new R2 bucket.",checked:!0},{label:"r2_delete_bucket",description:"Delete an R2 bucket.",checked:!0}]},{name:"Azure",options:[{label:"GitHub Copilot for Azure",description:"",metadata:"from extension",checked:!0,bold:!0},{label:"cost",description:"Provide detailed cost analysis for Azure services.",checked:!0},{label:"resource",description:"Get detailed information about a specific Azure resource.",checked:!0},{label:"subscription",description:"Get detailed information about a specific Azure subscription.",checked:!0},{label:"resource_group",description:"Get detailed information about a specific Azure resource group.",checked:!0},{label:"location",description:"Get detailed information about a specific Azure location.",checked:!0},{label:"service",description:"Get detailed information about a specific Azure service.",checked:!0}]}]),l=cc(()=>r.value.every(O=>O.options.every(E=>E.checked))),a=O=>r.value[O].options.slice(1).every(N=>N.checked),d=O=>{r.value.forEach(E=>{E.options.forEach(N=>{N.checked=O})}),h()},c=ut([]),h=()=>{const O=[];r.value.forEach(E=>{E.options.forEach(N=>{O.push({...N,groupName:E.name})})}),c.value=O};h();const g=(O,E)=>{const N=r.value[O];for(let te=1;te<N.options.length;te++)N.options[te].checked=E},$=(O,E,N)=>{const te=r.value[O].options[E];if(te.checked,te.checked=N,E===0)g(O,N);else{const ke=a(O);r.value[O].options[0].checked=ke}h(),o.value&&(o.value.checked=l.value)},T=O=>{n.value&&!n.value.contains(O.target)&&R()},R=()=>{n.value&&(n.value.focus(),n.value.blur()),e.value=!1,i.value=-1},W=O=>{var E,N,te,ke;if(O.key==="Escape"){O.preventDefault(),R();return}if(O.key==="ArrowDown")O.preventDefault(),e.value?(e.value=!1,i.value=0,(E=t.value)==null||E.blur()):i.value===c.value.length-1?(e.value=!0,(N=t.value)==null||N.focus()):i.value++;else if(O.key==="ArrowUp")O.preventDefault(),e.value?(e.value=!1,i.value=c.value.length-1,(te=t.value)==null||te.blur()):i.value===0?(e.value=!0,(ke=t.value)==null||ke.focus()):i.value--;else if(O.key===" "&&!e.value&&i.value>=0){O.preventDefault();let Je=c.value[i.value];for(let mt=0;mt<r.value.length;mt++){const ot=r.value[mt];for(let rt=0;rt<ot.options.length;rt++){const Pt=ot.options[rt];if(Pt.label===Je.label&&Pt.description===Je.description){$(mt,rt,!Pt.checked);return}}}}},L=()=>{e.value=!0},z=O=>{O.target===s.value&&O.preventDefault()};return nr(()=>{document.addEventListener("keydown",W),document.addEventListener("mousedown",T),setTimeout(()=>{var O;(O=t.value)==null||O.focus(),o.value&&(o.value.checked=l.value)},0)}),La(()=>{document.removeEventListener("keydown",W),document.removeEventListener("mousedown",T)}),{selectedIndex:i,optionGroups:r,flattenedOptions:c,isTextFieldFocused:e,textFieldRef:t,optionsContainerRef:s,quickPickRef:n,headerCheckboxRef:o,handleTextFieldFocus:L,handleContainerClick:z,toggleOption:$,toggleAllOptions:d,allOptionsChecked:l}}}),ef={class:"quick-pick",ref:"quickPickRef"},tf={class:"quick-pick-header"};function sf(i,e,t,s,n,o){const r=vh("ToggleQuickPickOption");return Xe(),ti("section",ef,[he("div",tf,[sh(he("vscode-checkbox",{ref:"headerCheckboxRef","onUpdate:modelValue":e[0]||(e[0]=l=>i.allOptionsChecked=l),onClick:e[1]||(e[1]=l=>i.toggleAllOptions(!i.allOptionsChecked))},null,512),[[Bu,i.allOptionsChecked]]),he("vscode-text-field",{ref:"textFieldRef",placeholder:"Select tools that are available to chat",onFocus:e[2]||(e[2]=(...l)=>i.handleTextFieldFocus&&i.handleTextFieldFocus(...l))},null,544),e[4]||(e[4]=he("vscode-button",null,"OK",-1))]),he("div",{class:"quick-pick-options",ref:"optionsContainerRef",onClick:e[3]||(e[3]=(...l)=>i.handleContainerClick&&i.handleContainerClick(...l))},[(Xe(!0),ti(Ae,null,zr(i.optionGroups,(l,a)=>(Xe(),ti("div",{key:a,class:"option-group"},[(Xe(!0),ti(Ae,null,zr(l.options,(d,c)=>(Xe(),bn(r,{key:c,selected:!i.isTextFieldFocused&&i.flattenedOptions.findIndex(h=>h.label===d.label&&h.description===d.description)===i.selectedIndex,checked:d.checked,bold:d.bold,"is-server":c===0,class:Oi({"indented-option":c>0}),onToggle:h=>i.toggleOption(a,c,h)},$h({description:en(()=>[he("span",null,Ks(d.description),1)]),default:en(()=>[he("span",null,Ks(d.label),1)]),_:2},[d.metadata?{name:"metadata",fn:en(()=>[he("span",null,Ks(d.metadata),1)]),key:"0"}:void 0]),1032,["selected","checked","bold","is-server","class","onToggle"]))),128))]))),128))],512)],512)}const nf=cr(Ku,[["render",sf]]);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ln=globalThis,dr=ln.ShadowRoot&&(ln.ShadyCSS===void 0||ln.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,hr=Symbol(),bl=new WeakMap;let hc=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==hr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(dr&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=bl.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&bl.set(t,e))}return e}toString(){return this.cssText}};const of=i=>new hc(typeof i=="string"?i:i+"",void 0,hr),uc=(i,...e)=>{const t=i.length===1?i[0]:e.reduce(((s,n,o)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1]),i[0]);return new hc(t,i,hr)},rf=(i,e)=>{if(dr)i.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const t of e){const s=document.createElement("style"),n=ln.litNonce;n!==void 0&&s.setAttribute("nonce",n),s.textContent=t.cssText,i.appendChild(s)}},ml=dr?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return of(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:lf,defineProperty:af,getOwnPropertyDescriptor:cf,getOwnPropertyNames:df,getOwnPropertySymbols:hf,getPrototypeOf:uf}=Object,Nt=globalThis,vl=Nt.trustedTypes,ff=vl?vl.emptyScript:"",so=Nt.reactiveElementPolyfillSupport,hs=(i,e)=>i,vn={toAttribute(i,e){switch(e){case Boolean:i=i?ff:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},ur=(i,e)=>!lf(i,e),yl={attribute:!0,type:String,converter:vn,reflect:!1,useDefault:!1,hasChanged:ur};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Nt.litPropertyMetadata??(Nt.litPropertyMetadata=new WeakMap);let vi=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=yl){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),n=this.getPropertyDescriptor(e,s,t);n!==void 0&&af(this.prototype,e,n)}}static getPropertyDescriptor(e,t,s){const{get:n,set:o}=cf(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:n,set(r){const l=n==null?void 0:n.call(this);o==null||o.call(this,r),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??yl}static _$Ei(){if(this.hasOwnProperty(hs("elementProperties")))return;const e=uf(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(hs("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(hs("properties"))){const t=this.properties,s=[...df(t),...hf(t)];for(const n of s)this.createProperty(n,t[n])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,n]of t)this.elementProperties.set(s,n)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const n=this._$Eu(t,s);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const n of s)t.unshift(ml(n))}else e!==void 0&&t.push(ml(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach((t=>t(this)))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rf(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach((t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach((t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)}))}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var o;const s=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,s);if(n!==void 0&&s.reflect===!0){const r=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:vn).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){var o,r;const s=this.constructor,n=s._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const l=s.getPropertyOptions(n),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:vn;this._$Em=n;const d=a.fromAttribute(t,l.type);this[n]=d??((r=this._$Ej)==null?void 0:r.get(n))??d,this._$Em=null}}requestUpdate(e,t,s){var n;if(e!==void 0){const o=this.constructor,r=this[e];if(s??(s=o.getPropertyOptions(e)),!((s.hasChanged??ur)(r,t)||s.useDefault&&s.reflect&&r===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:n,wrapped:o},r){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,r??t??this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,r]of this._$Ep)this[o]=r;this._$Ep=void 0}const n=this.constructor.elementProperties;if(n.size>0)for(const[o,r]of n){const{wrapped:l}=r,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,r,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach((n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)})),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach((s=>{var n;return(n=s.hostUpdated)==null?void 0:n.call(s)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach((t=>this._$ET(t,this[t])))),this._$EM()}updated(e){}firstUpdated(e){}};vi.elementStyles=[],vi.shadowRootOptions={mode:"open"},vi[hs("elementProperties")]=new Map,vi[hs("finalized")]=new Map,so==null||so({ReactiveElement:vi}),(Nt.reactiveElementVersions??(Nt.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const us=globalThis,yn=us.trustedTypes,xl=yn?yn.createPolicy("lit-html",{createHTML:i=>i}):void 0,fc="$lit$",Ht=`lit$${Math.random().toFixed(9).slice(2)}$`,pc="?"+Ht,pf=`<${pc}>`,ai=document,Cs=()=>ai.createComment(""),ks=i=>i===null||typeof i!="object"&&typeof i!="function",fr=Array.isArray,gf=i=>fr(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",no=`[ 	
\f\r]`,Xi=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$l=/-->/g,wl=/>/g,Xt=RegExp(`>|${no}(?:([^\\s"'>=/]+)(${no}*=${no}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Cl=/'/g,kl=/"/g,gc=/^(?:script|style|textarea|title)$/i,bf=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),qs=bf(1),At=Symbol.for("lit-noChange"),ue=Symbol.for("lit-nothing"),Sl=new WeakMap,ii=ai.createTreeWalker(ai,129);function bc(i,e){if(!fr(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return xl!==void 0?xl.createHTML(e):e}const mf=(i,e)=>{const t=i.length-1,s=[];let n,o=e===2?"<svg>":e===3?"<math>":"",r=Xi;for(let l=0;l<t;l++){const a=i[l];let d,c,h=-1,g=0;for(;g<a.length&&(r.lastIndex=g,c=r.exec(a),c!==null);)g=r.lastIndex,r===Xi?c[1]==="!--"?r=$l:c[1]!==void 0?r=wl:c[2]!==void 0?(gc.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=Xt):c[3]!==void 0&&(r=Xt):r===Xt?c[0]===">"?(r=n??Xi,h=-1):c[1]===void 0?h=-2:(h=r.lastIndex-c[2].length,d=c[1],r=c[3]===void 0?Xt:c[3]==='"'?kl:Cl):r===kl||r===Cl?r=Xt:r===$l||r===wl?r=Xi:(r=Xt,n=void 0);const $=r===Xt&&i[l+1].startsWith("/>")?" ":"";o+=r===Xi?a+pf:h>=0?(s.push(d),a.slice(0,h)+fc+a.slice(h)+Ht+$):a+Ht+(h===-2?l:$)}return[bc(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class Ss{constructor({strings:e,_$litType$:t},s){let n;this.parts=[];let o=0,r=0;const l=e.length-1,a=this.parts,[d,c]=mf(e,t);if(this.el=Ss.createElement(d,s),ii.currentNode=this.el.content,t===2||t===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(n=ii.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(const h of n.getAttributeNames())if(h.endsWith(fc)){const g=c[r++],$=n.getAttribute(h).split(Ht),T=/([.?@])?(.*)/.exec(g);a.push({type:1,index:o,name:T[2],strings:$,ctor:T[1]==="."?yf:T[1]==="?"?xf:T[1]==="@"?$f:Fn}),n.removeAttribute(h)}else h.startsWith(Ht)&&(a.push({type:6,index:o}),n.removeAttribute(h));if(gc.test(n.tagName)){const h=n.textContent.split(Ht),g=h.length-1;if(g>0){n.textContent=yn?yn.emptyScript:"";for(let $=0;$<g;$++)n.append(h[$],Cs()),ii.nextNode(),a.push({type:2,index:++o});n.append(h[g],Cs())}}}else if(n.nodeType===8)if(n.data===pc)a.push({type:2,index:o});else{let h=-1;for(;(h=n.data.indexOf(Ht,h+1))!==-1;)a.push({type:7,index:o}),h+=Ht.length-1}o++}}static createElement(e,t){const s=ai.createElement("template");return s.innerHTML=e,s}}function Di(i,e,t=i,s){var r,l;if(e===At)return e;let n=s!==void 0?(r=t._$Co)==null?void 0:r[s]:t._$Cl;const o=ks(e)?void 0:e._$litDirective$;return(n==null?void 0:n.constructor)!==o&&((l=n==null?void 0:n._$AO)==null||l.call(n,!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=n:t._$Cl=n),n!==void 0&&(e=Di(i,n._$AS(i,e.values),n,s)),e}class vf{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,n=((e==null?void 0:e.creationScope)??ai).importNode(t,!0);ii.currentNode=n;let o=ii.nextNode(),r=0,l=0,a=s[0];for(;a!==void 0;){if(r===a.index){let d;a.type===2?d=new Ps(o,o.nextSibling,this,e):a.type===1?d=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(d=new wf(o,this,e)),this._$AV.push(d),a=s[++l]}r!==(a==null?void 0:a.index)&&(o=ii.nextNode(),r++)}return ii.currentNode=ai,n}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Ps{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,n){this.type=2,this._$AH=ue,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=n,this._$Cv=(n==null?void 0:n.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Di(this,e,t),ks(e)?e===ue||e==null||e===""?(this._$AH!==ue&&this._$AR(),this._$AH=ue):e!==this._$AH&&e!==At&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):gf(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==ue&&ks(this._$AH)?this._$AA.nextSibling.data=e:this.T(ai.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:s}=e,n=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Ss.createElement(bc(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===n)this._$AH.p(t);else{const r=new vf(n,this),l=r.u(this.options);r.p(t),this.T(l),this._$AH=r}}_$AC(e){let t=Sl.get(e.strings);return t===void 0&&Sl.set(e.strings,t=new Ss(e)),t}k(e){fr(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,n=0;for(const o of e)n===t.length?t.push(s=new Ps(this.O(Cs()),this.O(Cs()),this,this.options)):s=t[n],s._$AI(o),n++;n<t.length&&(this._$AR(s&&s._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){const n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class Fn{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,n,o){this.type=1,this._$AH=ue,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=ue}_$AI(e,t=this,s,n){const o=this.strings;let r=!1;if(o===void 0)e=Di(this,e,t,0),r=!ks(e)||e!==this._$AH&&e!==At,r&&(this._$AH=e);else{const l=e;let a,d;for(e=o[0],a=0;a<o.length-1;a++)d=Di(this,l[s+a],t,a),d===At&&(d=this._$AH[a]),r||(r=!ks(d)||d!==this._$AH[a]),d===ue?e=ue:e!==ue&&(e+=(d??"")+o[a+1]),this._$AH[a]=d}r&&!n&&this.j(e)}j(e){e===ue?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class yf extends Fn{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===ue?void 0:e}}class xf extends Fn{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==ue)}}class $f extends Fn{constructor(e,t,s,n,o){super(e,t,s,n,o),this.type=5}_$AI(e,t=this){if((e=Di(this,e,t,0)??ue)===At)return;const s=this._$AH,n=e===ue&&s!==ue||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==ue&&(s===ue||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class wf{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Di(this,e)}}const oo=us.litHtmlPolyfillSupport;oo==null||oo(Ss,Ps),(us.litHtmlVersions??(us.litHtmlVersions=[])).push("3.3.1");const Cf=(i,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let n=s._$litPart$;if(n===void 0){const o=(t==null?void 0:t.renderBefore)??null;s._$litPart$=n=new Ps(e.insertBefore(Cs(),o),o,void 0,t??{})}return n._$AI(i),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ri=globalThis;let fs=class extends vi{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Cf(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return At}};var ra;fs._$litElement$=!0,fs.finalized=!0,(ra=ri.litElementHydrateSupport)==null||ra.call(ri,{LitElement:fs});const ro=ri.litElementPolyfillSupport;ro==null||ro({LitElement:fs});(ri.litElementVersions??(ri.litElementVersions=[])).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kf={attribute:!0,type:String,converter:vn,reflect:!1,hasChanged:ur},Sf=(i=kf,e,t)=>{const{kind:s,metadata:n}=t;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),s==="accessor"){const{name:r}=t;return{set(l){const a=e.get.call(this);e.set.call(this,l),this.requestUpdate(r,a,i)},init(l){return l!==void 0&&this.C(r,void 0,i,l),l}}}if(s==="setter"){const{name:r}=t;return function(l){const a=this[r];e.call(this,l),this.requestUpdate(r,a,i)}}throw Error("Unsupported decorator location: "+s)};function Hi(i){return(e,t)=>typeof t=="object"?Sf(i,e,t):((s,n,o)=>{const r=n.hasOwnProperty(o);return n.constructor.createProperty(o,s),r?Object.getOwnPropertyDescriptor(n,o):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mc={ATTRIBUTE:1,PROPERTY:3},vc=i=>(...e)=>({_$litDirective$:i,values:e});class yc{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tf=vc(class extends yc{constructor(i){var e;if(super(i),i.type!==mc.ATTRIBUTE||i.name!=="class"||((e=i.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(i){return" "+Object.keys(i).filter((e=>i[e])).join(" ")+" "}update(i,[e]){var s,n;if(this.st===void 0){this.st=new Set,i.strings!==void 0&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter((o=>o!==""))));for(const o in e)e[o]&&!((s=this.nt)!=null&&s.has(o))&&this.st.add(o);return this.render(e)}const t=i.element.classList;for(const o of this.st)o in e||(t.remove(o),this.st.delete(o));for(const o in e){const r=!!e[o];r===this.st.has(o)||(n=this.nt)!=null&&n.has(o)||(r?(t.add(o),this.st.add(o)):(t.remove(o),this.st.delete(o)))}return At}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tl=i=>i??ue,Do="1.17.0",_l="__vscodeElements_disableRegistryWarning__";class _f extends fs{get version(){return Do}}const Af=i=>e=>{if(!customElements.get(i)){customElements.define(i,e);return}if(_l in window)return;const s=document.createElement(i),n=s==null?void 0:s.version;let o="";n?n!==Do?(o+="is already registered by a different version of VSCode Elements. ",o+=`This version is "${Do}", while the other one is "${n}".`):o+="is already registered by the same version of VSCode Elements. ":(console.warn(i,"is already registered by an unknown custom element handler class."),o+="is already registered by an unknown custom element handler class."),console.warn(`[VSCode Elements] ${i} ${o}
To suppress this warning, set window.${_l} to true`)};class If extends yc{constructor(e){if(super(e),this._prevProperties={},e.type!==mc.PROPERTY||e.name!=="style")throw new Error("The `stylePropertyMap` directive must be used in the `style` property")}update(e,[t]){return Object.entries(t).forEach(([s,n])=>{this._prevProperties[s]!==n&&(s.startsWith("--")?e.element.style.setProperty(s,n):e.element.style[s]=n,this._prevProperties[s]=n)}),At}render(e){return At}}const Ef=vc(If),Of=uc`
  :host([hidden]) {
    display: none;
  }

  :host([disabled]),
  :host(:disabled) {
    cursor: not-allowed;
    opacity: 0.4;
    pointer-events: none;
  }
`,Rf=[Of,uc`
    :host {
      color: var(--vscode-icon-foreground, #cccccc);
      display: inline-block;
    }

    .codicon[class*='codicon-'] {
      display: block;
    }

    .icon,
    .button {
      background-color: transparent;
      display: block;
      padding: 0;
    }

    .button {
      border-color: transparent;
      border-style: solid;
      border-width: 1px;
      border-radius: 5px;
      color: currentColor;
      cursor: pointer;
      padding: 2px;
    }

    .button:hover {
      background-color: var(
        --vscode-toolbar-hoverBackground,
        rgba(90, 93, 94, 0.31)
      );
    }

    .button:active {
      background-color: var(
        --vscode-toolbar-activeBackground,
        rgba(99, 102, 103, 0.31)
      );
    }

    .button:focus {
      outline: none;
    }

    .button:focus-visible {
      border-color: var(--vscode-focusBorder, #0078d4);
    }

    @keyframes icon-spin {
      100% {
        transform: rotate(360deg);
      }
    }

    .spin {
      animation-name: icon-spin;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  `];var di=function(i,e,t,s){var n=arguments.length,o=n<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,t):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(i,e,t,s);else for(var l=i.length-1;l>=0;l--)(r=i[l])&&(o=(n<3?r(o):n>3?r(e,t,o):r(e,t))||o);return n>3&&o&&Object.defineProperty(e,t,o),o},ns;let tt=ns=class extends _f{constructor(){super(...arguments),this.label="",this.name="",this.size=16,this.spin=!1,this.spinDuration=1.5,this.actionIcon=!1,this._onButtonClick=e=>{this.dispatchEvent(new CustomEvent("vsc-click",{detail:{originalEvent:e}}))}}connectedCallback(){super.connectedCallback();const{href:e,nonce:t}=this._getStylesheetConfig();ns.stylesheetHref=e,ns.nonce=t}_getStylesheetConfig(){const e=document.getElementById("vscode-codicon-stylesheet"),t=(e==null?void 0:e.getAttribute("href"))||void 0,s=(e==null?void 0:e.nonce)||void 0;if(!e){let n="[VSCode Elements] To use the Icon component, the codicons.css file must be included in the page with the id `vscode-codicon-stylesheet`! ";n+="See https://vscode-elements.github.io/components/icon/ for more details.",console.warn(n)}return{nonce:s,href:t}}render(){const{stylesheetHref:e,nonce:t}=ns,s=qs`<span
      class=${Tf({codicon:!0,["codicon-"+this.name]:!0,spin:this.spin})}
      .style=${Ef({animationDuration:String(this.spinDuration)+"s",fontSize:this.size+"px",height:this.size+"px",width:this.size+"px"})}
    ></span>`,n=this.actionIcon?qs` <button
          class="button"
          @click=${this._onButtonClick}
          aria-label=${this.label}
        >
          ${s}
        </button>`:qs` <span class="icon" aria-hidden="true" role="presentation"
          >${s}</span
        >`;return qs`
      <link
        rel="stylesheet"
        href=${Tl(e)}
        nonce=${Tl(t)}
      >
      ${n}
    `}};tt.styles=Rf;tt.stylesheetHref="";tt.nonce="";di([Hi()],tt.prototype,"label",void 0);di([Hi({type:String})],tt.prototype,"name",void 0);di([Hi({type:Number})],tt.prototype,"size",void 0);di([Hi({type:Boolean,reflect:!0})],tt.prototype,"spin",void 0);di([Hi({type:Number,attribute:"spin-duration"})],tt.prototype,"spinDuration",void 0);di([Hi({type:Boolean,reflect:!0,attribute:"action-icon"})],tt.prototype,"actionIcon",void 0);tt=ns=di([Af("vscode-icon")],tt);const jt=(function(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof self<"u")return self;if(typeof window<"u")return window;try{return new Function("return this")()}catch{return{}}})();jt.trustedTypes===void 0&&(jt.trustedTypes={createPolicy:(i,e)=>e});const xc={configurable:!1,enumerable:!1,writable:!1};jt.FAST===void 0&&Reflect.defineProperty(jt,"FAST",Object.assign({value:Object.create(null)},xc));const Ts=jt.FAST;if(Ts.getById===void 0){const i=Object.create(null);Reflect.defineProperty(Ts,"getById",Object.assign({value(e,t){let s=i[e];return s===void 0&&(s=t?i[e]=t():null),s}},xc))}const li=Object.freeze([]);function $c(){const i=new WeakMap;return function(e){let t=i.get(e);if(t===void 0){let s=Reflect.getPrototypeOf(e);for(;t===void 0&&s!==null;)t=i.get(s),s=Reflect.getPrototypeOf(s);t=t===void 0?[]:t.slice(0),i.set(e,t)}return t}}const lo=jt.FAST.getById(1,()=>{const i=[],e=[];function t(){if(e.length)throw e.shift()}function s(r){try{r.call()}catch(l){e.push(l),setTimeout(t,0)}}function n(){let l=0;for(;l<i.length;)if(s(i[l]),l++,l>1024){for(let a=0,d=i.length-l;a<d;a++)i[a]=i[a+l];i.length-=l,l=0}i.length=0}function o(r){i.length<1&&jt.requestAnimationFrame(n),i.push(r)}return Object.freeze({enqueue:o,process:n})}),wc=jt.trustedTypes.createPolicy("fast-html",{createHTML:i=>i});let ao=wc;const ps=`fast-${Math.random().toString(36).substring(2,8)}`,Cc=`${ps}{`,pr=`}${ps}`,j=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(i){if(ao!==wc)throw new Error("The HTML policy can only be set once.");ao=i},createHTML(i){return ao.createHTML(i)},isMarker(i){return i&&i.nodeType===8&&i.data.startsWith(ps)},extractDirectiveIndexFromMarker(i){return parseInt(i.data.replace(`${ps}:`,""))},createInterpolationPlaceholder(i){return`${Cc}${i}${pr}`},createCustomAttributePlaceholder(i,e){return`${i}="${this.createInterpolationPlaceholder(e)}"`},createBlockPlaceholder(i){return`<!--${ps}:${i}-->`},queueUpdate:lo.enqueue,processUpdates:lo.process,nextUpdate(){return new Promise(lo.enqueue)},setAttribute(i,e,t){t==null?i.removeAttribute(e):i.setAttribute(e,t)},setBooleanAttribute(i,e,t){t?i.setAttribute(e,""):i.removeAttribute(e)},removeChildNodes(i){for(let e=i.firstChild;e!==null;e=i.firstChild)i.removeChild(e)},createTemplateWalker(i){return document.createTreeWalker(i,133,null,!1)}});class xn{constructor(e,t){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=e,this.sub1=t}has(e){return this.spillover===void 0?this.sub1===e||this.sub2===e:this.spillover.indexOf(e)!==-1}subscribe(e){const t=this.spillover;if(t===void 0){if(this.has(e))return;if(this.sub1===void 0){this.sub1=e;return}if(this.sub2===void 0){this.sub2=e;return}this.spillover=[this.sub1,this.sub2,e],this.sub1=void 0,this.sub2=void 0}else t.indexOf(e)===-1&&t.push(e)}unsubscribe(e){const t=this.spillover;if(t===void 0)this.sub1===e?this.sub1=void 0:this.sub2===e&&(this.sub2=void 0);else{const s=t.indexOf(e);s!==-1&&t.splice(s,1)}}notify(e){const t=this.spillover,s=this.source;if(t===void 0){const n=this.sub1,o=this.sub2;n!==void 0&&n.handleChange(s,e),o!==void 0&&o.handleChange(s,e)}else for(let n=0,o=t.length;n<o;++n)t[n].handleChange(s,e)}}class kc{constructor(e){this.subscribers={},this.sourceSubscribers=null,this.source=e}notify(e){var t;const s=this.subscribers[e];s!==void 0&&s.notify(e),(t=this.sourceSubscribers)===null||t===void 0||t.notify(e)}subscribe(e,t){var s;if(t){let n=this.subscribers[t];n===void 0&&(this.subscribers[t]=n=new xn(this.source)),n.subscribe(e)}else this.sourceSubscribers=(s=this.sourceSubscribers)!==null&&s!==void 0?s:new xn(this.source),this.sourceSubscribers.subscribe(e)}unsubscribe(e,t){var s;if(t){const n=this.subscribers[t];n!==void 0&&n.unsubscribe(e)}else(s=this.sourceSubscribers)===null||s===void 0||s.unsubscribe(e)}}const V=Ts.getById(2,()=>{const i=/(:|&&|\|\||if)/,e=new WeakMap,t=j.queueUpdate;let s,n=d=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function o(d){let c=d.$fastController||e.get(d);return c===void 0&&(Array.isArray(d)?c=n(d):e.set(d,c=new kc(d))),c}const r=$c();class l{constructor(c){this.name=c,this.field=`_${c}`,this.callback=`${c}Changed`}getValue(c){return s!==void 0&&s.watch(c,this.name),c[this.field]}setValue(c,h){const g=this.field,$=c[g];if($!==h){c[g]=h;const T=c[this.callback];typeof T=="function"&&T.call(c,$,h),o(c).notify(this.name)}}}class a extends xn{constructor(c,h,g=!1){super(c,h),this.binding=c,this.isVolatileBinding=g,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(c,h){this.needsRefresh&&this.last!==null&&this.disconnect();const g=s;s=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;const $=this.binding(c,h);return s=g,$}disconnect(){if(this.last!==null){let c=this.first;for(;c!==void 0;)c.notifier.unsubscribe(this,c.propertyName),c=c.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(c,h){const g=this.last,$=o(c),T=g===null?this.first:{};if(T.propertySource=c,T.propertyName=h,T.notifier=$,$.subscribe(this,h),g!==null){if(!this.needsRefresh){let R;s=void 0,R=g.propertySource[g.propertyName],s=this,c===R&&(this.needsRefresh=!0)}g.next=T}this.last=T}handleChange(){this.needsQueue&&(this.needsQueue=!1,t(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let c=this.first;return{next:()=>{const h=c;return h===void 0?{value:void 0,done:!0}:(c=c.next,{value:h,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(d){n=d},getNotifier:o,track(d,c){s!==void 0&&s.watch(d,c)},trackVolatile(){s!==void 0&&(s.needsRefresh=!0)},notify(d,c){o(d).notify(c)},defineProperty(d,c){typeof c=="string"&&(c=new l(c)),r(d).push(c),Reflect.defineProperty(d,c.name,{enumerable:!0,get:function(){return c.getValue(this)},set:function(h){c.setValue(this,h)}})},getAccessors:r,binding(d,c,h=this.isVolatileBinding(d)){return new a(d,c,h)},isVolatileBinding(d){return i.test(d.toString())}})});function I(i,e){V.defineProperty(i,e)}function Pf(i,e,t){return Object.assign({},t,{get:function(){return V.trackVolatile(),t.get.apply(this)}})}const Al=Ts.getById(3,()=>{let i=null;return{get(){return i},set(e){i=e}}});class _s{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return Al.get()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(e){Al.set(e)}}V.defineProperty(_s.prototype,"index");V.defineProperty(_s.prototype,"length");const gs=Object.seal(new _s);class Bn{constructor(){this.targetIndex=0}}class Sc extends Bn{constructor(){super(...arguments),this.createPlaceholder=j.createInterpolationPlaceholder}}class gr extends Bn{constructor(e,t,s){super(),this.name=e,this.behavior=t,this.options=s}createPlaceholder(e){return j.createCustomAttributePlaceholder(this.name,e)}createBehavior(e){return new this.behavior(e,this.options)}}function Df(i,e){this.source=i,this.context=e,this.bindingObserver===null&&(this.bindingObserver=V.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(i,e))}function Ff(i,e){this.source=i,this.context=e,this.target.addEventListener(this.targetName,this)}function Bf(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function Mf(){this.bindingObserver.disconnect(),this.source=null,this.context=null;const i=this.target.$fastView;i!==void 0&&i.isComposed&&(i.unbind(),i.needsBindOnly=!0)}function Hf(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function Lf(i){j.setAttribute(this.target,this.targetName,i)}function Nf(i){j.setBooleanAttribute(this.target,this.targetName,i)}function Vf(i){if(i==null&&(i=""),i.create){this.target.textContent="";let e=this.target.$fastView;e===void 0?e=i.create():this.target.$fastTemplate!==i&&(e.isComposed&&(e.remove(),e.unbind()),e=i.create()),e.isComposed?e.needsBindOnly&&(e.needsBindOnly=!1,e.bind(this.source,this.context)):(e.isComposed=!0,e.bind(this.source,this.context),e.insertBefore(this.target),this.target.$fastView=e,this.target.$fastTemplate=i)}else{const e=this.target.$fastView;e!==void 0&&e.isComposed&&(e.isComposed=!1,e.remove(),e.needsBindOnly?e.needsBindOnly=!1:e.unbind()),this.target.textContent=i}}function jf(i){this.target[this.targetName]=i}function zf(i){const e=this.classVersions||Object.create(null),t=this.target;let s=this.version||0;if(i!=null&&i.length){const n=i.split(/\s+/);for(let o=0,r=n.length;o<r;++o){const l=n[o];l!==""&&(e[l]=s,t.classList.add(l))}}if(this.classVersions=e,this.version=s+1,s!==0){s-=1;for(const n in e)e[n]===s&&t.classList.remove(n)}}class br extends Sc{constructor(e){super(),this.binding=e,this.bind=Df,this.unbind=Bf,this.updateTarget=Lf,this.isBindingVolatile=V.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(e){if(this.originalTargetName=e,e!==void 0)switch(e[0]){case":":if(this.cleanedTargetName=e.substr(1),this.updateTarget=jf,this.cleanedTargetName==="innerHTML"){const t=this.binding;this.binding=(s,n)=>j.createHTML(t(s,n))}break;case"?":this.cleanedTargetName=e.substr(1),this.updateTarget=Nf;break;case"@":this.cleanedTargetName=e.substr(1),this.bind=Ff,this.unbind=Hf;break;default:this.cleanedTargetName=e,e==="class"&&(this.updateTarget=zf);break}}targetAtContent(){this.updateTarget=Vf,this.unbind=Mf}createBehavior(e){return new Uf(e,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}}class Uf{constructor(e,t,s,n,o,r,l){this.source=null,this.context=null,this.bindingObserver=null,this.target=e,this.binding=t,this.isBindingVolatile=s,this.bind=n,this.unbind=o,this.updateTarget=r,this.targetName=l}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(e){_s.setEvent(e);const t=this.binding(this.source,this.context);_s.setEvent(null),t!==!0&&e.preventDefault()}}let co=null;class mr{addFactory(e){e.targetIndex=this.targetIndex,this.behaviorFactories.push(e)}captureContentBinding(e){e.targetAtContent(),this.addFactory(e)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){co=this}static borrow(e){const t=co||new mr;return t.directives=e,t.reset(),co=null,t}}function qf(i){if(i.length===1)return i[0];let e;const t=i.length,s=i.map(r=>typeof r=="string"?()=>r:(e=r.targetName||e,r.binding)),n=(r,l)=>{let a="";for(let d=0;d<t;++d)a+=s[d](r,l);return a},o=new br(n);return o.targetName=e,o}const Gf=pr.length;function Tc(i,e){const t=e.split(Cc);if(t.length===1)return null;const s=[];for(let n=0,o=t.length;n<o;++n){const r=t[n],l=r.indexOf(pr);let a;if(l===-1)a=r;else{const d=parseInt(r.substring(0,l));s.push(i.directives[d]),a=r.substring(l+Gf)}a!==""&&s.push(a)}return s}function Il(i,e,t=!1){const s=e.attributes;for(let n=0,o=s.length;n<o;++n){const r=s[n],l=r.value,a=Tc(i,l);let d=null;a===null?t&&(d=new br(()=>l),d.targetName=r.name):d=qf(a),d!==null&&(e.removeAttributeNode(r),n--,o--,i.addFactory(d))}}function Wf(i,e,t){const s=Tc(i,e.textContent);if(s!==null){let n=e;for(let o=0,r=s.length;o<r;++o){const l=s[o],a=o===0?e:n.parentNode.insertBefore(document.createTextNode(""),n.nextSibling);typeof l=="string"?a.textContent=l:(a.textContent=" ",i.captureContentBinding(l)),n=a,i.targetIndex++,a!==e&&t.nextNode()}i.targetIndex--}}function Qf(i,e){const t=i.content;document.adoptNode(t);const s=mr.borrow(e);Il(s,i,!0);const n=s.behaviorFactories;s.reset();const o=j.createTemplateWalker(t);let r;for(;r=o.nextNode();)switch(s.targetIndex++,r.nodeType){case 1:Il(s,r);break;case 3:Wf(s,r,o);break;case 8:j.isMarker(r)&&s.addFactory(e[j.extractDirectiveIndexFromMarker(r)])}let l=0;(j.isMarker(t.firstChild)||t.childNodes.length===1&&e.length)&&(t.insertBefore(document.createComment(""),t.firstChild),l=-1);const a=s.behaviorFactories;return s.release(),{fragment:t,viewBehaviorFactories:a,hostBehaviorFactories:n,targetOffset:l}}const ho=document.createRange();class _c{constructor(e,t){this.fragment=e,this.behaviors=t,this.source=null,this.context=null,this.firstChild=e.firstChild,this.lastChild=e.lastChild}appendTo(e){e.appendChild(this.fragment)}insertBefore(e){if(this.fragment.hasChildNodes())e.parentNode.insertBefore(this.fragment,e);else{const t=this.lastChild;if(e.previousSibling===t)return;const s=e.parentNode;let n=this.firstChild,o;for(;n!==t;)o=n.nextSibling,s.insertBefore(n,e),n=o;s.insertBefore(t,e)}}remove(){const e=this.fragment,t=this.lastChild;let s=this.firstChild,n;for(;s!==t;)n=s.nextSibling,e.appendChild(s),s=n;e.appendChild(t)}dispose(){const e=this.firstChild.parentNode,t=this.lastChild;let s=this.firstChild,n;for(;s!==t;)n=s.nextSibling,e.removeChild(s),s=n;e.removeChild(t);const o=this.behaviors,r=this.source;for(let l=0,a=o.length;l<a;++l)o[l].unbind(r)}bind(e,t){const s=this.behaviors;if(this.source!==e)if(this.source!==null){const n=this.source;this.source=e,this.context=t;for(let o=0,r=s.length;o<r;++o){const l=s[o];l.unbind(n),l.bind(e,t)}}else{this.source=e,this.context=t;for(let n=0,o=s.length;n<o;++n)s[n].bind(e,t)}}unbind(){if(this.source===null)return;const e=this.behaviors,t=this.source;for(let s=0,n=e.length;s<n;++s)e[s].unbind(t);this.source=null}static disposeContiguousBatch(e){if(e.length!==0){ho.setStartBefore(e[0].firstChild),ho.setEndAfter(e[e.length-1].lastChild),ho.deleteContents();for(let t=0,s=e.length;t<s;++t){const n=e[t],o=n.behaviors,r=n.source;for(let l=0,a=o.length;l<a;++l)o[l].unbind(r)}}}}class El{constructor(e,t){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=e,this.directives=t}create(e){if(this.fragment===null){let d;const c=this.html;if(typeof c=="string"){d=document.createElement("template"),d.innerHTML=j.createHTML(c);const g=d.content.firstElementChild;g!==null&&g.tagName==="TEMPLATE"&&(d=g)}else d=c;const h=Qf(d,this.directives);this.fragment=h.fragment,this.viewBehaviorFactories=h.viewBehaviorFactories,this.hostBehaviorFactories=h.hostBehaviorFactories,this.targetOffset=h.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}const t=this.fragment.cloneNode(!0),s=this.viewBehaviorFactories,n=new Array(this.behaviorCount),o=j.createTemplateWalker(t);let r=0,l=this.targetOffset,a=o.nextNode();for(let d=s.length;r<d;++r){const c=s[r],h=c.targetIndex;for(;a!==null;)if(l===h){n[r]=c.createBehavior(a);break}else a=o.nextNode(),l++}if(this.hasHostBehaviors){const d=this.hostBehaviorFactories;for(let c=0,h=d.length;c<h;++c,++r)n[r]=d[c].createBehavior(e)}return new _c(t,n)}render(e,t,s){typeof t=="string"&&(t=document.getElementById(t)),s===void 0&&(s=t);const n=this.create(s);return n.bind(e,gs),n.appendTo(t),n}}const Yf=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function G(i,...e){const t=[];let s="";for(let n=0,o=i.length-1;n<o;++n){const r=i[n];let l=e[n];if(s+=r,l instanceof El){const a=l;l=()=>a}if(typeof l=="function"&&(l=new br(l)),l instanceof Sc){const a=Yf.exec(r);a!==null&&(l.targetName=a[2])}l instanceof Bn?(s+=l.createPlaceholder(t.length),t.push(l)):s+=l}return s+=i[i.length-1],new El(s,t)}class Me{constructor(){this.targets=new WeakSet}addStylesTo(e){this.targets.add(e)}removeStylesFrom(e){this.targets.delete(e)}isAttachedTo(e){return this.targets.has(e)}withBehaviors(...e){return this.behaviors=this.behaviors===null?e:this.behaviors.concat(e),this}}Me.create=(()=>{if(j.supportsAdoptedStyleSheets){const i=new Map;return e=>new Jf(e,i)}return i=>new Kf(i)})();function vr(i){return i.map(e=>e instanceof Me?vr(e.styles):[e]).reduce((e,t)=>e.concat(t),[])}function Ac(i){return i.map(e=>e instanceof Me?e.behaviors:null).reduce((e,t)=>t===null?e:(e===null&&(e=[]),e.concat(t)),null)}const Ic=Symbol("prependToAdoptedStyleSheets");function Ec(i){const e=[],t=[];return i.forEach(s=>(s[Ic]?e:t).push(s)),{prepend:e,append:t}}let Oc=(i,e)=>{const{prepend:t,append:s}=Ec(e);i.adoptedStyleSheets=[...t,...i.adoptedStyleSheets,...s]},Rc=(i,e)=>{i.adoptedStyleSheets=i.adoptedStyleSheets.filter(t=>e.indexOf(t)===-1)};if(j.supportsAdoptedStyleSheets)try{document.adoptedStyleSheets.push(),document.adoptedStyleSheets.splice(),Oc=(i,e)=>{const{prepend:t,append:s}=Ec(e);i.adoptedStyleSheets.splice(0,0,...t),i.adoptedStyleSheets.push(...s)},Rc=(i,e)=>{for(const t of e){const s=i.adoptedStyleSheets.indexOf(t);s!==-1&&i.adoptedStyleSheets.splice(s,1)}}}catch{}class Jf extends Me{constructor(e,t){super(),this.styles=e,this.styleSheetCache=t,this._styleSheets=void 0,this.behaviors=Ac(e)}get styleSheets(){if(this._styleSheets===void 0){const e=this.styles,t=this.styleSheetCache;this._styleSheets=vr(e).map(s=>{if(s instanceof CSSStyleSheet)return s;let n=t.get(s);return n===void 0&&(n=new CSSStyleSheet,n.replaceSync(s),t.set(s,n)),n})}return this._styleSheets}addStylesTo(e){Oc(e,this.styleSheets),super.addStylesTo(e)}removeStylesFrom(e){Rc(e,this.styleSheets),super.removeStylesFrom(e)}}let Xf=0;function Zf(){return`fast-style-class-${++Xf}`}class Kf extends Me{constructor(e){super(),this.styles=e,this.behaviors=null,this.behaviors=Ac(e),this.styleSheets=vr(e),this.styleClass=Zf()}addStylesTo(e){const t=this.styleSheets,s=this.styleClass;e=this.normalizeTarget(e);for(let n=0;n<t.length;n++){const o=document.createElement("style");o.innerHTML=t[n],o.className=s,e.append(o)}super.addStylesTo(e)}removeStylesFrom(e){e=this.normalizeTarget(e);const t=e.querySelectorAll(`.${this.styleClass}`);for(let s=0,n=t.length;s<n;++s)e.removeChild(t[s]);super.removeStylesFrom(e)}isAttachedTo(e){return super.isAttachedTo(this.normalizeTarget(e))}normalizeTarget(e){return e===document?document.body:e}}const $n=Object.freeze({locate:$c()}),Pc={toView(i){return i?"true":"false"},fromView(i){return!(i==null||i==="false"||i===!1||i===0)}},it={toView(i){if(i==null)return null;const e=i*1;return isNaN(e)?null:e.toString()},fromView(i){if(i==null)return null;const e=i*1;return isNaN(e)?null:e}};class wn{constructor(e,t,s=t.toLowerCase(),n="reflect",o){this.guards=new Set,this.Owner=e,this.name=t,this.attribute=s,this.mode=n,this.converter=o,this.fieldName=`_${t}`,this.callbackName=`${t}Changed`,this.hasCallback=this.callbackName in e.prototype,n==="boolean"&&o===void 0&&(this.converter=Pc)}setValue(e,t){const s=e[this.fieldName],n=this.converter;n!==void 0&&(t=n.fromView(t)),s!==t&&(e[this.fieldName]=t,this.tryReflectToAttribute(e),this.hasCallback&&e[this.callbackName](s,t),e.$fastController.notify(this.name))}getValue(e){return V.track(e,this.name),e[this.fieldName]}onAttributeChangedCallback(e,t){this.guards.has(e)||(this.guards.add(e),this.setValue(e,t),this.guards.delete(e))}tryReflectToAttribute(e){const t=this.mode,s=this.guards;s.has(e)||t==="fromView"||j.queueUpdate(()=>{s.add(e);const n=e[this.fieldName];switch(t){case"reflect":const o=this.converter;j.setAttribute(e,this.attribute,o!==void 0?o.toView(n):n);break;case"boolean":j.setBooleanAttribute(e,this.attribute,n);break}s.delete(e)})}static collect(e,...t){const s=[];t.push($n.locate(e));for(let n=0,o=t.length;n<o;++n){const r=t[n];if(r!==void 0)for(let l=0,a=r.length;l<a;++l){const d=r[l];typeof d=="string"?s.push(new wn(e,d)):s.push(new wn(e,d.property,d.attribute,d.mode,d.converter))}}return s}}function m(i,e){let t;function s(n,o){arguments.length>1&&(t.property=o),$n.locate(n.constructor).push(t)}if(arguments.length>1){t={},s(i,e);return}return t=i===void 0?{}:i,s}const Ol={mode:"open"},Rl={},Fo=Ts.getById(4,()=>{const i=new Map;return Object.freeze({register(e){return i.has(e.type)?!1:(i.set(e.type,e),!0)},getByType(e){return i.get(e)}})});class Mn{constructor(e,t=e.definition){typeof t=="string"&&(t={name:t}),this.type=e,this.name=t.name,this.template=t.template;const s=wn.collect(e,t.attributes),n=new Array(s.length),o={},r={};for(let l=0,a=s.length;l<a;++l){const d=s[l];n[l]=d.attribute,o[d.name]=d,r[d.attribute]=d}this.attributes=s,this.observedAttributes=n,this.propertyLookup=o,this.attributeLookup=r,this.shadowOptions=t.shadowOptions===void 0?Ol:t.shadowOptions===null?void 0:Object.assign(Object.assign({},Ol),t.shadowOptions),this.elementOptions=t.elementOptions===void 0?Rl:Object.assign(Object.assign({},Rl),t.elementOptions),this.styles=t.styles===void 0?void 0:Array.isArray(t.styles)?Me.create(t.styles):t.styles instanceof Me?t.styles:Me.create([t.styles])}get isDefined(){return!!Fo.getByType(this.type)}define(e=customElements){const t=this.type;if(Fo.register(this)){const s=this.attributes,n=t.prototype;for(let o=0,r=s.length;o<r;++o)V.defineProperty(n,s[o]);Reflect.defineProperty(t,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return e.get(this.name)||e.define(this.name,t,this.elementOptions),this}}Mn.forType=Fo.getByType;const Dc=new WeakMap,ep={bubbles:!0,composed:!0,cancelable:!0};function uo(i){return i.shadowRoot||Dc.get(i)||null}class yr extends kc{constructor(e,t){super(e),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=e,this.definition=t;const s=t.shadowOptions;if(s!==void 0){const o=e.attachShadow(s);s.mode==="closed"&&Dc.set(e,o)}const n=V.getAccessors(e);if(n.length>0){const o=this.boundObservables=Object.create(null);for(let r=0,l=n.length;r<l;++r){const a=n[r].name,d=e[a];d!==void 0&&(delete e[a],o[a]=d)}}}get isConnected(){return V.track(this,"isConnected"),this._isConnected}setIsConnected(e){this._isConnected=e,V.notify(this,"isConnected")}get template(){return this._template}set template(e){this._template!==e&&(this._template=e,this.needsInitialization||this.renderTemplate(e))}get styles(){return this._styles}set styles(e){this._styles!==e&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=e,!this.needsInitialization&&e!==null&&this.addStyles(e))}addStyles(e){const t=uo(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.append(e);else if(!e.isAttachedTo(t)){const s=e.behaviors;e.addStylesTo(t),s!==null&&this.addBehaviors(s)}}removeStyles(e){const t=uo(this.element)||this.element.getRootNode();if(e instanceof HTMLStyleElement)t.removeChild(e);else if(e.isAttachedTo(t)){const s=e.behaviors;e.removeStylesFrom(t),s!==null&&this.removeBehaviors(s)}}addBehaviors(e){const t=this.behaviors||(this.behaviors=new Map),s=e.length,n=[];for(let o=0;o<s;++o){const r=e[o];t.has(r)?t.set(r,t.get(r)+1):(t.set(r,1),n.push(r))}if(this._isConnected){const o=this.element;for(let r=0;r<n.length;++r)n[r].bind(o,gs)}}removeBehaviors(e,t=!1){const s=this.behaviors;if(s===null)return;const n=e.length,o=[];for(let r=0;r<n;++r){const l=e[r];if(s.has(l)){const a=s.get(l)-1;a===0||t?s.delete(l)&&o.push(l):s.set(l,a)}}if(this._isConnected){const r=this.element;for(let l=0;l<o.length;++l)o[l].unbind(r)}}onConnectedCallback(){if(this._isConnected)return;const e=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(e,gs);const t=this.behaviors;if(t!==null)for(const[s]of t)s.bind(e,gs);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);const e=this.view;e!==null&&e.unbind();const t=this.behaviors;if(t!==null){const s=this.element;for(const[n]of t)n.unbind(s)}}onAttributeChangedCallback(e,t,s){const n=this.definition.attributeLookup[e];n!==void 0&&n.onAttributeChangedCallback(this.element,s)}emit(e,t,s){return this._isConnected?this.element.dispatchEvent(new CustomEvent(e,Object.assign(Object.assign({detail:t},ep),s))):!1}finishInitialization(){const e=this.element,t=this.boundObservables;if(t!==null){const n=Object.keys(t);for(let o=0,r=n.length;o<r;++o){const l=n[o];e[l]=t[l]}this.boundObservables=null}const s=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():s.template&&(this._template=s.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():s.styles&&(this._styles=s.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(e){const t=this.element,s=uo(t)||t;this.view!==null?(this.view.dispose(),this.view=null):this.needsInitialization||j.removeChildNodes(s),e&&(this.view=e.render(t,s,t))}static forCustomElement(e){const t=e.$fastController;if(t!==void 0)return t;const s=Mn.forType(e.constructor);if(s===void 0)throw new Error("Missing FASTElement definition.");return e.$fastController=new yr(e,s)}}function Pl(i){return class extends i{constructor(){super(),yr.forCustomElement(this)}$emit(e,t,s){return this.$fastController.emit(e,t,s)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(e,t,s){this.$fastController.onAttributeChangedCallback(e,t,s)}}}const Hn=Object.assign(Pl(HTMLElement),{from(i){return Pl(i)},define(i,e){return new Mn(i,e).define().type}});class Fc{createCSS(){return""}createBehavior(){}}function tp(i,e){const t=[];let s="";const n=[];for(let o=0,r=i.length-1;o<r;++o){s+=i[o];let l=e[o];if(l instanceof Fc){const a=l.createBehavior();l=l.createCSS(),a&&n.push(a)}l instanceof Me||l instanceof CSSStyleSheet?(s.trim()!==""&&(t.push(s),s=""),t.push(l)):s+=l}return s+=i[i.length-1],s.trim()!==""&&t.push(s),{styles:t,behaviors:n}}function le(i,...e){const{styles:t,behaviors:s}=tp(i,e),n=Me.create(t);return s.length&&n.withBehaviors(...s),n}function Ze(i,e,t){return{index:i,removed:e,addedCount:t}}const Bc=0,Mc=1,Bo=2,Mo=3;function ip(i,e,t,s,n,o){const r=o-n+1,l=t-e+1,a=new Array(r);let d,c;for(let h=0;h<r;++h)a[h]=new Array(l),a[h][0]=h;for(let h=0;h<l;++h)a[0][h]=h;for(let h=1;h<r;++h)for(let g=1;g<l;++g)i[e+g-1]===s[n+h-1]?a[h][g]=a[h-1][g-1]:(d=a[h-1][g]+1,c=a[h][g-1]+1,a[h][g]=d<c?d:c);return a}function sp(i){let e=i.length-1,t=i[0].length-1,s=i[e][t];const n=[];for(;e>0||t>0;){if(e===0){n.push(Bo),t--;continue}if(t===0){n.push(Mo),e--;continue}const o=i[e-1][t-1],r=i[e-1][t],l=i[e][t-1];let a;r<l?a=r<o?r:o:a=l<o?l:o,a===o?(o===s?n.push(Bc):(n.push(Mc),s=o),e--,t--):a===r?(n.push(Mo),e--,s=r):(n.push(Bo),t--,s=l)}return n.reverse(),n}function np(i,e,t){for(let s=0;s<t;++s)if(i[s]!==e[s])return s;return t}function op(i,e,t){let s=i.length,n=e.length,o=0;for(;o<t&&i[--s]===e[--n];)o++;return o}function rp(i,e,t,s){return e<t||s<i?-1:e===t||s===i?0:i<t?e<s?e-t:s-t:s<e?s-i:e-i}function Hc(i,e,t,s,n,o){let r=0,l=0;const a=Math.min(t-e,o-n);if(e===0&&n===0&&(r=np(i,s,a)),t===i.length&&o===s.length&&(l=op(i,s,a-r)),e+=r,n+=r,t-=l,o-=l,t-e===0&&o-n===0)return li;if(e===t){const T=Ze(e,[],0);for(;n<o;)T.removed.push(s[n++]);return[T]}else if(n===o)return[Ze(e,[],t-e)];const d=sp(ip(i,e,t,s,n,o)),c=[];let h,g=e,$=n;for(let T=0;T<d.length;++T)switch(d[T]){case Bc:h!==void 0&&(c.push(h),h=void 0),g++,$++;break;case Mc:h===void 0&&(h=Ze(g,[],0)),h.addedCount++,g++,h.removed.push(s[$]),$++;break;case Bo:h===void 0&&(h=Ze(g,[],0)),h.addedCount++,g++;break;case Mo:h===void 0&&(h=Ze(g,[],0)),h.removed.push(s[$]),$++;break}return h!==void 0&&c.push(h),c}const Dl=Array.prototype.push;function lp(i,e,t,s){const n=Ze(e,t,s);let o=!1,r=0;for(let l=0;l<i.length;l++){const a=i[l];if(a.index+=r,o)continue;const d=rp(n.index,n.index+n.removed.length,a.index,a.index+a.addedCount);if(d>=0){i.splice(l,1),l--,r-=a.addedCount-a.removed.length,n.addedCount+=a.addedCount-d;const c=n.removed.length+a.removed.length-d;if(!n.addedCount&&!c)o=!0;else{let h=a.removed;if(n.index<a.index){const g=n.removed.slice(0,a.index-n.index);Dl.apply(g,h),h=g}if(n.index+n.removed.length>a.index+a.addedCount){const g=n.removed.slice(a.index+a.addedCount-n.index);Dl.apply(h,g)}n.removed=h,a.index<n.index&&(n.index=a.index)}}else if(n.index<a.index){o=!0,i.splice(l,0,n),l++;const c=n.addedCount-n.removed.length;a.index+=c,r+=c}}o||i.push(n)}function ap(i){const e=[];for(let t=0,s=i.length;t<s;t++){const n=i[t];lp(e,n.index,n.removed,n.addedCount)}return e}function cp(i,e){let t=[];const s=ap(e);for(let n=0,o=s.length;n<o;++n){const r=s[n];if(r.addedCount===1&&r.removed.length===1){r.removed[0]!==i[r.index]&&t.push(r);continue}t=t.concat(Hc(i,r.index,r.index+r.addedCount,r.removed,0,r.removed.length))}return t}let Fl=!1;function fo(i,e){let t=i.index;const s=e.length;return t>s?t=s-i.addedCount:t<0&&(t=s+i.removed.length+t-i.addedCount),t<0&&(t=0),i.index=t,i}class dp extends xn{constructor(e){super(e),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(e,"$fastController",{value:this,enumerable:!1})}subscribe(e){this.flush(),super.subscribe(e)}addSplice(e){this.splices===void 0?this.splices=[e]:this.splices.push(e),this.needsQueue&&(this.needsQueue=!1,j.queueUpdate(this))}reset(e){this.oldCollection=e,this.needsQueue&&(this.needsQueue=!1,j.queueUpdate(this))}flush(){const e=this.splices,t=this.oldCollection;if(e===void 0&&t===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;const s=t===void 0?cp(this.source,e):Hc(this.source,0,this.source.length,t,0,t.length);this.notify(s)}}function hp(){if(Fl)return;Fl=!0,V.setArrayObserverFactory(a=>new dp(a));const i=Array.prototype;if(i.$fastPatch)return;Reflect.defineProperty(i,"$fastPatch",{value:1,enumerable:!1});const e=i.pop,t=i.push,s=i.reverse,n=i.shift,o=i.sort,r=i.splice,l=i.unshift;i.pop=function(){const a=this.length>0,d=e.apply(this,arguments),c=this.$fastController;return c!==void 0&&a&&c.addSplice(Ze(this.length,[d],0)),d},i.push=function(){const a=t.apply(this,arguments),d=this.$fastController;return d!==void 0&&d.addSplice(fo(Ze(this.length-arguments.length,[],arguments.length),this)),a},i.reverse=function(){let a;const d=this.$fastController;d!==void 0&&(d.flush(),a=this.slice());const c=s.apply(this,arguments);return d!==void 0&&d.reset(a),c},i.shift=function(){const a=this.length>0,d=n.apply(this,arguments),c=this.$fastController;return c!==void 0&&a&&c.addSplice(Ze(0,[d],0)),d},i.sort=function(){let a;const d=this.$fastController;d!==void 0&&(d.flush(),a=this.slice());const c=o.apply(this,arguments);return d!==void 0&&d.reset(a),c},i.splice=function(){const a=r.apply(this,arguments),d=this.$fastController;return d!==void 0&&d.addSplice(fo(Ze(+arguments[0],a,arguments.length>2?arguments.length-2:0),this)),a},i.unshift=function(){const a=l.apply(this,arguments),d=this.$fastController;return d!==void 0&&d.addSplice(fo(Ze(0,[],arguments.length),this)),a}}class up{constructor(e,t){this.target=e,this.propertyName=t}bind(e){e[this.propertyName]=this.target}unbind(){}}function Oe(i){return new gr("fast-ref",up,i)}const Lc=i=>typeof i=="function",fp=()=>null;function Bl(i){return i===void 0?fp:Lc(i)?i:()=>i}function xr(i,e,t){const s=Lc(i)?i:()=>i,n=Bl(e),o=Bl(t);return(r,l)=>s(r,l)?n(r,l):o(r,l)}function pp(i,e,t,s){i.bind(e[t],s)}function gp(i,e,t,s){const n=Object.create(s);n.index=t,n.length=e.length,i.bind(e[t],n)}class bp{constructor(e,t,s,n,o,r){this.location=e,this.itemsBinding=t,this.templateBinding=n,this.options=r,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=pp,this.itemsBindingObserver=V.binding(t,this,s),this.templateBindingObserver=V.binding(n,this,o),r.positioning&&(this.bindView=gp)}bind(e,t){this.source=e,this.originalContext=t,this.childContext=Object.create(t),this.childContext.parent=e,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(e,this.originalContext),this.template=this.templateBindingObserver.observe(e,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(e,t){e===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):e===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(t)}observeItems(e=!1){if(!this.items){this.items=li;return}const t=this.itemsObserver,s=this.itemsObserver=V.getNotifier(this.items),n=t!==s;n&&t!==null&&t.unsubscribe(this),(n||e)&&s.subscribe(this)}updateViews(e){const t=this.childContext,s=this.views,n=this.bindView,o=this.items,r=this.template,l=this.options.recycle,a=[];let d=0,c=0;for(let h=0,g=e.length;h<g;++h){const $=e[h],T=$.removed;let R=0,W=$.index;const L=W+$.addedCount,z=s.splice($.index,T.length),O=c=a.length+z.length;for(;W<L;++W){const E=s[W],N=E?E.firstChild:this.location;let te;l&&c>0?(R<=O&&z.length>0?(te=z[R],R++):(te=a[d],d++),c--):te=r.create(),s.splice(W,0,te),n(te,o,W,t),te.insertBefore(N)}z[R]&&a.push(...z.slice(R))}for(let h=d,g=a.length;h<g;++h)a[h].dispose();if(this.options.positioning)for(let h=0,g=s.length;h<g;++h){const $=s[h].context;$.length=g,$.index=h}}refreshAllViews(e=!1){const t=this.items,s=this.childContext,n=this.template,o=this.location,r=this.bindView;let l=t.length,a=this.views,d=a.length;if((l===0||e||!this.options.recycle)&&(_c.disposeContiguousBatch(a),d=0),d===0){this.views=a=new Array(l);for(let c=0;c<l;++c){const h=n.create();r(h,t,c,s),a[c]=h,h.insertBefore(o)}}else{let c=0;for(;c<l;++c)if(c<d){const g=a[c];r(g,t,c,s)}else{const g=n.create();r(g,t,c,s),a.push(g),g.insertBefore(o)}const h=a.splice(c,d-c);for(c=0,l=h.length;c<l;++c)h[c].dispose()}}unbindAllViews(){const e=this.views;for(let t=0,s=e.length;t<s;++t)e[t].unbind()}}class Nc extends Bn{constructor(e,t,s){super(),this.itemsBinding=e,this.templateBinding=t,this.options=s,this.createPlaceholder=j.createBlockPlaceholder,hp(),this.isItemsBindingVolatile=V.isVolatileBinding(e),this.isTemplateBindingVolatile=V.isVolatileBinding(t)}createBehavior(e){return new bp(e,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}}function $r(i){return i?function(e,t,s){return e.nodeType===1&&e.matches(i)}:function(e,t,s){return e.nodeType===1}}class Vc{constructor(e,t){this.target=e,this.options=t,this.source=null}bind(e){const t=this.options.property;this.shouldUpdate=V.getAccessors(e).some(s=>s.name===t),this.source=e,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(li),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let e=this.getNodes();return this.options.filter!==void 0&&(e=e.filter(this.options.filter)),e}updateTarget(e){this.source[this.options.property]=e}}class mp extends Vc{constructor(e,t){super(e,t)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}}function Qe(i){return typeof i=="string"&&(i={property:i}),new gr("fast-slotted",mp,i)}class vp extends Vc{constructor(e,t){super(e,t),this.observer=null,t.childList=!0}observe(){this.observer===null&&(this.observer=new MutationObserver(this.handleEvent.bind(this))),this.observer.observe(this.target,this.options)}disconnect(){this.observer.disconnect()}getNodes(){return"subtree"in this.options?Array.from(this.target.querySelectorAll(this.options.selector)):Array.from(this.target.childNodes)}}function jc(i){return typeof i=="string"&&(i={property:i}),new gr("fast-children",vp,i)}class Li{handleStartContentChange(){this.startContainer.classList.toggle("start",this.start.assignedNodes().length>0)}handleEndContentChange(){this.endContainer.classList.toggle("end",this.end.assignedNodes().length>0)}}const Ni=(i,e)=>G`
    <span
        part="end"
        ${Oe("endContainer")}
        class=${t=>e.end?"end":void 0}
    >
        <slot name="end" ${Oe("end")} @slotchange="${t=>t.handleEndContentChange()}">
            ${e.end||""}
        </slot>
    </span>
`,Vi=(i,e)=>G`
    <span
        part="start"
        ${Oe("startContainer")}
        class="${t=>e.start?"start":void 0}"
    >
        <slot
            name="start"
            ${Oe("start")}
            @slotchange="${t=>t.handleStartContentChange()}"
        >
            ${e.start||""}
        </slot>
    </span>
`;G`
    <span part="end" ${Oe("endContainer")}>
        <slot
            name="end"
            ${Oe("end")}
            @slotchange="${i=>i.handleEndContentChange()}"
        ></slot>
    </span>
`;G`
    <span part="start" ${Oe("startContainer")}>
        <slot
            name="start"
            ${Oe("start")}
            @slotchange="${i=>i.handleStartContentChange()}"
        ></slot>
    </span>
`;/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function p(i,e,t,s){var n=arguments.length,o=n<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,t):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(i,e,t,s);else for(var l=i.length-1;l>=0;l--)(r=i[l])&&(o=(n<3?r(o):n>3?r(e,t,o):r(e,t))||o);return n>3&&o&&Object.defineProperty(e,t,o),o}const po=new Map;"metadata"in Reflect||(Reflect.metadata=function(i,e){return function(t){Reflect.defineMetadata(i,e,t)}},Reflect.defineMetadata=function(i,e,t){let s=po.get(t);s===void 0&&po.set(t,s=new Map),s.set(i,e)},Reflect.getOwnMetadata=function(i,e){const t=po.get(e);if(t!==void 0)return t.get(i)});class yp{constructor(e,t){this.container=e,this.key=t}instance(e){return this.registerResolver(0,e)}singleton(e){return this.registerResolver(1,e)}transient(e){return this.registerResolver(2,e)}callback(e){return this.registerResolver(3,e)}cachedCallback(e){return this.registerResolver(3,Uc(e))}aliasTo(e){return this.registerResolver(5,e)}registerResolver(e,t){const{container:s,key:n}=this;return this.container=this.key=void 0,s.registerResolver(n,new Ue(n,e,t))}}function Zi(i){const e=i.slice(),t=Object.keys(i),s=t.length;let n;for(let o=0;o<s;++o)n=t[o],qc(n)||(e[n]=i[n]);return e}const xp=Object.freeze({none(i){throw Error(`${i.toString()} not registered, did you forget to add @singleton()?`)},singleton(i){return new Ue(i,1,i)},transient(i){return new Ue(i,2,i)}}),go=Object.freeze({default:Object.freeze({parentLocator:()=>null,responsibleForOwnerRequests:!1,defaultResolver:xp.singleton})}),Ml=new Map;function Hl(i){return e=>Reflect.getOwnMetadata(i,e)}let Ll=null;const re=Object.freeze({createContainer(i){return new bs(null,Object.assign({},go.default,i))},findResponsibleContainer(i){const e=i.$$container$$;return e&&e.responsibleForOwnerRequests?e:re.findParentContainer(i)},findParentContainer(i){const e=new CustomEvent(zc,{bubbles:!0,composed:!0,cancelable:!0,detail:{container:void 0}});return i.dispatchEvent(e),e.detail.container||re.getOrCreateDOMContainer()},getOrCreateDOMContainer(i,e){return i?i.$$container$$||new bs(i,Object.assign({},go.default,e,{parentLocator:re.findParentContainer})):Ll||(Ll=new bs(null,Object.assign({},go.default,e,{parentLocator:()=>null})))},getDesignParamtypes:Hl("design:paramtypes"),getAnnotationParamtypes:Hl("di:paramtypes"),getOrCreateAnnotationParamTypes(i){let e=this.getAnnotationParamtypes(i);return e===void 0&&Reflect.defineMetadata("di:paramtypes",e=[],i),e},getDependencies(i){let e=Ml.get(i);if(e===void 0){const t=i.inject;if(t===void 0){const s=re.getDesignParamtypes(i),n=re.getAnnotationParamtypes(i);if(s===void 0)if(n===void 0){const o=Object.getPrototypeOf(i);typeof o=="function"&&o!==Function.prototype?e=Zi(re.getDependencies(o)):e=[]}else e=Zi(n);else if(n===void 0)e=Zi(s);else{e=Zi(s);let o=n.length,r;for(let d=0;d<o;++d)r=n[d],r!==void 0&&(e[d]=r);const l=Object.keys(n);o=l.length;let a;for(let d=0;d<o;++d)a=l[d],qc(a)||(e[a]=n[a])}}else e=Zi(t);Ml.set(i,e)}return e},defineProperty(i,e,t,s=!1){const n=`$di_${e}`;Reflect.defineProperty(i,e,{get:function(){let o=this[n];if(o===void 0&&(o=(this instanceof HTMLElement?re.findResponsibleContainer(this):re.getOrCreateDOMContainer()).get(t),this[n]=o,s&&this instanceof Hn)){const l=this.$fastController,a=()=>{const c=re.findResponsibleContainer(this).get(t),h=this[n];c!==h&&(this[n]=o,l.notify(e))};l.subscribe({handleChange:a},"isConnected")}return o}})},createInterface(i,e){const t=typeof i=="function"?i:e,s=typeof i=="string"?i:i&&"friendlyName"in i&&i.friendlyName||zl,n=typeof i=="string"?!1:i&&"respectConnection"in i&&i.respectConnection||!1,o=function(r,l,a){if(r==null||new.target!==void 0)throw new Error(`No registration for interface: '${o.friendlyName}'`);if(l)re.defineProperty(r,l,o,n);else{const d=re.getOrCreateAnnotationParamTypes(r);d[a]=o}};return o.$isInterface=!0,o.friendlyName=s??"(anonymous)",t!=null&&(o.register=function(r,l){return t(new yp(r,l??o))}),o.toString=function(){return`InterfaceSymbol<${o.friendlyName}>`},o},inject(...i){return function(e,t,s){if(typeof s=="number"){const n=re.getOrCreateAnnotationParamTypes(e),o=i[0];o!==void 0&&(n[s]=o)}else if(t)re.defineProperty(e,t,i[0]);else{const n=s?re.getOrCreateAnnotationParamTypes(s.value):re.getOrCreateAnnotationParamTypes(e);let o;for(let r=0;r<i.length;++r)o=i[r],o!==void 0&&(n[r]=o)}}},transient(i){return i.register=function(t){return As.transient(i,i).register(t)},i.registerInRequestor=!1,i},singleton(i,e=wp){return i.register=function(s){return As.singleton(i,i).register(s)},i.registerInRequestor=e.scoped,i}}),$p=re.createInterface("Container");re.inject;const wp={scoped:!1};class Ue{constructor(e,t,s){this.key=e,this.strategy=t,this.state=s,this.resolving=!1}get $isResolver(){return!0}register(e){return e.registerResolver(this.key,this)}resolve(e,t){switch(this.strategy){case 0:return this.state;case 1:{if(this.resolving)throw new Error(`Cyclic dependency found: ${this.state.name}`);return this.resolving=!0,this.state=e.getFactory(this.state).construct(t),this.strategy=0,this.resolving=!1,this.state}case 2:{const s=e.getFactory(this.state);if(s===null)throw new Error(`Resolver for ${String(this.key)} returned a null factory`);return s.construct(t)}case 3:return this.state(e,t,this);case 4:return this.state[0].resolve(e,t);case 5:return t.get(this.state);default:throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)}}getFactory(e){var t,s,n;switch(this.strategy){case 1:case 2:return e.getFactory(this.state);case 5:return(n=(s=(t=e.getResolver(this.state))===null||t===void 0?void 0:t.getFactory)===null||s===void 0?void 0:s.call(t,e))!==null&&n!==void 0?n:null;default:return null}}}function Nl(i){return this.get(i)}function Cp(i,e){return e(i)}class kp{constructor(e,t){this.Type=e,this.dependencies=t,this.transformers=null}construct(e,t){let s;return t===void 0?s=new this.Type(...this.dependencies.map(Nl,e)):s=new this.Type(...this.dependencies.map(Nl,e),...t),this.transformers==null?s:this.transformers.reduce(Cp,s)}registerTransformer(e){(this.transformers||(this.transformers=[])).push(e)}}const Sp={$isResolver:!0,resolve(i,e){return e}};function an(i){return typeof i.register=="function"}function Tp(i){return an(i)&&typeof i.registerInRequestor=="boolean"}function Vl(i){return Tp(i)&&i.registerInRequestor}function _p(i){return i.prototype!==void 0}const Ap=new Set(["Array","ArrayBuffer","Boolean","DataView","Date","Error","EvalError","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Number","Object","Promise","RangeError","ReferenceError","RegExp","Set","SharedArrayBuffer","String","SyntaxError","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","URIError","WeakMap","WeakSet"]),zc="__DI_LOCATE_PARENT__",bo=new Map;class bs{constructor(e,t){this.owner=e,this.config=t,this._parent=void 0,this.registerDepth=0,this.context=null,e!==null&&(e.$$container$$=this),this.resolvers=new Map,this.resolvers.set($p,Sp),e instanceof Node&&e.addEventListener(zc,s=>{s.composedPath()[0]!==this.owner&&(s.detail.container=this,s.stopImmediatePropagation())})}get parent(){return this._parent===void 0&&(this._parent=this.config.parentLocator(this.owner)),this._parent}get depth(){return this.parent===null?0:this.parent.depth+1}get responsibleForOwnerRequests(){return this.config.responsibleForOwnerRequests}registerWithContext(e,...t){return this.context=e,this.register(...t),this.context=null,this}register(...e){if(++this.registerDepth===100)throw new Error("Unable to autoregister dependency");let t,s,n,o,r;const l=this.context;for(let a=0,d=e.length;a<d;++a)if(t=e[a],!!Ul(t))if(an(t))t.register(this,l);else if(_p(t))As.singleton(t,t).register(this);else for(s=Object.keys(t),o=0,r=s.length;o<r;++o)n=t[s[o]],Ul(n)&&(an(n)?n.register(this,l):this.register(n));return--this.registerDepth,this}registerResolver(e,t){Gs(e);const s=this.resolvers,n=s.get(e);return n==null?s.set(e,t):n instanceof Ue&&n.strategy===4?n.state.push(t):s.set(e,new Ue(e,4,[n,t])),t}registerTransformer(e,t){const s=this.getResolver(e);if(s==null)return!1;if(s.getFactory){const n=s.getFactory(this);return n==null?!1:(n.registerTransformer(t),!0)}return!1}getResolver(e,t=!0){if(Gs(e),e.resolve!==void 0)return e;let s=this,n;for(;s!=null;)if(n=s.resolvers.get(e),n==null){if(s.parent==null){const o=Vl(e)?this:s;return t?this.jitRegister(e,o):null}s=s.parent}else return n;return null}has(e,t=!1){return this.resolvers.has(e)?!0:t&&this.parent!=null?this.parent.has(e,!0):!1}get(e){if(Gs(e),e.$isResolver)return e.resolve(this,this);let t=this,s;for(;t!=null;)if(s=t.resolvers.get(e),s==null){if(t.parent==null){const n=Vl(e)?this:t;return s=this.jitRegister(e,n),s.resolve(t,this)}t=t.parent}else return s.resolve(t,this);throw new Error(`Unable to resolve key: ${String(e)}`)}getAll(e,t=!1){Gs(e);const s=this;let n=s,o;if(t){let r=li;for(;n!=null;)o=n.resolvers.get(e),o!=null&&(r=r.concat(jl(o,n,s))),n=n.parent;return r}else for(;n!=null;)if(o=n.resolvers.get(e),o==null){if(n=n.parent,n==null)return li}else return jl(o,n,s);return li}getFactory(e){let t=bo.get(e);if(t===void 0){if(Ip(e))throw new Error(`${e.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);bo.set(e,t=new kp(e,re.getDependencies(e)))}return t}registerFactory(e,t){bo.set(e,t)}createChild(e){return new bs(null,Object.assign({},this.config,e,{parentLocator:()=>this}))}jitRegister(e,t){if(typeof e!="function")throw new Error(`Attempted to jitRegister something that is not a constructor: '${e}'. Did you forget to register this dependency?`);if(Ap.has(e.name))throw new Error(`Attempted to jitRegister an intrinsic type: ${e.name}. Did you forget to add @inject(Key)`);if(an(e)){const s=e.register(t);if(!(s instanceof Object)||s.resolve==null){const n=t.resolvers.get(e);if(n!=null)return n;throw new Error("A valid resolver was not returned from the static register method")}return s}else{if(e.$isInterface)throw new Error(`Attempted to jitRegister an interface: ${e.friendlyName}`);{const s=this.config.defaultResolver(e,t);return t.resolvers.set(e,s),s}}}}const mo=new WeakMap;function Uc(i){return function(e,t,s){if(mo.has(s))return mo.get(s);const n=i(e,t,s);return mo.set(s,n),n}}const As=Object.freeze({instance(i,e){return new Ue(i,0,e)},singleton(i,e){return new Ue(i,1,e)},transient(i,e){return new Ue(i,2,e)},callback(i,e){return new Ue(i,3,e)},cachedCallback(i,e){return new Ue(i,3,Uc(e))},aliasTo(i,e){return new Ue(e,5,i)}});function Gs(i){if(i==null)throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")}function jl(i,e,t){if(i instanceof Ue&&i.strategy===4){const s=i.state;let n=s.length;const o=new Array(n);for(;n--;)o[n]=s[n].resolve(e,t);return o}return[i.resolve(e,t)]}const zl="(anonymous)";function Ul(i){return typeof i=="object"&&i!==null||typeof i=="function"}const Ip=(function(){const i=new WeakMap;let e=!1,t="",s=0;return function(n){return e=i.get(n),e===void 0&&(t=n.toString(),s=t.length,e=s>=29&&s<=100&&t.charCodeAt(s-1)===125&&t.charCodeAt(s-2)<=32&&t.charCodeAt(s-3)===93&&t.charCodeAt(s-4)===101&&t.charCodeAt(s-5)===100&&t.charCodeAt(s-6)===111&&t.charCodeAt(s-7)===99&&t.charCodeAt(s-8)===32&&t.charCodeAt(s-9)===101&&t.charCodeAt(s-10)===118&&t.charCodeAt(s-11)===105&&t.charCodeAt(s-12)===116&&t.charCodeAt(s-13)===97&&t.charCodeAt(s-14)===110&&t.charCodeAt(s-15)===88,i.set(n,e)),e}})(),Ws={};function qc(i){switch(typeof i){case"number":return i>=0&&(i|0)===i;case"string":{const e=Ws[i];if(e!==void 0)return e;const t=i.length;if(t===0)return Ws[i]=!1;let s=0;for(let n=0;n<t;++n)if(s=i.charCodeAt(n),n===0&&s===48&&t>1||s<48||s>57)return Ws[i]=!1;return Ws[i]=!0}default:return!1}}function ql(i){return`${i.toLowerCase()}:presentation`}const Qs=new Map,Gc=Object.freeze({define(i,e,t){const s=ql(i);Qs.get(s)===void 0?Qs.set(s,e):Qs.set(s,!1),t.register(As.instance(s,e))},forTag(i,e){const t=ql(i),s=Qs.get(t);return s===!1?re.findResponsibleContainer(e).get(t):s||null}});class Ep{constructor(e,t){this.template=e||null,this.styles=t===void 0?null:Array.isArray(t)?Me.create(t):t instanceof Me?t:Me.create([t])}applyTo(e){const t=e.$fastController;t.template===null&&(t.template=this.template),t.styles===null&&(t.styles=this.styles)}}class se extends Hn{constructor(){super(...arguments),this._presentation=void 0}get $presentation(){return this._presentation===void 0&&(this._presentation=Gc.forTag(this.tagName,this)),this._presentation}templateChanged(){this.template!==void 0&&(this.$fastController.template=this.template)}stylesChanged(){this.styles!==void 0&&(this.$fastController.styles=this.styles)}connectedCallback(){this.$presentation!==null&&this.$presentation.applyTo(this),super.connectedCallback()}static compose(e){return(t={})=>new Op(this===se?class extends se{}:this,e,t)}}p([I],se.prototype,"template",void 0);p([I],se.prototype,"styles",void 0);function Ki(i,e,t){return typeof i=="function"?i(e,t):i}class Op{constructor(e,t,s){this.type=e,this.elementDefinition=t,this.overrideDefinition=s,this.definition=Object.assign(Object.assign({},this.elementDefinition),this.overrideDefinition)}register(e,t){const s=this.definition,n=this.overrideDefinition,r=`${s.prefix||t.elementPrefix}-${s.baseName}`;t.tryDefineElement({name:r,type:this.type,baseClass:this.elementDefinition.baseClass,callback:l=>{const a=new Ep(Ki(s.template,l,s),Ki(s.styles,l,s));l.definePresentation(a);let d=Ki(s.shadowOptions,l,s);l.shadowRootMode&&(d?n.shadowOptions||(d.mode=l.shadowRootMode):d!==null&&(d={mode:l.shadowRootMode})),l.defineElement({elementOptions:Ki(s.elementOptions,l,s),shadowOptions:d,attributes:Ki(s.attributes,l,s)})}})}}function Le(i,...e){const t=$n.locate(i);e.forEach(s=>{Object.getOwnPropertyNames(s.prototype).forEach(o=>{o!=="constructor"&&Object.defineProperty(i.prototype,o,Object.getOwnPropertyDescriptor(s.prototype,o))}),$n.locate(s).forEach(o=>t.push(o))})}const wr={horizontal:"horizontal"};function Rp(i,e){let t=i.length;for(;t--;)if(e(i[t],t,i))return t;return-1}function Pp(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}function Dp(...i){return i.every(e=>e instanceof HTMLElement)}function Fp(){const i=document.querySelector('meta[property="csp-nonce"]');return i?i.getAttribute("content"):null}let Zt;function Bp(){if(typeof Zt=="boolean")return Zt;if(!Pp())return Zt=!1,Zt;const i=document.createElement("style"),e=Fp();e!==null&&i.setAttribute("nonce",e),document.head.appendChild(i);try{i.sheet.insertRule("foo:focus-visible {color:inherit}",0),Zt=!0}catch{Zt=!1}finally{document.head.removeChild(i)}return Zt}const Gl="focus",Wl="focusin",Fi="focusout",Bi="keydown";var Ql;(function(i){i[i.alt=18]="alt",i[i.arrowDown=40]="arrowDown",i[i.arrowLeft=37]="arrowLeft",i[i.arrowRight=39]="arrowRight",i[i.arrowUp=38]="arrowUp",i[i.back=8]="back",i[i.backSlash=220]="backSlash",i[i.break=19]="break",i[i.capsLock=20]="capsLock",i[i.closeBracket=221]="closeBracket",i[i.colon=186]="colon",i[i.colon2=59]="colon2",i[i.comma=188]="comma",i[i.ctrl=17]="ctrl",i[i.delete=46]="delete",i[i.end=35]="end",i[i.enter=13]="enter",i[i.equals=187]="equals",i[i.equals2=61]="equals2",i[i.equals3=107]="equals3",i[i.escape=27]="escape",i[i.forwardSlash=191]="forwardSlash",i[i.function1=112]="function1",i[i.function10=121]="function10",i[i.function11=122]="function11",i[i.function12=123]="function12",i[i.function2=113]="function2",i[i.function3=114]="function3",i[i.function4=115]="function4",i[i.function5=116]="function5",i[i.function6=117]="function6",i[i.function7=118]="function7",i[i.function8=119]="function8",i[i.function9=120]="function9",i[i.home=36]="home",i[i.insert=45]="insert",i[i.menu=93]="menu",i[i.minus=189]="minus",i[i.minus2=109]="minus2",i[i.numLock=144]="numLock",i[i.numPad0=96]="numPad0",i[i.numPad1=97]="numPad1",i[i.numPad2=98]="numPad2",i[i.numPad3=99]="numPad3",i[i.numPad4=100]="numPad4",i[i.numPad5=101]="numPad5",i[i.numPad6=102]="numPad6",i[i.numPad7=103]="numPad7",i[i.numPad8=104]="numPad8",i[i.numPad9=105]="numPad9",i[i.numPadDivide=111]="numPadDivide",i[i.numPadDot=110]="numPadDot",i[i.numPadMinus=109]="numPadMinus",i[i.numPadMultiply=106]="numPadMultiply",i[i.numPadPlus=107]="numPadPlus",i[i.openBracket=219]="openBracket",i[i.pageDown=34]="pageDown",i[i.pageUp=33]="pageUp",i[i.period=190]="period",i[i.print=44]="print",i[i.quote=222]="quote",i[i.scrollLock=145]="scrollLock",i[i.shift=16]="shift",i[i.space=32]="space",i[i.tab=9]="tab",i[i.tilde=192]="tilde",i[i.windowsLeft=91]="windowsLeft",i[i.windowsOpera=219]="windowsOpera",i[i.windowsRight=92]="windowsRight"})(Ql||(Ql={}));const hi="ArrowDown",Is="ArrowLeft",Es="ArrowRight",ui="ArrowUp",Ds="Enter",Ln="Escape",ji="Home",zi="End",Mp="F2",Hp="PageDown",Lp="PageUp",Fs=" ",Cr="Tab",Np={ArrowDown:hi,ArrowLeft:Is,ArrowRight:Es,ArrowUp:ui};var Mi;(function(i){i.ltr="ltr",i.rtl="rtl"})(Mi||(Mi={}));function Vp(i,e,t){return Math.min(Math.max(t,i),e)}function Ys(i,e,t=0){return[e,t]=[e,t].sort((s,n)=>s-n),e<=i&&i<t}let jp=0;function Cn(i=""){return`${i}${jp++}`}const zp=(i,e)=>G`
    <a
        class="control"
        part="control"
        download="${t=>t.download}"
        href="${t=>t.href}"
        hreflang="${t=>t.hreflang}"
        ping="${t=>t.ping}"
        referrerpolicy="${t=>t.referrerpolicy}"
        rel="${t=>t.rel}"
        target="${t=>t.target}"
        type="${t=>t.type}"
        aria-atomic="${t=>t.ariaAtomic}"
        aria-busy="${t=>t.ariaBusy}"
        aria-controls="${t=>t.ariaControls}"
        aria-current="${t=>t.ariaCurrent}"
        aria-describedby="${t=>t.ariaDescribedby}"
        aria-details="${t=>t.ariaDetails}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-errormessage="${t=>t.ariaErrormessage}"
        aria-expanded="${t=>t.ariaExpanded}"
        aria-flowto="${t=>t.ariaFlowto}"
        aria-haspopup="${t=>t.ariaHaspopup}"
        aria-hidden="${t=>t.ariaHidden}"
        aria-invalid="${t=>t.ariaInvalid}"
        aria-keyshortcuts="${t=>t.ariaKeyshortcuts}"
        aria-label="${t=>t.ariaLabel}"
        aria-labelledby="${t=>t.ariaLabelledby}"
        aria-live="${t=>t.ariaLive}"
        aria-owns="${t=>t.ariaOwns}"
        aria-relevant="${t=>t.ariaRelevant}"
        aria-roledescription="${t=>t.ariaRoledescription}"
        ${Oe("control")}
    >
        ${Vi(i,e)}
        <span class="content" part="content">
            <slot ${Qe("defaultSlottedContent")}></slot>
        </span>
        ${Ni(i,e)}
    </a>
`;class ne{}p([m({attribute:"aria-atomic"})],ne.prototype,"ariaAtomic",void 0);p([m({attribute:"aria-busy"})],ne.prototype,"ariaBusy",void 0);p([m({attribute:"aria-controls"})],ne.prototype,"ariaControls",void 0);p([m({attribute:"aria-current"})],ne.prototype,"ariaCurrent",void 0);p([m({attribute:"aria-describedby"})],ne.prototype,"ariaDescribedby",void 0);p([m({attribute:"aria-details"})],ne.prototype,"ariaDetails",void 0);p([m({attribute:"aria-disabled"})],ne.prototype,"ariaDisabled",void 0);p([m({attribute:"aria-errormessage"})],ne.prototype,"ariaErrormessage",void 0);p([m({attribute:"aria-flowto"})],ne.prototype,"ariaFlowto",void 0);p([m({attribute:"aria-haspopup"})],ne.prototype,"ariaHaspopup",void 0);p([m({attribute:"aria-hidden"})],ne.prototype,"ariaHidden",void 0);p([m({attribute:"aria-invalid"})],ne.prototype,"ariaInvalid",void 0);p([m({attribute:"aria-keyshortcuts"})],ne.prototype,"ariaKeyshortcuts",void 0);p([m({attribute:"aria-label"})],ne.prototype,"ariaLabel",void 0);p([m({attribute:"aria-labelledby"})],ne.prototype,"ariaLabelledby",void 0);p([m({attribute:"aria-live"})],ne.prototype,"ariaLive",void 0);p([m({attribute:"aria-owns"})],ne.prototype,"ariaOwns",void 0);p([m({attribute:"aria-relevant"})],ne.prototype,"ariaRelevant",void 0);p([m({attribute:"aria-roledescription"})],ne.prototype,"ariaRoledescription",void 0);class st extends se{constructor(){super(...arguments),this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{var t;(t=this.control)===null||t===void 0||t.focus()})}}connectedCallback(){super.connectedCallback(),this.handleUnsupportedDelegatesFocus()}}p([m],st.prototype,"download",void 0);p([m],st.prototype,"href",void 0);p([m],st.prototype,"hreflang",void 0);p([m],st.prototype,"ping",void 0);p([m],st.prototype,"referrerpolicy",void 0);p([m],st.prototype,"rel",void 0);p([m],st.prototype,"target",void 0);p([m],st.prototype,"type",void 0);p([I],st.prototype,"defaultSlottedContent",void 0);class kr{}p([m({attribute:"aria-expanded"})],kr.prototype,"ariaExpanded",void 0);Le(kr,ne);Le(st,Li,kr);const Up=i=>{const e=i.closest("[dir]");return e!==null&&e.dir==="rtl"?Mi.rtl:Mi.ltr},Wc=(i,e)=>G`
    <template class="${t=>t.circular?"circular":""}">
        <div class="control" part="control" style="${t=>t.generateBadgeStyle()}">
            <slot></slot>
        </div>
    </template>
`;let Bs=class extends se{constructor(){super(...arguments),this.generateBadgeStyle=()=>{if(!this.fill&&!this.color)return;const e=`background-color: var(--badge-fill-${this.fill});`,t=`color: var(--badge-color-${this.color});`;return this.fill&&!this.color?e:this.color&&!this.fill?t:`${t} ${e}`}}};p([m({attribute:"fill"})],Bs.prototype,"fill",void 0);p([m({attribute:"color"})],Bs.prototype,"color",void 0);p([m({mode:"boolean"})],Bs.prototype,"circular",void 0);const qp=(i,e)=>G`
    <button
        class="control"
        part="control"
        ?autofocus="${t=>t.autofocus}"
        ?disabled="${t=>t.disabled}"
        form="${t=>t.formId}"
        formaction="${t=>t.formaction}"
        formenctype="${t=>t.formenctype}"
        formmethod="${t=>t.formmethod}"
        formnovalidate="${t=>t.formnovalidate}"
        formtarget="${t=>t.formtarget}"
        name="${t=>t.name}"
        type="${t=>t.type}"
        value="${t=>t.value}"
        aria-atomic="${t=>t.ariaAtomic}"
        aria-busy="${t=>t.ariaBusy}"
        aria-controls="${t=>t.ariaControls}"
        aria-current="${t=>t.ariaCurrent}"
        aria-describedby="${t=>t.ariaDescribedby}"
        aria-details="${t=>t.ariaDetails}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-errormessage="${t=>t.ariaErrormessage}"
        aria-expanded="${t=>t.ariaExpanded}"
        aria-flowto="${t=>t.ariaFlowto}"
        aria-haspopup="${t=>t.ariaHaspopup}"
        aria-hidden="${t=>t.ariaHidden}"
        aria-invalid="${t=>t.ariaInvalid}"
        aria-keyshortcuts="${t=>t.ariaKeyshortcuts}"
        aria-label="${t=>t.ariaLabel}"
        aria-labelledby="${t=>t.ariaLabelledby}"
        aria-live="${t=>t.ariaLive}"
        aria-owns="${t=>t.ariaOwns}"
        aria-pressed="${t=>t.ariaPressed}"
        aria-relevant="${t=>t.ariaRelevant}"
        aria-roledescription="${t=>t.ariaRoledescription}"
        ${Oe("control")}
    >
        ${Vi(i,e)}
        <span class="content" part="content">
            <slot ${Qe("defaultSlottedContent")}></slot>
        </span>
        ${Ni(i,e)}
    </button>
`,Yl="form-associated-proxy",Jl="ElementInternals",Xl=Jl in window&&"setFormValue"in window[Jl].prototype,Zl=new WeakMap;function Ms(i){const e=class extends i{constructor(...t){super(...t),this.dirtyValue=!1,this.disabled=!1,this.proxyEventsToBlock=["change","click"],this.proxyInitialized=!1,this.required=!1,this.initialValue=this.initialValue||"",this.elementInternals||(this.formResetCallback=this.formResetCallback.bind(this))}static get formAssociated(){return Xl}get validity(){return this.elementInternals?this.elementInternals.validity:this.proxy.validity}get form(){return this.elementInternals?this.elementInternals.form:this.proxy.form}get validationMessage(){return this.elementInternals?this.elementInternals.validationMessage:this.proxy.validationMessage}get willValidate(){return this.elementInternals?this.elementInternals.willValidate:this.proxy.willValidate}get labels(){if(this.elementInternals)return Object.freeze(Array.from(this.elementInternals.labels));if(this.proxy instanceof HTMLElement&&this.proxy.ownerDocument&&this.id){const t=this.proxy.labels,s=Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),n=t?s.concat(Array.from(t)):s;return Object.freeze(n)}else return li}valueChanged(t,s){this.dirtyValue=!0,this.proxy instanceof HTMLElement&&(this.proxy.value=this.value),this.currentValue=this.value,this.setFormValue(this.value),this.validate()}currentValueChanged(){this.value=this.currentValue}initialValueChanged(t,s){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}disabledChanged(t,s){this.proxy instanceof HTMLElement&&(this.proxy.disabled=this.disabled),j.queueUpdate(()=>this.classList.toggle("disabled",this.disabled))}nameChanged(t,s){this.proxy instanceof HTMLElement&&(this.proxy.name=this.name)}requiredChanged(t,s){this.proxy instanceof HTMLElement&&(this.proxy.required=this.required),j.queueUpdate(()=>this.classList.toggle("required",this.required)),this.validate()}get elementInternals(){if(!Xl)return null;let t=Zl.get(this);return t||(t=this.attachInternals(),Zl.set(this,t)),t}connectedCallback(){super.connectedCallback(),this.addEventListener("keypress",this._keypressHandler),this.value||(this.value=this.initialValue,this.dirtyValue=!1),this.elementInternals||(this.attachProxy(),this.form&&this.form.addEventListener("reset",this.formResetCallback))}disconnectedCallback(){super.disconnectedCallback(),this.proxyEventsToBlock.forEach(t=>this.proxy.removeEventListener(t,this.stopPropagation)),!this.elementInternals&&this.form&&this.form.removeEventListener("reset",this.formResetCallback)}checkValidity(){return this.elementInternals?this.elementInternals.checkValidity():this.proxy.checkValidity()}reportValidity(){return this.elementInternals?this.elementInternals.reportValidity():this.proxy.reportValidity()}setValidity(t,s,n){this.elementInternals?this.elementInternals.setValidity(t,s,n):typeof s=="string"&&this.proxy.setCustomValidity(s)}formDisabledCallback(t){this.disabled=t}formResetCallback(){this.value=this.initialValue,this.dirtyValue=!1}attachProxy(){var t;this.proxyInitialized||(this.proxyInitialized=!0,this.proxy.style.display="none",this.proxyEventsToBlock.forEach(s=>this.proxy.addEventListener(s,this.stopPropagation)),this.proxy.disabled=this.disabled,this.proxy.required=this.required,typeof this.name=="string"&&(this.proxy.name=this.name),typeof this.value=="string"&&(this.proxy.value=this.value),this.proxy.setAttribute("slot",Yl),this.proxySlot=document.createElement("slot"),this.proxySlot.setAttribute("name",Yl)),(t=this.shadowRoot)===null||t===void 0||t.appendChild(this.proxySlot),this.appendChild(this.proxy)}detachProxy(){var t;this.removeChild(this.proxy),(t=this.shadowRoot)===null||t===void 0||t.removeChild(this.proxySlot)}validate(t){this.proxy instanceof HTMLElement&&this.setValidity(this.proxy.validity,this.proxy.validationMessage,t)}setFormValue(t,s){this.elementInternals&&this.elementInternals.setFormValue(t,s||t)}_keypressHandler(t){switch(t.key){case Ds:if(this.form instanceof HTMLFormElement){const s=this.form.querySelector("[type=submit]");s==null||s.click()}break}}stopPropagation(t){t.stopPropagation()}};return m({mode:"boolean"})(e.prototype,"disabled"),m({mode:"fromView",attribute:"value"})(e.prototype,"initialValue"),m({attribute:"current-value"})(e.prototype,"currentValue"),m(e.prototype,"name"),m({mode:"boolean"})(e.prototype,"required"),I(e.prototype,"value"),e}function Qc(i){class e extends Ms(i){}class t extends e{constructor(...n){super(n),this.dirtyChecked=!1,this.checkedAttribute=!1,this.checked=!1,this.dirtyChecked=!1}checkedAttributeChanged(){this.defaultChecked=this.checkedAttribute}defaultCheckedChanged(){this.dirtyChecked||(this.checked=this.defaultChecked,this.dirtyChecked=!1)}checkedChanged(n,o){this.dirtyChecked||(this.dirtyChecked=!0),this.currentChecked=this.checked,this.updateForm(),this.proxy instanceof HTMLInputElement&&(this.proxy.checked=this.checked),n!==void 0&&this.$emit("change"),this.validate()}currentCheckedChanged(n,o){this.checked=this.currentChecked}updateForm(){const n=this.checked?this.value:null;this.setFormValue(n,n)}connectedCallback(){super.connectedCallback(),this.updateForm()}formResetCallback(){super.formResetCallback(),this.checked=!!this.checkedAttribute,this.dirtyChecked=!1}}return m({attribute:"checked",mode:"boolean"})(t.prototype,"checkedAttribute"),m({attribute:"current-checked",converter:Pc})(t.prototype,"currentChecked"),I(t.prototype,"defaultChecked"),I(t.prototype,"checked"),t}class Gp extends se{}class Wp extends Ms(Gp){constructor(){super(...arguments),this.proxy=document.createElement("input")}}let nt=class extends Wp{constructor(){super(...arguments),this.handleClick=e=>{var t;this.disabled&&((t=this.defaultSlottedContent)===null||t===void 0?void 0:t.length)<=1&&e.stopPropagation()},this.handleSubmission=()=>{if(!this.form)return;const e=this.proxy.isConnected;e||this.attachProxy(),typeof this.form.requestSubmit=="function"?this.form.requestSubmit(this.proxy):this.proxy.click(),e||this.detachProxy()},this.handleFormReset=()=>{var e;(e=this.form)===null||e===void 0||e.reset()},this.handleUnsupportedDelegatesFocus=()=>{var e;window.ShadowRoot&&!window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus")&&(!((e=this.$fastController.definition.shadowOptions)===null||e===void 0)&&e.delegatesFocus)&&(this.focus=()=>{this.control.focus()})}}formactionChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formAction=this.formaction)}formenctypeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formEnctype=this.formenctype)}formmethodChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formMethod=this.formmethod)}formnovalidateChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formNoValidate=this.formnovalidate)}formtargetChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.formTarget=this.formtarget)}typeChanged(e,t){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type),t==="submit"&&this.addEventListener("click",this.handleSubmission),e==="submit"&&this.removeEventListener("click",this.handleSubmission),t==="reset"&&this.addEventListener("click",this.handleFormReset),e==="reset"&&this.removeEventListener("click",this.handleFormReset)}validate(){super.validate(this.control)}connectedCallback(){var e;super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.handleUnsupportedDelegatesFocus();const t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(s=>{s.addEventListener("click",this.handleClick)})}disconnectedCallback(){var e;super.disconnectedCallback();const t=Array.from((e=this.control)===null||e===void 0?void 0:e.children);t&&t.forEach(s=>{s.removeEventListener("click",this.handleClick)})}};p([m({mode:"boolean"})],nt.prototype,"autofocus",void 0);p([m({attribute:"form"})],nt.prototype,"formId",void 0);p([m],nt.prototype,"formaction",void 0);p([m],nt.prototype,"formenctype",void 0);p([m],nt.prototype,"formmethod",void 0);p([m({mode:"boolean"})],nt.prototype,"formnovalidate",void 0);p([m],nt.prototype,"formtarget",void 0);p([m],nt.prototype,"type",void 0);p([I],nt.prototype,"defaultSlottedContent",void 0);class Nn{}p([m({attribute:"aria-expanded"})],Nn.prototype,"ariaExpanded",void 0);p([m({attribute:"aria-pressed"})],Nn.prototype,"ariaPressed",void 0);Le(Nn,ne);Le(nt,Li,Nn);const Js={none:"none",default:"default",sticky:"sticky"},Dt={default:"default",columnHeader:"columnheader",rowHeader:"rowheader"},ms={default:"default",header:"header",stickyHeader:"sticky-header"};let $e=class extends se{constructor(){super(...arguments),this.rowType=ms.default,this.rowData=null,this.columnDefinitions=null,this.isActiveRow=!1,this.cellsRepeatBehavior=null,this.cellsPlaceholder=null,this.focusColumnIndex=0,this.refocusOnLoad=!1,this.updateRowStyle=()=>{this.style.gridTemplateColumns=this.gridTemplateColumns}}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowStyle()}rowTypeChanged(){this.$fastController.isConnected&&this.updateItemTemplate()}rowDataChanged(){if(this.rowData!==null&&this.isActiveRow){this.refocusOnLoad=!0;return}}cellItemTemplateChanged(){this.updateItemTemplate()}headerCellItemTemplateChanged(){this.updateItemTemplate()}connectedCallback(){super.connectedCallback(),this.cellsRepeatBehavior===null&&(this.cellsPlaceholder=document.createComment(""),this.appendChild(this.cellsPlaceholder),this.updateItemTemplate(),this.cellsRepeatBehavior=new Nc(e=>e.columnDefinitions,e=>e.activeCellItemTemplate,{positioning:!0}).createBehavior(this.cellsPlaceholder),this.$fastController.addBehaviors([this.cellsRepeatBehavior])),this.addEventListener("cell-focused",this.handleCellFocus),this.addEventListener(Fi,this.handleFocusout),this.addEventListener(Bi,this.handleKeydown),this.updateRowStyle(),this.refocusOnLoad&&(this.refocusOnLoad=!1,this.cellElements.length>this.focusColumnIndex&&this.cellElements[this.focusColumnIndex].focus())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("cell-focused",this.handleCellFocus),this.removeEventListener(Fi,this.handleFocusout),this.removeEventListener(Bi,this.handleKeydown)}handleFocusout(e){this.contains(e.target)||(this.isActiveRow=!1,this.focusColumnIndex=0)}handleCellFocus(e){this.isActiveRow=!0,this.focusColumnIndex=this.cellElements.indexOf(e.target),this.$emit("row-focused",this)}handleKeydown(e){if(e.defaultPrevented)return;let t=0;switch(e.key){case Is:t=Math.max(0,this.focusColumnIndex-1),this.cellElements[t].focus(),e.preventDefault();break;case Es:t=Math.min(this.cellElements.length-1,this.focusColumnIndex+1),this.cellElements[t].focus(),e.preventDefault();break;case ji:e.ctrlKey||(this.cellElements[0].focus(),e.preventDefault());break;case zi:e.ctrlKey||(this.cellElements[this.cellElements.length-1].focus(),e.preventDefault());break}}updateItemTemplate(){this.activeCellItemTemplate=this.rowType===ms.default&&this.cellItemTemplate!==void 0?this.cellItemTemplate:this.rowType===ms.default&&this.cellItemTemplate===void 0?this.defaultCellItemTemplate:this.headerCellItemTemplate!==void 0?this.headerCellItemTemplate:this.defaultHeaderCellItemTemplate}};p([m({attribute:"grid-template-columns"})],$e.prototype,"gridTemplateColumns",void 0);p([m({attribute:"row-type"})],$e.prototype,"rowType",void 0);p([I],$e.prototype,"rowData",void 0);p([I],$e.prototype,"columnDefinitions",void 0);p([I],$e.prototype,"cellItemTemplate",void 0);p([I],$e.prototype,"headerCellItemTemplate",void 0);p([I],$e.prototype,"rowIndex",void 0);p([I],$e.prototype,"isActiveRow",void 0);p([I],$e.prototype,"activeCellItemTemplate",void 0);p([I],$e.prototype,"defaultCellItemTemplate",void 0);p([I],$e.prototype,"defaultHeaderCellItemTemplate",void 0);p([I],$e.prototype,"cellElements",void 0);function Qp(i){const e=i.tagFor($e);return G`
    <${e}
        :rowData="${t=>t}"
        :cellItemTemplate="${(t,s)=>s.parent.cellItemTemplate}"
        :headerCellItemTemplate="${(t,s)=>s.parent.headerCellItemTemplate}"
    ></${e}>
`}const Yp=(i,e)=>{const t=Qp(i),s=i.tagFor($e);return G`
        <template
            role="grid"
            tabindex="0"
            :rowElementTag="${()=>s}"
            :defaultRowItemTemplate="${t}"
            ${jc({property:"rowElements",filter:$r("[role=row]")})}
        >
            <slot></slot>
        </template>
    `};let we=class Ho extends se{constructor(){super(),this.noTabbing=!1,this.generateHeader=Js.default,this.rowsData=[],this.columnDefinitions=null,this.focusRowIndex=0,this.focusColumnIndex=0,this.rowsPlaceholder=null,this.generatedHeader=null,this.isUpdatingFocus=!1,this.pendingFocusUpdate=!1,this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!0,this.generatedGridTemplateColumns="",this.focusOnCell=(e,t,s)=>{if(this.rowElements.length===0){this.focusRowIndex=0,this.focusColumnIndex=0;return}const n=Math.max(0,Math.min(this.rowElements.length-1,e)),r=this.rowElements[n].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'),l=Math.max(0,Math.min(r.length-1,t)),a=r[l];s&&this.scrollHeight!==this.clientHeight&&(n<this.focusRowIndex&&this.scrollTop>0||n>this.focusRowIndex&&this.scrollTop<this.scrollHeight-this.clientHeight)&&a.scrollIntoView({block:"center",inline:"center"}),a.focus()},this.onChildListChange=(e,t)=>{e&&e.length&&(e.forEach(s=>{s.addedNodes.forEach(n=>{n.nodeType===1&&n.getAttribute("role")==="row"&&(n.columnDefinitions=this.columnDefinitions)})}),this.queueRowIndexUpdate())},this.queueRowIndexUpdate=()=>{this.rowindexUpdateQueued||(this.rowindexUpdateQueued=!0,j.queueUpdate(this.updateRowIndexes))},this.updateRowIndexes=()=>{let e=this.gridTemplateColumns;if(e===void 0){if(this.generatedGridTemplateColumns===""&&this.rowElements.length>0){const t=this.rowElements[0];this.generatedGridTemplateColumns=new Array(t.cellElements.length).fill("1fr").join(" ")}e=this.generatedGridTemplateColumns}this.rowElements.forEach((t,s)=>{const n=t;n.rowIndex=s,n.gridTemplateColumns=e,this.columnDefinitionsStale&&(n.columnDefinitions=this.columnDefinitions)}),this.rowindexUpdateQueued=!1,this.columnDefinitionsStale=!1}}static generateTemplateColumns(e){let t="";return e.forEach(s=>{t=`${t}${t===""?"":" "}1fr`}),t}noTabbingChanged(){this.$fastController.isConnected&&(this.noTabbing?this.setAttribute("tabIndex","-1"):this.setAttribute("tabIndex",this.contains(document.activeElement)||this===document.activeElement?"-1":"0"))}generateHeaderChanged(){this.$fastController.isConnected&&this.toggleGeneratedHeader()}gridTemplateColumnsChanged(){this.$fastController.isConnected&&this.updateRowIndexes()}rowsDataChanged(){this.columnDefinitions===null&&this.rowsData.length>0&&(this.columnDefinitions=Ho.generateColumns(this.rowsData[0])),this.$fastController.isConnected&&this.toggleGeneratedHeader()}columnDefinitionsChanged(){if(this.columnDefinitions===null){this.generatedGridTemplateColumns="";return}this.generatedGridTemplateColumns=Ho.generateTemplateColumns(this.columnDefinitions),this.$fastController.isConnected&&(this.columnDefinitionsStale=!0,this.queueRowIndexUpdate())}headerCellItemTemplateChanged(){this.$fastController.isConnected&&this.generatedHeader!==null&&(this.generatedHeader.headerCellItemTemplate=this.headerCellItemTemplate)}focusRowIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}focusColumnIndexChanged(){this.$fastController.isConnected&&this.queueFocusUpdate()}connectedCallback(){super.connectedCallback(),this.rowItemTemplate===void 0&&(this.rowItemTemplate=this.defaultRowItemTemplate),this.rowsPlaceholder=document.createComment(""),this.appendChild(this.rowsPlaceholder),this.toggleGeneratedHeader(),this.rowsRepeatBehavior=new Nc(e=>e.rowsData,e=>e.rowItemTemplate,{positioning:!0}).createBehavior(this.rowsPlaceholder),this.$fastController.addBehaviors([this.rowsRepeatBehavior]),this.addEventListener("row-focused",this.handleRowFocus),this.addEventListener(Gl,this.handleFocus),this.addEventListener(Bi,this.handleKeydown),this.addEventListener(Fi,this.handleFocusOut),this.observer=new MutationObserver(this.onChildListChange),this.observer.observe(this,{childList:!0}),this.noTabbing&&this.setAttribute("tabindex","-1"),j.queueUpdate(this.queueRowIndexUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("row-focused",this.handleRowFocus),this.removeEventListener(Gl,this.handleFocus),this.removeEventListener(Bi,this.handleKeydown),this.removeEventListener(Fi,this.handleFocusOut),this.observer.disconnect(),this.rowsPlaceholder=null,this.generatedHeader=null}handleRowFocus(e){this.isUpdatingFocus=!0;const t=e.target;this.focusRowIndex=this.rowElements.indexOf(t),this.focusColumnIndex=t.focusColumnIndex,this.setAttribute("tabIndex","-1"),this.isUpdatingFocus=!1}handleFocus(e){this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}handleFocusOut(e){(e.relatedTarget===null||!this.contains(e.relatedTarget))&&this.setAttribute("tabIndex",this.noTabbing?"-1":"0")}handleKeydown(e){if(e.defaultPrevented)return;let t;const s=this.rowElements.length-1,n=this.offsetHeight+this.scrollTop,o=this.rowElements[s];switch(e.key){case ui:e.preventDefault(),this.focusOnCell(this.focusRowIndex-1,this.focusColumnIndex,!0);break;case hi:e.preventDefault(),this.focusOnCell(this.focusRowIndex+1,this.focusColumnIndex,!0);break;case Lp:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex===0){this.focusOnCell(0,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex-1,t;t>=0;t--){const r=this.rowElements[t];if(r.offsetTop<this.scrollTop){this.scrollTop=r.offsetTop+r.clientHeight-this.clientHeight;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case Hp:if(e.preventDefault(),this.rowElements.length===0){this.focusOnCell(0,0,!1);break}if(this.focusRowIndex>=s||o.offsetTop+o.offsetHeight<=n){this.focusOnCell(s,this.focusColumnIndex,!1);return}for(t=this.focusRowIndex+1,t;t<=s;t++){const r=this.rowElements[t];if(r.offsetTop+r.offsetHeight>n){let l=0;this.generateHeader===Js.sticky&&this.generatedHeader!==null&&(l=this.generatedHeader.clientHeight),this.scrollTop=r.offsetTop-l;break}}this.focusOnCell(t,this.focusColumnIndex,!1);break;case ji:e.ctrlKey&&(e.preventDefault(),this.focusOnCell(0,0,!0));break;case zi:e.ctrlKey&&this.columnDefinitions!==null&&(e.preventDefault(),this.focusOnCell(this.rowElements.length-1,this.columnDefinitions.length-1,!0));break}}queueFocusUpdate(){this.isUpdatingFocus&&(this.contains(document.activeElement)||this===document.activeElement)||this.pendingFocusUpdate===!1&&(this.pendingFocusUpdate=!0,j.queueUpdate(()=>this.updateFocus()))}updateFocus(){this.pendingFocusUpdate=!1,this.focusOnCell(this.focusRowIndex,this.focusColumnIndex,!0)}toggleGeneratedHeader(){if(this.generatedHeader!==null&&(this.removeChild(this.generatedHeader),this.generatedHeader=null),this.generateHeader!==Js.none&&this.rowsData.length>0){const e=document.createElement(this.rowElementTag);this.generatedHeader=e,this.generatedHeader.columnDefinitions=this.columnDefinitions,this.generatedHeader.gridTemplateColumns=this.gridTemplateColumns,this.generatedHeader.rowType=this.generateHeader===Js.sticky?ms.stickyHeader:ms.header,(this.firstChild!==null||this.rowsPlaceholder!==null)&&this.insertBefore(e,this.firstChild!==null?this.firstChild:this.rowsPlaceholder);return}}};we.generateColumns=i=>Object.getOwnPropertyNames(i).map((e,t)=>({columnDataKey:e,gridColumn:`${t}`}));p([m({attribute:"no-tabbing",mode:"boolean"})],we.prototype,"noTabbing",void 0);p([m({attribute:"generate-header"})],we.prototype,"generateHeader",void 0);p([m({attribute:"grid-template-columns"})],we.prototype,"gridTemplateColumns",void 0);p([I],we.prototype,"rowsData",void 0);p([I],we.prototype,"columnDefinitions",void 0);p([I],we.prototype,"rowItemTemplate",void 0);p([I],we.prototype,"cellItemTemplate",void 0);p([I],we.prototype,"headerCellItemTemplate",void 0);p([I],we.prototype,"focusRowIndex",void 0);p([I],we.prototype,"focusColumnIndex",void 0);p([I],we.prototype,"defaultRowItemTemplate",void 0);p([I],we.prototype,"rowElementTag",void 0);p([I],we.prototype,"rowElements",void 0);const Jp=G`
    <template>
        ${i=>i.rowData===null||i.columnDefinition===null||i.columnDefinition.columnDataKey===null?null:i.rowData[i.columnDefinition.columnDataKey]}
    </template>
`,Xp=G`
    <template>
        ${i=>i.columnDefinition===null?null:i.columnDefinition.title===void 0?i.columnDefinition.columnDataKey:i.columnDefinition.title}
    </template>
`;let Ut=class extends se{constructor(){super(...arguments),this.cellType=Dt.default,this.rowData=null,this.columnDefinition=null,this.isActiveCell=!1,this.customCellView=null,this.updateCellStyle=()=>{this.style.gridColumn=this.gridColumn}}cellTypeChanged(){this.$fastController.isConnected&&this.updateCellView()}gridColumnChanged(){this.$fastController.isConnected&&this.updateCellStyle()}columnDefinitionChanged(e,t){this.$fastController.isConnected&&this.updateCellView()}connectedCallback(){var e;super.connectedCallback(),this.addEventListener(Wl,this.handleFocusin),this.addEventListener(Fi,this.handleFocusout),this.addEventListener(Bi,this.handleKeydown),this.style.gridColumn=`${((e=this.columnDefinition)===null||e===void 0?void 0:e.gridColumn)===void 0?0:this.columnDefinition.gridColumn}`,this.updateCellView(),this.updateCellStyle()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(Wl,this.handleFocusin),this.removeEventListener(Fi,this.handleFocusout),this.removeEventListener(Bi,this.handleKeydown),this.disconnectCellView()}handleFocusin(e){if(!this.isActiveCell){switch(this.isActiveCell=!0,this.cellType){case Dt.columnHeader:if(this.columnDefinition!==null&&this.columnDefinition.headerCellInternalFocusQueue!==!0&&typeof this.columnDefinition.headerCellFocusTargetCallback=="function"){const t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus()}break;default:if(this.columnDefinition!==null&&this.columnDefinition.cellInternalFocusQueue!==!0&&typeof this.columnDefinition.cellFocusTargetCallback=="function"){const t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus()}break}this.$emit("cell-focused",this)}}handleFocusout(e){this!==document.activeElement&&!this.contains(document.activeElement)&&(this.isActiveCell=!1)}handleKeydown(e){if(!(e.defaultPrevented||this.columnDefinition===null||this.cellType===Dt.default&&this.columnDefinition.cellInternalFocusQueue!==!0||this.cellType===Dt.columnHeader&&this.columnDefinition.headerCellInternalFocusQueue!==!0))switch(e.key){case Ds:case Mp:if(this.contains(document.activeElement)&&document.activeElement!==this)return;switch(this.cellType){case Dt.columnHeader:if(this.columnDefinition.headerCellFocusTargetCallback!==void 0){const t=this.columnDefinition.headerCellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break;default:if(this.columnDefinition.cellFocusTargetCallback!==void 0){const t=this.columnDefinition.cellFocusTargetCallback(this);t!==null&&t.focus(),e.preventDefault()}break}break;case Ln:this.contains(document.activeElement)&&document.activeElement!==this&&(this.focus(),e.preventDefault());break}}updateCellView(){if(this.disconnectCellView(),this.columnDefinition!==null)switch(this.cellType){case Dt.columnHeader:this.columnDefinition.headerCellTemplate!==void 0?this.customCellView=this.columnDefinition.headerCellTemplate.render(this,this):this.customCellView=Xp.render(this,this);break;case void 0:case Dt.rowHeader:case Dt.default:this.columnDefinition.cellTemplate!==void 0?this.customCellView=this.columnDefinition.cellTemplate.render(this,this):this.customCellView=Jp.render(this,this);break}}disconnectCellView(){this.customCellView!==null&&(this.customCellView.dispose(),this.customCellView=null)}};p([m({attribute:"cell-type"})],Ut.prototype,"cellType",void 0);p([m({attribute:"grid-column"})],Ut.prototype,"gridColumn",void 0);p([I],Ut.prototype,"rowData",void 0);p([I],Ut.prototype,"columnDefinition",void 0);function Zp(i){const e=i.tagFor(Ut);return G`
    <${e}
        cell-type="${t=>t.isRowHeader?"rowheader":void 0}"
        grid-column="${(t,s)=>s.index+1}"
        :rowData="${(t,s)=>s.parent.rowData}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}function Kp(i){const e=i.tagFor(Ut);return G`
    <${e}
        cell-type="columnheader"
        grid-column="${(t,s)=>s.index+1}"
        :columnDefinition="${t=>t}"
    ></${e}>
`}const eg=(i,e)=>{const t=Zp(i),s=Kp(i);return G`
        <template
            role="row"
            class="${n=>n.rowType!=="default"?n.rowType:""}"
            :defaultCellItemTemplate="${t}"
            :defaultHeaderCellItemTemplate="${s}"
            ${jc({property:"cellElements",filter:$r('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')})}
        >
            <slot ${Qe("slottedCellElements")}></slot>
        </template>
    `},tg=(i,e)=>G`
        <template
            tabindex="-1"
            role="${t=>!t.cellType||t.cellType==="default"?"gridcell":t.cellType}"
            class="
            ${t=>t.cellType==="columnheader"?"column-header":t.cellType==="rowheader"?"row-header":""}
            "
        >
            <slot></slot>
        </template>
    `,ig=(i,e)=>G`
    <template
        role="checkbox"
        aria-checked="${t=>t.checked}"
        aria-required="${t=>t.required}"
        aria-disabled="${t=>t.disabled}"
        aria-readonly="${t=>t.readOnly}"
        tabindex="${t=>t.disabled?null:0}"
        @keypress="${(t,s)=>t.keypressHandler(s.event)}"
        @click="${(t,s)=>t.clickHandler(s.event)}"
        class="${t=>t.readOnly?"readonly":""} ${t=>t.checked?"checked":""} ${t=>t.indeterminate?"indeterminate":""}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${e.checkedIndicator||""}
            </slot>
            <slot name="indeterminate-indicator">
                ${e.indeterminateIndicator||""}
            </slot>
        </div>
        <label
            part="label"
            class="${t=>t.defaultSlottedNodes&&t.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Qe("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;class sg extends se{}class ng extends Qc(sg){constructor(){super(...arguments),this.proxy=document.createElement("input")}}let Vn=class extends ng{constructor(){super(),this.initialValue="on",this.indeterminate=!1,this.keypressHandler=e=>{if(!this.readOnly)switch(e.key){case Fs:this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked;break}},this.clickHandler=e=>{!this.disabled&&!this.readOnly&&(this.indeterminate&&(this.indeterminate=!1),this.checked=!this.checked)},this.proxy.setAttribute("type","checkbox")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}};p([m({attribute:"readonly",mode:"boolean"})],Vn.prototype,"readOnly",void 0);p([I],Vn.prototype,"defaultSlottedNodes",void 0);p([I],Vn.prototype,"indeterminate",void 0);function Yc(i){return Dp(i)&&(i.getAttribute("role")==="option"||i instanceof HTMLOptionElement)}class Ot extends se{constructor(e,t,s,n){super(),this.defaultSelected=!1,this.dirtySelected=!1,this.selected=this.defaultSelected,this.dirtyValue=!1,e&&(this.textContent=e),t&&(this.initialValue=t),s&&(this.defaultSelected=s),n&&(this.selected=n),this.proxy=new Option(`${this.textContent}`,this.initialValue,this.defaultSelected,this.selected),this.proxy.disabled=this.disabled}checkedChanged(e,t){if(typeof t=="boolean"){this.ariaChecked=t?"true":"false";return}this.ariaChecked=null}contentChanged(e,t){this.proxy instanceof HTMLOptionElement&&(this.proxy.textContent=this.textContent),this.$emit("contentchange",null,{bubbles:!0})}defaultSelectedChanged(){this.dirtySelected||(this.selected=this.defaultSelected,this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.defaultSelected))}disabledChanged(e,t){this.ariaDisabled=this.disabled?"true":"false",this.proxy instanceof HTMLOptionElement&&(this.proxy.disabled=this.disabled)}selectedAttributeChanged(){this.defaultSelected=this.selectedAttribute,this.proxy instanceof HTMLOptionElement&&(this.proxy.defaultSelected=this.defaultSelected)}selectedChanged(){this.ariaSelected=this.selected?"true":"false",this.dirtySelected||(this.dirtySelected=!0),this.proxy instanceof HTMLOptionElement&&(this.proxy.selected=this.selected)}initialValueChanged(e,t){this.dirtyValue||(this.value=this.initialValue,this.dirtyValue=!1)}get label(){var e;return(e=this.value)!==null&&e!==void 0?e:this.text}get text(){var e,t;return(t=(e=this.textContent)===null||e===void 0?void 0:e.replace(/\s+/g," ").trim())!==null&&t!==void 0?t:""}set value(e){const t=`${e??""}`;this._value=t,this.dirtyValue=!0,this.proxy instanceof HTMLOptionElement&&(this.proxy.value=t),V.notify(this,"value")}get value(){var e;return V.track(this,"value"),(e=this._value)!==null&&e!==void 0?e:this.text}get form(){return this.proxy?this.proxy.form:null}}p([I],Ot.prototype,"checked",void 0);p([I],Ot.prototype,"content",void 0);p([I],Ot.prototype,"defaultSelected",void 0);p([m({mode:"boolean"})],Ot.prototype,"disabled",void 0);p([m({attribute:"selected",mode:"boolean"})],Ot.prototype,"selectedAttribute",void 0);p([I],Ot.prototype,"selected",void 0);p([m({attribute:"value",mode:"fromView"})],Ot.prototype,"initialValue",void 0);class Ui{}p([I],Ui.prototype,"ariaChecked",void 0);p([I],Ui.prototype,"ariaPosInSet",void 0);p([I],Ui.prototype,"ariaSelected",void 0);p([I],Ui.prototype,"ariaSetSize",void 0);Le(Ui,ne);Le(Ot,Li,Ui);class Ee extends se{constructor(){super(...arguments),this._options=[],this.selectedIndex=-1,this.selectedOptions=[],this.shouldSkipFocus=!1,this.typeaheadBuffer="",this.typeaheadExpired=!0,this.typeaheadTimeout=-1}get firstSelectedOption(){var e;return(e=this.selectedOptions[0])!==null&&e!==void 0?e:null}get hasSelectableOptions(){return this.options.length>0&&!this.options.every(e=>e.disabled)}get length(){var e,t;return(t=(e=this.options)===null||e===void 0?void 0:e.length)!==null&&t!==void 0?t:0}get options(){return V.track(this,"options"),this._options}set options(e){this._options=e,V.notify(this,"options")}get typeAheadExpired(){return this.typeaheadExpired}set typeAheadExpired(e){this.typeaheadExpired=e}clickHandler(e){const t=e.target.closest("option,[role=option]");if(t&&!t.disabled)return this.selectedIndex=this.options.indexOf(t),!0}focusAndScrollOptionIntoView(e=this.firstSelectedOption){this.contains(document.activeElement)&&e!==null&&(e.focus(),requestAnimationFrame(()=>{e.scrollIntoView({block:"nearest"})}))}focusinHandler(e){!this.shouldSkipFocus&&e.target===e.currentTarget&&(this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}getTypeaheadMatches(){const e=this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),t=new RegExp(`^${e}`,"gi");return this.options.filter(s=>s.text.trim().match(t))}getSelectableIndex(e=this.selectedIndex,t){const s=e>t?-1:e<t?1:0,n=e+s;let o=null;switch(s){case-1:{o=this.options.reduceRight((r,l,a)=>!r&&!l.disabled&&a<n?l:r,o);break}case 1:{o=this.options.reduce((r,l,a)=>!r&&!l.disabled&&a>n?l:r,o);break}}return this.options.indexOf(o)}handleChange(e,t){switch(t){case"selected":{Ee.slottedOptionFilter(e)&&(this.selectedIndex=this.options.indexOf(e)),this.setSelectedOptions();break}}}handleTypeAhead(e){this.typeaheadTimeout&&window.clearTimeout(this.typeaheadTimeout),this.typeaheadTimeout=window.setTimeout(()=>this.typeaheadExpired=!0,Ee.TYPE_AHEAD_TIMEOUT_MS),!(e.length>1)&&(this.typeaheadBuffer=`${this.typeaheadExpired?"":this.typeaheadBuffer}${e}`)}keydownHandler(e){if(this.disabled)return!0;this.shouldSkipFocus=!1;const t=e.key;switch(t){case ji:{e.shiftKey||(e.preventDefault(),this.selectFirstOption());break}case hi:{e.shiftKey||(e.preventDefault(),this.selectNextOption());break}case ui:{e.shiftKey||(e.preventDefault(),this.selectPreviousOption());break}case zi:{e.preventDefault(),this.selectLastOption();break}case Cr:return this.focusAndScrollOptionIntoView(),!0;case Ds:case Ln:return!0;case Fs:if(this.typeaheadExpired)return!0;default:return t.length===1&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){return this.shouldSkipFocus=!this.contains(document.activeElement),!0}multipleChanged(e,t){this.ariaMultiSelectable=t?"true":null}selectedIndexChanged(e,t){var s;if(!this.hasSelectableOptions){this.selectedIndex=-1;return}if(!((s=this.options[this.selectedIndex])===null||s===void 0)&&s.disabled&&typeof e=="number"){const n=this.getSelectableIndex(e,t),o=n>-1?n:e;this.selectedIndex=o,t===o&&this.selectedIndexChanged(t,o);return}this.setSelectedOptions()}selectedOptionsChanged(e,t){var s;const n=t.filter(Ee.slottedOptionFilter);(s=this.options)===null||s===void 0||s.forEach(o=>{const r=V.getNotifier(o);r.unsubscribe(this,"selected"),o.selected=n.includes(o),r.subscribe(this,"selected")})}selectFirstOption(){var e,t;this.disabled||(this.selectedIndex=(t=(e=this.options)===null||e===void 0?void 0:e.findIndex(s=>!s.disabled))!==null&&t!==void 0?t:-1)}selectLastOption(){this.disabled||(this.selectedIndex=Rp(this.options,e=>!e.disabled))}selectNextOption(){!this.disabled&&this.selectedIndex<this.options.length-1&&(this.selectedIndex+=1)}selectPreviousOption(){!this.disabled&&this.selectedIndex>0&&(this.selectedIndex=this.selectedIndex-1)}setDefaultSelectedOption(){var e,t;this.selectedIndex=(t=(e=this.options)===null||e===void 0?void 0:e.findIndex(s=>s.defaultSelected))!==null&&t!==void 0?t:-1}setSelectedOptions(){var e,t,s;!((e=this.options)===null||e===void 0)&&e.length&&(this.selectedOptions=[this.options[this.selectedIndex]],this.ariaActiveDescendant=(s=(t=this.firstSelectedOption)===null||t===void 0?void 0:t.id)!==null&&s!==void 0?s:"",this.focusAndScrollOptionIntoView())}slottedOptionsChanged(e,t){this.options=t.reduce((n,o)=>(Yc(o)&&n.push(o),n),[]);const s=`${this.options.length}`;this.options.forEach((n,o)=>{n.id||(n.id=Cn("option-")),n.ariaPosInSet=`${o+1}`,n.ariaSetSize=s}),this.$fastController.isConnected&&(this.setSelectedOptions(),this.setDefaultSelectedOption())}typeaheadBufferChanged(e,t){if(this.$fastController.isConnected){const s=this.getTypeaheadMatches();if(s.length){const n=this.options.indexOf(s[0]);n>-1&&(this.selectedIndex=n)}this.typeaheadExpired=!1}}}Ee.slottedOptionFilter=i=>Yc(i)&&!i.hidden;Ee.TYPE_AHEAD_TIMEOUT_MS=1e3;p([m({mode:"boolean"})],Ee.prototype,"disabled",void 0);p([I],Ee.prototype,"selectedIndex",void 0);p([I],Ee.prototype,"selectedOptions",void 0);p([I],Ee.prototype,"slottedOptions",void 0);p([I],Ee.prototype,"typeaheadBuffer",void 0);class fi{}p([I],fi.prototype,"ariaActiveDescendant",void 0);p([I],fi.prototype,"ariaDisabled",void 0);p([I],fi.prototype,"ariaExpanded",void 0);p([I],fi.prototype,"ariaMultiSelectable",void 0);Le(fi,ne);Le(Ee,fi);const vo={above:"above",below:"below"};function Lo(i){const e=i.parentElement;if(e)return e;{const t=i.getRootNode();if(t.host instanceof HTMLElement)return t.host}return null}function og(i,e){let t=e;for(;t!==null;){if(t===i)return!0;t=Lo(t)}return!1}const Ct=document.createElement("div");function rg(i){return i instanceof Hn}class Sr{setProperty(e,t){j.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){j.queueUpdate(()=>this.target.removeProperty(e))}}class lg extends Sr{constructor(e){super();const t=new CSSStyleSheet;t[Ic]=!0,this.target=t.cssRules[t.insertRule(":host{}")].style,e.$fastController.addStyles(Me.create([t]))}}class ag extends Sr{constructor(){super();const e=new CSSStyleSheet;this.target=e.cssRules[e.insertRule(":root{}")].style,document.adoptedStyleSheets=[...document.adoptedStyleSheets,e]}}class cg extends Sr{constructor(){super(),this.style=document.createElement("style"),document.head.appendChild(this.style);const{sheet:e}=this.style;if(e){const t=e.insertRule(":root{}",e.cssRules.length);this.target=e.cssRules[t].style}}}class Jc{constructor(e){this.store=new Map,this.target=null;const t=e.$fastController;this.style=document.createElement("style"),t.addStyles(this.style),V.getNotifier(t).subscribe(this,"isConnected"),this.handleChange(t,"isConnected")}targetChanged(){if(this.target!==null)for(const[e,t]of this.store.entries())this.target.setProperty(e,t)}setProperty(e,t){this.store.set(e,t),j.queueUpdate(()=>{this.target!==null&&this.target.setProperty(e,t)})}removeProperty(e){this.store.delete(e),j.queueUpdate(()=>{this.target!==null&&this.target.removeProperty(e)})}handleChange(e,t){const{sheet:s}=this.style;if(s){const n=s.insertRule(":host{}",s.cssRules.length);this.target=s.cssRules[n].style}else this.target=null}}p([I],Jc.prototype,"target",void 0);class dg{constructor(e){this.target=e.style}setProperty(e,t){j.queueUpdate(()=>this.target.setProperty(e,t))}removeProperty(e){j.queueUpdate(()=>this.target.removeProperty(e))}}class fe{setProperty(e,t){fe.properties[e]=t;for(const s of fe.roots.values())xi.getOrCreate(fe.normalizeRoot(s)).setProperty(e,t)}removeProperty(e){delete fe.properties[e];for(const t of fe.roots.values())xi.getOrCreate(fe.normalizeRoot(t)).removeProperty(e)}static registerRoot(e){const{roots:t}=fe;if(!t.has(e)){t.add(e);const s=xi.getOrCreate(this.normalizeRoot(e));for(const n in fe.properties)s.setProperty(n,fe.properties[n])}}static unregisterRoot(e){const{roots:t}=fe;if(t.has(e)){t.delete(e);const s=xi.getOrCreate(fe.normalizeRoot(e));for(const n in fe.properties)s.removeProperty(n)}}static normalizeRoot(e){return e===Ct?document:e}}fe.roots=new Set;fe.properties={};const yo=new WeakMap,hg=j.supportsAdoptedStyleSheets?lg:Jc,xi=Object.freeze({getOrCreate(i){if(yo.has(i))return yo.get(i);let e;return i===Ct?e=new fe:i instanceof Document?e=j.supportsAdoptedStyleSheets?new ag:new cg:rg(i)?e=new hg(i):e=new dg(i),yo.set(i,e),e}});class Ie extends Fc{constructor(e){super(),this.subscribers=new WeakMap,this._appliedTo=new Set,this.name=e.name,e.cssCustomPropertyName!==null&&(this.cssCustomProperty=`--${e.cssCustomPropertyName}`,this.cssVar=`var(${this.cssCustomProperty})`),this.id=Ie.uniqueId(),Ie.tokensById.set(this.id,this)}get appliedTo(){return[...this._appliedTo]}static from(e){return new Ie({name:typeof e=="string"?e:e.name,cssCustomPropertyName:typeof e=="string"?e:e.cssCustomPropertyName===void 0?e.name:e.cssCustomPropertyName})}static isCSSDesignToken(e){return typeof e.cssCustomProperty=="string"}static isDerivedDesignTokenValue(e){return typeof e=="function"}static getTokenById(e){return Ie.tokensById.get(e)}getOrCreateSubscriberSet(e=this){return this.subscribers.get(e)||this.subscribers.set(e,new Set)&&this.subscribers.get(e)}createCSS(){return this.cssVar||""}getValueFor(e){const t=ae.getOrCreate(e).get(this);if(t!==void 0)return t;throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${e} or an ancestor of ${e}.`)}setValueFor(e,t){return this._appliedTo.add(e),t instanceof Ie&&(t=this.alias(t)),ae.getOrCreate(e).set(this,t),this}deleteValueFor(e){return this._appliedTo.delete(e),ae.existsFor(e)&&ae.getOrCreate(e).delete(this),this}withDefault(e){return this.setValueFor(Ct,e),this}subscribe(e,t){const s=this.getOrCreateSubscriberSet(t);t&&!ae.existsFor(t)&&ae.getOrCreate(t),s.has(e)||s.add(e)}unsubscribe(e,t){const s=this.subscribers.get(t||this);s&&s.has(e)&&s.delete(e)}notify(e){const t=Object.freeze({token:this,target:e});this.subscribers.has(this)&&this.subscribers.get(this).forEach(s=>s.handleChange(t)),this.subscribers.has(e)&&this.subscribers.get(e).forEach(s=>s.handleChange(t))}alias(e){return(t=>e.getValueFor(t))}}Ie.uniqueId=(()=>{let i=0;return()=>(i++,i.toString(16))})();Ie.tokensById=new Map;class ug{startReflection(e,t){e.subscribe(this,t),this.handleChange({token:e,target:t})}stopReflection(e,t){e.unsubscribe(this,t),this.remove(e,t)}handleChange(e){const{token:t,target:s}=e;this.add(t,s)}add(e,t){xi.getOrCreate(t).setProperty(e.cssCustomProperty,this.resolveCSSValue(ae.getOrCreate(t).get(e)))}remove(e,t){xi.getOrCreate(t).removeProperty(e.cssCustomProperty)}resolveCSSValue(e){return e&&typeof e.createCSS=="function"?e.createCSS():e}}class fg{constructor(e,t,s){this.source=e,this.token=t,this.node=s,this.dependencies=new Set,this.observer=V.binding(e,this,!1),this.observer.handleChange=this.observer.call,this.handleChange()}disconnect(){this.observer.disconnect()}handleChange(){try{this.node.store.set(this.token,this.observer.observe(this.node.target,gs))}catch(e){console.error(e)}}}class pg{constructor(){this.values=new Map}set(e,t){this.values.get(e)!==t&&(this.values.set(e,t),V.getNotifier(this).notify(e.id))}get(e){return V.track(this,e.id),this.values.get(e)}delete(e){this.values.delete(e),V.getNotifier(this).notify(e.id)}all(){return this.values.entries()}}const es=new WeakMap,ts=new WeakMap;class ae{constructor(e){this.target=e,this.store=new pg,this.children=[],this.assignedValues=new Map,this.reflecting=new Set,this.bindingObservers=new Map,this.tokenValueChangeHandler={handleChange:(t,s)=>{const n=Ie.getTokenById(s);n&&(n.notify(this.target),this.updateCSSTokenReflection(t,n))}},es.set(e,this),V.getNotifier(this.store).subscribe(this.tokenValueChangeHandler),e instanceof Hn?e.$fastController.addBehaviors([this]):e.isConnected&&this.bind()}static getOrCreate(e){return es.get(e)||new ae(e)}static existsFor(e){return es.has(e)}static findParent(e){if(Ct!==e.target){let t=Lo(e.target);for(;t!==null;){if(es.has(t))return es.get(t);t=Lo(t)}return ae.getOrCreate(Ct)}return null}static findClosestAssignedNode(e,t){let s=t;do{if(s.has(e))return s;s=s.parent?s.parent:s.target!==Ct?ae.getOrCreate(Ct):null}while(s!==null);return null}get parent(){return ts.get(this)||null}updateCSSTokenReflection(e,t){if(Ie.isCSSDesignToken(t)){const s=this.parent,n=this.isReflecting(t);if(s){const o=s.get(t),r=e.get(t);o!==r&&!n?this.reflectToCSS(t):o===r&&n&&this.stopReflectToCSS(t)}else n||this.reflectToCSS(t)}}has(e){return this.assignedValues.has(e)}get(e){const t=this.store.get(e);if(t!==void 0)return t;const s=this.getRaw(e);if(s!==void 0)return this.hydrate(e,s),this.get(e)}getRaw(e){var t;return this.assignedValues.has(e)?this.assignedValues.get(e):(t=ae.findClosestAssignedNode(e,this))===null||t===void 0?void 0:t.getRaw(e)}set(e,t){Ie.isDerivedDesignTokenValue(this.assignedValues.get(e))&&this.tearDownBindingObserver(e),this.assignedValues.set(e,t),Ie.isDerivedDesignTokenValue(t)?this.setupBindingObserver(e,t):this.store.set(e,t)}delete(e){this.assignedValues.delete(e),this.tearDownBindingObserver(e);const t=this.getRaw(e);t?this.hydrate(e,t):this.store.delete(e)}bind(){const e=ae.findParent(this);e&&e.appendChild(this);for(const t of this.assignedValues.keys())t.notify(this.target)}unbind(){this.parent&&ts.get(this).removeChild(this);for(const e of this.bindingObservers.keys())this.tearDownBindingObserver(e)}appendChild(e){e.parent&&ts.get(e).removeChild(e);const t=this.children.filter(s=>e.contains(s));ts.set(e,this),this.children.push(e),t.forEach(s=>e.appendChild(s)),V.getNotifier(this.store).subscribe(e);for(const[s,n]of this.store.all())e.hydrate(s,this.bindingObservers.has(s)?this.getRaw(s):n),e.updateCSSTokenReflection(e.store,s)}removeChild(e){const t=this.children.indexOf(e);if(t!==-1&&this.children.splice(t,1),V.getNotifier(this.store).unsubscribe(e),e.parent!==this)return!1;const s=ts.delete(e);for(const[n]of this.store.all())e.hydrate(n,e.getRaw(n)),e.updateCSSTokenReflection(e.store,n);return s}contains(e){return og(this.target,e.target)}reflectToCSS(e){this.isReflecting(e)||(this.reflecting.add(e),ae.cssCustomPropertyReflector.startReflection(e,this.target))}stopReflectToCSS(e){this.isReflecting(e)&&(this.reflecting.delete(e),ae.cssCustomPropertyReflector.stopReflection(e,this.target))}isReflecting(e){return this.reflecting.has(e)}handleChange(e,t){const s=Ie.getTokenById(t);s&&(this.hydrate(s,this.getRaw(s)),this.updateCSSTokenReflection(this.store,s))}hydrate(e,t){if(!this.has(e)){const s=this.bindingObservers.get(e);Ie.isDerivedDesignTokenValue(t)?s?s.source!==t&&(this.tearDownBindingObserver(e),this.setupBindingObserver(e,t)):this.setupBindingObserver(e,t):(s&&this.tearDownBindingObserver(e),this.store.set(e,t))}}setupBindingObserver(e,t){const s=new fg(t,e,this);return this.bindingObservers.set(e,s),s}tearDownBindingObserver(e){return this.bindingObservers.has(e)?(this.bindingObservers.get(e).disconnect(),this.bindingObservers.delete(e),!0):!1}}ae.cssCustomPropertyReflector=new ug;p([I],ae.prototype,"children",void 0);function gg(i){return Ie.from(i)}const Xc=Object.freeze({create:gg,notifyConnection(i){return!i.isConnected||!ae.existsFor(i)?!1:(ae.getOrCreate(i).bind(),!0)},notifyDisconnection(i){return i.isConnected||!ae.existsFor(i)?!1:(ae.getOrCreate(i).unbind(),!0)},registerRoot(i=Ct){fe.registerRoot(i)},unregisterRoot(i=Ct){fe.unregisterRoot(i)}}),xo=Object.freeze({definitionCallbackOnly:null,ignoreDuplicate:Symbol()}),$o=new Map,cn=new Map;let _i=null;const is=re.createInterface(i=>i.cachedCallback(e=>(_i===null&&(_i=new Kc(null,e)),_i))),Zc=Object.freeze({tagFor(i){return cn.get(i)},responsibleFor(i){const e=i.$$designSystem$$;return e||re.findResponsibleContainer(i).get(is)},getOrCreate(i){if(!i)return _i===null&&(_i=re.getOrCreateDOMContainer().get(is)),_i;const e=i.$$designSystem$$;if(e)return e;const t=re.getOrCreateDOMContainer(i);if(t.has(is,!1))return t.get(is);{const s=new Kc(i,t);return t.register(As.instance(is,s)),s}}});function bg(i,e,t){return typeof i=="string"?{name:i,type:e,callback:t}:i}class Kc{constructor(e,t){this.owner=e,this.container=t,this.designTokensInitialized=!1,this.prefix="fast",this.shadowRootMode=void 0,this.disambiguate=()=>xo.definitionCallbackOnly,e!==null&&(e.$$designSystem$$=this)}withPrefix(e){return this.prefix=e,this}withShadowRootMode(e){return this.shadowRootMode=e,this}withElementDisambiguation(e){return this.disambiguate=e,this}withDesignTokenRoot(e){return this.designTokenRoot=e,this}register(...e){const t=this.container,s=[],n=this.disambiguate,o=this.shadowRootMode,r={elementPrefix:this.prefix,tryDefineElement(l,a,d){const c=bg(l,a,d),{name:h,callback:g,baseClass:$}=c;let{type:T}=c,R=h,W=$o.get(R),L=!0;for(;W;){const z=n(R,T,W);switch(z){case xo.ignoreDuplicate:return;case xo.definitionCallbackOnly:L=!1,W=void 0;break;default:R=z,W=$o.get(R);break}}L&&((cn.has(T)||T===se)&&(T=class extends T{}),$o.set(R,T),cn.set(T,R),$&&cn.set($,R)),s.push(new mg(t,R,T,o,g,L))}};this.designTokensInitialized||(this.designTokensInitialized=!0,this.designTokenRoot!==null&&Xc.registerRoot(this.designTokenRoot)),t.registerWithContext(r,...e);for(const l of s)l.callback(l),l.willDefine&&l.definition!==null&&l.definition.define();return this}}class mg{constructor(e,t,s,n,o,r){this.container=e,this.name=t,this.type=s,this.shadowRootMode=n,this.callback=o,this.willDefine=r,this.definition=null}definePresentation(e){Gc.define(this.name,e,this.container)}defineElement(e){this.definition=new Mn(this.type,Object.assign(Object.assign({},e),{name:this.name}))}tagFor(e){return Zc.tagFor(e)}}const vg=(i,e)=>G`
    <template role="${t=>t.role}" aria-orientation="${t=>t.orientation}"></template>
`,yg={separator:"separator"};let Tr=class extends se{constructor(){super(...arguments),this.role=yg.separator,this.orientation=wr.horizontal}};p([m],Tr.prototype,"role",void 0);p([m],Tr.prototype,"orientation",void 0);const xg=(i,e)=>G`
    <template
        aria-checked="${t=>t.ariaChecked}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-posinset="${t=>t.ariaPosInSet}"
        aria-selected="${t=>t.ariaSelected}"
        aria-setsize="${t=>t.ariaSetSize}"
        class="${t=>[t.checked&&"checked",t.selected&&"selected",t.disabled&&"disabled"].filter(Boolean).join(" ")}"
        role="option"
    >
        ${Vi(i,e)}
        <span class="content" part="content">
            <slot ${Qe("content")}></slot>
        </span>
        ${Ni(i,e)}
    </template>
`;class jn extends Ee{constructor(){super(...arguments),this.activeIndex=-1,this.rangeStartIndex=-1}get activeOption(){return this.options[this.activeIndex]}get checkedOptions(){var e;return(e=this.options)===null||e===void 0?void 0:e.filter(t=>t.checked)}get firstSelectedOptionIndex(){return this.options.indexOf(this.firstSelectedOption)}activeIndexChanged(e,t){var s,n;this.ariaActiveDescendant=(n=(s=this.options[t])===null||s===void 0?void 0:s.id)!==null&&n!==void 0?n:"",this.focusAndScrollOptionIntoView()}checkActiveIndex(){if(!this.multiple)return;const e=this.activeOption;e&&(e.checked=!0)}checkFirstOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex+1),this.options.forEach((t,s)=>{t.checked=Ys(s,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex=0,this.checkActiveIndex()}checkLastOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((t,s)=>{t.checked=Ys(s,this.rangeStartIndex,this.options.length)})):this.uncheckAllOptions(),this.activeIndex=this.options.length-1,this.checkActiveIndex()}connectedCallback(){super.connectedCallback(),this.addEventListener("focusout",this.focusoutHandler)}disconnectedCallback(){this.removeEventListener("focusout",this.focusoutHandler),super.disconnectedCallback()}checkNextOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.options.forEach((t,s)=>{t.checked=Ys(s,this.rangeStartIndex,this.activeIndex+1)})):this.uncheckAllOptions(),this.activeIndex+=this.activeIndex<this.options.length-1?1:0,this.checkActiveIndex()}checkPreviousOption(e=!1){e?(this.rangeStartIndex===-1&&(this.rangeStartIndex=this.activeIndex),this.checkedOptions.length===1&&(this.rangeStartIndex+=1),this.options.forEach((t,s)=>{t.checked=Ys(s,this.activeIndex,this.rangeStartIndex)})):this.uncheckAllOptions(),this.activeIndex-=this.activeIndex>0?1:0,this.checkActiveIndex()}clickHandler(e){var t;if(!this.multiple)return super.clickHandler(e);const s=(t=e.target)===null||t===void 0?void 0:t.closest("[role=option]");if(!(!s||s.disabled))return this.uncheckAllOptions(),this.activeIndex=this.options.indexOf(s),this.checkActiveIndex(),this.toggleSelectedForAllCheckedOptions(),!0}focusAndScrollOptionIntoView(){super.focusAndScrollOptionIntoView(this.activeOption)}focusinHandler(e){if(!this.multiple)return super.focusinHandler(e);!this.shouldSkipFocus&&e.target===e.currentTarget&&(this.uncheckAllOptions(),this.activeIndex===-1&&(this.activeIndex=this.firstSelectedOptionIndex!==-1?this.firstSelectedOptionIndex:0),this.checkActiveIndex(),this.setSelectedOptions(),this.focusAndScrollOptionIntoView()),this.shouldSkipFocus=!1}focusoutHandler(e){this.multiple&&this.uncheckAllOptions()}keydownHandler(e){if(!this.multiple)return super.keydownHandler(e);if(this.disabled)return!0;const{key:t,shiftKey:s}=e;switch(this.shouldSkipFocus=!1,t){case ji:{this.checkFirstOption(s);return}case hi:{this.checkNextOption(s);return}case ui:{this.checkPreviousOption(s);return}case zi:{this.checkLastOption(s);return}case Cr:return this.focusAndScrollOptionIntoView(),!0;case Ln:return this.uncheckAllOptions(),this.checkActiveIndex(),!0;case Fs:if(e.preventDefault(),this.typeAheadExpired){this.toggleSelectedForAllCheckedOptions();return}default:return t.length===1&&this.handleTypeAhead(`${t}`),!0}}mousedownHandler(e){if(e.offsetX>=0&&e.offsetX<=this.scrollWidth)return super.mousedownHandler(e)}multipleChanged(e,t){var s;this.ariaMultiSelectable=t?"true":null,(s=this.options)===null||s===void 0||s.forEach(n=>{n.checked=t?!1:void 0}),this.setSelectedOptions()}setSelectedOptions(){if(!this.multiple){super.setSelectedOptions();return}this.$fastController.isConnected&&this.options&&(this.selectedOptions=this.options.filter(e=>e.selected),this.focusAndScrollOptionIntoView())}sizeChanged(e,t){var s;const n=Math.max(0,parseInt((s=t==null?void 0:t.toFixed())!==null&&s!==void 0?s:"",10));n!==t&&j.queueUpdate(()=>{this.size=n})}toggleSelectedForAllCheckedOptions(){const e=this.checkedOptions.filter(s=>!s.disabled),t=!e.every(s=>s.selected);e.forEach(s=>s.selected=t),this.selectedIndex=this.options.indexOf(e[e.length-1]),this.setSelectedOptions()}typeaheadBufferChanged(e,t){if(!this.multiple){super.typeaheadBufferChanged(e,t);return}if(this.$fastController.isConnected){const s=this.getTypeaheadMatches(),n=this.options.indexOf(s[0]);n>-1&&(this.activeIndex=n,this.uncheckAllOptions(),this.checkActiveIndex()),this.typeAheadExpired=!1}}uncheckAllOptions(e=!1){this.options.forEach(t=>t.checked=this.multiple?!1:void 0),e||(this.rangeStartIndex=-1)}}p([I],jn.prototype,"activeIndex",void 0);p([m({mode:"boolean"})],jn.prototype,"multiple",void 0);p([m({converter:it})],jn.prototype,"size",void 0);class $g extends se{}class wg extends Ms($g){constructor(){super(...arguments),this.proxy=document.createElement("input")}}const Cg={text:"text"};let ze=class extends wg{constructor(){super(...arguments),this.type=Cg.text}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly,this.validate())}autofocusChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.autofocus=this.autofocus,this.validate())}placeholderChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.placeholder=this.placeholder)}typeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.type=this.type,this.validate())}listChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.setAttribute("list",this.list),this.validate())}maxlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.maxLength=this.maxlength,this.validate())}minlengthChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.minLength=this.minlength,this.validate())}patternChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.pattern=this.pattern,this.validate())}sizeChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.size=this.size)}spellcheckChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.spellcheck=this.spellcheck)}connectedCallback(){super.connectedCallback(),this.proxy.setAttribute("type",this.type),this.validate(),this.autofocus&&j.queueUpdate(()=>{this.focus()})}select(){this.control.select(),this.$emit("select")}handleTextInput(){this.value=this.control.value}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}};p([m({attribute:"readonly",mode:"boolean"})],ze.prototype,"readOnly",void 0);p([m({mode:"boolean"})],ze.prototype,"autofocus",void 0);p([m],ze.prototype,"placeholder",void 0);p([m],ze.prototype,"type",void 0);p([m],ze.prototype,"list",void 0);p([m({converter:it})],ze.prototype,"maxlength",void 0);p([m({converter:it})],ze.prototype,"minlength",void 0);p([m],ze.prototype,"pattern",void 0);p([m({converter:it})],ze.prototype,"size",void 0);p([m({mode:"boolean"})],ze.prototype,"spellcheck",void 0);p([I],ze.prototype,"defaultSlottedNodes",void 0);class _r{}Le(_r,ne);Le(ze,Li,_r);const Kl=44,kg=(i,e)=>G`
    <template
        role="progressbar"
        aria-valuenow="${t=>t.value}"
        aria-valuemin="${t=>t.min}"
        aria-valuemax="${t=>t.max}"
        class="${t=>t.paused?"paused":""}"
    >
        ${xr(t=>typeof t.value=="number",G`
                <svg
                    class="progress"
                    part="progress"
                    viewBox="0 0 16 16"
                    slot="determinate"
                >
                    <circle
                        class="background"
                        part="background"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                    <circle
                        class="determinate"
                        part="determinate"
                        style="stroke-dasharray: ${t=>Kl*t.percentComplete/100}px ${Kl}px"
                        cx="8px"
                        cy="8px"
                        r="7px"
                    ></circle>
                </svg>
            `,G`
                <slot name="indeterminate" slot="indeterminate">
                    ${e.indeterminateIndicator||""}
                </slot>
            `)}
    </template>
`;class qi extends se{constructor(){super(...arguments),this.percentComplete=0}valueChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}minChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}maxChanged(){this.$fastController.isConnected&&this.updatePercentComplete()}connectedCallback(){super.connectedCallback(),this.updatePercentComplete()}updatePercentComplete(){const e=typeof this.min=="number"?this.min:0,t=typeof this.max=="number"?this.max:100,s=typeof this.value=="number"?this.value:0,n=t-e;this.percentComplete=n===0?0:Math.fround((s-e)/n*100)}}p([m({converter:it})],qi.prototype,"value",void 0);p([m({converter:it})],qi.prototype,"min",void 0);p([m({converter:it})],qi.prototype,"max",void 0);p([m({mode:"boolean"})],qi.prototype,"paused",void 0);p([I],qi.prototype,"percentComplete",void 0);const Sg=(i,e)=>G`
    <template
        role="radiogroup"
        aria-disabled="${t=>t.disabled}"
        aria-readonly="${t=>t.readOnly}"
        @click="${(t,s)=>t.clickHandler(s.event)}"
        @keydown="${(t,s)=>t.keydownHandler(s.event)}"
        @focusout="${(t,s)=>t.focusOutHandler(s.event)}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${t=>t.orientation===wr.horizontal?"horizontal":"vertical"}"
            part="positioning-region"
        >
            <slot
                ${Qe({property:"slottedRadioButtons",filter:$r("[role=radio]")})}
            ></slot>
        </div>
    </template>
`;let qt=class extends se{constructor(){super(...arguments),this.orientation=wr.horizontal,this.radioChangeHandler=e=>{const t=e.target;t.checked&&(this.slottedRadioButtons.forEach(s=>{s!==t&&(s.checked=!1,this.isInsideFoundationToolbar||s.setAttribute("tabindex","-1"))}),this.selectedRadio=t,this.value=t.value,t.setAttribute("tabindex","0"),this.focusedRadio=t),e.stopPropagation()},this.moveToRadioByIndex=(e,t)=>{const s=e[t];this.isInsideToolbar||(s.setAttribute("tabindex","0"),s.readOnly?this.slottedRadioButtons.forEach(n=>{n!==s&&n.setAttribute("tabindex","-1")}):(s.checked=!0,this.selectedRadio=s)),this.focusedRadio=s,s.focus()},this.moveRightOffGroup=()=>{var e;(e=this.nextElementSibling)===null||e===void 0||e.focus()},this.moveLeftOffGroup=()=>{var e;(e=this.previousElementSibling)===null||e===void 0||e.focus()},this.focusOutHandler=e=>{const t=this.slottedRadioButtons,s=e.target,n=s!==null?t.indexOf(s):0,o=this.focusedRadio?t.indexOf(this.focusedRadio):-1;return(o===0&&n===o||o===t.length-1&&o===n)&&(this.selectedRadio?(this.focusedRadio=this.selectedRadio,this.isInsideFoundationToolbar||(this.selectedRadio.setAttribute("tabindex","0"),t.forEach(r=>{r!==this.selectedRadio&&r.setAttribute("tabindex","-1")}))):(this.focusedRadio=t[0],this.focusedRadio.setAttribute("tabindex","0"),t.forEach(r=>{r!==this.focusedRadio&&r.setAttribute("tabindex","-1")}))),!0},this.clickHandler=e=>{const t=e.target;if(t){const s=this.slottedRadioButtons;t.checked||s.indexOf(t)===0?(t.setAttribute("tabindex","0"),this.selectedRadio=t):(t.setAttribute("tabindex","-1"),this.selectedRadio=null),this.focusedRadio=t}e.preventDefault()},this.shouldMoveOffGroupToTheRight=(e,t,s)=>e===t.length&&this.isInsideToolbar&&s===Es,this.shouldMoveOffGroupToTheLeft=(e,t)=>(this.focusedRadio?e.indexOf(this.focusedRadio)-1:0)<0&&this.isInsideToolbar&&t===Is,this.checkFocusedRadio=()=>{this.focusedRadio!==null&&!this.focusedRadio.readOnly&&!this.focusedRadio.checked&&(this.focusedRadio.checked=!0,this.focusedRadio.setAttribute("tabindex","0"),this.focusedRadio.focus(),this.selectedRadio=this.focusedRadio)},this.moveRight=e=>{const t=this.slottedRadioButtons;let s=0;if(s=this.focusedRadio?t.indexOf(this.focusedRadio)+1:1,this.shouldMoveOffGroupToTheRight(s,t,e.key)){this.moveRightOffGroup();return}else s===t.length&&(s=0);for(;s<t.length&&t.length>1;)if(t[s].disabled){if(this.focusedRadio&&s===t.indexOf(this.focusedRadio))break;if(s+1>=t.length){if(this.isInsideToolbar)break;s=0}else s+=1}else{this.moveToRadioByIndex(t,s);break}},this.moveLeft=e=>{const t=this.slottedRadioButtons;let s=0;if(s=this.focusedRadio?t.indexOf(this.focusedRadio)-1:0,s=s<0?t.length-1:s,this.shouldMoveOffGroupToTheLeft(t,e.key)){this.moveLeftOffGroup();return}for(;s>=0&&t.length>1;)if(t[s].disabled){if(this.focusedRadio&&s===t.indexOf(this.focusedRadio))break;s-1<0?s=t.length-1:s-=1}else{this.moveToRadioByIndex(t,s);break}},this.keydownHandler=e=>{const t=e.key;if(t in Np&&this.isInsideFoundationToolbar)return!0;switch(t){case Ds:{this.checkFocusedRadio();break}case Es:case hi:{this.direction===Mi.ltr?this.moveRight(e):this.moveLeft(e);break}case Is:case ui:{this.direction===Mi.ltr?this.moveLeft(e):this.moveRight(e);break}default:return!0}}}readOnlyChanged(){this.slottedRadioButtons!==void 0&&this.slottedRadioButtons.forEach(e=>{this.readOnly?e.readOnly=!0:e.readOnly=!1})}disabledChanged(){this.slottedRadioButtons!==void 0&&this.slottedRadioButtons.forEach(e=>{this.disabled?e.disabled=!0:e.disabled=!1})}nameChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach(e=>{e.setAttribute("name",this.name)})}valueChanged(){this.slottedRadioButtons&&this.slottedRadioButtons.forEach(e=>{e.value===this.value&&(e.checked=!0,this.selectedRadio=e)}),this.$emit("change")}slottedRadioButtonsChanged(e,t){this.slottedRadioButtons&&this.slottedRadioButtons.length>0&&this.setupRadioButtons()}get parentToolbar(){return this.closest('[role="toolbar"]')}get isInsideToolbar(){var e;return(e=this.parentToolbar)!==null&&e!==void 0?e:!1}get isInsideFoundationToolbar(){var e;return!!(!((e=this.parentToolbar)===null||e===void 0)&&e.$fastController)}connectedCallback(){super.connectedCallback(),this.direction=Up(this),this.setupRadioButtons()}disconnectedCallback(){this.slottedRadioButtons.forEach(e=>{e.removeEventListener("change",this.radioChangeHandler)})}setupRadioButtons(){const e=this.slottedRadioButtons.filter(n=>n.hasAttribute("checked")),t=e?e.length:0;if(t>1){const n=e[t-1];n.checked=!0}let s=!1;if(this.slottedRadioButtons.forEach(n=>{this.name!==void 0&&n.setAttribute("name",this.name),this.disabled&&(n.disabled=!0),this.readOnly&&(n.readOnly=!0),this.value&&this.value===n.value?(this.selectedRadio=n,this.focusedRadio=n,n.checked=!0,n.setAttribute("tabindex","0"),s=!0):(this.isInsideFoundationToolbar||n.setAttribute("tabindex","-1"),n.checked=!1),n.addEventListener("change",this.radioChangeHandler)}),this.value===void 0&&this.slottedRadioButtons.length>0){const n=this.slottedRadioButtons.filter(r=>r.hasAttribute("checked")),o=n!==null?n.length:0;if(o>0&&!s){const r=n[o-1];r.checked=!0,this.focusedRadio=r,r.setAttribute("tabindex","0")}else this.slottedRadioButtons[0].setAttribute("tabindex","0"),this.focusedRadio=this.slottedRadioButtons[0]}}};p([m({attribute:"readonly",mode:"boolean"})],qt.prototype,"readOnly",void 0);p([m({attribute:"disabled",mode:"boolean"})],qt.prototype,"disabled",void 0);p([m],qt.prototype,"name",void 0);p([m],qt.prototype,"value",void 0);p([m],qt.prototype,"orientation",void 0);p([I],qt.prototype,"childItems",void 0);p([I],qt.prototype,"slottedRadioButtons",void 0);const Tg=(i,e)=>G`
    <template
        role="radio"
        class="${t=>t.checked?"checked":""} ${t=>t.readOnly?"readonly":""}"
        aria-checked="${t=>t.checked}"
        aria-required="${t=>t.required}"
        aria-disabled="${t=>t.disabled}"
        aria-readonly="${t=>t.readOnly}"
        @keypress="${(t,s)=>t.keypressHandler(s.event)}"
        @click="${(t,s)=>t.clickHandler(s.event)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                ${e.checkedIndicator||""}
            </slot>
        </div>
        <label
            part="label"
            class="${t=>t.defaultSlottedNodes&&t.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Qe("defaultSlottedNodes")}></slot>
        </label>
    </template>
`;class _g extends se{}class Ag extends Qc(_g){constructor(){super(...arguments),this.proxy=document.createElement("input")}}let zn=class extends Ag{constructor(){super(),this.initialValue="on",this.keypressHandler=e=>{switch(e.key){case Fs:!this.checked&&!this.readOnly&&(this.checked=!0);return}return!0},this.proxy.setAttribute("type","radio")}readOnlyChanged(){this.proxy instanceof HTMLInputElement&&(this.proxy.readOnly=this.readOnly)}defaultCheckedChanged(){var e;this.$fastController.isConnected&&!this.dirtyChecked&&(this.isInsideRadioGroup()||(this.checked=(e=this.defaultChecked)!==null&&e!==void 0?e:!1,this.dirtyChecked=!1))}connectedCallback(){var e,t;super.connectedCallback(),this.validate(),((e=this.parentElement)===null||e===void 0?void 0:e.getAttribute("role"))!=="radiogroup"&&this.getAttribute("tabindex")===null&&(this.disabled||this.setAttribute("tabindex","0")),this.checkedAttribute&&(this.dirtyChecked||this.isInsideRadioGroup()||(this.checked=(t=this.defaultChecked)!==null&&t!==void 0?t:!1,this.dirtyChecked=!1))}isInsideRadioGroup(){return this.closest("[role=radiogroup]")!==null}clickHandler(e){!this.disabled&&!this.readOnly&&!this.checked&&(this.checked=!0)}};p([m({attribute:"readonly",mode:"boolean"})],zn.prototype,"readOnly",void 0);p([I],zn.prototype,"name",void 0);p([I],zn.prototype,"defaultSlottedNodes",void 0);function Ig(i,e,t){return i.nodeType!==Node.TEXT_NODE?!0:typeof i.nodeValue=="string"&&!!i.nodeValue.trim().length}class Eg extends jn{}class Og extends Ms(Eg){constructor(){super(...arguments),this.proxy=document.createElement("select")}}class Gt extends Og{constructor(){super(...arguments),this.open=!1,this.forcedPosition=!1,this.listboxId=Cn("listbox-"),this.maxHeight=0}openChanged(e,t){if(this.collapsible){if(this.open){this.ariaControls=this.listboxId,this.ariaExpanded="true",this.setPositioning(),this.focusAndScrollOptionIntoView(),this.indexWhenOpened=this.selectedIndex,j.queueUpdate(()=>this.focus());return}this.ariaControls="",this.ariaExpanded="false"}}get collapsible(){return!(this.multiple||typeof this.size=="number")}get value(){return V.track(this,"value"),this._value}set value(e){var t,s,n,o,r,l,a;const d=`${this._value}`;if(!((t=this._options)===null||t===void 0)&&t.length){const c=this._options.findIndex($=>$.value===e),h=(n=(s=this._options[this.selectedIndex])===null||s===void 0?void 0:s.value)!==null&&n!==void 0?n:null,g=(r=(o=this._options[c])===null||o===void 0?void 0:o.value)!==null&&r!==void 0?r:null;(c===-1||h!==g)&&(e="",this.selectedIndex=c),e=(a=(l=this.firstSelectedOption)===null||l===void 0?void 0:l.value)!==null&&a!==void 0?a:e}d!==e&&(this._value=e,super.valueChanged(d,e),V.notify(this,"value"),this.updateDisplayValue())}updateValue(e){var t,s;this.$fastController.isConnected&&(this.value=(s=(t=this.firstSelectedOption)===null||t===void 0?void 0:t.value)!==null&&s!==void 0?s:""),e&&(this.$emit("input"),this.$emit("change",this,{bubbles:!0,composed:void 0}))}selectedIndexChanged(e,t){super.selectedIndexChanged(e,t),this.updateValue()}positionChanged(e,t){this.positionAttribute=t,this.setPositioning()}setPositioning(){const e=this.getBoundingClientRect(),s=window.innerHeight-e.bottom;this.position=this.forcedPosition?this.positionAttribute:e.top>s?vo.above:vo.below,this.positionAttribute=this.forcedPosition?this.positionAttribute:this.position,this.maxHeight=this.position===vo.above?~~e.top:~~s}get displayValue(){var e,t;return V.track(this,"displayValue"),(t=(e=this.firstSelectedOption)===null||e===void 0?void 0:e.text)!==null&&t!==void 0?t:""}disabledChanged(e,t){super.disabledChanged&&super.disabledChanged(e,t),this.ariaDisabled=this.disabled?"true":"false"}formResetCallback(){this.setProxyOptions(),super.setDefaultSelectedOption(),this.selectedIndex===-1&&(this.selectedIndex=0)}clickHandler(e){if(!this.disabled){if(this.open){const t=e.target.closest("option,[role=option]");if(t&&t.disabled)return}return super.clickHandler(e),this.open=this.collapsible&&!this.open,!this.open&&this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0),!0}}focusoutHandler(e){var t;if(super.focusoutHandler(e),!this.open)return!0;const s=e.relatedTarget;if(this.isSameNode(s)){this.focus();return}!((t=this.options)===null||t===void 0)&&t.includes(s)||(this.open=!1,this.indexWhenOpened!==this.selectedIndex&&this.updateValue(!0))}handleChange(e,t){super.handleChange(e,t),t==="value"&&this.updateValue()}slottedOptionsChanged(e,t){this.options.forEach(s=>{V.getNotifier(s).unsubscribe(this,"value")}),super.slottedOptionsChanged(e,t),this.options.forEach(s=>{V.getNotifier(s).subscribe(this,"value")}),this.setProxyOptions(),this.updateValue()}mousedownHandler(e){var t;return e.offsetX>=0&&e.offsetX<=((t=this.listbox)===null||t===void 0?void 0:t.scrollWidth)?super.mousedownHandler(e):this.collapsible}multipleChanged(e,t){super.multipleChanged(e,t),this.proxy&&(this.proxy.multiple=t)}selectedOptionsChanged(e,t){var s;super.selectedOptionsChanged(e,t),(s=this.options)===null||s===void 0||s.forEach((n,o)=>{var r;const l=(r=this.proxy)===null||r===void 0?void 0:r.options.item(o);l&&(l.selected=n.selected)})}setDefaultSelectedOption(){var e;const t=(e=this.options)!==null&&e!==void 0?e:Array.from(this.children).filter(Ee.slottedOptionFilter),s=t==null?void 0:t.findIndex(n=>n.hasAttribute("selected")||n.selected||n.value===this.value);if(s!==-1){this.selectedIndex=s;return}this.selectedIndex=0}setProxyOptions(){this.proxy instanceof HTMLSelectElement&&this.options&&(this.proxy.options.length=0,this.options.forEach(e=>{const t=e.proxy||(e instanceof HTMLOptionElement?e.cloneNode():null);t&&this.proxy.options.add(t)}))}keydownHandler(e){super.keydownHandler(e);const t=e.key||e.key.charCodeAt(0);switch(t){case Fs:{e.preventDefault(),this.collapsible&&this.typeAheadExpired&&(this.open=!this.open);break}case ji:case zi:{e.preventDefault();break}case Ds:{e.preventDefault(),this.open=!this.open;break}case Ln:{this.collapsible&&this.open&&(e.preventDefault(),this.open=!1);break}case Cr:return this.collapsible&&this.open&&(e.preventDefault(),this.open=!1),!0}return!this.open&&this.indexWhenOpened!==this.selectedIndex&&(this.updateValue(!0),this.indexWhenOpened=this.selectedIndex),!(t===hi||t===ui)}connectedCallback(){super.connectedCallback(),this.forcedPosition=!!this.positionAttribute,this.addEventListener("contentchange",this.updateDisplayValue)}disconnectedCallback(){this.removeEventListener("contentchange",this.updateDisplayValue),super.disconnectedCallback()}sizeChanged(e,t){super.sizeChanged(e,t),this.proxy&&(this.proxy.size=t)}updateDisplayValue(){this.collapsible&&V.notify(this,"displayValue")}}p([m({attribute:"open",mode:"boolean"})],Gt.prototype,"open",void 0);p([Pf],Gt.prototype,"collapsible",null);p([I],Gt.prototype,"control",void 0);p([m({attribute:"position"})],Gt.prototype,"positionAttribute",void 0);p([I],Gt.prototype,"position",void 0);p([I],Gt.prototype,"maxHeight",void 0);class Ar{}p([I],Ar.prototype,"ariaControls",void 0);Le(Ar,fi);Le(Gt,Li,Ar);const Rg=(i,e)=>G`
    <template
        class="${t=>[t.collapsible&&"collapsible",t.collapsible&&t.open&&"open",t.disabled&&"disabled",t.collapsible&&t.position].filter(Boolean).join(" ")}"
        aria-activedescendant="${t=>t.ariaActiveDescendant}"
        aria-controls="${t=>t.ariaControls}"
        aria-disabled="${t=>t.ariaDisabled}"
        aria-expanded="${t=>t.ariaExpanded}"
        aria-haspopup="${t=>t.collapsible?"listbox":null}"
        aria-multiselectable="${t=>t.ariaMultiSelectable}"
        ?open="${t=>t.open}"
        role="combobox"
        tabindex="${t=>t.disabled?null:"0"}"
        @click="${(t,s)=>t.clickHandler(s.event)}"
        @focusin="${(t,s)=>t.focusinHandler(s.event)}"
        @focusout="${(t,s)=>t.focusoutHandler(s.event)}"
        @keydown="${(t,s)=>t.keydownHandler(s.event)}"
        @mousedown="${(t,s)=>t.mousedownHandler(s.event)}"
    >
        ${xr(t=>t.collapsible,G`
                <div
                    class="control"
                    part="control"
                    ?disabled="${t=>t.disabled}"
                    ${Oe("control")}
                >
                    ${Vi(i,e)}
                    <slot name="button-container">
                        <div class="selected-value" part="selected-value">
                            <slot name="selected-value">${t=>t.displayValue}</slot>
                        </div>
                        <div aria-hidden="true" class="indicator" part="indicator">
                            <slot name="indicator">
                                ${e.indicator||""}
                            </slot>
                        </div>
                    </slot>
                    ${Ni(i,e)}
                </div>
            `)}
        <div
            class="listbox"
            id="${t=>t.listboxId}"
            part="listbox"
            role="listbox"
            ?disabled="${t=>t.disabled}"
            ?hidden="${t=>t.collapsible?!t.open:!1}"
            ${Oe("listbox")}
        >
            <slot
                ${Qe({filter:Ee.slottedOptionFilter,flatten:!0,property:"slottedOptions"})}
            ></slot>
        </div>
    </template>
`,Pg=(i,e)=>G`
    <template slot="tabpanel" role="tabpanel">
        <slot></slot>
    </template>
`;class Dg extends se{}const Fg=(i,e)=>G`
    <template slot="tab" role="tab" aria-disabled="${t=>t.disabled}">
        <slot></slot>
    </template>
`;class ed extends se{}p([m({mode:"boolean"})],ed.prototype,"disabled",void 0);const Bg=(i,e)=>G`
    <template class="${t=>t.orientation}">
        ${Vi(i,e)}
        <div class="tablist" part="tablist" role="tablist">
            <slot class="tab" name="tab" part="tab" ${Qe("tabs")}></slot>

            ${xr(t=>t.showActiveIndicator,G`
                    <div
                        ${Oe("activeIndicatorRef")}
                        class="activeIndicator"
                        part="activeIndicator"
                    ></div>
                `)}
        </div>
        ${Ni(i,e)}
        <div class="tabpanel" part="tabpanel">
            <slot name="tabpanel" ${Qe("tabpanels")}></slot>
        </div>
    </template>
`,No={horizontal:"horizontal"};class Rt extends se{constructor(){super(...arguments),this.orientation=No.horizontal,this.activeindicator=!0,this.showActiveIndicator=!0,this.prevActiveTabIndex=0,this.activeTabIndex=0,this.ticking=!1,this.change=()=>{this.$emit("change",this.activetab)},this.isDisabledElement=e=>e.getAttribute("aria-disabled")==="true",this.isHiddenElement=e=>e.hasAttribute("hidden"),this.isFocusableElement=e=>!this.isDisabledElement(e)&&!this.isHiddenElement(e),this.setTabs=()=>{const e="gridColumn",t="gridRow",s=this.isHorizontal()?e:t;this.activeTabIndex=this.getActiveIndex(),this.showActiveIndicator=!1,this.tabs.forEach((n,o)=>{if(n.slot==="tab"){const r=this.activeTabIndex===o&&this.isFocusableElement(n);this.activeindicator&&this.isFocusableElement(n)&&(this.showActiveIndicator=!0);const l=this.tabIds[o],a=this.tabpanelIds[o];n.setAttribute("id",l),n.setAttribute("aria-selected",r?"true":"false"),n.setAttribute("aria-controls",a),n.addEventListener("click",this.handleTabClick),n.addEventListener("keydown",this.handleTabKeyDown),n.setAttribute("tabindex",r?"0":"-1"),r&&(this.activetab=n,this.activeid=l)}n.style[e]="",n.style[t]="",n.style[s]=`${o+1}`,this.isHorizontal()?n.classList.remove("vertical"):n.classList.add("vertical")})},this.setTabPanels=()=>{this.tabpanels.forEach((e,t)=>{const s=this.tabIds[t],n=this.tabpanelIds[t];e.setAttribute("id",n),e.setAttribute("aria-labelledby",s),this.activeTabIndex!==t?e.setAttribute("hidden",""):e.removeAttribute("hidden")})},this.handleTabClick=e=>{const t=e.currentTarget;t.nodeType===1&&this.isFocusableElement(t)&&(this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=this.tabs.indexOf(t),this.setComponent())},this.handleTabKeyDown=e=>{if(this.isHorizontal())switch(e.key){case Is:e.preventDefault(),this.adjustBackward(e);break;case Es:e.preventDefault(),this.adjustForward(e);break}else switch(e.key){case ui:e.preventDefault(),this.adjustBackward(e);break;case hi:e.preventDefault(),this.adjustForward(e);break}switch(e.key){case ji:e.preventDefault(),this.adjust(-this.activeTabIndex);break;case zi:e.preventDefault(),this.adjust(this.tabs.length-this.activeTabIndex-1);break}},this.adjustForward=e=>{const t=this.tabs;let s=0;for(s=this.activetab?t.indexOf(this.activetab)+1:1,s===t.length&&(s=0);s<t.length&&t.length>1;)if(this.isFocusableElement(t[s])){this.moveToTabByIndex(t,s);break}else{if(this.activetab&&s===t.indexOf(this.activetab))break;s+1>=t.length?s=0:s+=1}},this.adjustBackward=e=>{const t=this.tabs;let s=0;for(s=this.activetab?t.indexOf(this.activetab)-1:0,s=s<0?t.length-1:s;s>=0&&t.length>1;)if(this.isFocusableElement(t[s])){this.moveToTabByIndex(t,s);break}else s-1<0?s=t.length-1:s-=1},this.moveToTabByIndex=(e,t)=>{const s=e[t];this.activetab=s,this.prevActiveTabIndex=this.activeTabIndex,this.activeTabIndex=t,s.focus(),this.setComponent()}}orientationChanged(){this.$fastController.isConnected&&(this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}activeidChanged(e,t){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.prevActiveTabIndex=this.tabs.findIndex(s=>s.id===e),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabsChanged(){this.$fastController.isConnected&&this.tabs.length<=this.tabpanels.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}tabpanelsChanged(){this.$fastController.isConnected&&this.tabpanels.length<=this.tabs.length&&(this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.setTabs(),this.setTabPanels(),this.handleActiveIndicatorPosition())}getActiveIndex(){return this.activeid!==void 0?this.tabIds.indexOf(this.activeid)===-1?0:this.tabIds.indexOf(this.activeid):0}getTabIds(){return this.tabs.map(e=>{var t;return(t=e.getAttribute("id"))!==null&&t!==void 0?t:`tab-${Cn()}`})}getTabPanelIds(){return this.tabpanels.map(e=>{var t;return(t=e.getAttribute("id"))!==null&&t!==void 0?t:`panel-${Cn()}`})}setComponent(){this.activeTabIndex!==this.prevActiveTabIndex&&(this.activeid=this.tabIds[this.activeTabIndex],this.focusTab(),this.change())}isHorizontal(){return this.orientation===No.horizontal}handleActiveIndicatorPosition(){this.showActiveIndicator&&this.activeindicator&&this.activeTabIndex!==this.prevActiveTabIndex&&(this.ticking?this.ticking=!1:(this.ticking=!0,this.animateActiveIndicator()))}animateActiveIndicator(){this.ticking=!0;const e=this.isHorizontal()?"gridColumn":"gridRow",t=this.isHorizontal()?"translateX":"translateY",s=this.isHorizontal()?"offsetLeft":"offsetTop",n=this.activeIndicatorRef[s];this.activeIndicatorRef.style[e]=`${this.activeTabIndex+1}`;const o=this.activeIndicatorRef[s];this.activeIndicatorRef.style[e]=`${this.prevActiveTabIndex+1}`;const r=o-n;this.activeIndicatorRef.style.transform=`${t}(${r}px)`,this.activeIndicatorRef.classList.add("activeIndicatorTransition"),this.activeIndicatorRef.addEventListener("transitionend",()=>{this.ticking=!1,this.activeIndicatorRef.style[e]=`${this.activeTabIndex+1}`,this.activeIndicatorRef.style.transform=`${t}(0px)`,this.activeIndicatorRef.classList.remove("activeIndicatorTransition")})}adjust(e){const t=this.tabs.filter(r=>this.isFocusableElement(r)),s=t.indexOf(this.activetab),n=Vp(0,t.length-1,s+e),o=this.tabs.indexOf(t[n]);o>-1&&this.moveToTabByIndex(this.tabs,o)}focusTab(){this.tabs[this.activeTabIndex].focus()}connectedCallback(){super.connectedCallback(),this.tabIds=this.getTabIds(),this.tabpanelIds=this.getTabPanelIds(),this.activeTabIndex=this.getActiveIndex()}}p([m],Rt.prototype,"orientation",void 0);p([m],Rt.prototype,"activeid",void 0);p([I],Rt.prototype,"tabs",void 0);p([I],Rt.prototype,"tabpanels",void 0);p([m({mode:"boolean"})],Rt.prototype,"activeindicator",void 0);p([I],Rt.prototype,"activeIndicatorRef",void 0);p([I],Rt.prototype,"showActiveIndicator",void 0);Le(Rt,Li);class Mg extends se{}class Hg extends Ms(Mg){constructor(){super(...arguments),this.proxy=document.createElement("textarea")}}const td={none:"none"};let Pe=class extends Hg{constructor(){super(...arguments),this.resize=td.none,this.cols=20,this.handleTextInput=()=>{this.value=this.control.value}}readOnlyChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.readOnly=this.readOnly)}autofocusChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.autofocus=this.autofocus)}listChanged(){this.proxy instanceof HTMLTextAreaElement&&this.proxy.setAttribute("list",this.list)}maxlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.maxLength=this.maxlength)}minlengthChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.minLength=this.minlength)}spellcheckChanged(){this.proxy instanceof HTMLTextAreaElement&&(this.proxy.spellcheck=this.spellcheck)}select(){this.control.select(),this.$emit("select")}handleChange(){this.$emit("change")}validate(){super.validate(this.control)}};p([m({mode:"boolean"})],Pe.prototype,"readOnly",void 0);p([m],Pe.prototype,"resize",void 0);p([m({mode:"boolean"})],Pe.prototype,"autofocus",void 0);p([m({attribute:"form"})],Pe.prototype,"formId",void 0);p([m],Pe.prototype,"list",void 0);p([m({converter:it})],Pe.prototype,"maxlength",void 0);p([m({converter:it})],Pe.prototype,"minlength",void 0);p([m],Pe.prototype,"name",void 0);p([m],Pe.prototype,"placeholder",void 0);p([m({converter:it,mode:"fromView"})],Pe.prototype,"cols",void 0);p([m({converter:it,mode:"fromView"})],Pe.prototype,"rows",void 0);p([m({mode:"boolean"})],Pe.prototype,"spellcheck",void 0);p([I],Pe.prototype,"defaultSlottedNodes",void 0);Le(Pe,_r);const Lg=(i,e)=>G`
    <template
        class="
            ${t=>t.readOnly?"readonly":""}
            ${t=>t.resize!==td.none?`resize-${t.resize}`:""}"
    >
        <label
            part="label"
            for="control"
            class="${t=>t.defaultSlottedNodes&&t.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot ${Qe("defaultSlottedNodes")}></slot>
        </label>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${t=>t.autofocus}"
            cols="${t=>t.cols}"
            ?disabled="${t=>t.disabled}"
            form="${t=>t.form}"
            list="${t=>t.list}"
            maxlength="${t=>t.maxlength}"
            minlength="${t=>t.minlength}"
            name="${t=>t.name}"
            placeholder="${t=>t.placeholder}"
            ?readonly="${t=>t.readOnly}"
            ?required="${t=>t.required}"
            rows="${t=>t.rows}"
            ?spellcheck="${t=>t.spellcheck}"
            :value="${t=>t.value}"
            aria-atomic="${t=>t.ariaAtomic}"
            aria-busy="${t=>t.ariaBusy}"
            aria-controls="${t=>t.ariaControls}"
            aria-current="${t=>t.ariaCurrent}"
            aria-describedby="${t=>t.ariaDescribedby}"
            aria-details="${t=>t.ariaDetails}"
            aria-disabled="${t=>t.ariaDisabled}"
            aria-errormessage="${t=>t.ariaErrormessage}"
            aria-flowto="${t=>t.ariaFlowto}"
            aria-haspopup="${t=>t.ariaHaspopup}"
            aria-hidden="${t=>t.ariaHidden}"
            aria-invalid="${t=>t.ariaInvalid}"
            aria-keyshortcuts="${t=>t.ariaKeyshortcuts}"
            aria-label="${t=>t.ariaLabel}"
            aria-labelledby="${t=>t.ariaLabelledby}"
            aria-live="${t=>t.ariaLive}"
            aria-owns="${t=>t.ariaOwns}"
            aria-relevant="${t=>t.ariaRelevant}"
            aria-roledescription="${t=>t.ariaRoledescription}"
            @input="${(t,s)=>t.handleTextInput()}"
            @change="${t=>t.handleChange()}"
            ${Oe("control")}
        ></textarea>
    </template>
`,Ng=(i,e)=>G`
    <template
        class="
            ${t=>t.readOnly?"readonly":""}
        "
    >
        <label
            part="label"
            for="control"
            class="${t=>t.defaultSlottedNodes&&t.defaultSlottedNodes.length?"label":"label label__hidden"}"
        >
            <slot
                ${Qe({property:"defaultSlottedNodes",filter:Ig})}
            ></slot>
        </label>
        <div class="root" part="root">
            ${Vi(i,e)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${t=>t.handleTextInput()}"
                @change="${t=>t.handleChange()}"
                ?autofocus="${t=>t.autofocus}"
                ?disabled="${t=>t.disabled}"
                list="${t=>t.list}"
                maxlength="${t=>t.maxlength}"
                minlength="${t=>t.minlength}"
                pattern="${t=>t.pattern}"
                placeholder="${t=>t.placeholder}"
                ?readonly="${t=>t.readOnly}"
                ?required="${t=>t.required}"
                size="${t=>t.size}"
                ?spellcheck="${t=>t.spellcheck}"
                :value="${t=>t.value}"
                type="${t=>t.type}"
                aria-atomic="${t=>t.ariaAtomic}"
                aria-busy="${t=>t.ariaBusy}"
                aria-controls="${t=>t.ariaControls}"
                aria-current="${t=>t.ariaCurrent}"
                aria-describedby="${t=>t.ariaDescribedby}"
                aria-details="${t=>t.ariaDetails}"
                aria-disabled="${t=>t.ariaDisabled}"
                aria-errormessage="${t=>t.ariaErrormessage}"
                aria-flowto="${t=>t.ariaFlowto}"
                aria-haspopup="${t=>t.ariaHaspopup}"
                aria-hidden="${t=>t.ariaHidden}"
                aria-invalid="${t=>t.ariaInvalid}"
                aria-keyshortcuts="${t=>t.ariaKeyshortcuts}"
                aria-label="${t=>t.ariaLabel}"
                aria-labelledby="${t=>t.ariaLabelledby}"
                aria-live="${t=>t.ariaLive}"
                aria-owns="${t=>t.ariaOwns}"
                aria-relevant="${t=>t.ariaRelevant}"
                aria-roledescription="${t=>t.ariaRoledescription}"
                ${Oe("control")}
            />
            ${Ni(i,e)}
        </div>
    </template>
`,zt="not-allowed",Vg=":host([hidden]){display:none}";function Ce(i){return`${Vg}:host{display:${i}}`}const xe=Bp()?"focus-visible":"focus";function jg(i){return Zc.getOrCreate(i).withPrefix("vscode")}function zg(i){window.addEventListener("load",()=>{new MutationObserver(()=>{ea(i)}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),ea(i)})}function ea(i){const e=getComputedStyle(document.body),t=document.querySelector("body");if(t){const s=t.getAttribute("data-vscode-theme-kind");for(const[n,o]of i){let r=e.getPropertyValue(n).toString();if(s==="vscode-high-contrast")r.length===0&&o.name.includes("background")&&(r="transparent"),o.name==="button-icon-hover-background"&&(r="transparent");else if(s==="vscode-high-contrast-light"){if(r.length===0&&o.name.includes("background"))switch(o.name){case"button-primary-hover-background":r="#0F4A85";break;case"button-secondary-hover-background":r="transparent";break;case"button-icon-hover-background":r="transparent";break}}else o.name==="contrast-active-border"&&(r="transparent");o.setValueFor(t,r)}}}const ta=new Map;let ia=!1;function A(i,e){const t=Xc.create(i);if(e){if(e.includes("--fake-vscode-token")){const s="id"+Math.random().toString(16).slice(2);e=`${e}-${s}`}ta.set(e,t)}return ia||(zg(ta),ia=!0),t}const Ug=A("background","--vscode-editor-background").withDefault("#1e1e1e"),q=A("border-width").withDefault(1),id=A("contrast-active-border","--vscode-contrastActiveBorder").withDefault("#f38518");A("contrast-border","--vscode-contrastBorder").withDefault("#6fc3df");const Hs=A("corner-radius").withDefault(0),Ai=A("corner-radius-round").withDefault(2),F=A("design-unit").withDefault(4),pi=A("disabled-opacity").withDefault(.4),ce=A("focus-border","--vscode-focusBorder").withDefault("#007fd4"),Ye=A("font-family","--vscode-font-family").withDefault("-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol");A("font-weight","--vscode-font-weight").withDefault("400");const ve=A("foreground","--vscode-foreground").withDefault("#cccccc"),dn=A("input-height").withDefault("26"),Ir=A("input-min-width").withDefault("100px"),Re=A("type-ramp-base-font-size","--vscode-font-size").withDefault("13px"),He=A("type-ramp-base-line-height").withDefault("normal"),sd=A("type-ramp-minus1-font-size").withDefault("11px"),nd=A("type-ramp-minus1-line-height").withDefault("16px");A("type-ramp-minus2-font-size").withDefault("9px");A("type-ramp-minus2-line-height").withDefault("16px");A("type-ramp-plus1-font-size").withDefault("16px");A("type-ramp-plus1-line-height").withDefault("24px");const qg=A("scrollbarWidth").withDefault("10px"),Gg=A("scrollbarHeight").withDefault("10px"),Wg=A("scrollbar-slider-background","--vscode-scrollbarSlider-background").withDefault("#79797966"),Qg=A("scrollbar-slider-hover-background","--vscode-scrollbarSlider-hoverBackground").withDefault("#646464b3"),Yg=A("scrollbar-slider-active-background","--vscode-scrollbarSlider-activeBackground").withDefault("#bfbfbf66"),od=A("badge-background","--vscode-badge-background").withDefault("#4d4d4d"),rd=A("badge-foreground","--vscode-badge-foreground").withDefault("#ffffff"),Er=A("button-border","--vscode-button-border").withDefault("transparent"),sa=A("button-icon-background").withDefault("transparent"),Jg=A("button-icon-corner-radius").withDefault("5px"),Xg=A("button-icon-outline-offset").withDefault(0),na=A("button-icon-hover-background","--fake-vscode-token").withDefault("rgba(90, 93, 94, 0.31)"),Zg=A("button-icon-padding").withDefault("3px"),Ii=A("button-primary-background","--vscode-button-background").withDefault("#0e639c"),ld=A("button-primary-foreground","--vscode-button-foreground").withDefault("#ffffff"),ad=A("button-primary-hover-background","--vscode-button-hoverBackground").withDefault("#1177bb"),wo=A("button-secondary-background","--vscode-button-secondaryBackground").withDefault("#3a3d41"),Kg=A("button-secondary-foreground","--vscode-button-secondaryForeground").withDefault("#ffffff"),eb=A("button-secondary-hover-background","--vscode-button-secondaryHoverBackground").withDefault("#45494e"),tb=A("button-padding-horizontal").withDefault("11px"),ib=A("button-padding-vertical").withDefault("4px"),xt=A("checkbox-background","--vscode-checkbox-background").withDefault("#3c3c3c"),$i=A("checkbox-border","--vscode-checkbox-border").withDefault("#3c3c3c"),sb=A("checkbox-corner-radius").withDefault(3);A("checkbox-foreground","--vscode-checkbox-foreground").withDefault("#f0f0f0");const ei=A("list-active-selection-background","--vscode-list-activeSelectionBackground").withDefault("#094771"),Ei=A("list-active-selection-foreground","--vscode-list-activeSelectionForeground").withDefault("#ffffff"),nb=A("list-hover-background","--vscode-list-hoverBackground").withDefault("#2a2d2e"),ob=A("divider-background","--vscode-settings-dropdownListBorder").withDefault("#454545"),Xs=A("dropdown-background","--vscode-dropdown-background").withDefault("#3c3c3c"),Vt=A("dropdown-border","--vscode-dropdown-border").withDefault("#3c3c3c");A("dropdown-foreground","--vscode-dropdown-foreground").withDefault("#f0f0f0");const rb=A("dropdown-list-max-height").withDefault("200px"),si=A("input-background","--vscode-input-background").withDefault("#3c3c3c"),cd=A("input-foreground","--vscode-input-foreground").withDefault("#cccccc");A("input-placeholder-foreground","--vscode-input-placeholderForeground").withDefault("#cccccc");const oa=A("link-active-foreground","--vscode-textLink-activeForeground").withDefault("#3794ff"),lb=A("link-foreground","--vscode-textLink-foreground").withDefault("#3794ff"),ab=A("progress-background","--vscode-progressBar-background").withDefault("#0e70c0"),cb=A("panel-tab-active-border","--vscode-panelTitle-activeBorder").withDefault("#e7e7e7"),yi=A("panel-tab-active-foreground","--vscode-panelTitle-activeForeground").withDefault("#e7e7e7"),db=A("panel-tab-foreground","--vscode-panelTitle-inactiveForeground").withDefault("#e7e7e799");A("panel-view-background","--vscode-panel-background").withDefault("#1e1e1e");A("panel-view-border","--vscode-panel-border").withDefault("#80808059");const hb=A("tag-corner-radius").withDefault("2px"),ub=(i,e)=>le`
	${Ce("inline-block")} :host {
		box-sizing: border-box;
		font-family: ${Ye};
		font-size: ${sd};
		line-height: ${nd};
		text-align: center;
	}
	.control {
		align-items: center;
		background-color: ${od};
		border: calc(${q} * 1px) solid ${Er};
		border-radius: 11px;
		box-sizing: border-box;
		color: ${rd};
		display: flex;
		height: calc(${F} * 4px);
		justify-content: center;
		min-width: calc(${F} * 4px + 2px);
		min-height: calc(${F} * 4px + 2px);
		padding: 3px 6px;
	}
`;class fb extends Bs{connectedCallback(){super.connectedCallback(),this.circular||(this.circular=!0)}}const pb=fb.compose({baseName:"badge",template:Wc,styles:ub});function gb(i,e,t,s){var n=arguments.length,o=n<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,t):s,r;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(i,e,t,s);else for(var l=i.length-1;l>=0;l--)(r=i[l])&&(o=(n<3?r(o):n>3?r(e,t,o):r(e,t))||o);return n>3&&o&&Object.defineProperty(e,t,o),o}const bb=le`
	${Ce("inline-flex")} :host {
		outline: none;
		font-family: ${Ye};
		font-size: ${Re};
		line-height: ${He};
		color: ${ld};
		background: ${Ii};
		border-radius: calc(${Ai} * 1px);
		fill: currentColor;
		cursor: pointer;
	}
	.control {
		background: transparent;
		height: inherit;
		flex-grow: 1;
		box-sizing: border-box;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: ${ib} ${tb};
		white-space: wrap;
		outline: none;
		text-decoration: none;
		border: calc(${q} * 1px) solid ${Er};
		color: inherit;
		border-radius: inherit;
		fill: inherit;
		cursor: inherit;
		font-family: inherit;
	}
	:host(:hover) {
		background: ${ad};
	}
	:host(:active) {
		background: ${Ii};
	}
	.control:${xe} {
		outline: calc(${q} * 1px) solid ${ce};
		outline-offset: calc(${q} * 2px);
	}
	.control::-moz-focus-inner {
		border: 0;
	}
	:host([disabled]) {
		opacity: ${pi};
		background: ${Ii};
		cursor: ${zt};
	}
	.content {
		display: flex;
	}
	.start {
		display: flex;
	}
	::slotted(svg),
	::slotted(span) {
		width: calc(${F} * 4px);
		height: calc(${F} * 4px);
	}
	.start {
		margin-inline-end: 8px;
	}
`,mb=le`
	:host([appearance='primary']) {
		background: ${Ii};
		color: ${ld};
	}
	:host([appearance='primary']:hover) {
		background: ${ad};
	}
	:host([appearance='primary']:active) .control:active {
		background: ${Ii};
	}
	:host([appearance='primary']) .control:${xe} {
		outline: calc(${q} * 1px) solid ${ce};
		outline-offset: calc(${q} * 2px);
	}
	:host([appearance='primary'][disabled]) {
		background: ${Ii};
	}
`,vb=le`
	:host([appearance='secondary']) {
		background: ${wo};
		color: ${Kg};
	}
	:host([appearance='secondary']:hover) {
		background: ${eb};
	}
	:host([appearance='secondary']:active) .control:active {
		background: ${wo};
	}
	:host([appearance='secondary']) .control:${xe} {
		outline: calc(${q} * 1px) solid ${ce};
		outline-offset: calc(${q} * 2px);
	}
	:host([appearance='secondary'][disabled]) {
		background: ${wo};
	}
`,yb=le`
	:host([appearance='icon']) {
		background: ${sa};
		border-radius: ${Jg};
		color: ${ve};
	}
	:host([appearance='icon']:hover) {
		background: ${na};
		outline: 1px dotted ${id};
		outline-offset: -1px;
	}
	:host([appearance='icon']) .control {
		padding: ${Zg};
		border: none;
	}
	:host([appearance='icon']:active) .control:active {
		background: ${na};
	}
	:host([appearance='icon']) .control:${xe} {
		outline: calc(${q} * 1px) solid ${ce};
		outline-offset: ${Xg};
	}
	:host([appearance='icon'][disabled]) {
		background: ${sa};
	}
`,xb=(i,e)=>le`
	${bb}
	${mb}
	${vb}
	${yb}
`;class dd extends nt{connectedCallback(){if(super.connectedCallback(),!this.appearance){const e=this.getAttribute("appearance");this.appearance=e}}attributeChangedCallback(e,t,s){e==="appearance"&&s==="icon"&&(this.getAttribute("aria-label")||(this.ariaLabel="Icon Button")),e==="aria-label"&&(this.ariaLabel=s),e==="disabled"&&(this.disabled=s!==null)}}gb([m],dd.prototype,"appearance",void 0);const $b=dd.compose({baseName:"button",template:qp,styles:xb,shadowOptions:{delegatesFocus:!0}}),wb=(i,e)=>le`
	${Ce("inline-flex")} :host {
		align-items: center;
		outline: none;
		margin: calc(${F} * 1px) 0;
		user-select: none;
		font-size: ${Re};
		line-height: ${He};
	}
	.control {
		position: relative;
		width: calc(${F} * 4px + 2px);
		height: calc(${F} * 4px + 2px);
		box-sizing: border-box;
		border-radius: calc(${sb} * 1px);
		border: calc(${q} * 1px) solid ${$i};
		background: ${xt};
		outline: none;
		cursor: pointer;
	}
	.label {
		font-family: ${Ye};
		color: ${ve};
		padding-inline-start: calc(${F} * 2px + 2px);
		margin-inline-end: calc(${F} * 2px + 2px);
		cursor: pointer;
	}
	.label__hidden {
		display: none;
		visibility: hidden;
	}
	.checked-indicator {
		width: 100%;
		height: 100%;
		display: block;
		fill: ${ve};
		opacity: 0;
		pointer-events: none;
	}
	.indeterminate-indicator {
		border-radius: 2px;
		background: ${ve};
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50%;
		height: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
	}
	:host(:enabled) .control:hover {
		background: ${xt};
		border-color: ${$i};
	}
	:host(:enabled) .control:active {
		background: ${xt};
		border-color: ${ce};
	}
	:host(:${xe}) .control {
		border: calc(${q} * 1px) solid ${ce};
	}
	:host(.disabled) .label,
	:host(.readonly) .label,
	:host(.readonly) .control,
	:host(.disabled) .control {
		cursor: ${zt};
	}
	:host(.checked:not(.indeterminate)) .checked-indicator,
	:host(.indeterminate) .indeterminate-indicator {
		opacity: 1;
	}
	:host(.disabled) {
		opacity: ${pi};
	}
`;class Cb extends Vn{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Checkbox")}}const kb=Cb.compose({baseName:"checkbox",template:ig,styles:wb,checkedIndicator:`
		<svg 
			part="checked-indicator"
			class="checked-indicator"
			width="16" 
			height="16" 
			viewBox="0 0 16 16" 
			xmlns="http://www.w3.org/2000/svg" 
			fill="currentColor"
		>
			<path 
				fill-rule="evenodd" 
				clip-rule="evenodd" 
				d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
			/>
		</svg>
	`,indeterminateIndicator:`
		<div part="indeterminate-indicator" class="indeterminate-indicator"></div>
	`}),Sb=(i,e)=>le`
	:host {
		display: flex;
		position: relative;
		flex-direction: column;
		width: 100%;
	}
`,Tb=(i,e)=>le`
	:host {
		display: grid;
		padding: calc((${F} / 4) * 1px) 0;
		box-sizing: border-box;
		width: 100%;
		background: transparent;
	}
	:host(.header) {
	}
	:host(.sticky-header) {
		background: ${Ug};
		position: sticky;
		top: 0;
	}
	:host(:hover) {
		background: ${nb};
		outline: 1px dotted ${id};
		outline-offset: -1px;
	}
`,_b=(i,e)=>le`
	:host {
		padding: calc(${F} * 1px) calc(${F} * 3px);
		color: ${ve};
		opacity: 1;
		box-sizing: border-box;
		font-family: ${Ye};
		font-size: ${Re};
		line-height: ${He};
		font-weight: 400;
		border: solid calc(${q} * 1px) transparent;
		border-radius: calc(${Hs} * 1px);
		white-space: wrap;
		overflow-wrap: anywhere;
	}
	:host(.column-header) {
		font-weight: 600;
	}
	:host(:${xe}),
	:host(:focus),
	:host(:active) {
		background: ${ei};
		border: solid calc(${q} * 1px) ${ce};
		color: ${Ei};
		outline: none;
	}
	:host(:${xe}) ::slotted(*),
	:host(:focus) ::slotted(*),
	:host(:active) ::slotted(*) {
		color: ${Ei} !important;
	}
`;class Ab extends we{connectedCallback(){super.connectedCallback(),this.getAttribute("aria-label")||this.setAttribute("aria-label","Data Grid")}}const Ib=Ab.compose({baseName:"data-grid",baseClass:we,template:Yp,styles:Sb});class Eb extends $e{}const Ob=Eb.compose({baseName:"data-grid-row",baseClass:$e,template:eg,styles:Tb});class Rb extends Ut{}const Pb=Rb.compose({baseName:"data-grid-cell",baseClass:Ut,template:tg,styles:_b}),Db=(i,e)=>le`
	${Ce("block")} :host {
		border: none;
		border-top: calc(${q} * 1px) solid ${ob};
		box-sizing: content-box;
		height: 0;
		margin: calc(${F} * 1px) 0;
		width: 100%;
	}
`;class Fb extends Tr{}const Bb=Fb.compose({baseName:"divider",template:vg,styles:Db}),Mb=(i,e)=>le`
	${Ce("inline-flex")} :host {
		background: ${Xs};
		border-radius: calc(${Ai} * 1px);
		box-sizing: border-box;
		color: ${ve};
		contain: contents;
		font-family: ${Ye};
		height: calc(${dn} * 1px);
		position: relative;
		user-select: none;
		min-width: ${Ir};
		outline: none;
		vertical-align: top;
	}
	.control {
		align-items: center;
		box-sizing: border-box;
		border: calc(${q} * 1px) solid ${Vt};
		border-radius: calc(${Ai} * 1px);
		cursor: pointer;
		display: flex;
		font-family: inherit;
		font-size: ${Re};
		line-height: ${He};
		min-height: 100%;
		padding: 2px 6px 2px 8px;
		width: 100%;
	}
	.listbox {
		background: ${Xs};
		border: calc(${q} * 1px) solid ${ce};
		border-radius: calc(${Ai} * 1px);
		box-sizing: border-box;
		display: inline-flex;
		flex-direction: column;
		left: 0;
		max-height: ${rb};
		padding: 0;
		overflow-y: auto;
		position: absolute;
		width: 100%;
		z-index: 1;
	}
	.listbox[hidden] {
		display: none;
	}
	:host(:${xe}) .control {
		border-color: ${ce};
	}
	:host(:not([disabled]):hover) {
		background: ${Xs};
		border-color: ${Vt};
	}
	:host(:${xe}) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
		background: ${ei};
		border: calc(${q} * 1px) solid transparent;
		color: ${Ei};
	}
	:host([disabled]) {
		cursor: ${zt};
		opacity: ${pi};
	}
	:host([disabled]) .control {
		cursor: ${zt};
		user-select: none;
	}
	:host([disabled]:hover) {
		background: ${Xs};
		color: ${ve};
		fill: currentcolor;
	}
	:host(:not([disabled])) .control:active {
		border-color: ${ce};
	}
	:host(:empty) .listbox {
		display: none;
	}
	:host([open]) .control {
		border-color: ${ce};
	}
	:host([open][position='above']) .listbox {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	:host([open][position='below']) .listbox {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	:host([open][position='above']) .listbox {
		bottom: calc(${dn} * 1px);
	}
	:host([open][position='below']) .listbox {
		top: calc(${dn} * 1px);
	}
	.selected-value {
		flex: 1 1 auto;
		font-family: inherit;
		overflow: hidden;
		text-align: start;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.indicator {
		flex: 0 0 auto;
		margin-inline-start: 1em;
	}
	slot[name='listbox'] {
		display: none;
		width: 100%;
	}
	:host([open]) slot[name='listbox'] {
		display: flex;
		position: absolute;
	}
	.end {
		margin-inline-start: auto;
	}
	.start,
	.end,
	.indicator,
	.select-indicator,
	::slotted(svg),
	::slotted(span) {
		fill: currentcolor;
		height: 1em;
		min-height: calc(${F} * 4px);
		min-width: calc(${F} * 4px);
		width: 1em;
	}
	::slotted([role='option']),
	::slotted(option) {
		flex: 0 0 auto;
	}
`;class Hb extends Gt{}const Lb=Hb.compose({baseName:"dropdown",template:Rg,styles:Mb,indicator:`
		<svg 
			class="select-indicator"
			part="select-indicator"
			width="16" 
			height="16" 
			viewBox="0 0 16 16" 
			xmlns="http://www.w3.org/2000/svg" 
			fill="currentColor"
		>
			<path 
				fill-rule="evenodd" 
				clip-rule="evenodd" 
				d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"
			/>
		</svg>
	`}),Nb=(i,e)=>le`
	${Ce("inline-flex")} :host {
		background: transparent;
		box-sizing: border-box;
		color: ${lb};
		cursor: pointer;
		fill: currentcolor;
		font-family: ${Ye};
		font-size: ${Re};
		line-height: ${He};
		outline: none;
	}
	.control {
		background: transparent;
		border: calc(${q} * 1px) solid transparent;
		border-radius: calc(${Hs} * 1px);
		box-sizing: border-box;
		color: inherit;
		cursor: inherit;
		fill: inherit;
		font-family: inherit;
		height: inherit;
		padding: 0;
		outline: none;
		text-decoration: none;
		word-break: break-word;
	}
	.control::-moz-focus-inner {
		border: 0;
	}
	:host(:hover) {
		color: ${oa};
	}
	:host(:hover) .content {
		text-decoration: underline;
	}
	:host(:active) {
		background: transparent;
		color: ${oa};
	}
	:host(:${xe}) .control,
	:host(:focus) .control {
		border: calc(${q} * 1px) solid ${ce};
	}
`;class Vb extends st{}const jb=Vb.compose({baseName:"link",template:zp,styles:Nb,shadowOptions:{delegatesFocus:!0}}),zb=(i,e)=>le`
	${Ce("inline-flex")} :host {
		font-family: var(--body-font);
		border-radius: ${Hs};
		border: calc(${q} * 1px) solid transparent;
		box-sizing: border-box;
		color: ${ve};
		cursor: pointer;
		fill: currentcolor;
		font-size: ${Re};
		line-height: ${He};
		margin: 0;
		outline: none;
		overflow: hidden;
		padding: 0 calc((${F} / 2) * 1px)
			calc((${F} / 4) * 1px);
		user-select: none;
		white-space: nowrap;
	}
	:host(:${xe}) {
		border-color: ${ce};
		background: ${ei};
		color: ${ve};
	}
	:host([aria-selected='true']) {
		background: ${ei};
		border: calc(${q} * 1px) solid transparent;
		color: ${Ei};
	}
	:host(:active) {
		background: ${ei};
		color: ${Ei};
	}
	:host(:not([aria-selected='true']):hover) {
		background: ${ei};
		border: calc(${q} * 1px) solid transparent;
		color: ${Ei};
	}
	:host(:not([aria-selected='true']):active) {
		background: ${ei};
		color: ${ve};
	}
	:host([disabled]) {
		cursor: ${zt};
		opacity: ${pi};
	}
	:host([disabled]:hover) {
		background-color: inherit;
	}
	.content {
		grid-column-start: 2;
		justify-self: start;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;let Ub=class extends Ot{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Option")}};const qb=Ub.compose({baseName:"option",template:xg,styles:zb}),Gb=(i,e)=>le`
	${Ce("grid")} :host {
		box-sizing: border-box;
		font-family: ${Ye};
		font-size: ${Re};
		line-height: ${He};
		color: ${ve};
		grid-template-columns: auto 1fr auto;
		grid-template-rows: auto 1fr;
		overflow-x: auto;
	}
	.tablist {
		display: grid;
		grid-template-rows: auto auto;
		grid-template-columns: auto;
		column-gap: calc(${F} * 8px);
		position: relative;
		width: max-content;
		align-self: end;
		padding: calc(${F} * 1px) calc(${F} * 1px) 0;
		box-sizing: border-box;
	}
	.start,
	.end {
		align-self: center;
	}
	.activeIndicator {
		grid-row: 2;
		grid-column: 1;
		width: 100%;
		height: calc((${F} / 4) * 1px);
		justify-self: center;
		background: ${yi};
		margin: 0;
		border-radius: calc(${Hs} * 1px);
	}
	.activeIndicatorTransition {
		transition: transform 0.01s linear;
	}
	.tabpanel {
		grid-row: 2;
		grid-column-start: 1;
		grid-column-end: 4;
		position: relative;
	}
`,Wb=(i,e)=>le`
	${Ce("inline-flex")} :host {
		box-sizing: border-box;
		font-family: ${Ye};
		font-size: ${Re};
		line-height: ${He};
		height: calc(${F} * 7px);
		padding: calc(${F} * 1px) 0;
		color: ${db};
		fill: currentcolor;
		border-radius: calc(${Hs} * 1px);
		border: solid calc(${q} * 1px) transparent;
		align-items: center;
		justify-content: center;
		grid-row: 1;
		cursor: pointer;
	}
	:host(:hover) {
		color: ${yi};
		fill: currentcolor;
	}
	:host(:active) {
		color: ${yi};
		fill: currentcolor;
	}
	:host([aria-selected='true']) {
		background: transparent;
		color: ${yi};
		fill: currentcolor;
	}
	:host([aria-selected='true']:hover) {
		background: transparent;
		color: ${yi};
		fill: currentcolor;
	}
	:host([aria-selected='true']:active) {
		background: transparent;
		color: ${yi};
		fill: currentcolor;
	}
	:host(:${xe}) {
		outline: none;
		border: solid calc(${q} * 1px) ${cb};
	}
	:host(:focus) {
		outline: none;
	}
	::slotted(vscode-badge) {
		margin-inline-start: calc(${F} * 2px);
	}
`,Qb=(i,e)=>le`
	${Ce("flex")} :host {
		color: inherit;
		background-color: transparent;
		border: solid calc(${q} * 1px) transparent;
		box-sizing: border-box;
		font-size: ${Re};
		line-height: ${He};
		padding: 10px calc((${F} + 2) * 1px);
	}
`;class Yb extends Rt{connectedCallback(){super.connectedCallback(),this.orientation&&(this.orientation=No.horizontal),this.getAttribute("aria-label")||this.setAttribute("aria-label","Panels")}}const Jb=Yb.compose({baseName:"panels",template:Bg,styles:Gb});class Xb extends ed{connectedCallback(){super.connectedCallback(),this.disabled&&(this.disabled=!1),this.textContent&&this.setAttribute("aria-label",this.textContent)}}const Zb=Xb.compose({baseName:"panel-tab",template:Fg,styles:Wb});class Kb extends Dg{}const em=Kb.compose({baseName:"panel-view",template:Pg,styles:Qb}),tm=(i,e)=>le`
	${Ce("flex")} :host {
		align-items: center;
		outline: none;
		height: calc(${F} * 7px);
		width: calc(${F} * 7px);
		margin: 0;
	}
	.progress {
		height: 100%;
		width: 100%;
	}
	.background {
		fill: none;
		stroke: transparent;
		stroke-width: calc(${F} / 2 * 1px);
	}
	.indeterminate-indicator-1 {
		fill: none;
		stroke: ${ab};
		stroke-width: calc(${F} / 2 * 1px);
		stroke-linecap: square;
		transform-origin: 50% 50%;
		transform: rotate(-90deg);
		transition: all 0.2s ease-in-out;
		animation: spin-infinite 2s linear infinite;
	}
	@keyframes spin-infinite {
		0% {
			stroke-dasharray: 0.01px 43.97px;
			transform: rotate(0deg);
		}
		50% {
			stroke-dasharray: 21.99px 21.99px;
			transform: rotate(450deg);
		}
		100% {
			stroke-dasharray: 0.01px 43.97px;
			transform: rotate(1080deg);
		}
	}
`;class im extends qi{connectedCallback(){super.connectedCallback(),this.paused&&(this.paused=!1),this.setAttribute("aria-label","Loading"),this.setAttribute("aria-live","assertive"),this.setAttribute("role","alert")}attributeChangedCallback(e,t,s){e==="value"&&this.removeAttribute("value")}}const sm=im.compose({baseName:"progress-ring",template:kg,styles:tm,indeterminateIndicator:`
		<svg class="progress" part="progress" viewBox="0 0 16 16">
			<circle
				class="background"
				part="background"
				cx="8px"
				cy="8px"
				r="7px"
			></circle>
			<circle
				class="indeterminate-indicator-1"
				part="indeterminate-indicator-1"
				cx="8px"
				cy="8px"
				r="7px"
			></circle>
		</svg>
	`}),nm=(i,e)=>le`
	${Ce("flex")} :host {
		align-items: flex-start;
		margin: calc(${F} * 1px) 0;
		flex-direction: column;
	}
	.positioning-region {
		display: flex;
		flex-wrap: wrap;
	}
	:host([orientation='vertical']) .positioning-region {
		flex-direction: column;
	}
	:host([orientation='horizontal']) .positioning-region {
		flex-direction: row;
	}
	::slotted([slot='label']) {
		color: ${ve};
		font-size: ${Re};
		margin: calc(${F} * 1px) 0;
	}
`;class om extends qt{connectedCallback(){super.connectedCallback();const e=this.querySelector("label");if(e){const t="radio-group-"+Math.random().toString(16).slice(2);e.setAttribute("id",t),this.setAttribute("aria-labelledby",t)}}}const rm=om.compose({baseName:"radio-group",template:Sg,styles:nm}),lm=(i,e)=>le`
	${Ce("inline-flex")} :host {
		align-items: center;
		flex-direction: row;
		font-size: ${Re};
		line-height: ${He};
		margin: calc(${F} * 1px) 0;
		outline: none;
		position: relative;
		transition: all 0.2s ease-in-out;
		user-select: none;
	}
	.control {
		background: ${xt};
		border-radius: 999px;
		border: calc(${q} * 1px) solid ${$i};
		box-sizing: border-box;
		cursor: pointer;
		height: calc(${F} * 4px);
		position: relative;
		outline: none;
		width: calc(${F} * 4px);
	}
	.label {
		color: ${ve};
		cursor: pointer;
		font-family: ${Ye};
		margin-inline-end: calc(${F} * 2px + 2px);
		padding-inline-start: calc(${F} * 2px + 2px);
	}
	.label__hidden {
		display: none;
		visibility: hidden;
	}
	.control,
	.checked-indicator {
		flex-shrink: 0;
	}
	.checked-indicator {
		background: ${ve};
		border-radius: 999px;
		display: inline-block;
		inset: calc(${F} * 1px);
		opacity: 0;
		pointer-events: none;
		position: absolute;
	}
	:host(:not([disabled])) .control:hover {
		background: ${xt};
		border-color: ${$i};
	}
	:host(:not([disabled])) .control:active {
		background: ${xt};
		border-color: ${ce};
	}
	:host(:${xe}) .control {
		border: calc(${q} * 1px) solid ${ce};
	}
	:host([aria-checked='true']) .control {
		background: ${xt};
		border: calc(${q} * 1px) solid ${$i};
	}
	:host([aria-checked='true']:not([disabled])) .control:hover {
		background: ${xt};
		border: calc(${q} * 1px) solid ${$i};
	}
	:host([aria-checked='true']:not([disabled])) .control:active {
		background: ${xt};
		border: calc(${q} * 1px) solid ${ce};
	}
	:host([aria-checked="true"]:${xe}:not([disabled])) .control {
		border: calc(${q} * 1px) solid ${ce};
	}
	:host([disabled]) .label,
	:host([readonly]) .label,
	:host([readonly]) .control,
	:host([disabled]) .control {
		cursor: ${zt};
	}
	:host([aria-checked='true']) .checked-indicator {
		opacity: 1;
	}
	:host([disabled]) {
		opacity: ${pi};
	}
`;class am extends zn{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Radio")}}const cm=am.compose({baseName:"radio",template:Tg,styles:lm,checkedIndicator:`
		<div part="checked-indicator" class="checked-indicator"></div>
	`}),dm=(i,e)=>le`
	${Ce("inline-block")} :host {
		box-sizing: border-box;
		font-family: ${Ye};
		font-size: ${sd};
		line-height: ${nd};
	}
	.control {
		background-color: ${od};
		border: calc(${q} * 1px) solid ${Er};
		border-radius: ${hb};
		color: ${rd};
		padding: calc(${F} * 0.5px) calc(${F} * 1px);
		text-transform: uppercase;
	}
`;class hm extends Bs{connectedCallback(){super.connectedCallback(),this.circular&&(this.circular=!1)}}const um=hm.compose({baseName:"tag",template:Wc,styles:dm}),fm=(i,e)=>le`
	${Ce("inline-block")} :host {
		font-family: ${Ye};
		outline: none;
		user-select: none;
	}
	.control {
		box-sizing: border-box;
		position: relative;
		color: ${cd};
		background: ${si};
		border-radius: calc(${Ai} * 1px);
		border: calc(${q} * 1px) solid ${Vt};
		font: inherit;
		font-size: ${Re};
		line-height: ${He};
		padding: calc(${F} * 2px + 1px);
		width: 100%;
		min-width: ${Ir};
		resize: none;
	}
	.control:hover:enabled {
		background: ${si};
		border-color: ${Vt};
	}
	.control:active:enabled {
		background: ${si};
		border-color: ${ce};
	}
	.control:hover,
	.control:${xe},
	.control:disabled,
	.control:active {
		outline: none;
	}
	.control::-webkit-scrollbar {
		width: ${qg};
		height: ${Gg};
	}
	.control::-webkit-scrollbar-corner {
		background: ${si};
	}
	.control::-webkit-scrollbar-thumb {
		background: ${Wg};
	}
	.control::-webkit-scrollbar-thumb:hover {
		background: ${Qg};
	}
	.control::-webkit-scrollbar-thumb:active {
		background: ${Yg};
	}
	:host(:focus-within:not([disabled])) .control {
		border-color: ${ce};
	}
	:host([resize='both']) .control {
		resize: both;
	}
	:host([resize='horizontal']) .control {
		resize: horizontal;
	}
	:host([resize='vertical']) .control {
		resize: vertical;
	}
	.label {
		display: block;
		color: ${ve};
		cursor: pointer;
		font-size: ${Re};
		line-height: ${He};
		margin-bottom: 2px;
	}
	.label__hidden {
		display: none;
		visibility: hidden;
	}
	:host([disabled]) .label,
	:host([readonly]) .label,
	:host([readonly]) .control,
	:host([disabled]) .control {
		cursor: ${zt};
	}
	:host([disabled]) {
		opacity: ${pi};
	}
	:host([disabled]) .control {
		border-color: ${Vt};
	}
`;class pm extends Pe{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Text area")}}const gm=pm.compose({baseName:"text-area",template:Lg,styles:fm,shadowOptions:{delegatesFocus:!0}}),bm=(i,e)=>le`
	${Ce("inline-block")} :host {
		font-family: ${Ye};
		outline: none;
		user-select: none;
	}
	.root {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: row;
		color: ${cd};
		background: ${si};
		border-radius: calc(${Ai} * 1px);
		border: calc(${q} * 1px) solid ${Vt};
		height: calc(${dn} * 1px);
		min-width: ${Ir};
	}
	.control {
		-webkit-appearance: none;
		font: inherit;
		background: transparent;
		border: 0;
		color: inherit;
		height: calc(100% - (${F} * 1px));
		width: 100%;
		margin-top: auto;
		margin-bottom: auto;
		border: none;
		padding: 0 calc(${F} * 2px + 1px);
		font-size: ${Re};
		line-height: ${He};
	}
	.control:hover,
	.control:${xe},
	.control:disabled,
	.control:active {
		outline: none;
	}
	.label {
		display: block;
		color: ${ve};
		cursor: pointer;
		font-size: ${Re};
		line-height: ${He};
		margin-bottom: 2px;
	}
	.label__hidden {
		display: none;
		visibility: hidden;
	}
	.start,
	.end {
		display: flex;
		margin: auto;
		fill: currentcolor;
	}
	::slotted(svg),
	::slotted(span) {
		width: calc(${F} * 4px);
		height: calc(${F} * 4px);
	}
	.start {
		margin-inline-start: calc(${F} * 2px);
	}
	.end {
		margin-inline-end: calc(${F} * 2px);
	}
	:host(:hover:not([disabled])) .root {
		background: ${si};
		border-color: ${Vt};
	}
	:host(:active:not([disabled])) .root {
		background: ${si};
		border-color: ${ce};
	}
	:host(:focus-within:not([disabled])) .root {
		border-color: ${ce};
	}
	:host([disabled]) .label,
	:host([readonly]) .label,
	:host([readonly]) .control,
	:host([disabled]) .control {
		cursor: ${zt};
	}
	:host([disabled]) {
		opacity: ${pi};
	}
	:host([disabled]) .control {
		border-color: ${Vt};
	}
`;class mm extends ze{connectedCallback(){super.connectedCallback(),this.textContent?this.setAttribute("aria-label",this.textContent):this.setAttribute("aria-label","Text field")}}const vm=mm.compose({baseName:"text-field",template:Ng,styles:bm,shadowOptions:{delegatesFocus:!0}}),ym={vsCodeBadge:pb,vsCodeButton:$b,vsCodeCheckbox:kb,vsCodeDataGrid:Ib,vsCodeDataGridCell:Pb,vsCodeDataGridRow:Ob,vsCodeDivider:Bb,vsCodeDropdown:Lb,vsCodeLink:jb,vsCodeOption:qb,vsCodePanels:Jb,vsCodePanelTab:Zb,vsCodePanelView:em,vsCodeProgressRing:sm,vsCodeRadioGroup:rm,vsCodeRadio:cm,vsCodeTag:um,vsCodeTextArea:gm,vsCodeTextField:vm,register(i,...e){if(i)for(const t in this)t!=="register"&&this[t]().register(i,...e)}},xm={class:"theme-toggle"},$m=["checked"],wm=sr({__name:"App",setup(i){jg().register(ym);const e=ut(!0);function t(s){console.log("Theme toggled");const n=s.target;e.value=n.checked,document.documentElement.classList.toggle("light-theme",!e.value),document.documentElement.classList.toggle("dark-theme",e.value)}return nr(()=>{document.documentElement.classList.add("dark-theme"),setTimeout(()=>{const s=document.querySelector("body");s&&(s.style.setProperty("--foreground","var(--vscode-foreground)"),s.style.setProperty("--background","var(--vscode-panel-background)"),s.style.setProperty("--focus-border","var(--vscode-focusBorder)"),s.style.setProperty("--button-border","var(--vscode-button-border)"),s.style.setProperty("--button-primary-background","var(--vscode-button-background)"),s.style.setProperty("--button-primary-hover-background","var(--vscode-button-hoverBackground)"),s.style.setProperty("--checkbox-background","var(--vscode-checkbox-background)"),s.style.setProperty("--checkbox-foreground","var(--vscode-checkbox-foreground)"),s.style.setProperty("--checkbox-border","var(--vscode-checkbox-border)"),s.style.setProperty("--dropdown-background","var(--vscode-dropdown-background)"),s.style.setProperty("--dropdown-foreground","var(--vscode-dropdown-foreground)"),s.style.setProperty("--dropdown-border","var(--vscode-dropdown-border)"),s.style.setProperty("--input-background","var(--vscode-input-background)"))},100)}),(s,n)=>(Xe(),ti(Ae,null,[he("div",xm,[he("vscode-checkbox",{id:"theme-toggle",checked:e.value,onChange:t},null,40,$m),n[0]||(n[0]=he("label",{for:"theme-toggle"},"Toggle Theme",-1))]),n[1]||(n[1]=iu("<details data-v-7f346f3d><summary data-v-7f346f3d>Proposed Changes</summary><ol data-v-7f346f3d><li data-v-7f346f3d>Change checkbox style to match checkboxes from Settings page</li><ul data-v-7f346f3d><li data-v-7f346f3d>Goal: Reduce visual noise and better match editor theming</li><li data-v-7f346f3d>Goal: Let&#39;s the color of server contribution source / server state text stand out</li></ul><li data-v-7f346f3d>Remove icons and indent tool list items</li><ul data-v-7f346f3d><li data-v-7f346f3d>Goal: Reduce visual noise</li><li data-v-7f346f3d> Goal: Improve the ability to distinguish servers and tools via stronger visual hierarchy </li></ul><li data-v-7f346f3d>Prefix server names with &quot;MCP Server:&quot;</li><ul data-v-7f346f3d><li data-v-7f346f3d> Note: Also demoed &quot;MCP Extension:&quot; – might be the wrong term but the idea is that there can be variations on the prefix name used </li><li data-v-7f346f3d>Goal: Provide extra information to distinguish between servers and tools</li><li data-v-7f346f3d>Goal: Reduce density of information on the right side of server list items</li></ul><li data-v-7f346f3d>Prefix all MCP contribution sources with &quot;From&quot;</li><ul data-v-7f346f3d><li data-v-7f346f3d>Goal: Makes it more clear that a server is *coming from* somewhere</li><li data-v-7f346f3d>Example: &quot;Claude Desktop&quot; vs &quot;From Claude Desktop&quot;</li><li data-v-7f346f3d> Bonus: Improves visual consistency / mental parse-ability of contribution sources text </li></ul><li data-v-7f346f3d> Suggestion: Add a contribution source label and server status to GitHub Copilot Chat server </li><ul data-v-7f346f3d><li data-v-7f346f3d>Goal: Improves consistency across all MCP contribution sources copy</li><li data-v-7f346f3d>Note: &quot;Built In&quot; might be the wrong term – consider revising for clarity/accuracy</li></ul></ol></details>",1)),Ge(nf)],64))}}),Cm=cr(wm,[["__scopeId","data-v-7f346f3d"]]);ju(Cm).mount("#app");
