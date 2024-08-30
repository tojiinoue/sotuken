(this.webpackJsonpsotuken=this.webpackJsonpsotuken||[]).push([[3],{291:function(e,a,t){"use strict";t.r(a),t.d(a,"offchainLookupSignature",(function(){return m})),t.d(a,"offchainLookupAbiItem",(function(){return y})),t.d(a,"offchainLookup",(function(){return O})),t.d(a,"ccipFetch",(function(){return g}));var r=t(68),s=t(20),n=t(3),o=t(62);class c extends n.a{constructor(e){var a;let{callbackSelector:t,cause:r,data:s,extraData:n,sender:c,urls:u}=e;super(r.shortMessage||"An error occurred while fetching for an offchain result.",{cause:r,metaMessages:[...r.metaMessages||[],null!==(a=r.metaMessages)&&void 0!==a&&a.length?"":[],"Offchain Gateway Call:",u&&["  Gateway URL(s):",...u.map((e=>`    ${Object(o.b)(e)}`))],`  Sender: ${c}`,`  Data: ${s}`,`  Callback selector: ${t}`,`  Extra data: ${n}`].flat()}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"OffchainLookupError"})}}class u extends n.a{constructor(e){let{result:a,url:t}=e;super("Offchain gateway response is malformed. Response data must be a hex value.",{metaMessages:[`Gateway URL: ${Object(o.b)(t)}`,`Response: ${Object(s.a)(a)}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"OffchainLookupResponseMalformedError"})}}class l extends n.a{constructor(e){let{sender:a,to:t}=e;super("Reverted sender address does not match target contract address (`to`).",{metaMessages:[`Contract address: ${t}`,`OffchainLookup sender address: ${a}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"OffchainLookupSenderMismatchError"})}}var d=t(32),i=t(152),f=t(40),b=t(58),h=t(41);var p=t(30),w=t(28);const m="0x556f1830",y={name:"OffchainLookup",type:"error",inputs:[{name:"sender",type:"address"},{name:"urls",type:"string[]"},{name:"callData",type:"bytes"},{name:"callbackFunction",type:"bytes4"},{name:"extraData",type:"bytes"}]};async function O(e,a){let{blockNumber:t,blockTag:s,data:n,to:o}=a;const{args:u}=Object(i.a)({data:n,abi:[y]}),[d,w,m,O,k]=u;try{if(!function(e,a){if(!Object(h.a)(e))throw new b.a({address:e});if(!Object(h.a)(a))throw new b.a({address:a});return e.toLowerCase()===a.toLowerCase()}(o,d))throw new l({sender:d,to:o});const a=await g({data:m,sender:d,urls:w}),{data:n}=await Object(r.a)(e,{blockNumber:t,blockTag:s,data:Object(p.a)([O,Object(f.a)([{type:"bytes"},{type:"bytes"}],[a,k])]),to:o});return n}catch(j){throw new c({callbackSelector:O,cause:j,data:n,extraData:k,sender:d,urls:w})}}async function g(e){let{data:a,sender:t,urls:r}=e,n=new Error("An unknown error occurred.");for(let i=0;i<r.length;i++){const e=r[i],f=e.includes("{data}")?"GET":"POST",b="POST"===f?{data:a,sender:t}:void 0;try{var o;const r=await fetch(e.replace("{sender}",t).replace("{data}",a),{body:JSON.stringify(b),method:f});let l;if(l=null!==(o=r.headers.get("Content-Type"))&&void 0!==o&&o.startsWith("application/json")?(await r.json()).data:await r.text(),!r.ok){var c;n=new d.a({body:b,details:null!==(c=l)&&void 0!==c&&c.error?Object(s.a)(l.error):r.statusText,headers:r.headers,status:r.status,url:e});continue}if(!Object(w.a)(l)){n=new u({result:l,url:e});continue}return l}catch(l){n=new d.a({body:b,details:l.message,url:e})}}throw n}}}]);
//# sourceMappingURL=3.d70de6ef.chunk.js.map