var Jc="186";var $c=0,eo=1,jc=2;var Fs=1,Qc=2,rs=3,ai=0,Xt=1,Bt=2,An=0,Os=1,to=2,no=3,io=4,eh=5;var as=100,th=101,nh=102,ih=103,sh=104,rh=200,ah=201,oh=202,lh=203,ch=204,hh=205,uh=206,dh=207,fh=208,ph=209,mh=210,gh=211,_h=212,xh=213,vh=214,yh=0,Sh=1,Mh=2,so=3,bh=4,Th=5,Eh=6,wh=7,Ah=0,Rh=1,Ch=2,_n=0,ro=1,ao=2,oo=3,lo=4,co=5,ho=6,uo=7;var os=301,bi=302,kr=303,Hr=304,Bs=306,ls=1000,cs=1001,Gr=1002,xn=1003,Vr=1004;var Ti=1005;var Nt=1006,hs=1007;var Rn=1008;var vn=1009,Ih=1010,Ph=1011,zs=1012,fo=1013,oi=1014,Xn=1015,Cn=1016,po=1017,mo=1018,us=1020,Lh=35902,Nh=35899,Dh=1021,Uh=1022,In=1023,Ei=1026,wi=1027,Fh=1028,go=1029,Ai=1030,_o=1031;var xo=1033,Wr=33776,Xr=33777,qr=33778,Yr=33779,vo=35840,yo=35841,So=35842,Mo=35843,bo=36196,To=37492,Eo=37496,wo=37488,Ao=37489,Zr=37490,Ro=37491,Co=37808,Io=37809,Po=37810,Lo=37811,No=37812,Do=37813,Uo=37814,Fo=37815,Oo=37816,Bo=37817,zo=37818,ko=37819,Ho=37820,Go=37821,Vo=36492,Wo=36494,Xo=36495,qo=36283,Yo=36284,Kr=36285,Zo=36286;var Ko=2300,Jr=2301;var Jo=0,ks=1,ds=2;var $o=0,Oh=1,Ri="",li="srgb",Jt="srgb-linear",jo="linear",lt="srgb";var Bh=512,zh=513,kh=514,$r=515,Hh=516,Gh=517,jr=518,Vh=519;var Qo="300 es",el=2000;function Od(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Bd(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function is(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function Wh(){let e=is("canvas");return e.style.display="block",e}var uc={},ss=null;function Us(...e){let t="THREE."+e.shift();if(ss)ss("log",t,...e);else console.log(t,...e)}function Xh(e){let t=e[0];if(typeof t==="string"&&t.startsWith("TSL:")){let n=e[1];if(n&&n.isStackTrace)e[0]+=" "+n.getLocation();else e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function Ee(...e){e=Xh(e);let t="THREE."+e.shift();if(ss)ss("warn",t,...e);else{let n=e[0];if(n&&n.isStackTrace)console.warn(n.getError(t));else console.warn(t,...e)}}function Ne(...e){e=Xh(e);let t="THREE."+e.shift();if(ss)ss("error",t,...e);else{let n=e[0];if(n&&n.isStackTrace)console.error(n.getError(t));else console.error(t,...e)}}function Si(...e){let t=e.join(" ");if(t in uc)return;uc[t]=!0,Ee(...e)}function qh(e,t,n){return new Promise(function(i,s){function r(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}var Yh={[0]:1,[2]:6,[4]:7,[3]:5,[1]:0,[6]:2,[7]:4,[5]:3};class qn{addEventListener(e,t){if(this._listeners===void 0)this._listeners={};let n=this._listeners;if(n[e]===void 0)n[e]=[];if(n[e].indexOf(t)===-1)n[e].push(t)}hasEventListener(e,t){let n=this._listeners;if(n===void 0)return!1;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);if(s!==-1)i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}}var Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dc=1234567,Ns=Math.PI/180,Mi=180/Math.PI;function gn(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ft[e&255]+Ft[e>>8&255]+Ft[e>>16&255]+Ft[e>>24&255]+"-"+Ft[t&255]+Ft[t>>8&255]+"-"+Ft[t>>16&15|64]+Ft[t>>24&255]+"-"+Ft[n&63|128]+Ft[n>>8&255]+"-"+Ft[n>>16&255]+Ft[n>>24&255]+Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]).toLowerCase()}function We(e,t,n){return Math.max(t,Math.min(n,e))}function tl(e,t){return(e%t+t)%t}function zd(e,t,n,i,s){return i+(e-t)*(s-i)/(n-t)}function kd(e,t,n){if(e!==t)return(n-e)/(t-e);else return 0}function Ds(e,t,n){return(1-n)*e+n*t}function Hd(e,t,n,i){return Ds(e,t,1-Math.exp(-n*i))}function Gd(e,t=1){return t-Math.abs(tl(e,t*2)-t)}function Vd(e,t,n){if(e<=t)return 0;if(e>=n)return 1;return e=(e-t)/(n-t),e*e*(3-2*e)}function Wd(e,t,n){if(e<=t)return 0;if(e>=n)return 1;return e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10)}function Xd(e,t){return e+Math.floor(Math.random()*(t-e+1))}function qd(e,t){return e+Math.random()*(t-e)}function Yd(e){return e*(0.5-Math.random())}function Zd(e){if(e!==void 0)dc=e;let t=dc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Kd(e){return e*Ns}function Jd(e){return e*Mi}function $d(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function jd(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function Qd(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function ef(e,t,n,i,s){let{cos:r,sin:a}=Math,o=r(n/2),l=a(n/2),c=r((t+i)/2),h=a((t+i)/2),d=r((t-i)/2),u=a((t-i)/2),m=r((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":e.set(o*h,l*d,l*u,o*c);break;case"YZY":e.set(l*u,o*h,l*d,o*c);break;case"ZXZ":e.set(l*d,l*u,o*h,o*c);break;case"XZX":e.set(o*h,l*g,l*m,o*c);break;case"YXY":e.set(l*m,o*h,l*g,o*c);break;case"ZYZ":e.set(l*g,l*m,o*h,o*c);break;default:Ee("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function mn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error("THREE.MathUtils: Invalid component type.")}}function nt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error("THREE.MathUtils: Invalid component type.")}}var Pn={DEG2RAD:Ns,RAD2DEG:Mi,generateUUID:gn,clamp:We,euclideanModulo:tl,mapLinear:zd,inverseLerp:kd,lerp:Ds,damp:Hd,pingpong:Gd,smoothstep:Vd,smootherstep:Wd,randInt:Xd,randFloat:qd,randFloatSpread:Yd,seededRandom:Zd,degToRad:Kd,radToDeg:Jd,isPowerOfTwo:$d,ceilPowerOfTwo:jd,floorPowerOfTwo:Qd,setQuaternionFromProperEuler:ef,normalize:nt,denormalize:mn};class De{static{De.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class on{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,a){let o=n[i+0],l=n[i+1],c=n[i+2],h=n[i+3],d=s[r+0],u=s[r+1],m=s[r+2],g=s[r+3];if(h!==g||o!==d||l!==u||c!==m){let S=o*d+l*u+c*m+h*g;if(S<0)d=-d,u=-u,m=-m,g=-g,S=-S;let f=1-a;if(S<0.9995){let p=Math.acos(S),T=Math.sin(p);f=Math.sin(f*p)/T,a=Math.sin(a*p)/T,o=o*f+d*a,l=l*f+u*a,c=c*f+m*a,h=h*f+g*a}else{o=o*f+d*a,l=l*f+u*a,c=c*f+m*a,h=h*f+g*a;let p=1/Math.sqrt(o*o+l*l+c*c+h*h);o*=p,l*=p,c*=p,h*=p}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,r){let a=n[i],o=n[i+1],l=n[i+2],c=n[i+3],h=s[r],d=s[r+1],u=s[r+2],m=s[r+3];return e[t]=a*m+c*h+o*u-l*d,e[t+1]=o*m+c*d+l*h-a*u,e[t+2]=l*m+c*u+a*d-o*h,e[t+3]=c*m-a*h-o*d-l*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let{_x:n,_y:i,_z:s,_order:r}=e,{cos:a,sin:o}=Math,l=a(n/2),c=a(i/2),h=a(s/2),d=o(n/2),u=o(i/2),m=o(s/2);switch(r){case"XYZ":this._x=d*c*h+l*u*m,this._y=l*u*h-d*c*m,this._z=l*c*m+d*u*h,this._w=l*c*h-d*u*m;break;case"YXZ":this._x=d*c*h+l*u*m,this._y=l*u*h-d*c*m,this._z=l*c*m-d*u*h,this._w=l*c*h+d*u*m;break;case"ZXY":this._x=d*c*h-l*u*m,this._y=l*u*h+d*c*m,this._z=l*c*m+d*u*h,this._w=l*c*h-d*u*m;break;case"ZYX":this._x=d*c*h-l*u*m,this._y=l*u*h+d*c*m,this._z=l*c*m-d*u*h,this._w=l*c*h+d*u*m;break;case"YZX":this._x=d*c*h+l*u*m,this._y=l*u*h+d*c*m,this._z=l*c*m-d*u*h,this._w=l*c*h-d*u*m;break;case"XZY":this._x=d*c*h-l*u*m,this._y=l*u*h-d*c*m,this._z=l*c*m+d*u*h,this._w=l*c*h+d*u*m;break;default:Ee("Quaternion: .setFromEuler() encountered an unknown order: "+r)}if(t===!0)this._onChangeCallback();return this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10],d=n+a+h;if(d>0){let u=0.5/Math.sqrt(d+1);this._w=0.25/u,this._x=(c-o)*u,this._y=(s-l)*u,this._z=(r-i)*u}else if(n>a&&n>h){let u=2*Math.sqrt(1+n-a-h);this._w=(c-o)/u,this._x=0.25*u,this._y=(i+r)/u,this._z=(s+l)/u}else if(a>h){let u=2*Math.sqrt(1+a-n-h);this._w=(s-l)/u,this._x=(i+r)/u,this._y=0.25*u,this._z=(o+c)/u}else{let u=2*Math.sqrt(1+h-n-a);this._w=(r-i)/u,this._x=(s+l)/u,this._y=(o+c)/u,this._z=0.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;if(n<0.00000001)if(n=0,Math.abs(e.x)>Math.abs(e.z))this._x=-e.y,this._y=e.x,this._z=0,this._w=n;else this._x=0,this._y=-e.z,this._z=e.y,this._w=n;else this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n;return this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();if(e===0)this._x=0,this._y=0,this._z=0,this._w=1;else e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e;return this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let{_x:n,_y:i,_z:s,_w:r}=e,{_x:a,_y:o,_z:l,_w:c}=t;return this._x=n*c+r*a+i*l-s*o,this._y=i*c+r*o+s*a-n*l,this._z=s*c+r*l+n*o-i*a,this._w=r*c-n*a-i*o-s*l,this._onChangeCallback(),this}slerp(e,t){let{_x:n,_y:i,_z:s,_w:r}=e,a=this.dot(e);if(a<0)n=-n,i=-i,s=-s,r=-r,a=-a;let o=1-t;if(a<0.9995){let l=Math.acos(a),c=Math.sin(l);o=Math.sin(o*l)/c,t=Math.sin(t*l)/c,this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this._onChangeCallback()}else this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{static{U.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){if(n===void 0)n=this.z;return this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(fc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(fc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,{x:s,y:r,z:a,w:o}=e,l=2*(r*i-a*n),c=2*(a*t-s*i),h=2*(s*n-r*t);return this.x=t+o*l+r*h-a*c,this.y=n+o*c+a*l-s*h,this.z=i+o*h+s*c-r*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let{x:n,y:i,z:s}=e,{x:r,y:a,z:o}=t;return this.x=i*o-s*a,this.y=s*r-n*o,this.z=n*a-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ra.copy(this).projectOnVector(e),this.sub(Ra)}reflect(e){return this.sub(Ra.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}var Ra=new U,fc=new on;class Ue{static{Ue.prototype.isMatrix3=!0}constructor(e,t,n,i,s,r,a,o,l){if(this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0)this.set(e,t,n,i,s,r,a,o,l)}set(e,t,n,i,s,r,a,o,l){let c=this.elements;return c[0]=e,c[1]=i,c[2]=a,c[3]=t,c[4]=s,c[5]=o,c[6]=n,c[7]=r,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[3],o=n[6],l=n[1],c=n[4],h=n[7],d=n[2],u=n[5],m=n[8],g=i[0],S=i[3],f=i[6],p=i[1],T=i[4],A=i[7],y=i[2],M=i[5],w=i[8];return s[0]=r*g+a*p+o*y,s[3]=r*S+a*T+o*M,s[6]=r*f+a*A+o*w,s[1]=l*g+c*p+h*y,s[4]=l*S+c*T+h*M,s[7]=l*f+c*A+h*w,s[2]=d*g+u*p+m*y,s[5]=d*S+u*T+m*M,s[8]=d*f+u*A+m*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8];return t*r*c-t*a*l-n*s*c+n*a*o+i*s*l-i*r*o}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8],h=c*r-a*l,d=a*o-c*s,u=l*s-r*o,m=t*h+n*d+i*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/m;return e[0]=h*g,e[1]=(i*l-c*n)*g,e[2]=(a*n-i*r)*g,e[3]=d*g,e[4]=(c*t-i*o)*g,e[5]=(i*s-a*t)*g,e[6]=u*g,e[7]=(n*o-l*t)*g,e[8]=(r*t-n*s)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,a){let o=Math.cos(s),l=Math.sin(s);return this.set(n*o,n*l,-n*(o*r+l*a)+r+e,-i*l,i*o,-i*(-l*r+o*a)+a+t,0,0,1),this}scale(e,t){return Si("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ca.makeScale(e,t)),this}rotate(e){return Si("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ca.makeRotation(-e)),this}translate(e,t){return Si("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ca.makeTranslation(e,t)),this}makeTranslation(e,t){if(e.isVector2)this.set(1,0,e.x,0,1,e.y,0,0,1);else this.set(1,0,e,0,1,t,0,0,1);return this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}var Ca=new Ue,pc=new Ue().set(0.4123908,0.3575843,0.1804808,0.212639,0.7151687,0.0721923,0.0193308,0.1191948,0.9505322),mc=new Ue().set(3.2409699,-1.5373832,-0.4986108,-0.9692436,1.8759675,0.0415551,0.0556301,-0.203977,1.0569715);function tf(){let e={enabled:!0,workingColorSpace:"srgb-linear",spaces:{},convert:function(s,r,a){if(this.enabled===!1||r===a||!r||!a)return s;if(this.spaces[r].transfer==="srgb")s.r=Vn(s.r),s.g=Vn(s.g),s.b=Vn(s.b);if(this.spaces[r].primaries!==this.spaces[a].primaries)s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ);if(this.spaces[a].transfer==="srgb")s.r=ns(s.r),s.g=ns(s.g),s.b=ns(s.b);return s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){if(s==="")return"linear";return this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Si("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Si("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,r)}},t=[0.64,0.33,0.3,0.6,0.15,0.06],n=[0.2126,0.7152,0.0722],i=[0.3127,0.329];return e.define({["srgb-linear"]:{primaries:t,whitePoint:i,transfer:"linear",toXYZ:pc,fromXYZ:mc,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:"srgb"},outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}},["srgb"]:{primaries:t,whitePoint:i,transfer:"srgb",toXYZ:pc,fromXYZ:mc,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}}}),e}var He=tf();function Vn(e){return e<0.04045?e*0.0773993808:Math.pow(e*0.9478672986+0.0521327014,2.4)}function ns(e){return e<0.0031308?e*12.92:1.055*Math.pow(e,0.41666)-0.055}var Gi;class nl{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src))return e.src;if(typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{if(Gi===void 0)Gi=is("canvas");Gi.width=e.width,Gi.height=e.height;let i=Gi.getContext("2d");if(e instanceof ImageData)i.putImageData(e,0,0);else i.drawImage(e,0,0,e.width,e.height);n=Gi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=is("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Vn(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)t[n]=Math.floor(Vn(t[n]/255)*255);else t[n]=Vn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ee("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}var nf=0;class Hs{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:nf++}),this.uuid=gn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;if(typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement)e.set(t.videoWidth,t.videoHeight,0);else if(typeof VideoFrame<"u"&&t instanceof VideoFrame)e.set(t.displayWidth,t.displayHeight,0);else if(t!==null)e.set(t.width,t.height,t.depth||0);else e.set(0,0,0);return e}set needsUpdate(e){if(e===!0)this.version++}toJSON(e){let t=e===void 0||typeof e==="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,a=i.length;r<a;r++)if(i[r].isDataTexture)s.push(Ia(i[r].image));else s.push(Ia(i[r]))}else s=Ia(i);n.url=s}if(!t)e.images[this.uuid]=n;return n}}function Ia(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap)return nl.getDataURL(e);else if(e.data)return{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name};else return Ee("Texture: Unable to serialize Texture."),{}}var sf=0,Pa=new U;class bt extends qn{constructor(e=bt.DEFAULT_IMAGE,t=bt.DEFAULT_MAPPING,n=1001,i=1001,s=1006,r=1008,a=1023,o=1009,l=bt.DEFAULT_ANISOTROPY,c=""){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=gn(),this.name="",this.source=new Hs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=o,this.offset=new De(0,0),this.repeat=new De(1,1),this.center=new De(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=e&&e.depth&&e.depth>1?!0:!1,this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Pa).x}get height(){return this.source.getSize(Pa).y}get depth(){return this.source.getSize(Pa).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ee(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Ee(`Texture.setValues(): property '${t}' does not exist.`);continue}if(i&&n&&(i.isVector2&&n.isVector2))i.copy(n);else if(i&&n&&(i.isVector3&&n.isVector3))i.copy(n);else if(i&&n&&(i.isMatrix3&&n.isMatrix3))i.copy(n);else this[t]=n}}toJSON(e){let t=e===void 0||typeof e==="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(Object.keys(this.userData).length>0)n.userData=this.userData;if(!t)e.textures[this.uuid]=n;return n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1000:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:if(Math.abs(Math.floor(e.x)%2)===1)e.x=Math.ceil(e.x)-e.x;else e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1000:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:if(Math.abs(Math.floor(e.y)%2)===1)e.y=Math.ceil(e.y)-e.y;else e.y=e.y-Math.floor(e.y);break}if(this.flipY)e.y=1-e.y;return e}set needsUpdate(e){if(e===!0)this.version++,this.source.needsUpdate=!0}set needsPMREMUpdate(e){if(e===!0)this.pmremVersion++}}bt.DEFAULT_IMAGE=null;bt.DEFAULT_MAPPING=300;bt.DEFAULT_ANISOTROPY=1;class it{static{it.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);if(t<0.0001)this.x=1,this.y=0,this.z=0;else this.x=e.x/t,this.y=e.y/t,this.z=e.z/t;return this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,r=0.01,a=0.1,o=e.elements,l=o[0],c=o[4],h=o[8],d=o[1],u=o[5],m=o[9],g=o[2],S=o[6],f=o[10];if(Math.abs(c-d)<0.01&&Math.abs(h-g)<0.01&&Math.abs(m-S)<0.01){if(Math.abs(c+d)<0.1&&Math.abs(h+g)<0.1&&Math.abs(m+S)<0.1&&Math.abs(l+u+f-3)<0.1)return this.set(1,0,0,0),this;t=Math.PI;let T=(l+1)/2,A=(u+1)/2,y=(f+1)/2,M=(c+d)/4,w=(h+g)/4,R=(m+S)/4;if(T>A&&T>y)if(T<0.01)n=0,i=0.707106781,s=0.707106781;else n=Math.sqrt(T),i=M/n,s=w/n;else if(A>y)if(A<0.01)n=0.707106781,i=0,s=0.707106781;else i=Math.sqrt(A),n=M/i,s=R/i;else if(y<0.01)n=0.707106781,i=0.707106781,s=0;else s=Math.sqrt(y),n=w/s,i=R/s;return this.set(n,i,s,t),this}let p=Math.sqrt((S-m)*(S-m)+(h-g)*(h-g)+(d-c)*(d-c));if(Math.abs(p)<0.001)p=1;return this.x=(S-m)/p,this.y=(h-g)/p,this.z=(d-c)/p,this.w=Math.acos((l+u+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class il extends qn{constructor(e=1,t=1,n={}){super();n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},s=new bt(i),r=n.count;for(let a=0;a<r;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};if(e.mapping!==void 0)t.mapping=e.mapping;if(e.wrapS!==void 0)t.wrapS=e.wrapS;if(e.wrapT!==void 0)t.wrapT=e.wrapT;if(e.wrapR!==void 0)t.wrapR=e.wrapR;if(e.magFilter!==void 0)t.magFilter=e.magFilter;if(e.minFilter!==void 0)t.minFilter=e.minFilter;if(e.format!==void 0)t.format=e.format;if(e.type!==void 0)t.type=e.type;if(e.anisotropy!==void 0)t.anisotropy=e.anisotropy;if(e.colorSpace!==void 0)t.colorSpace=e.colorSpace;if(e.flipY!==void 0)t.flipY=e.flipY;if(e.generateMipmaps!==void 0)t.generateMipmaps=e.generateMipmaps;if(e.internalFormat!==void 0)t.internalFormat=e.internalFormat;for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){if(this._depthTexture!==null&&this._depthTexture.renderTarget===this)this._depthTexture.renderTarget=null;if(e!==null&&e.renderTarget===null)e.renderTarget=this;this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)if(this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0)this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Hs(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $t extends il{constructor(e=1,t=1,n={}){super(e,t,n);this.isWebGLRenderTarget=!0}}class Qr extends bt{constructor(e=null,t=1,n=1,i=1){super(null);this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class sl extends bt{constructor(e=null,t=1,n=1,i=1){super(null);this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Oe{static{Oe.prototype.isMatrix4=!0}constructor(e,t,n,i,s,r,a,o,l,c,h,d,u,m,g,S){if(this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0)this.set(e,t,n,i,s,r,a,o,l,c,h,d,u,m,g,S)}set(e,t,n,i,s,r,a,o,l,c,h,d,u,m,g,S){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=i,f[1]=s,f[5]=r,f[9]=a,f[13]=o,f[2]=l,f[6]=c,f[10]=h,f[14]=d,f[3]=u,f[7]=m,f[11]=g,f[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Oe().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){if(this.determinantAffine()===0)return e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this;return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Vi.setFromMatrixColumn(e,0).length(),s=1/Vi.setFromMatrixColumn(e,1).length(),r=1/Vi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,{x:n,y:i,z:s}=e,r=Math.cos(n),a=Math.sin(n),o=Math.cos(i),l=Math.sin(i),c=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=r*c,u=r*h,m=a*c,g=a*h;t[0]=o*c,t[4]=-o*h,t[8]=l,t[1]=u+m*l,t[5]=d-g*l,t[9]=-a*o,t[2]=g-d*l,t[6]=m+u*l,t[10]=r*o}else if(e.order==="YXZ"){let d=o*c,u=o*h,m=l*c,g=l*h;t[0]=d+g*a,t[4]=m*a-u,t[8]=r*l,t[1]=r*h,t[5]=r*c,t[9]=-a,t[2]=u*a-m,t[6]=g+d*a,t[10]=r*o}else if(e.order==="ZXY"){let d=o*c,u=o*h,m=l*c,g=l*h;t[0]=d-g*a,t[4]=-r*h,t[8]=m+u*a,t[1]=u+m*a,t[5]=r*c,t[9]=g-d*a,t[2]=-r*l,t[6]=a,t[10]=r*o}else if(e.order==="ZYX"){let d=r*c,u=r*h,m=a*c,g=a*h;t[0]=o*c,t[4]=m*l-u,t[8]=d*l+g,t[1]=o*h,t[5]=g*l+d,t[9]=u*l-m,t[2]=-l,t[6]=a*o,t[10]=r*o}else if(e.order==="YZX"){let d=r*o,u=r*l,m=a*o,g=a*l;t[0]=o*c,t[4]=g-d*h,t[8]=m*h+u,t[1]=h,t[5]=r*c,t[9]=-a*c,t[2]=-l*c,t[6]=u*h+m,t[10]=d-g*h}else if(e.order==="XZY"){let d=r*o,u=r*l,m=a*o,g=a*l;t[0]=o*c,t[4]=-h,t[8]=l*c,t[1]=d*h+g,t[5]=r*c,t[9]=u*h-m,t[2]=m*h-u,t[6]=a*c,t[10]=g*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rf,e,af)}lookAt(e,t,n){let i=this.elements;if(Yt.subVectors(e,t),Yt.lengthSq()===0)Yt.z=1;if(Yt.normalize(),Qn.crossVectors(n,Yt),Qn.lengthSq()===0){if(Math.abs(n.z)===1)Yt.x+=0.0001;else Yt.z+=0.0001;Yt.normalize(),Qn.crossVectors(n,Yt)}return Qn.normalize(),dr.crossVectors(Yt,Qn),i[0]=Qn.x,i[4]=dr.x,i[8]=Yt.x,i[1]=Qn.y,i[5]=dr.y,i[9]=Yt.y,i[2]=Qn.z,i[6]=dr.z,i[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[4],o=n[8],l=n[12],c=n[1],h=n[5],d=n[9],u=n[13],m=n[2],g=n[6],S=n[10],f=n[14],p=n[3],T=n[7],A=n[11],y=n[15],M=i[0],w=i[4],R=i[8],x=i[12],E=i[1],k=i[5],D=i[9],F=i[13],j=i[2],I=i[6],X=i[10],J=i[14],H=i[3],ne=i[7],z=i[11],W=i[15];return s[0]=r*M+a*E+o*j+l*H,s[4]=r*w+a*k+o*I+l*ne,s[8]=r*R+a*D+o*X+l*z,s[12]=r*x+a*F+o*J+l*W,s[1]=c*M+h*E+d*j+u*H,s[5]=c*w+h*k+d*I+u*ne,s[9]=c*R+h*D+d*X+u*z,s[13]=c*x+h*F+d*J+u*W,s[2]=m*M+g*E+S*j+f*H,s[6]=m*w+g*k+S*I+f*ne,s[10]=m*R+g*D+S*X+f*z,s[14]=m*x+g*F+S*J+f*W,s[3]=p*M+T*E+A*j+y*H,s[7]=p*w+T*k+A*I+y*ne,s[11]=p*R+T*D+A*X+y*z,s[15]=p*x+T*F+A*J+y*W,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],a=e[5],o=e[9],l=e[13],c=e[2],h=e[6],d=e[10],u=e[14],m=e[3],g=e[7],S=e[11],f=e[15],p=o*u-l*d,T=a*u-l*h,A=a*d-o*h,y=r*u-l*c,M=r*d-o*c,w=r*h-a*c;return t*(g*p-S*T+f*A)-n*(m*p-S*y+f*M)+i*(m*T-g*y+f*w)-s*(m*A-g*M+S*w)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],a=e[9],o=e[2],l=e[6],c=e[10];return t*(r*c-a*l)-n*(s*c-a*o)+i*(s*l-r*o)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;if(e.isVector3)i[12]=e.x,i[13]=e.y,i[14]=e.z;else i[12]=e,i[13]=t,i[14]=n;return this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8],h=e[9],d=e[10],u=e[11],m=e[12],g=e[13],S=e[14],f=e[15],p=t*a-n*r,T=t*o-i*r,A=t*l-s*r,y=n*o-i*a,M=n*l-s*a,w=i*l-s*o,R=c*g-h*m,x=c*S-d*m,E=c*f-u*m,k=h*S-d*g,D=h*f-u*g,F=d*f-u*S,j=p*F-T*D+A*k+y*E-M*x+w*R;if(j===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/j;return e[0]=(a*F-o*D+l*k)*I,e[1]=(i*D-n*F-s*k)*I,e[2]=(g*w-S*M+f*y)*I,e[3]=(d*M-h*w-u*y)*I,e[4]=(o*E-r*F-l*x)*I,e[5]=(t*F-i*E+s*x)*I,e[6]=(S*A-m*w-f*T)*I,e[7]=(c*w-d*A+u*T)*I,e[8]=(r*D-a*E+l*R)*I,e[9]=(n*E-t*D-s*R)*I,e[10]=(m*M-g*A+f*p)*I,e[11]=(h*A-c*M-u*p)*I,e[12]=(a*x-r*k-o*R)*I,e[13]=(t*k-n*x+i*R)*I,e[14]=(g*T-m*y-S*p)*I,e[15]=(c*y-h*T+d*p)*I,this}scale(e){let t=this.elements,{x:n,y:i,z:s}=e;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){if(e.isVector3)this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1);else this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1);return this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,{x:r,y:a,z:o}=e,l=s*r,c=s*a;return this.set(l*r+n,l*a-i*o,l*o+i*a,0,l*a+i*o,c*a+n,c*o-i*r,0,l*o-i*a,c*o+i*r,s*o*o+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,{_x:s,_y:r,_z:a,_w:o}=t,l=s+s,c=r+r,h=a+a,d=s*l,u=s*c,m=s*h,g=r*c,S=r*h,f=a*h,p=o*l,T=o*c,A=o*h,{x:y,y:M,z:w}=n;return i[0]=(1-(g+f))*y,i[1]=(u+A)*y,i[2]=(m-T)*y,i[3]=0,i[4]=(u-A)*M,i[5]=(1-(d+f))*M,i[6]=(S+p)*M,i[7]=0,i[8]=(m+T)*w,i[9]=(S-p)*w,i[10]=(1-(d+g))*w,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=Vi.set(i[0],i[1],i[2]).length(),a=Vi.set(i[4],i[5],i[6]).length(),o=Vi.set(i[8],i[9],i[10]).length();if(s<0)r=-r;dn.copy(this);let l=1/r,c=1/a,h=1/o;return dn.elements[0]*=l,dn.elements[1]*=l,dn.elements[2]*=l,dn.elements[4]*=c,dn.elements[5]*=c,dn.elements[6]*=c,dn.elements[8]*=h,dn.elements[9]*=h,dn.elements[10]*=h,t.setFromRotationMatrix(dn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,r,a=2000,o=!1){let l=this.elements,c=2*s/(t-e),h=2*s/(n-i),d=(t+e)/(t-e),u=(n+i)/(n-i),m,g;if(o)m=s/(r-s),g=r*s/(r-s);else if(a===2000)m=-(r+s)/(r-s),g=-2*r*s/(r-s);else if(a===2001)m=-r/(r-s),g=-r*s/(r-s);else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,r,a=2000,o=!1){let l=this.elements,c=2/(t-e),h=2/(n-i),d=-(t+e)/(t-e),u=-(n+i)/(n-i),m,g;if(o)m=1/(r-s),g=r/(r-s);else if(a===2000)m=-2/(r-s),g=-(r+s)/(r-s);else if(a===2001)m=-1/(r-s),g=-s/(r-s);else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=u,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}var Vi=new U,dn=new Oe,rf=new U(0,0,0),af=new U(1,1,1),Qn=new U,dr=new U,Yt=new U,gc=new Oe,_c=new on;class Wn{constructor(e=0,t=0,n=0,i=Wn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],a=i[8],o=i[1],l=i[5],c=i[9],h=i[2],d=i[6],u=i[10];switch(t){case"XYZ":if(this._y=Math.asin(We(a,-1,1)),Math.abs(a)<0.9999999)this._x=Math.atan2(-c,u),this._z=Math.atan2(-r,s);else this._x=Math.atan2(d,l),this._z=0;break;case"YXZ":if(this._x=Math.asin(-We(c,-1,1)),Math.abs(c)<0.9999999)this._y=Math.atan2(a,u),this._z=Math.atan2(o,l);else this._y=Math.atan2(-h,s),this._z=0;break;case"ZXY":if(this._x=Math.asin(We(d,-1,1)),Math.abs(d)<0.9999999)this._y=Math.atan2(-h,u),this._z=Math.atan2(-r,l);else this._y=0,this._z=Math.atan2(o,s);break;case"ZYX":if(this._y=Math.asin(-We(h,-1,1)),Math.abs(h)<0.9999999)this._x=Math.atan2(d,u),this._z=Math.atan2(o,s);else this._x=0,this._z=Math.atan2(-r,l);break;case"YZX":if(this._z=Math.asin(We(o,-1,1)),Math.abs(o)<0.9999999)this._x=Math.atan2(-c,l),this._y=Math.atan2(-h,s);else this._x=0,this._y=Math.atan2(a,u);break;case"XZY":if(this._z=Math.asin(-We(r,-1,1)),Math.abs(r)<0.9999999)this._x=Math.atan2(d,l),this._y=Math.atan2(a,s);else this._x=Math.atan2(-c,u),this._y=0;break;default:Ee("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}if(this._order=t,n===!0)this._onChangeCallback();return this}setFromQuaternion(e,t,n){return gc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(gc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return _c.setFromEuler(this),this.setFromQuaternion(_c,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){if(this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0)this._order=e[3];return this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Wn.DEFAULT_ORDER="XYZ";class Gs{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}var of=0,xc=new U,Wi=new on,On=new Oe,fr=new U,Es=new U,lf=new U,cf=new on,vc=new U(1,0,0),yc=new U(0,1,0),Sc=new U(0,0,1),Mc={type:"added"},hf={type:"removed"},Xi={type:"childadded",child:null},La={type:"childremoved",child:null};class ut extends qn{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=gn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ut.DEFAULT_UP.clone();let e=new U,t=new Wn,n=new on,i=new U(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Oe},normalMatrix:{value:new Ue}}),this.matrix=new Oe,this.matrixWorld=new Oe,this.matrixAutoUpdate=ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){if(this.matrixAutoUpdate)this.updateMatrix();this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Wi.setFromAxisAngle(e,t),this.quaternion.multiply(Wi),this}rotateOnWorldAxis(e,t){return Wi.setFromAxisAngle(e,t),this.quaternion.premultiply(Wi),this}rotateX(e){return this.rotateOnAxis(vc,e)}rotateY(e){return this.rotateOnAxis(yc,e)}rotateZ(e){return this.rotateOnAxis(Sc,e)}translateOnAxis(e,t){return xc.copy(e).applyQuaternion(this.quaternion),this.position.add(xc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(vc,e)}translateY(e){return this.translateOnAxis(yc,e)}translateZ(e){return this.translateOnAxis(Sc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(On.copy(this.matrixWorld).invert())}lookAt(e,t,n){if(e.isVector3)fr.copy(e);else fr.set(e,t,n);let i=this.parent;if(this.updateWorldMatrix(!0,!1),Es.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight)On.lookAt(Es,fr,this.up);else On.lookAt(fr,Es,this.up);if(this.quaternion.setFromRotationMatrix(On),i)On.extractRotation(i.matrixWorld),Wi.setFromRotationMatrix(On),this.quaternion.premultiply(Wi.invert())}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}if(e===this)return Ne("Object3D.add: object can't be added as a child of itself.",e),this;if(e&&e.isObject3D)e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Mc),Xi.child=e,this.dispatchEvent(Xi),Xi.child=null;else Ne("Object3D.add: object not an instance of THREE.Object3D.",e);return this}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);if(t!==-1)e.parent=null,this.children.splice(t,1),e.dispatchEvent(hf),La.child=e,this.dispatchEvent(La),La.child=null;return this}removeFromParent(){let e=this.parent;if(e!==null)e.remove(this);return this}clear(){return this.remove(...this.children)}attach(e){if(this.updateWorldMatrix(!0,!1),On.copy(this.matrixWorld).invert(),e.parent!==null)e.parent.updateWorldMatrix(!0,!1),On.multiply(e.parent.matrixWorld);return e.applyMatrix4(On),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Mc),Xi.child=e,this.dispatchEvent(Xi),Xi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}return}getObjectsByProperty(e,t,n=[]){if(this[e]===t)n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Es,e,lf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Es,cf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;if(t!==null)e(t),t.traverseAncestors(e)}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let{x:t,y:n,z:i}=e,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||e){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,e=!0}let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null)i.updateWorldMatrix(!0,!1);if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||n){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,n=!0}if(t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==="string",n={};if(t)e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"};let i={};if(i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0)i.userData=this.userData;if(i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null)i.pivot=this.pivot.toArray();if(this.morphTargetDictionary!==void 0)i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary);if(this.morphTargetInfluences!==void 0)i.morphTargetInfluences=this.morphTargetInfluences.slice();if(this.isInstancedMesh){if(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null)i.instanceColor=this.instanceColor.toJSON()}if(this.isBatchedMesh){if(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map((a)=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map((a)=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null)i.colorsTexture=this._colorsTexture.toJSON(e);if(this.boundingSphere!==null)i.boundingSphere=this.boundingSphere.toJSON();if(this.boundingBox!==null)i.boundingBox=this.boundingBox.toJSON()}function s(a,o){if(a[o.uuid]===void 0)a[o.uuid]=o.toJSON(e);return o.uuid}if(this.isScene){if(this.background){if(this.background.isColor)i.background=this.background.toJSON();else if(this.background.isTexture)i.background=this.background.toJSON(e).uuid}if(this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0)i.environment=this.environment.toJSON(e).uuid}else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let o=a.shapes;if(Array.isArray(o))for(let l=0,c=o.length;l<c;l++){let h=o[l];s(e.shapes,h)}else s(e.shapes,o)}}if(this.isSkinnedMesh){if(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0)s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid}if(this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let o=0,l=this.material.length;o<l;o++)a.push(s(e.materials,this.material[o]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let o=this.animations[a];i.animations.push(s(e.animations,o))}}if(t){let a=r(e.geometries),o=r(e.materials),l=r(e.textures),c=r(e.images),h=r(e.shapes),d=r(e.skeletons),u=r(e.animations),m=r(e.nodes);if(a.length>0)n.geometries=a;if(o.length>0)n.materials=o;if(l.length>0)n.textures=l;if(c.length>0)n.images=c;if(h.length>0)n.shapes=h;if(d.length>0)n.skeletons=d;if(u.length>0)n.animations=u;if(m.length>0)n.nodes=m}return n.object=i,n;function r(a){let o=[];for(let l in a){let c=a[l];delete c.metadata,o.push(c)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}ut.DEFAULT_UP=new U(0,1,0);ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Kt extends ut{constructor(){super();this.isGroup=!0,this.type="Group"}}var uf={type:"move"};class Vs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){if(this._hand===null)this._hand=new Kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1};return this._hand}getTargetRaySpace(){if(this._targetRay===null)this._targetRay=new Kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U;return this._targetRay}getGripSpace(){if(this._grip===null)this._grip=new Kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1;return this._grip}dispatchEvent(e){if(this._targetRay!==null)this._targetRay.dispatchEvent(e);if(this._grip!==null)this._grip.dispatchEvent(e);if(this._hand!==null)this._hand.dispatchEvent(e);return this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){if(this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null)this._targetRay.visible=!1;if(this._grip!==null)this._grip.visible=!1;if(this._hand!==null)this._hand.visible=!1;return this}update(e,t,n){let i=null,s=null,r=null,a=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){r=!0;for(let g of e.hand.values()){let S=t.getJointPose(g,n),f=this._getHandJoint(l,g);if(S!==null)f.matrix.fromArray(S.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=S.radius;f.visible=S!==null}let c=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=c.position.distanceTo(h.position),u=0.02,m=0.005;if(l.inputState.pinching&&d>u+m)l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this});else if(!l.inputState.pinching&&d<=u-m)l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this})}else if(o!==null&&e.gripSpace){if(s=t.getPose(e.gripSpace,n),s!==null){if(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity)o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity);else o.hasLinearVelocity=!1;if(s.angularVelocity)o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity);else o.hasAngularVelocity=!1;if(o.eventsEnabled)o.dispatchEvent({type:"gripUpdated",data:e,target:this})}}if(a!==null){if(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null)i=s;if(i!==null){if(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity)a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity);else a.hasLinearVelocity=!1;if(i.angularVelocity)a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity);else a.hasAngularVelocity=!1;this.dispatchEvent(uf)}}}if(a!==null)a.visible=i!==null;if(o!==null)o.visible=s!==null;if(l!==null)l.visible=r!==null;return this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Kt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}var Zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ei={h:0,s:0,l:0},pr={h:0,s:0,l:0};function Na(e,t,n){if(n<0)n+=1;if(n>1)n-=1;if(n<0.16666666666666666)return e+(t-e)*6*n;if(n<0.5)return t;if(n<0.6666666666666666)return e+(t-e)*6*(0.6666666666666666-n);return e}class Ie{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;if(i&&i.isColor)this.copy(i);else if(typeof i==="number")this.setHex(i);else if(typeof i==="string")this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t="srgb"){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=He.workingColorSpace){return this.r=e,this.g=t,this.b=n,He.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=He.workingColorSpace){if(e=tl(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=0.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=Na(r,s,e+0.3333333333333333),this.g=Na(r,s,e),this.b=Na(r,s,e-0.3333333333333333)}return He.colorSpaceToWorking(this,i),this}setStyle(e,t="srgb"){function n(s){if(s===void 0)return;if(parseFloat(s)<1)Ee("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ee("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);else if(r===6)return this.setHex(parseInt(s,16),t);else Ee("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t="srgb"){let n=Zh[e.toLowerCase()];if(n!==void 0)this.setHex(n,t);else Ee("Color: Unknown color "+e);return this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vn(e.r),this.g=Vn(e.g),this.b=Vn(e.b),this}copyLinearToSRGB(e){return this.r=ns(e.r),this.g=ns(e.g),this.b=ns(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e="srgb"){return He.workingToColorSpace(Ot.copy(this),e),Math.round(We(Ot.r*255,0,255))*65536+Math.round(We(Ot.g*255,0,255))*256+Math.round(We(Ot.b*255,0,255))}getHexString(e="srgb"){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=He.workingColorSpace){He.workingToColorSpace(Ot.copy(this),t);let{r:n,g:i,b:s}=Ot,r=Math.max(n,i,s),a=Math.min(n,i,s),o,l,c=(a+r)/2;if(a===r)o=0,l=0;else{let h=r-a;switch(l=c<=0.5?h/(r+a):h/(2-r-a),r){case n:o=(i-s)/h+(i<s?6:0);break;case i:o=(s-n)/h+2;break;case s:o=(n-i)/h+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=He.workingColorSpace){return He.workingToColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e="srgb"){He.workingToColorSpace(Ot.copy(this),e);let{r:t,g:n,b:i}=Ot;if(e!=="srgb")return`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`;return`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ei),this.setHSL(ei.h+e,ei.s+t,ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ei),e.getHSL(pr);let n=Ds(ei.h,pr.h,t),i=Ds(ei.s,pr.s,t),s=Ds(ei.l,pr.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}var Ot=new Ie;Ie.NAMES=Zh;class Ws{constructor(e,t=1,n=1000){this.isFog=!0,this.name="",this.color=new Ie(e),this.near=t,this.far=n}clone(){return new Ws(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ea extends ut{constructor(){super();if(this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wn,this.environmentIntensity=1,this.environmentRotation=new Wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){if(super.copy(e,t),e.background!==null)this.background=e.background.clone();if(e.environment!==null)this.environment=e.environment.clone();if(e.fog!==null)this.fog=e.fog.clone();if(this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null)this.overrideMaterial=e.overrideMaterial.clone();return this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);if(this.fog!==null)t.object.fog=this.fog.toJSON();return t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}var fn=new U,Bn=new U,Da=new U,zn=new U,qi=new U,Yi=new U,bc=new U,Ua=new U,Fa=new U,Oa=new U,Ba=new it,za=new it,ka=new it;class an{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),fn.subVectors(e,t),i.cross(fn);let s=i.lengthSq();if(s>0)return i.multiplyScalar(1/Math.sqrt(s));return i.set(0,0,0)}static getBarycoord(e,t,n,i,s){fn.subVectors(i,t),Bn.subVectors(n,t),Da.subVectors(e,t);let r=fn.dot(fn),a=fn.dot(Bn),o=fn.dot(Da),l=Bn.dot(Bn),c=Bn.dot(Da),h=r*l-a*a;if(h===0)return s.set(0,0,0),null;let d=1/h,u=(l*o-a*c)*d,m=(r*c-a*o)*d;return s.set(1-u-m,m,u)}static containsPoint(e,t,n,i){if(this.getBarycoord(e,t,n,i,zn)===null)return!1;return zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(e,t,n,i,s,r,a,o){if(this.getBarycoord(e,t,n,i,zn)===null){if(o.x=0,o.y=0,"z"in o)o.z=0;if("w"in o)o.w=0;return null}return o.setScalar(0),o.addScaledVector(s,zn.x),o.addScaledVector(r,zn.y),o.addScaledVector(a,zn.z),o}static getInterpolatedAttribute(e,t,n,i,s,r){return Ba.setScalar(0),za.setScalar(0),ka.setScalar(0),Ba.fromBufferAttribute(e,t),za.fromBufferAttribute(e,n),ka.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Ba,s.x),r.addScaledVector(za,s.y),r.addScaledVector(ka,s.z),r}static isFrontFacing(e,t,n,i){return fn.subVectors(n,t),Bn.subVectors(e,t),fn.cross(Bn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),fn.cross(Bn).length()*0.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(0.3333333333333333)}getNormal(e){return an.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return an.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return an.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return an.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return an.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,a;qi.subVectors(i,n),Yi.subVectors(s,n),Ua.subVectors(e,n);let o=qi.dot(Ua),l=Yi.dot(Ua);if(o<=0&&l<=0)return t.copy(n);Fa.subVectors(e,i);let c=qi.dot(Fa),h=Yi.dot(Fa);if(c>=0&&h<=c)return t.copy(i);let d=o*h-c*l;if(d<=0&&o>=0&&c<=0)return r=o/(o-c),t.copy(n).addScaledVector(qi,r);Oa.subVectors(e,s);let u=qi.dot(Oa),m=Yi.dot(Oa);if(m>=0&&u<=m)return t.copy(s);let g=u*l-o*m;if(g<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(n).addScaledVector(Yi,a);let S=c*m-u*h;if(S<=0&&h-c>=0&&u-m>=0)return bc.subVectors(s,i),a=(h-c)/(h-c+(u-m)),t.copy(i).addScaledVector(bc,a);let f=1/(S+g+d);return r=g*f,a=d*f,t.copy(n).addScaledVector(qi,r).addScaledVector(Yi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Gt{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=pn.copy(t).multiplyScalar(0.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(0.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,a=s.count;r<a;r++){if(e.isMesh===!0)e.getVertexPosition(r,pn);else pn.fromBufferAttribute(s,r);pn.applyMatrix4(e.matrixWorld),this.expandByPoint(pn)}else{if(e.boundingBox!==void 0){if(e.boundingBox===null)e.computeBoundingBox();mr.copy(e.boundingBox)}else{if(n.boundingBox===null)n.computeBoundingBox();mr.copy(n.boundingBox)}mr.applyMatrix4(e.matrixWorld),this.union(mr)}}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pn),pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;if(e.normal.x>0)t=e.normal.x*this.min.x,n=e.normal.x*this.max.x;else t=e.normal.x*this.max.x,n=e.normal.x*this.min.x;if(e.normal.y>0)t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y;else t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y;if(e.normal.z>0)t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z;else t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z;return t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ws),gr.subVectors(this.max,ws),Zi.subVectors(e.a,ws),Ki.subVectors(e.b,ws),Ji.subVectors(e.c,ws),ti.subVectors(Ki,Zi),ni.subVectors(Ji,Ki),_i.subVectors(Zi,Ji);let t=[0,-ti.z,ti.y,0,-ni.z,ni.y,0,-_i.z,_i.y,ti.z,0,-ti.x,ni.z,0,-ni.x,_i.z,0,-_i.x,-ti.y,ti.x,0,-ni.y,ni.x,0,-_i.y,_i.x,0];if(!Ha(t,Zi,Ki,Ji,gr))return!1;if(t=[1,0,0,0,1,0,0,0,1],!Ha(t,Zi,Ki,Ji,gr))return!1;return _r.crossVectors(ti,ni),t=[_r.x,_r.y,_r.z],Ha(t,Zi,Ki,Ji,gr)}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pn).distanceTo(e)}getBoundingSphere(e){if(this.isEmpty())e.makeEmpty();else this.getCenter(e.center),e.radius=this.getSize(pn).length()*0.5;return e}intersect(e){if(this.min.max(e.min),this.max.min(e.max),this.isEmpty())this.makeEmpty();return this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){if(this.isEmpty())return this;return kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(kn),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}var kn=[new U,new U,new U,new U,new U,new U,new U,new U],pn=new U,mr=new Gt,Zi=new U,Ki=new U,Ji=new U,ti=new U,ni=new U,_i=new U,ws=new U,gr=new U,_r=new U,xi=new U;function Ha(e,t,n,i,s){for(let r=0,a=e.length-3;r<=a;r+=3){xi.fromArray(e,r);let o=s.x*Math.abs(xi.x)+s.y*Math.abs(xi.y)+s.z*Math.abs(xi.z),l=t.dot(xi),c=n.dot(xi),h=i.dot(xi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Mt=new U,xr=new De,df=0;class Lt extends qn{constructor(e,t,n=!1){super();if(Array.isArray(e))throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:df++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){if(e===!0)this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xr.fromBufferAttribute(this,t),xr.applyMatrix3(e),this.setXY(t,xr.x,xr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];if(this.normalized)n=mn(n,this.array);return n}setComponent(e,t,n){if(this.normalized)n=nt(n,this.array);return this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];if(this.normalized)t=mn(t,this.array);return t}setX(e,t){if(this.normalized)t=nt(t,this.array);return this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];if(this.normalized)t=mn(t,this.array);return t}setY(e,t){if(this.normalized)t=nt(t,this.array);return this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];if(this.normalized)t=mn(t,this.array);return t}setZ(e,t){if(this.normalized)t=nt(t,this.array);return this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];if(this.normalized)t=mn(t,this.array);return t}setW(e,t){if(this.normalized)t=nt(t,this.array);return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){if(e*=this.itemSize,this.normalized)t=nt(t,this.array),n=nt(n,this.array);return this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){if(e*=this.itemSize,this.normalized)t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array);return this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){if(e*=this.itemSize,this.normalized)t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array),s=nt(s,this.array);return this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class ta extends Lt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class na extends Lt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class gt extends Lt{constructor(e,t,n){super(new Float32Array(e),t,n)}}var ff=new Gt,As=new U,Ga=new U;class jt{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;if(t!==void 0)n.copy(t);else ff.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);if(t.copy(e),n>this.radius*this.radius)t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center);return t}getBoundingBox(e){if(this.isEmpty())return e.makeEmpty(),e;return e.set(this.center,this.center),e.expandByScalar(this.radius),e}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;As.subVectors(e,this.center);let t=As.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*0.5;this.center.addScaledVector(As,i/n),this.radius+=i}return this}union(e){if(e.isEmpty())return this;if(this.isEmpty())return this.copy(e),this;if(this.center.equals(e.center)===!0)this.radius=Math.max(this.radius,e.radius);else Ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(As.copy(e.center).add(Ga)),this.expandByPoint(As.copy(e.center).sub(Ga));return this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}var pf=0,rn=new Oe,Va=new ut,$i=new U,Zt=new Gt,Rs=new Gt,Pt=new U;class Rt extends qn{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pf++}),this.uuid=gn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){if(Array.isArray(e))this.index=new((Od(e))?na:ta)(e,1);else this.index=e;return this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;if(t!==void 0)t.applyMatrix4(e),t.needsUpdate=!0;let n=this.attributes.normal;if(n!==void 0){let s=new Ue().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;if(i!==void 0)i.transformDirection(e),i.needsUpdate=!0;if(this.boundingBox!==null)this.computeBoundingBox();if(this.boundingSphere!==null)this.computeBoundingSphere();return this._transformed=!0,this}applyQuaternion(e){return rn.makeRotationFromQuaternion(e),this.applyMatrix4(rn),this}rotateX(e){return rn.makeRotationX(e),this.applyMatrix4(rn),this}rotateY(e){return rn.makeRotationY(e),this.applyMatrix4(rn),this}rotateZ(e){return rn.makeRotationZ(e),this.applyMatrix4(rn),this}translate(e,t,n){return rn.makeTranslation(e,t,n),this.applyMatrix4(rn),this}scale(e,t,n){return rn.makeScale(e,t,n),this.applyMatrix4(rn),this}lookAt(e){return Va.lookAt(e),Va.updateMatrix(),this.applyMatrix4(Va.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($i).negate(),this.translate($i.x,$i.y,$i.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new gt(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}if(e.length>t.count)Ee("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.");t.needsUpdate=!0}return this}computeBoundingBox(){if(this.boundingBox===null)this.boundingBox=new Gt;let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];if(Zt.setFromBufferAttribute(s),this.morphTargetsRelative)Pt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Pt);else this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max)}}else this.boundingBox.makeEmpty();if(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))Ne('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){if(this.boundingSphere===null)this.boundingSphere=new jt;let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let a=t[s];if(Rs.setFromBufferAttribute(a),this.morphTargetsRelative)Pt.addVectors(Zt.min,Rs.min),Zt.expandByPoint(Pt),Pt.addVectors(Zt.max,Rs.max),Zt.expandByPoint(Pt);else Zt.expandByPoint(Rs.min),Zt.expandByPoint(Rs.max)}Zt.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)Pt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Pt));if(t)for(let s=0,r=t.length;s<r;s++){let a=t[s],o=this.morphTargetsRelative;for(let l=0,c=a.count;l<c;l++){if(Pt.fromBufferAttribute(a,l),o)$i.fromBufferAttribute(e,l),Pt.add($i);i=Math.max(i,n.distanceToSquared(Pt))}}if(this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius))Ne('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ne("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let{position:n,normal:i,uv:s}=t,r=this.getAttribute("tangent");if(r===void 0||r.count!==n.count)r=new Lt(new Float32Array(4*n.count),4),this.setAttribute("tangent",r);let a=[],o=[];for(let R=0;R<n.count;R++)a[R]=new U,o[R]=new U;let l=new U,c=new U,h=new U,d=new De,u=new De,m=new De,g=new U,S=new U;function f(R,x,E){l.fromBufferAttribute(n,R),c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,E),d.fromBufferAttribute(s,R),u.fromBufferAttribute(s,x),m.fromBufferAttribute(s,E),c.sub(l),h.sub(l),u.sub(d),m.sub(d);let k=1/(u.x*m.y-m.x*u.y);if(!isFinite(k))return;g.copy(c).multiplyScalar(m.y).addScaledVector(h,-u.y).multiplyScalar(k),S.copy(h).multiplyScalar(u.x).addScaledVector(c,-m.x).multiplyScalar(k),a[R].add(g),a[x].add(g),a[E].add(g),o[R].add(S),o[x].add(S),o[E].add(S)}let p=this.groups;if(p.length===0)p=[{start:0,count:e.count}];for(let R=0,x=p.length;R<x;++R){let E=p[R],{start:k,count:D}=E;for(let F=k,j=k+D;F<j;F+=3)f(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let T=new U,A=new U,y=new U,M=new U;function w(R){y.fromBufferAttribute(i,R),M.copy(y);let x=a[R];T.copy(x),T.sub(y.multiplyScalar(y.dot(x))).normalize(),A.crossVectors(M,x);let k=A.dot(o[R])<0?-1:1;r.setXYZW(R,T.x,T.y,T.z,k)}for(let R=0,x=p.length;R<x;++R){let E=p[R],{start:k,count:D}=E;for(let F=k,j=k+D;F<j;F+=3)w(e.getX(F+0)),w(e.getX(F+1)),w(e.getX(F+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Lt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,u=n.count;d<u;d++)n.setXYZ(d,0,0,0);let i=new U,s=new U,r=new U,a=new U,o=new U,l=new U,c=new U,h=new U;if(e)for(let d=0,u=e.count;d<u;d+=3){let m=e.getX(d+0),g=e.getX(d+1),S=e.getX(d+2);i.fromBufferAttribute(t,m),s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,S),c.subVectors(r,s),h.subVectors(i,s),c.cross(h),a.fromBufferAttribute(n,m),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,S),a.add(c),o.add(c),l.add(c),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(S,l.x,l.y,l.z)}else for(let d=0,u=t.count;d<u;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),c.subVectors(r,s),h.subVectors(i,s),c.cross(h),n.setXYZ(d+0,c.x,c.y,c.z),n.setXYZ(d+1,c.x,c.y,c.z),n.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(a,o){let{array:l,itemSize:c,normalized:h}=a,d=new l.constructor(o.length*c),u=0,m=0;for(let g=0,S=o.length;g<S;g++){if(a.isInterleavedBufferAttribute)u=o[g]*a.data.stride+a.offset;else u=o[g]*c;for(let f=0;f<c;f++)d[m++]=l[u++]}return new Lt(d,c,h)}if(this.index===null)return Ee("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new Rt,n=this.index.array,i=this.attributes;for(let a in i){let o=i[a],l=e(o,n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let o=[],l=s[a];for(let c=0,h=l.length;c<h;c++){let d=l[c],u=e(d,n);o.push(u)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let a=0,o=r.length;a<o;a++){let l=r[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0)e.userData=this.userData;if(this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let l in o)if(o[l]!==void 0)e[l]=o[l];return e}e.data={attributes:{}};let t=this.index;if(t!==null)e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)};let n=this.attributes;for(let o in n){let l=n[o];e.data.attributes[o]=l.toJSON(e.data)}let i={},s=!1;for(let o in this.morphAttributes){let l=this.morphAttributes[o],c=[];for(let h=0,d=l.length;h<d;h++){let u=l[h];c.push(u.toJSON(e.data))}if(c.length>0)i[o]=c,s=!0}if(s)e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;if(r.length>0)e.data.groups=JSON.parse(JSON.stringify(r));let a=this.boundingSphere;if(a!==null)e.data.boundingSphere=a.toJSON();return e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;if(n!==null)this.setIndex(n.clone());let i=e.attributes;for(let l in i){let c=i[l];this.setAttribute(l,c.clone(t))}let s=e.morphAttributes;for(let l in s){let c=[],h=s[l];for(let d=0,u=h.length;d<u;d++)c.push(h[d].clone(t));this.morphAttributes[l]=c}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let l=0,c=r.length;l<c;l++){let h=r[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;if(a!==null)this.boundingBox=a.clone();let o=e.boundingSphere;if(o!==null)this.boundingSphere=o.clone();return this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xs{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=gn()}onUploadCallback(){}set needsUpdate(e){if(e===!0)this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){if(e.arrayBuffers===void 0)e.arrayBuffers={};if(this.array.buffer._uuid===void 0)this.array.buffer._uuid=gn();if(e.arrayBuffers[this.array.buffer._uuid]===void 0)e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer;let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){if(e.arrayBuffers===void 0)e.arrayBuffers={};if(this.array.buffer._uuid===void 0)this.array.buffer._uuid=gn();if(e.arrayBuffers[this.array.buffer._uuid]===void 0)e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}var Ht=new U;class fs{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];if(this.normalized)n=mn(n,this.array);return n}setComponent(e,t,n){if(this.normalized)n=nt(n,this.array);return this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){if(this.normalized)t=nt(t,this.array);return this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){if(this.normalized)t=nt(t,this.array);return this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){if(this.normalized)t=nt(t,this.array);return this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){if(this.normalized)t=nt(t,this.array);return this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];if(this.normalized)t=mn(t,this.array);return t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];if(this.normalized)t=mn(t,this.array);return t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];if(this.normalized)t=mn(t,this.array);return t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];if(this.normalized)t=mn(t,this.array);return t}setXY(e,t,n){if(e=e*this.data.stride+this.offset,this.normalized)t=nt(t,this.array),n=nt(n,this.array);return this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){if(e=e*this.data.stride+this.offset,this.normalized)t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array);return this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){if(e=e*this.data.stride+this.offset,this.normalized)t=nt(t,this.array),n=nt(n,this.array),i=nt(i,this.array),s=nt(s,this.array);return this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Us("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Lt(new this.array.constructor(t),this.itemSize,this.normalized)}else{if(e.interleavedBuffers===void 0)e.interleavedBuffers={};if(e.interleavedBuffers[this.data.uuid]===void 0)e.interleavedBuffers[this.data.uuid]=this.data.clone(e);return new fs(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}}toJSON(e){if(e===void 0){Us("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else{if(e.interleavedBuffers===void 0)e.interleavedBuffers={};if(e.interleavedBuffers[this.data.uuid]===void 0)e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e);return{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}}var Wa=new U,mf=new U,gf=new Ue;class En{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Wa.subVectors(n,t).cross(mf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(Wa),s=this.normal.dot(i);if(s===0){if(this.distanceToPoint(e.start)===0)return t.copy(e.start);return null}let r=-(e.start.dot(this.normal)+this.constant)/s;if(n===!0&&(r<0||r>1))return null;return t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||gf.getNormalMatrix(e),i=this.coplanarPoint(Wa).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}var _f=0;class Qt extends qn{constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=gn(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ie(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){if(this._alphaTest>0!==e>0)this.version++;this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e===void 0)return;for(let t in e){let n=e[t];if(n===void 0){Ee(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Ee(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}if(i&&i.isColor)i.set(n);else if(i&&i.isVector2&&(n&&n.isVector2)||i&&i.isEuler&&(n&&n.isEuler)||i&&i.isVector3&&(n&&n.isVector3))i.copy(n);else this[t]=n}}toJSON(e){let t=e===void 0||typeof e==="string";if(t)e={textures:{},images:{}};let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};if(n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor)n.color=this.color.getHex();if(this.roughness!==void 0)n.roughness=this.roughness;if(this.metalness!==void 0)n.metalness=this.metalness;if(this.sheen!==void 0)n.sheen=this.sheen;if(this.sheenColor&&this.sheenColor.isColor)n.sheenColor=this.sheenColor.getHex();if(this.sheenRoughness!==void 0)n.sheenRoughness=this.sheenRoughness;if(this.emissive&&this.emissive.isColor)n.emissive=this.emissive.getHex();if(this.emissiveIntensity!==void 0)n.emissiveIntensity=this.emissiveIntensity;if(this.specular&&this.specular.isColor)n.specular=this.specular.getHex();if(this.specularIntensity!==void 0)n.specularIntensity=this.specularIntensity;if(this.specularColor&&this.specularColor.isColor)n.specularColor=this.specularColor.getHex();if(this.shininess!==void 0)n.shininess=this.shininess;if(this.clearcoat!==void 0)n.clearcoat=this.clearcoat;if(this.clearcoatRoughness!==void 0)n.clearcoatRoughness=this.clearcoatRoughness;if(this.clearcoatMap&&this.clearcoatMap.isTexture)n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid;if(this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture)n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid;if(this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture)n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray();if(this.sheenColorMap&&this.sheenColorMap.isTexture)n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid;if(this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture)n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid;if(this.dispersion!==void 0)n.dispersion=this.dispersion;if(this.retroreflectivity!==void 0)n.retroreflectivity=this.retroreflectivity;if(this.iridescence!==void 0)n.iridescence=this.iridescence;if(this.iridescenceIOR!==void 0)n.iridescenceIOR=this.iridescenceIOR;if(this.iridescenceThicknessRange!==void 0)n.iridescenceThicknessRange=this.iridescenceThicknessRange;if(this.iridescenceMap&&this.iridescenceMap.isTexture)n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid;if(this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture)n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid;if(this.anisotropy!==void 0)n.anisotropy=this.anisotropy;if(this.anisotropyRotation!==void 0)n.anisotropyRotation=this.anisotropyRotation;if(this.anisotropyMap&&this.anisotropyMap.isTexture)n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid;if(this.map&&this.map.isTexture)n.map=this.map.toJSON(e).uuid;if(this.matcap&&this.matcap.isTexture)n.matcap=this.matcap.toJSON(e).uuid;if(this.alphaMap&&this.alphaMap.isTexture)n.alphaMap=this.alphaMap.toJSON(e).uuid;if(this.lightMap&&this.lightMap.isTexture)n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity;if(this.aoMap&&this.aoMap.isTexture)n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity;if(this.bumpMap&&this.bumpMap.isTexture)n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale;if(this.normalMap&&this.normalMap.isTexture)n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray();if(this.displacementMap&&this.displacementMap.isTexture)n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias;if(this.roughnessMap&&this.roughnessMap.isTexture)n.roughnessMap=this.roughnessMap.toJSON(e).uuid;if(this.metalnessMap&&this.metalnessMap.isTexture)n.metalnessMap=this.metalnessMap.toJSON(e).uuid;if(this.emissiveMap&&this.emissiveMap.isTexture)n.emissiveMap=this.emissiveMap.toJSON(e).uuid;if(this.specularMap&&this.specularMap.isTexture)n.specularMap=this.specularMap.toJSON(e).uuid;if(this.specularIntensityMap&&this.specularIntensityMap.isTexture)n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid;if(this.specularColorMap&&this.specularColorMap.isTexture)n.specularColorMap=this.specularColorMap.toJSON(e).uuid;if(this.envMap&&this.envMap.isTexture){if(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0)n.combine=this.combine}if(this.envMapRotation!==void 0)n.envMapRotation=this.envMapRotation.toArray();if(this.envMapIntensity!==void 0)n.envMapIntensity=this.envMapIntensity;if(this.reflectivity!==void 0)n.reflectivity=this.reflectivity;if(this.refractionRatio!==void 0)n.refractionRatio=this.refractionRatio;if(this.gradientMap&&this.gradientMap.isTexture)n.gradientMap=this.gradientMap.toJSON(e).uuid;if(this.transmission!==void 0)n.transmission=this.transmission;if(this.transmissionMap&&this.transmissionMap.isTexture)n.transmissionMap=this.transmissionMap.toJSON(e).uuid;if(this.thickness!==void 0)n.thickness=this.thickness;if(this.thicknessMap&&this.thicknessMap.isTexture)n.thicknessMap=this.thicknessMap.toJSON(e).uuid;if(this.attenuationDistance!==void 0)n.attenuationDistance=this.attenuationDistance;if(this.attenuationColor!==void 0)n.attenuationColor=this.attenuationColor.getHex();if(this.size!==void 0)n.size=this.size;if(this.sizeAttenuation!==void 0)n.sizeAttenuation=this.sizeAttenuation;if(Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0)n.clippingPlanes=this.clippingPlanes.map((s)=>s.toJSON());if(this.rotation!==void 0)n.rotation=this.rotation;if(this.depthPacking!==void 0)n.depthPacking=this.depthPacking;if(this.linewidth!==void 0)n.linewidth=this.linewidth;if(this.linecap!==void 0)n.linecap=this.linecap;if(this.linejoin!==void 0)n.linejoin=this.linejoin;if(this.dashSize!==void 0)n.dashSize=this.dashSize;if(this.gapSize!==void 0)n.gapSize=this.gapSize;if(this.scale!==void 0)n.scale=this.scale;if(this.wireframe!==void 0)n.wireframe=this.wireframe;if(this.wireframeLinewidth!==void 0)n.wireframeLinewidth=this.wireframeLinewidth;if(this.wireframeLinecap!==void 0)n.wireframeLinecap=this.wireframeLinecap;if(this.wireframeLinejoin!==void 0)n.wireframeLinejoin=this.wireframeLinejoin;if(this.flatShading!==void 0)n.flatShading=this.flatShading;if(this.fog!==void 0)n.fog=this.fog;if(Object.keys(this.userData).length>0)n.userData=this.userData;function i(s){let r=[];for(let a in s){let o=s[a];delete o.metadata,r.push(o)}return r}if(t){let s=i(e.textures),r=i(e.images);if(s.length>0)n.textures=s;if(r.length>0)n.images=r}return n}fromJSON(e,t){if(e.uuid!==void 0)this.uuid=e.uuid;if(e.name!==void 0)this.name=e.name;if(e.color!==void 0&&this.color!==void 0)this.color.setHex(e.color);if(e.roughness!==void 0)this.roughness=e.roughness;if(e.metalness!==void 0)this.metalness=e.metalness;if(e.sheen!==void 0)this.sheen=e.sheen;if(e.sheenColor!==void 0)this.sheenColor=new Ie().setHex(e.sheenColor);if(e.sheenRoughness!==void 0)this.sheenRoughness=e.sheenRoughness;if(e.emissive!==void 0&&this.emissive!==void 0)this.emissive.setHex(e.emissive);if(e.specular!==void 0&&this.specular!==void 0)this.specular.setHex(e.specular);if(e.specularIntensity!==void 0)this.specularIntensity=e.specularIntensity;if(e.specularColor!==void 0&&this.specularColor!==void 0)this.specularColor.setHex(e.specularColor);if(e.shininess!==void 0)this.shininess=e.shininess;if(e.clearcoat!==void 0)this.clearcoat=e.clearcoat;if(e.clearcoatRoughness!==void 0)this.clearcoatRoughness=e.clearcoatRoughness;if(e.dispersion!==void 0)this.dispersion=e.dispersion;if(e.retroreflectivity!==void 0)this.retroreflectivity=e.retroreflectivity;if(e.iridescence!==void 0)this.iridescence=e.iridescence;if(e.iridescenceIOR!==void 0)this.iridescenceIOR=e.iridescenceIOR;if(e.iridescenceThicknessRange!==void 0)this.iridescenceThicknessRange=e.iridescenceThicknessRange;if(e.transmission!==void 0)this.transmission=e.transmission;if(e.thickness!==void 0)this.thickness=e.thickness;if(e.attenuationDistance!==void 0)this.attenuationDistance=e.attenuationDistance;if(e.attenuationColor!==void 0&&this.attenuationColor!==void 0)this.attenuationColor.setHex(e.attenuationColor);if(e.anisotropy!==void 0)this.anisotropy=e.anisotropy;if(e.anisotropyRotation!==void 0)this.anisotropyRotation=e.anisotropyRotation;if(e.fog!==void 0)this.fog=e.fog;if(e.flatShading!==void 0)this.flatShading=e.flatShading;if(e.blending!==void 0)this.blending=e.blending;if(e.combine!==void 0)this.combine=e.combine;if(e.side!==void 0)this.side=e.side;if(e.shadowSide!==void 0)this.shadowSide=e.shadowSide;if(e.opacity!==void 0)this.opacity=e.opacity;if(e.transparent!==void 0)this.transparent=e.transparent;if(e.alphaTest!==void 0)this.alphaTest=e.alphaTest;if(e.alphaHash!==void 0)this.alphaHash=e.alphaHash;if(e.depthFunc!==void 0)this.depthFunc=e.depthFunc;if(e.depthTest!==void 0)this.depthTest=e.depthTest;if(e.depthWrite!==void 0)this.depthWrite=e.depthWrite;if(e.colorWrite!==void 0)this.colorWrite=e.colorWrite;if(e.clippingPlanes!==void 0)this.clippingPlanes=e.clippingPlanes.map((n)=>new En().fromJSON(n));if(e.clipIntersection!==void 0)this.clipIntersection=e.clipIntersection;if(e.clipShadows!==void 0)this.clipShadows=e.clipShadows;if(e.depthPacking!==void 0)this.depthPacking=e.depthPacking;if(e.blendSrc!==void 0)this.blendSrc=e.blendSrc;if(e.blendDst!==void 0)this.blendDst=e.blendDst;if(e.blendEquation!==void 0)this.blendEquation=e.blendEquation;if(e.blendSrcAlpha!==void 0)this.blendSrcAlpha=e.blendSrcAlpha;if(e.blendDstAlpha!==void 0)this.blendDstAlpha=e.blendDstAlpha;if(e.blendEquationAlpha!==void 0)this.blendEquationAlpha=e.blendEquationAlpha;if(e.blendColor!==void 0&&this.blendColor!==void 0)this.blendColor.setHex(e.blendColor);if(e.blendAlpha!==void 0)this.blendAlpha=e.blendAlpha;if(e.stencilWriteMask!==void 0)this.stencilWriteMask=e.stencilWriteMask;if(e.stencilFunc!==void 0)this.stencilFunc=e.stencilFunc;if(e.stencilRef!==void 0)this.stencilRef=e.stencilRef;if(e.stencilFuncMask!==void 0)this.stencilFuncMask=e.stencilFuncMask;if(e.stencilFail!==void 0)this.stencilFail=e.stencilFail;if(e.stencilZFail!==void 0)this.stencilZFail=e.stencilZFail;if(e.stencilZPass!==void 0)this.stencilZPass=e.stencilZPass;if(e.stencilWrite!==void 0)this.stencilWrite=e.stencilWrite;if(e.wireframe!==void 0)this.wireframe=e.wireframe;if(e.wireframeLinewidth!==void 0)this.wireframeLinewidth=e.wireframeLinewidth;if(e.wireframeLinecap!==void 0)this.wireframeLinecap=e.wireframeLinecap;if(e.wireframeLinejoin!==void 0)this.wireframeLinejoin=e.wireframeLinejoin;if(e.rotation!==void 0)this.rotation=e.rotation;if(e.linewidth!==void 0)this.linewidth=e.linewidth;if(e.linecap!==void 0)this.linecap=e.linecap;if(e.linejoin!==void 0)this.linejoin=e.linejoin;if(e.dashSize!==void 0)this.dashSize=e.dashSize;if(e.gapSize!==void 0)this.gapSize=e.gapSize;if(e.scale!==void 0)this.scale=e.scale;if(e.polygonOffset!==void 0)this.polygonOffset=e.polygonOffset;if(e.polygonOffsetFactor!==void 0)this.polygonOffsetFactor=e.polygonOffsetFactor;if(e.polygonOffsetUnits!==void 0)this.polygonOffsetUnits=e.polygonOffsetUnits;if(e.dithering!==void 0)this.dithering=e.dithering;if(e.alphaToCoverage!==void 0)this.alphaToCoverage=e.alphaToCoverage;if(e.premultipliedAlpha!==void 0)this.premultipliedAlpha=e.premultipliedAlpha;if(e.forceSinglePass!==void 0)this.forceSinglePass=e.forceSinglePass;if(e.allowOverride!==void 0)this.allowOverride=e.allowOverride;if(e.visible!==void 0)this.visible=e.visible;if(e.toneMapped!==void 0)this.toneMapped=e.toneMapped;if(e.userData!==void 0)this.userData=e.userData;if(e.vertexColors!==void 0)if(typeof e.vertexColors==="number")this.vertexColors=e.vertexColors>0;else this.vertexColors=e.vertexColors;if(e.size!==void 0)this.size=e.size;if(e.sizeAttenuation!==void 0)this.sizeAttenuation=e.sizeAttenuation;if(e.map!==void 0)this.map=t[e.map]||null;if(e.matcap!==void 0)this.matcap=t[e.matcap]||null;if(e.alphaMap!==void 0)this.alphaMap=t[e.alphaMap]||null;if(e.bumpMap!==void 0)this.bumpMap=t[e.bumpMap]||null;if(e.bumpScale!==void 0)this.bumpScale=e.bumpScale;if(e.normalMap!==void 0)this.normalMap=t[e.normalMap]||null;if(e.normalMapType!==void 0)this.normalMapType=e.normalMapType;if(e.normalScale!==void 0){let n=e.normalScale;if(Array.isArray(n)===!1)n=[n,n];this.normalScale=new De().fromArray(n)}if(e.displacementMap!==void 0)this.displacementMap=t[e.displacementMap]||null;if(e.displacementScale!==void 0)this.displacementScale=e.displacementScale;if(e.displacementBias!==void 0)this.displacementBias=e.displacementBias;if(e.roughnessMap!==void 0)this.roughnessMap=t[e.roughnessMap]||null;if(e.metalnessMap!==void 0)this.metalnessMap=t[e.metalnessMap]||null;if(e.emissiveMap!==void 0)this.emissiveMap=t[e.emissiveMap]||null;if(e.emissiveIntensity!==void 0)this.emissiveIntensity=e.emissiveIntensity;if(e.specularMap!==void 0)this.specularMap=t[e.specularMap]||null;if(e.specularIntensityMap!==void 0)this.specularIntensityMap=t[e.specularIntensityMap]||null;if(e.specularColorMap!==void 0)this.specularColorMap=t[e.specularColorMap]||null;if(e.envMap!==void 0)this.envMap=t[e.envMap]||null;if(e.envMapRotation!==void 0)this.envMapRotation.fromArray(e.envMapRotation);if(e.envMapIntensity!==void 0)this.envMapIntensity=e.envMapIntensity;if(e.reflectivity!==void 0)this.reflectivity=e.reflectivity;if(e.refractionRatio!==void 0)this.refractionRatio=e.refractionRatio;if(e.lightMap!==void 0)this.lightMap=t[e.lightMap]||null;if(e.lightMapIntensity!==void 0)this.lightMapIntensity=e.lightMapIntensity;if(e.aoMap!==void 0)this.aoMap=t[e.aoMap]||null;if(e.aoMapIntensity!==void 0)this.aoMapIntensity=e.aoMapIntensity;if(e.gradientMap!==void 0)this.gradientMap=t[e.gradientMap]||null;if(e.clearcoatMap!==void 0)this.clearcoatMap=t[e.clearcoatMap]||null;if(e.clearcoatRoughnessMap!==void 0)this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null;if(e.clearcoatNormalMap!==void 0)this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null;if(e.clearcoatNormalScale!==void 0)this.clearcoatNormalScale=new De().fromArray(e.clearcoatNormalScale);if(e.iridescenceMap!==void 0)this.iridescenceMap=t[e.iridescenceMap]||null;if(e.iridescenceThicknessMap!==void 0)this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null;if(e.transmissionMap!==void 0)this.transmissionMap=t[e.transmissionMap]||null;if(e.thicknessMap!==void 0)this.thicknessMap=t[e.thicknessMap]||null;if(e.anisotropyMap!==void 0)this.anisotropyMap=t[e.anisotropyMap]||null;if(e.sheenColorMap!==void 0)this.sheenColorMap=t[e.sheenColorMap]||null;if(e.sheenRoughnessMap!==void 0)this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null;return this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){if(e===!0)this.version++}}var Hn=new U,Xa=new U,vr=new U,yr=new U;class Ci{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);if(n<0)return t.copy(this.origin);return t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Hn.subVectors(e,this.origin).dot(this.direction);if(t<0)return this.origin.distanceToSquared(e);return Hn.copy(this.origin).addScaledVector(this.direction,t),Hn.distanceToSquared(e)}distanceSqToSegment(e,t,n,i){Xa.copy(e).add(t).multiplyScalar(0.5),vr.copy(t).sub(e).normalize(),yr.copy(this.origin).sub(Xa);let s=e.distanceTo(t)*0.5,r=-this.direction.dot(vr),a=yr.dot(this.direction),o=-yr.dot(vr),l=yr.lengthSq(),c=Math.abs(1-r*r),h,d,u,m;if(c>0)if(h=r*o-a,d=r*a-o,m=s*c,h>=0)if(d>=-m)if(d<=m){let g=1/c;h*=g,d*=g,u=h*(h+r*d+2*a)+d*(r*h+d+2*o)+l}else d=s,h=Math.max(0,-(r*d+a)),u=-h*h+d*(d+2*o)+l;else d=-s,h=Math.max(0,-(r*d+a)),u=-h*h+d*(d+2*o)+l;else if(d<=-m)h=Math.max(0,-(-r*s+a)),d=h>0?-s:Math.min(Math.max(-s,-o),s),u=-h*h+d*(d+2*o)+l;else if(d<=m)h=0,d=Math.min(Math.max(-s,-o),s),u=d*(d+2*o)+l;else h=Math.max(0,-(r*s+a)),d=h>0?s:Math.min(Math.max(-s,-o),s),u=-h*h+d*(d+2*o)+l;else d=r>0?-s:s,h=Math.max(0,-(r*d+a)),u=-h*h+d*(d+2*o)+l;if(n)n.copy(this.origin).addScaledVector(this.direction,h);if(i)i.copy(Xa).addScaledVector(vr,d);return u}intersectSphere(e,t){if(e.radius<0)return null;Hn.subVectors(e.center,this.origin);let n=Hn.dot(this.direction),i=Hn.dot(Hn)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),a=n-r,o=n+r;if(o<0)return null;if(a<0)return this.at(o,t);return this.at(a,t)}intersectsSphere(e){if(e.radius<0)return!1;return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0){if(e.distanceToPoint(this.origin)===0)return 0;return null}let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);if(n===null)return null;return this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);if(t===0)return!0;if(e.normal.dot(this.direction)*t<0)return!0;return!1}intersectBox(e,t){let n,i,s,r,a,o,l=1/this.direction.x,c=1/this.direction.y,h=1/this.direction.z,d=this.origin;if(l>=0)n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l;else n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l;if(c>=0)s=(e.min.y-d.y)*c,r=(e.max.y-d.y)*c;else s=(e.max.y-d.y)*c,r=(e.min.y-d.y)*c;if(n>r||s>i)return null;if(s>n||isNaN(n))n=s;if(r<i||isNaN(i))i=r;if(h>=0)a=(e.min.z-d.z)*h,o=(e.max.z-d.z)*h;else a=(e.max.z-d.z)*h,o=(e.min.z-d.z)*h;if(n>o||a>i)return null;if(a>n||n!==n)n=a;if(o<i||i!==i)i=o;if(i<0)return null;return this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Hn)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,a=this.direction,{x:o,y:l,z:c}=a,h=e.x-r.x,d=e.y-r.y,u=e.z-r.z,m=t.x-r.x,g=t.y-r.y,S=t.z-r.z,f=n.x-r.x,p=n.y-r.y,T=n.z-r.z,A=Math.abs(o),y=Math.abs(l),M=Math.abs(c),w,R,x,E,k,D,F,j,I,X,J,H;if(A>=y&&A>=M)if(x=o,D=h,I=m,H=f,o>=0)w=l,R=c,E=d,k=u,F=g,j=S,X=p,J=T;else w=c,R=l,E=u,k=d,F=S,j=g,X=T,J=p;else if(y>=M)if(x=l,D=d,I=g,H=p,l>=0)w=c,R=o,E=u,k=h,F=S,j=m,X=T,J=f;else w=o,R=c,E=h,k=u,F=m,j=S,X=f,J=T;else if(x=c,D=u,I=S,H=T,c>=0)w=o,R=l,E=h,k=d,F=m,j=g,X=f,J=p;else w=l,R=o,E=d,k=h,F=g,j=m,X=p,J=f;if(x===0)return null;let ne=w/x,z=R/x,W=1/x,Q=E-ne*D,we=k-z*D,Me=F-ne*I,st=j-z*I,Fe=X-ne*H,q=J-z*H,ie=Fe*st-q*Me,re=Q*q-we*Fe,Ce=Me*we-st*Q;if(i){if(ie<0||re<0||Ce<0)return null}else if((ie<0||re<0||Ce<0)&&(ie>0||re>0||Ce>0))return null;let Le=ie+re+Ce;if(Le===0)return null;let Ae=W*(ie*D+re*I+Ce*H);if(Le>0?Ae<0:Ae>0)return null;return this.at(Ae/Le,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ln extends Qt{constructor(e){super();this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wn,this.combine=0,this.reflectivity=1,this.refractionRatio=0.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}var Tc=new Oe,vi=new Ci,Sr=new jt,Ec=new U,Mr=new U,br=new U,Tr=new U,qa=new U,Er=new U,wc=new U,wr=new U;class mt extends ut{constructor(e=new Rt,t=new ln){super();this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){if(super.copy(e,t),e.morphTargetInfluences!==void 0)this.morphTargetInfluences=e.morphTargetInfluences.slice();if(e.morphTargetDictionary!==void 0)this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary);return this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){Er.set(0,0,0);for(let o=0,l=s.length;o<l;o++){let c=a[o],h=s[o];if(c===0)continue;if(qa.fromBufferAttribute(h,e),r)Er.addScaledVector(qa,c);else Er.addScaledVector(qa.sub(t),c)}t.add(Er)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;if(i===void 0)return;if(n.boundingSphere===null)n.computeBoundingSphere();if(Sr.copy(n.boundingSphere),Sr.applyMatrix4(s),vi.copy(e.ray).recast(e.near),Sr.containsPoint(vi.origin)===!1){if(vi.intersectSphere(Sr,Ec)===null)return;if(vi.origin.distanceToSquared(Ec)>(e.far-e.near)**2)return}if(Tc.copy(s).invert(),vi.copy(e.ray).applyMatrix4(Tc),n.boundingBox!==null){if(vi.intersectsBox(n.boundingBox)===!1)return}this._computeIntersections(e,t,vi)}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,a=s.index,o=s.attributes.position,l=s.attributes.uv,c=s.attributes.uv1,h=s.attributes.normal,{groups:d,drawRange:u}=s;if(a!==null)if(Array.isArray(r))for(let m=0,g=d.length;m<g;m++){let S=d[m],f=r[S.materialIndex],p=Math.max(S.start,u.start),T=Math.min(a.count,Math.min(S.start+S.count,u.start+u.count));for(let A=p,y=T;A<y;A+=3){let M=a.getX(A),w=a.getX(A+1),R=a.getX(A+2);if(i=Ar(this,f,e,n,l,c,h,M,w,R),i)i.faceIndex=Math.floor(A/3),i.face.materialIndex=S.materialIndex,t.push(i)}}else{let m=Math.max(0,u.start),g=Math.min(a.count,u.start+u.count);for(let S=m,f=g;S<f;S+=3){let p=a.getX(S),T=a.getX(S+1),A=a.getX(S+2);if(i=Ar(this,r,e,n,l,c,h,p,T,A),i)i.faceIndex=Math.floor(S/3),t.push(i)}}else if(o!==void 0)if(Array.isArray(r))for(let m=0,g=d.length;m<g;m++){let S=d[m],f=r[S.materialIndex],p=Math.max(S.start,u.start),T=Math.min(o.count,Math.min(S.start+S.count,u.start+u.count));for(let A=p,y=T;A<y;A+=3){let M=A,w=A+1,R=A+2;if(i=Ar(this,f,e,n,l,c,h,M,w,R),i)i.faceIndex=Math.floor(A/3),i.face.materialIndex=S.materialIndex,t.push(i)}}else{let m=Math.max(0,u.start),g=Math.min(o.count,u.start+u.count);for(let S=m,f=g;S<f;S+=3){let p=S,T=S+1,A=S+2;if(i=Ar(this,r,e,n,l,c,h,p,T,A),i)i.faceIndex=Math.floor(S/3),t.push(i)}}}}function xf(e,t,n,i,s,r,a,o){let l;if(t.side===1)l=i.intersectTriangle(a,r,s,!0,o);else l=i.intersectTriangle(s,r,a,t.side===0,o);if(l===null)return null;wr.copy(o),wr.applyMatrix4(e.matrixWorld);let c=n.ray.origin.distanceTo(wr);if(c<n.near||c>n.far)return null;return{distance:c,point:wr.clone(),object:e}}function Ar(e,t,n,i,s,r,a,o,l,c){e.getVertexPosition(o,Mr),e.getVertexPosition(l,br),e.getVertexPosition(c,Tr);let h=xf(e,t,n,i,Mr,br,Tr,wc);if(h){let d=new U;if(an.getBarycoord(wc,Mr,br,Tr,d),s)h.uv=an.getInterpolatedAttribute(s,o,l,c,d,new De);if(r)h.uv1=an.getInterpolatedAttribute(r,o,l,c,d,new De);if(a){if(h.normal=an.getInterpolatedAttribute(a,o,l,c,d,new U),h.normal.dot(i.direction)>0)h.normal.multiplyScalar(-1)}let u={a:o,b:l,c,normal:new U,materialIndex:0};an.getNormal(Mr,br,Tr,u.normal),h.face=u,h.barycoord=d}return h}var Cs=new it,Ac=new it,Rc=new it,vf=new it,Cc=new Oe,Rr=new U,Ya=new jt,Ic=new Oe,Za=new Ci;class ia extends mt{constructor(e,t){super(e,t);this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new Oe,this.bindMatrixInverse=new Oe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;if(this.boundingBox===null)this.boundingBox=new Gt;this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Rr),this.boundingBox.expandByPoint(Rr)}computeBoundingSphere(){let e=this.geometry;if(this.boundingSphere===null)this.boundingSphere=new jt;this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Rr),this.boundingSphere.expandByPoint(Rr)}copy(e,t){if(super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null)this.boundingBox=e.boundingBox.clone();if(e.boundingSphere!==null)this.boundingSphere=e.boundingSphere.clone();return this}raycast(e,t){let n=this.material,i=this.matrixWorld;if(n===void 0)return;if(this.boundingSphere===null)this.computeBoundingSphere();if(Ya.copy(this.boundingSphere),Ya.applyMatrix4(i),e.ray.intersectsSphere(Ya)===!1)return;if(Ic.copy(i).invert(),Za.copy(e.ray).applyMatrix4(Ic),this.boundingBox!==null){if(Za.intersectsBox(this.boundingBox)===!1)return}this._computeIntersections(e,t,Za)}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){if(this.skeleton=e,t===void 0)this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld;this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new it,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();if(s!==1/0)e.multiplyScalar(s);else e.set(1,0,0,0);t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.bindMode==="attached")this.bindMatrixInverse.copy(this.matrixWorld).invert();else if(this.bindMode==="detached")this.bindMatrixInverse.copy(this.bindMatrix).invert();else Ee("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;if(Ac.fromBufferAttribute(i.attributes.skinIndex,e),Rc.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4)Cs.copy(t),t.set(0,0,0,0);else Cs.set(...t,1),t.set(0,0,0);Cs.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=Rc.getComponent(s);if(r!==0){let a=Ac.getComponent(s);Cc.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(vf.copy(Cs).applyMatrix4(Cc),r)}}if(t.isVector4)t.w=Cs.w;return t.applyMatrix4(this.bindMatrixInverse)}}class qs extends ut{constructor(){super();this.isBone=!0,this.type="Bone"}}class Ys extends bt{constructor(e=null,t=1,n=1,i,s,r,a,o,l=1003,c=1003,h,d){super(null,r,a,o,l,c,i,s,h,d);this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}var Pc=new Oe,yf=new Oe;class Zs{constructor(e=[],t=[]){this.uuid=gn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ee("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Oe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Oe;if(this.bones[e])n.copy(this.bones[e].matrixWorld).invert();this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];if(n)n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];if(n){if(n.parent&&n.parent.isBone)n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld);else n.matrix.copy(n.matrixWorld);n.matrix.decompose(n.position,n.quaternion,n.scale)}}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let a=e[s]?e[s].matrixWorld:yf;Pc.multiplyMatrices(a,t[s]),Pc.toArray(n,s*16)}if(i!==null)i.needsUpdate=!0}clone(){return new Zs(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Ys(t,e,e,1023,1015);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}return}dispose(){if(this.boneTexture!==null)this.boneTexture.dispose(),this.boneTexture=null}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=t[s];if(r===void 0)Ee("Skeleton: No bone found with UUID:",s),r=new qs;this.bones.push(r),this.boneInverses.push(new Oe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let r=t[i];e.bones.push(r.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}}class ri extends Lt{constructor(e,t,n,i=1){super(e,t,n);this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}var ji=new Oe,Lc=new Oe,Cr=[],Nc=new Gt,Sf=new Oe,Is=new mt,Ps=new jt;class sa extends mt{constructor(e,t,n){super(e,t);this.isInstancedMesh=!0,this.instanceMatrix=new ri(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Sf)}computeBoundingBox(){let e=this.geometry,t=this.count;if(this.boundingBox===null)this.boundingBox=new Gt;if(e.boundingBox===null)e.computeBoundingBox();this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ji),Nc.copy(e.boundingBox).applyMatrix4(ji),this.boundingBox.union(Nc)}computeBoundingSphere(){let e=this.geometry,t=this.count;if(this.boundingSphere===null)this.boundingSphere=new jt;if(e.boundingSphere===null)e.computeBoundingSphere();this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ji),Ps.copy(e.boundingSphere).applyMatrix4(ji),this.boundingSphere.union(Ps)}copy(e,t){if(super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null)this.morphTexture=e.morphTexture.clone();if(e.instanceColor!==null)this.instanceColor=e.instanceColor.clone();if(this.count=e.count,e.boundingBox!==null)this.boundingBox=e.boundingBox.clone();if(e.boundingSphere!==null)this.boundingSphere=e.boundingSphere.clone();return this}getColorAt(e,t){if(this.instanceColor===null)return t.setRGB(1,1,1);else return t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[r+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Is.geometry=this.geometry,Is.material=this.material,Is.material===void 0)return;if(this.boundingSphere===null)this.computeBoundingSphere();if(Ps.copy(this.boundingSphere),Ps.applyMatrix4(n),e.ray.intersectsSphere(Ps)===!1)return;for(let s=0;s<i;s++){this.getMatrixAt(s,ji),Lc.multiplyMatrices(n,ji),Is.matrixWorld=Lc,Is.raycast(e,Cr);for(let r=0,a=Cr.length;r<a;r++){let o=Cr[r];o.instanceId=s,o.object=this,t.push(o)}Cr.length=0}}setColorAt(e,t){if(this.instanceColor===null)this.instanceColor=new ri(new Float32Array(this.instanceMatrix.count*3).fill(1),3);return t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;if(this.morphTexture===null)this.morphTexture=new Ys(new Float32Array(i*this.count),i,this.count,1028,1015);let s=this.morphTexture.source.data.data,r=0;for(let l=0;l<n.length;l++)r+=n[l];let a=this.geometry.morphTargetsRelative?1:1-r,o=i*e;return s[o]=a,s.set(n,o+1),this}updateMorphTargets(){}dispose(){if(super.dispose(),this.morphTexture!==null)this.morphTexture.dispose(),this.morphTexture=null}}var yi=new jt,Mf=new De(0.5,0.5),Ir=new U;class Ks{constructor(e=new En,t=new En,n=new En,i=new En,s=new En,r=new En){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2000,n=!1){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],m=s[8],g=s[9],S=s[10],f=s[11],p=s[12],T=s[13],A=s[14],y=s[15];if(i[0].setComponents(l-r,u-c,f-m,y-p).normalize(),i[1].setComponents(l+r,u+c,f+m,y+p).normalize(),i[2].setComponents(l+a,u+h,f+g,y+T).normalize(),i[3].setComponents(l-a,u-h,f-g,y-T).normalize(),n)i[4].setComponents(o,d,S,A).normalize(),i[5].setComponents(l-o,u-d,f-S,y-A).normalize();else if(i[4].setComponents(l-o,u-d,f-S,y-A).normalize(),t===2000)i[5].setComponents(l+o,u+d,f+S,y+A).normalize();else if(t===2001)i[5].setComponents(o,d,S,A).normalize();else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0){if(e.boundingSphere===null)e.computeBoundingSphere();yi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld)}else{let t=e.geometry;if(t.boundingSphere===null)t.computeBoundingSphere();yi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(yi)}intersectsSprite(e){yi.center.set(0,0,0);let t=Mf.distanceTo(e.center);return yi.radius=0.7071067811865476+t,yi.applyMatrix4(e.matrixWorld),this.intersectsSphere(yi)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Ir.x=i.normal.x>0?e.max.x:e.min.x,Ir.y=i.normal.y>0?e.max.y:e.min.y,Ir.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ir)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Js extends Qt{constructor(e){super();this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}var Br=new U,zr=new U,Dc=new Oe,Ls=new Ci,Pr=new jt,Ka=new U,Uc=new U;class ps extends ut{constructor(e=new Rt,t=new Js){super();this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Br.fromBufferAttribute(t,i-1),zr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Br.distanceTo(zr);e.setAttribute("lineDistance",new gt(n,1))}else Ee("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null)n.computeBoundingSphere();if(Pr.copy(n.boundingSphere),Pr.applyMatrix4(i),Pr.radius+=s,e.ray.intersectsSphere(Pr)===!1)return;Dc.copy(i).invert(),Ls.copy(e.ray).applyMatrix4(Dc);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=this.isLineSegments?2:1,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,r.start),m=Math.min(c.count,r.start+r.count);for(let g=u,S=m-1;g<S;g+=l){let f=c.getX(g),p=c.getX(g+1),T=Lr(this,e,Ls,o,f,p,g);if(T)t.push(T)}if(this.isLineLoop){let g=c.getX(m-1),S=c.getX(u),f=Lr(this,e,Ls,o,g,S,m-1);if(f)t.push(f)}}else{let u=Math.max(0,r.start),m=Math.min(d.count,r.start+r.count);for(let g=u,S=m-1;g<S;g+=l){let f=Lr(this,e,Ls,o,g,g+1,g);if(f)t.push(f)}if(this.isLineLoop){let g=Lr(this,e,Ls,o,m-1,u,m-1);if(g)t.push(g)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Lr(e,t,n,i,s,r,a){let o=e.geometry.attributes.position;if(Br.fromBufferAttribute(o,s),zr.fromBufferAttribute(o,r),n.distanceSqToSegment(Br,zr,Ka,Uc)>i)return;Ka.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Ka);if(c<t.near||c>t.far)return;return{distance:c,point:Uc.clone().applyMatrix4(e.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:e}}var Fc=new U,Oc=new U;class ra extends ps{constructor(e,t){super(e,t);this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Fc.fromBufferAttribute(t,i),Oc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Fc.distanceTo(Oc);e.setAttribute("lineDistance",new gt(n,1))}else Ee("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class aa extends ps{constructor(e,t){super(e,t);this.isLineLoop=!0,this.type="LineLoop"}}class $s extends Qt{constructor(e){super();this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ie(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}var Bc=new Oe,ja=new Ci,Nr=new jt,Dr=new U;class oa extends ut{constructor(e=new Rt,t=new $s){super();this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null)n.computeBoundingSphere();if(Nr.copy(n.boundingSphere),Nr.applyMatrix4(i),Nr.radius+=s,e.ray.intersectsSphere(Nr)===!1)return;Bc.copy(i).invert(),ja.copy(e.ray).applyMatrix4(Bc);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=n.index,h=n.attributes.position;if(l!==null){let d=Math.max(0,r.start),u=Math.min(l.count,r.start+r.count);for(let m=d,g=u;m<g;m++){let S=l.getX(m);Dr.fromBufferAttribute(h,S),zc(Dr,S,o,i,e,t,this)}}else{let d=Math.max(0,r.start),u=Math.min(h.count,r.start+r.count);for(let m=d,g=u;m<g;m++)Dr.fromBufferAttribute(h,m),zc(Dr,m,o,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function zc(e,t,n,i,s,r,a){let o=ja.distanceSqToPoint(e);if(o<n){let l=new U;ja.closestPointToPoint(e,l),l.applyMatrix4(i);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class la extends bt{constructor(e=[],t=301,n,i,s,r,a,o,l,c){super(e,t,n,i,s,r,a,o,l,c);this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ii extends bt{constructor(e,t,n=1014,i,s,r,a=1003,o=1003,l,c=1026,h=1){if(c!==1026&&c!==1027)throw Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,i,s,r,a,o,c,n,l);this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Hs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class rl extends Ii{constructor(e,t=1014,n=301,i,s,r=1003,a=1003,o,l=1026){let c={width:e,height:e,depth:1},h=[c,c,c,c,c,c];super(e,e,t,n,i,s,r,a,o,l);this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ca extends bt{constructor(e=null){super();this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ms extends Rt{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super();this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let a=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let o=[],l=[],c=[],h=[],d=0,u=0;m("z","y","x",-1,-1,n,t,e,r,s,0),m("z","y","x",1,-1,n,t,-e,r,s,1),m("x","z","y",1,1,e,n,t,i,r,2),m("x","z","y",1,-1,e,n,-t,i,r,3),m("x","y","z",1,-1,e,t,n,i,s,4),m("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new gt(l,3)),this.setAttribute("normal",new gt(c,3)),this.setAttribute("uv",new gt(h,2));function m(g,S,f,p,T,A,y,M,w,R,x){let E=A/w,k=y/R,D=A/2,F=y/2,j=M/2,I=w+1,X=R+1,J=0,H=0,ne=new U;for(let z=0;z<X;z++){let W=z*k-F;for(let Q=0;Q<I;Q++){let we=Q*E-D;ne[g]=we*p,ne[S]=W*T,ne[f]=j,l.push(ne.x,ne.y,ne.z),ne[g]=0,ne[S]=0,ne[f]=M>0?1:-1,c.push(ne.x,ne.y,ne.z),h.push(Q/w),h.push(1-z/R),J+=1}}for(let z=0;z<R;z++)for(let W=0;W<w;W++){let Q=d+W+I*z,we=d+W+I*(z+1),Me=d+(W+1)+I*(z+1),st=d+(W+1)+I*z;o.push(Q,we,st),o.push(we,Me,st),H+=6}a.addGroup(u,H,x),u+=H,d+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ms(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class js extends Rt{constructor(e=1,t=1,n=1,i=1){super();this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,a=Math.floor(n),o=Math.floor(i),l=a+1,c=o+1,h=e/a,d=t/o,u=[],m=[],g=[],S=[];for(let f=0;f<c;f++){let p=f*d-r;for(let T=0;T<l;T++){let A=T*h-s;m.push(A,-p,0),g.push(0,0,1),S.push(T/a),S.push(1-f/o)}}for(let f=0;f<o;f++)for(let p=0;p<a;p++){let T=p+l*f,A=p+l*(f+1),y=p+1+l*(f+1),M=p+1+l*f;u.push(T,A,M),u.push(A,y,M)}this.setIndex(u),this.setAttribute("position",new gt(m,3)),this.setAttribute("normal",new gt(g,3)),this.setAttribute("uv",new gt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new js(e.width,e.height,e.widthSegments,e.heightSegments)}}class Qs extends Rt{constructor(e=0.5,t=1,n=32,i=1,s=0,r=Math.PI*2){super();this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:r},n=Math.max(3,n),i=Math.max(1,i);let a=[],o=[],l=[],c=[],h=e,d=(t-e)/i,u=new U,m=new De;for(let g=0;g<=i;g++){for(let S=0;S<=n;S++){let f=s+S/n*r;u.x=h*Math.cos(f),u.y=h*Math.sin(f),o.push(u.x,u.y,u.z),l.push(0,0,1),m.x=(u.x/t+1)/2,m.y=(u.y/t+1)/2,c.push(m.x,m.y)}h+=d}for(let g=0;g<i;g++){let S=g*(n+1);for(let f=0;f<n;f++){let p=f+S,T=p,A=p+n+1,y=p+n+2,M=p+1;a.push(T,A,M),a.push(A,y,M)}}this.setIndex(a),this.setAttribute("position",new gt(o,3)),this.setAttribute("normal",new gt(l,3)),this.setAttribute("uv",new gt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qs(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}function Pi(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];if(kc(s))if(s.isRenderTargetTexture)Ee("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null;else t[n][i]=s.clone();else if(Array.isArray(s))if(kc(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[n][i]=r}else t[n][i]=s.slice();else t[n][i]=s}}return t}function zt(e){let t={};for(let n=0;n<e.length;n++){let i=Pi(e[n]);for(let s in i)t[s]=i[s]}return t}function kc(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function bf(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function al(e){let t=e.getRenderTarget();if(t===null)return e.outputColorSpace;if(t.isXRRenderTarget===!0)return t.texture.colorSpace;return He.workingColorSpace}var Kh={clone:Pi,merge:zt},Tf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ef=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class cn extends Qt{constructor(e){super();if(this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tf,this.fragmentShader=Ef,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0)this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Pi(e.uniforms),this.uniformsGroups=bf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;if(r&&r.isTexture)t.uniforms[i]={type:"t",value:r.toJSON(e).uuid};else if(r&&r.isColor)t.uniforms[i]={type:"c",value:r.getHex()};else if(r&&r.isVector2)t.uniforms[i]={type:"v2",value:r.toArray()};else if(r&&r.isVector3)t.uniforms[i]={type:"v3",value:r.toArray()};else if(r&&r.isVector4)t.uniforms[i]={type:"v4",value:r.toArray()};else if(r&&r.isMatrix3)t.uniforms[i]={type:"m3",value:r.toArray()};else if(r&&r.isMatrix4)t.uniforms[i]={type:"m4",value:r.toArray()};else t.uniforms[i]={value:r}}if(Object.keys(this.defines).length>0)t.defines=this.defines;t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)if(this.extensions[i]===!0)n[i]=!0;if(Object.keys(n).length>0)t.extensions=n;return t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ie().setHex(i.value);break;case"v2":this.uniforms[n].value=new De().fromArray(i.value);break;case"v3":this.uniforms[n].value=new U().fromArray(i.value);break;case"v4":this.uniforms[n].value=new it().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Ue().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Oe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0)this.defines=e.defines;if(e.vertexShader!==void 0)this.vertexShader=e.vertexShader;if(e.fragmentShader!==void 0)this.fragmentShader=e.fragmentShader;if(e.glslVersion!==void 0)this.glslVersion=e.glslVersion;if(e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];if(e.lights!==void 0)this.lights=e.lights;if(e.clipping!==void 0)this.clipping=e.clipping;return this}}class ol extends cn{constructor(e){super(e);this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class gs extends Qt{constructor(e){super();this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ie(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class en extends gs{constructor(e){super();this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new De(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return We(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+0.4*t)/(1-0.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ie(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ie(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ie(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){if(this._anisotropy>0!==e>0)this.version++;this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){if(this._clearcoat>0!==e>0)this.version++;this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){if(this._iridescence>0!==e>0)this.version++;this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){if(this._dispersion>0!==e>0)this.version++;this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){if(this._retroreflectivity>0!==e>0)this.version++;this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){if(this._sheen>0!==e>0)this.version++;this._sheen=e}get transmission(){return this._transmission}set transmission(e){if(this._transmission>0!==e>0)this.version++;this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class ll extends Qt{constructor(e){super();this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class cl extends Qt{constructor(e){super();this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function si(e,t){if(!e||e.constructor===t)return e;if(typeof t.BYTES_PER_ELEMENT==="number")return new t(e);return Array.prototype.slice.call(e)}function Or(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}function wf(e){function t(s,r){return e[s]-e[r]}let n=e.length,i=Array(n);for(let s=0;s!==n;++s)i[s]=s;return i.sort(t),i}function Hc(e,t,n){let i=e.length,s=new e.constructor(i);for(let r=0,a=0;a!==i;++r){let o=n[r]*t;for(let l=0;l!==t;++l)s[a++]=e[o+l]}return s}function Af(e,t,n,i){let s=1,r=e[0];while(r!==void 0&&r[i]===void 0)r=e[s++];if(r===void 0)return;let a=r[i];if(a===void 0)return;if(Array.isArray(a))do{if(a=r[i],a!==void 0)t.push(r.time),n.push(...a);r=e[s++]}while(r!==void 0);else if(a.toArray!==void 0)do{if(a=r[i],a!==void 0)t.push(r.time),a.toArray(n,n.length);r=e[s++]}while(r!==void 0);else do{if(a=r[i],a!==void 0)t.push(r.time),n.push(a);r=e[s++]}while(r!==void 0)}class Yn{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let r;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break e}r=t.length;break t}if(!(e>=s)){let a=t[1];if(e<a)n=2,s=a;for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=t[--n-1],e>=s)break e}r=n,n=0;break t}break n}while(n<r){let a=n+r>>>1;if(e<t[a])r=a;else n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class hl extends Yn{constructor(e,t,n,i){super(e,t,n,i);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,a=i[s],o=i[r];if(a===void 0)switch(this.getSettings_().endingStart){case 2401:s=e,a=2*t-n;break;case 2402:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(o===void 0)switch(this.getSettings_().endingEnd){case 2401:r=e,o=2*n-t;break;case 2402:r=1,o=n+i[1]-i[0];break;default:r=e-1,o=t}let l=(n-t)*0.5,c=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(o-n),this._offsetPrev=s*c,this._offsetNext=r*c}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,u=this._weightNext,m=(n-t)/(i-t),g=m*m,S=g*m,f=-d*S+2*d*g-d*m,p=(1+d)*S+(-1.5-2*d)*g+(-0.5+d)*m+1,T=(-1-u)*S+(1.5+u)*g+0.5*m,A=u*S-u*g;for(let y=0;y!==a;++y)s[y]=f*r[c+y]+p*r[l+y]+T*r[o+y]+A*r[h+y];return s}}class ul extends Yn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=(n-t)/(i-t),h=1-c;for(let d=0;d!==a;++d)s[d]=r[l+d]*h+r[o+d]*c;return s}}class dl extends Yn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class fl extends Yn{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=this.inTangents,h=this.outTangents;if(!c||!h){let m=(n-t)/(i-t),g=1-m;for(let S=0;S!==a;++S)s[S]=r[l+S]*g+r[o+S]*m;return s}let d=a*2,u=e-1;for(let m=0;m!==a;++m){let g=r[l+m],S=r[o+m],f=u*d+m*2,p=h[f],T=h[f+1],A=e*d+m*2,y=c[A],M=c[A+1],w=Cf(n,t,p,y,i);s[m]=Jh(w,g,T,M,S)}return s}}function Jh(e,t,n,i,s){let r=1-e;return r*r*r*t+3*r*r*e*n+3*r*e*e*i+e*e*e*s}function Rf(e,t,n,i,s){let r=1-e;return 3*r*r*(n-t)+6*r*e*(i-n)+3*e*e*(s-i)}function Cf(e,t,n,i,s){let r=(e-t)/(s-t);for(let a=0;a<8;a++){let o=Jh(r,t,n,i,s)-e;if(Math.abs(o)<0.0000000001)break;let l=Rf(r,t,n,i,s);if(Math.abs(l)<0.0000000001)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class tn{constructor(e,t,n,i){if(e===void 0)throw Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=si(t,this.TimeBufferType),this.values=si(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:si(e.times,Array),values:si(e.values,Array)};let i=e.getInterpolation();if(i!==e.DefaultInterpolation)n.interpolation=i;if(Or(e.settings))n.settings={inTangents:si(e.settings.inTangents,Array),outTangents:si(e.settings.outTangents,Array)}}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new dl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ul(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new hl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new fl(this.times,this.values,this.getValueSize(),e);if(this.settings)t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents;return t}setInterpolation(e){let t;switch(e){case 2300:t=this.InterpolantFactoryMethodDiscrete;break;case 2301:t=this.InterpolantFactoryMethodLinear;break;case 2302:t=this.InterpolantFactoryMethodSmooth;break;case 2303:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(n);return Ee("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302;case this.InterpolantFactoryMethodBezier:return 2303}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;if(Or(this.settings))Gc(this.settings.inTangents,e),Gc(this.settings.outTangents,e)}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;while(s!==i&&n[s]<e)++s;while(r!==-1&&n[r]>t)--r;if(++r,s!==0||r!==i){if(s>=r)r=Math.max(r,1),s=r-1;let a=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*a,r*a)}return this}validate(){let e=!0,t=this.getValueSize();if(t-Math.floor(t)!==0)Ne("KeyframeTrack: Invalid value size in track.",this),e=!1;let n=this.times,i=this.values,s=n.length;if(s===0)Ne("KeyframeTrack: Track is empty.",this),e=!1;let r=null;for(let a=0;a!==s;a++){let o=n[a];if(typeof o==="number"&&isNaN(o)){Ne("KeyframeTrack: Time is not a valid number.",this,a,o),e=!1;break}if(r!==null&&r>o){Ne("KeyframeTrack: Out of order keys.",this,a,o,r),e=!1;break}r=o}if(i!==void 0){if(Bd(i))for(let a=0,o=i.length;a!==o;++a){let l=i[a];if(isNaN(l)){Ne("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===2302,s=e.length-1,r=1;for(let a=1;a<s;++a){let o=!1,l=e[a],c=e[a+1];if(l!==c&&(a!==1||l!==e[0]))if(!i){let h=a*n,d=h-n,u=h+n;for(let m=0;m!==n;++m){let g=t[h+m];if(g!==t[d+m]||g!==t[u+m]){o=!0;break}}}else o=!0;if(o){if(a!==r){e[r]=e[a];let h=a*n,d=r*n;for(let u=0;u!==n;++u)t[d+u]=t[h+u]}++r}}if(s>0){e[r]=e[s];for(let a=s*n,o=r*n,l=0;l!==n;++l)t[o+l]=t[a+l];++r}if(r!==e.length)this.times=e.slice(0,r),this.values=t.slice(0,r*n);else this.times=e,this.values=t;return this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);if(i.createInterpolant=this.createInterpolant,Or(this.settings))i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()};return i}}function Gc(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]*=t}tn.prototype.ValueTypeName="";tn.prototype.TimeBufferType=Float32Array;tn.prototype.ValueBufferType=Float32Array;tn.prototype.DefaultInterpolation=2301;class ci extends tn{constructor(e,t,n){super(e,t,n)}}ci.prototype.ValueTypeName="bool";ci.prototype.ValueBufferType=Array;ci.prototype.DefaultInterpolation=2300;ci.prototype.InterpolantFactoryMethodLinear=void 0;ci.prototype.InterpolantFactoryMethodSmooth=void 0;class ha extends tn{constructor(e,t,n,i){super(e,t,n,i)}}ha.prototype.ValueTypeName="color";class hi extends tn{constructor(e,t,n,i){super(e,t,n,i)}}hi.prototype.ValueTypeName="number";class pl extends Yn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=(n-t)/(i-t),l=e*a;for(let c=l+a;l!==c;l+=4)on.slerpFlat(s,0,r,l-a,r,l,o);return s}}class ui extends tn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new pl(this.times,this.values,this.getValueSize(),e)}}ui.prototype.ValueTypeName="quaternion";ui.prototype.InterpolantFactoryMethodSmooth=void 0;class di extends tn{constructor(e,t,n){super(e,t,n)}}di.prototype.ValueTypeName="string";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=2300;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;class Li extends tn{constructor(e,t,n,i){super(e,t,n,i)}}Li.prototype.ValueTypeName="vector";class ua{constructor(e="",t=-1,n=[],i=2500){if(this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=gn(),this.userData={},this.duration<0)this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,a=n.length;r!==a;++r)t.push(Pf(n[r]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)t.push(tn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,r=[];for(let a=0;a<s;a++){let o=[],l=[];o.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);let c=wf(o);if(o=Hc(o,1,c),l=Hc(l,1,c),!i&&o[0]===0)o.push(s),l.push(l[0]);r.push(new hi(".morphTargetInfluences["+t[a].name+"]",o,l).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,o=e.length;a<o;a++){let l=e[a],c=l.name.match(s);if(c&&c.length>1){let h=c[1],d=i[h];if(!d)i[h]=d=[];d.push(l)}}let r=[];for(let a in i)r.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return r}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function If(e){switch(e.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return hi;case"vector":case"vector2":case"vector3":case"vector4":return Li;case"color":return ha;case"quaternion":return ui;case"bool":case"boolean":return ci;case"string":return di}throw Error("THREE.KeyframeTrack: Unsupported typeName: "+e)}function Pf(e){if(e.type===void 0)throw Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=If(e.type);if(e.times===void 0){let i=[],s=[];Af(e.keys,i,s,"value"),e.times=i,e.values=s}let n;if(t.parse!==void 0)n=t.parse(e);else n=new t(e.name,e.times,e.values,e.interpolation);if(Or(e.settings))n.settings={inTangents:si(e.settings.inTangents,Float32Array),outTangents:si(e.settings.outTangents,Float32Array)};return n}var wn={enabled:!1,files:{},add:function(e,t){if(this.enabled===!1)return;if(Vc(e))return;this.files[e]=t},get:function(e){if(this.enabled===!1)return;if(Vc(e))return;return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Vc(e){try{let t=e.slice(e.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch(t){return!1}}class ml{constructor(e,t,n){let i=this,s=!1,r=0,a=0,o=void 0,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(c){if(a++,s===!1){if(i.onStart!==void 0)i.onStart(c,r,a)}s=!0},this.itemEnd=function(c){if(r++,i.onProgress!==void 0)i.onProgress(c,r,a);if(r===a){if(s=!1,i.onLoad!==void 0)i.onLoad()}},this.itemError=function(c){if(i.onError!==void 0)i.onError(c)},this.resolveURL=function(c){if(c=c.normalize("NFC"),o)return o(c);return c},this.setURLModifier=function(c){return o=c,this},this.addHandler=function(c,h){return l.push(c,h),this},this.removeHandler=function(c){let h=l.indexOf(c);if(h!==-1)l.splice(h,2);return this},this.getHandler=function(c){for(let h=0,d=l.length;h<d;h+=2){let u=l[h],m=l[h+1];if(u.global)u.lastIndex=0;if(u.test(c))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){if(!this._abortController)this._abortController=new AbortController;return this._abortController}}var $h=new ml;class Zn{constructor(e){if(this.manager=e!==void 0?e:$h,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Zn.DEFAULT_MATERIAL_NAME="__DEFAULT";var Gn={};class jh extends Error{constructor(e,t){super(e);this.response=t}}class er extends Zn{constructor(e){super(e);this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){if(e===void 0)e="";if(this.path!==void 0)e=this.path+e;e=this.manager.resolveURL(e);let s=wn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{if(t)t(s);this.manager.itemEnd(e)},0);return}if(Gn[e]!==void 0){Gn[e].push({onLoad:t,onProgress:n,onError:i});return}Gn[e]=[],Gn[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any==="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,o=this.responseType;fetch(r).then((l)=>{if(l.status===200||l.status===0){if(l.status===0)Ee("FileLoader: HTTP Status 0 received.");if(typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let c=Gn[e],h=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),u=d?parseInt(d):0,m=u!==0,g=0,S=new ReadableStream({start(f){p();function p(){h.read().then(({done:T,value:A})=>{if(T)f.close();else{g+=A.byteLength;let y=new ProgressEvent("progress",{lengthComputable:m,loaded:g,total:u});for(let M=0,w=c.length;M<w;M++){let R=c[M];if(R.onProgress)R.onProgress(y)}f.enqueue(A),p()}},(T)=>{f.error(T)})}}});return new Response(S)}else throw new jh(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then((l)=>{switch(o){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then((c)=>new DOMParser().parseFromString(c,a));case"json":return l.json();default:if(a==="")return l.text();else{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,u=new TextDecoder(d);return l.arrayBuffer().then((m)=>u.decode(m))}}}).then((l)=>{wn.add(`file:${e}`,l);let c=Gn[e];delete Gn[e];for(let h=0,d=c.length;h<d;h++){let u=c[h];if(u.onLoad)u.onLoad(l)}}).catch((l)=>{let c=Gn[e];if(c===void 0)throw this.manager.itemError(e),l;delete Gn[e];for(let h=0,d=c.length;h<d;h++){let u=c[h];if(u.onError)u.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}var Qi=new WeakMap;class gl extends Zn{constructor(e){super(e)}load(e,t,n,i){if(this.path!==void 0)e=this.path+e;e=this.manager.resolveURL(e);let s=this,r=wn.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){if(t)t(r);s.manager.itemEnd(e)},0);else{let h=Qi.get(r);if(h===void 0)h=[],Qi.set(r,h);h.push({onLoad:t,onError:i})}return r}let a=is("img");function o(){if(c(),t)t(this);let h=Qi.get(this)||[];for(let d=0;d<h.length;d++){let u=h[d];if(u.onLoad)u.onLoad(this)}Qi.delete(this),s.manager.itemEnd(e)}function l(h){if(c(),i)i(h);wn.remove(`image:${e}`);let d=Qi.get(this)||[];for(let u=0;u<d.length;u++){let m=d[u];if(m.onError)m.onError(h)}Qi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function c(){a.removeEventListener("load",o,!1),a.removeEventListener("error",l,!1)}if(a.addEventListener("load",o,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"){if(this.crossOrigin!==void 0)a.crossOrigin=this.crossOrigin}return wn.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}}class da extends Zn{constructor(e){super(e)}load(e,t,n,i){let s=new bt,r=new gl(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(a){if(s.image=a,s.needsUpdate=!0,t!==void 0)t(s)},n,i),s}}class Ni extends ut{constructor(e,t=1){super();this.isLight=!0,this.type="Light",this.color=new Ie(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class fa extends Ni{constructor(e,t,n){super(e,n);this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ie(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}var Ja=new Oe,Wc=new U,Xc=new U;class tr{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new De(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new Oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ks,this._frameExtents=new De(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Wc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wc),Xc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Ja.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ja,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,a=i?i.w/s.y:1,o=i?i.x/s.x:0,l=i?i.y/s.y:0;if(e.coordinateSystem===2001||e.reversedDepth)t.set(0.5*r,0,0,0.5*r+o,0,0.5*a,0,0.5*a+l,0,0,1,0,0,0,0,1);else t.set(0.5*r,0,0,0.5*r+o,0,0.5*a,0,0.5*a+l,0,0,0.5,0.5,0,0,0,1);t.multiply(Ja)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){if(this.map)this.map.dispose();if(this.mapPass)this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}var Ur=new U,Fr=new on,Tn=new U;class pa extends ut{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Oe,this.projectionMatrix=new Oe,this.projectionMatrixInverse=new Oe,this.coordinateSystem=2000,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.matrixWorld.decompose(Ur,Fr,Tn),Tn.x===1&&Tn.y===1&&Tn.z===1)this.matrixWorldInverse.copy(this.matrixWorld).invert();else this.matrixWorldInverse.compose(Ur,Fr,Tn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){if(super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ur,Fr,Tn),Tn.x===1&&Tn.y===1&&Tn.z===1)this.matrixWorldInverse.copy(this.matrixWorld).invert();else this.matrixWorldInverse.compose(Ur,Fr,Tn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}var ii=new U,qc=new De,Yc=new De;class At extends pa{constructor(e=50,t=1,n=0.1,i=2000){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=0.5*this.getFilmHeight()/e;this.fov=Mi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ns*0.5*this.fov);return 0.5*this.getFilmHeight()/e}getEffectiveFOV(){return Mi*2*Math.atan(Math.tan(Ns*0.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ii.set(-1,-1,0.5).applyMatrix4(this.projectionMatrixInverse),t.set(ii.x,ii.y).multiplyScalar(-e/ii.z),ii.set(1,1,0.5).applyMatrix4(this.projectionMatrixInverse),n.set(ii.x,ii.y).multiplyScalar(-e/ii.z)}getViewSize(e,t){return this.getViewBounds(e,qc,Yc),t.subVectors(Yc,qc)}setViewOffset(e,t,n,i,s,r){if(this.aspect=e/t,this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ns*0.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-0.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let{fullWidth:o,fullHeight:l}=r;s+=r.offsetX*i/o,t-=r.offsetY*n/l,i*=r.width/o,n*=r.height/l}let a=this.filmOffset;if(a!==0)s+=e*a/this.getFilmWidth();this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);if(t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null)t.object.view=Object.assign({},this.view);return t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Qh extends tr{constructor(){super(new At(50,1,0.5,500));this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Mi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;if(n!==t.fov||i!==t.aspect||s!==t.far)t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix();super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class ma extends Ni{constructor(e,t,n=0,i=Math.PI/3,s=0,r=2){super(e,t);this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new Qh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);if(t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture)t.object.map=this.map.toJSON(e).uuid;return t.object.shadow=this.shadow.toJSON(),t}}class eu extends tr{constructor(){super(new At(90,1,0.5,500));this.isPointLightShadow=!0}}class _s extends Ni{constructor(e,t,n=0,i=2){super(e,t);this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new eu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Di extends pa{constructor(e=-1,t=1,n=1,i=-1,s=0.1,r=2000){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){if(this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,r=s+l*this.view.width,a-=c*this.view.offsetY,o=a-c*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);if(t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null)t.object.view=Object.assign({},this.view);return t}}class tu extends tr{constructor(){super(new Di(-5,5,5,-5,0.5,500));this.isDirectionalLightShadow=!0}}class ga extends Ni{constructor(e,t){super(e,t);this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.shadow=new tu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class _a extends Ni{constructor(e,t){super(e,t);this.isAmbientLight=!0,this.type="AmbientLight"}}class fi{static extractUrlBase(e){let t=e.lastIndexOf("/");if(t===-1)return"./";return e.slice(0,t+1)}static resolveURL(e,t){if(typeof e!=="string"||e==="")return"";if(/^https?:\/\//i.test(t)&&/^\//.test(e))t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1");if(/^(https?:)?\/\//i.test(e))return e;if(/^data:.*,.*$/i.test(e))return e;if(/^blob:.*$/i.test(e))return e;return t+e}}var $a=new WeakMap;class xa extends Zn{constructor(e){super(e);if(this.isImageBitmapLoader=!0,typeof createImageBitmap>"u")Ee("ImageBitmapLoader: createImageBitmap() not supported.");if(typeof fetch>"u")Ee("ImageBitmapLoader: fetch() not supported.");this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){if(e===void 0)e="";if(this.path!==void 0)e=this.path+e;e=this.manager.resolveURL(e);let s=this,r=wn.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then((l)=>{if($a.has(r)===!0){if(i)i($a.get(r));s.manager.itemError(e),s.manager.itemEnd(e)}else{if(t)t(l);s.manager.itemEnd(e)}});return}setTimeout(function(){if(t)t(r);s.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any==="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(l){if(wn.add(`image-bitmap:${e}`,l),t)t(l);return s.manager.itemEnd(e),l}).catch(function(l){if(i)i(l);$a.set(o,l),wn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});wn.add(`image-bitmap:${e}`,o),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}var es=-90,ts=1;class _l extends ut{constructor(e,t,n){super();this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new At(es,ts,e,t);i.layers=this.layers,this.add(i);let s=new At(es,ts,e,t);s.layers=this.layers,this.add(s);let r=new At(es,ts,e,t);r.layers=this.layers,this.add(r);let a=new At(es,ts,e,t);a.layers=this.layers,this.add(a);let o=new At(es,ts,e,t);o.layers=this.layers,this.add(o);let l=new At(es,ts,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,r,a,o]=t;for(let l of t)this.remove(l);if(e===2000)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){if(this.parent===null)this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;if(this.coordinateSystem!==e.coordinateSystem)this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem();let[s,r,a,o,l,c]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let S=!1;if(e.isWebGLRenderer===!0)S=e.state.buffers.depth.getReversed();else S=e.reversedDepthBuffer;if(e.setRenderTarget(n,0,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,s),e.setRenderTarget(n,1,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,r),e.setRenderTarget(n,2,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,a),e.setRenderTarget(n,3,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,o),e.setRenderTarget(n,4,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,l),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),S&&e.autoClear===!1)e.clearDepth();e.render(t,c),e.setRenderTarget(h,d,u),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class xl extends At{constructor(e=[]){super();this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}var vl="\\[\\]\\.:\\/",Lf=new RegExp("["+vl+"]","g"),yl="[^"+vl+"]",Nf="[^"+vl.replace("\\.","")+"]",Df=/((?:WC+[\/:])*)/.source.replace("WC",yl),Uf=/(WCOD+)?/.source.replace("WCOD",Nf),Ff=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",yl),Of=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",yl),Bf=new RegExp("^"+Df+Uf+Ff+Of+"$"),zf=["material","materials","bones","map"];class nu{constructor(e,t,n){let i=n||$e.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];if(i!==void 0)i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class $e{constructor(e,t,n){this.path=t,this.parsedPath=n||$e.parseTrackName(t),this.node=$e.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){if(!(e&&e.isAnimationObjectGroup))return new $e(e,t,n);else return new $e.Composite(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Lf,"")}static parseTrackName(e){let t=Bf.exec(e);if(t===null)throw Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);if(zf.indexOf(s)!==-1)n.nodeName=n.nodeName.substring(0,i),n.objectName=s}if(n.propertyName===null||n.propertyName.length===0)throw Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let a=s[r];if(a.name===t||a.uuid===t)return a;let o=n(a.children);if(o)return o}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,{objectName:n,propertyName:i,propertyIndex:s}=t;if(!e)e=$e.findNode(this.rootNode,t.nodeName),this.node=e;if(this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ee("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ne("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ne("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let c=0;c<e.length;c++)if(e[c].name===l){l=c;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ne("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ne("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Ne("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let r=e[i];if(r===void 0){let l=t.nodeName;Ne("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;if(this.targetObject=e,e.isMaterial===!0)a=this.Versioning.NeedsUpdate;else if(e.isObject3D===!0)a=this.Versioning.MatrixWorldNeedsUpdate;let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}if(e.morphTargetDictionary[s]!==void 0)s=e.morphTargetDictionary[s]}o=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else if(r.fromArray!==void 0&&r.toArray!==void 0)o=this.BindingType.HasFromToArray,this.resolvedProperty=r;else if(Array.isArray(r))o=this.BindingType.EntireArray,this.resolvedProperty=r;else this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}$e.Composite=nu;$e.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};$e.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};$e.prototype.GetterByBindingType=[$e.prototype._getValue_direct,$e.prototype._getValue_array,$e.prototype._getValue_arrayElement,$e.prototype._getValue_toArray];$e.prototype.SetterByBindingTypeAndVersioning=[[$e.prototype._setValue_direct,$e.prototype._setValue_direct_setNeedsUpdate,$e.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[$e.prototype._setValue_array,$e.prototype._setValue_array_setNeedsUpdate,$e.prototype._setValue_array_setMatrixWorldNeedsUpdate],[$e.prototype._setValue_arrayElement,$e.prototype._setValue_arrayElement_setNeedsUpdate,$e.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[$e.prototype._setValue_fromArray,$e.prototype._setValue_fromArray_setNeedsUpdate,$e.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var rx=new Float32Array(1);var Zc=new Oe;class Ui{constructor(e,t,n=0,i=1/0){this.ray=new Ci(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Gs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){if(t.isPerspectiveCamera)this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,0.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t;else if(t.isOrthographicCamera)this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t;else Ne("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Zc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zc),this}intersectObject(e,t=!0,n=[]){return Qa(e,this,n,t),n.sort(Kc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)Qa(e[i],this,n,t);return n.sort(Kc),n}}function Kc(e,t){return e.distance-t.distance}function Qa(e,t,n,i){let s=!0;if(e.layers.test(t.layers)){if(e.raycast(t,n)===!1)s=!1}if(s===!0&&i===!0){let r=e.children;for(let a=0,o=r.length;a<o;a++)Qa(r[a],t,n,!0)}}class Sl{static{Sl.prototype.isMatrix2=!0}constructor(e,t,n,i){if(this.elements=[1,0,0,1],e!==void 0)this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}}function Ml(e,t,n,i){let s=kf(i);switch(n){case 1021:return e*t;case 1028:return e*t/s.components*s.byteLength;case 1029:return e*t/s.components*s.byteLength;case 1030:return e*t*2/s.components*s.byteLength;case 1031:return e*t*2/s.components*s.byteLength;case 1022:return e*t*3/s.components*s.byteLength;case 1023:return e*t*4/s.components*s.byteLength;case 1033:return e*t*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 33778:case 33779:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 35841:case 35843:return Math.max(e,16)*Math.max(t,8)/4;case 35840:case 35842:return Math.max(e,8)*Math.max(t,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37808:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37809:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case 37810:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case 37811:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case 37812:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case 37813:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case 37814:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case 37815:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case 37816:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case 37817:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case 37818:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case 37819:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case 37820:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case 37821:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(e/4)*Math.ceil(t/4)*16;case 36283:case 36284:return Math.ceil(e/4)*Math.ceil(t/4)*8;case 36285:case 36286:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function kf(e){switch(e){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}if(typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));if(typeof window<"u")if(window.__THREE__)Ee("WARNING: Multiple instances of Three.js being imported.");else window.__THREE__="186";function Tu(){let e=null,t=!1,n=null,i=null;function s(r,a){i=e.requestAnimationFrame(s),n(r,a)}return{start:function(){if(t===!0)return;if(n===null)return;if(e===null)return;i=e.requestAnimationFrame(s),t=!0},stop:function(){if(e!==null)e.cancelAnimationFrame(i);t=!1},setAnimationLoop:function(r){n=r},setContext:function(r){e=r}}}function Hf(e){let t=new WeakMap;function n(o,l){let{array:c,usage:h}=o,d=c.byteLength,u=e.createBuffer();e.bindBuffer(l,u),e.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=e.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=e.HALF_FLOAT;else if(c instanceof Uint16Array)if(o.isFloat16BufferAttribute)m=e.HALF_FLOAT;else m=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=e.SHORT;else if(c instanceof Uint32Array)m=e.UNSIGNED_INT;else if(c instanceof Int32Array)m=e.INT;else if(c instanceof Int8Array)m=e.BYTE;else if(c instanceof Uint8Array)m=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=e.UNSIGNED_BYTE;else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){let{array:h,updateRanges:d}=l;if(e.bindBuffer(c,o),d.length===0)e.bufferSubData(c,0,h);else{d.sort((m,g)=>m.start-g.start);let u=0;for(let m=1;m<d.length;m++){let g=d[u],S=d[m];if(S.start<=g.start+g.count+1)g.count=Math.max(g.count,S.start+S.count-g.start);else++u,d[u]=S}d.length=u+1;for(let m=0,g=d.length;m<g;m++){let S=d[m];e.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){if(o.isInterleavedBufferAttribute)o=o.data;return t.get(o)}function r(o){if(o.isInterleavedBufferAttribute)o=o.data;let l=t.get(o);if(l)e.deleteBuffer(l.buffer),t.delete(o)}function a(o,l){if(o.isInterleavedBufferAttribute)o=o.data;if(o.isGLBufferAttribute){let h=t.get(o);if(!h||h.version<o.version)t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Gf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Vf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Wf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$f=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,jf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ep=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,np=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ip=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ap=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,lp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,cp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,up=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,dp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,fp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,pp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_p=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xp="gl_FragColor = linearToOutputTexel( gl_FragColor );",vp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Sp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Mp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ep=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ap=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ip=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Np=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Dp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Up=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Op=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,kp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Vp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wp=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Xp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Jp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$p=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,jp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,em=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,im=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,am=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,om=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,um=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_m=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,xm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ym=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Em=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,wm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Am=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Rm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Im=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Lm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Nm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Um=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Om=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`;var Hm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Gm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ym=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Km=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$m=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ng=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ig=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ag=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,og=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,hg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ug=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_g=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ke={alphahash_fragment:Gf,alphahash_pars_fragment:Vf,alphamap_fragment:Wf,alphamap_pars_fragment:Xf,alphatest_fragment:qf,alphatest_pars_fragment:Yf,aomap_fragment:Zf,aomap_pars_fragment:Kf,batching_pars_vertex:Jf,batching_vertex:$f,begin_vertex:jf,beginnormal_vertex:Qf,bsdfs:ep,iridescence_fragment:tp,bumpmap_pars_fragment:np,clipping_planes_fragment:ip,clipping_planes_pars_fragment:sp,clipping_planes_pars_vertex:rp,clipping_planes_vertex:ap,color_fragment:op,color_pars_fragment:lp,color_pars_vertex:cp,color_vertex:hp,common:up,cube_uv_reflection_fragment:dp,defaultnormal_vertex:fp,displacementmap_pars_vertex:pp,displacementmap_vertex:mp,emissivemap_fragment:gp,emissivemap_pars_fragment:_p,colorspace_fragment:xp,colorspace_pars_fragment:vp,envmap_fragment:yp,envmap_common_pars_fragment:Sp,envmap_pars_fragment:Mp,envmap_pars_vertex:bp,envmap_physical_pars_fragment:Dp,envmap_vertex:Tp,fog_vertex:Ep,fog_pars_vertex:wp,fog_fragment:Ap,fog_pars_fragment:Rp,gradientmap_pars_fragment:Cp,lightmap_pars_fragment:Ip,lights_lambert_fragment:Pp,lights_lambert_pars_fragment:Lp,lights_pars_begin:Np,lights_toon_fragment:Up,lights_toon_pars_fragment:Fp,lights_phong_fragment:Op,lights_phong_pars_fragment:Bp,lights_physical_fragment:zp,lights_physical_pars_fragment:kp,lights_fragment_begin:Hp,lights_fragment_maps:Gp,lights_fragment_end:Vp,lightprobes_pars_fragment:Wp,logdepthbuf_fragment:Xp,logdepthbuf_pars_fragment:qp,logdepthbuf_pars_vertex:Yp,logdepthbuf_vertex:Zp,map_fragment:Kp,map_pars_fragment:Jp,map_particle_fragment:$p,map_particle_pars_fragment:jp,metalnessmap_fragment:Qp,metalnessmap_pars_fragment:em,morphinstance_vertex:tm,morphcolor_vertex:nm,morphnormal_vertex:im,morphtarget_pars_vertex:sm,morphtarget_vertex:rm,normal_fragment_begin:am,normal_fragment_maps:om,normal_pars_fragment:lm,normal_pars_vertex:cm,normal_vertex:hm,normalmap_pars_fragment:um,clearcoat_normal_fragment_begin:dm,clearcoat_normal_fragment_maps:fm,clearcoat_pars_fragment:pm,iridescence_pars_fragment:mm,opaque_fragment:gm,packing:_m,premultiplied_alpha_fragment:xm,project_vertex:vm,dithering_fragment:ym,dithering_pars_fragment:Sm,roughnessmap_fragment:Mm,roughnessmap_pars_fragment:bm,shadowmap_pars_fragment:Tm,shadowmap_pars_vertex:Em,shadowmap_vertex:wm,shadowmask_pars_fragment:Am,skinbase_vertex:Rm,skinning_pars_vertex:Cm,skinning_vertex:Im,skinnormal_vertex:Pm,specularmap_fragment:Lm,specularmap_pars_fragment:Nm,tonemapping_fragment:Dm,tonemapping_pars_fragment:Um,transmission_fragment:Fm,transmission_pars_fragment:Om,uv_pars_fragment:Bm,uv_pars_vertex:zm,uv_vertex:km,worldpos_vertex:Hm,background_vert:Gm,background_frag:Vm,backgroundCube_vert:Wm,backgroundCube_frag:Xm,cube_vert:qm,cube_frag:Ym,depth_vert:Zm,depth_frag:Km,distance_vert:Jm,distance_frag:$m,equirect_vert:jm,equirect_frag:Qm,linedashed_vert:eg,linedashed_frag:tg,meshbasic_vert:ng,meshbasic_frag:ig,meshlambert_vert:sg,meshlambert_frag:rg,meshmatcap_vert:ag,meshmatcap_frag:og,meshnormal_vert:lg,meshnormal_frag:cg,meshphong_vert:hg,meshphong_frag:ug,meshphysical_vert:dg,meshphysical_frag:fg,meshtoon_vert:pg,meshtoon_frag:mg,points_vert:gg,points_frag:_g,shadow_vert:xg,shadow_frag:vg,sprite_vert:yg,sprite_frag:Sg},ue={common:{diffuse:{value:new Ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:0.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new De(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:0.00025},fogNear:{value:1},fogFar:{value:2000},fogColor:{value:new Ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new Ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new Ie(16777215)},opacity:{value:1},center:{value:new De(0.5,0.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},Nn={basic:{uniforms:zt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:zt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ie(0)},envMapIntensity:{value:1}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:zt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ie(0)},specular:{value:new Ie(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:zt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:zt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Ie(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:zt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:zt([ue.points,ue.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:zt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:zt([ue.common,ue.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:zt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:zt([ue.sprite,ue.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distance:{uniforms:zt([ue.common,ue.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1000}}]),vertexShader:ke.distance_vert,fragmentShader:ke.distance_frag},shadow:{uniforms:zt([ue.lights,ue.fog,{color:{value:new Ie(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};Nn.physical={uniforms:zt([Nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new De(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new Ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new De},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new Ie(0)},specularColor:{value:new Ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new De},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};var va={r:0,b:0,g:0},Mg=new Oe,Eu=new Ue;Eu.set(-1,0,0,0,1,0,0,0,1);function bg(e,t,n,i,s,r){let a=new Ie(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function m(T){let A=T.isScene===!0?T.background:null;if(A&&A.isTexture){let y=T.backgroundBlurriness>0;A=t.get(A,y)}return A}function g(T){let A=!1,y=m(T);if(y===null)f(a,o);else if(y&&y.isColor)f(y,1),A=!0;let M=e.xr.getEnvironmentBlendMode();if(M==="additive")n.buffers.color.setClear(0,0,0,1,r);else if(M==="alpha-blend")n.buffers.color.setClear(0,0,0,0,r);if(e.autoClear||A)n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)}function S(T,A){let y=m(A);if(y&&(y.isCubeTexture||y.mapping===Bs)){if(c===void 0)c=new mt(new ms(1,1,1),new cn({name:"BackgroundCubeMaterial",uniforms:Pi(Nn.backgroundCube.uniforms),vertexShader:Nn.backgroundCube.vertexShader,fragmentShader:Nn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c);if(c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Mg.makeRotationFromEuler(A.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1)c.material.uniforms.backgroundRotation.value.premultiply(Eu);if(c.material.toneMapped=He.getTransfer(y.colorSpace)!==lt,h!==y||d!==y.version||u!==e.toneMapping)c.material.needsUpdate=!0,h=y,d=y.version,u=e.toneMapping;c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null)}else if(y&&y.isTexture){if(l===void 0)l=new mt(new js(2,2),new cn({name:"BackgroundMaterial",uniforms:Pi(Nn.background.uniforms),vertexShader:Nn.background.vertexShader,fragmentShader:Nn.background.fragmentShader,side:ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l);if(l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=He.getTransfer(y.colorSpace)!==lt,y.matrixAutoUpdate===!0)y.updateMatrix();if(l.material.uniforms.uvTransform.value.copy(y.matrix),h!==y||d!==y.version||u!==e.toneMapping)l.material.needsUpdate=!0,h=y,d=y.version,u=e.toneMapping;l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null)}}function f(T,A){T.getRGB(va,al(e)),n.buffers.color.setClear(va.r,va.g,va.b,A,r)}function p(){if(c!==void 0)c.geometry.dispose(),c.material.dispose(),c=void 0;if(l!==void 0)l.geometry.dispose(),l.material.dispose(),l=void 0}return{getClearColor:function(){return a},setClearColor:function(T,A=1){a.set(T),o=A,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(T){o=T,f(a,o)},render:g,addToRenderList:S,dispose:p}}function Tg(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,a=!1;function o(D,F,j,I,X){let J=!1,H=d(D,I,j,F);if(r!==H)r=H,c(r.object);if(J=m(D,I,j,X),J)g(D,I,j,X);if(X!==null)t.update(X,e.ELEMENT_ARRAY_BUFFER);if(J||a){if(a=!1,y(D,F,j,I),X!==null)e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(X).buffer)}}function l(){return e.createVertexArray()}function c(D){return e.bindVertexArray(D)}function h(D){return e.deleteVertexArray(D)}function d(D,F,j,I){let X=I.wireframe===!0,J=i[F.id];if(J===void 0)J={},i[F.id]=J;let H=D.isInstancedMesh===!0?D.id:0,ne=J[H];if(ne===void 0)ne={},J[H]=ne;let z=ne[j.id];if(z===void 0)z={},ne[j.id]=z;let W=z[X];if(W===void 0)W=u(l()),z[X]=W;return W}function u(D){let F=[],j=[],I=[];for(let X=0;X<n;X++)F[X]=0,j[X]=0,I[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:j,attributeDivisors:I,object:D,attributes:{},index:null}}function m(D,F,j,I){let X=r.attributes,J=F.attributes,H=0,ne=j.getAttributes();for(let z in ne)if(ne[z].location>=0){let Q=X[z],we=J[z];if(we===void 0){if(z==="instanceMatrix"&&D.instanceMatrix)we=D.instanceMatrix;if(z==="instanceColor"&&D.instanceColor)we=D.instanceColor}if(Q===void 0)return!0;if(Q.attribute!==we)return!0;if(we&&Q.data!==we.data)return!0;H++}if(r.attributesNum!==H)return!0;if(r.index!==I)return!0;return!1}function g(D,F,j,I){let X={},J=F.attributes,H=0,ne=j.getAttributes();for(let z in ne)if(ne[z].location>=0){let Q=J[z];if(Q===void 0){if(z==="instanceMatrix"&&D.instanceMatrix)Q=D.instanceMatrix;if(z==="instanceColor"&&D.instanceColor)Q=D.instanceColor}let we={};if(we.attribute=Q,Q&&Q.data)we.data=Q.data;X[z]=we,H++}r.attributes=X,r.attributesNum=H,r.index=I}function S(){let D=r.newAttributes;for(let F=0,j=D.length;F<j;F++)D[F]=0}function f(D){p(D,0)}function p(D,F){let j=r.newAttributes,I=r.enabledAttributes,X=r.attributeDivisors;if(j[D]=1,I[D]===0)e.enableVertexAttribArray(D),I[D]=1;if(X[D]!==F)e.vertexAttribDivisor(D,F),X[D]=F}function T(){let D=r.newAttributes,F=r.enabledAttributes;for(let j=0,I=F.length;j<I;j++)if(F[j]!==D[j])e.disableVertexAttribArray(j),F[j]=0}function A(D,F,j,I,X,J,H){if(H===!0)e.vertexAttribIPointer(D,F,j,X,J);else e.vertexAttribPointer(D,F,j,I,X,J)}function y(D,F,j,I){S();let X=I.attributes,J=j.getAttributes(),H=F.defaultAttributeValues;for(let ne in J){let z=J[ne];if(z.location>=0){let W=X[ne];if(W===void 0){if(ne==="instanceMatrix"&&D.instanceMatrix)W=D.instanceMatrix;if(ne==="instanceColor"&&D.instanceColor)W=D.instanceColor}if(W!==void 0){let Q=W.normalized,we=W.itemSize,Me=t.get(W);if(Me===void 0)continue;let{buffer:st,type:Fe,bytesPerElement:q}=Me,ie=Fe===e.INT||Fe===e.UNSIGNED_INT||W.gpuType===fo;if(W.isInterleavedBufferAttribute){let re=W.data,Ce=re.stride,Le=W.offset;if(re.isInstancedInterleavedBuffer){for(let Ae=0;Ae<z.locationSize;Ae++)p(z.location+Ae,re.meshPerAttribute);if(D.isInstancedMesh!==!0&&I._maxInstanceCount===void 0)I._maxInstanceCount=re.meshPerAttribute*re.count}else for(let Ae=0;Ae<z.locationSize;Ae++)f(z.location+Ae);e.bindBuffer(e.ARRAY_BUFFER,st);for(let Ae=0;Ae<z.locationSize;Ae++)A(z.location+Ae,we/z.locationSize,Fe,Q,Ce*q,(Le+we/z.locationSize*Ae)*q,ie)}else{if(W.isInstancedBufferAttribute){for(let re=0;re<z.locationSize;re++)p(z.location+re,W.meshPerAttribute);if(D.isInstancedMesh!==!0&&I._maxInstanceCount===void 0)I._maxInstanceCount=W.meshPerAttribute*W.count}else for(let re=0;re<z.locationSize;re++)f(z.location+re);e.bindBuffer(e.ARRAY_BUFFER,st);for(let re=0;re<z.locationSize;re++)A(z.location+re,we/z.locationSize,Fe,Q,we*q,we/z.locationSize*re*q,ie)}}else if(H!==void 0){let Q=H[ne];if(Q!==void 0)switch(Q.length){case 2:e.vertexAttrib2fv(z.location,Q);break;case 3:e.vertexAttrib3fv(z.location,Q);break;case 4:e.vertexAttrib4fv(z.location,Q);break;default:e.vertexAttrib1fv(z.location,Q)}}}}T()}function M(){E();for(let D in i){let F=i[D];for(let j in F){let I=F[j];for(let X in I){let J=I[X];for(let H in J)h(J[H].object),delete J[H];delete I[X]}}delete i[D]}}function w(D){if(i[D.id]===void 0)return;let F=i[D.id];for(let j in F){let I=F[j];for(let X in I){let J=I[X];for(let H in J)h(J[H].object),delete J[H];delete I[X]}}delete i[D.id]}function R(D){for(let F in i){let j=i[F];for(let I in j){let X=j[I];if(X[D.id]===void 0)continue;let J=X[D.id];for(let H in J)h(J[H].object),delete J[H];delete X[D.id]}}}function x(D){for(let F in i){let j=i[F],I=D.isInstancedMesh===!0?D.id:0,X=j[I];if(X===void 0)continue;for(let J in X){let H=X[J];for(let ne in H)h(H[ne].object),delete H[ne];delete X[J]}if(delete j[I],Object.keys(j).length===0)delete i[F]}}function E(){if(k(),a=!0,r===s)return;r=s,c(r.object)}function k(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:k,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:S,enableAttribute:f,disableUnusedAttributes:T}}function Eg(e,t,n){let i;function s(l){i=l}function r(l,c){e.drawArrays(i,l,c),n.update(c,i,1)}function a(l,c,h){if(h===0)return;e.drawArraysInstanced(i,l,c,h),n.update(c,i,h)}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let m=0;m<h;m++)u+=c[m];n.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function wg(e,t,n,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){if(R!==In&&i.convert(R)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))return!1;return!0}function o(R){let x=R===Cn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));if(R!==vn&&R!==Xn&&!x&&i.convert(R)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))return!1;return!0}function l(R){if(R==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";R="mediump"}if(R==="mediump"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0)return"mediump"}return"lowp"}let c=n.precision!==void 0?n.precision:"highp",h=l(c);if(h!==c)Ee("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h;let d=n.logarithmicDepthBuffer===!0,u=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control");if(n.reversedDepthBuffer===!0&&u===!1)Ee("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let m=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=e.getParameter(e.MAX_TEXTURE_SIZE),f=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),p=e.getParameter(e.MAX_VERTEX_ATTRIBS),T=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),A=e.getParameter(e.MAX_VARYING_VECTORS),y=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),M=e.getParameter(e.MAX_SAMPLES),w=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:m,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:T,maxVaryings:A,maxFragmentUniforms:y,maxSamples:M,samples:w}}function Ag(e){let t=this,n=null,i=0,s=!1,r=!1,a=new En,o=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let m=d.length!==0||u||i!==0||s;return s=u,i=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){n=h(d,u,0)},this.setState=function(d,u,m){let{clippingPlanes:g,clipIntersection:S,clipShadows:f}=d,p=e.get(d);if(!s||g===null||g.length===0||r&&!f)if(r)h(null);else c();else{let T=r?0:i,A=T*4,y=p.clippingState||null;l.value=y,y=h(g,u,A,m);for(let M=0;M!==A;++M)y[M]=n[M];p.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=T}};function c(){if(l.value!==n)l.value=n,l.needsUpdate=i>0;t.numPlanes=i,t.numIntersection=0}function h(d,u,m,g){let S=d!==null?d.length:0,f=null;if(S!==0){if(f=l.value,g!==!0||f===null){let p=m+S*4,T=u.matrixWorldInverse;if(o.getNormalMatrix(T),f===null||f.length<p)f=new Float32Array(p);for(let A=0,y=m;A!==S;++A,y+=4)a.copy(d[A]).applyMatrix4(T,o),a.normal.toArray(f,y),f[y+3]=a.constant}l.value=f,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,f}}var vs=4,Rg=6,Cg=20,Ig=256,nr=new Di,iu=new Ie,bl=null,Tl=0,El=0,wl=!1,Pg=new U,Fi=new U;class Cl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=0.1,i=100,s={}){let{size:r=256,position:a=Pg}=s;bl=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),El=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let o=this._allocateTargets();if(o.depthBuffer=!0,this._sceneToCubeUV(e,n,i,o,a),t>0)this._blur(o,0,0,t);return this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){if(this._cubemapMaterial===null)this._cubemapMaterial=au(),this._compileMaterial(this._cubemapMaterial)}compileEquirectangularShader(){if(this._equirectMaterial===null)this._equirectMaterial=ru(),this._compileMaterial(this._equirectMaterial)}dispose(){if(this._dispose(),this._cubemapMaterial!==null)this._cubemapMaterial.dispose();if(this._equirectMaterial!==null)this._equirectMaterial.dispose();if(this._backgroundBox!==null)this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){if(this._blurMaterial!==null)this._blurMaterial.dispose();if(this._ggxMaterial!==null)this._ggxMaterial.dispose();if(this._pingPongRenderTarget!==null)this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bl,Tl,El),this._renderer.xr.enabled=wl,e.scissorTest=!1,xs(e,0,0,e.width,e.height)}_fromTexture(e,t){if(e.mapping===os||e.mapping===bi)this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width);else this._setSize(e.image.width/4);bl=this._renderer.getRenderTarget(),Tl=this._renderer.getActiveCubeFace(),El=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:Cn,format:In,colorSpace:Jt,depthBuffer:!1},i=su(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){if(this._pingPongRenderTarget!==null)this._dispose();this._pingPongRenderTarget=su(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Lg(s)),this._blurMaterial=Dg(s,e,t),this._ggxMaterial=Ng(s,e,t)}return i}_compileMaterial(e){let t=new mt(new Rt,e);this._renderer.compile(t,nr)}_sceneToCubeUV(e,t,n,i,s){let o=new At(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,{autoClear:d,toneMapping:u}=h;if(h.getClearColor(iu),h.toneMapping=_n,h.autoClear=!1,h.state.buffers.depth.getReversed())h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null);if(this._backgroundBox===null)this._backgroundBox=new mt(new ms,new ln({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1}));let g=this._backgroundBox,S=g.material,f=!1,p=e.background;if(p){if(p.isColor)S.color.copy(p),e.background=null,f=!0}else S.color.copy(iu),f=!0;for(let T=0;T<6;T++){let A=T%3;if(A===0)o.up.set(0,l[T],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x+c[T],s.y,s.z);else if(A===1)o.up.set(0,0,l[T]),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y+c[T],s.z);else o.up.set(0,l[T],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y,s.z+c[T]);let y=this._cubeSize;if(xs(i,A*y,T>2?y:0,y,y),h.setRenderTarget(i),f)h.render(g,o);h.render(e,o)}h.toneMapping=u,h.autoClear=d,e.background=p}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===os||e.mapping===bi;if(i){if(this._cubemapMaterial===null)this._cubemapMaterial=au();this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1}else if(this._equirectMaterial===null)this._equirectMaterial=ru();let s=i?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=s;let a=s.uniforms;a.envMap.value=e;let o=this._cubeSize;xs(t,0,0,3*o,2*o),n.setRenderTarget(t),n.render(r,nr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,s=this._pingPongRenderTarget,r=this._ggxMaterial,a=this._lodMeshes[n];a.material=r;let o=r.uniforms,l=n/(this._lodMeshes.length-1),c=t/(this._lodMeshes.length-1),h=Math.sqrt(l*l-c*c),d=l*1.25,u=h*d,{_lodMax:m}=this,g=this._sizeLods[n],S=3*g*(n>m-vs?n-m+vs:0),f=4*(this._cubeSize-g);o.envMap.value=e.texture,o.roughness.value=u,o.mipInt.value=m-t,xs(s,S,f,3*g,2*g),i.setRenderTarget(s),i.render(a,nr),o.envMap.value=s.texture,o.roughness.value=0,o.mipInt.value=m-n,xs(e,S,f,3*g,2*g),i.setRenderTarget(e),i.render(a,nr)}_blur(e,t,n,i){let s=this._pingPongRenderTarget,r=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,r),this._blurPass(s,e,n,n,r)}_blurPass(e,t,n,i,s){let r=this._renderer,a=this._blurMaterial,o=this._lodMeshes[i];o.material=a;let l=a.uniforms;l.envMap.value=e.texture,l.sigma.value=s,l.mipInt.value=this._lodMax-n;let c=this._sizeLods[i],h=3*c*(i>this._lodMax-vs?i-this._lodMax+vs:0),d=4*(this._cubeSize-c);xs(t,h,d,3*c,2*c),r.setRenderTarget(t),r.render(o,nr)}}function Lg(e){let t=[],n=[],i=e,s=e-vs+1+Rg;for(let r=0;r<s;r++){let a=Math.pow(2,i);t.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,m=3,g=new Float32Array(m*u*d),S=new Float32Array(m*u*d);for(let p=0;p<d;p++){let T=p%3*2/3-1,A=p>2?0:-1,y=[T,A,0,T+0.6666666666666666,A,0,T+0.6666666666666666,A+1,0,T,A,0,T+0.6666666666666666,A+1,0,T,A+1,0];g.set(y,m*u*p);for(let M=0;M<u;M++){let w=h[M*2]*2-1,R=h[M*2+1]*2-1;if(p===0)Fi.set(1,R,w);else if(p===1)Fi.set(-w,1,-R);else if(p===2)Fi.set(-w,R,1);else if(p===3)Fi.set(-1,R,-w);else if(p===4)Fi.set(-w,-1,R);else Fi.set(w,R,-1);Fi.toArray(S,(p*u+M)*m)}}let f=new Rt;if(f.setAttribute("position",new Lt(g,m)),f.setAttribute("outputDirection",new Lt(S,m)),n.push(new mt(f,null)),i>vs)i--}return{lodMeshes:n,sizeLods:t}}function su(e,t,n){let i=new $t(e,t,n);return i.texture.mapping=Bs,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function xs(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function Ng(e,t,n){return new cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Ig,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sa(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Dg(e,t,n){return new cn({name:"SphericalGaussianBlur",defines:{SAMPLES:Cg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Sa(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function ru(){return new cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function au(){return new cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Sa(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Ll extends $t{constructor(e=1,t={}){super(e,e,t);this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new la(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ms(5,5,5),s=new cn({name:"CubemapFromEquirect",uniforms:Pi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xt,blending:An});s.uniforms.tEquirect.value=t;let r=new mt(i,s),a=t.minFilter;if(t.minFilter===Rn)t.minFilter=Nt;return new _l(1,10,this).update(e,r),t.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,i);e.setRenderTarget(s)}}function Ug(e){let t=new WeakMap,n=new WeakMap,i=null;function s(u,m=!1){if(u===null||u===void 0)return null;if(m)return a(u);return r(u)}function r(u){if(u&&u.isTexture){let m=u.mapping;if(m===kr||m===Hr)if(t.has(u)){let g=t.get(u).texture;return o(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let S=new Ll(g.height);return S.fromEquirectangularTexture(e,u),t.set(u,S),u.addEventListener("dispose",c),o(S.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let m=u.mapping,g=m===kr||m===Hr,S=m===os||m===bi;if(g||S){let f=n.get(u),p=f!==void 0?f.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p){if(i===null)i=new Cl(e);return f=g?i.fromEquirectangular(u,f):i.fromCubemap(u,f),f.texture.pmremVersion=u.pmremVersion,n.set(u,f),f.texture}else if(f!==void 0)return f.texture;else{let T=u.image;if(g&&T&&T.height>0||S&&T&&l(T)){if(i===null)i=new Cl(e);return f=g?i.fromEquirectangular(u):i.fromCubemap(u),f.texture.pmremVersion=u.pmremVersion,n.set(u,f),u.addEventListener("dispose",h),f.texture}else return null}}}return u}function o(u,m){if(m===kr)u.mapping=os;else if(m===Hr)u.mapping=bi;return u}function l(u){let m=0,g=6;for(let S=0;S<g;S++)if(u[S]!==void 0)m++;return m===g}function c(u){let m=u.target;m.removeEventListener("dispose",c);let g=t.get(m);if(g!==void 0)t.delete(m),g.dispose()}function h(u){let m=u.target;m.removeEventListener("dispose",h);let g=n.get(m);if(g!==void 0)n.delete(m),g.dispose()}function d(){if(t=new WeakMap,n=new WeakMap,i!==null)i.dispose(),i=null}return{get:s,dispose:d}}function Fg(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s=e.getExtension(i);return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);if(s===null)Si("WebGLRenderer: "+i+" extension not supported.");return s}}}function Og(e,t,n,i){let s={},r=new WeakMap;function a(d){let u=d.target;if(u.index!==null)t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];let m=r.get(u);if(m)t.remove(m),r.delete(u);if(i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0)delete u._maxInstanceCount;n.memory.geometries--}function o(d,u){if(s[u.id]===!0)return u;return u.addEventListener("dispose",a),s[u.id]=!0,n.memory.geometries++,u}function l(d){let u=d.attributes;for(let m in u)t.update(u[m],e.ARRAY_BUFFER)}function c(d){let u=[],m=d.index,g=d.attributes.position,S=0;if(g===void 0)return;if(m!==null){let T=m.array;S=m.version;for(let A=0,y=T.length;A<y;A+=3){let M=T[A+0],w=T[A+1],R=T[A+2];u.push(M,w,w,R,R,M)}}else{let T=g.array;S=g.version;for(let A=0,y=T.length/3-1;A<y;A+=3){let M=A+0,w=A+1,R=A+2;u.push(M,w,w,R,R,M)}}let f=new(g.count>=65535?na:ta)(u,1);f.version=S;let p=r.get(d);if(p)t.remove(p);r.set(d,f)}function h(d){let u=r.get(d);if(u){let m=d.index;if(m!==null){if(u.version<m.version)c(d)}}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Bg(e,t,n){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){e.drawElements(i,u,r,d*a),n.update(u,i,1)}function c(d,u,m){if(m===0)return;e.drawElementsInstanced(i,u,r,d*a,m),n.update(u,i,m)}function h(d,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,d,0,m);let S=0;for(let f=0;f<m;f++)S+=u[f];n.update(S,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function zg(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(n.calls++,a){case e.TRIANGLES:n.triangles+=o*(r/3);break;case e.LINES:n.lines+=o*(r/2);break;case e.LINE_STRIP:n.lines+=o*(r-1);break;case e.LINE_LOOP:n.lines+=o*r;break;case e.POINTS:n.points+=o*r;break;default:Ne("WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function kg(e,t,n){let i=new WeakMap,s=new it;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=i.get(o);if(u===void 0||u.count!==d){let E=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",E)};if(u!==void 0)u.texture.dispose();let m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],T=o.morphAttributes.color||[],A=0;if(m===!0)A=1;if(g===!0)A=2;if(S===!0)A=3;let y=o.attributes.position.count*A,M=1;if(y>t.maxTextureSize)M=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize;let w=new Float32Array(y*M*4*d),R=new Qr(w,y,M,d);R.type=Xn,R.needsUpdate=!0;let x=A*4;for(let k=0;k<d;k++){let D=f[k],F=p[k],j=T[k],I=y*M*4*k;for(let X=0;X<D.count;X++){let J=X*x;if(m===!0)s.fromBufferAttribute(D,X),w[I+J+0]=s.x,w[I+J+1]=s.y,w[I+J+2]=s.z,w[I+J+3]=0;if(g===!0)s.fromBufferAttribute(F,X),w[I+J+4]=s.x,w[I+J+5]=s.y,w[I+J+6]=s.z,w[I+J+7]=0;if(S===!0)s.fromBufferAttribute(j,X),w[I+J+8]=s.x,w[I+J+9]=s.y,w[I+J+10]=s.z,w[I+J+11]=j.itemSize===4?s.w:1}}u={count:d,texture:R,size:new De(y,M)},i.set(o,u),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",a.morphTexture,n);else{let m=0;for(let S=0;S<c.length;S++)m+=c[S];let g=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(e,"morphTargetBaseInfluence",g),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",u.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",u.size)}return{update:r}}function Hg(e,t,n,i,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h)t.update(u),r.set(u,h);if(c.isInstancedMesh){if(c.hasEventListener("dispose",l)===!1)c.addEventListener("dispose",l);if(r.get(c)!==h){if(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null)n.update(c.instanceColor,e.ARRAY_BUFFER);r.set(c,h)}}if(c.isSkinnedMesh){let m=c.skeleton;if(r.get(m)!==h)m.update(),r.set(m,h)}return u}function o(){r=new WeakMap}function l(c){let h=c.target;if(h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),n.remove(h.instanceMatrix),h.instanceColor!==null)n.remove(h.instanceColor)}return{update:a,dispose:o}}var Gg={[ro]:"LINEAR_TONE_MAPPING",[ao]:"REINHARD_TONE_MAPPING",[oo]:"CINEON_TONE_MAPPING",[lo]:"ACES_FILMIC_TONE_MAPPING",[ho]:"AGX_TONE_MAPPING",[uo]:"NEUTRAL_TONE_MAPPING",[co]:"CUSTOM_TONE_MAPPING"};function Vg(e,t,n,i,s,r){let a=new $t(t,n,{type:e,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Rt;c.setAttribute("position",new gt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new gt([0,2,0,0,2,0],2));let h=new ol({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new mt(c,h),u=new Di(-1,1,1,-1,0,1),m=null,g=null,S=!1,f,p=null,T=[],A=!1;this.setSize=function(y,M){if(a.setSize(y,M),o!==null)o.setSize(y,M);if(l!==null)l.setSize(y,M);for(let w=0;w<T.length;w++){let R=T[w];if(R.setSize)R.setSize(y,M)}},this.setEffects=function(y){T=y,A=T.length>0&&T[0].isRenderPass===!0;let{width:M,height:w}=a;if(T.length>0&&o===null)o=new $t(M,w,{type:Cn,depthBuffer:!1,stencilBuffer:!1}),l=new $t(M,w,{type:Cn,depthBuffer:!1,stencilBuffer:!1});for(let R=0;R<T.length;R++){let x=T[R];if(x.setSize)x.setSize(M,w)}},this.begin=function(y,M){if(S)return!1;if(y.toneMapping===_n&&T.length===0)return!1;if(p=M,M!==null){let{width:w,height:R}=M;if(a.width!==w||a.height!==R)this.setSize(w,R)}if(A===!1)y.setRenderTarget(a);return f=y.toneMapping,y.toneMapping=_n,!0},this.hasRenderPass=function(){return A},this.end=function(y,M){y.toneMapping=f,S=!0;let w=a,R=o;for(let x=0;x<T.length;x++){let E=T[x];if(E.enabled===!1)continue;if(E.render(y,R,w,M),E.needsSwap!==!1)w=R,R=R===o?l:o}if(m!==y.outputColorSpace||g!==y.toneMapping){if(m=y.outputColorSpace,g=y.toneMapping,h.defines={},He.getTransfer(m)===lt)h.defines.SRGB_TRANSFER="";let x=Gg[g];if(x)h.defines[x]="";h.needsUpdate=!0}h.uniforms.tDiffuse.value=w.texture,y.setRenderTarget(p),y.render(d,u),p=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){if(a.dispose(),o!==null)o.dispose();if(l!==null)l.dispose();c.dispose(),h.dispose()}}var wu=new bt,Il=new Ii(1,1),Au=new Qr,Ru=new sl,Cu=new la,ou=[],lu=[],cu=new Float32Array(16),hu=new Float32Array(9),uu=new Float32Array(4);function ys(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,r=ou[s];if(r===void 0)r=new Float32Array(s),ou[s]=r;if(t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=n,e[a].toArray(r,o)}return r}function Ct(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function It(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Ma(e,t){let n=lu[t];if(n===void 0)n=new Int32Array(t),lu[t]=n;for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function Wg(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1f(this.addr,t),n[0]=t}function Xg(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(Ct(n,t))return;e.uniform2fv(this.addr,t),It(n,t)}}function qg(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else if(t.r!==void 0){if(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b}else{if(Ct(n,t))return;e.uniform3fv(this.addr,t),It(n,t)}}function Yg(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(Ct(n,t))return;e.uniform4fv(this.addr,t),It(n,t)}}function Zg(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ct(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),It(n,t)}else{if(Ct(n,i))return;uu.set(i),e.uniformMatrix2fv(this.addr,!1,uu),It(n,i)}}function Kg(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ct(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),It(n,t)}else{if(Ct(n,i))return;hu.set(i),e.uniformMatrix3fv(this.addr,!1,hu),It(n,i)}}function Jg(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ct(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),It(n,t)}else{if(Ct(n,i))return;cu.set(i),e.uniformMatrix4fv(this.addr,!1,cu),It(n,i)}}function $g(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1i(this.addr,t),n[0]=t}function jg(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(Ct(n,t))return;e.uniform2iv(this.addr,t),It(n,t)}}function Qg(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else{if(Ct(n,t))return;e.uniform3iv(this.addr,t),It(n,t)}}function e0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(Ct(n,t))return;e.uniform4iv(this.addr,t),It(n,t)}}function t0(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1ui(this.addr,t),n[0]=t}function n0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(Ct(n,t))return;e.uniform2uiv(this.addr,t),It(n,t)}}function i0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else{if(Ct(n,t))return;e.uniform3uiv(this.addr,t),It(n,t)}}function s0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(Ct(n,t))return;e.uniform4uiv(this.addr,t),It(n,t)}}function r0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;let r;if(this.type===e.SAMPLER_2D_SHADOW)Il.compareFunction=n.isReversedDepthBuffer()?jr:$r,r=Il;else r=wu;n.setTexture2D(t||r,s)}function a0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTexture3D(t||Ru,s)}function o0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTextureCube(t||Cu,s)}function l0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTexture2DArray(t||Au,s)}function c0(e){switch(e){case 5126:return Wg;case 35664:return Xg;case 35665:return qg;case 35666:return Yg;case 35674:return Zg;case 35675:return Kg;case 35676:return Jg;case 5124:case 35670:return $g;case 35667:case 35671:return jg;case 35668:case 35672:return Qg;case 35669:case 35673:return e0;case 5125:return t0;case 36294:return n0;case 36295:return i0;case 36296:return s0;case 35678:case 36198:case 36298:case 36306:case 35682:return r0;case 35679:case 36299:case 36307:return a0;case 35680:case 36300:case 36308:case 36293:return o0;case 36289:case 36303:case 36311:case 36292:return l0}}function h0(e,t){e.uniform1fv(this.addr,t)}function u0(e,t){let n=ys(t,this.size,2);e.uniform2fv(this.addr,n)}function d0(e,t){let n=ys(t,this.size,3);e.uniform3fv(this.addr,n)}function f0(e,t){let n=ys(t,this.size,4);e.uniform4fv(this.addr,n)}function p0(e,t){let n=ys(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function m0(e,t){let n=ys(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function g0(e,t){let n=ys(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function _0(e,t){e.uniform1iv(this.addr,t)}function x0(e,t){e.uniform2iv(this.addr,t)}function v0(e,t){e.uniform3iv(this.addr,t)}function y0(e,t){e.uniform4iv(this.addr,t)}function S0(e,t){e.uniform1uiv(this.addr,t)}function M0(e,t){e.uniform2uiv(this.addr,t)}function b0(e,t){e.uniform3uiv(this.addr,t)}function T0(e,t){e.uniform4uiv(this.addr,t)}function E0(e,t,n){let i=this.cache,s=t.length,r=Ma(n,s);if(!Ct(i,r))e.uniform1iv(this.addr,r),It(i,r);let a;if(this.type===e.SAMPLER_2D_SHADOW)a=Il;else a=wu;for(let o=0;o!==s;++o)n.setTexture2D(t[o]||a,r[o])}function w0(e,t,n){let i=this.cache,s=t.length,r=Ma(n,s);if(!Ct(i,r))e.uniform1iv(this.addr,r),It(i,r);for(let a=0;a!==s;++a)n.setTexture3D(t[a]||Ru,r[a])}function A0(e,t,n){let i=this.cache,s=t.length,r=Ma(n,s);if(!Ct(i,r))e.uniform1iv(this.addr,r),It(i,r);for(let a=0;a!==s;++a)n.setTextureCube(t[a]||Cu,r[a])}function R0(e,t,n){let i=this.cache,s=t.length,r=Ma(n,s);if(!Ct(i,r))e.uniform1iv(this.addr,r),It(i,r);for(let a=0;a!==s;++a)n.setTexture2DArray(t[a]||Au,r[a])}function C0(e){switch(e){case 5126:return h0;case 35664:return u0;case 35665:return d0;case 35666:return f0;case 35674:return p0;case 35675:return m0;case 35676:return g0;case 5124:case 35670:return _0;case 35667:case 35671:return x0;case 35668:case 35672:return v0;case 35669:case 35673:return y0;case 5125:return S0;case 36294:return M0;case 36295:return b0;case 36296:return T0;case 35678:case 36198:case 36298:case 36306:case 35682:return E0;case 35679:case 36299:case 36307:return w0;case 35680:case 36300:case 36308:case 36293:return A0;case 36289:case 36303:case 36311:case 36292:return R0}}class Iu{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=c0(t.type)}}class Pu{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=C0(t.type)}}class Lu{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,r=i.length;s!==r;++s){let a=i[s];a.setValue(e,t[a.id],n)}}}var Al=/(\w+)(\])?(\[|\.)?/g;function du(e,t){e.seq.push(t),e.map[t.id]=t}function I0(e,t,n){let i=e.name,s=i.length;Al.lastIndex=0;while(!0){let r=Al.exec(i),a=Al.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l)o=o|0;if(c===void 0||c==="["&&a+2===s){du(n,c===void 0?new Iu(o,e,t):new Pu(o,e,t));break}else{let d=n.map[o];if(d===void 0)d=new Lu(o),du(n,d);n=d}}}class rr{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let a=e.getActiveUniform(t,r),o=e.getUniformLocation(t,a.name);I0(a,o,this)}let i=[],s=[];for(let r of this.seq)if(r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW)i.push(r);else s.push(r);if(i.length>0)this.seq=i.concat(s)}setValue(e,t,n,i){let s=this.map[t];if(s!==void 0)s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];if(i!==void 0)this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,r=t.length;s!==r;++s){let a=t[s],o=n[a.id];if(o.needsUpdate!==!1)a.setValue(e,o.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let r=e[i];if(r.id in t)n.push(r)}return n}}function fu(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var P0=37297,L0=0;function N0(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,n.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}var pu=new Ue;function D0(e){He._getMatrix(pu,He.workingColorSpace,e);let t=`mat3( ${pu.elements.map((n)=>n.toFixed(4))} )`;switch(He.getTransfer(e)){case jo:return[t,"LinearTransferOETF"];case lt:return[t,"sRGBTransferOETF"];default:return Ee("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function mu(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),r=(e.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+N0(e.getShaderSource(t),o)}else return r}function U0(e,t){let n=D0(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var F0={[ro]:"Linear",[ao]:"Reinhard",[oo]:"Cineon",[lo]:"ACESFilmic",[ho]:"AgX",[uo]:"Neutral",[co]:"Custom"};function O0(e,t){let n=F0[t];if(n===void 0)return Ee("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }";return"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var ya=new U;function B0(){He.getLuminanceCoefficients(ya);let e=ya.x.toFixed(4),t=ya.y.toFixed(4),n=ya.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"\treturn dot( weights, rgb );","}"].join(`
`)}function z0(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(sr).join(`
`)}function k0(e){let t=[];for(let n in e){let i=e[n];if(i===!1)continue;t.push("#define "+n+" "+i)}return t.join(`
`)}function H0(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=e.getActiveAttrib(t,s),a=r.name,o=1;if(r.type===e.FLOAT_MAT2)o=2;if(r.type===e.FLOAT_MAT3)o=3;if(r.type===e.FLOAT_MAT4)o=4;n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function sr(e){return e!==""}function gu(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function _u(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var G0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pl(e){return e.replace(G0,W0)}var V0=new Map;function W0(e,t){let n=ke[t];if(n===void 0){let i=V0.get(t);if(i!==void 0)n=ke[i],Ee('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Pl(n)}var X0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xu(e){return e.replace(X0,q0)}function q0(e,t,n,i){let s="";for(let r=parseInt(t);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function vu(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;if(e.precision==="highp")t+=`
#define HIGH_PRECISION`;else if(e.precision==="mediump")t+=`
#define MEDIUM_PRECISION`;else if(e.precision==="lowp")t+=`
#define LOW_PRECISION`;return t}var Y0={[Fs]:"SHADOWMAP_TYPE_PCF",[rs]:"SHADOWMAP_TYPE_VSM"};function Z0(e){return Y0[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var K0={[os]:"ENVMAP_TYPE_CUBE",[bi]:"ENVMAP_TYPE_CUBE",[Bs]:"ENVMAP_TYPE_CUBE_UV"};function J0(e){if(e.envMap===!1)return"ENVMAP_TYPE_CUBE";return K0[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var $0={[bi]:"ENVMAP_MODE_REFRACTION"};function j0(e){if(e.envMap===!1)return"ENVMAP_MODE_REFLECTION";return $0[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Q0={[Ah]:"ENVMAP_BLENDING_MULTIPLY",[Rh]:"ENVMAP_BLENDING_MIX",[Ch]:"ENVMAP_BLENDING_ADD"};function e_(e){if(e.envMap===!1)return"ENVMAP_BLENDING_NONE";return Q0[e.combine]||"ENVMAP_BLENDING_NONE"}function t_(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function n_(e,t,n,i){let s=e.getContext(),{defines:r,vertexShader:a,fragmentShader:o}=n,l=Z0(n),c=J0(n),h=j0(n),d=e_(n),u=t_(n),m=z0(n),g=k0(r),S=s.createProgram(),f,p,T=n.glslVersion?"#version "+n.glslVersion+`
`:"";if(n.isRawShaderMaterial){if(f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(sr).join(`
`),f.length>0)f+=`
`;if(p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(sr).join(`
`),p.length>0)p+=`
`}else f=[vu(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","\tattribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","\tattribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","\tuniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","\tattribute vec2 uv1;","#endif","#ifdef USE_UV2","\tattribute vec2 uv2;","#endif","#ifdef USE_UV3","\tattribute vec2 uv3;","#endif","#ifdef USE_TANGENT","\tattribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","\tattribute vec4 color;","#elif defined( USE_COLOR )","\tattribute vec3 color;","#endif","#ifdef USE_SKINNING","\tattribute vec4 skinIndex;","\tattribute vec4 skinWeight;","#endif",`
`].filter(sr).join(`
`),p=[vu(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+h:"",n.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==_n?"#define TONE_MAPPING":"",n.toneMapping!==_n?ke.tonemapping_pars_fragment:"",n.toneMapping!==_n?O0("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,U0("linearToOutputTexel",n.outputColorSpace),B0(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(sr).join(`
`);if(a=Pl(a),a=gu(a,n),a=_u(a,n),o=Pl(o),o=gu(o,n),o=_u(o,n),a=xu(a),o=xu(o),n.isRawShaderMaterial!==!0)T=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",n.glslVersion===Qo?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Qo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p;let A=T+f+a,y=T+p+o,M=fu(s,s.VERTEX_SHADER,A),w=fu(s,s.FRAGMENT_SHADER,y);if(s.attachShader(S,M),s.attachShader(S,w),n.index0AttributeName!==void 0)s.bindAttribLocation(S,0,n.index0AttributeName);else if(n.hasPositionAttribute===!0)s.bindAttribLocation(S,0,"position");s.linkProgram(S);function R(D){if(e.debug.checkShaderErrors){let F=s.getProgramInfoLog(S)||"",j=s.getShaderInfoLog(M)||"",I=s.getShaderInfoLog(w)||"",X=F.trim(),J=j.trim(),H=I.trim(),ne=!0,z=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(ne=!1,typeof e.debug.onShaderError==="function")e.debug.onShaderError(s,S,M,w);else{let W=mu(s,M,"vertex"),Q=mu(s,w,"fragment");Ne("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+X+`
`+W+`
`+Q)}else if(X!=="")Ee("WebGLProgram: Program Info Log:",X);else if(J===""||H==="")z=!1;if(z)D.diagnostics={runnable:ne,programLog:X,vertexShader:{log:J,prefix:f},fragmentShader:{log:H,prefix:p}}}s.deleteShader(M),s.deleteShader(w),x=new rr(s,S),E=H0(s,S)}let x;this.getUniforms=function(){if(x===void 0)R(this);return x};let E;this.getAttributes=function(){if(E===void 0)R(this);return E};let k=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){if(k===!1)k=s.getProgramParameter(S,P0);return k},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=L0++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=M,this.fragmentShader=w,this}var i_=0;class Nu{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);if(i.has(t)===!1)i.add(t),t.usedTimes++;if(i.has(n)===!1)i.add(n),n.usedTimes++;return this}remove(e){let t=this.materialCache.get(e);for(let n of t)if(n.usedTimes--,n.usedTimes===0)this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);if(n===void 0)n=new Set,t.set(e,n);return n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);if(n===void 0)n=new Du(e),t.set(e,n);return n}}class Du{constructor(e){this.id=i_++,this.code=e,this.usedTimes=0}}function s_(e){return e===Ai||e===Zr||e===Kr}function r_(e,t,n,i,s,r){let a=new Gs,o=new Nu,l=new Set,c=[],h=new Map,{logarithmicDepthBuffer:d,precision:u}=i,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){if(l.add(x),x===0)return"uv";return`uv${x}`}function S(x,E,k,D,F,j){let I=D.fog,X=F.geometry,J=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,ne=t.get(x.envMap||J,H),z=!!ne&&ne.mapping===Bs?ne.image.height:null,W=m[x.type];if(x.precision!==null){if(u=i.getMaxPrecision(x.precision),u!==x.precision)Ee("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead.")}let Q=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,we=Q!==void 0?Q.length:0,Me=0;if(X.morphAttributes.position!==void 0)Me=1;if(X.morphAttributes.normal!==void 0)Me=2;if(X.morphAttributes.color!==void 0)Me=3;let st,Fe,q,ie;if(W){let ct=Nn[W];st=ct.vertexShader,Fe=ct.fragmentShader}else{st=x.vertexShader,Fe=x.fragmentShader;let ct=o.getVertexShaderStage(x),Qe=o.getFragmentShaderStage(x);o.update(x,ct,Qe),q=ct.id,ie=Qe.id}let re=e.getRenderTarget(),Ce=e.state.buffers.depth.getReversed(),Le=F.isInstancedMesh===!0,Ae=F.isBatchedMesh===!0,Tt=!!x.map,Xe=!!x.matcap,Ye=!!ne,tt=!!x.aoMap,Ze=!!x.lightMap,Dt=!!x.bumpMap&&x.wireframe===!1,dt=!!x.normalMap,Vt=!!x.displacementMap,Et=!!x.emissiveMap,wt=!!x.metalnessMap,P=!!x.roughnessMap,Wt=x.anisotropy>0,je=x.clearcoat>0,pt=x.dispersion>0,b=x.retroreflectivity>0,_=x.iridescence>0,C=x.sheen>0,G=x.transmission>0,te=Wt&&!!x.anisotropyMap,ae=je&&!!x.clearcoatMap,ce=je&&!!x.clearcoatNormalMap,Y=je&&!!x.clearcoatRoughnessMap,K=_&&!!x.iridescenceMap,me=_&&!!x.iridescenceThicknessMap,Te=C&&!!x.sheenColorMap,he=C&&!!x.sheenRoughnessMap,se=!!x.specularMap,Re=!!x.specularColorMap,Pe=!!x.specularIntensityMap,Je=G&&!!x.transmissionMap,N=G&&!!x.thicknessMap,oe=!!x.gradientMap,Z=!!x.alphaMap,le=x.alphaTest>0,ge=!!x.alphaHash,ee=!!x.extensions,de=_n;if(x.toneMapped){if(re===null||re.isXRRenderTarget===!0)de=e.toneMapping}let Be={shaderID:W,shaderType:x.type,shaderName:x.name,vertexShader:st,fragmentShader:Fe,defines:x.defines,customVertexShaderID:q,customFragmentShaderID:ie,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:Ae,batchingColor:Ae&&F._colorsTexture!==null,instancing:Le,instancingColor:Le&&F.instanceColor!==null,instancingMorph:Le&&F.morphTexture!==null,outputColorSpace:re===null?e.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:He.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Tt,matcap:Xe,envMap:Ye,envMapMode:Ye&&ne.mapping,envMapCubeUVHeight:z,aoMap:tt,lightMap:Ze,bumpMap:Dt,normalMap:dt,displacementMap:Vt,emissiveMap:Et,normalMapObjectSpace:dt&&x.normalMapType===Oh,normalMapTangentSpace:dt&&x.normalMapType===$o,packedNormalMap:dt&&x.normalMapType===$o&&s_(x.normalMap.format),metalnessMap:wt,roughnessMap:P,anisotropy:Wt,anisotropyMap:te,clearcoat:je,clearcoatMap:ae,clearcoatNormalMap:ce,clearcoatRoughnessMap:Y,dispersion:pt,retroreflection:b,iridescence:_,iridescenceMap:K,iridescenceThicknessMap:me,sheen:C,sheenColorMap:Te,sheenRoughnessMap:he,specularMap:se,specularColorMap:Re,specularIntensityMap:Pe,transmission:G,transmissionMap:Je,thicknessMap:N,gradientMap:oe,opaque:x.transparent===!1&&x.blending===Os&&x.alphaToCoverage===!1,alphaMap:Z,alphaTest:le,alphaHash:ge,combine:x.combine,mapUv:Tt&&g(x.map.channel),aoMapUv:tt&&g(x.aoMap.channel),lightMapUv:Ze&&g(x.lightMap.channel),bumpMapUv:Dt&&g(x.bumpMap.channel),normalMapUv:dt&&g(x.normalMap.channel),displacementMapUv:Vt&&g(x.displacementMap.channel),emissiveMapUv:Et&&g(x.emissiveMap.channel),metalnessMapUv:wt&&g(x.metalnessMap.channel),roughnessMapUv:P&&g(x.roughnessMap.channel),anisotropyMapUv:te&&g(x.anisotropyMap.channel),clearcoatMapUv:ae&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ce&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Y&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:me&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:he&&g(x.sheenRoughnessMap.channel),specularMapUv:se&&g(x.specularMap.channel),specularColorMapUv:Re&&g(x.specularColorMap.channel),specularIntensityMapUv:Pe&&g(x.specularIntensityMap.channel),transmissionMapUv:Je&&g(x.transmissionMap.channel),thicknessMapUv:N&&g(x.thicknessMap.channel),alphaMapUv:Z&&g(x.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(dt||Wt),vertexNormals:!!X.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!X.attributes.uv&&(Tt||Z),fog:!!I,useFog:x.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||X.attributes.normal===void 0&&dt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ce,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:X.attributes.position!==void 0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:we,morphTextureStride:Me,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:j.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:e.shadowMap.enabled&&k.length>0,shadowMapType:e.shadowMap.type,toneMapping:de,decodeVideoTexture:Tt&&x.map.isVideoTexture===!0&&He.getTransfer(x.map.colorSpace)===lt,decodeVideoTextureEmissive:Et&&x.emissiveMap.isVideoTexture===!0&&He.getTransfer(x.emissiveMap.colorSpace)===lt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Bt,flipSided:x.side===Xt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ee&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ee&&x.extensions.multiDraw===!0||Ae)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Be.vertexUv1s=l.has(1),Be.vertexUv2s=l.has(2),Be.vertexUv3s=l.has(3),l.clear(),Be}function f(x){let E=[];if(x.shaderID)E.push(x.shaderID);else E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID);if(x.defines!==void 0)for(let k in x.defines)E.push(k),E.push(x.defines[k]);if(x.isRawShaderMaterial===!1)p(E,x),T(E,x),E.push(e.outputColorSpace);return E.push(x.customProgramCacheKey),E.join()}function p(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numSunLights),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numSunLightShadows),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function T(x,E){if(a.disableAll(),E.instancing)a.enable(0);if(E.instancingColor)a.enable(1);if(E.instancingMorph)a.enable(2);if(E.matcap)a.enable(3);if(E.envMap)a.enable(4);if(E.normalMapObjectSpace)a.enable(5);if(E.normalMapTangentSpace)a.enable(6);if(E.clearcoat)a.enable(7);if(E.iridescence)a.enable(8);if(E.alphaTest)a.enable(9);if(E.vertexColors)a.enable(10);if(E.vertexAlphas)a.enable(11);if(E.vertexUv1s)a.enable(12);if(E.vertexUv2s)a.enable(13);if(E.vertexUv3s)a.enable(14);if(E.vertexTangents)a.enable(15);if(E.anisotropy)a.enable(16);if(E.alphaHash)a.enable(17);if(E.batching)a.enable(18);if(E.dispersion)a.enable(19);if(E.retroreflection)a.enable(24);if(E.batchingColor)a.enable(20);if(E.gradientMap)a.enable(21);if(E.packedNormalMap)a.enable(22);if(E.vertexNormals)a.enable(23);if(x.push(a.mask),a.disableAll(),E.fog)a.enable(0);if(E.useFog)a.enable(1);if(E.flatShading)a.enable(2);if(E.logarithmicDepthBuffer)a.enable(3);if(E.reversedDepthBuffer)a.enable(4);if(E.skinning)a.enable(5);if(E.morphTargets)a.enable(6);if(E.morphNormals)a.enable(7);if(E.morphColors)a.enable(8);if(E.premultipliedAlpha)a.enable(9);if(E.shadowMapEnabled)a.enable(10);if(E.doubleSided)a.enable(11);if(E.flipSided)a.enable(12);if(E.useDepthPacking)a.enable(13);if(E.dithering)a.enable(14);if(E.transmission)a.enable(15);if(E.sheen)a.enable(16);if(E.opaque)a.enable(17);if(E.pointsUvs)a.enable(18);if(E.decodeVideoTexture)a.enable(19);if(E.decodeVideoTextureEmissive)a.enable(20);if(E.alphaToCoverage)a.enable(21);if(E.numLightProbeGrids>0)a.enable(22);if(E.hasPositionAttribute)a.enable(23);x.push(a.mask)}function A(x){let E=m[x.type],k;if(E){let D=Nn[E];k=Kh.clone(D.uniforms)}else k=x.uniforms;return k}function y(x,E){let k=h.get(E);if(k!==void 0)++k.usedTimes;else k=new n_(e,E,x,s),c.push(k),h.set(E,k);return k}function M(x){if(--x.usedTimes===0){let E=c.indexOf(x);c[E]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function w(x){o.remove(x)}function R(){o.dispose()}return{getParameters:S,getProgramCacheKey:f,getUniforms:A,acquireProgram:y,releaseProgram:M,releaseShaderCache:w,programs:c,dispose:R}}function a_(){let e=new WeakMap;function t(a){return e.has(a)}function n(a){let o=e.get(a);if(o===void 0)o={},e.set(a,o);return o}function i(a){e.delete(a)}function s(a,o,l){e.get(a)[o]=l}function r(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:r}}function o_(e,t){if(e.groupOrder!==t.groupOrder)return e.groupOrder-t.groupOrder;else if(e.renderOrder!==t.renderOrder)return e.renderOrder-t.renderOrder;else if(e.material.id!==t.material.id)return e.material.id-t.material.id;else if(e.materialVariant!==t.materialVariant)return e.materialVariant-t.materialVariant;else if(e.z!==t.z)return e.z-t.z;else return e.id-t.id}function yu(e,t){if(e.groupOrder!==t.groupOrder)return e.groupOrder-t.groupOrder;else if(e.renderOrder!==t.renderOrder)return e.renderOrder-t.renderOrder;else if(e.z!==t.z)return t.z-e.z;else return e.id-t.id}function Su(){let e=[],t=0,n=[],i=[],s=[];function r(){t=0,n.length=0,i.length=0,s.length=0}function a(u){let m=0;if(u.isInstancedMesh)m+=2;if(u.isSkinnedMesh)m+=1;return m}function o(u,m,g,S,f,p){let T=e[t];if(T===void 0)T={id:u.id,object:u,geometry:m,material:g,materialVariant:a(u),groupOrder:S,renderOrder:u.renderOrder,z:f,group:p},e[t]=T;else T.id=u.id,T.object=u,T.geometry=m,T.material=g,T.materialVariant=a(u),T.groupOrder=S,T.renderOrder=u.renderOrder,T.z=f,T.group=p;return t++,T}function l(u,m,g,S,f,p,T){if(T.reversedDepth===!0)f=-f;let A=o(u,m,g,S,f,p);if(g.transmission>0)i.push(A);else if(g.transparent===!0)s.push(A);else n.push(A)}function c(u,m,g,S,f,p){let T=o(u,m,g,S,f,p);if(g.transmission>0)i.unshift(T);else if(g.transparent===!0)s.unshift(T);else n.unshift(T)}function h(u,m){if(n.length>1)n.sort(u||o_);if(i.length>1)i.sort(m||yu);if(s.length>1)s.sort(m||yu)}function d(){for(let u=t,m=e.length;u<m;u++){let g=e[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function l_(){let e=new WeakMap;function t(i,s){let r=e.get(i),a;if(r===void 0)a=new Su,e.set(i,[a]);else if(s>=r.length)a=new Su,r.push(a);else a=r[s];return a}function n(){e=new WeakMap}return{get:t,dispose:n}}function c_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new U,color:new Ie};break;case"SpotLight":n={position:new U,direction:new U,color:new Ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new U,color:new Ie,distance:0,decay:0};break;case"HemisphereLight":n={direction:new U,skyColor:new Ie,groundColor:new Ie};break;case"RectAreaLight":n={color:new Ie,position:new U,halfWidth:new U,halfHeight:new U};break}return e[t.id]=n,n}}}function h_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De,shadowCameraNear:1,shadowCameraFar:1000};break}return e[t.id]=n,n}}}var u_=0;function d_(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function f_(e){let t=new c_,n=h_(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new U);let s=new U,r=new Oe,a=new Oe;function o(c){let h=0,d=0,u=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let m=0,g=0,S=0,f=0,p=0,T=0,A=0,y=0,M=0,w=0,R=0,x=0,E=0,k=0;c.sort(d_);for(let F=0,j=c.length;F<j;F++){let I=c[F],{color:X,intensity:J,distance:H}=I,ne=null;if(I.shadow&&I.shadow.map)if(I.shadow.map.texture.format===Ai)ne=I.shadow.map.texture;else ne=I.shadow.map.depthTexture||I.shadow.map.texture;if(I.isAmbientLight)h+=X.r*J,d+=X.g*J,u+=X.b*J;else if(I.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(I.sh.coefficients[z],J);k++}else if(I.isSunLight){let z=t.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let W=I.shadow,Q=n.get(I);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize.copy(W.mapSize).multiply(W.getFrameExtents()),i.sunShadow[g]=Q,i.sunShadowMap[g]=ne;let we=W.getViewportCount();for(let Me=0;Me<we;Me++)i.sunShadowMatrix[S+Me]=W.getMatrix(Me),i.sunShadowCascade[S+Me]=W._cascadeData[Me];S+=we,g++}i.sun[m]=z,m++}else if(I.isDirectionalLight){let z=t.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let W=I.shadow,Q=n.get(I);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize=W.mapSize,i.directionalShadow[f]=Q,i.directionalShadowMap[f]=ne,i.directionalShadowMatrix[f]=I.shadow.matrix,M++}i.directional[f]=z,f++}else if(I.isSpotLight){let z=t.get(I);z.position.setFromMatrixPosition(I.matrixWorld),z.color.copy(X).multiplyScalar(J),z.distance=H,z.coneCos=Math.cos(I.angle),z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),z.decay=I.decay,i.spot[T]=z;let W=I.shadow;if(I.map){if(i.spotLightMap[x]=I.map,x++,W.updateMatrices(I),I.castShadow)E++}if(i.spotLightMatrix[T]=W.matrix,I.castShadow){let Q=n.get(I);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize=W.mapSize,i.spotShadow[T]=Q,i.spotShadowMap[T]=ne,R++}T++}else if(I.isRectAreaLight){let z=t.get(I);z.color.copy(X).multiplyScalar(J),z.halfWidth.set(I.width*0.5,0,0),z.halfHeight.set(0,I.height*0.5,0),i.rectArea[A]=z,A++}else if(I.isPointLight){let z=t.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity),z.distance=I.distance,z.decay=I.decay,I.castShadow){let W=I.shadow,Q=n.get(I);Q.shadowIntensity=W.intensity,Q.shadowBias=W.bias,Q.shadowNormalBias=W.normalBias,Q.shadowRadius=W.radius,Q.shadowMapSize=W.mapSize,Q.shadowCameraNear=W.camera.near,Q.shadowCameraFar=W.camera.far,i.pointShadow[p]=Q,i.pointShadowMap[p]=ne,i.pointShadowMatrix[p]=I.shadow.matrix,w++}i.point[p]=z,p++}else if(I.isHemisphereLight){let z=t.get(I);z.skyColor.copy(I.color).multiplyScalar(J),z.groundColor.copy(I.groundColor).multiplyScalar(J),i.hemi[y]=z,y++}}if(A>0)if(e.has("OES_texture_float_linear")===!0)i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2;else i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2;i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;let D=i.hash;if(D.sunLength!==m||D.directionalLength!==f||D.pointLength!==p||D.spotLength!==T||D.rectAreaLength!==A||D.hemiLength!==y||D.numSunShadows!==g||D.numDirectionalShadows!==M||D.numPointShadows!==w||D.numSpotShadows!==R||D.numSpotMaps!==x||D.numLightProbes!==k)i.sun.length=m,i.directional.length=f,i.spot.length=T,i.rectArea.length=A,i.point.length=p,i.hemi.length=y,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.directionalShadowMatrix.length=M,i.pointShadow.length=w,i.pointShadowMap.length=w,i.pointShadowMatrix.length=w,i.spotShadow.length=R,i.spotShadowMap.length=R,i.spotLightMatrix.length=R+x-E,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=k,D.sunLength=m,D.directionalLength=f,D.pointLength=p,D.spotLength=T,D.rectAreaLength=A,D.hemiLength=y,D.numSunShadows=g,D.numDirectionalShadows=M,D.numPointShadows=w,D.numSpotShadows=R,D.numSpotMaps=x,D.numLightProbes=k,i.version=u_++}function l(c,h){let d=0,u=0,m=0,g=0,S=0,f=0,p=h.matrixWorldInverse;for(let T=0,A=c.length;T<A;T++){let y=c[T];if(y.isSunLight){let M=i.sun[d];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(p),d++}else if(y.isDirectionalLight){let M=i.directional[u];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),u++}else if(y.isSpotLight){let M=i.spot[g];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),g++}else if(y.isRectAreaLight){let M=i.rectArea[S];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),M.halfWidth.set(y.width*0.5,0,0),M.halfHeight.set(0,y.height*0.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),S++}else if(y.isPointLight){let M=i.point[m];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(p),m++}else if(y.isHemisphereLight){let M=i.hemi[f];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(p),f++}}}return{setup:o,setupView:l,state:i}}function Mu(e){let t=new f_(e),n=[],i=[],s=[];function r(u){d.camera=u,n.length=0,i.length=0,s.length=0}function a(u){n.push(u)}function o(u){i.push(u)}function l(u){s.push(u)}function c(){t.setup(n)}function h(u){t.setupView(n,u)}let d={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function p_(e){let t=new WeakMap;function n(s,r=0){let a=t.get(s),o;if(a===void 0)o=new Mu(e),t.set(s,[o]);else if(r>=a.length)o=new Mu(e),a.push(o);else o=a[r];return o}function i(){t=new WeakMap}return{get:n,dispose:i}}var m_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,g_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,__=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],x_=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],bu=new Oe,ir=new U,Rl=new U;function v_(e,t,n){let i=new Ks,s=new De,r=new De,a=new it,o=new ll,l=new cl,c={},h=n.maxTextureSize,d={[ai]:Xt,[Xt]:ai,[Bt]:Bt},u=new cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new De},radius:{value:4}},vertexShader:m_,fragmentShader:g_}),m=u.clone();m.defines.HORIZONTAL_PASS=1;let g=new Rt;g.setAttribute("position",new Lt(new Float32Array([-1,-1,0.5,3,-1,0.5,-1,3,0.5]),3));let S=new mt(g,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fs;let p=this.type;this.render=function(w,R,x){if(f.enabled===!1)return;if(f.autoUpdate===!1&&f.needsUpdate===!1)return;if(w.length===0)return;if(this.type===Qc)Ee("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Fs;let E=e.getRenderTarget(),k=e.getActiveCubeFace(),D=e.getActiveMipmapLevel(),F=e.state;if(F.setBlending(An),F.buffers.depth.getReversed()===!0)F.buffers.color.setClear(0,0,0,0);else F.buffers.color.setClear(1,1,1,1);F.buffers.depth.setTest(!0),F.setScissorTest(!1);let j=p!==this.type;if(j)R.traverse(function(I){if(I.material)if(Array.isArray(I.material))I.material.forEach((X)=>X.needsUpdate=!0);else I.material.needsUpdate=!0});for(let I=0,X=w.length;I<X;I++){let J=w[I],H=J.shadow;if(H===void 0){Ee("WebGLShadowMap:",J,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);let ne=H.getFrameExtents();if(s.multiply(ne),r.copy(H.mapSize),s.x>h||s.y>h){if(s.x>h)r.x=Math.floor(h/ne.x),s.x=r.x*ne.x,H.mapSize.x=r.x;if(s.y>h)r.y=Math.floor(h/ne.y),s.y=r.y*ne.y,H.mapSize.y=r.y}let z=e.state.buffers.depth.getReversed();if(H.camera._reversedDepth=z,H.map===null||j===!0){if(H.map!==null){if(H.map.depthTexture!==null)H.map.depthTexture.dispose(),H.map.depthTexture=null;H.map.dispose()}if(this.type===rs){if(J.isPointLight){Ee("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new $t(s.x,s.y,{format:Ai,type:Cn,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),H.map.texture.name=J.name+".shadowMap",H.map.depthTexture=new Ii(s.x,s.y,Xn),H.map.depthTexture.name=J.name+".shadowMapDepth",H.map.depthTexture.format=Ei,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=xn,H.map.depthTexture.magFilter=xn}else{if(J.isPointLight)H.map=new Ll(s.x),H.map.depthTexture=new rl(s.x,oi);else H.map=new $t(s.x,s.y),H.map.depthTexture=new Ii(s.x,s.y,oi);if(H.map.depthTexture.name=J.name+".shadowMap",H.map.depthTexture.format=Ei,this.type===Fs)H.map.depthTexture.compareFunction=z?jr:$r,H.map.depthTexture.minFilter=Nt,H.map.depthTexture.magFilter=Nt;else H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=xn,H.map.depthTexture.magFilter=xn}H.camera.updateProjectionMatrix()}if(H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==s.x||H.map.height!==s.y))H.map.setSize(s.x,s.y);let W=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();if(J.isPointLight!==!0)H.updateMatrices(J,x);for(let Q=0;Q<W;Q++){let we=H.getCamera(Q);if(J.isPointLight){let{camera:Me,matrix:st}=H,Fe=J.distance||Me.far;if(Fe!==Me.far)Me.far=Fe,Me.updateProjectionMatrix();ir.setFromMatrixPosition(J.matrixWorld),Me.position.copy(ir),Rl.copy(Me.position),Rl.add(__[Q]),Me.up.copy(x_[Q]),Me.lookAt(Rl),Me.updateMatrixWorld(),st.makeTranslation(-ir.x,-ir.y,-ir.z),bu.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),H._frustum.setFromProjectionMatrix(bu,Me.coordinateSystem,Me.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)e.setRenderTarget(H.map,Q),e.clear();else{if(Q===0)e.setRenderTarget(H.map),e.clear();let Me=H.getViewport(Q);a.set(r.x*Me.x,r.y*Me.y,r.x*Me.z,r.y*Me.w),F.viewport(a)}i=H.getFrustum(Q),y(R,x,we,J,this.type)}if(H.isPointLightShadow!==!0&&this.type===rs)T(H,x);H.needsUpdate=!1}p=this.type,f.needsUpdate=!1,e.setRenderTarget(E,k,D)};function T(w,R){let x=t.update(S);if(u.defines.VSM_SAMPLES!==w.blurSamples)u.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0;if(w.mapPass===null)w.mapPass=new $t(s.x,s.y,{format:Ai,type:Cn});else if(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)w.mapPass.setSize(w.map.width,w.map.height);u.uniforms.shadow_pass.value=w.map.depthTexture,u.uniforms.resolution.value.set(w.map.width,w.map.height),u.uniforms.radius.value=w.radius,e.setRenderTarget(w.mapPass),e.clear(),e.renderBufferDirect(R,null,x,u,S,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value.set(w.map.width,w.map.height),m.uniforms.radius.value=w.radius,e.setRenderTarget(w.map),e.clear(),e.renderBufferDirect(R,null,x,m,S,null)}function A(w,R,x,E){let k=null,D=x.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)k=D;else if(k=x.isPointLight===!0?l:o,e.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let F=k.uuid,j=R.uuid,I=c[F];if(I===void 0)I={},c[F]=I;let X=I[j];if(X===void 0)X=k.clone(),I[j]=X,R.addEventListener("dispose",M);k=X}if(k.visible=R.visible,k.wireframe=R.wireframe,E===rs)k.side=R.shadowSide!==null?R.shadowSide:R.side;else k.side=R.shadowSide!==null?R.shadowSide:d[R.side];if(k.alphaMap=R.alphaMap,k.alphaTest=R.alphaToCoverage===!0?0.5:R.alphaTest,k.map=R.map,k.clipShadows=R.clipShadows,k.clippingPlanes=R.clippingPlanes,k.clipIntersection=R.clipIntersection,k.displacementMap=R.displacementMap,k.displacementScale=R.displacementScale,k.displacementBias=R.displacementBias,k.wireframeLinewidth=R.wireframeLinewidth,k.linewidth=R.linewidth,x.isPointLight===!0&&k.isMeshDistanceMaterial===!0){let F=e.properties.get(k);F.light=x}return k}function y(w,R,x,E,k){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)){if((w.castShadow||w.receiveShadow&&k===rs)&&(!w.frustumCulled||w.intersectsFrustum(i))){w.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,w.matrixWorld);let j=t.update(w),I=w.material;if(Array.isArray(I)){let X=j.groups;for(let J=0,H=X.length;J<H;J++){let ne=X[J],z=I[ne.materialIndex];if(z&&z.visible){let W=A(w,z,E,k);w.onBeforeShadow(e,w,R,x,j,W,ne),e.renderBufferDirect(x,null,j,W,w,ne),w.onAfterShadow(e,w,R,x,j,W,ne)}}}else if(I.visible){let X=A(w,I,E,k);w.onBeforeShadow(e,w,R,x,j,X,null),e.renderBufferDirect(x,null,j,X,w,null),w.onAfterShadow(e,w,R,x,j,X,null)}}}let F=w.children;for(let j=0,I=F.length;j<I;j++)y(F[j],R,x,E,k)}function M(w){w.target.removeEventListener("dispose",M);for(let x in c){let E=c[x],k=w.target.uuid;if(k in E)E[k].dispose(),delete E[k]}}}function y_(e,t){function n(){let N=!1,oe=new it,Z=null,le=new it(0,0,0,0);return{setMask:function(ge){if(Z!==ge&&!N)e.colorMask(ge,ge,ge,ge),Z=ge},setLocked:function(ge){N=ge},setClear:function(ge,ee,de,Be,ct){if(ct===!0)ge*=Be,ee*=Be,de*=Be;if(oe.set(ge,ee,de,Be),le.equals(oe)===!1)e.clearColor(ge,ee,de,Be),le.copy(oe)},reset:function(){N=!1,Z=null,le.set(-1,0,0,0)}}}function i(){let N=!1,oe=!1,Z=null,le=null,ge=null;return{setReversed:function(ee){if(oe!==ee){let de=t.get("EXT_clip_control");if(ee)de.clipControlEXT(de.LOWER_LEFT_EXT,de.ZERO_TO_ONE_EXT);else de.clipControlEXT(de.LOWER_LEFT_EXT,de.NEGATIVE_ONE_TO_ONE_EXT);oe=ee;let Be=ge;ge=null,this.setClear(Be)}},getReversed:function(){return oe},setTest:function(ee){if(ee)re(e.DEPTH_TEST);else Ce(e.DEPTH_TEST)},setMask:function(ee){if(Z!==ee&&!N)e.depthMask(ee),Z=ee},setFunc:function(ee){if(oe)ee=Yh[ee];if(le!==ee){switch(ee){case yh:e.depthFunc(e.NEVER);break;case Sh:e.depthFunc(e.ALWAYS);break;case Mh:e.depthFunc(e.LESS);break;case so:e.depthFunc(e.LEQUAL);break;case bh:e.depthFunc(e.EQUAL);break;case Th:e.depthFunc(e.GEQUAL);break;case Eh:e.depthFunc(e.GREATER);break;case wh:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}le=ee}},setLocked:function(ee){N=ee},setClear:function(ee){if(ge!==ee){if(ge=ee,oe)ee=1-ee;e.clearDepth(ee)}},reset:function(){N=!1,Z=null,le=null,ge=null,oe=!1}}}function s(){let N=!1,oe=null,Z=null,le=null,ge=null,ee=null,de=null,Be=null,ct=null;return{setTest:function(Qe){if(!N)if(Qe)re(e.STENCIL_TEST);else Ce(e.STENCIL_TEST)},setMask:function(Qe){if(oe!==Qe&&!N)e.stencilMask(Qe),oe=Qe},setFunc:function(Qe,Mn,Fn){if(Z!==Qe||le!==Mn||ge!==Fn)e.stencilFunc(Qe,Mn,Fn),Z=Qe,le=Mn,ge=Fn},setOp:function(Qe,Mn,Fn){if(ee!==Qe||de!==Mn||Be!==Fn)e.stencilOp(Qe,Mn,Fn),ee=Qe,de=Mn,Be=Fn},setLocked:function(Qe){N=Qe},setClear:function(Qe){if(ct!==Qe)e.clearStencil(Qe),ct=Qe},reset:function(){N=!1,oe=null,Z=null,le=null,ge=null,ee=null,de=null,Be=null,ct=null}}}let r=new n,a=new i,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},m=new WeakMap,g=[],S=null,f=!1,p=null,T=null,A=null,y=null,M=null,w=null,R=null,x=new Ie(0,0,0),E=0,k=!1,D=null,F=null,j=null,I=null,X=null,J=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,ne=0,z=e.getParameter(e.VERSION);if(z.indexOf("WebGL")!==-1)ne=parseFloat(/^WebGL (\d)/.exec(z)[1]),H=ne>=1;else if(z.indexOf("OpenGL ES")!==-1)ne=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),H=ne>=2;let W=null,Q={},we=e.getParameter(e.SCISSOR_BOX),Me=e.getParameter(e.VIEWPORT),st=new it().fromArray(we),Fe=new it().fromArray(Me);function q(N,oe,Z,le){let ge=new Uint8Array(4),ee=e.createTexture();e.bindTexture(N,ee),e.texParameteri(N,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(N,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let de=0;de<Z;de++)if(N===e.TEXTURE_3D||N===e.TEXTURE_2D_ARRAY)e.texImage3D(oe,0,e.RGBA,1,1,le,0,e.RGBA,e.UNSIGNED_BYTE,ge);else e.texImage2D(oe+de,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ge);return ee}let ie={};ie[e.TEXTURE_2D]=q(e.TEXTURE_2D,e.TEXTURE_2D,1),ie[e.TEXTURE_CUBE_MAP]=q(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[e.TEXTURE_2D_ARRAY]=q(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ie[e.TEXTURE_3D]=q(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(e.DEPTH_TEST),a.setFunc(so),Dt(!1),dt(eo),re(e.CULL_FACE),tt(An);function re(N){if(h[N]!==!0)e.enable(N),h[N]=!0}function Ce(N){if(h[N]!==!1)e.disable(N),h[N]=!1}function Le(N,oe){if(u[N]!==oe){if(e.bindFramebuffer(N,oe),u[N]=oe,N===e.DRAW_FRAMEBUFFER)u[e.FRAMEBUFFER]=oe;if(N===e.FRAMEBUFFER)u[e.DRAW_FRAMEBUFFER]=oe;return!0}return!1}function Ae(N,oe){let Z=g,le=!1;if(N){if(Z=m.get(oe),Z===void 0)Z=[],m.set(oe,Z);let ge=N.textures;if(Z.length!==ge.length||Z[0]!==e.COLOR_ATTACHMENT0){for(let ee=0,de=ge.length;ee<de;ee++)Z[ee]=e.COLOR_ATTACHMENT0+ee;Z.length=ge.length,le=!0}}else if(Z[0]!==e.BACK)Z[0]=e.BACK,le=!0;if(le)e.drawBuffers(Z)}function Tt(N){if(S!==N)return e.useProgram(N),S=N,!0;return!1}let Xe={[as]:e.FUNC_ADD,[th]:e.FUNC_SUBTRACT,[nh]:e.FUNC_REVERSE_SUBTRACT};Xe[ih]=e.MIN,Xe[sh]=e.MAX;let Ye={[rh]:e.ZERO,[ah]:e.ONE,[oh]:e.SRC_COLOR,[ch]:e.SRC_ALPHA,[mh]:e.SRC_ALPHA_SATURATE,[fh]:e.DST_COLOR,[uh]:e.DST_ALPHA,[lh]:e.ONE_MINUS_SRC_COLOR,[hh]:e.ONE_MINUS_SRC_ALPHA,[ph]:e.ONE_MINUS_DST_COLOR,[dh]:e.ONE_MINUS_DST_ALPHA,[gh]:e.CONSTANT_COLOR,[_h]:e.ONE_MINUS_CONSTANT_COLOR,[xh]:e.CONSTANT_ALPHA,[vh]:e.ONE_MINUS_CONSTANT_ALPHA};function tt(N,oe,Z,le,ge,ee,de,Be,ct,Qe){if(N===An){if(f===!0)Ce(e.BLEND),f=!1;return}if(f===!1)re(e.BLEND),f=!0;if(N!==eh){if(N!==p||Qe!==k){if(T!==as||M!==as)e.blendEquation(e.FUNC_ADD),T=as,M=as;if(Qe)switch(N){case Os:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case to:e.blendFunc(e.ONE,e.ONE);break;case no:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case io:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ne("WebGLState: Invalid blending: ",N);break}else switch(N){case Os:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case to:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case no:Ne("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case io:Ne("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ne("WebGLState: Invalid blending: ",N);break}A=null,y=null,w=null,R=null,x.set(0,0,0),E=0,p=N,k=Qe}return}if(ge=ge||oe,ee=ee||Z,de=de||le,oe!==T||ge!==M)e.blendEquationSeparate(Xe[oe],Xe[ge]),T=oe,M=ge;if(Z!==A||le!==y||ee!==w||de!==R)e.blendFuncSeparate(Ye[Z],Ye[le],Ye[ee],Ye[de]),A=Z,y=le,w=ee,R=de;if(Be.equals(x)===!1||ct!==E)e.blendColor(Be.r,Be.g,Be.b,ct),x.copy(Be),E=ct;p=N,k=!1}function Ze(N,oe){N.side===Bt?Ce(e.CULL_FACE):re(e.CULL_FACE);let Z=N.side===Xt;if(oe)Z=!Z;Dt(Z),N.blending===Os&&N.transparent===!1?tt(An):tt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let le=N.stencilWrite;if(o.setTest(le),le)o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass);Et(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?re(e.SAMPLE_ALPHA_TO_COVERAGE):Ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(N){if(D!==N){if(N)e.frontFace(e.CW);else e.frontFace(e.CCW);D=N}}function dt(N){if(N!==$c){if(re(e.CULL_FACE),N!==F)if(N===eo)e.cullFace(e.BACK);else if(N===jc)e.cullFace(e.FRONT);else e.cullFace(e.FRONT_AND_BACK)}else Ce(e.CULL_FACE);F=N}function Vt(N){if(N!==j){if(H)e.lineWidth(N);j=N}}function Et(N,oe,Z){if(N){if(re(e.POLYGON_OFFSET_FILL),I!==oe||X!==Z){if(I=oe,X=Z,a.getReversed())oe=-oe;e.polygonOffset(oe,Z)}}else Ce(e.POLYGON_OFFSET_FILL)}function wt(N){if(N)re(e.SCISSOR_TEST);else Ce(e.SCISSOR_TEST)}function P(N){if(N===void 0)N=e.TEXTURE0+J-1;if(W!==N)e.activeTexture(N),W=N}function Wt(N,oe,Z){if(Z===void 0)if(W===null)Z=e.TEXTURE0+J-1;else Z=W;let le=Q[Z];if(le===void 0)le={type:void 0,texture:void 0},Q[Z]=le;if(le.type!==N||le.texture!==oe){if(W!==Z)e.activeTexture(Z),W=Z;e.bindTexture(N,oe||ie[N]),le.type=N,le.texture=oe}}function je(){let N=Q[W];if(N!==void 0&&N.type!==void 0)e.bindTexture(N.type,null),N.type=void 0,N.texture=void 0}function pt(){try{e.compressedTexImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function b(){try{e.compressedTexImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function _(){try{e.texSubImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function C(){try{e.texSubImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function G(){try{e.compressedTexSubImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function te(){try{e.compressedTexSubImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function ae(){try{e.texStorage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function ce(){try{e.texStorage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function Y(){try{e.texImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function K(){try{e.texImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function me(N){if(d[N]!==void 0)return d[N];else return e.getParameter(N)}function Te(N,oe){if(d[N]!==oe)e.pixelStorei(N,oe),d[N]=oe}function he(N){if(st.equals(N)===!1)e.scissor(N.x,N.y,N.z,N.w),st.copy(N)}function se(N){if(Fe.equals(N)===!1)e.viewport(N.x,N.y,N.z,N.w),Fe.copy(N)}function Re(N,oe){let Z=c.get(oe);if(Z===void 0)Z=new WeakMap,c.set(oe,Z);let le=Z.get(N);if(le===void 0)le=e.getUniformBlockIndex(oe,N.name),Z.set(N,le)}function Pe(N,oe){let le=c.get(oe).get(N);if(l.get(oe)!==le)e.uniformBlockBinding(oe,le,N.__bindingPointIndex),l.set(oe,le)}function Je(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),h={},d={},W=null,Q={},u={},m=new WeakMap,g=[],S=null,f=!1,p=null,T=null,A=null,y=null,M=null,w=null,R=null,x=new Ie(0,0,0),E=0,k=!1,D=null,F=null,j=null,I=null,X=null,st.set(0,0,e.canvas.width,e.canvas.height),Fe.set(0,0,e.canvas.width,e.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:re,disable:Ce,bindFramebuffer:Le,drawBuffers:Ae,useProgram:Tt,setBlending:tt,setMaterial:Ze,setFlipSided:Dt,setCullFace:dt,setLineWidth:Vt,setPolygonOffset:Et,setScissorTest:wt,activeTexture:P,bindTexture:Wt,unbindTexture:je,compressedTexImage2D:pt,compressedTexImage3D:b,texImage2D:Y,texImage3D:K,pixelStorei:Te,getParameter:me,updateUBOMapping:Re,uniformBlockBinding:Pe,texStorage2D:ae,texStorage3D:ce,texSubImage2D:_,texSubImage3D:C,compressedTexSubImage2D:G,compressedTexSubImage3D:te,scissor:he,viewport:se,reset:Je}}function S_(e,t,n,i,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new De,h=new WeakMap,d=new Set,u,m=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(b){}function S(b,_){return g?new OffscreenCanvas(b,_):is("canvas")}function f(b,_,C){let G=1,te=pt(b);if(te.width>C||te.height>C)G=C/Math.max(te.width,te.height);if(G<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){let ae=Math.floor(G*te.width),ce=Math.floor(G*te.height);if(u===void 0)u=S(ae,ce);let Y=_?S(ae,ce):u;return Y.width=ae,Y.height=ce,Y.getContext("2d").drawImage(b,0,0,ae,ce),Ee("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ae+"x"+ce+")."),Y}else{if("data"in b)Ee("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+").");return b}return b}function p(b){return b.generateMipmaps}function T(b){e.generateMipmap(b)}function A(b){if(b.isWebGLCubeRenderTarget)return e.TEXTURE_CUBE_MAP;if(b.isWebGL3DRenderTarget)return e.TEXTURE_3D;if(b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture)return e.TEXTURE_2D_ARRAY;return e.TEXTURE_2D}function y(b,_,C,G,te,ae=!1){if(b!==null){if(e[b]!==void 0)return e[b];Ee("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let ce;if(G){if(ce=t.get("EXT_texture_norm16"),!ce)Ee("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension")}let Y=_;if(_===e.RED){if(C===e.FLOAT)Y=e.R32F;if(C===e.HALF_FLOAT)Y=e.R16F;if(C===e.UNSIGNED_BYTE)Y=e.R8;if(C===e.UNSIGNED_SHORT&&ce)Y=ce.R16_EXT;if(C===e.SHORT&&ce)Y=ce.R16_SNORM_EXT}if(_===e.RED_INTEGER){if(C===e.UNSIGNED_BYTE)Y=e.R8UI;if(C===e.UNSIGNED_SHORT)Y=e.R16UI;if(C===e.UNSIGNED_INT)Y=e.R32UI;if(C===e.BYTE)Y=e.R8I;if(C===e.SHORT)Y=e.R16I;if(C===e.INT)Y=e.R32I}if(_===e.RG){if(C===e.FLOAT)Y=e.RG32F;if(C===e.HALF_FLOAT)Y=e.RG16F;if(C===e.UNSIGNED_BYTE)Y=e.RG8;if(C===e.UNSIGNED_SHORT&&ce)Y=ce.RG16_EXT;if(C===e.SHORT&&ce)Y=ce.RG16_SNORM_EXT}if(_===e.RG_INTEGER){if(C===e.UNSIGNED_BYTE)Y=e.RG8UI;if(C===e.UNSIGNED_SHORT)Y=e.RG16UI;if(C===e.UNSIGNED_INT)Y=e.RG32UI;if(C===e.BYTE)Y=e.RG8I;if(C===e.SHORT)Y=e.RG16I;if(C===e.INT)Y=e.RG32I}if(_===e.RGB_INTEGER){if(C===e.UNSIGNED_BYTE)Y=e.RGB8UI;if(C===e.UNSIGNED_SHORT)Y=e.RGB16UI;if(C===e.UNSIGNED_INT)Y=e.RGB32UI;if(C===e.BYTE)Y=e.RGB8I;if(C===e.SHORT)Y=e.RGB16I;if(C===e.INT)Y=e.RGB32I}if(_===e.RGBA_INTEGER){if(C===e.UNSIGNED_BYTE)Y=e.RGBA8UI;if(C===e.UNSIGNED_SHORT)Y=e.RGBA16UI;if(C===e.UNSIGNED_INT)Y=e.RGBA32UI;if(C===e.BYTE)Y=e.RGBA8I;if(C===e.SHORT)Y=e.RGBA16I;if(C===e.INT)Y=e.RGBA32I}if(_===e.RGB){if(C===e.UNSIGNED_SHORT&&ce)Y=ce.RGB16_EXT;if(C===e.SHORT&&ce)Y=ce.RGB16_SNORM_EXT;if(C===e.UNSIGNED_INT_5_9_9_9_REV)Y=e.RGB9_E5;if(C===e.UNSIGNED_INT_10F_11F_11F_REV)Y=e.R11F_G11F_B10F}if(_===e.RGBA){let K=ae?jo:He.getTransfer(te);if(C===e.FLOAT)Y=e.RGBA32F;if(C===e.HALF_FLOAT)Y=e.RGBA16F;if(C===e.UNSIGNED_BYTE)Y=K===lt?e.SRGB8_ALPHA8:e.RGBA8;if(C===e.UNSIGNED_SHORT&&ce)Y=ce.RGBA16_EXT;if(C===e.SHORT&&ce)Y=ce.RGBA16_SNORM_EXT;if(C===e.UNSIGNED_SHORT_4_4_4_4)Y=e.RGBA4;if(C===e.UNSIGNED_SHORT_5_5_5_1)Y=e.RGB5_A1}if(Y===e.R16F||Y===e.R32F||Y===e.RG16F||Y===e.RG32F||Y===e.RGBA16F||Y===e.RGBA32F)t.get("EXT_color_buffer_float");return Y}function M(b,_){let C;if(b){if(_===null||_===oi||_===us)C=e.DEPTH24_STENCIL8;else if(_===Xn)C=e.DEPTH32F_STENCIL8;else if(_===zs)C=e.DEPTH24_STENCIL8,Ee("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")}else if(_===null||_===oi||_===us)C=e.DEPTH_COMPONENT24;else if(_===Xn)C=e.DEPTH_COMPONENT32F;else if(_===zs)C=e.DEPTH_COMPONENT16;return C}function w(b,_){if(p(b)===!0||b.isFramebufferTexture&&b.minFilter!==xn&&b.minFilter!==Nt)return Math.log2(Math.max(_.width,_.height))+1;else if(b.mipmaps!==void 0&&b.mipmaps.length>0)return b.mipmaps.length;else if(b.isCompressedTexture&&Array.isArray(b.image))return _.mipmaps.length;else return 1}function R(b){let _=b.target;if(_.removeEventListener("dispose",R),E(_),_.isVideoTexture)h.delete(_);if(_.isHTMLTexture)d.delete(_)}function x(b){let _=b.target;_.removeEventListener("dispose",x),D(_)}function E(b){let _=i.get(b);if(_.__webglInit===void 0)return;let C=b.source,G=m.get(C);if(G){let te=G[_.__cacheKey];if(te.usedTimes--,te.usedTimes===0)k(b);if(Object.keys(G).length===0)m.delete(C)}i.remove(b)}function k(b){let _=i.get(b);e.deleteTexture(_.__webglTexture);let C=b.source,G=m.get(C);delete G[_.__cacheKey],a.memory.textures--}function D(b){let _=i.get(b);if(b.depthTexture)b.depthTexture.dispose(),i.remove(b.depthTexture);if(b.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(_.__webglFramebuffer[G]))for(let te=0;te<_.__webglFramebuffer[G].length;te++)e.deleteFramebuffer(_.__webglFramebuffer[G][te]);else e.deleteFramebuffer(_.__webglFramebuffer[G]);if(_.__webglDepthbuffer)e.deleteRenderbuffer(_.__webglDepthbuffer[G])}else{if(Array.isArray(_.__webglFramebuffer))for(let G=0;G<_.__webglFramebuffer.length;G++)e.deleteFramebuffer(_.__webglFramebuffer[G]);else e.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer)e.deleteRenderbuffer(_.__webglDepthbuffer);if(_.__webglMultisampledFramebuffer)e.deleteFramebuffer(_.__webglMultisampledFramebuffer);if(_.__webglColorRenderbuffer){for(let G=0;G<_.__webglColorRenderbuffer.length;G++)if(_.__webglColorRenderbuffer[G])e.deleteRenderbuffer(_.__webglColorRenderbuffer[G])}if(_.__webglDepthRenderbuffer)e.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let C=b.textures;for(let G=0,te=C.length;G<te;G++){let ae=i.get(C[G]);if(ae.__webglTexture)e.deleteTexture(ae.__webglTexture),a.memory.textures--;i.remove(C[G])}i.remove(b)}let F=0;function j(){F=0}function I(){return F}function X(b){F=b}function J(){let b=F;if(b>=s.maxTextures)Ee("WebGLTextures: Trying to use "+(b+1)+" texture units while this GPU supports only "+s.maxTextures);return F+=1,b}function H(b){let _=[];return _.push(b.wrapS),_.push(b.wrapT),_.push(b.wrapR||0),_.push(b.magFilter),_.push(b.minFilter),_.push(b.anisotropy),_.push(b.internalFormat),_.push(b.format),_.push(b.type),_.push(b.generateMipmaps),_.push(b.premultiplyAlpha),_.push(b.flipY),_.push(b.unpackAlignment),_.push(b.colorSpace),_.join()}function ne(b,_){let C=i.get(b);if(b.isVideoTexture)Wt(b);if(b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&C.__version!==b.version){let G=b.image;if(G===null)Ee("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Ee("WebGLRenderer: Texture marked for update but image is incomplete");else{Ce(C,b,_);return}}else if(b.isExternalTexture)C.__webglTexture=b.sourceTexture?b.sourceTexture:null;n.bindTexture(e.TEXTURE_2D,C.__webglTexture,e.TEXTURE0+_)}function z(b,_){let C=i.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&C.__version!==b.version){Ce(C,b,_);return}else if(b.isExternalTexture)C.__webglTexture=b.sourceTexture?b.sourceTexture:null;n.bindTexture(e.TEXTURE_2D_ARRAY,C.__webglTexture,e.TEXTURE0+_)}function W(b,_){let C=i.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&C.__version!==b.version){Ce(C,b,_);return}n.bindTexture(e.TEXTURE_3D,C.__webglTexture,e.TEXTURE0+_)}function Q(b,_){let C=i.get(b);if(b.isCubeDepthTexture!==!0&&b.version>0&&C.__version!==b.version){Le(C,b,_);return}n.bindTexture(e.TEXTURE_CUBE_MAP,C.__webglTexture,e.TEXTURE0+_)}let we={[ls]:e.REPEAT,[cs]:e.CLAMP_TO_EDGE,[Gr]:e.MIRRORED_REPEAT},Me={[xn]:e.NEAREST,[Vr]:e.NEAREST_MIPMAP_NEAREST,[Ti]:e.NEAREST_MIPMAP_LINEAR,[Nt]:e.LINEAR,[hs]:e.LINEAR_MIPMAP_NEAREST,[Rn]:e.LINEAR_MIPMAP_LINEAR},st={[Bh]:e.NEVER,[Vh]:e.ALWAYS,[zh]:e.LESS,[$r]:e.LEQUAL,[kh]:e.EQUAL,[jr]:e.GEQUAL,[Hh]:e.GREATER,[Gh]:e.NOTEQUAL};function Fe(b,_){if(_.type===Xn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Nt||_.magFilter===hs||_.magFilter===Ti||_.magFilter===Rn||_.minFilter===Nt||_.minFilter===hs||_.minFilter===Ti||_.minFilter===Rn))Ee("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.");if(e.texParameteri(b,e.TEXTURE_WRAP_S,we[_.wrapS]),e.texParameteri(b,e.TEXTURE_WRAP_T,we[_.wrapT]),b===e.TEXTURE_3D||b===e.TEXTURE_2D_ARRAY)e.texParameteri(b,e.TEXTURE_WRAP_R,we[_.wrapR]);if(e.texParameteri(b,e.TEXTURE_MAG_FILTER,Me[_.magFilter]),e.texParameteri(b,e.TEXTURE_MIN_FILTER,Me[_.minFilter]),_.compareFunction)e.texParameteri(b,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(b,e.TEXTURE_COMPARE_FUNC,st[_.compareFunction]);if(t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===xn)return;if(_.minFilter!==Ti&&_.minFilter!==Rn)return;if(_.type===Xn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let C=t.get("EXT_texture_filter_anisotropic");e.texParameterf(b,C.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function q(b,_){let C=!1;if(b.__webglInit===void 0)b.__webglInit=!0,_.addEventListener("dispose",R);let G=_.source,te=m.get(G);if(te===void 0)te={},m.set(G,te);let ae=H(_);if(ae!==b.__cacheKey){if(te[ae]===void 0)te[ae]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,C=!0;te[ae].usedTimes++;let ce=te[b.__cacheKey];if(ce!==void 0){if(te[b.__cacheKey].usedTimes--,ce.usedTimes===0)k(_)}b.__cacheKey=ae,b.__webglTexture=te[ae].texture}return C}function ie(b,_,C){return Math.floor(Math.floor(b/C)/_)}function re(b,_,C,G){let ae=b.updateRanges;if(ae.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,_.width,_.height,C,G,_.data);else{ae.sort((Te,he)=>Te.start-he.start);let ce=0;for(let Te=1;Te<ae.length;Te++){let he=ae[ce],se=ae[Te],Re=he.start+he.count,Pe=ie(se.start,_.width,4),Je=ie(he.start,_.width,4);if(se.start<=Re+1&&Pe===Je&&ie(se.start+se.count-1,_.width,4)===Pe)he.count=Math.max(he.count,se.start+se.count-he.start);else++ce,ae[ce]=se}ae.length=ce+1;let Y=n.getParameter(e.UNPACK_ROW_LENGTH),K=n.getParameter(e.UNPACK_SKIP_PIXELS),me=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,_.width);for(let Te=0,he=ae.length;Te<he;Te++){let se=ae[Te],Re=Math.floor(se.start/4),Pe=Math.ceil(se.count/4),Je=Re%_.width,N=Math.floor(Re/_.width),oe=Pe,Z=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,Je),n.pixelStorei(e.UNPACK_SKIP_ROWS,N),n.texSubImage2D(e.TEXTURE_2D,0,Je,N,oe,1,C,G,_.data)}b.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,Y),n.pixelStorei(e.UNPACK_SKIP_PIXELS,K),n.pixelStorei(e.UNPACK_SKIP_ROWS,me)}}function Ce(b,_,C){let G=e.TEXTURE_2D;if(_.isDataArrayTexture||_.isCompressedArrayTexture)G=e.TEXTURE_2D_ARRAY;if(_.isData3DTexture)G=e.TEXTURE_3D;let te=q(b,_),ae=_.source;n.bindTexture(G,b.__webglTexture,e.TEXTURE0+C);let ce=i.get(ae);if(ae.version!==ce.__version||te===!0){if(n.activeTexture(e.TEXTURE0+C),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let Z=He.getPrimaries(He.workingColorSpace),le=_.colorSpace===Ri?null:He.getPrimaries(_.colorSpace),ge=_.colorSpace===Ri||Z===le?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge)}n.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment);let K=f(_.image,!1,s.maxTextureSize);K=je(_,K);let me=r.convert(_.format,_.colorSpace),Te=r.convert(_.type),he=y(_.internalFormat,me,Te,_.normalized,_.colorSpace,_.isVideoTexture);Fe(G,_);let se,Re=_.mipmaps,Pe=_.isVideoTexture!==!0,Je=ce.__version===void 0||te===!0,N=ae.dataReady,oe=w(_,K);if(_.isDepthTexture){if(he=M(_.format===wi,_.type),Je)if(Pe)n.texStorage2D(e.TEXTURE_2D,1,he,K.width,K.height);else n.texImage2D(e.TEXTURE_2D,0,he,K.width,K.height,0,me,Te,null)}else if(_.isDataTexture)if(Re.length>0){if(Pe&&Je)n.texStorage2D(e.TEXTURE_2D,oe,he,Re[0].width,Re[0].height);for(let Z=0,le=Re.length;Z<le;Z++)if(se=Re[Z],Pe){if(N)n.texSubImage2D(e.TEXTURE_2D,Z,0,0,se.width,se.height,me,Te,se.data)}else n.texImage2D(e.TEXTURE_2D,Z,he,se.width,se.height,0,me,Te,se.data);_.generateMipmaps=!1}else if(Pe){if(Je)n.texStorage2D(e.TEXTURE_2D,oe,he,K.width,K.height);if(N)re(_,K,me,Te)}else n.texImage2D(e.TEXTURE_2D,0,he,K.width,K.height,0,me,Te,K.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){if(Pe&&Je)n.texStorage3D(e.TEXTURE_2D_ARRAY,oe,he,Re[0].width,Re[0].height,K.depth);for(let Z=0,le=Re.length;Z<le;Z++)if(se=Re[Z],_.format!==In)if(me!==null)if(Pe){if(N)if(_.layerUpdates.size>0){let ge=Ml(se.width,se.height,_.format,_.type);for(let ee of _.layerUpdates){let de=se.data.subarray(ee*ge/se.data.BYTES_PER_ELEMENT,(ee+1)*ge/se.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Z,0,0,ee,se.width,se.height,1,me,de)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Z,0,0,0,se.width,se.height,K.depth,me,se.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Z,he,se.width,se.height,K.depth,0,se.data,0,0);else Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(Pe){if(N)n.texSubImage3D(e.TEXTURE_2D_ARRAY,Z,0,0,0,se.width,se.height,K.depth,me,Te,se.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,Z,he,se.width,se.height,K.depth,0,me,Te,se.data);if(_.layerUpdates.size>0)_.clearLayerUpdates()}else{if(Pe&&Je)n.texStorage2D(e.TEXTURE_2D,oe,he,Re[0].width,Re[0].height);for(let Z=0,le=Re.length;Z<le;Z++)if(se=Re[Z],_.format!==In)if(me!==null)if(Pe){if(N)n.compressedTexSubImage2D(e.TEXTURE_2D,Z,0,0,se.width,se.height,me,se.data)}else n.compressedTexImage2D(e.TEXTURE_2D,Z,he,se.width,se.height,0,se.data);else Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(Pe){if(N)n.texSubImage2D(e.TEXTURE_2D,Z,0,0,se.width,se.height,me,Te,se.data)}else n.texImage2D(e.TEXTURE_2D,Z,he,se.width,se.height,0,me,Te,se.data)}else if(_.isDataArrayTexture)if(Pe){if(Je)n.texStorage3D(e.TEXTURE_2D_ARRAY,oe,he,K.width,K.height,K.depth);if(N)if(_.layerUpdates.size>0){let Z=Ml(K.width,K.height,_.format,_.type);for(let le of _.layerUpdates){let ge=K.data.subarray(le*Z/K.data.BYTES_PER_ELEMENT,(le+1)*Z/K.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,le,K.width,K.height,1,me,Te,ge)}_.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,me,Te,K.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,he,K.width,K.height,K.depth,0,me,Te,K.data);else if(_.isData3DTexture)if(Pe){if(Je)n.texStorage3D(e.TEXTURE_3D,oe,he,K.width,K.height,K.depth);if(N)n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,me,Te,K.data)}else n.texImage3D(e.TEXTURE_3D,0,he,K.width,K.height,K.depth,0,me,Te,K.data);else if(_.isFramebufferTexture){if(Je)if(Pe)n.texStorage2D(e.TEXTURE_2D,oe,he,K.width,K.height);else{let Z=K.width,le=K.height;for(let ge=0;ge<oe;ge++)n.texImage2D(e.TEXTURE_2D,ge,he,Z,le,0,me,Te,null),Z>>=1,le>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in e){let Z=e.canvas;if(!Z.hasAttribute("layoutsubtree"))Z.setAttribute("layoutsubtree","true");if(K.parentNode!==Z){Z.appendChild(K),d.add(_),Z.onpaint=(le)=>{let ge=le.changedElements;for(let ee of d)if(ge.includes(ee.image))ee.needsUpdate=!0},Z.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,K);else{let{RGBA:ge,RGBA:ee,UNSIGNED_BYTE:de}=e;e.texElementImage2D(e.TEXTURE_2D,0,ge,ee,de,K)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(Re.length>0){if(Pe&&Je){let Z=pt(Re[0]);n.texStorage2D(e.TEXTURE_2D,oe,he,Z.width,Z.height)}for(let Z=0,le=Re.length;Z<le;Z++)if(se=Re[Z],Pe){if(N)n.texSubImage2D(e.TEXTURE_2D,Z,0,0,me,Te,se)}else n.texImage2D(e.TEXTURE_2D,Z,he,me,Te,se);_.generateMipmaps=!1}else if(Pe){if(Je){let Z=pt(K);n.texStorage2D(e.TEXTURE_2D,oe,he,Z.width,Z.height)}if(N)n.texSubImage2D(e.TEXTURE_2D,0,0,0,me,Te,K)}else n.texImage2D(e.TEXTURE_2D,0,he,me,Te,K);if(p(_))T(G);if(ce.__version=ae.version,_.onUpdate)_.onUpdate(_)}b.__version=_.version}function Le(b,_,C){if(_.image.length!==6)return;let G=q(b,_),te=_.source;n.bindTexture(e.TEXTURE_CUBE_MAP,b.__webglTexture,e.TEXTURE0+C);let ae=i.get(te);if(te.version!==ae.__version||G===!0){n.activeTexture(e.TEXTURE0+C);let ce=He.getPrimaries(He.workingColorSpace),Y=_.colorSpace===Ri?null:He.getPrimaries(_.colorSpace),K=_.colorSpace===Ri||ce===Y?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);let me=_.isCompressedTexture||_.image[0].isCompressedTexture,Te=_.image[0]&&_.image[0].isDataTexture,he=[];for(let ee=0;ee<6;ee++){if(!me&&!Te)he[ee]=f(_.image[ee],!0,s.maxCubemapSize);else he[ee]=Te?_.image[ee].image:_.image[ee];he[ee]=je(_,he[ee])}let se=he[0],Re=r.convert(_.format,_.colorSpace),Pe=r.convert(_.type),Je=y(_.internalFormat,Re,Pe,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,oe=ae.__version===void 0||G===!0,Z=te.dataReady,le=w(_,se);Fe(e.TEXTURE_CUBE_MAP,_);let ge;if(me){if(N&&oe)n.texStorage2D(e.TEXTURE_CUBE_MAP,le,Je,se.width,se.height);for(let ee=0;ee<6;ee++){ge=he[ee].mipmaps;for(let de=0;de<ge.length;de++){let Be=ge[de];if(_.format!==In)if(Re!==null)if(N){if(Z)n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de,0,0,Be.width,Be.height,Re,Be.data)}else n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de,Je,Be.width,Be.height,0,Be.data);else Ee("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()");else if(N){if(Z)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de,0,0,Be.width,Be.height,Re,Pe,Be.data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de,Je,Be.width,Be.height,0,Re,Pe,Be.data)}}}else{if(ge=_.mipmaps,N&&oe){if(ge.length>0)le++;let ee=pt(he[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,le,Je,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(Te){if(N){if(Z)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,he[ee].width,he[ee].height,Re,Pe,he[ee].data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Je,he[ee].width,he[ee].height,0,Re,Pe,he[ee].data);for(let de=0;de<ge.length;de++){let ct=ge[de].image[ee].image;if(N){if(Z)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de+1,0,0,ct.width,ct.height,Re,Pe,ct.data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de+1,Je,ct.width,ct.height,0,Re,Pe,ct.data)}}else{if(N){if(Z)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Re,Pe,he[ee])}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Je,Re,Pe,he[ee]);for(let de=0;de<ge.length;de++){let Be=ge[de];if(N){if(Z)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de+1,0,0,Re,Pe,Be.image[ee])}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,de+1,Je,Re,Pe,Be.image[ee])}}}if(p(_))T(e.TEXTURE_CUBE_MAP);if(ae.__version=te.version,_.onUpdate)_.onUpdate(_)}b.__version=_.version}function Ae(b,_,C,G,te,ae){let ce=r.convert(C.format,C.colorSpace),Y=r.convert(C.type),K=y(C.internalFormat,ce,Y,C.normalized,C.colorSpace),me=i.get(_),Te=i.get(C);if(Te.__renderTarget=_,!me.__hasExternalTextures){let he=Math.max(1,_.width>>ae),se=Math.max(1,_.height>>ae);if(te===e.TEXTURE_3D||te===e.TEXTURE_2D_ARRAY)n.texImage3D(te,ae,K,he,se,_.depth,0,ce,Y,null);else n.texImage2D(te,ae,K,he,se,0,ce,Y,null)}if(n.bindFramebuffer(e.FRAMEBUFFER,b),P(_))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,G,te,Te.__webglTexture,0,wt(_));else if(te===e.TEXTURE_2D||te>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)e.framebufferTexture2D(e.FRAMEBUFFER,G,te,Te.__webglTexture,ae);n.bindFramebuffer(e.FRAMEBUFFER,null)}function Tt(b,_,C){if(e.bindRenderbuffer(e.RENDERBUFFER,b),_.depthBuffer){let G=_.depthTexture,te=G&&G.isDepthTexture?G.type:null,ae=M(_.stencilBuffer,te),ce=_.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(P(_))o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,wt(_),ae,_.width,_.height);else if(C)e.renderbufferStorageMultisample(e.RENDERBUFFER,wt(_),ae,_.width,_.height);else e.renderbufferStorage(e.RENDERBUFFER,ae,_.width,_.height);e.framebufferRenderbuffer(e.FRAMEBUFFER,ce,e.RENDERBUFFER,b)}else{let G=_.textures;for(let te=0;te<G.length;te++){let ae=G[te],ce=r.convert(ae.format,ae.colorSpace),Y=r.convert(ae.type),K=y(ae.internalFormat,ce,Y,ae.normalized,ae.colorSpace);if(P(_))o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,wt(_),K,_.width,_.height);else if(C)e.renderbufferStorageMultisample(e.RENDERBUFFER,wt(_),K,_.width,_.height);else e.renderbufferStorage(e.RENDERBUFFER,K,_.width,_.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Xe(b,_,C){let G=_.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,b),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let te=i.get(_.depthTexture);if(te.__renderTarget=_,!te.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0;if(G){if(te.__webglInit===void 0)te.__webglInit=!0,_.depthTexture.addEventListener("dispose",R);if(te.__webglTexture===void 0){te.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,te.__webglTexture),Fe(e.TEXTURE_CUBE_MAP,_.depthTexture);let me=r.convert(_.depthTexture.format),Te=r.convert(_.depthTexture.type),he;if(_.depthTexture.format===Ei)he=e.DEPTH_COMPONENT24;else if(_.depthTexture.format===wi)he=e.DEPTH24_STENCIL8;for(let se=0;se<6;se++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,he,_.width,_.height,0,me,Te,null)}}else ne(_.depthTexture,0);let ae=te.__webglTexture,ce=wt(_),Y=G?e.TEXTURE_CUBE_MAP_POSITIVE_X+C:e.TEXTURE_2D,K=_.depthTexture.format===wi?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(_.depthTexture.format===Ei)if(P(_))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,K,Y,ae,0,ce);else e.framebufferTexture2D(e.FRAMEBUFFER,K,Y,ae,0);else if(_.depthTexture.format===wi)if(P(_))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,K,Y,ae,0,ce);else e.framebufferTexture2D(e.FRAMEBUFFER,K,Y,ae,0);else throw Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ye(b){let _=i.get(b),C=b.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==b.depthTexture){let G=b.depthTexture;if(_.__depthDisposeCallback)_.__depthDisposeCallback();if(G){let te=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,G.removeEventListener("dispose",te)};G.addEventListener("dispose",te),_.__depthDisposeCallback=te}_.__boundDepthTexture=G}if(b.depthTexture&&!_.__autoAllocateDepthBuffer)if(C)for(let G=0;G<6;G++)Xe(_.__webglFramebuffer[G],b,G);else{let G=b.texture.mipmaps;if(G&&G.length>0)Xe(_.__webglFramebuffer[0],b,0);else Xe(_.__webglFramebuffer,b,0)}else if(C){_.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[G]),_.__webglDepthbuffer[G]===void 0)_.__webglDepthbuffer[G]=e.createRenderbuffer(),Tt(_.__webglDepthbuffer[G],b,!1);else{let te=b.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ae=_.__webglDepthbuffer[G];e.bindRenderbuffer(e.RENDERBUFFER,ae),e.framebufferRenderbuffer(e.FRAMEBUFFER,te,e.RENDERBUFFER,ae)}}else{let G=b.texture.mipmaps;if(G&&G.length>0)n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer[0]);else n.bindFramebuffer(e.FRAMEBUFFER,_.__webglFramebuffer);if(_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=e.createRenderbuffer(),Tt(_.__webglDepthbuffer,b,!1);else{let te=b.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ae=_.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,ae),e.framebufferRenderbuffer(e.FRAMEBUFFER,te,e.RENDERBUFFER,ae)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function tt(b,_,C){let G=i.get(b);if(_!==void 0)Ae(G.__webglFramebuffer,b,b.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0);if(C!==void 0)Ye(b)}function Ze(b){let _=b.texture,C=i.get(b),G=i.get(_);b.addEventListener("dispose",x);let te=b.textures,ae=b.isWebGLCubeRenderTarget===!0,ce=te.length>1;if(!ce){if(G.__webglTexture===void 0)G.__webglTexture=e.createTexture();G.__version=_.version,a.memory.textures++}if(ae){C.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0){C.__webglFramebuffer[Y]=[];for(let K=0;K<_.mipmaps.length;K++)C.__webglFramebuffer[Y][K]=e.createFramebuffer()}else C.__webglFramebuffer[Y]=e.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){C.__webglFramebuffer=[];for(let Y=0;Y<_.mipmaps.length;Y++)C.__webglFramebuffer[Y]=e.createFramebuffer()}else C.__webglFramebuffer=e.createFramebuffer();if(ce)for(let Y=0,K=te.length;Y<K;Y++){let me=i.get(te[Y]);if(me.__webglTexture===void 0)me.__webglTexture=e.createTexture(),a.memory.textures++}if(b.samples>0&&P(b)===!1){C.__webglMultisampledFramebuffer=e.createFramebuffer(),C.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,C.__webglMultisampledFramebuffer);for(let Y=0;Y<te.length;Y++){let K=te[Y];C.__webglColorRenderbuffer[Y]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,C.__webglColorRenderbuffer[Y]);let me=r.convert(K.format,K.colorSpace),Te=r.convert(K.type),he=y(K.internalFormat,me,Te,K.normalized,K.colorSpace,b.isXRRenderTarget===!0),se=wt(b);e.renderbufferStorageMultisample(e.RENDERBUFFER,se,he,b.width,b.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Y,e.RENDERBUFFER,C.__webglColorRenderbuffer[Y])}if(e.bindRenderbuffer(e.RENDERBUFFER,null),b.depthBuffer)C.__webglDepthRenderbuffer=e.createRenderbuffer(),Tt(C.__webglDepthRenderbuffer,b,!0);n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(ae){n.bindTexture(e.TEXTURE_CUBE_MAP,G.__webglTexture),Fe(e.TEXTURE_CUBE_MAP,_);for(let Y=0;Y<6;Y++)if(_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Ae(C.__webglFramebuffer[Y][K],b,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Y,K);else Ae(C.__webglFramebuffer[Y],b,_,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);if(p(_))T(e.TEXTURE_CUBE_MAP);n.unbindTexture()}else if(ce){for(let Y=0,K=te.length;Y<K;Y++){let me=te[Y],Te=i.get(me),he=e.TEXTURE_2D;if(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)he=b.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY;if(n.bindTexture(he,Te.__webglTexture),Fe(he,me),Ae(C.__webglFramebuffer,b,me,e.COLOR_ATTACHMENT0+Y,he,0),p(me))T(he)}n.unbindTexture()}else{let Y=e.TEXTURE_2D;if(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)Y=b.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY;if(n.bindTexture(Y,G.__webglTexture),Fe(Y,_),_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Ae(C.__webglFramebuffer[K],b,_,e.COLOR_ATTACHMENT0,Y,K);else Ae(C.__webglFramebuffer,b,_,e.COLOR_ATTACHMENT0,Y,0);if(p(_))T(Y);n.unbindTexture()}if(b.depthBuffer)Ye(b)}function Dt(b){let _=b.textures;for(let C=0,G=_.length;C<G;C++){let te=_[C];if(p(te)){let ae=A(b),ce=i.get(te).__webglTexture;n.bindTexture(ae,ce),T(ae),n.unbindTexture()}}}let dt=[],Vt=[];function Et(b){if(b.samples>0){if(P(b)===!1){let{textures:_,width:C,height:G}=b,te=e.COLOR_BUFFER_BIT,ae=b.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ce=i.get(b),Y=_.length>1;if(Y)for(let me=0;me<_.length;me++)n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);let K=b.texture.mipmaps;if(K&&K.length>0)n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]);else n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let me=0;me<_.length;me++){if(b.resolveDepthBuffer){if(b.depthBuffer)te|=e.DEPTH_BUFFER_BIT;if(b.stencilBuffer&&b.resolveStencilBuffer)te|=e.STENCIL_BUFFER_BIT}if(Y){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ce.__webglColorRenderbuffer[me]);let Te=i.get(_[me]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Te,0)}if(e.blitFramebuffer(0,0,C,G,0,0,C,G,te,e.NEAREST),l===!0){if(dt.length=0,Vt.length=0,dt.push(e.COLOR_ATTACHMENT0+me),b.depthBuffer&&b.storeMultisampledDepthBuffer===!1)dt.push(ae),Vt.push(ae),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Vt);e.invalidateFramebuffer(e.READ_FRAMEBUFFER,dt)}}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),Y)for(let me=0;me<_.length;me++){n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.RENDERBUFFER,ce.__webglColorRenderbuffer[me]);let Te=i.get(_[me]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+me,e.TEXTURE_2D,Te,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.storeMultisampledDepthBuffer===!1&&l){let _=b.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[_])}}}function wt(b){return Math.min(s.maxSamples,b.samples)}function P(b){let _=i.get(b);return b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Wt(b){let _=a.render.frame;if(h.get(b)!==_)h.set(b,_),b.update()}function je(b,_){let{colorSpace:C,format:G,type:te}=b;if(b.isCompressedTexture===!0||b.isVideoTexture===!0)return _;if(C!==Jt&&C!==Ri)if(He.getTransfer(C)===lt){if(G!==In||te!==vn)Ee("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.")}else Ne("WebGLTextures: Unsupported texture color space:",C);return _}function pt(b){if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement)c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height;else if(typeof VideoFrame<"u"&&b instanceof VideoFrame)c.width=b.displayWidth,c.height=b.displayHeight;else c.width=b.width,c.height=b.height;return c}this.allocateTextureUnit=J,this.resetTextureUnits=j,this.getTextureUnits=I,this.setTextureUnits=X,this.setTexture2D=ne,this.setTexture2DArray=z,this.setTexture3D=W,this.setTextureCube=Q,this.rebindTextures=tt,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=Et,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=P,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function M_(e,t){function n(i,s=Ri){let r,a=He.getTransfer(s);if(i===vn)return e.UNSIGNED_BYTE;if(i===po)return e.UNSIGNED_SHORT_4_4_4_4;if(i===mo)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Lh)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Nh)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ih)return e.BYTE;if(i===Ph)return e.SHORT;if(i===zs)return e.UNSIGNED_SHORT;if(i===fo)return e.INT;if(i===oi)return e.UNSIGNED_INT;if(i===Xn)return e.FLOAT;if(i===Cn)return e.HALF_FLOAT;if(i===Dh)return e.ALPHA;if(i===Uh)return e.RGB;if(i===In)return e.RGBA;if(i===Ei)return e.DEPTH_COMPONENT;if(i===wi)return e.DEPTH_STENCIL;if(i===Fh)return e.RED;if(i===go)return e.RED_INTEGER;if(i===Ai)return e.RG;if(i===_o)return e.RG_INTEGER;if(i===xo)return e.RGBA_INTEGER;if(i===Wr||i===Xr||i===qr||i===Yr)if(a===lt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Wr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Wr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Xr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===qr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Yr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===vo||i===yo||i===So||i===Mo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===vo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===yo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===So)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Mo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===bo||i===To||i===Eo||i===wo||i===Ao||i===Zr||i===Ro)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===bo||i===To)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Eo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===wo)return r.COMPRESSED_R11_EAC;if(i===Ao)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Zr)return r.COMPRESSED_RG11_EAC;if(i===Ro)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Co||i===Io||i===Po||i===Lo||i===No||i===Do||i===Uo||i===Fo||i===Oo||i===Bo||i===zo||i===ko||i===Ho||i===Go)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Co)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Io)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Po)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Lo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===No)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Do)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Uo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Fo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Oo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Bo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===zo)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ko)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ho)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Go)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Vo||i===Wo||i===Xo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Vo)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Wo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Xo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===qo||i===Yo||i===Kr||i===Zo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===qo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Yo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Kr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Zo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;if(i===us)return e.UNSIGNED_INT_24_8;return e[i]!==void 0?e[i]:null}return{convert:n}}var b_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,T_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Uu{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ca(e.texture);if(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)this.depthNear=e.depthNear,this.depthFar=e.depthFar;this.texture=n}}getMesh(e){if(this.texture!==null){if(this.mesh===null){let t=e.cameras[0].viewport,n=new cn({vertexShader:b_,fragmentShader:T_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new mt(new js(20,20),n)}}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fu extends qn{constructor(e,t){super();let n=this,i=null,s=1,r=null,a="local-floor",o=1,l=null,c=null,h=null,d=null,u=null,m=null,g=typeof XRWebGLBinding<"u",S=new Uu,f={},p=t.getContextAttributes(),T=null,A=null,y=[],M=[],w=new De,R=null,x=null,E=new At;E.viewport=new it;let k=new At;k.viewport=new it;let D=[E,k],F=new xl,j=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ie=y[q];if(ie===void 0)ie=new Vs,y[q]=ie;return ie.getTargetRaySpace()},this.getControllerGrip=function(q){let ie=y[q];if(ie===void 0)ie=new Vs,y[q]=ie;return ie.getGripSpace()},this.getHand=function(q){let ie=y[q];if(ie===void 0)ie=new Vs,y[q]=ie;return ie.getHandSpace()};function X(q){let ie=M.indexOf(q.inputSource);if(ie===-1)return;let re=y[ie];if(re!==void 0)re.update(q.inputSource,q.frame,l||r),re.dispatchEvent({type:q.type,data:q.inputSource})}function J(){i.removeEventListener("select",X),i.removeEventListener("selectstart",X),i.removeEventListener("selectend",X),i.removeEventListener("squeeze",X),i.removeEventListener("squeezestart",X),i.removeEventListener("squeezeend",X),i.removeEventListener("end",J),i.removeEventListener("inputsourceschange",H);for(let q=0;q<y.length;q++){let ie=M[q];if(ie===null)continue;M[q]=null,y[q].disconnect(ie)}j=null,I=null,S.reset();for(let q in f)delete f[q];if(e.setRenderTarget(T),u=null,d=null,h=null,i=null,A=null,Fe.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(w.width,w.height,!1),x!==null){let q=x.camera;q.fov=x.fov,q.zoom=x.zoom,q.updateProjectionMatrix(),x=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){if(s=q,n.isPresenting===!0)Ee("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){if(a=q,n.isPresenting===!0)Ee("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){if(h===null&&g)h=new XRWebGLBinding(i,t);return h},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(T=e.getRenderTarget(),i.addEventListener("select",X),i.addEventListener("selectstart",X),i.addEventListener("selectend",X),i.addEventListener("squeeze",X),i.addEventListener("squeezestart",X),i.addEventListener("squeezeend",X),i.addEventListener("end",J),i.addEventListener("inputsourceschange",H),p.xrCompatible!==!0)await t.makeXRCompatible();if(R=e.getPixelRatio(),e.getSize(w),!(g&&("createProjectionLayer"in XRWebGLBinding.prototype))){let re={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),A=new $t(u.framebufferWidth,u.framebufferHeight,{format:In,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let re=null,Ce=null,Le=null;if(p.depth)Le=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=p.stencil?wi:Ei,Ce=p.stencil?us:oi;let Ae={colorFormat:t.RGBA8,depthFormat:Le,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(Ae),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),A=new $t(d.textureWidth,d.textureHeight,{format:In,type:vn,depthTexture:new Ii(d.textureWidth,d.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(o),l=null,r=await i.requestReferenceSpace(a),Fe.setContext(i),Fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function H(q){for(let ie=0;ie<q.removed.length;ie++){let re=q.removed[ie],Ce=M.indexOf(re);if(Ce>=0)M[Ce]=null,y[Ce].disconnect(re)}for(let ie=0;ie<q.added.length;ie++){let re=q.added[ie],Ce=M.indexOf(re);if(Ce===-1){for(let Ae=0;Ae<y.length;Ae++)if(Ae>=M.length){M.push(re),Ce=Ae;break}else if(M[Ae]===null){M[Ae]=re,Ce=Ae;break}if(Ce===-1)break}let Le=y[Ce];if(Le)Le.connect(re)}}let ne=new U,z=new U;function W(q,ie,re){ne.setFromMatrixPosition(ie.matrixWorld),z.setFromMatrixPosition(re.matrixWorld);let Ce=ne.distanceTo(z),Le=ie.projectionMatrix.elements,Ae=re.projectionMatrix.elements,Tt=Le[14]/(Le[10]-1),Xe=Le[14]/(Le[10]+1),Ye=(Le[9]+1)/Le[5],tt=(Le[9]-1)/Le[5],Ze=(Le[8]-1)/Le[0],Dt=(Ae[8]+1)/Ae[0],dt=Tt*Ze,Vt=Tt*Dt,Et=Ce/(-Ze+Dt),wt=Et*-Ze;if(ie.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(wt),q.translateZ(Et),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Le[10]===-1)q.projectionMatrix.copy(ie.projectionMatrix),q.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{let P=Tt+Et,Wt=Xe+Et,je=dt-wt,pt=Vt+(Ce-wt),b=Ye*Xe/Wt*P,_=tt*Xe/Wt*P;q.projectionMatrix.makePerspective(je,pt,b,_,P,Wt),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Q(q,ie){if(ie===null)q.matrixWorld.copy(q.matrix);else q.matrixWorld.multiplyMatrices(ie.matrixWorld,q.matrix);q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;let{near:ie,far:re}=q;if(S.texture!==null){if(S.depthNear>0)ie=S.depthNear;if(S.depthFar>0)re=S.depthFar}if(F.near=k.near=E.near=ie,F.far=k.far=E.far=re,j!==F.near||I!==F.far)i.updateRenderState({depthNear:F.near,depthFar:F.far}),j=F.near,I=F.far;F.layers.mask=q.layers.mask|6,E.layers.mask=F.layers.mask&-5,k.layers.mask=F.layers.mask&-3;let Ce=q.parent,Le=F.cameras;Q(F,Ce);for(let Ae=0;Ae<Le.length;Ae++)Q(Le[Ae],Ce);if(Le.length===2)W(F,E,k);else F.projectionMatrix.copy(E.projectionMatrix);if(x===null&&q.isPerspectiveCamera)x={camera:q,fov:q.fov,zoom:q.zoom};we(q,F,Ce)};function we(q,ie,re){if(re===null)q.matrix.copy(ie.matrixWorld);else q.matrix.copy(re.matrixWorld),q.matrix.invert(),q.matrix.multiply(ie.matrixWorld);if(q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(ie.projectionMatrix),q.projectionMatrixInverse.copy(ie.projectionMatrixInverse),q.isPerspectiveCamera)q.fov=Mi*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1}this.getCamera=function(){return F},this.getFoveation=function(){if(d===null&&u===null)return;return o},this.setFoveation=function(q){if(o=q,d!==null)d.fixedFoveation=q;if(u!==null&&u.fixedFoveation!==void 0)u.fixedFoveation=q},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(F)},this.getCameraTexture=function(q){return f[q]};let Me=null;function st(q,ie){if(c=ie.getViewerPose(l||r),m=ie,c!==null){let re=c.views;if(u!==null)e.setRenderTargetFramebuffer(A,u.framebuffer),e.setRenderTarget(A);let Ce=!1;if(re.length!==F.cameras.length)F.cameras.length=0,Ce=!0;for(let Xe=0;Xe<re.length;Xe++){let Ye=re[Xe],tt=null;if(u!==null)tt=u.getViewport(Ye);else{let Dt=h.getViewSubImage(d,Ye);if(tt=Dt.viewport,Xe===0)e.setRenderTargetTextures(A,Dt.colorTexture,Dt.depthStencilTexture),e.setRenderTarget(A)}let Ze=D[Xe];if(Ze===void 0)Ze=new At,Ze.layers.enable(Xe),Ze.viewport=new it,D[Xe]=Ze;if(Ze.matrix.fromArray(Ye.transform.matrix),Ze.matrix.decompose(Ze.position,Ze.quaternion,Ze.scale),Ze.projectionMatrix.fromArray(Ye.projectionMatrix),Ze.projectionMatrixInverse.copy(Ze.projectionMatrix).invert(),Ze.viewport.set(tt.x,tt.y,tt.width,tt.height),Xe===0)F.matrix.copy(Ze.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale);if(Ce===!0)F.cameras.push(Ze)}let Le=i.enabledFeatures;if(Le&&Le.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&g){h=n.getBinding();let Xe=h.getDepthInformation(re[0]);if(Xe&&Xe.isValid&&Xe.texture)S.init(Xe,i.renderState)}if(Le&&Le.includes("camera-access")&&g){e.state.unbindTexture(),h=n.getBinding();for(let Xe=0;Xe<re.length;Xe++){let Ye=re[Xe].camera;if(Ye){let tt=f[Ye];if(!tt)tt=new ca,f[Ye]=tt;let Ze=h.getCameraImage(Ye);tt.sourceTexture=Ze}}}}for(let re=0;re<y.length;re++){let Ce=M[re],Le=y[re];if(Ce!==null&&Le!==void 0)Le.update(Ce,ie,l||r)}if(Me)Me(q,ie);if(ie.detectedPlanes)n.dispatchEvent({type:"planesdetected",data:ie});m=null}let Fe=new Tu;Fe.setAnimationLoop(st),this.setAnimationLoop=function(q){Me=q},this.dispose=function(){}}}var E_=new Oe,Ou=new Ue;Ou.set(-1,0,0,0,1,0,0,0,1);function w_(e,t){function n(f,p){if(f.matrixAutoUpdate===!0)f.updateMatrix();p.value.copy(f.matrix)}function i(f,p){if(p.color.getRGB(f.fogColor.value,al(e)),p.isFog)f.fogNear.value=p.near,f.fogFar.value=p.far;else if(p.isFogExp2)f.fogDensity.value=p.density}function s(f,p,T,A,y){if(p.isNodeMaterial)p.uniformsNeedUpdate=!1;else if(p.isMeshBasicMaterial)r(f,p);else if(p.isMeshLambertMaterial){if(r(f,p),p.envMap)f.envMapIntensity.value=p.envMapIntensity}else if(p.isMeshToonMaterial)r(f,p),d(f,p);else if(p.isMeshPhongMaterial){if(r(f,p),h(f,p),p.envMap)f.envMapIntensity.value=p.envMapIntensity}else if(p.isMeshStandardMaterial){if(r(f,p),u(f,p),p.isMeshPhysicalMaterial)m(f,p,y)}else if(p.isMeshMatcapMaterial)r(f,p),g(f,p);else if(p.isMeshDepthMaterial)r(f,p);else if(p.isMeshDistanceMaterial)r(f,p),S(f,p);else if(p.isMeshNormalMaterial)r(f,p);else if(p.isLineBasicMaterial){if(a(f,p),p.isLineDashedMaterial)o(f,p)}else if(p.isPointsMaterial)l(f,p,T,A);else if(p.isSpriteMaterial)c(f,p);else if(p.isShadowMaterial)f.color.value.copy(p.color),f.opacity.value=p.opacity;else if(p.isShaderMaterial)p.uniformsNeedUpdate=!1}function r(f,p){if(f.opacity.value=p.opacity,p.color)f.diffuse.value.copy(p.color);if(p.emissive)f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity);if(p.map)f.map.value=p.map,n(p.map,f.mapTransform);if(p.alphaMap)f.alphaMap.value=p.alphaMap,n(p.alphaMap,f.alphaMapTransform);if(p.bumpMap){if(f.bumpMap.value=p.bumpMap,n(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Xt)f.bumpScale.value*=-1}if(p.normalMap){if(f.normalMap.value=p.normalMap,n(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Xt)f.normalScale.value.negate()}if(p.displacementMap)f.displacementMap.value=p.displacementMap,n(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias;if(p.emissiveMap)f.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,f.emissiveMapTransform);if(p.specularMap)f.specularMap.value=p.specularMap,n(p.specularMap,f.specularMapTransform);if(p.alphaTest>0)f.alphaTest.value=p.alphaTest;let T=t.get(p),{envMap:A,envMapRotation:y}=T;if(A){if(f.envMap.value=A,f.envMapRotation.value.setFromMatrix4(E_.makeRotationFromEuler(y)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1)f.envMapRotation.value.premultiply(Ou);f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio}if(p.lightMap)f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,f.lightMapTransform);if(p.aoMap)f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,f.aoMapTransform)}function a(f,p){if(f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map)f.map.value=p.map,n(p.map,f.mapTransform)}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,T,A){if(f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*T,f.scale.value=A*0.5,p.map)f.map.value=p.map,n(p.map,f.uvTransform);if(p.alphaMap)f.alphaMap.value=p.alphaMap,n(p.alphaMap,f.alphaMapTransform);if(p.alphaTest>0)f.alphaTest.value=p.alphaTest}function c(f,p){if(f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map)f.map.value=p.map,n(p.map,f.mapTransform);if(p.alphaMap)f.alphaMap.value=p.alphaMap,n(p.alphaMap,f.alphaMapTransform);if(p.alphaTest>0)f.alphaTest.value=p.alphaTest}function h(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,0.0001)}function d(f,p){if(p.gradientMap)f.gradientMap.value=p.gradientMap}function u(f,p){if(f.metalness.value=p.metalness,p.metalnessMap)f.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,f.metalnessMapTransform);if(f.roughness.value=p.roughness,p.roughnessMap)f.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,f.roughnessMapTransform);if(p.envMap)f.envMapIntensity.value=p.envMapIntensity}function m(f,p,T){if(f.ior.value=p.ior,p.sheen>0){if(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap)f.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,f.sheenColorMapTransform);if(p.sheenRoughnessMap)f.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,f.sheenRoughnessMapTransform)}if(p.clearcoat>0){if(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap)f.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,f.clearcoatMapTransform);if(p.clearcoatRoughnessMap)f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform);if(p.clearcoatNormalMap){if(f.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Xt)f.clearcoatNormalScale.value.negate()}}if(p.dispersion>0)f.dispersion.value=p.dispersion;if(p.retroreflectivity>0)f.retroreflectivity.value=p.retroreflectivity;if(p.iridescence>0){if(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap)f.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,f.iridescenceMapTransform);if(p.iridescenceThicknessMap)f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform)}if(p.transmission>0){if(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=T.texture,f.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap)f.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,f.transmissionMapTransform);if(f.thickness.value=p.thickness,p.thicknessMap)f.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,f.thicknessMapTransform);f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)}if(p.anisotropy>0){if(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap)f.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,f.anisotropyMapTransform)}if(f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap)f.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,f.specularColorMapTransform);if(p.specularIntensityMap)f.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,f.specularIntensityMapTransform)}function g(f,p){if(p.matcap)f.matcap.value=p.matcap}function S(f,p){let T=t.get(p).light;f.referencePosition.value.setFromMatrixPosition(T.matrixWorld),f.nearDistance.value=T.shadow.camera.near,f.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function A_(e,t,n,i){let s={},r={},a=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,M){let w=M.program;i.uniformBlockBinding(y,w)}function c(y,M){let w=s[y.id];if(w===void 0)f(y),w=h(y),s[y.id]=w,y.addEventListener("dispose",T);let R=M.program;i.updateUBOMapping(y,R);let x=t.render.frame;if(r[y.id]!==x)u(y),r[y.id]=x}function h(y){let M=d();y.__bindingPointIndex=M;let w=e.createBuffer(),{__size:R,usage:x}=y;return e.bindBuffer(e.UNIFORM_BUFFER,w),e.bufferData(e.UNIFORM_BUFFER,R,x),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,M,w),w}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ne("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let M=s[y.id],{uniforms:w,__cache:R}=y;e.bindBuffer(e.UNIFORM_BUFFER,M);for(let x=0,E=w.length;x<E;x++){let k=w[x];if(Array.isArray(k))for(let D=0,F=k.length;D<F;D++)m(k[D],x,D,R);else m(k,x,0,R)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function m(y,M,w,R){if(S(y,M,w,R)===!0){let{__offset:x,value:E}=y;if(Array.isArray(E)){let k=0;for(let D=0;D<E.length;D++){let F=E[D],j=p(F);if(g(F,y.__data,k),typeof F!=="number"&&typeof F!=="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F))k+=j.storage/Float32Array.BYTES_PER_ELEMENT}}else g(E,y.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,x,y.__data)}}function g(y,M,w){if(typeof y==="number"||typeof y==="boolean")M[0]=y;else if(y.isMatrix3)M[0]=y.elements[0],M[1]=y.elements[1],M[2]=y.elements[2],M[3]=0,M[4]=y.elements[3],M[5]=y.elements[4],M[6]=y.elements[5],M[7]=0,M[8]=y.elements[6],M[9]=y.elements[7],M[10]=y.elements[8],M[11]=0;else if(ArrayBuffer.isView(y))M.set(new y.constructor(y.buffer,y.byteOffset,M.length));else y.toArray(M,w)}function S(y,M,w,R){let x=y.value,E=M+"_"+w;if(R[E]===void 0){if(typeof x==="number"||typeof x==="boolean")R[E]=x;else if(ArrayBuffer.isView(x))R[E]=x.slice();else R[E]=x.clone();return!0}else{let k=R[E];if(typeof x==="number"||typeof x==="boolean"){if(k!==x)return R[E]=x,!0}else if(ArrayBuffer.isView(x))return!0;else if(k.equals(x)===!1)return k.copy(x),!0}return!1}function f(y){let M=y.uniforms,w=0,R=16;for(let E=0,k=M.length;E<k;E++){let D=Array.isArray(M[E])?M[E]:[M[E]];for(let F=0,j=D.length;F<j;F++){let I=D[F],X=Array.isArray(I.value)?I.value:[I.value];for(let J=0,H=X.length;J<H;J++){let ne=X[J],z=p(ne),W=w%R,Q=W%z.boundary,we=W+Q;if(w+=Q,we!==0&&R-we<z.storage)w+=R-we;I.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=w,w+=z.storage}}}let x=w%R;if(x>0)w+=R-x;return y.__size=w,y.__cache={},this}function p(y){let M={boundary:0,storage:0};if(typeof y==="number"||typeof y==="boolean")M.boundary=4,M.storage=4;else if(y.isVector2)M.boundary=8,M.storage=8;else if(y.isVector3||y.isColor)M.boundary=16,M.storage=12;else if(y.isVector4)M.boundary=16,M.storage=16;else if(y.isMatrix3)M.boundary=48,M.storage=48;else if(y.isMatrix4)M.boundary=64,M.storage=64;else if(y.isTexture)Ee("WebGLRenderer: Texture samplers can not be part of an uniforms group.");else if(ArrayBuffer.isView(y))M.boundary=16,M.storage=y.byteLength;else Ee("WebGLRenderer: Unsupported uniform value type.",y);return M}function T(y){let M=y.target;M.removeEventListener("dispose",T);let w=a.indexOf(M.__bindingPointIndex);a.splice(w,1),e.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function A(){for(let y in s)e.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:A}}var R_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ln=null;function C_(){if(Ln===null)Ln=new Ys(R_,16,16,Ai,Cn),Ln.name="DFG_LUT",Ln.minFilter=Nt,Ln.magFilter=Nt,Ln.wrapS=cs,Ln.wrapT=cs,Ln.generateMipmaps=!1,Ln.needsUpdate=!0;return Ln}class Nl{constructor(e={}){let{canvas:t=Wh(),context:n=null,depth:i=!0,stencil:s=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:u=vn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=r;let g=u,S=new Set([xo,_o,go]),f=new Set([vn,oi,zs,us,po,mo]),p=new Uint32Array(4),T=new Int32Array(4),A=new U,y=null,M=null,w=[],R=[],x=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=_n,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let E=this,k=!1,D=null,F=null,j=null,I=null;this._outputColorSpace=li;let X=0,J=0,H=null,ne=-1,z=null,W=new it,Q=new it,we=null,Me=new Ie(0),st=0,{width:Fe,height:q}=t,ie=1,re=null,Ce=null,Le=new it(0,0,Fe,q),Ae=new it(0,0,Fe,q),Tt=!1,Xe=new Ks,Ye=!1,tt=!1,Ze=new Oe,Dt=new U,dt=new it,Vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Et=!1;function wt(){return H===null?ie:1}let P=n;function Wt(v,L){return t.getContext(v,L)}let je,pt,b,_,C,G,te,ae,ce,Y,K,me,Te,he,se,Re,Pe,Je,N,oe,Z,le,ge;try{let v={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:h};if("setAttribute"in t)t.setAttribute("data-engine",`three.js r${Jc}`);if(t.addEventListener("webglcontextlost",Be,!1),t.addEventListener("webglcontextrestored",ct,!1),t.addEventListener("webglcontextcreationerror",Qe,!1),P===null){if(P=Wt("webgl2",v),P===null)if(Wt("webgl2"))throw Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.");else throw Error("THREE.WebGLRenderer: Error creating WebGL context.")}ee()}catch(v){throw t.removeEventListener("webglcontextlost",Be,!1),t.removeEventListener("webglcontextrestored",ct,!1),t.removeEventListener("webglcontextcreationerror",Qe,!1),Ne("WebGLRenderer: "+v.message),v}function ee(){if(je=new Fg(P),je.init(),Z=new M_(P,je),pt=new wg(P,je,e,Z),b=new y_(P,je),pt.reversedDepthBuffer&&d)b.buffers.depth.setReversed(!0);F=P.createFramebuffer(),j=P.createFramebuffer(),I=P.createFramebuffer(),_=new zg(P),C=new a_,G=new S_(P,je,b,C,pt,Z,_),te=new Ug(E),ae=new Hf(P),le=new Tg(P,ae),ce=new Og(P,ae,_,le),Y=new Hg(P,ce,ae,le,_),Je=new kg(P,pt,G),se=new Ag(C),K=new r_(E,te,je,pt,le,se),me=new w_(E,C),Te=new l_,he=new p_(je),Pe=new bg(E,te,b,Y,m,o),Re=new v_(E,Y,pt),ge=new A_(P,_,pt,b),N=new Eg(P,je,_),oe=new Bg(P,je,_),_.programs=K.programs,E.capabilities=pt,E.extensions=je,E.properties=C,E.renderLists=Te,E.shadowMap=Re,E.state=b,E.info=_}if(g!==vn)x=new Vg(g,t.width,t.height,a,i,s);let de=new Fu(E,P);this.xr=de,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let v=je.get("WEBGL_lose_context");if(v)v.loseContext()},this.forceContextRestore=function(){let v=je.get("WEBGL_lose_context");if(v)v.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(v){if(v===void 0)return;ie=v,this.setSize(Fe,q,!1)},this.getSize=function(v){return v.set(Fe,q)},this.setSize=function(v,L,V=!0){if(de.isPresenting){Ee("WebGLRenderer: Can't change size while VR device is presenting.");return}if(Fe=v,q=L,t.width=Math.floor(v*ie),t.height=Math.floor(L*ie),V===!0)t.style.width=v+"px",t.style.height=L+"px";if(x!==null)x.setSize(t.width,t.height);this.setViewport(0,0,v,L)},this.getDrawingBufferSize=function(v){return v.set(Fe*ie,q*ie).floor()},this.setDrawingBufferSize=function(v,L,V){Fe=v,q=L,ie=V,t.width=Math.floor(v*V),t.height=Math.floor(L*V),this.setViewport(0,0,v,L)},this.setEffects=function(v){if(g===vn){Ne("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let L=0;L<v.length;L++)if(v[L].isOutputPass===!0){Ee("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}x.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(W)},this.getViewport=function(v){return v.copy(Le)},this.setViewport=function(v,L,V,O){if(v.isVector4)Le.set(v.x,v.y,v.z,v.w);else Le.set(v,L,V,O);b.viewport(W.copy(Le).multiplyScalar(ie).round())},this.getScissor=function(v){return v.copy(Ae)},this.setScissor=function(v,L,V,O){if(v.isVector4)Ae.set(v.x,v.y,v.z,v.w);else Ae.set(v,L,V,O);b.scissor(Q.copy(Ae).multiplyScalar(ie).round())},this.getScissorTest=function(){return Tt},this.setScissorTest=function(v){b.setScissorTest(Tt=v)},this.setOpaqueSort=function(v){re=v},this.setTransparentSort=function(v){Ce=v},this.getClearColor=function(v){return v.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(v=!0,L=!0,V=!0){let O=0;if(v){let B=!1;if(H!==null){let pe=H.texture.format;B=S.has(pe)}if(B){let pe=H.texture.type,xe=f.has(pe),fe=Pe.getClearColor(),ye=Pe.getClearAlpha(),{r:be,g:ze,b:Ve}=fe;if(xe)p[0]=be,p[1]=ze,p[2]=Ve,p[3]=ye,P.clearBufferuiv(P.COLOR,0,p);else T[0]=be,T[1]=ze,T[2]=Ve,T[3]=ye,P.clearBufferiv(P.COLOR,0,T)}else O|=P.COLOR_BUFFER_BIT}if(L)O|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0);if(V)O|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295);if(O!==0)P.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),D=v},this.dispose=function(){t.removeEventListener("webglcontextlost",Be,!1),t.removeEventListener("webglcontextrestored",ct,!1),t.removeEventListener("webglcontextcreationerror",Qe,!1),Pe.dispose(),Te.dispose(),he.dispose(),C.dispose(),te.dispose(),Y.dispose(),le.dispose(),ge.dispose(),K.dispose(),de.dispose(),de.removeEventListener("sessionstart",nc),de.removeEventListener("sessionend",ic),gi.stop()};function Be(v){v.preventDefault(),Us("WebGLRenderer: Context Lost."),k=!0}function ct(){Us("WebGLRenderer: Context Restored."),k=!1;let v=_.autoReset,L=Re.enabled,V=Re.autoUpdate,O=Re.needsUpdate,B=Re.type;ee(),_.autoReset=v,Re.enabled=L,Re.autoUpdate=V,Re.needsUpdate=O,Re.type=B}function Qe(v){Ne("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Mn(v){let L=v.target;L.removeEventListener("dispose",Mn),Fn(L)}function Fn(v){Pd(v),C.remove(v)}function Pd(v){let L=C.get(v).programs;if(L!==void 0){if(L.forEach(function(V){K.releaseProgram(V)}),v.isShaderMaterial)K.releaseShaderCache(v)}}this.renderBufferDirect=function(v,L,V,O,B,pe){if(L===null)L=Vt;let xe=B.isMesh&&B.matrixWorld.determinantAffine()<0,fe=Dd(v,L,V,O,B);b.setMaterial(O,xe);let ye=V.index,be=1;if(O.wireframe===!0){if(ye=ce.getWireframeAttribute(V),ye===void 0)return;be=2}let ze=V.drawRange,Ve=V.attributes.position,Se=ze.start*be,et=(ze.start+ze.count)*be;if(pe!==null)Se=Math.max(Se,pe.start*be),et=Math.min(et,(pe.start+pe.count)*be);if(ye!==null)Se=Math.max(Se,0),et=Math.min(et,ye.count);else if(Ve!==void 0&&Ve!==null)Se=Math.max(Se,0),et=Math.min(et,Ve.count);let St=et-Se;if(St<0||St===1/0)return;le.setup(B,O,fe,V,ye);let ft,ot=N;if(ye!==null)ft=ae.get(ye),ot=oe,ot.setIndex(ft);if(B.isMesh)if(O.wireframe===!0)b.setLineWidth(O.wireframeLinewidth*wt()),ot.setMode(P.LINES);else ot.setMode(P.TRIANGLES);else if(B.isLine){let Ut=O.linewidth;if(Ut===void 0)Ut=1;if(b.setLineWidth(Ut*wt()),B.isLineSegments)ot.setMode(P.LINES);else if(B.isLineLoop)ot.setMode(P.LINE_LOOP);else ot.setMode(P.LINE_STRIP)}else if(B.isPoints)ot.setMode(P.POINTS);else if(B.isSprite)ot.setMode(P.TRIANGLES);if(B.isBatchedMesh)if(!je.get("WEBGL_multi_draw")){let{_multiDrawStarts:Ut,_multiDrawCounts:_e,_multiDrawCount:kt}=B,Ke=ye?ae.get(ye).bytesPerElement:1,sn=C.get(O).currentProgram.getUniforms();for(let bn=0;bn<kt;bn++)sn.setValue(P,"_gl_DrawID",bn),ot.render(Ut[bn]/Ke,_e[bn])}else ot.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)ot.renderInstances(Se,St,B.count);else if(V.isInstancedBufferGeometry){let Ut=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,_e=Math.min(V.instanceCount,Ut);ot.renderInstances(Se,St,_e)}else ot.render(Se,St)};function tc(v,L,V,O){if(D!==null&&v.isNodeMaterial)D.setObject(O,v);if(Ye===!0)se.setState(v,V,!1);if(v.transparent===!0&&v.side===Bt&&v.forceSinglePass===!1)v.side=Xt,v.needsUpdate=!0,ur(v,L,O),v.side=ai,v.needsUpdate=!0,ur(v,L,O),v.side=Bt;else ur(v,L,O)}this.compile=function(v,L,V=null){if(V===null)V=v;if(D!==null)D.renderStart(v,L,V);if(M=he.get(V),M.init(L),R.push(M),V.traverseVisible(function(B){if(B.isLight&&B.layers.test(L.layers)){if(M.pushLight(B),B.castShadow)M.pushShadow(B)}}),v!==V)v.traverseVisible(function(B){if(B.isLight&&B.layers.test(L.layers)){if(M.pushLight(B),B.castShadow)M.pushShadow(B)}});if(M.setupLights(),D!==null)D.updateLights(M.state.lightsArray);if(tt=this.localClippingEnabled,Ye=se.init(this.clippingPlanes,tt),Ye===!0)se.setGlobalState(this.clippingPlanes,L);if(D!==null)Re.render(M.state.shadowsArray,V,L);let O=new Set;if(v.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let pe=B.material;if(pe)if(Array.isArray(pe))for(let xe=0;xe<pe.length;xe++){let fe=pe[xe];tc(fe,V,L,B),O.add(fe)}else tc(pe,V,L,B),O.add(pe)}),M=R.pop(),D!==null)D.renderEnd();return O},this.compileAsync=function(v,L,V=null){let O=this.compile(v,L,V);return new Promise((B)=>{function pe(){if(O.forEach(function(xe){let ye=C.get(xe).currentProgram;if(ye===void 0||ye.isReady())O.delete(xe)}),O.size===0){B(v);return}setTimeout(pe,10)}if(je.get("KHR_parallel_shader_compile")!==null)pe();else setTimeout(pe,10)})};let wa=null;function Ld(v){if(wa)wa(v)}function nc(){gi.stop()}function ic(){gi.start()}let gi=new Tu;if(gi.setAnimationLoop(Ld),typeof self<"u")gi.setContext(self);this.setAnimationLoop=function(v){wa=v,de.setAnimationLoop(v),v===null?gi.stop():gi.start()},de.addEventListener("sessionstart",nc),de.addEventListener("sessionend",ic),this.render=function(v,L){if(L!==void 0&&L.isCamera!==!0){Ne("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;if(D!==null)D.renderStart(v,L);let V=de.enabled===!0&&de.isPresenting===!0,O=x!==null&&(H===null||V)&&x.begin(E,H);if(v.matrixWorldAutoUpdate===!0)v.updateMatrixWorld();if(L.parent===null&&L.matrixWorldAutoUpdate===!0)L.updateMatrixWorld();if(de.enabled===!0&&de.isPresenting===!0&&(x===null||x.isCompositing()===!1)){if(de.cameraAutoUpdate===!0)de.updateCamera(L);L=de.getCamera()}if(v.isScene===!0)v.onBeforeRender(E,v,L,H);if(M=he.get(v,R.length),M.init(L),M.state.textureUnits=G.getTextureUnits(),R.push(M),Ze.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Xe.setFromProjectionMatrix(Ze,el,L.reversedDepth),tt=this.localClippingEnabled,Ye=se.init(this.clippingPlanes,tt),y=Te.get(v,w.length),y.init(),w.push(y),de.enabled===!0&&de.isPresenting===!0){let xe=E.xr.getDepthSensingMesh();if(xe!==null)Aa(xe,L,-1/0,E.sortObjects)}if(Aa(v,L,0,E.sortObjects),y.finish(),D!==null)D.updateLights(M.state.lightsArray);if(E.sortObjects===!0)y.sort(re,Ce);if(Et=de.enabled===!1||de.isPresenting===!1||de.hasDepthSensing()===!1,Et)Pe.addToRenderList(y,v);if(this.info.render.frame++,this.info.autoReset===!0)this.info.reset();if(Ye===!0)se.beginShadows();let B=M.state.shadowsArray;if(Re.render(B,v,L),Ye===!0)se.endShadows();if((O&&x.hasRenderPass())===!1){let xe=y.opaque,fe=y.transmissive;if(M.setupLights(),L.isArrayCamera){let ye=L.cameras;if(fe.length>0)for(let be=0,ze=ye.length;be<ze;be++){let Ve=ye[be];rc(xe,fe,v,Ve)}if(Et)Pe.render(v);for(let be=0,ze=ye.length;be<ze;be++){let Ve=ye[be];sc(y,v,Ve,Ve.viewport)}}else{if(fe.length>0)rc(xe,fe,v,L);if(Et)Pe.render(v);sc(y,v,L)}}if(H!==null&&J===0)G.updateMultisampleRenderTarget(H),G.updateRenderTargetMipmap(H);if(O)x.end(E);if(v.isScene===!0)v.onAfterRender(E,v,L);if(le.resetDefaultState(),ne=-1,z=null,R.pop(),R.length>0){if(M=R[R.length-1],G.setTextureUnits(M.state.textureUnits),Ye===!0)se.setGlobalState(E.clippingPlanes,M.state.camera)}else M=null;if(w.pop(),w.length>0)y=w[w.length-1];else y=null;if(D!==null)D.renderEnd()};function Aa(v,L,V,O){if(v.visible===!1)return;if(v.layers.test(L.layers)){if(v.isGroup)V=v.renderOrder;else if(v.isLOD){if(v.autoUpdate===!0)v.update(L)}else if(v.isLightProbeGrid)M.pushLightProbeGrid(v);else if(v.isLight){if(M.pushLight(v),v.castShadow)M.pushShadow(v)}else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Xe)){if(O)dt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ze);let xe=Y.update(v),fe=v.material;if(fe.visible)y.push(v,xe,fe,V,dt.z,null,L)}}else if(v.isMesh||v.isLine||v.isPoints){if(!v.frustumCulled||v.intersectsFrustum(Xe)){let xe=Y.update(v),fe=v.material;if(O){if(v.boundingSphere!==void 0){if(v.boundingSphere===null)v.computeBoundingSphere();dt.copy(v.boundingSphere.center)}else{if(xe.boundingSphere===null)xe.computeBoundingSphere();dt.copy(xe.boundingSphere.center)}dt.applyMatrix4(v.matrixWorld).applyMatrix4(Ze)}if(Array.isArray(fe)){let ye=xe.groups;for(let be=0,ze=ye.length;be<ze;be++){let Ve=ye[be],Se=fe[Ve.materialIndex];if(Se&&Se.visible)y.push(v,xe,Se,V,dt.z,Ve,L)}}else if(fe.visible)y.push(v,xe,fe,V,dt.z,null,L)}}}let pe=v.children;for(let xe=0,fe=pe.length;xe<fe;xe++)Aa(pe[xe],L,V,O)}function sc(v,L,V,O){let{opaque:B,transmissive:pe,transparent:xe}=v;if(M.setupLightsView(V),Ye===!0)se.setGlobalState(E.clippingPlanes,V);if(O)b.viewport(W.copy(O));if(B.length>0)hr(B,L,V);if(pe.length>0)hr(pe,L,V);if(xe.length>0)hr(xe,L,V);b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function rc(v,L,V,O){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[O.id]===void 0){let Se=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[O.id]=new $t(1,1,{generateMipmaps:!0,type:Se?Cn:vn,minFilter:Rn,samples:Math.max(4,pt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:He.workingColorSpace})}let pe=M.state.transmissionRenderTarget[O.id],xe=O.viewport||W;pe.setSize(xe.z*E.transmissionResolutionScale,xe.w*E.transmissionResolutionScale);let fe=E.getRenderTarget(),ye=E.getActiveCubeFace(),be=E.getActiveMipmapLevel();if(E.setRenderTarget(pe),E.getClearColor(Me),st=E.getClearAlpha(),st<1)E.setClearColor(16777215,0.5);if(E.clear(),Et)Pe.render(V);let ze=E.toneMapping;E.toneMapping=_n;let Ve=O.viewport;if(O.viewport!==void 0)O.viewport=void 0;if(M.setupLightsView(O),Ye===!0)se.setGlobalState(E.clippingPlanes,O);if(hr(v,V,O),G.updateMultisampleRenderTarget(pe),G.updateRenderTargetMipmap(pe),je.has("WEBGL_multisampled_render_to_texture")===!1){let Se=!1;for(let et=0,St=L.length;et<St;et++){let ft=L[et],{object:ot,geometry:Ut,material:_e,group:kt}=ft;if(_e.side===Bt&&ot.layers.test(O.layers)){let Ke=_e.side;_e.side=Xt,_e.needsUpdate=!0,ac(ot,V,O,Ut,_e,kt),_e.side=Ke,_e.needsUpdate=!0,Se=!0}}if(Se===!0)G.updateMultisampleRenderTarget(pe),G.updateRenderTargetMipmap(pe)}if(E.setRenderTarget(fe,ye,be),E.setClearColor(Me,st),Ve!==void 0)O.viewport=Ve;E.toneMapping=ze}function hr(v,L,V){let O=L.isScene===!0?L.overrideMaterial:null;for(let B=0,pe=v.length;B<pe;B++){let xe=v[B],{object:fe,geometry:ye,group:be}=xe,ze=xe.material;if(ze.allowOverride===!0&&O!==null)ze=O;if(fe.layers.test(V.layers))ac(fe,L,V,ye,ze,be)}}function ac(v,L,V,O,B,pe){if(D!==null&&B.isNodeMaterial)D.setObject(v,B);if(v.onBeforeRender(E,L,V,O,B,pe),v.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),B.onBeforeRender(E,L,V,O,v,pe),B.transparent===!0&&B.side===Bt&&B.forceSinglePass===!1)B.side=Xt,B.needsUpdate=!0,E.renderBufferDirect(V,L,O,B,v,pe),B.side=ai,B.needsUpdate=!0,E.renderBufferDirect(V,L,O,B,v,pe),B.side=Bt;else E.renderBufferDirect(V,L,O,B,v,pe);v.onAfterRender(E,L,V,O,B,pe)}function ur(v,L,V){if(L.isScene!==!0)L=Vt;let O=C.get(v),B=M.state.lights,pe=M.state.shadowsArray,xe=B.state.version,fe=K.getParameters(v,B.state,pe,L,V,M.state.lightProbeGridArray),ye=K.getProgramCacheKey(fe),be=O.programs;O.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,O.fog=L.fog;let ze=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;if(O.envMap=te.get(v.envMap||O.environment,ze),O.envMapRotation=O.environment!==null&&v.envMap===null?L.environmentRotation:v.envMapRotation,be===void 0)v.addEventListener("dispose",Mn),be=new Map,O.programs=be;let Ve=be.get(ye);if(Ve!==void 0){if(O.currentProgram===Ve&&O.lightsStateVersion===xe)return lc(v,fe),Ve}else{if(fe.uniforms=K.getUniforms(v),D!==null&&v.isNodeMaterial)D.build(v,V,fe);v.onBeforeCompile(fe,E),Ve=K.acquireProgram(fe,ye),be.set(ye,Ve),O.uniforms=fe.uniforms}let Se=O.uniforms;if(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)Se.clippingPlanes=se.uniform;if(lc(v,fe),O.needsLights=Fd(v),O.lightsStateVersion=xe,O.needsLights)Se.ambientLightColor.value=B.state.ambient,Se.lightProbe.value=B.state.probe,Se.sunLights.value=B.state.sun,Se.sunLightShadows.value=B.state.sunShadow,Se.directionalLights.value=B.state.directional,Se.directionalLightShadows.value=B.state.directionalShadow,Se.spotLights.value=B.state.spot,Se.spotLightShadows.value=B.state.spotShadow,Se.rectAreaLights.value=B.state.rectArea,Se.ltc_1.value=B.state.rectAreaLTC1,Se.ltc_2.value=B.state.rectAreaLTC2,Se.pointLights.value=B.state.point,Se.pointLightShadows.value=B.state.pointShadow,Se.hemisphereLights.value=B.state.hemi,Se.sunShadowMatrix.value=B.state.sunShadowMatrix,Se.sunShadowCascade.value=B.state.sunShadowCascade,Se.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Se.spotLightMatrix.value=B.state.spotLightMatrix,Se.spotLightMap.value=B.state.spotLightMap,Se.pointShadowMatrix.value=B.state.pointShadowMatrix;return O.lightProbeGrid=M.state.lightProbeGridArray.length>0,O.currentProgram=Ve,O.uniformsList=null,Ve}function oc(v){if(v.uniformsList===null){let L=v.currentProgram.getUniforms();v.uniformsList=rr.seqWithValue(L.seq,v.uniforms)}return v.uniformsList}function lc(v,L){let V=C.get(v);V.outputColorSpace=L.outputColorSpace,V.batching=L.batching,V.batchingColor=L.batchingColor,V.instancing=L.instancing,V.instancingColor=L.instancingColor,V.instancingMorph=L.instancingMorph,V.skinning=L.skinning,V.morphTargets=L.morphTargets,V.morphNormals=L.morphNormals,V.morphColors=L.morphColors,V.morphTargetsCount=L.morphTargetsCount,V.numClippingPlanes=L.numClippingPlanes,V.numIntersection=L.numClipIntersection,V.vertexAlphas=L.vertexAlphas,V.vertexTangents=L.vertexTangents,V.toneMapping=L.toneMapping}function Nd(v,L){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;A.setFromMatrixPosition(L.matrixWorld);for(let V=0,O=v.length;V<O;V++){let B=v[V];if(B.texture!==null&&B.boundingBox.containsPoint(A))return B}return null}function Dd(v,L,V,O,B){if(L.isScene!==!0)L=Vt;G.resetTextureUnits();let pe=L.fog,xe=O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial?L.environment:null,fe=H===null?E.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:He.workingColorSpace,ye=O.isMeshStandardMaterial||O.isMeshLambertMaterial&&!O.envMap||O.isMeshPhongMaterial&&!O.envMap,be=te.get(O.envMap||xe,ye),ze=O.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ve=!!V.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),Se=!!V.morphAttributes.position,et=!!V.morphAttributes.normal,St=!!V.morphAttributes.color,ft=_n;if(O.toneMapped){if(H===null||H.isXRRenderTarget===!0)ft=E.toneMapping}let ot=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ut=ot!==void 0?ot.length:0,_e=C.get(O),kt=M.state.lights;if(Ye===!0){if(tt===!0||v!==z){let ht=v===z&&O.id===ne;se.setState(O,v,ht)}}let Ke=!1;if(O.version===_e.__version){if(_e.needsLights&&_e.lightsStateVersion!==kt.state.version)Ke=!0;else if(_e.outputColorSpace!==fe)Ke=!0;else if(B.isBatchedMesh&&_e.batching===!1)Ke=!0;else if(!B.isBatchedMesh&&_e.batching===!0)Ke=!0;else if(B.isBatchedMesh&&_e.batchingColor===!0&&B._colorsTexture===null)Ke=!0;else if(B.isBatchedMesh&&_e.batchingColor===!1&&B._colorsTexture!==null)Ke=!0;else if(B.isInstancedMesh&&_e.instancing===!1)Ke=!0;else if(!B.isInstancedMesh&&_e.instancing===!0)Ke=!0;else if(B.isSkinnedMesh&&_e.skinning===!1)Ke=!0;else if(!B.isSkinnedMesh&&_e.skinning===!0)Ke=!0;else if(B.isInstancedMesh&&_e.instancingColor===!0&&B.instanceColor===null)Ke=!0;else if(B.isInstancedMesh&&_e.instancingColor===!1&&B.instanceColor!==null)Ke=!0;else if(B.isInstancedMesh&&_e.instancingMorph===!0&&B.morphTexture===null)Ke=!0;else if(B.isInstancedMesh&&_e.instancingMorph===!1&&B.morphTexture!==null)Ke=!0;else if(_e.envMap!==be)Ke=!0;else if(O.fog===!0&&_e.fog!==pe)Ke=!0;else if(_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==se.numPlanes||_e.numIntersection!==se.numIntersection))Ke=!0;else if(_e.vertexAlphas!==ze)Ke=!0;else if(_e.vertexTangents!==Ve)Ke=!0;else if(_e.morphTargets!==Se)Ke=!0;else if(_e.morphNormals!==et)Ke=!0;else if(_e.morphColors!==St)Ke=!0;else if(_e.toneMapping!==ft)Ke=!0;else if(_e.morphTargetsCount!==Ut)Ke=!0;else if(!!_e.lightProbeGrid!==M.state.lightProbeGridArray.length>0)Ke=!0}else Ke=!0,_e.__version=O.version;let sn=_e.currentProgram;if(Ke===!0){if(sn=ur(O,L,B),D&&O.isNodeMaterial)D.onUpdateProgram(O,sn,_e)}let bn=!1,Jn=!1,ki=!1,rt=sn.getUniforms(),xt=_e.uniforms;if(b.useProgram(sn.program))bn=!0,Jn=!0,ki=!0;if(O.id!==ne)ne=O.id,Jn=!0;if(_e.needsLights){let ht=Nd(M.state.lightProbeGridArray,B);if(_e.lightProbeGrid!==ht)_e.lightProbeGrid=ht,Jn=!0}if(bn||z!==v){if(b.buffers.depth.getReversed()&&v.reversedDepth!==!0)v._reversedDepth=!0,v.updateProjectionMatrix();rt.setValue(P,"projectionMatrix",v.projectionMatrix),rt.setValue(P,"viewMatrix",v.matrixWorldInverse);let jn=rt.map.cameraPosition;if(jn!==void 0)jn.setValue(P,Dt.setFromMatrixPosition(v.matrixWorld));if(pt.logarithmicDepthBuffer)rt.setValue(P,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2));if(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)rt.setValue(P,"isOrthographic",v.isOrthographicCamera===!0);if(z!==v)z=v,Jn=!0,ki=!0}if(_e.needsLights){if(kt.state.sunShadowMap.length>0)rt.setValue(P,"sunShadowMap",kt.state.sunShadowMap,G);if(kt.state.directionalShadowMap.length>0)rt.setValue(P,"directionalShadowMap",kt.state.directionalShadowMap,G);if(kt.state.spotShadowMap.length>0)rt.setValue(P,"spotShadowMap",kt.state.spotShadowMap,G);if(kt.state.pointShadowMap.length>0)rt.setValue(P,"pointShadowMap",kt.state.pointShadowMap,G)}if(B.isSkinnedMesh){rt.setOptional(P,B,"bindMatrix"),rt.setOptional(P,B,"bindMatrixInverse");let ht=B.skeleton;if(ht){if(ht.boneTexture===null)ht.computeBoneTexture();rt.setValue(P,"boneTexture",ht.boneTexture,G)}}if(B.isBatchedMesh){if(rt.setOptional(P,B,"batchingTexture"),rt.setValue(P,"batchingTexture",B._matricesTexture,G),rt.setOptional(P,B,"batchingIdTexture"),rt.setValue(P,"batchingIdTexture",B._indirectTexture,G),rt.setOptional(P,B,"batchingColorTexture"),B._colorsTexture!==null)rt.setValue(P,"batchingColorTexture",B._colorsTexture,G)}let $n=V.morphAttributes;if($n.position!==void 0||$n.normal!==void 0||$n.color!==void 0)Je.update(B,V,sn);if(Jn||_e.receiveShadow!==B.receiveShadow)_e.receiveShadow=B.receiveShadow,rt.setValue(P,"receiveShadow",B.receiveShadow);if((O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial)&&O.envMap===null&&L.environment!==null)xt.envMapIntensity.value=L.environmentIntensity;if(xt.dfgLUT!==void 0)xt.dfgLUT.value=C_();if(Jn){if(rt.setValue(P,"toneMappingExposure",E.toneMappingExposure),_e.needsLights)Ud(xt,ki);if(pe&&O.fog===!0)me.refreshFogUniforms(xt,pe);if(me.refreshMaterialUniforms(xt,O,ie,q,M.state.transmissionRenderTarget[v.id]),_e.needsLights&&_e.lightProbeGrid){let ht=_e.lightProbeGrid;xt.probesSH.value=ht.texture,xt.probesMin.value.copy(ht.boundingBox.min),xt.probesMax.value.copy(ht.boundingBox.max),xt.probesResolution.value.copy(ht.resolution)}rr.upload(P,oc(_e),xt,G)}if(O.isShaderMaterial&&O.uniformsNeedUpdate===!0)rr.upload(P,oc(_e),xt,G),O.uniformsNeedUpdate=!1;if(O.isSpriteMaterial)rt.setValue(P,"center",B.center);if(rt.setValue(P,"modelViewMatrix",B.modelViewMatrix),rt.setValue(P,"normalMatrix",B.normalMatrix),rt.setValue(P,"modelMatrix",B.matrixWorld),O.uniformsGroups!==void 0){let ht=O.uniformsGroups;for(let jn=0,Hi=ht.length;jn<Hi;jn++){let hc=ht[jn];ge.update(hc,sn),ge.bind(hc,sn)}}return sn}function Ud(v,L){v.ambientLightColor.needsUpdate=L,v.lightProbe.needsUpdate=L,v.sunLights.needsUpdate=L,v.sunLightShadows.needsUpdate=L,v.directionalLights.needsUpdate=L,v.directionalLightShadows.needsUpdate=L,v.pointLights.needsUpdate=L,v.pointLightShadows.needsUpdate=L,v.spotLights.needsUpdate=L,v.spotLightShadows.needsUpdate=L,v.rectAreaLights.needsUpdate=L,v.hemisphereLights.needsUpdate=L}function Fd(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(v,L,V){let O=C.get(v);if(O.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,O.__autoAllocateDepthBuffer===!1)O.__useRenderToTexture=!1;C.get(v.texture).__webglTexture=L,C.get(v.depthTexture).__webglTexture=O.__autoAllocateDepthBuffer?void 0:V,O.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,L){let V=C.get(v);V.__webglFramebuffer=L,V.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(v,L=0,V=0){H=v,X=L,J=V;let O=null,B=!1,pe=!1;if(v){let fe=C.get(v);if(fe.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(P.FRAMEBUFFER,fe.__webglFramebuffer),W.copy(v.viewport),Q.copy(v.scissor),we=v.scissorTest,b.viewport(W),b.scissor(Q),b.setScissorTest(we),ne=-1;return}else if(fe.__webglFramebuffer===void 0)G.setupRenderTarget(v);else if(fe.__hasExternalTextures)G.rebindTextures(v,C.get(v.texture).__webglTexture,C.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let ze=v.depthTexture;if(fe.__boundDepthTexture!==ze){if(ze!==null&&C.has(ze)&&(v.width!==ze.image.width||v.height!==ze.image.height))throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");G.setupDepthRenderbuffer(v)}}let ye=v.texture;if(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)pe=!0;let be=C.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget){if(Array.isArray(be[L]))O=be[L][V];else O=be[L];B=!0}else if(v.samples>0&&G.useMultisampledRTT(v)===!1)O=C.get(v).__webglMultisampledFramebuffer;else if(Array.isArray(be))O=be[V];else O=be;W.copy(v.viewport),Q.copy(v.scissor),we=v.scissorTest}else W.copy(Le).multiplyScalar(ie).floor(),Q.copy(Ae).multiplyScalar(ie).floor(),we=Tt;if(V!==0)O=F;if(b.bindFramebuffer(P.FRAMEBUFFER,O))b.drawBuffers(v,O);if(b.viewport(W),b.scissor(Q),b.setScissorTest(we),B){let fe=C.get(v.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+L,fe.__webglTexture,V)}else if(pe){let fe=L;for(let ye=0;ye<v.textures.length;ye++){let be=C.get(v.textures[ye]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+ye,be.__webglTexture,V,fe)}}else if(v!==null&&V!==0){let fe=C.get(v.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,fe.__webglTexture,V)}ne=-1};function cc(v){let L=C.get(v);if(L.__readFormat!==v.format||L.__readType!==v.type)L.__readFormat=v.format,L.__readType=v.type,L.__formatReadable=pt.textureFormatReadable(v.format),L.__typeReadable=pt.textureTypeReadable(v.type);return L}if(this.readRenderTargetPixels=function(v,L,V,O,B,pe,xe,fe=0){if(!(v&&v.isWebGLRenderTarget)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=C.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&xe!==void 0)ye=ye[xe];if(ye){b.bindFramebuffer(P.FRAMEBUFFER,ye);try{let be=v.textures[fe],{format:ze,type:Ve}=be;if(v.textures.length>1)P.readBuffer(P.COLOR_ATTACHMENT0+fe);let Se=cc(be);if(Se.__formatReadable===!1){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Se.__typeReadable===!1){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}if(L>=0&&L<=v.width-O&&(V>=0&&V<=v.height-B))P.readPixels(L,V,O,B,Z.convert(ze),Z.convert(Ve),pe)}finally{let be=H!==null?C.get(H).__webglFramebuffer:null;b.bindFramebuffer(P.FRAMEBUFFER,be)}}},this.readRenderTargetPixelsAsync=async function(v,L,V,O,B,pe,xe,fe=0){if(!(v&&v.isWebGLRenderTarget))throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=C.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&xe!==void 0)ye=ye[xe];if(ye)if(L>=0&&L<=v.width-O&&(V>=0&&V<=v.height-B)){b.bindFramebuffer(P.FRAMEBUFFER,ye);let be=v.textures[fe],{format:ze,type:Ve}=be;if(v.textures.length>1)P.readBuffer(P.COLOR_ATTACHMENT0+fe);let Se=cc(be);if(Se.__formatReadable===!1)throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Se.__typeReadable===!1)throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let et=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,et),P.bufferData(P.PIXEL_PACK_BUFFER,pe.byteLength,P.STREAM_READ),P.readPixels(L,V,O,B,Z.convert(ze),Z.convert(Ve),0),P.bindBuffer(P.PIXEL_PACK_BUFFER,null);let St=H!==null?C.get(H).__webglFramebuffer:null;b.bindFramebuffer(P.FRAMEBUFFER,St);let ft=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await qh(P,ft,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,et),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,pe),P.bindBuffer(P.PIXEL_PACK_BUFFER,null),P.deleteBuffer(et),P.deleteSync(ft),pe}else throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,L=null,V=0){let O=Math.pow(2,-V),B=Math.floor(v.image.width*O),pe=Math.floor(v.image.height*O),xe=L!==null?L.x:0,fe=L!==null?L.y:0;G.setTexture2D(v,0),P.copyTexSubImage2D(P.TEXTURE_2D,V,0,0,xe,fe,B,pe),b.unbindTexture()},this.copyTextureToTexture=function(v,L,V=null,O=null,B=0,pe=0){let xe,fe,ye,be,ze,Ve,Se,et,St,ft=v.isCompressedTexture?v.mipmaps[pe]:v.image;if(V!==null)xe=V.max.x-V.min.x,fe=V.max.y-V.min.y,ye=V.isBox3?V.max.z-V.min.z:1,be=V.min.x,ze=V.min.y,Ve=V.isBox3?V.min.z:0;else{let xt=Math.pow(2,-B);if(xe=Math.floor(ft.width*xt),fe=Math.floor(ft.height*xt),v.isDataArrayTexture)ye=ft.depth;else if(v.isData3DTexture)ye=Math.floor(ft.depth*xt);else ye=1;be=0,ze=0,Ve=0}if(O!==null)Se=O.x,et=O.y,St=O.z;else Se=0,et=0,St=0;let ot=Z.convert(L.format),Ut=Z.convert(L.type),_e;if(L.isData3DTexture)G.setTexture3D(L,0),_e=P.TEXTURE_3D;else if(L.isDataArrayTexture||L.isCompressedArrayTexture)G.setTexture2DArray(L,0),_e=P.TEXTURE_2D_ARRAY;else G.setTexture2D(L,0),_e=P.TEXTURE_2D;b.activeTexture(P.TEXTURE0),b.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,L.flipY),b.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),b.pixelStorei(P.UNPACK_ALIGNMENT,L.unpackAlignment);let kt=b.getParameter(P.UNPACK_ROW_LENGTH),Ke=b.getParameter(P.UNPACK_IMAGE_HEIGHT),sn=b.getParameter(P.UNPACK_SKIP_PIXELS),bn=b.getParameter(P.UNPACK_SKIP_ROWS),Jn=b.getParameter(P.UNPACK_SKIP_IMAGES);b.pixelStorei(P.UNPACK_ROW_LENGTH,ft.width),b.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ft.height),b.pixelStorei(P.UNPACK_SKIP_PIXELS,be),b.pixelStorei(P.UNPACK_SKIP_ROWS,ze),b.pixelStorei(P.UNPACK_SKIP_IMAGES,Ve);let ki=v.isDataArrayTexture||v.isData3DTexture,rt=L.isDataArrayTexture||L.isData3DTexture;if(v.isDepthTexture){let xt=C.get(v),$n=C.get(L),ht=C.get(xt.__renderTarget),jn=C.get($n.__renderTarget);b.bindFramebuffer(P.READ_FRAMEBUFFER,ht.__webglFramebuffer),b.bindFramebuffer(P.DRAW_FRAMEBUFFER,jn.__webglFramebuffer);for(let Hi=0;Hi<ye;Hi++){if(ki)P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,C.get(v).__webglTexture,B,Ve+Hi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,C.get(L).__webglTexture,pe,St+Hi);P.blitFramebuffer(be,ze,xe,fe,Se,et,xe,fe,P.DEPTH_BUFFER_BIT,P.NEAREST)}b.bindFramebuffer(P.READ_FRAMEBUFFER,null),b.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(B!==0||v.isRenderTargetTexture||C.has(v)){let xt=C.get(v),$n=C.get(L);b.bindFramebuffer(P.READ_FRAMEBUFFER,j),b.bindFramebuffer(P.DRAW_FRAMEBUFFER,I);for(let ht=0;ht<ye;ht++){if(ki)P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,xt.__webglTexture,B,Ve+ht);else P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,xt.__webglTexture,B);if(rt)P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,$n.__webglTexture,pe,St+ht);else P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,$n.__webglTexture,pe);if(B!==0)P.blitFramebuffer(be,ze,xe,fe,Se,et,xe,fe,P.COLOR_BUFFER_BIT,P.NEAREST);else if(rt)P.copyTexSubImage3D(_e,pe,Se,et,St+ht,be,ze,xe,fe);else P.copyTexSubImage2D(_e,pe,Se,et,be,ze,xe,fe)}b.bindFramebuffer(P.READ_FRAMEBUFFER,null),b.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(rt)if(v.isDataTexture||v.isData3DTexture)P.texSubImage3D(_e,pe,Se,et,St,xe,fe,ye,ot,Ut,ft.data);else if(L.isCompressedArrayTexture)P.compressedTexSubImage3D(_e,pe,Se,et,St,xe,fe,ye,ot,ft.data);else P.texSubImage3D(_e,pe,Se,et,St,xe,fe,ye,ot,Ut,ft);else if(v.isDataTexture)P.texSubImage2D(P.TEXTURE_2D,pe,Se,et,xe,fe,ot,Ut,ft.data);else if(v.isCompressedTexture)P.compressedTexSubImage2D(P.TEXTURE_2D,pe,Se,et,ft.width,ft.height,ot,ft.data);else P.texSubImage2D(P.TEXTURE_2D,pe,Se,et,xe,fe,ot,Ut,ft);if(b.pixelStorei(P.UNPACK_ROW_LENGTH,kt),b.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ke),b.pixelStorei(P.UNPACK_SKIP_PIXELS,sn),b.pixelStorei(P.UNPACK_SKIP_ROWS,bn),b.pixelStorei(P.UNPACK_SKIP_IMAGES,Jn),pe===0&&L.generateMipmaps)P.generateMipmap(_e);b.unbindTexture()},this.initRenderTarget=function(v){if(C.get(v).__webglFramebuffer===void 0)G.setupRenderTarget(v)},this.initTexture=function(v){if(v.isCubeTexture)G.setTextureCube(v,0);else if(v.isData3DTexture)G.setTexture3D(v,0);else if(v.isDataArrayTexture||v.isCompressedArrayTexture)G.setTexture2DArray(v,0);else G.setTexture2D(v,0);b.unbindTexture()},this.resetState=function(){X=0,J=0,H=null,b.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return el}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=He._getDrawingBufferColorSpace(e),t.unpackColorSpace=He._getUnpackColorSpace()}}var Bu=localStorage.getItem("ct_sid")||"";function yn(){return Bu}function Ul(e){if(Bu=e,e)localStorage.setItem("ct_sid",e);else localStorage.removeItem("ct_sid")}async function pi(e,t){let n=await fetch(e,{method:t?"POST":"GET",headers:{"Content-Type":"application/json"},body:t?JSON.stringify(t):void 0}),i=null;try{i=await n.json()}catch{}if(!n.ok){let s=i?.error||"http-"+n.status;throw Object.assign(Error(s),{code:n.status})}return i}function Sn(e){return Math.round(e).toLocaleString("ru-RU")}var I_={"no-money":"не хватает монет",cooldown:"перемотай чуть позже","bad-nick":"ник: 2–20 символов, буквы/цифры/пробел","bad-pass":"пароль: 4–60 символов",taken:"такой ник уже занят","no-such-user":"нет такого ника","no-session":"сессия кончилась — войди снова","inv-full":"инвентарь полон","own-lot":"это твой лот",gone:"лот уже купили",blocked:"там уже есть клетка","too-many":"слишком много попыток, подожди минуту"};function ar(e){let t=e.message||"";if(e.code===401&&t==="bad-pass")return"неверный пароль";return I_[t]||t}function ba(e){return{common:"обычный",rare:"редкий",epic:"эпик",legendary:"ЛЕГЕНДА"}[e]||e}function Fl(e,t){if(t===Jo)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),e;if(t===ds||t===ks){let n=e.getIndex();if(n===null){let r=[],a=e.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);e.setIndex(r),n=e.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),e}let i=n.count-2,s=[];if(t===ds)for(let r=1;r<=i;r++)s.push(n.getX(0)),s.push(n.getX(r)),s.push(n.getX(r+1));else for(let r=0;r<i;r++)if(r%2===0)s.push(n.getX(r)),s.push(n.getX(r+1)),s.push(n.getX(r+2));else s.push(n.getX(r+2)),s.push(n.getX(r+1)),s.push(n.getX(r));if(s.length/3!==i)console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");return e.setIndex(s),e.clearGroups(),e}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),e}function zu(e){let t=new Map,n=new Map,i=e.clone();return ku(e,i,function(s,r){t.set(r,s),n.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=t.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return n.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),i}function ku(e,t,n){n(e,t);for(let i=0;i<e.children.length;i++)ku(e.children[i],t.children[i],n)}class Vl extends Zn{constructor(e){super(e);this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Zu(t)}),this.register(function(t){return new Ku(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new rd(t)}),this.register(function(t){return new ad(t)}),this.register(function(t){return new $u(t)}),this.register(function(t){return new ju(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new Yu(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new Ju(t)}),this.register(function(t){return new id(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new Xu(t)}),this.register(function(t){return new kl(t,Ge.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new kl(t,Ge.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new od(t)})}load(e,t,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let l=fi.extractUrlBase(e);r=fi.resolveURL(l,this.path)}else r=fi.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){if(i)i(l);else console.error(l);s.manager.itemError(e),s.manager.itemEnd(e)},o=new er(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){try{s.parse(l,r,function(c){t(c),s.manager.itemEnd(e)},a)}catch(c){a(c)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){if(this.pluginCallbacks.indexOf(e)===-1)this.pluginCallbacks.push(e);return this}unregister(e){if(this.pluginCallbacks.indexOf(e)!==-1)this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1);return this}parse(e,t,n,i){let s,r={},a={},o=new TextDecoder;if(typeof e==="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(o.decode(new Uint8Array(e,0,4))===ld){try{r[Ge.KHR_BINARY_GLTF]=new cd(e)}catch(h){if(i)i(h);return}s=JSON.parse(r[Ge.KHR_BINARY_GLTF].content)}else s=JSON.parse(o.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){if(i)i(Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new pd(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){let h=this.pluginCallbacks[c](l);if(!h.name)console.error("THREE.GLTFLoader: Invalid plugin found: missing name");a[h.name]=h,r[h.name]=!0}if(s.extensionsUsed)for(let c=0;c<s.extensionsUsed.length;++c){let h=s.extensionsUsed[c],d=s.extensionsRequired||[];switch(h){case Ge.KHR_MATERIALS_UNLIT:r[h]=new qu;break;case Ge.KHR_DRACO_MESH_COMPRESSION:r[h]=new hd(s,this.dracoLoader);break;case Ge.KHR_TEXTURE_TRANSFORM:r[h]=new ud;break;case Ge.KHR_MESH_QUANTIZATION:r[h]=new dd;break;default:if(d.indexOf(h)>=0&&a[h]===void 0)console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(r),l.setPlugins(a),l.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function P_(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function vt(e,t,n){let i=e.json.materials[t];if(i.extensions&&i.extensions[n])return i.extensions[n];return null}var Ge={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Xu{constructor(e){this.parser=e,this.name=Ge.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0)e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,o=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],l,c=new Ie(16777215);if(o.color!==void 0)c.setRGB(o.color[0],o.color[1],o.color[2],Jt);let h=o.range!==void 0?o.range:0;switch(o.type){case"directional":l=new ga(c),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new _s(c),l.distance=h;break;case"spot":l=new ma(c),l.distance=h,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,l.angle=o.spot.outerConeAngle,l.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}if(l.position.set(0,0,0),Dn(l,o),o.intensity!==void 0)l.intensity=o.intensity;return l.name=t.createUniqueName(o.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e!=="light")return;return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;if(a===void 0)return null;return this._loadLight(a).then(function(o){return n._getNodeRef(t.cache,a,o)})}}class qu{constructor(){this.name=Ge.KHR_MATERIALS_UNLIT}getMaterialType(){return ln}extendParams(e,t,n){let i=[];e.color=new Ie(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],Jt),e.opacity=r[3]}if(s.baseColorTexture!==void 0)i.push(n.assignTexture(e,"map",s.baseColorTexture,li))}return Promise.all(i)}}class Yu{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();if(n.emissiveStrength!==void 0)t.emissiveIntensity=n.emissiveStrength;return Promise.resolve()}}class Zu{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0)t.clearcoat=n.clearcoatFactor;if(n.clearcoatTexture!==void 0)i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture));if(n.clearcoatRoughnessFactor!==void 0)t.clearcoatRoughness=n.clearcoatRoughnessFactor;if(n.clearcoatRoughnessTexture!==void 0)i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture));if(n.clearcoatNormalTexture!==void 0){if(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new De(s,s)}}return Promise.all(i)}}class Ku{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_DISPERSION}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();return t.dispersion=n.dispersion!==void 0?n.dispersion:0,Promise.resolve()}}class Ju{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.iridescenceFactor!==void 0)t.iridescence=n.iridescenceFactor;if(n.iridescenceTexture!==void 0)i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture));if(n.iridescenceIor!==void 0)t.iridescenceIOR=n.iridescenceIor;if(t.iridescenceThicknessRange===void 0)t.iridescenceThicknessRange=[100,400];if(n.iridescenceThicknessMinimum!==void 0)t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum;if(n.iridescenceThicknessMaximum!==void 0)t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum;if(n.iridescenceThicknessTexture!==void 0)i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture));return Promise.all(i)}}class $u{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_SHEEN}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new Ie(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],Jt)}if(n.sheenRoughnessFactor!==void 0)t.sheenRoughness=n.sheenRoughnessFactor;if(n.sheenColorTexture!==void 0)i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,li));if(n.sheenRoughnessTexture!==void 0)i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture));return Promise.all(i)}}class ju{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.transmissionFactor!==void 0)t.transmission=n.transmissionFactor;if(n.transmissionTexture!==void 0)i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture));return Promise.all(i)}}class Qu{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_VOLUME}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0)i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture));t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ie().setRGB(s[0],s[1],s[2],Jt),Promise.all(i)}}class ed{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_IOR}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();if(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0)t.ior=1000;return Promise.resolve()}}class td{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_SPECULAR}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0)i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];if(t.specularColor=new Ie().setRGB(s[0],s[1],s[2],Jt),n.specularColorTexture!==void 0)i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,li));return Promise.all(i)}}class nd{constructor(e){this.parser=e,this.name=Ge.EXT_MATERIALS_BUMP}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0)i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture));return Promise.all(i)}}class id{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return vt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.anisotropyStrength!==void 0)t.anisotropy=n.anisotropyStrength;if(n.anisotropyRotation!==void 0)t.anisotropyRotation=n.anisotropyRotation;if(n.anisotropyTexture!==void 0)i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture));return Promise.all(i)}}class sd{constructor(e){this.parser=e,this.name=Ge.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=t.options.ktx2Loader;if(!r)if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");else return null;return t.loadTextureImage(e,s.source,r)}}class rd{constructor(e){this.parser=e,this.name=Ge.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);if(l!==null)o=l}return n.loadTextureImage(e,r.source,o)}}class ad{constructor(e){this.parser=e,this.name=Ge.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);if(l!==null)o=l}return n.loadTextureImage(e,r.source,o)}}class kl{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported)if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");else return null;return s.then(function(a){let o=i.byteOffset||0,l=i.byteLength||0,{count:c,byteStride:h}=i,d=new Uint8Array(a,o,l);if(r.decodeGltfBufferAsync)return r.decodeGltfBufferAsync(c,h,d,i.mode,i.filter).then(function(u){return u.buffer});else return r.ready.then(function(){let u=new ArrayBuffer(c*h);return r.decodeGltfBuffer(new Uint8Array(u),c,h,d,i.mode,i.filter),u})})}else return null}}class od{constructor(e){this.name=Ge.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let l of i.primitives)if(l.mode!==hn.TRIANGLES&&l.mode!==hn.TRIANGLE_STRIP&&l.mode!==hn.TRIANGLE_FAN&&l.mode!==void 0)return null;let r=n.extensions[this.name].attributes,a=[],o={};for(let l in r)a.push(this.parser.getDependency("accessor",r[l]).then((c)=>(o[l]=c,o[l])));if(a.length<1)return null;return a.push(this.parser.createNodeMesh(e)),Promise.all(a).then((l)=>{let c=l.pop(),h=c.isGroup?c.children:[c],d=l[0].count,u=[];for(let m of h){let g=new Oe,S=new U,f=new on,p=new U(1,1,1),T=new sa(m.geometry,m.material,d);for(let y=0;y<d;y++){if(o.TRANSLATION)S.fromBufferAttribute(o.TRANSLATION,y);if(o.ROTATION)f.fromBufferAttribute(o.ROTATION,y);if(o.SCALE)p.fromBufferAttribute(o.SCALE,y);T.setMatrixAt(y,g.compose(S,f,p))}let A=null;for(let y in o)if(y==="_COLOR_0"){let M=o[y];T.instanceColor=new ri(M.array,M.itemSize,M.normalized)}else if(y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"){if(A===null){let w=T.geometry;A=new Rt,A.name=w.name;for(let R in w.attributes)A.setAttribute(R,w.attributes[R]);for(let R in w.morphAttributes)A.morphAttributes[R]=w.morphAttributes[R];if(w.index!==null)A.setIndex(w.index);A.morphTargetsRelative=w.morphTargetsRelative;for(let R of w.groups)A.addGroup(R.start,R.count,R.materialIndex);if(w.boundingBox!==null)A.boundingBox=w.boundingBox.clone();if(w.boundingSphere!==null)A.boundingSphere=w.boundingSphere.clone();A.drawRange.start=w.drawRange.start,A.drawRange.count=w.drawRange.count,A.userData=Object.assign({},w.userData),T.geometry=A}let M=o[y];A.setAttribute(y,new ri(M.array,M.itemSize,M.normalized))}ut.prototype.copy.call(T,m),this.parser.assignFinalMaterial(T),u.push(T)}if(c.isGroup)return c.clear(),c.add(...u),c;return u[0]})}}var ld="glTF",or=12,Hu={JSON:1313821514,BIN:5130562};class cd{constructor(e){this.name=Ge.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,or),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==ld)throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");else if(this.header.version<2)throw Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-or,s=new DataView(e,or),r=0;while(r<i){let a=s.getUint32(r,!0);r+=4;let o=s.getUint32(r,!0);if(r+=4,o===Hu.JSON){let l=new Uint8Array(e,or+r,a);this.content=n.decode(l)}else if(o===Hu.BIN){let l=or+r;this.body=e.slice(l,l+a)}r+=a}if(this.content===null)throw Error("THREE.GLTFLoader: JSON content not found.")}}class hd{constructor(e,t){if(!t)throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ge.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,a={},o={},l={};for(let c in r){let h=Hl[c]||c.toLowerCase();a[h]=r[c]}for(let c in e.attributes){let h=Hl[c]||c.toLowerCase();if(r[c]!==void 0){let d=n.accessors[e.attributes[c]],u=Ss[d.componentType];l[h]=u.name,o[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(c){return new Promise(function(h,d){i.decodeDracoFile(c,function(u){for(let m in u.attributes){let g=u.attributes[m],S=o[m];if(S!==void 0)g.normalized=S}h(u)},a,l,Jt,d)})})}}class ud{constructor(){this.name=Ge.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0)e.channel=t.texCoord;if(t.offset!==void 0)e.offset.fromArray(t.offset);if(t.rotation!==void 0)e.rotation=t.rotation;if(t.scale!==void 0)e.repeat.fromArray(t.scale);if(t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class dd{constructor(){this.name=Ge.KHR_MESH_QUANTIZATION}}class Wl extends Yn{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)t[r]=n[s+r];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=a*2,l=a*3,c=i-t,h=(n-t)/c,d=h*h,u=d*h,m=e*l,g=m-l,S=-2*u+3*d,f=u-d,p=1-S,T=f-d+h;for(let A=0;A!==a;A++){let y=r[g+A+a],M=r[g+A+o]*c,w=r[m+A+a],R=r[m+A]*c;s[A]=p*y+T*M+S*w+f*R}return s}}var L_=new on;class fd extends Wl{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return L_.fromArray(s).normalize().toArray(s),s}}var hn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ss={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Gu={9728:xn,9729:Nt,9984:Vr,9985:hs,9986:Ti,9987:Rn},Vu={33071:cs,33648:Gr,10497:ls},Ol={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Hl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},mi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},N_={CUBICSPLINE:void 0,LINEAR:Jr,STEP:Ko},Bl={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function D_(e){if(e.DefaultMaterial===void 0)e.DefaultMaterial=new gs({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ai});return e.DefaultMaterial}function Oi(e,t,n){for(let i in n.extensions)if(e[i]===void 0)t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[i]=n.extensions[i]}function Dn(e,t){if(t.extras!==void 0)if(typeof t.extras==="object")Object.assign(e.userData,t.extras);else console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras)}function U_(e,t,n){let i=!1,s=!1,r=!1;for(let c=0,h=t.length;c<h;c++){let d=t[c];if(d.POSITION!==void 0)i=!0;if(d.NORMAL!==void 0)s=!0;if(d.COLOR_0!==void 0)r=!0;if(i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(e);let a=[],o=[],l=[];for(let c=0,h=t.length;c<h;c++){let d=t[c];if(i){let u=d.POSITION!==void 0?n.getDependency("accessor",d.POSITION):e.attributes.position;a.push(u)}if(s){let u=d.NORMAL!==void 0?n.getDependency("accessor",d.NORMAL):e.attributes.normal;o.push(u)}if(r){let u=d.COLOR_0!==void 0?n.getDependency("accessor",d.COLOR_0):e.attributes.color;l.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],d=c[1],u=c[2];if(i)e.morphAttributes.position=h;if(s)e.morphAttributes.normal=d;if(r)e.morphAttributes.color=u;return e.morphTargetsRelative=!0,e})}function F_(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,i=t.weights.length;n<i;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let i=0,s=n.length;i<s;i++)e.morphTargetDictionary[n[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function O_(e){let t,n=e.extensions&&e.extensions[Ge.KHR_DRACO_MESH_COMPRESSION];if(n)t="draco:"+n.bufferView+":"+n.indices+":"+zl(n.attributes);else t=e.indices+":"+zl(e.attributes)+":"+e.mode;if(e.targets!==void 0)for(let i=0,s=e.targets.length;i<s;i++)t+=":"+zl(e.targets[i]);return t}function zl(e){let t="",n=Object.keys(e).sort();for(let i=0,s=n.length;i<s;i++)t+=n[i]+":"+e[n[i]]+";";return t}function Gl(e){switch(e){case Int8Array:return 0.007874015748031496;case Uint8Array:return 0.00392156862745098;case Int16Array:return 0.00003051850947599719;case Uint16Array:return 0.000015259021896696422;default:throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function B_(e){if(e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0)return"image/jpeg";if(e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0)return"image/webp";if(e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0)return"image/ktx2";return"image/png"}var z_=new Oe;class pd{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new P_,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let o=a.match(/Version\/(\d+)/);i=n&&o?parseInt(o[1],10):-1,s=a.indexOf("Firefox")>-1,r=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}if(typeof createImageBitmap>"u"||n&&i<17||s&&r<98)this.textureLoader=new da(this.options.manager);else this.textureLoader=new xa(this.options.manager);if(this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new er(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials")this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let a={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return Oi(s,a,i),Dn(a,i),Promise.all(n._invokeAll(function(o){return o.afterRoot&&o.afterRoot(a)})).then(function(){for(let o of a.scenes)o.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i].joints;for(let a=0,o=r.length;a<o;a++)e[r[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];if(r.mesh!==void 0){if(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0)n[r.mesh].isSkinnedMesh=!0}if(r.camera!==void 0)this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){if(t===void 0)return;if(e.refs[t]===void 0)e.refs[t]=e.uses[t]=0;e.refs[t]++}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(r,a)=>{let o=this.associations.get(r);if(o!=null)this.associations.set(a,o);for(let[l,c]of r.children.entries())s(c,a.children[l])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);if(s)n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ge.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(fi.resolveURL(t.uri,i.path),s,void 0,function(){r(Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=Ol[i.type],a=Ss[i.componentType],o=i.normalized===!0,l=new a(i.count*r);return Promise.resolve(new Lt(l,r,o))}let s=[];if(i.bufferView!==void 0)s.push(this.getDependency("bufferView",i.bufferView));else s.push(null);if(i.sparse!==void 0)s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView));return Promise.all(s).then(function(r){let a=r[0],o=Ol[i.type],l=Ss[i.componentType],c=l.BYTES_PER_ELEMENT,h=c*o,d=i.byteOffset||0,u=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0,g,S;if(u&&u!==h){let f=Math.floor(d/u),p="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+f+":"+i.count,T=t.cache.get(p);if(!T)g=new l(a,f*u,i.count*u/c),T=new Xs(g,u/c),t.cache.add(p,T);S=new fs(T,o,d%u/c,m)}else{if(a===null)g=new l(i.count*o);else g=new l(a,d,i.count*o);S=new Lt(g,o,m)}if(i.sparse!==void 0){let f=Ol.SCALAR,p=Ss[i.sparse.indices.componentType],T=i.sparse.indices.byteOffset||0,A=i.sparse.values.byteOffset||0,y=new p(r[1],T,i.sparse.count*f),M=new l(r[2],A,i.sparse.count*o);if(a!==null)S=new Lt(S.array.slice(),S.itemSize,S.normalized);S.normalized=!1;for(let w=0,R=y.length;w<R;w++){let x=y[w];if(S.setX(x,M[w*o]),o>=2)S.setY(x,M[w*o+1]);if(o>=3)S.setZ(x,M[w*o+2]);if(o>=4)S.setW(x,M[w*o+3]);if(o>=5)throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}S.normalized=m}return S})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,r=t.images[s],a=this.textureLoader;if(r.uri){let o=n.manager.getHandler(r.uri);if(o!==null)a=o}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){let i=this,s=this.json,r=s.textures[e],a=s.images[t],o=(a.uri||a.bufferView)+":"+r.sampler;if(this.textureCache[o])return this.textureCache[o];let l=this.loadImageSource(t,n).then(function(c){if(c.flipY=!1,c.name=r.name||a.name||"",c.name===""&&typeof a.uri==="string"&&a.uri.startsWith("data:image/")===!1)c.name=a.uri;let d=(s.samplers||{})[r.sampler]||{};return c.magFilter=Gu[d.magFilter]||Nt,c.minFilter=Gu[d.minFilter]||Rn,c.wrapS=Vu[d.wrapS]||ls,c.wrapT=Vu[d.wrapT]||ls,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==xn&&c.minFilter!==Nt,i.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[o]=l,l}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then((h)=>h.clone());let r=i.images[e],a=self.URL||self.webkitURL,o=r.uri||"",l=!1;if(r.bufferView!==void 0)o=n.getDependency("bufferView",r.bufferView).then(function(h){l=!0;let d=new Blob([h],{type:r.mimeType});return o=a.createObjectURL(d),o});else if(r.uri===void 0)throw Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let c=Promise.resolve(o).then(function(h){return new Promise(function(d,u){let m=d;if(t.isImageBitmapLoader===!0)m=function(g){let S=new bt(g);S.needsUpdate=!0,d(S)};t.load(fi.resolveURL(h,s.path),m,void 0,u)})}).then(function(h){if(l===!0)a.revokeObjectURL(o);return Dn(h,r),h.userData.mimeType=r.mimeType||B_(r.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),h});return this.sourceCache[e]=c,c}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0)r=r.clone(),r.channel=n.texCoord;if(s.extensions[Ge.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Ge.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let o=s.associations.get(r);r=s.extensions[Ge.KHR_TEXTURE_TRANSFORM].extendTexture(r,a),s.associations.set(r,o)}}if(i!==void 0)r.colorSpace=i;return e[t]=r,r})}assignFinalMaterial(e){let{geometry:t,material:n}=e,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,o=this.cache.get(a);if(!o)o=new $s,Qt.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,o.sizeAttenuation=!1,this.cache.add(a,o);n=o}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,o=this.cache.get(a);if(!o)o=new Js,Qt.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,this.cache.add(a,o);n=o}if(i||s||r){let a="ClonedMaterial:"+n.uuid+":";if(i)a+="derivative-tangents:";if(s)a+="vertex-colors:";if(r)a+="flat-shading:";let o=this.cache.get(a);if(!o){if(o=n.clone(),s)o.vertexColors=!0;if(r)o.flatShading=!0;if(i){if(o.normalScale)o.normalScale.y*=-1;if(o.clearcoatNormalScale)o.clearcoatNormalScale.y*=-1}this.cache.add(a,o),this.associations.set(o,this.associations.get(n))}n=o}e.material=n}getMaterialType(){return gs}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],r,a={},o=s.extensions||{},l=[];if(o[Ge.KHR_MATERIALS_UNLIT]){let h=i[Ge.KHR_MATERIALS_UNLIT];r=h.getMaterialType(),l.push(h.extendParams(a,s,t))}else{let h=s.pbrMetallicRoughness||{};if(a.color=new Ie(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Jt),a.opacity=d[3]}if(h.baseColorTexture!==void 0)l.push(t.assignTexture(a,"map",h.baseColorTexture,li));if(a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0)l.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture));r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}if(s.doubleSided===!0)a.side=Bt;let c=s.alphaMode||Bl.OPAQUE;if(c===Bl.BLEND)a.transparent=!0,a.depthWrite=!1;else if(a.transparent=!1,c===Bl.MASK)a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:0.5;if(s.normalTexture!==void 0&&r!==ln){if(l.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new De(1,1),s.normalTexture.scale!==void 0){let h=s.normalTexture.scale;a.normalScale.set(h,h)}}if(s.occlusionTexture!==void 0&&r!==ln){if(l.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0)a.aoMapIntensity=s.occlusionTexture.strength}if(s.emissiveFactor!==void 0&&r!==ln){let h=s.emissiveFactor;a.emissive=new Ie().setRGB(h[0],h[1],h[2],Jt)}if(s.emissiveTexture!==void 0&&r!==ln)l.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,li));return Promise.all(l).then(function(){let h=new r(a);if(s.name)h.name=s.name;if(Dn(h,s),t.associations.set(h,{materials:e}),s.extensions)Oi(i,h,s);return h})}createUniqueName(e){let t=$e.sanitizeNodeName(e||"");if(t in this.nodeNamesUsed)return t+"_"+ ++this.nodeNamesUsed[t];else return this.nodeNamesUsed[t]=0,t}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[Ge.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(o){return Wu(o,a,t)})}let r=[];for(let a=0,o=e.length;a<o;a++){let l=e[a],c=O_(l),h=i[c];if(h)r.push(h.promise);else{let d;if(l.extensions&&l.extensions[Ge.KHR_DRACO_MESH_COMPRESSION])d=s(l);else d=Wu(new Rt,l,t);if(l.mode===hn.TRIANGLE_STRIP)d=d.then((u)=>Fl(u,ks));else if(l.mode===hn.TRIANGLE_FAN)d=d.then((u)=>Fl(u,ds));i[c]={primitive:l,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,a=[];for(let o=0,l=r.length;o<l;o++){let c=r[o].material===void 0?D_(this.cache):this.getDependency("material",r[o].material);a.push(c)}return a.push(t.loadGeometries(r)),Promise.all(a).then(async function(o){let l=o.slice(0,o.length-1),c=o[o.length-1],h=[];for(let u=0,m=c.length;u<m;u++){let g=c[u],S=r[u],f,p=l[u];if(S.mode===hn.TRIANGLES||S.mode===hn.TRIANGLE_STRIP||S.mode===hn.TRIANGLE_FAN||S.mode===void 0){let T=s.isSkinnedMesh===!0,A=g.hasAttribute("skinIndex")&&g.hasAttribute("skinWeight");if(T&&A===!1)console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled.");if(f=T&&A?new ia(g,p):new mt(g,p),f.isSkinnedMesh===!0)f.normalizeSkinWeights()}else if(S.mode===hn.LINES)f=new ra(g,p);else if(S.mode===hn.LINE_STRIP)f=new ps(g,p);else if(S.mode===hn.LINE_LOOP)f=new aa(g,p);else if(S.mode===hn.POINTS)f=new oa(g,p);else throw Error("THREE.GLTFLoader: Primitive mode unsupported: "+S.mode);if(Object.keys(f.geometry.morphAttributes).length>0)F_(f,s);if(f.name=t.createUniqueName(s.name||"mesh_"+e),Dn(f,s),S.extensions)Oi(i,f,S);t.assignFinalMaterial(f),h.push(f)}for(let u=0,m=h.length;u<m;u++)t.associations.set(h[u],{meshes:e,primitives:u});if(h.length===1){if(s.extensions)Oi(i,h[0],s);return h[0]}let d=new Kt;if(s.extensions)Oi(i,d,s);t.associations.set(d,{meshes:e});for(let u=0,m=h.length;u<m;u++)d.add(h[u]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}if(n.type==="perspective")t=new At(Pn.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2000000);else if(n.type==="orthographic")t=new Di(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar);if(n.name)t.name=this.createUniqueName(n.name);return Dn(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));if(t.inverseBindMatrices!==void 0)n.push(this.getDependency("accessor",t.inverseBindMatrices));else n.push(null);return Promise.all(n).then(function(i){let s=i.pop(),r=i,a=[],o=[];for(let l=0,c=r.length;l<c;l++){let h=r[l];if(h){a.push(h);let d=new Oe;if(s!==null)d.fromArray(s.array,l*16);o.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Zs(a,o)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,r=[],a=[],o=[],l=[],c=[];for(let h=0,d=i.channels.length;h<d;h++){let u=i.channels[h],m=i.samplers[u.sampler],g=u.target,S=g.node,f=i.parameters!==void 0?i.parameters[m.input]:m.input,p=i.parameters!==void 0?i.parameters[m.output]:m.output;if(g.node===void 0)continue;r.push(this.getDependency("node",S)),a.push(this.getDependency("accessor",f)),o.push(this.getDependency("accessor",p)),l.push(m),c.push(g)}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c)]).then(function(h){let d=h[0],u=h[1],m=h[2],g=h[3],S=h[4],f=[];for(let T=0,A=d.length;T<A;T++){let y=d[T],M=u[T],w=m[T],R=g[T],x=S[T];if(y===void 0)continue;if(y.updateMatrix)y.updateMatrix();let E=n._createAnimationTracks(y,M,w,R,x);if(E)for(let k=0;k<E.length;k++)f.push(E[k])}let p=new ua(s,void 0,f);return Dn(p,i),p})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];if(i.mesh===void 0)return null;return n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);if(i.weights!==void 0)r.traverse(function(a){if(!a.isMesh)return;for(let o=0,l=i.weights.length;o<l;o++)a.morphTargetInfluences[o]=i.weights[o]});return r})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),r=[],a=i.children||[];for(let l=0,c=a.length;l<c;l++)r.push(n.getDependency("node",a[l]));let o=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),o]).then(function(l){let c=l[0],h=l[1],d=l[2];if(d!==null)c.traverse(function(u){if(!u.isSkinnedMesh)return;u.bind(d,z_)});for(let u=0,m=h.length;u<m;u++)c.add(h[u]);if(c.userData.pivot!==void 0&&h.length>0){let u=c.userData.pivot,m=h[0];c.pivot=new U().fromArray(u),c.position.x-=u[0],c.position.y-=u[1],c.position.z-=u[2],m.position.set(0,0,0),delete c.userData.pivot}return c})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],r=s.name?i.createUniqueName(s.name):"",a=[],o=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});if(o)a.push(o);if(s.camera!==void 0)a.push(i.getDependency("camera",s.camera).then(function(l){return i._getNodeRef(i.cameraCache,s.camera,l)}));return i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let c;if(s.isBone===!0)c=new qs;else if(l.length>1)c=new Kt;else if(l.length===1)c=l[0];else c=new ut;if(c!==l[0])for(let h=0,d=l.length;h<d;h++)c.add(l[h]);if(s.name)c.userData.name=s.name,c.name=r;if(Dn(c,s),s.extensions)Oi(n,c,s);if(s.matrix!==void 0){let h=new Oe;h.fromArray(s.matrix),c.applyMatrix4(h)}else{if(s.translation!==void 0)c.position.fromArray(s.translation);if(s.rotation!==void 0)c.quaternion.fromArray(s.rotation);if(s.scale!==void 0)c.scale.fromArray(s.scale)}if(!i.associations.has(c))i.associations.set(c,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let h=i.associations.get(c);i.associations.set(c,{...h})}return i.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new Kt;if(n.name)s.name=i.createUniqueName(n.name);if(Dn(s,n),n.extensions)Oi(t,s,n);let r=n.nodes||[],a=[];for(let o=0,l=r.length;o<l;o++)a.push(i.getDependency("node",r[o]));return Promise.all(a).then(function(o){for(let c=0,h=o.length;c<h;c++){let d=o[c];if(d.parent!==null)s.add(zu(d));else s.add(d)}let l=(c)=>{let h=new Map;for(let[d,u]of i.associations)if(d instanceof Qt||d instanceof bt)h.set(d,u);return c.traverse((d)=>{let u=i.associations.get(d);if(u!=null)h.set(d,u)}),h};return i.associations=l(s),s})}_createAnimationTracks(e,t,n,i,s){let r=[],a=e.name?e.name:e.uuid,o=[];function l(u){if(u.morphTargetInfluences)o.push(u.name?u.name:u.uuid)}if(mi[s.path]===mi.weights){if(l(e),e.isGroup)e.children.forEach(l)}else o.push(a);let c;switch(mi[s.path]){case mi.weights:c=hi;break;case mi.rotation:c=ui;break;case mi.translation:case mi.scale:c=Li;break;default:switch(n.itemSize){case 1:c=hi;break;case 2:case 3:default:c=Li;break}break}let h=i.interpolation!==void 0?N_[i.interpolation]:Jr,d=this._getArrayFromAccessor(n);for(let u=0,m=o.length;u<m;u++){let g=new c(o[u]+"."+mi[s.path],t.array,d,h);if(i.interpolation==="CUBICSPLINE")this._createCubicSplineTrackInterpolant(g);r.push(g)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Gl(t.constructor),i=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){return new(this instanceof ui?fd:Wl)(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function k_(e,t,n){let i=t.attributes,s=new Gt;if(i.POSITION!==void 0){let o=n.json.accessors[i.POSITION],{min:l,max:c}=o;if(l!==void 0&&c!==void 0){if(s.set(new U(l[0],l[1],l[2]),new U(c[0],c[1],c[2])),o.normalized){let h=Gl(Ss[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=t.targets;if(r!==void 0){let o=new U,l=new U;for(let c=0,h=r.length;c<h;c++){let d=r[c];if(d.POSITION!==void 0){let u=n.json.accessors[d.POSITION],{min:m,max:g}=u;if(m!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(m[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(m[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(m[2]),Math.abs(g[2]))),u.normalized){let S=Gl(Ss[u.componentType]);l.multiplyScalar(S)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}e.boundingBox=s;let a=new jt;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,e.boundingSphere=a}function Wu(e,t,n){let i=t.attributes,s=[];function r(a,o){return n.getDependency("accessor",a).then(function(l){e.setAttribute(o,l)})}for(let a in i){let o=Hl[a]||a.toLowerCase();if(o in e.attributes)continue;s.push(r(i[a],o))}if(t.indices!==void 0&&!e.index){let a=n.getDependency("accessor",t.indices).then(function(o){e.setIndex(o)});s.push(a)}if(He.workingColorSpace!==Jt&&"COLOR_0"in i)console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${He.workingColorSpace}" not supported.`);return Dn(e,t),k_(e,t,n),Promise.all(s).then(function(){return t.targets!==void 0?U_(e,t.targets,n):e})}var nn=2;var H_=1.3,G_=2.2,md=5,gd=6,V_=1.1,_d=[{dir:"n",dx:0,dz:-1},{dir:"s",dx:0,dz:1},{dir:"e",dx:1,dz:0},{dir:"w",dx:-1,dz:0}];function W_(e){let t=e.getAttribute("position"),n=e.getAttribute("uv"),i=e.getAttribute("uv1"),s=e.getAttribute("normal"),r=[1/0,1/0,1/0],a=[-1/0,-1/0,-1/0];for(let M=0;M<t.count;M++){let w=[t.getX(M),t.getY(M),t.getZ(M)];for(let R=0;R<3;R++)r[R]=Math.min(r[R],w[R]),a[R]=Math.max(a[R],w[R])}let o=[a[0]-r[0],a[1]-r[1],a[2]-r[2]],l=o.indexOf(Math.min(...o)),c=[0,1,2].filter((M)=>M!==l),h=o[c[0]]>o[c[1]]?c[0]:c[1],d=h===c[0]?c[1]:c[0],u=(M,w)=>w===0?t.getX(M):w===1?t.getY(M):t.getZ(M),m=r[d],g=a[d],S=r[h],f=a[h],p=0;for(let M=0;M<t.count;M++)p+=u(M,l);p/=t.count;let T=(M,w,R)=>{let x=0,E=1/0;for(let k=0;k<t.count;k++){let D=u(k,d),F=u(k,h),j=(w?D-m:g-D)+(R?F-S:f-F);if(j<E)E=j,x=k}return M?new De(M.getX(x),M.getY(x)):new De(w?0:1,R?0:1)},A=(M,w)=>T(n,M,w),y=s?new U(s.getX(0),s.getY(0),s.getZ(0)).normalize():new U(0,1,0);return{nAxis:l,hAxis:d,vAxis:h,h0:m,h1:g,v0:S,v1:f,planePos:p,uvs:[A(!0,!0),A(!1,!0),A(!0,!1),A(!1,!1)],uvs1:[T(i,!0,!0),T(i,!1,!0),T(i,!0,!1),T(i,!1,!1)],normal:y}}function xd(e,t,n,i=!1){let s=e.h1===e.h0?0:(t-e.h0)/(e.h1-e.h0),r=e.v1===e.v0?0:(n-e.v0)/(e.v1-e.v0),[a,o,l,c]=i?e.uvs1:e.uvs;return new De(Pn.lerp(Pn.lerp(a.x,o.x,s),Pn.lerp(l.x,c.x,s),r),Pn.lerp(Pn.lerp(a.y,o.y,s),Pn.lerp(l.y,c.y,s),r))}function vd(e,t,n=!1){let i=[],s=[],r=[],a=[];for(let l of t){let c=n?e.planePos:0,h=n?(l.h0+l.h1)/2:0,d=n?(l.v0+l.v1)/2:0,u=(m,g)=>{let S=[0,0,0];S[e.nAxis]=e.planePos-c,S[e.hAxis]=m-h,S[e.vAxis]=g-d,i.push(S[0],S[1],S[2]);let f=xd(e,m,g);s.push(f.x,f.y);let p=xd(e,m,g,!0);r.push(p.x,p.y),a.push(e.normal.x,e.normal.y,e.normal.z)};u(l.h0,l.v0),u(l.h1,l.v0),u(l.h1,l.v1),u(l.h0,l.v0),u(l.h1,l.v1),u(l.h0,l.v1)}let o=new Rt;return o.setAttribute("position",new gt(i,3)),o.setAttribute("uv",new gt(s,2)),o.setAttribute("uv1",new gt(r,2)),o.setAttribute("normal",new gt(a,3)),o.userData.shared=!0,o}function X_(e){let t=H_/2;return[{h0:e.h0,h1:-t,v0:e.v0,v1:e.v1},{h0:t,h1:e.h1,v0:e.v0,v1:e.v1},{h0:-t,h1:t,v0:e.v0+G_,v1:e.v1}]}function q_(e){let t=[],n=(e.h1-e.h0)/md,i=(e.v1-e.v0)/gd;for(let s=0;s<md;s++)for(let r=0;r<gd;r++)t.push({h0:e.h0+s*n,h1:e.h0+(s+1)*n,v0:e.v0+r*i,v1:e.v0+(r+1)*i});return t}var Xl={floor:"Plane",ceil:"Plane.007",lamp:"Sphere"},yd={n:"Plane.001",s:"Plane.006",e:"Plane.002",w:"Plane.004"};function Sd(){let e=new ea;e.background=new Ie(658963),e.fog=new Ws(658963,6,26);let t=new Kt;e.add(t),e.add(new _a(11451595,1.1)),e.add(new fa(9414333,1316893,0.7));let n=new ln({color:5953216,side:Bt,transparent:!0,opacity:0.6}),i=new Qs(0.4,0.55,32);i.userData.shared=!0;let s=null,r=null,a=null,o=new U(0,1.6,2),l=[],c=[],h={scene:e,root:t,get toilet(){return a},get spawn(){return o},hasCell(g,S){return l.some((f)=>f.x===g&&f.z===S)},load(){if(!r)r=m();return r},update(g){for(let S=c.length-1;S>=0;S--){let f=c[S];f.t+=g;let p=Math.min(1,f.t/V_);f.mat.opacity=p<0.4?1:1-(p-0.4)/0.6;for(let T=0;T<f.parts.length;T++){let A=f.parts[T],y=f.t;A.mesh.position.set(A.p0.x+A.v.x*y,A.p0.y+A.v.y*y-5*y*y,A.p0.z+A.v.z*y),A.mesh.quaternion.setFromAxisAngle(A.axis,A.speed*y)}if(p>=1)t.remove(f.group),f.mat.dispose(),c.splice(S,1)}},rebuild(g){if(!s)return;let S=new Set(l.map((f)=>f.x+","+f.z));l=g.map((f)=>({...f})),a=null;while(t.children.length)t.children.pop().traverse((p)=>{let T=p;if(T.geometry&&!T.geometry.userData.shared)T.geometry.dispose()});for(let f of l){let p=f.x*nn,T=f.z*nn,A=new mt(s.floor.geo,s.floor.mat);A.position.set(p,0,T),t.add(A);let y=new mt(s.ceil.geo,s.ceil.mat);y.position.set(p,0,T),t.add(y);for(let M of _d){if(h.hasCell(f.x+M.dx,f.z+M.dz))continue;let w=s.wall[M.dir].geo,R=new mt(w,s.wall[M.dir].mat);R.position.set(p,0,T),t.add(R)}for(let M of s.lamp){let w=new mt(M.geo,M.mat);w.position.set(p,0,T),t.add(w)}if(f.kind!=="room"){let M=new _s(16773327,7,7,2);M.position.set(p,s.lampY,T),t.add(M)}if(f.kind==="toilet")a=u(s,p,T),t.add(a.group);if(f.kind==="spawn"){o=new U(p,1.6,T);let M=new mt(i,n);M.rotation.x=-Math.PI/2,M.position.set(p,0.02,T),t.add(M)}}for(let f of l)for(let p of _d){let T=f.x+p.dx,A=f.z+p.dz;if(!h.hasCell(T,A))continue;let y=S.has(f.x+","+f.z),M=S.has(T+","+A);if(y&&M)continue;let w=y?f:M?{x:T,z:A}:null;if(!w)continue;let R=w===f?{x:T,z:A}:f,x=R.z<w.z?"n":R.z>w.z?"s":R.x>w.x?"e":"w";d(s,w.x*nn,w.z*nn,x)}}};function d(g,S,f,p){let T=g.wall[p].mat,A=(Array.isArray(T)?T[0]:T).clone();A.transparent=!0,A.opacity=1,A.side=Bt;let y=new Kt;y.position.set(S,0,f);let M=()=>Math.random()-0.5,w=g.fragGeo[p].map((R,x)=>{let E=new mt(R,A);E.position.copy(g.fragCenter[p][x]),y.add(E);let k=p==="n"||p==="s",D=new U(k?M()*1.2:M()*2.6,0.5+Math.random()*1.1,k?M()*2.6:M()*1.2),F=new U(M(),M(),M()).normalize();if(F.lengthSq()<0.01)F.set(0,1,0);return{mesh:E,p0:E.position.clone(),v:D,axis:F,speed:4+Math.random()*7}});t.add(y),c.push({group:y,mat:A,t:0,parts:w})}function u(g,S,f){let p=g.toilet.clone();p.updateMatrixWorld(!0);let T=g.toiletBox,A=f+nn/2-0.04-T.max.z;return p.position.set(S,-T.min.y,A),{group:p,box:{x0:S+T.min.x,z0:A+T.min.z,x1:S+T.max.x,z1:A+T.max.z},anim:0}}async function m(){let g=new Vl,S=(z)=>new Promise((W,Q)=>g.load(z,W,void 0,Q)),[f,p]=await Promise.all([S("assets/cell.glb"),S("assets/toilet.glb")]);f.scene.updateMatrixWorld(!0),p.scene.updateMatrixWorld(!0);let T=(z)=>z.replace(/[\s.]/g,""),A=new Map;f.scene.traverse((z)=>{let W=T(z.name);if(!A.has(W))A.set(W,z)});let y=(z)=>{let W=A.get(T(z));if(!W)throw Error("в cell.glb нет объекта «"+z+"»; есть: "+[...A.keys()].join(", "));return W},M=(z)=>{let W=z.geometry.clone();return W.applyMatrix4(z.matrixWorld),W.computeBoundingBox(),W.userData.shared=!0,W},w=(z)=>{let W=[];if(z.traverse((Q)=>{let we=Q;if(we.isMesh)W.push({geo:M(we),mat:we.material})}),!W.length)throw Error("объект «"+z.name+"» в cell.glb без мешей");return W},R=new Set;f.scene.traverse((z)=>{let W=z;if(W.isMesh)for(let Q of Array.isArray(W.material)?W.material:[W.material])R.add(Q)});for(let z of R){let W=z;W.side=Bt;for(let Q of[W.map,W.normalMap,W.roughnessMap,W.metalnessMap,W.emissiveMap])if(Q)Q.anisotropy=8}let x={},E={},k={},D={};for(let z of["n","s","e","w"]){let W=w(y(yd[z]));if(W.length!==1)throw Error("стена «"+yd[z]+"» состоит из "+W.length+" примитивов — нужен один");let{geo:Q,mat:we}=W[0],Me=W_(Q);x[z]={geo:Q,mat:we},E[z]=vd(Me,X_(Me));let st=q_(Me);k[z]=[],D[z]=[];for(let Fe of st){k[z].push(vd(Me,[Fe],!0));let q=[0,0,0];q[Me.nAxis]=Me.planePos,q[Me.hAxis]=(Fe.h0+Fe.h1)/2,q[Me.vAxis]=(Fe.v0+Fe.v1)/2,D[z].push(new U(q[0],q[1],q[2]))}}let F=w(y(Xl.floor))[0],j=w(y(Xl.ceil))[0],I=w(y(Xl.lamp)),X=new Gt;for(let z of I)X.union(z.geo.boundingBox);let J=(X.min.y+X.max.y)/2,H=p.scene.getObjectByName("toilet")||p.scene.children[0];if(!H)throw Error("в toilet.glb нет унитаза");H.updateMatrixWorld(!0);let ne=new Gt().setFromObject(H);s={floor:F,ceil:j,lamp:I,lampY:J,wall:x,doorGeo:E,fragGeo:k,fragCenter:D,toilet:H,toiletBox:ne}}return h.debugInfo=()=>t.children.map((g,S)=>{let f={i:S,type:g.type,pos:g.position?.toArray?.()?.map((y)=>+y.toFixed(2))},p=[],T=[],A=[];return g.traverse((y)=>{let M=y;if(!M.isMesh)return;for(let x of Array.isArray(M.material)?M.material:[M.material]){let E=x;p.push((x.name||"?")+(E.map?"":" NOMAP"))}M.geometry.computeBoundingBox();let w=M.geometry.boundingBox;A.push(`box[${w.min.toArray().map((x)=>x.toFixed(1))}..${w.max.toArray().map((x)=>x.toFixed(1))}]`);let R=M.geometry.getAttribute("uv");if(R){let x=9,E=-9,k=9,D=-9;for(let F=0;F<R.count;F++)x=Math.min(x,R.getX(F)),E=Math.max(E,R.getX(F)),k=Math.min(k,R.getY(F)),D=Math.max(D,R.getY(F));T.push(`uv[${x.toFixed(2)}..${E.toFixed(2)},${k.toFixed(2)}..${D.toFixed(2)}]`)}else T.push("NO_UV")}),f.mats=p,f.uvs=T,f.boxes=A,f}),h.debugFilter=(g)=>{let S=0;return t.traverse((f)=>{let p=f;if(!p.isMesh)return;let T=(Array.isArray(p.material)?p.material:[p.material]).map((y)=>y.name||"").join(","),A=!g||T.includes(g);if(p.visible=A,!A)S++}),S},h.debugRay=(g,S)=>new Ui(new U(...g),new U(...S).normalize(),0,100).intersectObjects(t.children,!0).slice(0,3).map((T)=>{let A=T.object;return{dist:+T.distance.toFixed(3),point:T.point.toArray().map((y)=>+y.toFixed(3)),mat:Array.isArray(A.material)?A.material.map((y)=>y.name).join("|"):A.material?.name}}),h}var ql=1.6,un=0.32,Y_=3.2,Z_=1.7,Md=0.0022;class Yl{world;lockTarget;pos=new U(0,ql,2);yaw=0;pitch=0;bob=0;moving=!1;keys={};enabled=!1;onKeyDown=(e)=>{if(this.keys[e.code]=!0,["Space","Tab","KeyE"].includes(e.code))e.preventDefault()};onKeyUp=(e)=>{this.keys[e.code]=!1};onMouse=(e)=>{if(!this.enabled)return;this.yaw-=e.movementX*Md,this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch-e.movementY*Md))};onLockChange=()=>{this.enabled=document.pointerLockElement===this.lockTarget};constructor(e,t){this.world=e;this.lockTarget=t;document.addEventListener("keydown",this.onKeyDown),document.addEventListener("keyup",this.onKeyUp),document.addEventListener("mousemove",this.onMouse),document.addEventListener("pointerlockchange",this.onLockChange)}dispose(){document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("keyup",this.onKeyUp),document.removeEventListener("mousemove",this.onMouse),document.removeEventListener("pointerlockchange",this.onLockChange)}get locked(){return this.enabled}async lock(){try{await this.lockTarget.requestPointerLock()}catch{}}unlock(){if(document.pointerLockElement)document.exitPointerLock();this.enabled=!1}reset(e){this.pos.copy(e),this.pos.y=ql,this.yaw=0,this.pitch=-0.45,this.keys={}}canStand(e,t){let n=[[e-un,t-un],[e+un,t-un],[e-un,t+un],[e+un,t+un]];for(let[s,r]of n){let a=Math.round(s/nn),o=Math.round(r/nn);if(!this.world.hasCell(a,o))return!1}let i=this.world.toilet?.box;if(i){let s=e+un>i.x0&&e-un<i.x1,r=t+un>i.z0&&t-un<i.z1;if(s&&r)return!1}return!0}update(e,t){if(this.moving=!1,this.enabled&&!t){let s=0,r=0;if(this.keys.KeyW||this.keys.ArrowUp)s+=1;if(this.keys.KeyS||this.keys.ArrowDown)s-=1;if(this.keys.KeyA||this.keys.ArrowLeft)r-=1;if(this.keys.KeyD||this.keys.ArrowRight)r+=1;if(s||r){let a=Math.hypot(s,r);s/=a,r/=a;let o=this.keys.ShiftLeft||this.keys.ShiftRight?Z_:1,l=Y_*o*e,c=Math.sin(this.yaw),h=Math.cos(this.yaw),d=(-c*s+h*r)*l,u=(-h*s-c*r)*l;if(this.canStand(this.pos.x+d,this.pos.z))this.pos.x+=d;if(this.canStand(this.pos.x,this.pos.z+u))this.pos.z+=u;this.moving=!0}}let n=this.moving?1:0;this.bob+=(n-this.bob)*Math.min(1,e*8);let i=performance.now()/1000;this.pos.y=ql+Math.sin(i*9)*0.035*this.bob}apply(e){e.position.copy(this.pos),e.rotation.order="YXZ",e.rotation.set(this.pitch,this.yaw,0)}forward(){return new U(-Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch))}}var qe=(e)=>document.getElementById(e),ve=null,zi=null,at=null,_t=null,qt=null,yt=null,Zl=!1,bd=0,Un=!1,Kn=!1;function bs(e){qe("gate").classList.toggle("hidden",e!=="gate"),qe("menu").classList.toggle("hidden",e!=="menu"),qe("game").classList.toggle("hidden",e!=="game"),qe("side").classList.toggle("hidden",e==="gate")}function Bi(e,t){let n=document.createElement("div");n.className="toast "+(t||""),n.textContent=e,qe("toasts").appendChild(n),setTimeout(()=>n.remove(),2600)}async function Jl(e){let t=qe("nick").value.trim(),n=qe("pass").value;qe("gateErr").textContent="";try{let i=await pi("/api/"+e,{nick:t,pass:n});Ul(i.sid),ve=i.state,zi=i.catalog,Ts(),Ea(),bs("menu"),jl(),Ql()}catch(i){qe("gateErr").textContent=ar(i)}}async function K_(){if(!yn())return;try{let e=await pi("/api/state?sid="+encodeURIComponent(yn()));ve=e.state,zi=e.catalog,Ts(),Ea(),bs("menu"),jl(),Ql()}catch{$l()}}function $l(){if(yn())pi("/api/logout",{sid:yn()}).catch(()=>{});Ul(""),ve=null,Un=!1,_t?.unlock(),bs("gate")}async function J_(){if(!yn()||!ve)return;try{let e=await pi("/api/state?sid="+encodeURIComponent(yn()));if(ve=e.state,!zi&&e.catalog)zi=e.catalog;Ts(),Ea(),qe("online").textContent=String(e.online)}catch(e){if(e.code===401)$l()}}async function Ms(e,t,n){if(Zl||!ve)return;Zl=!0;try{let i=await pi(e,{sid:yn(),...t});if(i.state){if(ve=i.state,Ts(),Ea(),e==="/api/build"&&at&&ve)at.rebuild(ve.cells),Bi("Клетка построена","event")}if(i.result){if(Bi(i.result.text,i.result.kind==="hurt"||i.result.kind==="dirty"?"hit":i.result.kind==="event"?"event":"loot"),at?.toilet)at.toilet.anim=1}else if(n)Bi(n,"event");if(e==="/api/market/sell"||e==="/api/market/buy")Ad()}catch(i){Bi(ar(i),"hit")}finally{Zl=!1}}async function Ed(){if(Date.now()<bd)return;bd=Date.now()+1250,await Ms("/api/pull",{})}function Ts(){if(!ve)return;qe("whoami").textContent=ve.login,qe("whoScore").textContent=`счёт ${Sn(ve.score)} · смертей ${ve.deaths} · смывов ${ve.pulls}`,qe("money").textContent=Sn(ve.money),qe("income").textContent=ve.income.toFixed(2),qe("hp").textContent=ve.hp.toFixed(0),qe("dirty").textContent=ve.dirty.toFixed(1),qe("cells").textContent=String(ve.cells.length),document.querySelector(".chip.hp")?.classList.toggle("low",ve.hp<40),document.querySelector(".chip.dirty")?.classList.toggle("high",ve.dirty>70),wd()}function wd(){if(!ve||!_t)return;let e=qe("buildInfo"),t=Math.round(_t.pos.x/nn),n=Math.round(_t.pos.z/nn),i={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]},s=0;for(let r of["n","s","e","w"]){let[a,o]=i[r],l=ve.cells.some((h)=>h.x===t+a&&h.z===n+o),c=document.querySelector(`.btn.dir[data-dir="${r}"]`);if(c)c.disabled=l||ve.money<ve.buildCost;if(!l)s++}e.innerHTML=s?`построить клетку <b>${Sn(ve.buildCost)}</b> <span class="dim">— выбери сторону от клетки [${t}, ${n}]</span>`:'<span class="dim">вокруг клетки нет места</span>'}function jl(){if(!ve)return;qe("menuStats").innerHTML=`<span>монеты <b>${Sn(ve.money)}</b></span>`+`<span>клеток <b>${ve.cells.length}</b></span>`+`<span>счёт <b>${Sn(ve.score)}</b></span>`+`<span>доход/сек <b>${ve.income.toFixed(2)}</b></span>`}function Ea(){if(!ve)return;$_(),j_(),Q_()}function $_(){if(!ve||!zi)return;let e=qe("upgList");e.innerHTML="";for(let t of zi.upgrades){let n=ve.upg[t.id]||0,i=ve.upgCost[t.id],s=document.createElement("div");s.className="row",s.dataset.upg=t.id,s.innerHTML=`<span class="name">${t.name}<small>${t.desc}</small></span>`+`<span class="lvl">ур.${n}</span><span class="price">${Sn(i)}</span>`;let r=document.createElement("button");r.className="btn",r.id="buy-"+t.id,r.textContent=n?"УЛУЧШИТЬ":"КУПИТЬ",r.disabled=ve.money<i,r.onclick=()=>Ms("/api/upgrade",{id:t.id},t.name+" улучшен"),s.appendChild(r),e.appendChild(s)}}function j_(){if(!ve)return;let e=qe("invList");if(e.innerHTML="",!ve.inv.length){e.innerHTML='<div class="row empty">пусто — смывай унитаз</div>';return}ve.inv.forEach((t,n)=>{let i=document.createElement("div");i.className="row "+t.rarity,i.dataset.item=t.id,i.innerHTML=`<span class="name">${lr(t.id)}<small>${ba(t.rarity)}</small></span>`+`<span class="price">≈${Sn(t.sell)}</span>`;let s=document.createElement("button");s.className="btn",s.textContent="ВЫСТАВИТЬ",s.onclick=()=>Ms("/api/market/sell",{idx:n,price:t.sell},"Выставлен лот: "+lr(t.id)),i.appendChild(s),e.appendChild(i)})}function lr(e){let t=zi?.items.find((n)=>n.id===e);return t?t.name:e}function Q_(){if(!ve)return;let e=qe("logList");e.innerHTML="";for(let t of ve.log||[]){let n=document.createElement("div");n.className="logline "+t.kind;let i=new Date(t.ts);n.innerHTML=`<b>${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}</b> ${t.text}`,e.appendChild(n)}}async function Ad(){if(!yn()||!ve)return;try{let e=await pi("/api/market?sid="+encodeURIComponent(yn())),t=qe("myItems");t.innerHTML=e.inv.length?"":'<div class="row empty">нет вещей</div>',e.inv.forEach((i,s)=>{let r=document.createElement("div");r.className="row "+i.rarity,r.innerHTML=`<span class="name">${lr(i.id)}<small>${ba(i.rarity)}</small></span><span class="price">${Sn(i.sell)}</span>`;let a=document.createElement("button");a.className="btn",a.textContent="ПРОДАТЬ",a.onclick=()=>Ms("/api/market/sell",{idx:s,price:i.sell},"Лот выставлен"),r.appendChild(a),t.appendChild(r)});let n=qe("marketList");n.innerHTML=e.lots.length?"":'<div class="row empty">лотов нет</div>';for(let i of e.lots){let s=document.createElement("div");s.className="row "+i.item.rarity,s.dataset.lot=String(i.id),s.innerHTML=`<span class="name">${lr(i.item.id)}<small>${ba(i.item.rarity)} · ${i.seller}</small></span><span class="price">${Sn(i.price)}</span>`;let r=document.createElement("button");r.className="btn",r.textContent="КУПИТЬ",r.disabled=ve.money<i.price||i.seller===ve.login,r.onclick=()=>Ms("/api/market/buy",{lot:i.id},"Куплено: "+lr(i.item.id)),s.appendChild(r),n.appendChild(s)}}catch(e){Bi(ar(e),"hit")}}async function ex(){try{let e=await pi("/api/rating"),t=qe("ratingList");if(t.innerHTML="",qe("online").textContent=String(e.online),e.top.forEach((n,i)=>{let s=document.createElement("div");s.className="row rank"+(ve&&n.login===ve.login?" me":""),s.dataset.nick=n.login,s.innerHTML=`<span class="pos">${i+1}</span><span class="name">${n.login}${ve&&n.login===ve.login?"<small>ты</small>":""}</span>`+`<span class="lvl">ур.${n.levels}</span><span class="price">${Sn(n.score)}</span>`,t.appendChild(s)}),!e.top.length)t.innerHTML='<div class="row empty">пока пусто</div>'}catch(e){Bi(ar(e),"hit")}}function Ql(){if(qt)return;let e=qe("gl");qt=new Nl({canvas:e,antialias:!0}),qt.setPixelRatio(Math.min(2,window.devicePixelRatio)),yt=new At(72,1,0.05,60),at=Sd(),_t=new Yl(at,e);let t=()=>{let{innerWidth:n,innerHeight:i}=window;qt.setSize(n,i,!1),yt.aspect=n/i,yt.updateProjectionMatrix()};window.addEventListener("resize",t),t(),e.addEventListener("click",()=>{if(Kn){Ta();return}if(Un&&!_t.locked)_t.lock()})}var Kl=new Ui,tx=new De(0,0),cr=()=>qe("prompt");function nx(){if(!at?.toilet||!yt||!Un){cr().classList.add("hidden");return}Kl.setFromCamera(tx,yt),Kl.far=2.6;let e=Kl.intersectObject(at.toilet.group,!0);cr().classList.toggle("hidden",e.length===0)}async function Rd(){if(!ve)return;Ql();try{await at.load()}catch{Bi("не удалось загрузить карту","hit");return}at.rebuild(ve.cells),_t.reset(at.spawn),Un=!0,bs("game"),Ts(),await _t.lock()}function ec(){Un=!1,_t?.unlock(),cr().classList.add("hidden"),jl(),bs("menu")}function Ta(e){let t=document.querySelectorAll(".tab");if(e){if(t.forEach((n)=>n.classList.toggle("active",n.dataset.tab===e)),document.querySelectorAll(".panel").forEach((n)=>n.classList.toggle("active",n.id==="tab-"+e)),e==="market")Ad();if(e==="rating")ex()}if(Kn=!Kn||!!e,qe("side").classList.toggle("hidden",!Kn),Un)if(Kn)_t?.unlock();else _t?.lock()}document.addEventListener("keydown",(e)=>{if(!ve)return;if(e.code==="Tab")e.preventDefault(),Ta();else if(e.code==="Escape"){if(Kn)Ta();else if(Un)ec()}else if(e.code==="KeyE"&&Un&&!Kn){if(!cr().classList.contains("hidden"))Ed()}});document.addEventListener("pointerlockchange",()=>{if(Un&&!Kn&&document.pointerLockElement===null)ec()});document.querySelectorAll(".tab").forEach((e)=>{e.addEventListener("click",()=>Ta(e.dataset.tab))});document.querySelectorAll(".btn.dir").forEach((e)=>{e.addEventListener("click",()=>{if(!ve||!_t)return;let t=Math.round(_t.pos.x/nn),n=Math.round(_t.pos.z/nn);Ms("/api/build",{dir:e.dataset.dir,fx:t,fz:n})})});qe("loginBtn").addEventListener("click",()=>void Jl("login"));qe("regBtn").addEventListener("click",()=>void Jl("register"));qe("pass").addEventListener("keydown",(e)=>{if(e.key==="Enter")Jl("login")});qe("menuLogout").addEventListener("click",$l);qe("startBtn").addEventListener("click",()=>void Rd());qe("escBtn").addEventListener("click",ec);setInterval(()=>{if(!ve)return;let e=Math.max(0,Math.round((ve.nextEventIn-(Date.now()-ve.serverTime))/1000));qe("nextEv").textContent=e>0?e+"с":"сейчас",ve.dirty=Math.min(100,ve.dirty+ve.dirtyRate/60),ve.money+=ve.income/60,Ts()},1000);setInterval(()=>void J_(),4000);var Td=performance.now(),Cd=0;function Id(){requestAnimationFrame(Id);let e=performance.now(),t=Math.min(0.05,(e-Td)/1000);if(Td=e,!Un||!qt||!yt||!at||!_t)return;if(_t.update(t,Kn),_t.apply(yt),at.update(t),at.toilet&&at.toilet.anim>0){at.toilet.anim=Math.max(0,at.toilet.anim-t*1.4);let n=at.toilet.anim;at.toilet.group.position.y=Math.sin(n*Math.PI*7)*0.03*n}nx(),wd(),qt.render(at.scene,yt),Cd++}Id();bs("gate");K_();window.__ct={state:()=>ve,sid:()=>yn(),world:()=>at,player:()=>_t,start:()=>void Rd(),pull:()=>void Ed(),promptVisible:()=>!cr().classList.contains("hidden"),look:(e,t)=>{if(_t)_t.yaw=e,_t.pitch=t},money:()=>ve?ve.money:0,frames:()=>Cd,cam:()=>yt?{p:yt.position.toArray().map((e)=>+e.toFixed(2)),r:[yt.rotation.x,yt.rotation.y,yt.rotation.z].map((e)=>+e.toFixed(2))}:null,render:()=>{if(!qt||!yt||!at)return null;let e=qt.info.render,t=qt.domElement,n={},i=0;return at.root.traverse((s)=>{let r=s;if(!r.isMesh)return;i++,n[String(r.visible)]=(n[String(r.visible)]||0)+1}),{calls:e.calls,triangles:e.triangles,points:e.points,lines:e.lines,canvas:[t.width,t.height,t.clientWidth,t.clientHeight],camPos:yt.position.toArray().map((s)=>+s.toFixed(2)),camFov:yt.fov,aspect:+yt.aspect.toFixed(3),sceneChildren:at.scene.children.length,meshes:i,visible:n}},sample:(e)=>{if(!qt||!yt||!at)return null;qt.render(at.scene,yt);let t=qt.getContext(),n=qt.domElement.width,i=qt.domElement.height;return e.map(([s,r])=>{let a=Math.max(0,Math.min(n-1,Math.round(s/window.innerWidth*n))),o=Math.max(0,Math.min(i-1,Math.round((1-r/window.innerHeight)*i))),l=new Uint8Array(4);return t.readPixels(a,o,1,1,t.RGBA,t.UNSIGNED_BYTE,l),[l[0],l[1],l[2]]})},rayScreen:(e,t)=>{if(!yt||!at)return null;let n=at.root,i=new Ui;return i.setFromCamera(new De(e,t),yt),i.far=50,i.intersectObjects(n.children,!0).slice(0,4).map((s)=>({d:+s.distance.toFixed(3),p:s.point.toArray().map((r)=>+r.toFixed(3)),i:n.children.indexOf(s.object.parent&&s.object.parent!==n?s.object.parent:s.object),m:Array.isArray(s.object.material)?s.object.material.map((r)=>r.name).join("|"):s.object.material?.name,uv:(()=>{let r=s.uv;return r?[+r.x.toFixed(3),+r.y.toFixed(3)]:null})()}))}};
