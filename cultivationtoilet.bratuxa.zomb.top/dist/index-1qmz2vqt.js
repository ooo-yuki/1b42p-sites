var sh="186";var rh=0,ao=1,ah=2;var Bs=1,oh=2,as=3,ai=0,qt=1,Bt=2,Rn=0,zs=1,oo=2,lo=3,co=4,lh=5;var os=100,ch=101,hh=102,uh=103,dh=104,fh=200,ph=201,mh=202,gh=203,_h=204,xh=205,vh=206,yh=207,Sh=208,Mh=209,bh=210,Th=211,Eh=212,wh=213,Ah=214,Rh=0,Ch=1,Ih=2,ho=3,Ph=4,Lh=5,Nh=6,Dh=7,Uh=0,Fh=1,Oh=2,_n=0,uo=1,fo=2,po=3,mo=4,go=5,_o=6,xo=7;var ls=301,Ti=302,Vr=303,Wr=304,ks=306,cs=1000,hs=1001,Xr=1002,xn=1003,qr=1004;var Ei=1005;var Dt=1006,us=1007;var Cn=1008;var vn=1009,Bh=1010,zh=1011,Hs=1012,vo=1013,oi=1014,qn=1015,In=1016,yo=1017,So=1018,ds=1020,kh=35902,Hh=35899,Gh=1021,Vh=1022,Pn=1023,wi=1026,Ai=1027,Wh=1028,Mo=1029,Ri=1030,bo=1031;var To=1033,Yr=33776,Zr=33777,Kr=33778,Jr=33779,Eo=35840,wo=35841,Ao=35842,Ro=35843,Co=36196,Io=37492,Po=37496,Lo=37488,No=37489,$r=37490,Do=37491,Uo=37808,Fo=37809,Oo=37810,Bo=37811,zo=37812,ko=37813,Ho=37814,Go=37815,Vo=37816,Wo=37817,Xo=37818,qo=37819,Yo=37820,Zo=37821,Ko=36492,Jo=36494,$o=36495,jo=36283,Qo=36284,jr=36285,el=36286;var tl=2300,Qr=2301;var nl=0,Gs=1,fs=2;var il=0,Xh=1,Ci="",li="srgb",Jt="srgb-linear",sl="linear",ht="srgb";var qh=512,Yh=513,Zh=514,ea=515,Kh=516,Jh=517,ta=518,$h=519;var rl="300 es",al=2000;function tf(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function nf(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function ss(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function jh(){let e=ss("canvas");return e.style.display="block",e}var vc={},rs=null;function Os(...e){let t="THREE."+e.shift();if(rs)rs("log",t,...e);else console.log(t,...e)}function Qh(e){let t=e[0];if(typeof t==="string"&&t.startsWith("TSL:")){let n=e[1];if(n&&n.isStackTrace)e[0]+=" "+n.getLocation();else e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function Ae(...e){e=Qh(e);let t="THREE."+e.shift();if(rs)rs("warn",t,...e);else{let n=e[0];if(n&&n.isStackTrace)console.warn(n.getError(t));else console.warn(t,...e)}}function Ue(...e){e=Qh(e);let t="THREE."+e.shift();if(rs)rs("error",t,...e);else{let n=e[0];if(n&&n.isStackTrace)console.error(n.getError(t));else console.error(t,...e)}}function Mi(...e){let t=e.join(" ");if(t in vc)return;vc[t]=!0,Ae(...e)}function eu(e,t,n){return new Promise(function(i,s){function r(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}var tu={[0]:1,[2]:6,[4]:7,[3]:5,[1]:0,[6]:2,[7]:4,[5]:3};class Yn{addEventListener(e,t){if(this._listeners===void 0)this._listeners={};let n=this._listeners;if(n[e]===void 0)n[e]=[];if(n[e].indexOf(t)===-1)n[e].push(t)}hasEventListener(e,t){let n=this._listeners;if(n===void 0)return!1;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);if(s!==-1)i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}}var Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],yc=1234567,Us=Math.PI/180,bi=180/Math.PI;function gn(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ft[e&255]+Ft[e>>8&255]+Ft[e>>16&255]+Ft[e>>24&255]+"-"+Ft[t&255]+Ft[t>>8&255]+"-"+Ft[t>>16&15|64]+Ft[t>>24&255]+"-"+Ft[n&63|128]+Ft[n>>8&255]+"-"+Ft[n>>16&255]+Ft[n>>24&255]+Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]).toLowerCase()}function Ke(e,t,n){return Math.max(t,Math.min(n,e))}function ol(e,t){return(e%t+t)%t}function sf(e,t,n,i,s){return i+(e-t)*(s-i)/(n-t)}function rf(e,t,n){if(e!==t)return(n-e)/(t-e);else return 0}function Fs(e,t,n){return(1-n)*e+n*t}function af(e,t,n,i){return Fs(e,t,1-Math.exp(-n*i))}function of(e,t=1){return t-Math.abs(ol(e,t*2)-t)}function lf(e,t,n){if(e<=t)return 0;if(e>=n)return 1;return e=(e-t)/(n-t),e*e*(3-2*e)}function cf(e,t,n){if(e<=t)return 0;if(e>=n)return 1;return e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10)}function hf(e,t){return e+Math.floor(Math.random()*(t-e+1))}function uf(e,t){return e+Math.random()*(t-e)}function df(e){return e*(0.5-Math.random())}function ff(e){if(e!==void 0)yc=e;let t=yc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function pf(e){return e*Us}function mf(e){return e*bi}function gf(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function _f(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function xf(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function vf(e,t,n,i,s){let{cos:r,sin:a}=Math,o=r(n/2),l=a(n/2),c=r((t+i)/2),h=a((t+i)/2),d=r((t-i)/2),u=a((t-i)/2),p=r((i-t)/2),_=a((i-t)/2);switch(s){case"XYX":e.set(o*h,l*d,l*u,o*c);break;case"YZY":e.set(l*u,o*h,l*d,o*c);break;case"ZXZ":e.set(l*d,l*u,o*h,o*c);break;case"XZX":e.set(o*h,l*_,l*p,o*c);break;case"YXY":e.set(l*p,o*h,l*_,o*c);break;case"ZYZ":e.set(l*_,l*p,o*h,o*c);break;default:Ae("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function mn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error("THREE.MathUtils: Invalid component type.")}}function rt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error("THREE.MathUtils: Invalid component type.")}}var Ln={DEG2RAD:Us,RAD2DEG:bi,generateUUID:gn,clamp:Ke,euclideanModulo:ol,mapLinear:sf,inverseLerp:rf,lerp:Fs,damp:af,pingpong:of,smoothstep:lf,smootherstep:cf,randInt:hf,randFloat:uf,randFloatSpread:df,seededRandom:ff,degToRad:pf,radToDeg:mf,isPowerOfTwo:gf,ceilPowerOfTwo:_f,floorPowerOfTwo:xf,setQuaternionFromProperEuler:vf,normalize:rt,denormalize:mn};class Fe{static{Fe.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class on{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,a){let o=n[i+0],l=n[i+1],c=n[i+2],h=n[i+3],d=s[r+0],u=s[r+1],p=s[r+2],_=s[r+3];if(h!==_||o!==d||l!==u||c!==p){let S=o*d+l*u+c*p+h*_;if(S<0)d=-d,u=-u,p=-p,_=-_,S=-S;let m=1-a;if(S<0.9995){let f=Math.acos(S),w=Math.sin(f);m=Math.sin(m*f)/w,a=Math.sin(a*f)/w,o=o*m+d*a,l=l*m+u*a,c=c*m+p*a,h=h*m+_*a}else{o=o*m+d*a,l=l*m+u*a,c=c*m+p*a,h=h*m+_*a;let f=1/Math.sqrt(o*o+l*l+c*c+h*h);o*=f,l*=f,c*=f,h*=f}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,r){let a=n[i],o=n[i+1],l=n[i+2],c=n[i+3],h=s[r],d=s[r+1],u=s[r+2],p=s[r+3];return e[t]=a*p+c*h+o*u-l*d,e[t+1]=o*p+c*d+l*h-a*u,e[t+2]=l*p+c*u+a*d-o*h,e[t+3]=c*p-a*h-o*d-l*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let{_x:n,_y:i,_z:s,_order:r}=e,{cos:a,sin:o}=Math,l=a(n/2),c=a(i/2),h=a(s/2),d=o(n/2),u=o(i/2),p=o(s/2);switch(r){case"XYZ":this._x=d*c*h+l*u*p,this._y=l*u*h-d*c*p,this._z=l*c*p+d*u*h,this._w=l*c*h-d*u*p;break;case"YXZ":this._x=d*c*h+l*u*p,this._y=l*u*h-d*c*p,this._z=l*c*p-d*u*h,this._w=l*c*h+d*u*p;break;case"ZXY":this._x=d*c*h-l*u*p,this._y=l*u*h+d*c*p,this._z=l*c*p+d*u*h,this._w=l*c*h-d*u*p;break;case"ZYX":this._x=d*c*h-l*u*p,this._y=l*u*h+d*c*p,this._z=l*c*p-d*u*h,this._w=l*c*h+d*u*p;break;case"YZX":this._x=d*c*h+l*u*p,this._y=l*u*h+d*c*p,this._z=l*c*p-d*u*h,this._w=l*c*h-d*u*p;break;case"XZY":this._x=d*c*h-l*u*p,this._y=l*u*h-d*c*p,this._z=l*c*p+d*u*h,this._w=l*c*h+d*u*p;break;default:Ae("Quaternion: .setFromEuler() encountered an unknown order: "+r)}if(t===!0)this._onChangeCallback();return this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10],d=n+a+h;if(d>0){let u=0.5/Math.sqrt(d+1);this._w=0.25/u,this._x=(c-o)*u,this._y=(s-l)*u,this._z=(r-i)*u}else if(n>a&&n>h){let u=2*Math.sqrt(1+n-a-h);this._w=(c-o)/u,this._x=0.25*u,this._y=(i+r)/u,this._z=(s+l)/u}else if(a>h){let u=2*Math.sqrt(1+a-n-h);this._w=(s-l)/u,this._x=(i+r)/u,this._y=0.25*u,this._z=(o+c)/u}else{let u=2*Math.sqrt(1+h-n-a);this._w=(r-i)/u,this._x=(s+l)/u,this._y=(o+c)/u,this._z=0.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;if(n<0.00000001)if(n=0,Math.abs(e.x)>Math.abs(e.z))this._x=-e.y,this._y=e.x,this._z=0,this._w=n;else this._x=0,this._y=-e.z,this._z=e.y,this._w=n;else this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n;return this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();if(e===0)this._x=0,this._y=0,this._z=0,this._w=1;else e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e;return this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let{_x:n,_y:i,_z:s,_w:r}=e,{_x:a,_y:o,_z:l,_w:c}=t;return this._x=n*c+r*a+i*l-s*o,this._y=i*c+r*o+s*a-n*l,this._z=s*c+r*l+n*o-i*a,this._w=r*c-n*a-i*o-s*l,this._onChangeCallback(),this}slerp(e,t){let{_x:n,_y:i,_z:s,_w:r}=e,a=this.dot(e);if(a<0)n=-n,i=-i,s=-s,r=-r,a=-a;let o=1-t;if(a<0.9995){let l=Math.acos(a),c=Math.sin(l);o=Math.sin(o*l)/c,t=Math.sin(t*l)/c,this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this._onChangeCallback()}else this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{static{B.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){if(n===void 0)n=this.z;return this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Sc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Sc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,{x:s,y:r,z:a,w:o}=e,l=2*(r*i-a*n),c=2*(a*t-s*i),h=2*(s*n-r*t);return this.x=t+o*l+r*h-a*c,this.y=n+o*c+a*l-s*h,this.z=i+o*h+s*c-r*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let{x:n,y:i,z:s}=e,{x:r,y:a,z:o}=t;return this.x=i*o-s*a,this.y=s*r-n*o,this.z=n*a-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Da.copy(this).projectOnVector(e),this.sub(Da)}reflect(e){return this.sub(Da.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}var Da=new B,Sc=new on;class Oe{static{Oe.prototype.isMatrix3=!0}constructor(e,t,n,i,s,r,a,o,l){if(this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0)this.set(e,t,n,i,s,r,a,o,l)}set(e,t,n,i,s,r,a,o,l){let c=this.elements;return c[0]=e,c[1]=i,c[2]=a,c[3]=t,c[4]=s,c[5]=o,c[6]=n,c[7]=r,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[3],o=n[6],l=n[1],c=n[4],h=n[7],d=n[2],u=n[5],p=n[8],_=i[0],S=i[3],m=i[6],f=i[1],w=i[4],I=i[7],y=i[2],b=i[5],E=i[8];return s[0]=r*_+a*f+o*y,s[3]=r*S+a*w+o*b,s[6]=r*m+a*I+o*E,s[1]=l*_+c*f+h*y,s[4]=l*S+c*w+h*b,s[7]=l*m+c*I+h*E,s[2]=d*_+u*f+p*y,s[5]=d*S+u*w+p*b,s[8]=d*m+u*I+p*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8];return t*r*c-t*a*l-n*s*c+n*a*o+i*s*l-i*r*o}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8],h=c*r-a*l,d=a*o-c*s,u=l*s-r*o,p=t*h+n*d+i*u;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return e[0]=h*_,e[1]=(i*l-c*n)*_,e[2]=(a*n-i*r)*_,e[3]=d*_,e[4]=(c*t-i*o)*_,e[5]=(i*s-a*t)*_,e[6]=u*_,e[7]=(n*o-l*t)*_,e[8]=(r*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,a){let o=Math.cos(s),l=Math.sin(s);return this.set(n*o,n*l,-n*(o*r+l*a)+r+e,-i*l,i*o,-i*(-l*r+o*a)+a+t,0,0,1),this}scale(e,t){return Mi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ua.makeScale(e,t)),this}rotate(e){return Mi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ua.makeRotation(-e)),this}translate(e,t){return Mi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ua.makeTranslation(e,t)),this}makeTranslation(e,t){if(e.isVector2)this.set(1,0,e.x,0,1,e.y,0,0,1);else this.set(1,0,e,0,1,t,0,0,1);return this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}var Ua=new Oe,Mc=new Oe().set(0.4123908,0.3575843,0.1804808,0.212639,0.7151687,0.0721923,0.0193308,0.1191948,0.9505322),bc=new Oe().set(3.2409699,-1.5373832,-0.4986108,-0.9692436,1.8759675,0.0415551,0.0556301,-0.203977,1.0569715);function yf(){let e={enabled:!0,workingColorSpace:"srgb-linear",spaces:{},convert:function(s,r,a){if(this.enabled===!1||r===a||!r||!a)return s;if(this.spaces[r].transfer==="srgb")s.r=Wn(s.r),s.g=Wn(s.g),s.b=Wn(s.b);if(this.spaces[r].primaries!==this.spaces[a].primaries)s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ);if(this.spaces[a].transfer==="srgb")s.r=is(s.r),s.g=is(s.g),s.b=is(s.b);return s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){if(s==="")return"linear";return this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Mi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Mi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(s,r)}},t=[0.64,0.33,0.3,0.6,0.15,0.06],n=[0.2126,0.7152,0.0722],i=[0.3127,0.329];return e.define({["srgb-linear"]:{primaries:t,whitePoint:i,transfer:"linear",toXYZ:Mc,fromXYZ:bc,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:"srgb"},outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}},["srgb"]:{primaries:t,whitePoint:i,transfer:"srgb",toXYZ:Mc,fromXYZ:bc,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}}}),e}var Xe=yf();function Wn(e){return e<0.04045?e*0.0773993808:Math.pow(e*0.9478672986+0.0521327014,2.4)}function is(e){return e<0.0031308?e*12.92:1.055*Math.pow(e,0.41666)-0.055}var Vi;class ll{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src))return e.src;if(typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{if(Vi===void 0)Vi=ss("canvas");Vi.width=e.width,Vi.height=e.height;let i=Vi.getContext("2d");if(e instanceof ImageData)i.putImageData(e,0,0);else i.drawImage(e,0,0,e.width,e.height);n=Vi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ss("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Wn(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)t[n]=Math.floor(Wn(t[n]/255)*255);else t[n]=Wn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ae("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}var Sf=0;class Vs{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=gn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;if(typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement)e.set(t.videoWidth,t.videoHeight,0);else if(typeof VideoFrame<"u"&&t instanceof VideoFrame)e.set(t.displayWidth,t.displayHeight,0);else if(t!==null)e.set(t.width,t.height,t.depth||0);else e.set(0,0,0);return e}set needsUpdate(e){if(e===!0)this.version++}toJSON(e){let t=e===void 0||typeof e==="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,a=i.length;r<a;r++)if(i[r].isDataTexture)s.push(Fa(i[r].image));else s.push(Fa(i[r]))}else s=Fa(i);n.url=s}if(!t)e.images[this.uuid]=n;return n}}function Fa(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap)return ll.getDataURL(e);else if(e.data)return{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name};else return Ae("Texture: Unable to serialize Texture."),{}}var Mf=0,Oa=new B;class Et extends Yn{constructor(e=Et.DEFAULT_IMAGE,t=Et.DEFAULT_MAPPING,n=1001,i=1001,s=1006,r=1008,a=1023,o=1009,l=Et.DEFAULT_ANISOTROPY,c=""){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:Mf++}),this.uuid=gn(),this.name="",this.source=new Vs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=o,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=e&&e.depth&&e.depth>1?!0:!1,this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Oa).x}get height(){return this.source.getSize(Oa).y}get depth(){return this.source.getSize(Oa).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ae(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Ae(`Texture.setValues(): property '${t}' does not exist.`);continue}if(i&&n&&(i.isVector2&&n.isVector2))i.copy(n);else if(i&&n&&(i.isVector3&&n.isVector3))i.copy(n);else if(i&&n&&(i.isMatrix3&&n.isMatrix3))i.copy(n);else this[t]=n}}toJSON(e){let t=e===void 0||typeof e==="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(Object.keys(this.userData).length>0)n.userData=this.userData;if(!t)e.textures[this.uuid]=n;return n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1000:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:if(Math.abs(Math.floor(e.x)%2)===1)e.x=Math.ceil(e.x)-e.x;else e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1000:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:if(Math.abs(Math.floor(e.y)%2)===1)e.y=Math.ceil(e.y)-e.y;else e.y=e.y-Math.floor(e.y);break}if(this.flipY)e.y=1-e.y;return e}set needsUpdate(e){if(e===!0)this.version++,this.source.needsUpdate=!0}set needsPMREMUpdate(e){if(e===!0)this.pmremVersion++}}Et.DEFAULT_IMAGE=null;Et.DEFAULT_MAPPING=300;Et.DEFAULT_ANISOTROPY=1;class at{static{at.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);if(t<0.0001)this.x=1,this.y=0,this.z=0;else this.x=e.x/t,this.y=e.y/t,this.z=e.z/t;return this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,r=0.01,a=0.1,o=e.elements,l=o[0],c=o[4],h=o[8],d=o[1],u=o[5],p=o[9],_=o[2],S=o[6],m=o[10];if(Math.abs(c-d)<0.01&&Math.abs(h-_)<0.01&&Math.abs(p-S)<0.01){if(Math.abs(c+d)<0.1&&Math.abs(h+_)<0.1&&Math.abs(p+S)<0.1&&Math.abs(l+u+m-3)<0.1)return this.set(1,0,0,0),this;t=Math.PI;let w=(l+1)/2,I=(u+1)/2,y=(m+1)/2,b=(c+d)/4,E=(h+_)/4,R=(p+S)/4;if(w>I&&w>y)if(w<0.01)n=0,i=0.707106781,s=0.707106781;else n=Math.sqrt(w),i=b/n,s=E/n;else if(I>y)if(I<0.01)n=0.707106781,i=0,s=0.707106781;else i=Math.sqrt(I),n=b/i,s=R/i;else if(y<0.01)n=0.707106781,i=0.707106781,s=0;else s=Math.sqrt(y),n=E/s,i=R/s;return this.set(n,i,s,t),this}let f=Math.sqrt((S-p)*(S-p)+(h-_)*(h-_)+(d-c)*(d-c));if(Math.abs(f)<0.001)f=1;return this.x=(S-p)/f,this.y=(h-_)/f,this.z=(d-c)/f,this.w=Math.acos((l+u+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cl extends Yn{constructor(e=1,t=1,n={}){super();n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},s=new Et(i),r=n.count;for(let a=0;a<r;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};if(e.mapping!==void 0)t.mapping=e.mapping;if(e.wrapS!==void 0)t.wrapS=e.wrapS;if(e.wrapT!==void 0)t.wrapT=e.wrapT;if(e.wrapR!==void 0)t.wrapR=e.wrapR;if(e.magFilter!==void 0)t.magFilter=e.magFilter;if(e.minFilter!==void 0)t.minFilter=e.minFilter;if(e.format!==void 0)t.format=e.format;if(e.type!==void 0)t.type=e.type;if(e.anisotropy!==void 0)t.anisotropy=e.anisotropy;if(e.colorSpace!==void 0)t.colorSpace=e.colorSpace;if(e.flipY!==void 0)t.flipY=e.flipY;if(e.generateMipmaps!==void 0)t.generateMipmaps=e.generateMipmaps;if(e.internalFormat!==void 0)t.internalFormat=e.internalFormat;for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){if(this._depthTexture!==null&&this._depthTexture.renderTarget===this)this._depthTexture.renderTarget=null;if(e!==null&&e.renderTarget===null)e.renderTarget=this;this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)if(this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0)this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Vs(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $t extends cl{constructor(e=1,t=1,n={}){super(e,t,n);this.isWebGLRenderTarget=!0}}class na extends Et{constructor(e=null,t=1,n=1,i=1){super(null);this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class hl extends Et{constructor(e=null,t=1,n=1,i=1){super(null);this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Be{static{Be.prototype.isMatrix4=!0}constructor(e,t,n,i,s,r,a,o,l,c,h,d,u,p,_,S){if(this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0)this.set(e,t,n,i,s,r,a,o,l,c,h,d,u,p,_,S)}set(e,t,n,i,s,r,a,o,l,c,h,d,u,p,_,S){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=r,m[9]=a,m[13]=o,m[2]=l,m[6]=c,m[10]=h,m[14]=d,m[3]=u,m[7]=p,m[11]=_,m[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Be().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){if(this.determinantAffine()===0)return e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this;return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Wi.setFromMatrixColumn(e,0).length(),s=1/Wi.setFromMatrixColumn(e,1).length(),r=1/Wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,{x:n,y:i,z:s}=e,r=Math.cos(n),a=Math.sin(n),o=Math.cos(i),l=Math.sin(i),c=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=r*c,u=r*h,p=a*c,_=a*h;t[0]=o*c,t[4]=-o*h,t[8]=l,t[1]=u+p*l,t[5]=d-_*l,t[9]=-a*o,t[2]=_-d*l,t[6]=p+u*l,t[10]=r*o}else if(e.order==="YXZ"){let d=o*c,u=o*h,p=l*c,_=l*h;t[0]=d+_*a,t[4]=p*a-u,t[8]=r*l,t[1]=r*h,t[5]=r*c,t[9]=-a,t[2]=u*a-p,t[6]=_+d*a,t[10]=r*o}else if(e.order==="ZXY"){let d=o*c,u=o*h,p=l*c,_=l*h;t[0]=d-_*a,t[4]=-r*h,t[8]=p+u*a,t[1]=u+p*a,t[5]=r*c,t[9]=_-d*a,t[2]=-r*l,t[6]=a,t[10]=r*o}else if(e.order==="ZYX"){let d=r*c,u=r*h,p=a*c,_=a*h;t[0]=o*c,t[4]=p*l-u,t[8]=d*l+_,t[1]=o*h,t[5]=_*l+d,t[9]=u*l-p,t[2]=-l,t[6]=a*o,t[10]=r*o}else if(e.order==="YZX"){let d=r*o,u=r*l,p=a*o,_=a*l;t[0]=o*c,t[4]=_-d*h,t[8]=p*h+u,t[1]=h,t[5]=r*c,t[9]=-a*c,t[2]=-l*c,t[6]=u*h+p,t[10]=d-_*h}else if(e.order==="XZY"){let d=r*o,u=r*l,p=a*o,_=a*l;t[0]=o*c,t[4]=-h,t[8]=l*c,t[1]=d*h+_,t[5]=r*c,t[9]=u*h-p,t[2]=p*h-u,t[6]=a*c,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(bf,e,Tf)}lookAt(e,t,n){let i=this.elements;if(Yt.subVectors(e,t),Yt.lengthSq()===0)Yt.z=1;if(Yt.normalize(),Qn.crossVectors(n,Yt),Qn.lengthSq()===0){if(Math.abs(n.z)===1)Yt.x+=0.0001;else Yt.z+=0.0001;Yt.normalize(),Qn.crossVectors(n,Yt)}return Qn.normalize(),mr.crossVectors(Yt,Qn),i[0]=Qn.x,i[4]=mr.x,i[8]=Yt.x,i[1]=Qn.y,i[5]=mr.y,i[9]=Yt.y,i[2]=Qn.z,i[6]=mr.z,i[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[4],o=n[8],l=n[12],c=n[1],h=n[5],d=n[9],u=n[13],p=n[2],_=n[6],S=n[10],m=n[14],f=n[3],w=n[7],I=n[11],y=n[15],b=i[0],E=i[4],R=i[8],v=i[12],T=i[1],O=i[5],P=i[9],C=i[13],k=i[2],A=i[6],F=i[10],V=i[14],z=i[3],Q=i[7],W=i[11],K=i[15];return s[0]=r*b+a*T+o*k+l*z,s[4]=r*E+a*O+o*A+l*Q,s[8]=r*R+a*P+o*F+l*W,s[12]=r*v+a*C+o*V+l*K,s[1]=c*b+h*T+d*k+u*z,s[5]=c*E+h*O+d*A+u*Q,s[9]=c*R+h*P+d*F+u*W,s[13]=c*v+h*C+d*V+u*K,s[2]=p*b+_*T+S*k+m*z,s[6]=p*E+_*O+S*A+m*Q,s[10]=p*R+_*P+S*F+m*W,s[14]=p*v+_*C+S*V+m*K,s[3]=f*b+w*T+I*k+y*z,s[7]=f*E+w*O+I*A+y*Q,s[11]=f*R+w*P+I*F+y*W,s[15]=f*v+w*C+I*V+y*K,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],a=e[5],o=e[9],l=e[13],c=e[2],h=e[6],d=e[10],u=e[14],p=e[3],_=e[7],S=e[11],m=e[15],f=o*u-l*d,w=a*u-l*h,I=a*d-o*h,y=r*u-l*c,b=r*d-o*c,E=r*h-a*c;return t*(_*f-S*w+m*I)-n*(p*f-S*y+m*b)+i*(p*w-_*y+m*E)-s*(p*I-_*b+S*E)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],a=e[9],o=e[2],l=e[6],c=e[10];return t*(r*c-a*l)-n*(s*c-a*o)+i*(s*l-r*o)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;if(e.isVector3)i[12]=e.x,i[13]=e.y,i[14]=e.z;else i[12]=e,i[13]=t,i[14]=n;return this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8],h=e[9],d=e[10],u=e[11],p=e[12],_=e[13],S=e[14],m=e[15],f=t*a-n*r,w=t*o-i*r,I=t*l-s*r,y=n*o-i*a,b=n*l-s*a,E=i*l-s*o,R=c*_-h*p,v=c*S-d*p,T=c*m-u*p,O=h*S-d*_,P=h*m-u*_,C=d*m-u*S,k=f*C-w*P+I*O+y*T-b*v+E*R;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(a*C-o*P+l*O)*A,e[1]=(i*P-n*C-s*O)*A,e[2]=(_*E-S*b+m*y)*A,e[3]=(d*b-h*E-u*y)*A,e[4]=(o*T-r*C-l*v)*A,e[5]=(t*C-i*T+s*v)*A,e[6]=(S*I-p*E-m*w)*A,e[7]=(c*E-d*I+u*w)*A,e[8]=(r*P-a*T+l*R)*A,e[9]=(n*T-t*P-s*R)*A,e[10]=(p*b-_*I+m*f)*A,e[11]=(h*I-c*b-u*f)*A,e[12]=(a*v-r*O-o*R)*A,e[13]=(t*O-n*v+i*R)*A,e[14]=(_*w-p*y-S*f)*A,e[15]=(c*y-h*w+d*f)*A,this}scale(e){let t=this.elements,{x:n,y:i,z:s}=e;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){if(e.isVector3)this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1);else this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1);return this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,{x:r,y:a,z:o}=e,l=s*r,c=s*a;return this.set(l*r+n,l*a-i*o,l*o+i*a,0,l*a+i*o,c*a+n,c*o-i*r,0,l*o-i*a,c*o+i*r,s*o*o+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,{_x:s,_y:r,_z:a,_w:o}=t,l=s+s,c=r+r,h=a+a,d=s*l,u=s*c,p=s*h,_=r*c,S=r*h,m=a*h,f=o*l,w=o*c,I=o*h,{x:y,y:b,z:E}=n;return i[0]=(1-(_+m))*y,i[1]=(u+I)*y,i[2]=(p-w)*y,i[3]=0,i[4]=(u-I)*b,i[5]=(1-(d+m))*b,i[6]=(S+f)*b,i[7]=0,i[8]=(p+w)*E,i[9]=(S-f)*E,i[10]=(1-(d+_))*E,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=Wi.set(i[0],i[1],i[2]).length(),a=Wi.set(i[4],i[5],i[6]).length(),o=Wi.set(i[8],i[9],i[10]).length();if(s<0)r=-r;dn.copy(this);let l=1/r,c=1/a,h=1/o;return dn.elements[0]*=l,dn.elements[1]*=l,dn.elements[2]*=l,dn.elements[4]*=c,dn.elements[5]*=c,dn.elements[6]*=c,dn.elements[8]*=h,dn.elements[9]*=h,dn.elements[10]*=h,t.setFromRotationMatrix(dn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,r,a=2000,o=!1){let l=this.elements,c=2*s/(t-e),h=2*s/(n-i),d=(t+e)/(t-e),u=(n+i)/(n-i),p,_;if(o)p=s/(r-s),_=r*s/(r-s);else if(a===2000)p=-(r+s)/(r-s),_=-2*r*s/(r-s);else if(a===2001)p=-r/(r-s),_=-r*s/(r-s);else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,r,a=2000,o=!1){let l=this.elements,c=2/(t-e),h=2/(n-i),d=-(t+e)/(t-e),u=-(n+i)/(n-i),p,_;if(o)p=1/(r-s),_=r/(r-s);else if(a===2000)p=-2/(r-s),_=-(r+s)/(r-s);else if(a===2001)p=-1/(r-s),_=-s/(r-s);else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=u,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}var Wi=new B,dn=new Be,bf=new B(0,0,0),Tf=new B(1,1,1),Qn=new B,mr=new B,Yt=new B,Tc=new Be,Ec=new on;class Xn{constructor(e=0,t=0,n=0,i=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],a=i[8],o=i[1],l=i[5],c=i[9],h=i[2],d=i[6],u=i[10];switch(t){case"XYZ":if(this._y=Math.asin(Ke(a,-1,1)),Math.abs(a)<0.9999999)this._x=Math.atan2(-c,u),this._z=Math.atan2(-r,s);else this._x=Math.atan2(d,l),this._z=0;break;case"YXZ":if(this._x=Math.asin(-Ke(c,-1,1)),Math.abs(c)<0.9999999)this._y=Math.atan2(a,u),this._z=Math.atan2(o,l);else this._y=Math.atan2(-h,s),this._z=0;break;case"ZXY":if(this._x=Math.asin(Ke(d,-1,1)),Math.abs(d)<0.9999999)this._y=Math.atan2(-h,u),this._z=Math.atan2(-r,l);else this._y=0,this._z=Math.atan2(o,s);break;case"ZYX":if(this._y=Math.asin(-Ke(h,-1,1)),Math.abs(h)<0.9999999)this._x=Math.atan2(d,u),this._z=Math.atan2(o,s);else this._x=0,this._z=Math.atan2(-r,l);break;case"YZX":if(this._z=Math.asin(Ke(o,-1,1)),Math.abs(o)<0.9999999)this._x=Math.atan2(-c,l),this._y=Math.atan2(-h,s);else this._x=0,this._y=Math.atan2(a,u);break;case"XZY":if(this._z=Math.asin(-Ke(r,-1,1)),Math.abs(r)<0.9999999)this._x=Math.atan2(d,l),this._y=Math.atan2(a,s);else this._x=Math.atan2(-c,u),this._y=0;break;default:Ae("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}if(this._order=t,n===!0)this._onChangeCallback();return this}setFromQuaternion(e,t,n){return Tc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ec.setFromEuler(this),this.setFromQuaternion(Ec,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){if(this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0)this._order=e[3];return this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class Ws{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}var Ef=0,wc=new B,Xi=new on,Bn=new Be,gr=new B,As=new B,wf=new B,Af=new on,Ac=new B(1,0,0),Rc=new B(0,1,0),Cc=new B(0,0,1),Ic={type:"added"},Rf={type:"removed"},qi={type:"childadded",child:null},Ba={type:"childremoved",child:null};class ft extends Yn{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=gn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ft.DEFAULT_UP.clone();let e=new B,t=new Xn,n=new on,i=new B(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Be},normalMatrix:{value:new Oe}}),this.matrix=new Be,this.matrixWorld=new Be,this.matrixAutoUpdate=ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ws,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){if(this.matrixAutoUpdate)this.updateMatrix();this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.premultiply(Xi),this}rotateX(e){return this.rotateOnAxis(Ac,e)}rotateY(e){return this.rotateOnAxis(Rc,e)}rotateZ(e){return this.rotateOnAxis(Cc,e)}translateOnAxis(e,t){return wc.copy(e).applyQuaternion(this.quaternion),this.position.add(wc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ac,e)}translateY(e){return this.translateOnAxis(Rc,e)}translateZ(e){return this.translateOnAxis(Cc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){if(e.isVector3)gr.copy(e);else gr.set(e,t,n);let i=this.parent;if(this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight)Bn.lookAt(As,gr,this.up);else Bn.lookAt(gr,As,this.up);if(this.quaternion.setFromRotationMatrix(Bn),i)Bn.extractRotation(i.matrixWorld),Xi.setFromRotationMatrix(Bn),this.quaternion.premultiply(Xi.invert())}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}if(e===this)return Ue("Object3D.add: object can't be added as a child of itself.",e),this;if(e&&e.isObject3D)e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ic),qi.child=e,this.dispatchEvent(qi),qi.child=null;else Ue("Object3D.add: object not an instance of THREE.Object3D.",e);return this}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);if(t!==-1)e.parent=null,this.children.splice(t,1),e.dispatchEvent(Rf),Ba.child=e,this.dispatchEvent(Ba),Ba.child=null;return this}removeFromParent(){let e=this.parent;if(e!==null)e.remove(this);return this}clear(){return this.remove(...this.children)}attach(e){if(this.updateWorldMatrix(!0,!1),Bn.copy(this.matrixWorld).invert(),e.parent!==null)e.parent.updateWorldMatrix(!0,!1),Bn.multiply(e.parent.matrixWorld);return e.applyMatrix4(Bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ic),qi.child=e,this.dispatchEvent(qi),qi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}return}getObjectsByProperty(e,t,n=[]){if(this[e]===t)n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,e,wf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Af,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;if(t!==null)e(t),t.traverseAncestors(e)}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let{x:t,y:n,z:i}=e,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||e){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,e=!0}let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null)i.updateWorldMatrix(!0,!1);if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||n){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,n=!0}if(t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==="string",n={};if(t)e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"};let i={};if(i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0)i.userData=this.userData;if(i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null)i.pivot=this.pivot.toArray();if(this.morphTargetDictionary!==void 0)i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary);if(this.morphTargetInfluences!==void 0)i.morphTargetInfluences=this.morphTargetInfluences.slice();if(this.isInstancedMesh){if(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null)i.instanceColor=this.instanceColor.toJSON()}if(this.isBatchedMesh){if(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map((a)=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map((a)=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null)i.colorsTexture=this._colorsTexture.toJSON(e);if(this.boundingSphere!==null)i.boundingSphere=this.boundingSphere.toJSON();if(this.boundingBox!==null)i.boundingBox=this.boundingBox.toJSON()}function s(a,o){if(a[o.uuid]===void 0)a[o.uuid]=o.toJSON(e);return o.uuid}if(this.isScene){if(this.background){if(this.background.isColor)i.background=this.background.toJSON();else if(this.background.isTexture)i.background=this.background.toJSON(e).uuid}if(this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0)i.environment=this.environment.toJSON(e).uuid}else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let o=a.shapes;if(Array.isArray(o))for(let l=0,c=o.length;l<c;l++){let h=o[l];s(e.shapes,h)}else s(e.shapes,o)}}if(this.isSkinnedMesh){if(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0)s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid}if(this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let o=0,l=this.material.length;o<l;o++)a.push(s(e.materials,this.material[o]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let o=this.animations[a];i.animations.push(s(e.animations,o))}}if(t){let a=r(e.geometries),o=r(e.materials),l=r(e.textures),c=r(e.images),h=r(e.shapes),d=r(e.skeletons),u=r(e.animations),p=r(e.nodes);if(a.length>0)n.geometries=a;if(o.length>0)n.materials=o;if(l.length>0)n.textures=l;if(c.length>0)n.images=c;if(h.length>0)n.shapes=h;if(d.length>0)n.skeletons=d;if(u.length>0)n.animations=u;if(p.length>0)n.nodes=p}return n.object=i,n;function r(a){let o=[];for(let l in a){let c=a[l];delete c.metadata,o.push(c)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}ft.DEFAULT_UP=new B(0,1,0);ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Kt extends ft{constructor(){super();this.isGroup=!0,this.type="Group"}}var Cf={type:"move"};class Xs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){if(this._hand===null)this._hand=new Kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1};return this._hand}getTargetRaySpace(){if(this._targetRay===null)this._targetRay=new Kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B;return this._targetRay}getGripSpace(){if(this._grip===null)this._grip=new Kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1;return this._grip}dispatchEvent(e){if(this._targetRay!==null)this._targetRay.dispatchEvent(e);if(this._grip!==null)this._grip.dispatchEvent(e);if(this._hand!==null)this._hand.dispatchEvent(e);return this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){if(this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null)this._targetRay.visible=!1;if(this._grip!==null)this._grip.visible=!1;if(this._hand!==null)this._hand.visible=!1;return this}update(e,t,n){let i=null,s=null,r=null,a=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){r=!0;for(let _ of e.hand.values()){let S=t.getJointPose(_,n),m=this._getHandJoint(l,_);if(S!==null)m.matrix.fromArray(S.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=S.radius;m.visible=S!==null}let c=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=c.position.distanceTo(h.position),u=0.02,p=0.005;if(l.inputState.pinching&&d>u+p)l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this});else if(!l.inputState.pinching&&d<=u-p)l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this})}else if(o!==null&&e.gripSpace){if(s=t.getPose(e.gripSpace,n),s!==null){if(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity)o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity);else o.hasLinearVelocity=!1;if(s.angularVelocity)o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity);else o.hasAngularVelocity=!1;if(o.eventsEnabled)o.dispatchEvent({type:"gripUpdated",data:e,target:this})}}if(a!==null){if(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null)i=s;if(i!==null){if(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity)a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity);else a.hasLinearVelocity=!1;if(i.angularVelocity)a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity);else a.hasAngularVelocity=!1;this.dispatchEvent(Cf)}}}if(a!==null)a.visible=i!==null;if(o!==null)o.visible=s!==null;if(l!==null)l.visible=r!==null;return this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Kt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}var nu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ei={h:0,s:0,l:0},_r={h:0,s:0,l:0};function za(e,t,n){if(n<0)n+=1;if(n>1)n-=1;if(n<0.16666666666666666)return e+(t-e)*6*n;if(n<0.5)return t;if(n<0.6666666666666666)return e+(t-e)*6*(0.6666666666666666-n);return e}class Le{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;if(i&&i.isColor)this.copy(i);else if(typeof i==="number")this.setHex(i);else if(typeof i==="string")this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t="srgb"){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=ol(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=0.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=za(r,s,e+0.3333333333333333),this.g=za(r,s,e),this.b=za(r,s,e-0.3333333333333333)}return Xe.colorSpaceToWorking(this,i),this}setStyle(e,t="srgb"){function n(s){if(s===void 0)return;if(parseFloat(s)<1)Ae("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ae("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);else if(r===6)return this.setHex(parseInt(s,16),t);else Ae("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t="srgb"){let n=nu[e.toLowerCase()];if(n!==void 0)this.setHex(n,t);else Ae("Color: Unknown color "+e);return this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wn(e.r),this.g=Wn(e.g),this.b=Wn(e.b),this}copyLinearToSRGB(e){return this.r=is(e.r),this.g=is(e.g),this.b=is(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e="srgb"){return Xe.workingToColorSpace(Ot.copy(this),e),Math.round(Ke(Ot.r*255,0,255))*65536+Math.round(Ke(Ot.g*255,0,255))*256+Math.round(Ke(Ot.b*255,0,255))}getHexString(e="srgb"){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.workingToColorSpace(Ot.copy(this),t);let{r:n,g:i,b:s}=Ot,r=Math.max(n,i,s),a=Math.min(n,i,s),o,l,c=(a+r)/2;if(a===r)o=0,l=0;else{let h=r-a;switch(l=c<=0.5?h/(r+a):h/(2-r-a),r){case n:o=(i-s)/h+(i<s?6:0);break;case i:o=(s-n)/h+2;break;case s:o=(n-i)/h+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=Xe.workingColorSpace){return Xe.workingToColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e="srgb"){Xe.workingToColorSpace(Ot.copy(this),e);let{r:t,g:n,b:i}=Ot;if(e!=="srgb")return`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`;return`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ei),this.setHSL(ei.h+e,ei.s+t,ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ei),e.getHSL(_r);let n=Fs(ei.h,_r.h,t),i=Fs(ei.s,_r.s,t),s=Fs(ei.l,_r.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}var Ot=new Le;Le.NAMES=nu;class qs{constructor(e,t=1,n=1000){this.isFog=!0,this.name="",this.color=new Le(e),this.near=t,this.far=n}clone(){return new qs(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class ia extends ft{constructor(){super();if(this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){if(super.copy(e,t),e.background!==null)this.background=e.background.clone();if(e.environment!==null)this.environment=e.environment.clone();if(e.fog!==null)this.fog=e.fog.clone();if(this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null)this.overrideMaterial=e.overrideMaterial.clone();return this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);if(this.fog!==null)t.object.fog=this.fog.toJSON();return t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}var fn=new B,zn=new B,ka=new B,kn=new B,Yi=new B,Zi=new B,Pc=new B,Ha=new B,Ga=new B,Va=new B,Wa=new at,Xa=new at,qa=new at;class an{constructor(e=new B,t=new B,n=new B){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),fn.subVectors(e,t),i.cross(fn);let s=i.lengthSq();if(s>0)return i.multiplyScalar(1/Math.sqrt(s));return i.set(0,0,0)}static getBarycoord(e,t,n,i,s){fn.subVectors(i,t),zn.subVectors(n,t),ka.subVectors(e,t);let r=fn.dot(fn),a=fn.dot(zn),o=fn.dot(ka),l=zn.dot(zn),c=zn.dot(ka),h=r*l-a*a;if(h===0)return s.set(0,0,0),null;let d=1/h,u=(l*o-a*c)*d,p=(r*c-a*o)*d;return s.set(1-u-p,p,u)}static containsPoint(e,t,n,i){if(this.getBarycoord(e,t,n,i,kn)===null)return!1;return kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(e,t,n,i,s,r,a,o){if(this.getBarycoord(e,t,n,i,kn)===null){if(o.x=0,o.y=0,"z"in o)o.z=0;if("w"in o)o.w=0;return null}return o.setScalar(0),o.addScaledVector(s,kn.x),o.addScaledVector(r,kn.y),o.addScaledVector(a,kn.z),o}static getInterpolatedAttribute(e,t,n,i,s,r){return Wa.setScalar(0),Xa.setScalar(0),qa.setScalar(0),Wa.fromBufferAttribute(e,t),Xa.fromBufferAttribute(e,n),qa.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Wa,s.x),r.addScaledVector(Xa,s.y),r.addScaledVector(qa,s.z),r}static isFrontFacing(e,t,n,i){return fn.subVectors(n,t),zn.subVectors(e,t),fn.cross(zn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),zn.subVectors(this.a,this.b),fn.cross(zn).length()*0.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(0.3333333333333333)}getNormal(e){return an.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return an.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return an.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return an.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return an.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,a;Yi.subVectors(i,n),Zi.subVectors(s,n),Ha.subVectors(e,n);let o=Yi.dot(Ha),l=Zi.dot(Ha);if(o<=0&&l<=0)return t.copy(n);Ga.subVectors(e,i);let c=Yi.dot(Ga),h=Zi.dot(Ga);if(c>=0&&h<=c)return t.copy(i);let d=o*h-c*l;if(d<=0&&o>=0&&c<=0)return r=o/(o-c),t.copy(n).addScaledVector(Yi,r);Va.subVectors(e,s);let u=Yi.dot(Va),p=Zi.dot(Va);if(p>=0&&u<=p)return t.copy(s);let _=u*l-o*p;if(_<=0&&l>=0&&p<=0)return a=l/(l-p),t.copy(n).addScaledVector(Zi,a);let S=c*p-u*h;if(S<=0&&h-c>=0&&u-p>=0)return Pc.subVectors(s,i),a=(h-c)/(h-c+(u-p)),t.copy(i).addScaledVector(Pc,a);let m=1/(S+_+d);return r=_*m,a=d*m,t.copy(n).addScaledVector(Yi,r).addScaledVector(Zi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Vt{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=pn.copy(t).multiplyScalar(0.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(0.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,a=s.count;r<a;r++){if(e.isMesh===!0)e.getVertexPosition(r,pn);else pn.fromBufferAttribute(s,r);pn.applyMatrix4(e.matrixWorld),this.expandByPoint(pn)}else{if(e.boundingBox!==void 0){if(e.boundingBox===null)e.computeBoundingBox();xr.copy(e.boundingBox)}else{if(n.boundingBox===null)n.computeBoundingBox();xr.copy(n.boundingBox)}xr.applyMatrix4(e.matrixWorld),this.union(xr)}}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pn),pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;if(e.normal.x>0)t=e.normal.x*this.min.x,n=e.normal.x*this.max.x;else t=e.normal.x*this.max.x,n=e.normal.x*this.min.x;if(e.normal.y>0)t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y;else t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y;if(e.normal.z>0)t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z;else t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z;return t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Rs),vr.subVectors(this.max,Rs),Ki.subVectors(e.a,Rs),Ji.subVectors(e.b,Rs),$i.subVectors(e.c,Rs),ti.subVectors(Ji,Ki),ni.subVectors($i,Ji),xi.subVectors(Ki,$i);let t=[0,-ti.z,ti.y,0,-ni.z,ni.y,0,-xi.z,xi.y,ti.z,0,-ti.x,ni.z,0,-ni.x,xi.z,0,-xi.x,-ti.y,ti.x,0,-ni.y,ni.x,0,-xi.y,xi.x,0];if(!Ya(t,Ki,Ji,$i,vr))return!1;if(t=[1,0,0,0,1,0,0,0,1],!Ya(t,Ki,Ji,$i,vr))return!1;return yr.crossVectors(ti,ni),t=[yr.x,yr.y,yr.z],Ya(t,Ki,Ji,$i,vr)}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pn).distanceTo(e)}getBoundingSphere(e){if(this.isEmpty())e.makeEmpty();else this.getCenter(e.center),e.radius=this.getSize(pn).length()*0.5;return e}intersect(e){if(this.min.max(e.min),this.max.min(e.max),this.isEmpty())this.makeEmpty();return this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){if(this.isEmpty())return this;return Hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hn),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}var Hn=[new B,new B,new B,new B,new B,new B,new B,new B],pn=new B,xr=new Vt,Ki=new B,Ji=new B,$i=new B,ti=new B,ni=new B,xi=new B,Rs=new B,vr=new B,yr=new B,vi=new B;function Ya(e,t,n,i,s){for(let r=0,a=e.length-3;r<=a;r+=3){vi.fromArray(e,r);let o=s.x*Math.abs(vi.x)+s.y*Math.abs(vi.y)+s.z*Math.abs(vi.z),l=t.dot(vi),c=n.dot(vi),h=i.dot(vi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Tt=new B,Sr=new Fe,If=0;class Nt extends Yn{constructor(e,t,n=!1){super();if(Array.isArray(e))throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:If++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){if(e===!0)this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Sr.fromBufferAttribute(this,t),Sr.applyMatrix3(e),this.setXY(t,Sr.x,Sr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];if(this.normalized)n=mn(n,this.array);return n}setComponent(e,t,n){if(this.normalized)n=rt(n,this.array);return this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];if(this.normalized)t=mn(t,this.array);return t}setX(e,t){if(this.normalized)t=rt(t,this.array);return this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];if(this.normalized)t=mn(t,this.array);return t}setY(e,t){if(this.normalized)t=rt(t,this.array);return this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];if(this.normalized)t=mn(t,this.array);return t}setZ(e,t){if(this.normalized)t=rt(t,this.array);return this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];if(this.normalized)t=mn(t,this.array);return t}setW(e,t){if(this.normalized)t=rt(t,this.array);return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){if(e*=this.itemSize,this.normalized)t=rt(t,this.array),n=rt(n,this.array);return this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){if(e*=this.itemSize,this.normalized)t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array);return this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){if(e*=this.itemSize,this.normalized)t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),s=rt(s,this.array);return this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class sa extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ra extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class yt extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}}var Pf=new Vt,Cs=new B,Za=new B;class jt{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;if(t!==void 0)n.copy(t);else Pf.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);if(t.copy(e),n>this.radius*this.radius)t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center);return t}getBoundingBox(e){if(this.isEmpty())return e.makeEmpty(),e;return e.set(this.center,this.center),e.expandByScalar(this.radius),e}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Cs.subVectors(e,this.center);let t=Cs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*0.5;this.center.addScaledVector(Cs,i/n),this.radius+=i}return this}union(e){if(e.isEmpty())return this;if(this.isEmpty())return this.copy(e),this;if(this.center.equals(e.center)===!0)this.radius=Math.max(this.radius,e.radius);else Za.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Cs.copy(e.center).add(Za)),this.expandByPoint(Cs.copy(e.center).sub(Za));return this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}var Lf=0,rn=new Be,Ka=new ft,ji=new B,Zt=new Vt,Is=new Vt,Lt=new B;class Ct extends Yn{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=gn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){if(Array.isArray(e))this.index=new((tf(e))?ra:sa)(e,1);else this.index=e;return this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;if(t!==void 0)t.applyMatrix4(e),t.needsUpdate=!0;let n=this.attributes.normal;if(n!==void 0){let s=new Oe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;if(i!==void 0)i.transformDirection(e),i.needsUpdate=!0;if(this.boundingBox!==null)this.computeBoundingBox();if(this.boundingSphere!==null)this.computeBoundingSphere();return this._transformed=!0,this}applyQuaternion(e){return rn.makeRotationFromQuaternion(e),this.applyMatrix4(rn),this}rotateX(e){return rn.makeRotationX(e),this.applyMatrix4(rn),this}rotateY(e){return rn.makeRotationY(e),this.applyMatrix4(rn),this}rotateZ(e){return rn.makeRotationZ(e),this.applyMatrix4(rn),this}translate(e,t,n){return rn.makeTranslation(e,t,n),this.applyMatrix4(rn),this}scale(e,t,n){return rn.makeScale(e,t,n),this.applyMatrix4(rn),this}lookAt(e){return Ka.lookAt(e),Ka.updateMatrix(),this.applyMatrix4(Ka.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ji).negate(),this.translate(ji.x,ji.y,ji.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new yt(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}if(e.length>t.count)Ae("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.");t.needsUpdate=!0}return this}computeBoundingBox(){if(this.boundingBox===null)this.boundingBox=new Vt;let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];if(Zt.setFromBufferAttribute(s),this.morphTargetsRelative)Lt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Lt);else this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max)}}else this.boundingBox.makeEmpty();if(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))Ue('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){if(this.boundingSphere===null)this.boundingSphere=new jt;let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ue("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){let n=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let a=t[s];if(Is.setFromBufferAttribute(a),this.morphTargetsRelative)Lt.addVectors(Zt.min,Is.min),Zt.expandByPoint(Lt),Lt.addVectors(Zt.max,Is.max),Zt.expandByPoint(Lt);else Zt.expandByPoint(Is.min),Zt.expandByPoint(Is.max)}Zt.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)Lt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Lt));if(t)for(let s=0,r=t.length;s<r;s++){let a=t[s],o=this.morphTargetsRelative;for(let l=0,c=a.count;l<c;l++){if(Lt.fromBufferAttribute(a,l),o)ji.fromBufferAttribute(e,l),Lt.add(ji);i=Math.max(i,n.distanceToSquared(Lt))}}if(this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius))Ue('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ue("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let{position:n,normal:i,uv:s}=t,r=this.getAttribute("tangent");if(r===void 0||r.count!==n.count)r=new Nt(new Float32Array(4*n.count),4),this.setAttribute("tangent",r);let a=[],o=[];for(let R=0;R<n.count;R++)a[R]=new B,o[R]=new B;let l=new B,c=new B,h=new B,d=new Fe,u=new Fe,p=new Fe,_=new B,S=new B;function m(R,v,T){l.fromBufferAttribute(n,R),c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,T),d.fromBufferAttribute(s,R),u.fromBufferAttribute(s,v),p.fromBufferAttribute(s,T),c.sub(l),h.sub(l),u.sub(d),p.sub(d);let O=1/(u.x*p.y-p.x*u.y);if(!isFinite(O))return;_.copy(c).multiplyScalar(p.y).addScaledVector(h,-u.y).multiplyScalar(O),S.copy(h).multiplyScalar(u.x).addScaledVector(c,-p.x).multiplyScalar(O),a[R].add(_),a[v].add(_),a[T].add(_),o[R].add(S),o[v].add(S),o[T].add(S)}let f=this.groups;if(f.length===0)f=[{start:0,count:e.count}];for(let R=0,v=f.length;R<v;++R){let T=f[R],{start:O,count:P}=T;for(let C=O,k=O+P;C<k;C+=3)m(e.getX(C+0),e.getX(C+1),e.getX(C+2))}let w=new B,I=new B,y=new B,b=new B;function E(R){y.fromBufferAttribute(i,R),b.copy(y);let v=a[R];w.copy(v),w.sub(y.multiplyScalar(y.dot(v))).normalize(),I.crossVectors(b,v);let O=I.dot(o[R])<0?-1:1;r.setXYZW(R,w.x,w.y,w.z,O)}for(let R=0,v=f.length;R<v;++R){let T=f[R],{start:O,count:P}=T;for(let C=O,k=O+P;C<k;C+=3)E(e.getX(C+0)),E(e.getX(C+1)),E(e.getX(C+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,u=n.count;d<u;d++)n.setXYZ(d,0,0,0);let i=new B,s=new B,r=new B,a=new B,o=new B,l=new B,c=new B,h=new B;if(e)for(let d=0,u=e.count;d<u;d+=3){let p=e.getX(d+0),_=e.getX(d+1),S=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,S),c.subVectors(r,s),h.subVectors(i,s),c.cross(h),a.fromBufferAttribute(n,p),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,S),a.add(c),o.add(c),l.add(c),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(S,l.x,l.y,l.z)}else for(let d=0,u=t.count;d<u;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),c.subVectors(r,s),h.subVectors(i,s),c.cross(h),n.setXYZ(d+0,c.x,c.y,c.z),n.setXYZ(d+1,c.x,c.y,c.z),n.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(a,o){let{array:l,itemSize:c,normalized:h}=a,d=new l.constructor(o.length*c),u=0,p=0;for(let _=0,S=o.length;_<S;_++){if(a.isInterleavedBufferAttribute)u=o[_]*a.data.stride+a.offset;else u=o[_]*c;for(let m=0;m<c;m++)d[p++]=l[u++]}return new Nt(d,c,h)}if(this.index===null)return Ae("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new Ct,n=this.index.array,i=this.attributes;for(let a in i){let o=i[a],l=e(o,n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let o=[],l=s[a];for(let c=0,h=l.length;c<h;c++){let d=l[c],u=e(d,n);o.push(u)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let a=0,o=r.length;a<o;a++){let l=r[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0)e.userData=this.userData;if(this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let l in o)if(o[l]!==void 0)e[l]=o[l];return e}e.data={attributes:{}};let t=this.index;if(t!==null)e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)};let n=this.attributes;for(let o in n){let l=n[o];e.data.attributes[o]=l.toJSON(e.data)}let i={},s=!1;for(let o in this.morphAttributes){let l=this.morphAttributes[o],c=[];for(let h=0,d=l.length;h<d;h++){let u=l[h];c.push(u.toJSON(e.data))}if(c.length>0)i[o]=c,s=!0}if(s)e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;if(r.length>0)e.data.groups=JSON.parse(JSON.stringify(r));let a=this.boundingSphere;if(a!==null)e.data.boundingSphere=a.toJSON();return e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;if(n!==null)this.setIndex(n.clone());let i=e.attributes;for(let l in i){let c=i[l];this.setAttribute(l,c.clone(t))}let s=e.morphAttributes;for(let l in s){let c=[],h=s[l];for(let d=0,u=h.length;d<u;d++)c.push(h[d].clone(t));this.morphAttributes[l]=c}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let l=0,c=r.length;l<c;l++){let h=r[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;if(a!==null)this.boundingBox=a.clone();let o=e.boundingSphere;if(o!==null)this.boundingSphere=o.clone();return this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ys{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=gn()}onUploadCallback(){}set needsUpdate(e){if(e===!0)this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){if(e.arrayBuffers===void 0)e.arrayBuffers={};if(this.array.buffer._uuid===void 0)this.array.buffer._uuid=gn();if(e.arrayBuffers[this.array.buffer._uuid]===void 0)e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer;let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){if(e.arrayBuffers===void 0)e.arrayBuffers={};if(this.array.buffer._uuid===void 0)this.array.buffer._uuid=gn();if(e.arrayBuffers[this.array.buffer._uuid]===void 0)e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}var Gt=new B;class ps{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];if(this.normalized)n=mn(n,this.array);return n}setComponent(e,t,n){if(this.normalized)n=rt(n,this.array);return this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){if(this.normalized)t=rt(t,this.array);return this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){if(this.normalized)t=rt(t,this.array);return this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){if(this.normalized)t=rt(t,this.array);return this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){if(this.normalized)t=rt(t,this.array);return this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];if(this.normalized)t=mn(t,this.array);return t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];if(this.normalized)t=mn(t,this.array);return t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];if(this.normalized)t=mn(t,this.array);return t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];if(this.normalized)t=mn(t,this.array);return t}setXY(e,t,n){if(e=e*this.data.stride+this.offset,this.normalized)t=rt(t,this.array),n=rt(n,this.array);return this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){if(e=e*this.data.stride+this.offset,this.normalized)t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array);return this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){if(e=e*this.data.stride+this.offset,this.normalized)t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),s=rt(s,this.array);return this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Os("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else{if(e.interleavedBuffers===void 0)e.interleavedBuffers={};if(e.interleavedBuffers[this.data.uuid]===void 0)e.interleavedBuffers[this.data.uuid]=this.data.clone(e);return new ps(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}}toJSON(e){if(e===void 0){Os("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else{if(e.interleavedBuffers===void 0)e.interleavedBuffers={};if(e.interleavedBuffers[this.data.uuid]===void 0)e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e);return{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}}var Ja=new B,Nf=new B,Df=new Oe;class wn{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Ja.subVectors(n,t).cross(Nf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(Ja),s=this.normal.dot(i);if(s===0){if(this.distanceToPoint(e.start)===0)return t.copy(e.start);return null}let r=-(e.start.dot(this.normal)+this.constant)/s;if(n===!0&&(r<0||r>1))return null;return t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Df.getNormalMatrix(e),i=this.coplanarPoint(Ja).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}var Uf=0;class Qt extends Yn{constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=gn(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Le(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){if(this._alphaTest>0!==e>0)this.version++;this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e===void 0)return;for(let t in e){let n=e[t];if(n===void 0){Ae(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Ae(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}if(i&&i.isColor)i.set(n);else if(i&&i.isVector2&&(n&&n.isVector2)||i&&i.isEuler&&(n&&n.isEuler)||i&&i.isVector3&&(n&&n.isVector3))i.copy(n);else this[t]=n}}toJSON(e){let t=e===void 0||typeof e==="string";if(t)e={textures:{},images:{}};let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};if(n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor)n.color=this.color.getHex();if(this.roughness!==void 0)n.roughness=this.roughness;if(this.metalness!==void 0)n.metalness=this.metalness;if(this.sheen!==void 0)n.sheen=this.sheen;if(this.sheenColor&&this.sheenColor.isColor)n.sheenColor=this.sheenColor.getHex();if(this.sheenRoughness!==void 0)n.sheenRoughness=this.sheenRoughness;if(this.emissive&&this.emissive.isColor)n.emissive=this.emissive.getHex();if(this.emissiveIntensity!==void 0)n.emissiveIntensity=this.emissiveIntensity;if(this.specular&&this.specular.isColor)n.specular=this.specular.getHex();if(this.specularIntensity!==void 0)n.specularIntensity=this.specularIntensity;if(this.specularColor&&this.specularColor.isColor)n.specularColor=this.specularColor.getHex();if(this.shininess!==void 0)n.shininess=this.shininess;if(this.clearcoat!==void 0)n.clearcoat=this.clearcoat;if(this.clearcoatRoughness!==void 0)n.clearcoatRoughness=this.clearcoatRoughness;if(this.clearcoatMap&&this.clearcoatMap.isTexture)n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid;if(this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture)n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid;if(this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture)n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray();if(this.sheenColorMap&&this.sheenColorMap.isTexture)n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid;if(this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture)n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid;if(this.dispersion!==void 0)n.dispersion=this.dispersion;if(this.retroreflectivity!==void 0)n.retroreflectivity=this.retroreflectivity;if(this.iridescence!==void 0)n.iridescence=this.iridescence;if(this.iridescenceIOR!==void 0)n.iridescenceIOR=this.iridescenceIOR;if(this.iridescenceThicknessRange!==void 0)n.iridescenceThicknessRange=this.iridescenceThicknessRange;if(this.iridescenceMap&&this.iridescenceMap.isTexture)n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid;if(this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture)n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid;if(this.anisotropy!==void 0)n.anisotropy=this.anisotropy;if(this.anisotropyRotation!==void 0)n.anisotropyRotation=this.anisotropyRotation;if(this.anisotropyMap&&this.anisotropyMap.isTexture)n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid;if(this.map&&this.map.isTexture)n.map=this.map.toJSON(e).uuid;if(this.matcap&&this.matcap.isTexture)n.matcap=this.matcap.toJSON(e).uuid;if(this.alphaMap&&this.alphaMap.isTexture)n.alphaMap=this.alphaMap.toJSON(e).uuid;if(this.lightMap&&this.lightMap.isTexture)n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity;if(this.aoMap&&this.aoMap.isTexture)n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity;if(this.bumpMap&&this.bumpMap.isTexture)n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale;if(this.normalMap&&this.normalMap.isTexture)n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray();if(this.displacementMap&&this.displacementMap.isTexture)n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias;if(this.roughnessMap&&this.roughnessMap.isTexture)n.roughnessMap=this.roughnessMap.toJSON(e).uuid;if(this.metalnessMap&&this.metalnessMap.isTexture)n.metalnessMap=this.metalnessMap.toJSON(e).uuid;if(this.emissiveMap&&this.emissiveMap.isTexture)n.emissiveMap=this.emissiveMap.toJSON(e).uuid;if(this.specularMap&&this.specularMap.isTexture)n.specularMap=this.specularMap.toJSON(e).uuid;if(this.specularIntensityMap&&this.specularIntensityMap.isTexture)n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid;if(this.specularColorMap&&this.specularColorMap.isTexture)n.specularColorMap=this.specularColorMap.toJSON(e).uuid;if(this.envMap&&this.envMap.isTexture){if(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0)n.combine=this.combine}if(this.envMapRotation!==void 0)n.envMapRotation=this.envMapRotation.toArray();if(this.envMapIntensity!==void 0)n.envMapIntensity=this.envMapIntensity;if(this.reflectivity!==void 0)n.reflectivity=this.reflectivity;if(this.refractionRatio!==void 0)n.refractionRatio=this.refractionRatio;if(this.gradientMap&&this.gradientMap.isTexture)n.gradientMap=this.gradientMap.toJSON(e).uuid;if(this.transmission!==void 0)n.transmission=this.transmission;if(this.transmissionMap&&this.transmissionMap.isTexture)n.transmissionMap=this.transmissionMap.toJSON(e).uuid;if(this.thickness!==void 0)n.thickness=this.thickness;if(this.thicknessMap&&this.thicknessMap.isTexture)n.thicknessMap=this.thicknessMap.toJSON(e).uuid;if(this.attenuationDistance!==void 0)n.attenuationDistance=this.attenuationDistance;if(this.attenuationColor!==void 0)n.attenuationColor=this.attenuationColor.getHex();if(this.size!==void 0)n.size=this.size;if(this.sizeAttenuation!==void 0)n.sizeAttenuation=this.sizeAttenuation;if(Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0)n.clippingPlanes=this.clippingPlanes.map((s)=>s.toJSON());if(this.rotation!==void 0)n.rotation=this.rotation;if(this.depthPacking!==void 0)n.depthPacking=this.depthPacking;if(this.linewidth!==void 0)n.linewidth=this.linewidth;if(this.linecap!==void 0)n.linecap=this.linecap;if(this.linejoin!==void 0)n.linejoin=this.linejoin;if(this.dashSize!==void 0)n.dashSize=this.dashSize;if(this.gapSize!==void 0)n.gapSize=this.gapSize;if(this.scale!==void 0)n.scale=this.scale;if(this.wireframe!==void 0)n.wireframe=this.wireframe;if(this.wireframeLinewidth!==void 0)n.wireframeLinewidth=this.wireframeLinewidth;if(this.wireframeLinecap!==void 0)n.wireframeLinecap=this.wireframeLinecap;if(this.wireframeLinejoin!==void 0)n.wireframeLinejoin=this.wireframeLinejoin;if(this.flatShading!==void 0)n.flatShading=this.flatShading;if(this.fog!==void 0)n.fog=this.fog;if(Object.keys(this.userData).length>0)n.userData=this.userData;function i(s){let r=[];for(let a in s){let o=s[a];delete o.metadata,r.push(o)}return r}if(t){let s=i(e.textures),r=i(e.images);if(s.length>0)n.textures=s;if(r.length>0)n.images=r}return n}fromJSON(e,t){if(e.uuid!==void 0)this.uuid=e.uuid;if(e.name!==void 0)this.name=e.name;if(e.color!==void 0&&this.color!==void 0)this.color.setHex(e.color);if(e.roughness!==void 0)this.roughness=e.roughness;if(e.metalness!==void 0)this.metalness=e.metalness;if(e.sheen!==void 0)this.sheen=e.sheen;if(e.sheenColor!==void 0)this.sheenColor=new Le().setHex(e.sheenColor);if(e.sheenRoughness!==void 0)this.sheenRoughness=e.sheenRoughness;if(e.emissive!==void 0&&this.emissive!==void 0)this.emissive.setHex(e.emissive);if(e.specular!==void 0&&this.specular!==void 0)this.specular.setHex(e.specular);if(e.specularIntensity!==void 0)this.specularIntensity=e.specularIntensity;if(e.specularColor!==void 0&&this.specularColor!==void 0)this.specularColor.setHex(e.specularColor);if(e.shininess!==void 0)this.shininess=e.shininess;if(e.clearcoat!==void 0)this.clearcoat=e.clearcoat;if(e.clearcoatRoughness!==void 0)this.clearcoatRoughness=e.clearcoatRoughness;if(e.dispersion!==void 0)this.dispersion=e.dispersion;if(e.retroreflectivity!==void 0)this.retroreflectivity=e.retroreflectivity;if(e.iridescence!==void 0)this.iridescence=e.iridescence;if(e.iridescenceIOR!==void 0)this.iridescenceIOR=e.iridescenceIOR;if(e.iridescenceThicknessRange!==void 0)this.iridescenceThicknessRange=e.iridescenceThicknessRange;if(e.transmission!==void 0)this.transmission=e.transmission;if(e.thickness!==void 0)this.thickness=e.thickness;if(e.attenuationDistance!==void 0)this.attenuationDistance=e.attenuationDistance;if(e.attenuationColor!==void 0&&this.attenuationColor!==void 0)this.attenuationColor.setHex(e.attenuationColor);if(e.anisotropy!==void 0)this.anisotropy=e.anisotropy;if(e.anisotropyRotation!==void 0)this.anisotropyRotation=e.anisotropyRotation;if(e.fog!==void 0)this.fog=e.fog;if(e.flatShading!==void 0)this.flatShading=e.flatShading;if(e.blending!==void 0)this.blending=e.blending;if(e.combine!==void 0)this.combine=e.combine;if(e.side!==void 0)this.side=e.side;if(e.shadowSide!==void 0)this.shadowSide=e.shadowSide;if(e.opacity!==void 0)this.opacity=e.opacity;if(e.transparent!==void 0)this.transparent=e.transparent;if(e.alphaTest!==void 0)this.alphaTest=e.alphaTest;if(e.alphaHash!==void 0)this.alphaHash=e.alphaHash;if(e.depthFunc!==void 0)this.depthFunc=e.depthFunc;if(e.depthTest!==void 0)this.depthTest=e.depthTest;if(e.depthWrite!==void 0)this.depthWrite=e.depthWrite;if(e.colorWrite!==void 0)this.colorWrite=e.colorWrite;if(e.clippingPlanes!==void 0)this.clippingPlanes=e.clippingPlanes.map((n)=>new wn().fromJSON(n));if(e.clipIntersection!==void 0)this.clipIntersection=e.clipIntersection;if(e.clipShadows!==void 0)this.clipShadows=e.clipShadows;if(e.depthPacking!==void 0)this.depthPacking=e.depthPacking;if(e.blendSrc!==void 0)this.blendSrc=e.blendSrc;if(e.blendDst!==void 0)this.blendDst=e.blendDst;if(e.blendEquation!==void 0)this.blendEquation=e.blendEquation;if(e.blendSrcAlpha!==void 0)this.blendSrcAlpha=e.blendSrcAlpha;if(e.blendDstAlpha!==void 0)this.blendDstAlpha=e.blendDstAlpha;if(e.blendEquationAlpha!==void 0)this.blendEquationAlpha=e.blendEquationAlpha;if(e.blendColor!==void 0&&this.blendColor!==void 0)this.blendColor.setHex(e.blendColor);if(e.blendAlpha!==void 0)this.blendAlpha=e.blendAlpha;if(e.stencilWriteMask!==void 0)this.stencilWriteMask=e.stencilWriteMask;if(e.stencilFunc!==void 0)this.stencilFunc=e.stencilFunc;if(e.stencilRef!==void 0)this.stencilRef=e.stencilRef;if(e.stencilFuncMask!==void 0)this.stencilFuncMask=e.stencilFuncMask;if(e.stencilFail!==void 0)this.stencilFail=e.stencilFail;if(e.stencilZFail!==void 0)this.stencilZFail=e.stencilZFail;if(e.stencilZPass!==void 0)this.stencilZPass=e.stencilZPass;if(e.stencilWrite!==void 0)this.stencilWrite=e.stencilWrite;if(e.wireframe!==void 0)this.wireframe=e.wireframe;if(e.wireframeLinewidth!==void 0)this.wireframeLinewidth=e.wireframeLinewidth;if(e.wireframeLinecap!==void 0)this.wireframeLinecap=e.wireframeLinecap;if(e.wireframeLinejoin!==void 0)this.wireframeLinejoin=e.wireframeLinejoin;if(e.rotation!==void 0)this.rotation=e.rotation;if(e.linewidth!==void 0)this.linewidth=e.linewidth;if(e.linecap!==void 0)this.linecap=e.linecap;if(e.linejoin!==void 0)this.linejoin=e.linejoin;if(e.dashSize!==void 0)this.dashSize=e.dashSize;if(e.gapSize!==void 0)this.gapSize=e.gapSize;if(e.scale!==void 0)this.scale=e.scale;if(e.polygonOffset!==void 0)this.polygonOffset=e.polygonOffset;if(e.polygonOffsetFactor!==void 0)this.polygonOffsetFactor=e.polygonOffsetFactor;if(e.polygonOffsetUnits!==void 0)this.polygonOffsetUnits=e.polygonOffsetUnits;if(e.dithering!==void 0)this.dithering=e.dithering;if(e.alphaToCoverage!==void 0)this.alphaToCoverage=e.alphaToCoverage;if(e.premultipliedAlpha!==void 0)this.premultipliedAlpha=e.premultipliedAlpha;if(e.forceSinglePass!==void 0)this.forceSinglePass=e.forceSinglePass;if(e.allowOverride!==void 0)this.allowOverride=e.allowOverride;if(e.visible!==void 0)this.visible=e.visible;if(e.toneMapped!==void 0)this.toneMapped=e.toneMapped;if(e.userData!==void 0)this.userData=e.userData;if(e.vertexColors!==void 0)if(typeof e.vertexColors==="number")this.vertexColors=e.vertexColors>0;else this.vertexColors=e.vertexColors;if(e.size!==void 0)this.size=e.size;if(e.sizeAttenuation!==void 0)this.sizeAttenuation=e.sizeAttenuation;if(e.map!==void 0)this.map=t[e.map]||null;if(e.matcap!==void 0)this.matcap=t[e.matcap]||null;if(e.alphaMap!==void 0)this.alphaMap=t[e.alphaMap]||null;if(e.bumpMap!==void 0)this.bumpMap=t[e.bumpMap]||null;if(e.bumpScale!==void 0)this.bumpScale=e.bumpScale;if(e.normalMap!==void 0)this.normalMap=t[e.normalMap]||null;if(e.normalMapType!==void 0)this.normalMapType=e.normalMapType;if(e.normalScale!==void 0){let n=e.normalScale;if(Array.isArray(n)===!1)n=[n,n];this.normalScale=new Fe().fromArray(n)}if(e.displacementMap!==void 0)this.displacementMap=t[e.displacementMap]||null;if(e.displacementScale!==void 0)this.displacementScale=e.displacementScale;if(e.displacementBias!==void 0)this.displacementBias=e.displacementBias;if(e.roughnessMap!==void 0)this.roughnessMap=t[e.roughnessMap]||null;if(e.metalnessMap!==void 0)this.metalnessMap=t[e.metalnessMap]||null;if(e.emissiveMap!==void 0)this.emissiveMap=t[e.emissiveMap]||null;if(e.emissiveIntensity!==void 0)this.emissiveIntensity=e.emissiveIntensity;if(e.specularMap!==void 0)this.specularMap=t[e.specularMap]||null;if(e.specularIntensityMap!==void 0)this.specularIntensityMap=t[e.specularIntensityMap]||null;if(e.specularColorMap!==void 0)this.specularColorMap=t[e.specularColorMap]||null;if(e.envMap!==void 0)this.envMap=t[e.envMap]||null;if(e.envMapRotation!==void 0)this.envMapRotation.fromArray(e.envMapRotation);if(e.envMapIntensity!==void 0)this.envMapIntensity=e.envMapIntensity;if(e.reflectivity!==void 0)this.reflectivity=e.reflectivity;if(e.refractionRatio!==void 0)this.refractionRatio=e.refractionRatio;if(e.lightMap!==void 0)this.lightMap=t[e.lightMap]||null;if(e.lightMapIntensity!==void 0)this.lightMapIntensity=e.lightMapIntensity;if(e.aoMap!==void 0)this.aoMap=t[e.aoMap]||null;if(e.aoMapIntensity!==void 0)this.aoMapIntensity=e.aoMapIntensity;if(e.gradientMap!==void 0)this.gradientMap=t[e.gradientMap]||null;if(e.clearcoatMap!==void 0)this.clearcoatMap=t[e.clearcoatMap]||null;if(e.clearcoatRoughnessMap!==void 0)this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null;if(e.clearcoatNormalMap!==void 0)this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null;if(e.clearcoatNormalScale!==void 0)this.clearcoatNormalScale=new Fe().fromArray(e.clearcoatNormalScale);if(e.iridescenceMap!==void 0)this.iridescenceMap=t[e.iridescenceMap]||null;if(e.iridescenceThicknessMap!==void 0)this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null;if(e.transmissionMap!==void 0)this.transmissionMap=t[e.transmissionMap]||null;if(e.thicknessMap!==void 0)this.thicknessMap=t[e.thicknessMap]||null;if(e.anisotropyMap!==void 0)this.anisotropyMap=t[e.anisotropyMap]||null;if(e.sheenColorMap!==void 0)this.sheenColorMap=t[e.sheenColorMap]||null;if(e.sheenRoughnessMap!==void 0)this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null;return this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){if(e===!0)this.version++}}var Gn=new B,$a=new B,Mr=new B,br=new B;class Ii{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);if(n<0)return t.copy(this.origin);return t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Gn.subVectors(e,this.origin).dot(this.direction);if(t<0)return this.origin.distanceToSquared(e);return Gn.copy(this.origin).addScaledVector(this.direction,t),Gn.distanceToSquared(e)}distanceSqToSegment(e,t,n,i){$a.copy(e).add(t).multiplyScalar(0.5),Mr.copy(t).sub(e).normalize(),br.copy(this.origin).sub($a);let s=e.distanceTo(t)*0.5,r=-this.direction.dot(Mr),a=br.dot(this.direction),o=-br.dot(Mr),l=br.lengthSq(),c=Math.abs(1-r*r),h,d,u,p;if(c>0)if(h=r*o-a,d=r*a-o,p=s*c,h>=0)if(d>=-p)if(d<=p){let _=1/c;h*=_,d*=_,u=h*(h+r*d+2*a)+d*(r*h+d+2*o)+l}else d=s,h=Math.max(0,-(r*d+a)),u=-h*h+d*(d+2*o)+l;else d=-s,h=Math.max(0,-(r*d+a)),u=-h*h+d*(d+2*o)+l;else if(d<=-p)h=Math.max(0,-(-r*s+a)),d=h>0?-s:Math.min(Math.max(-s,-o),s),u=-h*h+d*(d+2*o)+l;else if(d<=p)h=0,d=Math.min(Math.max(-s,-o),s),u=d*(d+2*o)+l;else h=Math.max(0,-(r*s+a)),d=h>0?s:Math.min(Math.max(-s,-o),s),u=-h*h+d*(d+2*o)+l;else d=r>0?-s:s,h=Math.max(0,-(r*d+a)),u=-h*h+d*(d+2*o)+l;if(n)n.copy(this.origin).addScaledVector(this.direction,h);if(i)i.copy($a).addScaledVector(Mr,d);return u}intersectSphere(e,t){if(e.radius<0)return null;Gn.subVectors(e.center,this.origin);let n=Gn.dot(this.direction),i=Gn.dot(Gn)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),a=n-r,o=n+r;if(o<0)return null;if(a<0)return this.at(o,t);return this.at(a,t)}intersectsSphere(e){if(e.radius<0)return!1;return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0){if(e.distanceToPoint(this.origin)===0)return 0;return null}let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);if(n===null)return null;return this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);if(t===0)return!0;if(e.normal.dot(this.direction)*t<0)return!0;return!1}intersectBox(e,t){let n,i,s,r,a,o,l=1/this.direction.x,c=1/this.direction.y,h=1/this.direction.z,d=this.origin;if(l>=0)n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l;else n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l;if(c>=0)s=(e.min.y-d.y)*c,r=(e.max.y-d.y)*c;else s=(e.max.y-d.y)*c,r=(e.min.y-d.y)*c;if(n>r||s>i)return null;if(s>n||isNaN(n))n=s;if(r<i||isNaN(i))i=r;if(h>=0)a=(e.min.z-d.z)*h,o=(e.max.z-d.z)*h;else a=(e.max.z-d.z)*h,o=(e.min.z-d.z)*h;if(n>o||a>i)return null;if(a>n||n!==n)n=a;if(o<i||i!==i)i=o;if(i<0)return null;return this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Gn)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,a=this.direction,{x:o,y:l,z:c}=a,h=e.x-r.x,d=e.y-r.y,u=e.z-r.z,p=t.x-r.x,_=t.y-r.y,S=t.z-r.z,m=n.x-r.x,f=n.y-r.y,w=n.z-r.z,I=Math.abs(o),y=Math.abs(l),b=Math.abs(c),E,R,v,T,O,P,C,k,A,F,V,z;if(I>=y&&I>=b)if(v=o,P=h,A=p,z=m,o>=0)E=l,R=c,T=d,O=u,C=_,k=S,F=f,V=w;else E=c,R=l,T=u,O=d,C=S,k=_,F=w,V=f;else if(y>=b)if(v=l,P=d,A=_,z=f,l>=0)E=c,R=o,T=u,O=h,C=S,k=p,F=w,V=m;else E=o,R=c,T=h,O=u,C=p,k=S,F=m,V=w;else if(v=c,P=u,A=S,z=w,c>=0)E=o,R=l,T=h,O=d,C=p,k=_,F=m,V=f;else E=l,R=o,T=d,O=h,C=_,k=p,F=f,V=m;if(v===0)return null;let Q=E/v,W=R/v,K=1/v,ee=T-Q*P,Te=O-W*P,Se=C-Q*A,We=k-W*A,He=F-Q*z,Y=V-W*z,ie=He*We-Y*Se,re=ee*Y-Te*He,Re=Se*Te-We*ee;if(i){if(ie<0||re<0||Re<0)return null}else if((ie<0||re<0||Re<0)&&(ie>0||re>0||Re>0))return null;let Ne=ie+re+Re;if(Ne===0)return null;let ae=K*(ie*P+re*A+Re*z);if(Ne>0?ae<0:ae>0)return null;return this.at(ae/Ne,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ln extends Qt{constructor(e){super();this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=0,this.reflectivity=1,this.refractionRatio=0.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}var Lc=new Be,yi=new Ii,Tr=new jt,Nc=new B,Er=new B,wr=new B,Ar=new B,ja=new B,Rr=new B,Dc=new B,Cr=new B;class vt extends ft{constructor(e=new Ct,t=new ln){super();this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){if(super.copy(e,t),e.morphTargetInfluences!==void 0)this.morphTargetInfluences=e.morphTargetInfluences.slice();if(e.morphTargetDictionary!==void 0)this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary);return this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){Rr.set(0,0,0);for(let o=0,l=s.length;o<l;o++){let c=a[o],h=s[o];if(c===0)continue;if(ja.fromBufferAttribute(h,e),r)Rr.addScaledVector(ja,c);else Rr.addScaledVector(ja.sub(t),c)}t.add(Rr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;if(i===void 0)return;if(n.boundingSphere===null)n.computeBoundingSphere();if(Tr.copy(n.boundingSphere),Tr.applyMatrix4(s),yi.copy(e.ray).recast(e.near),Tr.containsPoint(yi.origin)===!1){if(yi.intersectSphere(Tr,Nc)===null)return;if(yi.origin.distanceToSquared(Nc)>(e.far-e.near)**2)return}if(Lc.copy(s).invert(),yi.copy(e.ray).applyMatrix4(Lc),n.boundingBox!==null){if(yi.intersectsBox(n.boundingBox)===!1)return}this._computeIntersections(e,t,yi)}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,a=s.index,o=s.attributes.position,l=s.attributes.uv,c=s.attributes.uv1,h=s.attributes.normal,{groups:d,drawRange:u}=s;if(a!==null)if(Array.isArray(r))for(let p=0,_=d.length;p<_;p++){let S=d[p],m=r[S.materialIndex],f=Math.max(S.start,u.start),w=Math.min(a.count,Math.min(S.start+S.count,u.start+u.count));for(let I=f,y=w;I<y;I+=3){let b=a.getX(I),E=a.getX(I+1),R=a.getX(I+2);if(i=Ir(this,m,e,n,l,c,h,b,E,R),i)i.faceIndex=Math.floor(I/3),i.face.materialIndex=S.materialIndex,t.push(i)}}else{let p=Math.max(0,u.start),_=Math.min(a.count,u.start+u.count);for(let S=p,m=_;S<m;S+=3){let f=a.getX(S),w=a.getX(S+1),I=a.getX(S+2);if(i=Ir(this,r,e,n,l,c,h,f,w,I),i)i.faceIndex=Math.floor(S/3),t.push(i)}}else if(o!==void 0)if(Array.isArray(r))for(let p=0,_=d.length;p<_;p++){let S=d[p],m=r[S.materialIndex],f=Math.max(S.start,u.start),w=Math.min(o.count,Math.min(S.start+S.count,u.start+u.count));for(let I=f,y=w;I<y;I+=3){let b=I,E=I+1,R=I+2;if(i=Ir(this,m,e,n,l,c,h,b,E,R),i)i.faceIndex=Math.floor(I/3),i.face.materialIndex=S.materialIndex,t.push(i)}}else{let p=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let S=p,m=_;S<m;S+=3){let f=S,w=S+1,I=S+2;if(i=Ir(this,r,e,n,l,c,h,f,w,I),i)i.faceIndex=Math.floor(S/3),t.push(i)}}}}function Ff(e,t,n,i,s,r,a,o){let l;if(t.side===1)l=i.intersectTriangle(a,r,s,!0,o);else l=i.intersectTriangle(s,r,a,t.side===0,o);if(l===null)return null;Cr.copy(o),Cr.applyMatrix4(e.matrixWorld);let c=n.ray.origin.distanceTo(Cr);if(c<n.near||c>n.far)return null;return{distance:c,point:Cr.clone(),object:e}}function Ir(e,t,n,i,s,r,a,o,l,c){e.getVertexPosition(o,Er),e.getVertexPosition(l,wr),e.getVertexPosition(c,Ar);let h=Ff(e,t,n,i,Er,wr,Ar,Dc);if(h){let d=new B;if(an.getBarycoord(Dc,Er,wr,Ar,d),s)h.uv=an.getInterpolatedAttribute(s,o,l,c,d,new Fe);if(r)h.uv1=an.getInterpolatedAttribute(r,o,l,c,d,new Fe);if(a){if(h.normal=an.getInterpolatedAttribute(a,o,l,c,d,new B),h.normal.dot(i.direction)>0)h.normal.multiplyScalar(-1)}let u={a:o,b:l,c,normal:new B,materialIndex:0};an.getNormal(Er,wr,Ar,u.normal),h.face=u,h.barycoord=d}return h}var Ps=new at,Uc=new at,Fc=new at,Of=new at,Oc=new Be,Pr=new B,Qa=new jt,Bc=new Be,eo=new Ii;class aa extends vt{constructor(e,t){super(e,t);this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode="attached",this.bindMatrix=new Be,this.bindMatrixInverse=new Be,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;if(this.boundingBox===null)this.boundingBox=new Vt;this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Pr),this.boundingBox.expandByPoint(Pr)}computeBoundingSphere(){let e=this.geometry;if(this.boundingSphere===null)this.boundingSphere=new jt;this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Pr),this.boundingSphere.expandByPoint(Pr)}copy(e,t){if(super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null)this.boundingBox=e.boundingBox.clone();if(e.boundingSphere!==null)this.boundingSphere=e.boundingSphere.clone();return this}raycast(e,t){let n=this.material,i=this.matrixWorld;if(n===void 0)return;if(this.boundingSphere===null)this.computeBoundingSphere();if(Qa.copy(this.boundingSphere),Qa.applyMatrix4(i),e.ray.intersectsSphere(Qa)===!1)return;if(Bc.copy(i).invert(),eo.copy(e.ray).applyMatrix4(Bc),this.boundingBox!==null){if(eo.intersectsBox(this.boundingBox)===!1)return}this._computeIntersections(e,t,eo)}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){if(this.skeleton=e,t===void 0)this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld;this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();if(s!==1/0)e.multiplyScalar(s);else e.set(1,0,0,0);t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.bindMode==="attached")this.bindMatrixInverse.copy(this.matrixWorld).invert();else if(this.bindMode==="detached")this.bindMatrixInverse.copy(this.bindMatrix).invert();else Ae("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;if(Uc.fromBufferAttribute(i.attributes.skinIndex,e),Fc.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4)Ps.copy(t),t.set(0,0,0,0);else Ps.set(...t,1),t.set(0,0,0);Ps.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=Fc.getComponent(s);if(r!==0){let a=Uc.getComponent(s);Oc.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Of.copy(Ps).applyMatrix4(Oc),r)}}if(t.isVector4)t.w=Ps.w;return t.applyMatrix4(this.bindMatrixInverse)}}class Zs extends ft{constructor(){super();this.isBone=!0,this.type="Bone"}}class Ks extends Et{constructor(e=null,t=1,n=1,i,s,r,a,o,l=1003,c=1003,h,d){super(null,r,a,o,l,c,i,s,h,d);this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}var zc=new Be,Bf=new Be;class Js{constructor(e=[],t=[]){this.uuid=gn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ae("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Be)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Be;if(this.bones[e])n.copy(this.bones[e].matrixWorld).invert();this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];if(n)n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];if(n){if(n.parent&&n.parent.isBone)n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld);else n.matrix.copy(n.matrixWorld);n.matrix.decompose(n.position,n.quaternion,n.scale)}}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let a=e[s]?e[s].matrixWorld:Bf;zc.multiplyMatrices(a,t[s]),zc.toArray(n,s*16)}if(i!==null)i.needsUpdate=!0}clone(){return new Js(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Ks(t,e,e,1023,1015);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}return}dispose(){if(this.boneTexture!==null)this.boneTexture.dispose(),this.boneTexture=null}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=t[s];if(r===void 0)Ae("Skeleton: No bone found with UUID:",s),r=new Zs;this.bones.push(r),this.boneInverses.push(new Be().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let r=t[i];e.bones.push(r.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}}class ri extends Nt{constructor(e,t,n,i=1){super(e,t,n);this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}var Qi=new Be,kc=new Be,Lr=[],Hc=new Vt,zf=new Be,Ls=new vt,Ns=new jt;class oa extends vt{constructor(e,t,n){super(e,t);this.isInstancedMesh=!0,this.instanceMatrix=new ri(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,zf)}computeBoundingBox(){let e=this.geometry,t=this.count;if(this.boundingBox===null)this.boundingBox=new Vt;if(e.boundingBox===null)e.computeBoundingBox();this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),Hc.copy(e.boundingBox).applyMatrix4(Qi),this.boundingBox.union(Hc)}computeBoundingSphere(){let e=this.geometry,t=this.count;if(this.boundingSphere===null)this.boundingSphere=new jt;if(e.boundingSphere===null)e.computeBoundingSphere();this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),Ns.copy(e.boundingSphere).applyMatrix4(Qi),this.boundingSphere.union(Ns)}copy(e,t){if(super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null)this.morphTexture=e.morphTexture.clone();if(e.instanceColor!==null)this.instanceColor=e.instanceColor.clone();if(this.count=e.count,e.boundingBox!==null)this.boundingBox=e.boundingBox.clone();if(e.boundingSphere!==null)this.boundingSphere=e.boundingSphere.clone();return this}getColorAt(e,t){if(this.instanceColor===null)return t.setRGB(1,1,1);else return t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[r+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Ls.geometry=this.geometry,Ls.material=this.material,Ls.material===void 0)return;if(this.boundingSphere===null)this.computeBoundingSphere();if(Ns.copy(this.boundingSphere),Ns.applyMatrix4(n),e.ray.intersectsSphere(Ns)===!1)return;for(let s=0;s<i;s++){this.getMatrixAt(s,Qi),kc.multiplyMatrices(n,Qi),Ls.matrixWorld=kc,Ls.raycast(e,Lr);for(let r=0,a=Lr.length;r<a;r++){let o=Lr[r];o.instanceId=s,o.object=this,t.push(o)}Lr.length=0}}setColorAt(e,t){if(this.instanceColor===null)this.instanceColor=new ri(new Float32Array(this.instanceMatrix.count*3).fill(1),3);return t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;if(this.morphTexture===null)this.morphTexture=new Ks(new Float32Array(i*this.count),i,this.count,1028,1015);let s=this.morphTexture.source.data.data,r=0;for(let l=0;l<n.length;l++)r+=n[l];let a=this.geometry.morphTargetsRelative?1:1-r,o=i*e;return s[o]=a,s.set(n,o+1),this}updateMorphTargets(){}dispose(){if(super.dispose(),this.morphTexture!==null)this.morphTexture.dispose(),this.morphTexture=null}}var Si=new jt,kf=new Fe(0.5,0.5),Nr=new B;class $s{constructor(e=new wn,t=new wn,n=new wn,i=new wn,s=new wn,r=new wn){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2000,n=!1){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],p=s[8],_=s[9],S=s[10],m=s[11],f=s[12],w=s[13],I=s[14],y=s[15];if(i[0].setComponents(l-r,u-c,m-p,y-f).normalize(),i[1].setComponents(l+r,u+c,m+p,y+f).normalize(),i[2].setComponents(l+a,u+h,m+_,y+w).normalize(),i[3].setComponents(l-a,u-h,m-_,y-w).normalize(),n)i[4].setComponents(o,d,S,I).normalize(),i[5].setComponents(l-o,u-d,m-S,y-I).normalize();else if(i[4].setComponents(l-o,u-d,m-S,y-I).normalize(),t===2000)i[5].setComponents(l+o,u+d,m+S,y+I).normalize();else if(t===2001)i[5].setComponents(o,d,S,I).normalize();else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0){if(e.boundingSphere===null)e.computeBoundingSphere();Si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld)}else{let t=e.geometry;if(t.boundingSphere===null)t.computeBoundingSphere();Si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(e){Si.center.set(0,0,0);let t=kf.distanceTo(e.center);return Si.radius=0.7071067811865476+t,Si.applyMatrix4(e.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Nr.x=i.normal.x>0?e.max.x:e.min.x,Nr.y=i.normal.y>0?e.max.y:e.min.y,Nr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Nr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class js extends Qt{constructor(e){super();this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}var Hr=new B,Gr=new B,Gc=new Be,Ds=new Ii,Dr=new jt,to=new B,Vc=new B;class ms extends ft{constructor(e=new Ct,t=new js){super();this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Hr.fromBufferAttribute(t,i-1),Gr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Hr.distanceTo(Gr);e.setAttribute("lineDistance",new yt(n,1))}else Ae("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null)n.computeBoundingSphere();if(Dr.copy(n.boundingSphere),Dr.applyMatrix4(i),Dr.radius+=s,e.ray.intersectsSphere(Dr)===!1)return;Gc.copy(i).invert(),Ds.copy(e.ray).applyMatrix4(Gc);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=this.isLineSegments?2:1,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,r.start),p=Math.min(c.count,r.start+r.count);for(let _=u,S=p-1;_<S;_+=l){let m=c.getX(_),f=c.getX(_+1),w=Ur(this,e,Ds,o,m,f,_);if(w)t.push(w)}if(this.isLineLoop){let _=c.getX(p-1),S=c.getX(u),m=Ur(this,e,Ds,o,_,S,p-1);if(m)t.push(m)}}else{let u=Math.max(0,r.start),p=Math.min(d.count,r.start+r.count);for(let _=u,S=p-1;_<S;_+=l){let m=Ur(this,e,Ds,o,_,_+1,_);if(m)t.push(m)}if(this.isLineLoop){let _=Ur(this,e,Ds,o,p-1,u,p-1);if(_)t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ur(e,t,n,i,s,r,a){let o=e.geometry.attributes.position;if(Hr.fromBufferAttribute(o,s),Gr.fromBufferAttribute(o,r),n.distanceSqToSegment(Hr,Gr,to,Vc)>i)return;to.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(to);if(c<t.near||c>t.far)return;return{distance:c,point:Vc.clone().applyMatrix4(e.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:e}}var Wc=new B,Xc=new B;class la extends ms{constructor(e,t){super(e,t);this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Wc.fromBufferAttribute(t,i),Xc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Wc.distanceTo(Xc);e.setAttribute("lineDistance",new yt(n,1))}else Ae("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ca extends ms{constructor(e,t){super(e,t);this.isLineLoop=!0,this.type="LineLoop"}}class Qs extends Qt{constructor(e){super();this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Le(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}var qc=new Be,so=new Ii,Fr=new jt,Or=new B;class ha extends ft{constructor(e=new Ct,t=new Qs){super();this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null)n.computeBoundingSphere();if(Fr.copy(n.boundingSphere),Fr.applyMatrix4(i),Fr.radius+=s,e.ray.intersectsSphere(Fr)===!1)return;qc.copy(i).invert(),so.copy(e.ray).applyMatrix4(qc);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=n.index,h=n.attributes.position;if(l!==null){let d=Math.max(0,r.start),u=Math.min(l.count,r.start+r.count);for(let p=d,_=u;p<_;p++){let S=l.getX(p);Or.fromBufferAttribute(h,S),Yc(Or,S,o,i,e,t,this)}}else{let d=Math.max(0,r.start),u=Math.min(h.count,r.start+r.count);for(let p=d,_=u;p<_;p++)Or.fromBufferAttribute(h,p),Yc(Or,p,o,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Yc(e,t,n,i,s,r,a){let o=so.distanceSqToPoint(e);if(o<n){let l=new B;so.closestPointToPoint(e,l),l.applyMatrix4(i);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class ua extends Et{constructor(e=[],t=301,n,i,s,r,a,o,l,c){super(e,t,n,i,s,r,a,o,l,c);this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Pi extends Et{constructor(e,t,n=1014,i,s,r,a=1003,o=1003,l,c=1026,h=1){if(c!==1026&&c!==1027)throw Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,i,s,r,a,o,c,n,l);this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Vs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class ul extends Pi{constructor(e,t=1014,n=301,i,s,r=1003,a=1003,o,l=1026){let c={width:e,height:e,depth:1},h=[c,c,c,c,c,c];super(e,e,t,n,i,s,r,a,o,l);this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class da extends Et{constructor(e=null){super();this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class gs extends Ct{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super();this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let a=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let o=[],l=[],c=[],h=[],d=0,u=0;p("z","y","x",-1,-1,n,t,e,r,s,0),p("z","y","x",1,-1,n,t,-e,r,s,1),p("x","z","y",1,1,e,n,t,i,r,2),p("x","z","y",1,-1,e,n,-t,i,r,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new yt(l,3)),this.setAttribute("normal",new yt(c,3)),this.setAttribute("uv",new yt(h,2));function p(_,S,m,f,w,I,y,b,E,R,v){let T=I/E,O=y/R,P=I/2,C=y/2,k=b/2,A=E+1,F=R+1,V=0,z=0,Q=new B;for(let W=0;W<F;W++){let K=W*O-C;for(let ee=0;ee<A;ee++){let Te=ee*T-P;Q[_]=Te*f,Q[S]=K*w,Q[m]=k,l.push(Q.x,Q.y,Q.z),Q[_]=0,Q[S]=0,Q[m]=b>0?1:-1,c.push(Q.x,Q.y,Q.z),h.push(ee/E),h.push(1-W/R),V+=1}}for(let W=0;W<R;W++)for(let K=0;K<E;K++){let ee=d+K+A*W,Te=d+K+A*(W+1),Se=d+(K+1)+A*(W+1),We=d+(K+1)+A*W;o.push(ee,Te,We),o.push(Te,Se,We),z+=6}a.addGroup(u,z,v),u+=z,d+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class er extends Ct{constructor(e=1,t=1,n=1,i=1){super();this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,a=Math.floor(n),o=Math.floor(i),l=a+1,c=o+1,h=e/a,d=t/o,u=[],p=[],_=[],S=[];for(let m=0;m<c;m++){let f=m*d-r;for(let w=0;w<l;w++){let I=w*h-s;p.push(I,-f,0),_.push(0,0,1),S.push(w/a),S.push(1-m/o)}}for(let m=0;m<o;m++)for(let f=0;f<a;f++){let w=f+l*m,I=f+l*(m+1),y=f+1+l*(m+1),b=f+1+l*m;u.push(w,I,b),u.push(I,y,b)}this.setIndex(u),this.setAttribute("position",new yt(p,3)),this.setAttribute("normal",new yt(_,3)),this.setAttribute("uv",new yt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new er(e.width,e.height,e.widthSegments,e.heightSegments)}}class tr extends Ct{constructor(e=0.5,t=1,n=32,i=1,s=0,r=Math.PI*2){super();this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:r},n=Math.max(3,n),i=Math.max(1,i);let a=[],o=[],l=[],c=[],h=e,d=(t-e)/i,u=new B,p=new Fe;for(let _=0;_<=i;_++){for(let S=0;S<=n;S++){let m=s+S/n*r;u.x=h*Math.cos(m),u.y=h*Math.sin(m),o.push(u.x,u.y,u.z),l.push(0,0,1),p.x=(u.x/t+1)/2,p.y=(u.y/t+1)/2,c.push(p.x,p.y)}h+=d}for(let _=0;_<i;_++){let S=_*(n+1);for(let m=0;m<n;m++){let f=m+S,w=f,I=f+n+1,y=f+n+2,b=f+1;a.push(w,I,b),a.push(I,y,b)}}this.setIndex(a),this.setAttribute("position",new yt(o,3)),this.setAttribute("normal",new yt(l,3)),this.setAttribute("uv",new yt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tr(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}function Li(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];if(Zc(s))if(s.isRenderTargetTexture)Ae("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null;else t[n][i]=s.clone();else if(Array.isArray(s))if(Zc(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[n][i]=r}else t[n][i]=s.slice();else t[n][i]=s}}return t}function zt(e){let t={};for(let n=0;n<e.length;n++){let i=Li(e[n]);for(let s in i)t[s]=i[s]}return t}function Zc(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Hf(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function dl(e){let t=e.getRenderTarget();if(t===null)return e.outputColorSpace;if(t.isXRRenderTarget===!0)return t.texture.colorSpace;return Xe.workingColorSpace}var iu={clone:Li,merge:zt},Gf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Vf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class cn extends Qt{constructor(e){super();if(this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gf,this.fragmentShader=Vf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0)this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Li(e.uniforms),this.uniformsGroups=Hf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;if(r&&r.isTexture)t.uniforms[i]={type:"t",value:r.toJSON(e).uuid};else if(r&&r.isColor)t.uniforms[i]={type:"c",value:r.getHex()};else if(r&&r.isVector2)t.uniforms[i]={type:"v2",value:r.toArray()};else if(r&&r.isVector3)t.uniforms[i]={type:"v3",value:r.toArray()};else if(r&&r.isVector4)t.uniforms[i]={type:"v4",value:r.toArray()};else if(r&&r.isMatrix3)t.uniforms[i]={type:"m3",value:r.toArray()};else if(r&&r.isMatrix4)t.uniforms[i]={type:"m4",value:r.toArray()};else t.uniforms[i]={value:r}}if(Object.keys(this.defines).length>0)t.defines=this.defines;t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)if(this.extensions[i]===!0)n[i]=!0;if(Object.keys(n).length>0)t.extensions=n;return t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Le().setHex(i.value);break;case"v2":this.uniforms[n].value=new Fe().fromArray(i.value);break;case"v3":this.uniforms[n].value=new B().fromArray(i.value);break;case"v4":this.uniforms[n].value=new at().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Oe().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Be().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0)this.defines=e.defines;if(e.vertexShader!==void 0)this.vertexShader=e.vertexShader;if(e.fragmentShader!==void 0)this.fragmentShader=e.fragmentShader;if(e.glslVersion!==void 0)this.glslVersion=e.glslVersion;if(e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];if(e.lights!==void 0)this.lights=e.lights;if(e.clipping!==void 0)this.clipping=e.clipping;return this}}class fl extends cn{constructor(e){super(e);this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class _s extends Qt{constructor(e){super();this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Le(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class en extends _s{constructor(e){super();this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Fe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ke(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+0.4*t)/(1-0.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Le(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Le(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Le(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){if(this._anisotropy>0!==e>0)this.version++;this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){if(this._clearcoat>0!==e>0)this.version++;this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){if(this._iridescence>0!==e>0)this.version++;this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){if(this._dispersion>0!==e>0)this.version++;this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){if(this._retroreflectivity>0!==e>0)this.version++;this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){if(this._sheen>0!==e>0)this.version++;this._sheen=e}get transmission(){return this._transmission}set transmission(e){if(this._transmission>0!==e>0)this.version++;this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class pl extends Qt{constructor(e){super();this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ml extends Qt{constructor(e){super();this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function si(e,t){if(!e||e.constructor===t)return e;if(typeof t.BYTES_PER_ELEMENT==="number")return new t(e);return Array.prototype.slice.call(e)}function kr(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}function Wf(e){function t(s,r){return e[s]-e[r]}let n=e.length,i=Array(n);for(let s=0;s!==n;++s)i[s]=s;return i.sort(t),i}function Kc(e,t,n){let i=e.length,s=new e.constructor(i);for(let r=0,a=0;a!==i;++r){let o=n[r]*t;for(let l=0;l!==t;++l)s[a++]=e[o+l]}return s}function Xf(e,t,n,i){let s=1,r=e[0];while(r!==void 0&&r[i]===void 0)r=e[s++];if(r===void 0)return;let a=r[i];if(a===void 0)return;if(Array.isArray(a))do{if(a=r[i],a!==void 0)t.push(r.time),n.push(...a);r=e[s++]}while(r!==void 0);else if(a.toArray!==void 0)do{if(a=r[i],a!==void 0)t.push(r.time),a.toArray(n,n.length);r=e[s++]}while(r!==void 0);else do{if(a=r[i],a!==void 0)t.push(r.time),n.push(a);r=e[s++]}while(r!==void 0)}class Zn{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let r;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break e}r=t.length;break t}if(!(e>=s)){let a=t[1];if(e<a)n=2,s=a;for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=t[--n-1],e>=s)break e}r=n,n=0;break t}break n}while(n<r){let a=n+r>>>1;if(e<t[a])r=a;else n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class gl extends Zn{constructor(e,t,n,i){super(e,t,n,i);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,a=i[s],o=i[r];if(a===void 0)switch(this.getSettings_().endingStart){case 2401:s=e,a=2*t-n;break;case 2402:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(o===void 0)switch(this.getSettings_().endingEnd){case 2401:r=e,o=2*n-t;break;case 2402:r=1,o=n+i[1]-i[0];break;default:r=e-1,o=t}let l=(n-t)*0.5,c=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(o-n),this._offsetPrev=s*c,this._offsetNext=r*c}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,u=this._weightNext,p=(n-t)/(i-t),_=p*p,S=_*p,m=-d*S+2*d*_-d*p,f=(1+d)*S+(-1.5-2*d)*_+(-0.5+d)*p+1,w=(-1-u)*S+(1.5+u)*_+0.5*p,I=u*S-u*_;for(let y=0;y!==a;++y)s[y]=m*r[c+y]+f*r[l+y]+w*r[o+y]+I*r[h+y];return s}}class _l extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=(n-t)/(i-t),h=1-c;for(let d=0;d!==a;++d)s[d]=r[l+d]*h+r[o+d]*c;return s}}class xl extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class vl extends Zn{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=this.inTangents,h=this.outTangents;if(!c||!h){let p=(n-t)/(i-t),_=1-p;for(let S=0;S!==a;++S)s[S]=r[l+S]*_+r[o+S]*p;return s}let d=a*2,u=e-1;for(let p=0;p!==a;++p){let _=r[l+p],S=r[o+p],m=u*d+p*2,f=h[m],w=h[m+1],I=e*d+p*2,y=c[I],b=c[I+1],E=Yf(n,t,f,y,i);s[p]=su(E,_,w,b,S)}return s}}function su(e,t,n,i,s){let r=1-e;return r*r*r*t+3*r*r*e*n+3*r*e*e*i+e*e*e*s}function qf(e,t,n,i,s){let r=1-e;return 3*r*r*(n-t)+6*r*e*(i-n)+3*e*e*(s-i)}function Yf(e,t,n,i,s){let r=(e-t)/(s-t);for(let a=0;a<8;a++){let o=su(r,t,n,i,s)-e;if(Math.abs(o)<0.0000000001)break;let l=qf(r,t,n,i,s);if(Math.abs(l)<0.0000000001)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class tn{constructor(e,t,n,i){if(e===void 0)throw Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=si(t,this.TimeBufferType),this.values=si(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:si(e.times,Array),values:si(e.values,Array)};let i=e.getInterpolation();if(i!==e.DefaultInterpolation)n.interpolation=i;if(kr(e.settings))n.settings={inTangents:si(e.settings.inTangents,Array),outTangents:si(e.settings.outTangents,Array)}}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new xl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new _l(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new gl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new vl(this.times,this.values,this.getValueSize(),e);if(this.settings)t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents;return t}setInterpolation(e){let t;switch(e){case 2300:t=this.InterpolantFactoryMethodDiscrete;break;case 2301:t=this.InterpolantFactoryMethodLinear;break;case 2302:t=this.InterpolantFactoryMethodSmooth;break;case 2303:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(n);return Ae("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302;case this.InterpolantFactoryMethodBezier:return 2303}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;if(kr(this.settings))Jc(this.settings.inTangents,e),Jc(this.settings.outTangents,e)}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;while(s!==i&&n[s]<e)++s;while(r!==-1&&n[r]>t)--r;if(++r,s!==0||r!==i){if(s>=r)r=Math.max(r,1),s=r-1;let a=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*a,r*a)}return this}validate(){let e=!0,t=this.getValueSize();if(t-Math.floor(t)!==0)Ue("KeyframeTrack: Invalid value size in track.",this),e=!1;let n=this.times,i=this.values,s=n.length;if(s===0)Ue("KeyframeTrack: Track is empty.",this),e=!1;let r=null;for(let a=0;a!==s;a++){let o=n[a];if(typeof o==="number"&&isNaN(o)){Ue("KeyframeTrack: Time is not a valid number.",this,a,o),e=!1;break}if(r!==null&&r>o){Ue("KeyframeTrack: Out of order keys.",this,a,o,r),e=!1;break}r=o}if(i!==void 0){if(nf(i))for(let a=0,o=i.length;a!==o;++a){let l=i[a];if(isNaN(l)){Ue("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===2302,s=e.length-1,r=1;for(let a=1;a<s;++a){let o=!1,l=e[a],c=e[a+1];if(l!==c&&(a!==1||l!==e[0]))if(!i){let h=a*n,d=h-n,u=h+n;for(let p=0;p!==n;++p){let _=t[h+p];if(_!==t[d+p]||_!==t[u+p]){o=!0;break}}}else o=!0;if(o){if(a!==r){e[r]=e[a];let h=a*n,d=r*n;for(let u=0;u!==n;++u)t[d+u]=t[h+u]}++r}}if(s>0){e[r]=e[s];for(let a=s*n,o=r*n,l=0;l!==n;++l)t[o+l]=t[a+l];++r}if(r!==e.length)this.times=e.slice(0,r),this.values=t.slice(0,r*n);else this.times=e,this.values=t;return this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);if(i.createInterpolant=this.createInterpolant,kr(this.settings))i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()};return i}}function Jc(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]*=t}tn.prototype.ValueTypeName="";tn.prototype.TimeBufferType=Float32Array;tn.prototype.ValueBufferType=Float32Array;tn.prototype.DefaultInterpolation=2301;class ci extends tn{constructor(e,t,n){super(e,t,n)}}ci.prototype.ValueTypeName="bool";ci.prototype.ValueBufferType=Array;ci.prototype.DefaultInterpolation=2300;ci.prototype.InterpolantFactoryMethodLinear=void 0;ci.prototype.InterpolantFactoryMethodSmooth=void 0;class fa extends tn{constructor(e,t,n,i){super(e,t,n,i)}}fa.prototype.ValueTypeName="color";class hi extends tn{constructor(e,t,n,i){super(e,t,n,i)}}hi.prototype.ValueTypeName="number";class yl extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=(n-t)/(i-t),l=e*a;for(let c=l+a;l!==c;l+=4)on.slerpFlat(s,0,r,l-a,r,l,o);return s}}class ui extends tn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new yl(this.times,this.values,this.getValueSize(),e)}}ui.prototype.ValueTypeName="quaternion";ui.prototype.InterpolantFactoryMethodSmooth=void 0;class di extends tn{constructor(e,t,n){super(e,t,n)}}di.prototype.ValueTypeName="string";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=2300;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;class Ni extends tn{constructor(e,t,n,i){super(e,t,n,i)}}Ni.prototype.ValueTypeName="vector";class pa{constructor(e="",t=-1,n=[],i=2500){if(this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=gn(),this.userData={},this.duration<0)this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,a=n.length;r!==a;++r)t.push(Kf(n[r]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)t.push(tn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,r=[];for(let a=0;a<s;a++){let o=[],l=[];o.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);let c=Wf(o);if(o=Kc(o,1,c),l=Kc(l,1,c),!i&&o[0]===0)o.push(s),l.push(l[0]);r.push(new hi(".morphTargetInfluences["+t[a].name+"]",o,l).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,o=e.length;a<o;a++){let l=e[a],c=l.name.match(s);if(c&&c.length>1){let h=c[1],d=i[h];if(!d)i[h]=d=[];d.push(l)}}let r=[];for(let a in i)r.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return r}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Zf(e){switch(e.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return hi;case"vector":case"vector2":case"vector3":case"vector4":return Ni;case"color":return fa;case"quaternion":return ui;case"bool":case"boolean":return ci;case"string":return di}throw Error("THREE.KeyframeTrack: Unsupported typeName: "+e)}function Kf(e){if(e.type===void 0)throw Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=Zf(e.type);if(e.times===void 0){let i=[],s=[];Xf(e.keys,i,s,"value"),e.times=i,e.values=s}let n;if(t.parse!==void 0)n=t.parse(e);else n=new t(e.name,e.times,e.values,e.interpolation);if(kr(e.settings))n.settings={inTangents:si(e.settings.inTangents,Float32Array),outTangents:si(e.settings.outTangents,Float32Array)};return n}var An={enabled:!1,files:{},add:function(e,t){if(this.enabled===!1)return;if($c(e))return;this.files[e]=t},get:function(e){if(this.enabled===!1)return;if($c(e))return;return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function $c(e){try{let t=e.slice(e.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch(t){return!1}}class Sl{constructor(e,t,n){let i=this,s=!1,r=0,a=0,o=void 0,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(c){if(a++,s===!1){if(i.onStart!==void 0)i.onStart(c,r,a)}s=!0},this.itemEnd=function(c){if(r++,i.onProgress!==void 0)i.onProgress(c,r,a);if(r===a){if(s=!1,i.onLoad!==void 0)i.onLoad()}},this.itemError=function(c){if(i.onError!==void 0)i.onError(c)},this.resolveURL=function(c){if(c=c.normalize("NFC"),o)return o(c);return c},this.setURLModifier=function(c){return o=c,this},this.addHandler=function(c,h){return l.push(c,h),this},this.removeHandler=function(c){let h=l.indexOf(c);if(h!==-1)l.splice(h,2);return this},this.getHandler=function(c){for(let h=0,d=l.length;h<d;h+=2){let u=l[h],p=l[h+1];if(u.global)u.lastIndex=0;if(u.test(c))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){if(!this._abortController)this._abortController=new AbortController;return this._abortController}}var ru=new Sl;class Kn{constructor(e){if(this.manager=e!==void 0?e:ru,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Kn.DEFAULT_MATERIAL_NAME="__DEFAULT";var Vn={};class au extends Error{constructor(e,t){super(e);this.response=t}}class nr extends Kn{constructor(e){super(e);this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){if(e===void 0)e="";if(this.path!==void 0)e=this.path+e;e=this.manager.resolveURL(e);let s=An.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{if(t)t(s);this.manager.itemEnd(e)},0);return}if(Vn[e]!==void 0){Vn[e].push({onLoad:t,onProgress:n,onError:i});return}Vn[e]=[],Vn[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any==="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,o=this.responseType;fetch(r).then((l)=>{if(l.status===200||l.status===0){if(l.status===0)Ae("FileLoader: HTTP Status 0 received.");if(typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let c=Vn[e],h=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),u=d?parseInt(d):0,p=u!==0,_=0,S=new ReadableStream({start(m){f();function f(){h.read().then(({done:w,value:I})=>{if(w)m.close();else{_+=I.byteLength;let y=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:u});for(let b=0,E=c.length;b<E;b++){let R=c[b];if(R.onProgress)R.onProgress(y)}m.enqueue(I),f()}},(w)=>{m.error(w)})}}});return new Response(S)}else throw new au(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then((l)=>{switch(o){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then((c)=>new DOMParser().parseFromString(c,a));case"json":return l.json();default:if(a==="")return l.text();else{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,u=new TextDecoder(d);return l.arrayBuffer().then((p)=>u.decode(p))}}}).then((l)=>{An.add(`file:${e}`,l);let c=Vn[e];delete Vn[e];for(let h=0,d=c.length;h<d;h++){let u=c[h];if(u.onLoad)u.onLoad(l)}}).catch((l)=>{let c=Vn[e];if(c===void 0)throw this.manager.itemError(e),l;delete Vn[e];for(let h=0,d=c.length;h<d;h++){let u=c[h];if(u.onError)u.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}var es=new WeakMap;class Ml extends Kn{constructor(e){super(e)}load(e,t,n,i){if(this.path!==void 0)e=this.path+e;e=this.manager.resolveURL(e);let s=this,r=An.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){if(t)t(r);s.manager.itemEnd(e)},0);else{let h=es.get(r);if(h===void 0)h=[],es.set(r,h);h.push({onLoad:t,onError:i})}return r}let a=ss("img");function o(){if(c(),t)t(this);let h=es.get(this)||[];for(let d=0;d<h.length;d++){let u=h[d];if(u.onLoad)u.onLoad(this)}es.delete(this),s.manager.itemEnd(e)}function l(h){if(c(),i)i(h);An.remove(`image:${e}`);let d=es.get(this)||[];for(let u=0;u<d.length;u++){let p=d[u];if(p.onError)p.onError(h)}es.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function c(){a.removeEventListener("load",o,!1),a.removeEventListener("error",l,!1)}if(a.addEventListener("load",o,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"){if(this.crossOrigin!==void 0)a.crossOrigin=this.crossOrigin}return An.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}}class ma extends Kn{constructor(e){super(e)}load(e,t,n,i){let s=new Et,r=new Ml(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(a){if(s.image=a,s.needsUpdate=!0,t!==void 0)t(s)},n,i),s}}class Di extends ft{constructor(e,t=1){super();this.isLight=!0,this.type="Light",this.color=new Le(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class ga extends Di{constructor(e,t,n){super(e,n);this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Le(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}var no=new Be,jc=new B,Qc=new B;class ir{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new Be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $s,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;jc.setFromMatrixPosition(e.matrixWorld),t.position.copy(jc),Qc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Qc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){no.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(no,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,a=i?i.w/s.y:1,o=i?i.x/s.x:0,l=i?i.y/s.y:0;if(e.coordinateSystem===2001||e.reversedDepth)t.set(0.5*r,0,0,0.5*r+o,0,0.5*a,0,0.5*a+l,0,0,1,0,0,0,0,1);else t.set(0.5*r,0,0,0.5*r+o,0,0.5*a,0,0.5*a+l,0,0,0.5,0.5,0,0,0,1);t.multiply(no)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){if(this.map)this.map.dispose();if(this.mapPass)this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}var Br=new B,zr=new on,En=new B;class _a extends ft{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Be,this.projectionMatrix=new Be,this.projectionMatrixInverse=new Be,this.coordinateSystem=2000,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.matrixWorld.decompose(Br,zr,En),En.x===1&&En.y===1&&En.z===1)this.matrixWorldInverse.copy(this.matrixWorld).invert();else this.matrixWorldInverse.compose(Br,zr,En.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){if(super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Br,zr,En),En.x===1&&En.y===1&&En.z===1)this.matrixWorldInverse.copy(this.matrixWorld).invert();else this.matrixWorldInverse.compose(Br,zr,En.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}var ii=new B,eh=new Fe,th=new Fe;class Rt extends _a{constructor(e=50,t=1,n=0.1,i=2000){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=0.5*this.getFilmHeight()/e;this.fov=bi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Us*0.5*this.fov);return 0.5*this.getFilmHeight()/e}getEffectiveFOV(){return bi*2*Math.atan(Math.tan(Us*0.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ii.set(-1,-1,0.5).applyMatrix4(this.projectionMatrixInverse),t.set(ii.x,ii.y).multiplyScalar(-e/ii.z),ii.set(1,1,0.5).applyMatrix4(this.projectionMatrixInverse),n.set(ii.x,ii.y).multiplyScalar(-e/ii.z)}getViewSize(e,t){return this.getViewBounds(e,eh,th),t.subVectors(th,eh)}setViewOffset(e,t,n,i,s,r){if(this.aspect=e/t,this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Us*0.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-0.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let{fullWidth:o,fullHeight:l}=r;s+=r.offsetX*i/o,t-=r.offsetY*n/l,i*=r.width/o,n*=r.height/l}let a=this.filmOffset;if(a!==0)s+=e*a/this.getFilmWidth();this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);if(t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null)t.object.view=Object.assign({},this.view);return t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class ou extends ir{constructor(){super(new Rt(50,1,0.5,500));this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=bi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;if(n!==t.fov||i!==t.aspect||s!==t.far)t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix();super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class xa extends Di{constructor(e,t,n=0,i=Math.PI/3,s=0,r=2){super(e,t);this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new ou}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);if(t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture)t.object.map=this.map.toJSON(e).uuid;return t.object.shadow=this.shadow.toJSON(),t}}class lu extends ir{constructor(){super(new Rt(90,1,0.5,500));this.isPointLightShadow=!0}}class xs extends Di{constructor(e,t,n=0,i=2){super(e,t);this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new lu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ui extends _a{constructor(e=-1,t=1,n=1,i=-1,s=0.1,r=2000){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){if(this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,r=s+l*this.view.width,a-=c*this.view.offsetY,o=a-c*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);if(t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null)t.object.view=Object.assign({},this.view);return t}}class cu extends ir{constructor(){super(new Ui(-5,5,5,-5,0.5,500));this.isDirectionalLightShadow=!0}}class va extends Di{constructor(e,t){super(e,t);this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.shadow=new cu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class ya extends Di{constructor(e,t){super(e,t);this.isAmbientLight=!0,this.type="AmbientLight"}}class fi{static extractUrlBase(e){let t=e.lastIndexOf("/");if(t===-1)return"./";return e.slice(0,t+1)}static resolveURL(e,t){if(typeof e!=="string"||e==="")return"";if(/^https?:\/\//i.test(t)&&/^\//.test(e))t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1");if(/^(https?:)?\/\//i.test(e))return e;if(/^data:.*,.*$/i.test(e))return e;if(/^blob:.*$/i.test(e))return e;return t+e}}var io=new WeakMap;class Sa extends Kn{constructor(e){super(e);if(this.isImageBitmapLoader=!0,typeof createImageBitmap>"u")Ae("ImageBitmapLoader: createImageBitmap() not supported.");if(typeof fetch>"u")Ae("ImageBitmapLoader: fetch() not supported.");this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){if(e===void 0)e="";if(this.path!==void 0)e=this.path+e;e=this.manager.resolveURL(e);let s=this,r=An.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then((l)=>{if(io.has(r)===!0){if(i)i(io.get(r));s.manager.itemError(e),s.manager.itemEnd(e)}else{if(t)t(l);s.manager.itemEnd(e)}});return}setTimeout(function(){if(t)t(r);s.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any==="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(l){if(An.add(`image-bitmap:${e}`,l),t)t(l);return s.manager.itemEnd(e),l}).catch(function(l){if(i)i(l);io.set(o,l),An.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});An.add(`image-bitmap:${e}`,o),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}var ts=-90,ns=1;class bl extends ft{constructor(e,t,n){super();this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Rt(ts,ns,e,t);i.layers=this.layers,this.add(i);let s=new Rt(ts,ns,e,t);s.layers=this.layers,this.add(s);let r=new Rt(ts,ns,e,t);r.layers=this.layers,this.add(r);let a=new Rt(ts,ns,e,t);a.layers=this.layers,this.add(a);let o=new Rt(ts,ns,e,t);o.layers=this.layers,this.add(o);let l=new Rt(ts,ns,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,r,a,o]=t;for(let l of t)this.remove(l);if(e===2000)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){if(this.parent===null)this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;if(this.coordinateSystem!==e.coordinateSystem)this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem();let[s,r,a,o,l,c]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let S=!1;if(e.isWebGLRenderer===!0)S=e.state.buffers.depth.getReversed();else S=e.reversedDepthBuffer;if(e.setRenderTarget(n,0,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,s),e.setRenderTarget(n,1,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,r),e.setRenderTarget(n,2,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,a),e.setRenderTarget(n,3,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,o),e.setRenderTarget(n,4,i),S&&e.autoClear===!1)e.clearDepth();if(e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),S&&e.autoClear===!1)e.clearDepth();e.render(t,c),e.setRenderTarget(h,d,u),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Tl extends Rt{constructor(e=[]){super();this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}var El="\\[\\]\\.:\\/",Jf=new RegExp("["+El+"]","g"),wl="[^"+El+"]",$f="[^"+El.replace("\\.","")+"]",jf=/((?:WC+[\/:])*)/.source.replace("WC",wl),Qf=/(WCOD+)?/.source.replace("WCOD",$f),ep=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",wl),tp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",wl),np=new RegExp("^"+jf+Qf+ep+tp+"$"),ip=["material","materials","bones","map"];class hu{constructor(e,t,n){let i=n||tt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];if(i!==void 0)i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class tt{constructor(e,t,n){this.path=t,this.parsedPath=n||tt.parseTrackName(t),this.node=tt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){if(!(e&&e.isAnimationObjectGroup))return new tt(e,t,n);else return new tt.Composite(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Jf,"")}static parseTrackName(e){let t=np.exec(e);if(t===null)throw Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);if(ip.indexOf(s)!==-1)n.nodeName=n.nodeName.substring(0,i),n.objectName=s}if(n.propertyName===null||n.propertyName.length===0)throw Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let a=s[r];if(a.name===t||a.uuid===t)return a;let o=n(a.children);if(o)return o}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,{objectName:n,propertyName:i,propertyIndex:s}=t;if(!e)e=tt.findNode(this.rootNode,t.nodeName),this.node=e;if(this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ae("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ue("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ue("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let c=0;c<e.length;c++)if(e[c].name===l){l=c;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ue("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ue("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ue("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Ue("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let r=e[i];if(r===void 0){let l=t.nodeName;Ue("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;if(this.targetObject=e,e.isMaterial===!0)a=this.Versioning.NeedsUpdate;else if(e.isObject3D===!0)a=this.Versioning.MatrixWorldNeedsUpdate;let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ue("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}if(e.morphTargetDictionary[s]!==void 0)s=e.morphTargetDictionary[s]}o=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else if(r.fromArray!==void 0&&r.toArray!==void 0)o=this.BindingType.HasFromToArray,this.resolvedProperty=r;else if(Array.isArray(r))o=this.BindingType.EntireArray,this.resolvedProperty=r;else this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}tt.Composite=hu;tt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};tt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};tt.prototype.GetterByBindingType=[tt.prototype._getValue_direct,tt.prototype._getValue_array,tt.prototype._getValue_arrayElement,tt.prototype._getValue_toArray];tt.prototype.SetterByBindingTypeAndVersioning=[[tt.prototype._setValue_direct,tt.prototype._setValue_direct_setNeedsUpdate,tt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_array,tt.prototype._setValue_array_setNeedsUpdate,tt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_arrayElement,tt.prototype._setValue_arrayElement_setNeedsUpdate,tt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_fromArray,tt.prototype._setValue_fromArray_setNeedsUpdate,tt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var wx=new Float32Array(1);var nh=new Be;class Fi{constructor(e,t,n=0,i=1/0){this.ray=new Ii(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ws,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){if(t.isPerspectiveCamera)this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,0.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t;else if(t.isOrthographicCamera)this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t;else Ue("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return nh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nh),this}intersectObject(e,t=!0,n=[]){return ro(e,this,n,t),n.sort(ih),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)ro(e[i],this,n,t);return n.sort(ih),n}}function ih(e,t){return e.distance-t.distance}function ro(e,t,n,i){let s=!0;if(e.layers.test(t.layers)){if(e.raycast(t,n)===!1)s=!1}if(s===!0&&i===!0){let r=e.children;for(let a=0,o=r.length;a<o;a++)ro(r[a],t,n,!0)}}class Al{static{Al.prototype.isMatrix2=!0}constructor(e,t,n,i){if(this.elements=[1,0,0,1],e!==void 0)this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}}function Rl(e,t,n,i){let s=sp(i);switch(n){case 1021:return e*t;case 1028:return e*t/s.components*s.byteLength;case 1029:return e*t/s.components*s.byteLength;case 1030:return e*t*2/s.components*s.byteLength;case 1031:return e*t*2/s.components*s.byteLength;case 1022:return e*t*3/s.components*s.byteLength;case 1023:return e*t*4/s.components*s.byteLength;case 1033:return e*t*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 33778:case 33779:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 35841:case 35843:return Math.max(e,16)*Math.max(t,8)/4;case 35840:case 35842:return Math.max(e,8)*Math.max(t,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37808:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37809:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case 37810:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case 37811:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case 37812:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case 37813:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case 37814:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case 37815:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case 37816:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case 37817:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case 37818:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case 37819:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case 37820:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case 37821:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(e/4)*Math.ceil(t/4)*16;case 36283:case 36284:return Math.ceil(e/4)*Math.ceil(t/4)*8;case 36285:case 36286:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function sp(e){switch(e){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}if(typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));if(typeof window<"u")if(window.__THREE__)Ae("WARNING: Multiple instances of Three.js being imported.");else window.__THREE__="186";function Lu(){let e=null,t=!1,n=null,i=null;function s(r,a){i=e.requestAnimationFrame(s),n(r,a)}return{start:function(){if(t===!0)return;if(n===null)return;if(e===null)return;i=e.requestAnimationFrame(s),t=!0},stop:function(){if(e!==null)e.cancelAnimationFrame(i);t=!1},setAnimationLoop:function(r){n=r},setContext:function(r){e=r}}}function rp(e){let t=new WeakMap;function n(o,l){let{array:c,usage:h}=o,d=c.byteLength,u=e.createBuffer();e.bindBuffer(l,u),e.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=e.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=e.HALF_FLOAT;else if(c instanceof Uint16Array)if(o.isFloat16BufferAttribute)p=e.HALF_FLOAT;else p=e.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=e.SHORT;else if(c instanceof Uint32Array)p=e.UNSIGNED_INT;else if(c instanceof Int32Array)p=e.INT;else if(c instanceof Int8Array)p=e.BYTE;else if(c instanceof Uint8Array)p=e.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=e.UNSIGNED_BYTE;else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){let{array:h,updateRanges:d}=l;if(e.bindBuffer(c,o),d.length===0)e.bufferSubData(c,0,h);else{d.sort((p,_)=>p.start-_.start);let u=0;for(let p=1;p<d.length;p++){let _=d[u],S=d[p];if(S.start<=_.start+_.count+1)_.count=Math.max(_.count,S.start+S.count-_.start);else++u,d[u]=S}d.length=u+1;for(let p=0,_=d.length;p<_;p++){let S=d[p];e.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){if(o.isInterleavedBufferAttribute)o=o.data;return t.get(o)}function r(o){if(o.isInterleavedBufferAttribute)o=o.data;let l=t.get(o);if(l)e.deleteBuffer(l.buffer),t.delete(o)}function a(o,l){if(o.isInterleavedBufferAttribute)o=o.data;if(o.isGLBufferAttribute){let h=t.get(o);if(!h||h.version<o.version)t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var ap=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,op=`#ifdef USE_ALPHAHASH
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
#endif`,lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,up=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dp=`#ifdef USE_AOMAP
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
#endif`,fp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pp=`#ifdef USE_BATCHING
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
#endif`,mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_p=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,vp=`#ifdef USE_IRIDESCENCE
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
#endif`,yp=`#ifdef USE_BUMPMAP
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
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ep=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Cp=`#define PI 3.141592653589793
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
} // validated`,Ip=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Pp=`vec3 transformedNormal = objectNormal;
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
#endif`,Lp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Np=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Up=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Op=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bp=`#ifdef USE_ENVMAP
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
#endif`,zp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,kp=`#ifdef USE_ENVMAP
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
#endif`,Hp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
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
#endif`,Vp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yp=`#ifdef USE_GRADIENTMAP
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
}`,Zp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$p=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,jp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,em=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,im=`PhysicalMaterial material;
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
#endif`,sm=`uniform sampler2D dfgLUT;
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
}`,rm=`
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
#endif`,am=`#if defined( RE_IndirectDiffuse )
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
#endif`,om=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lm=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,cm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,um=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gm=`#if defined( USE_POINTS_UV )
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
#endif`,_m=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ym=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mm=`#ifdef USE_MORPHTARGETS
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
#endif`,bm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Em=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Cm=`#ifdef USE_NORMALMAP
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
#endif`,Im=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Um=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Fm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,km=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xm=`float getShadowMask() {
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
}`,qm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ym=`#ifdef USE_SKINNING
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
#endif`,Zm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Km=`#ifdef USE_SKINNING
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
#endif`,Jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$m=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`;var rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ag=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,og=`uniform sampler2D t2D;
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
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`#include <common>
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
}`,fg=`#if DEPTH_PACKING == 3200
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
}`,pg=`#define DISTANCE
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
}`,mg=`#define DISTANCE
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_g=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`uniform float scale;
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
}`,vg=`uniform vec3 diffuse;
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
}`,yg=`#include <common>
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
}`,Sg=`uniform vec3 diffuse;
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
}`,Mg=`#define LAMBERT
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
}`,bg=`#define LAMBERT
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
}`,Tg=`#define MATCAP
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
}`,Eg=`#define MATCAP
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
}`,wg=`#define NORMAL
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
}`,Ag=`#define NORMAL
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
}`,Rg=`#define PHONG
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
}`,Cg=`#define PHONG
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
}`,Ig=`#define STANDARD
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
}`,Pg=`#define STANDARD
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
}`,Lg=`#define TOON
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
}`,Ng=`#define TOON
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
}`,Dg=`uniform float size;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,Fg=`#include <common>
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
}`,Og=`uniform vec3 color;
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
}`,Bg=`uniform float rotation;
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
}`,zg=`uniform vec3 diffuse;
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
}`,Ve={alphahash_fragment:ap,alphahash_pars_fragment:op,alphamap_fragment:lp,alphamap_pars_fragment:cp,alphatest_fragment:hp,alphatest_pars_fragment:up,aomap_fragment:dp,aomap_pars_fragment:fp,batching_pars_vertex:pp,batching_vertex:mp,begin_vertex:gp,beginnormal_vertex:_p,bsdfs:xp,iridescence_fragment:vp,bumpmap_pars_fragment:yp,clipping_planes_fragment:Sp,clipping_planes_pars_fragment:Mp,clipping_planes_pars_vertex:bp,clipping_planes_vertex:Tp,color_fragment:Ep,color_pars_fragment:wp,color_pars_vertex:Ap,color_vertex:Rp,common:Cp,cube_uv_reflection_fragment:Ip,defaultnormal_vertex:Pp,displacementmap_pars_vertex:Lp,displacementmap_vertex:Np,emissivemap_fragment:Dp,emissivemap_pars_fragment:Up,colorspace_fragment:Fp,colorspace_pars_fragment:Op,envmap_fragment:Bp,envmap_common_pars_fragment:zp,envmap_pars_fragment:kp,envmap_pars_vertex:Hp,envmap_physical_pars_fragment:jp,envmap_vertex:Gp,fog_vertex:Vp,fog_pars_vertex:Wp,fog_fragment:Xp,fog_pars_fragment:qp,gradientmap_pars_fragment:Yp,lightmap_pars_fragment:Zp,lights_lambert_fragment:Kp,lights_lambert_pars_fragment:Jp,lights_pars_begin:$p,lights_toon_fragment:Qp,lights_toon_pars_fragment:em,lights_phong_fragment:tm,lights_phong_pars_fragment:nm,lights_physical_fragment:im,lights_physical_pars_fragment:sm,lights_fragment_begin:rm,lights_fragment_maps:am,lights_fragment_end:om,lightprobes_pars_fragment:lm,logdepthbuf_fragment:cm,logdepthbuf_pars_fragment:hm,logdepthbuf_pars_vertex:um,logdepthbuf_vertex:dm,map_fragment:fm,map_pars_fragment:pm,map_particle_fragment:mm,map_particle_pars_fragment:gm,metalnessmap_fragment:_m,metalnessmap_pars_fragment:xm,morphinstance_vertex:vm,morphcolor_vertex:ym,morphnormal_vertex:Sm,morphtarget_pars_vertex:Mm,morphtarget_vertex:bm,normal_fragment_begin:Tm,normal_fragment_maps:Em,normal_pars_fragment:wm,normal_pars_vertex:Am,normal_vertex:Rm,normalmap_pars_fragment:Cm,clearcoat_normal_fragment_begin:Im,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Lm,iridescence_pars_fragment:Nm,opaque_fragment:Dm,packing:Um,premultiplied_alpha_fragment:Fm,project_vertex:Om,dithering_fragment:Bm,dithering_pars_fragment:zm,roughnessmap_fragment:km,roughnessmap_pars_fragment:Hm,shadowmap_pars_fragment:Gm,shadowmap_pars_vertex:Vm,shadowmap_vertex:Wm,shadowmask_pars_fragment:Xm,skinbase_vertex:qm,skinning_pars_vertex:Ym,skinning_vertex:Zm,skinnormal_vertex:Km,specularmap_fragment:Jm,specularmap_pars_fragment:$m,tonemapping_fragment:jm,tonemapping_pars_fragment:Qm,transmission_fragment:eg,transmission_pars_fragment:tg,uv_pars_fragment:ng,uv_pars_vertex:ig,uv_vertex:sg,worldpos_vertex:rg,background_vert:ag,background_frag:og,backgroundCube_vert:lg,backgroundCube_frag:cg,cube_vert:hg,cube_frag:ug,depth_vert:dg,depth_frag:fg,distance_vert:pg,distance_frag:mg,equirect_vert:gg,equirect_frag:_g,linedashed_vert:xg,linedashed_frag:vg,meshbasic_vert:yg,meshbasic_frag:Sg,meshlambert_vert:Mg,meshlambert_frag:bg,meshmatcap_vert:Tg,meshmatcap_frag:Eg,meshnormal_vert:wg,meshnormal_frag:Ag,meshphong_vert:Rg,meshphong_frag:Cg,meshphysical_vert:Ig,meshphysical_frag:Pg,meshtoon_vert:Lg,meshtoon_frag:Ng,points_vert:Dg,points_frag:Ug,shadow_vert:Fg,shadow_frag:Og,sprite_vert:Bg,sprite_frag:zg},de={common:{diffuse:{value:new Le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:0.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:0.00025},fogNear:{value:1},fogFar:{value:2000},fogColor:{value:new Le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new Le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new Le(16777215)},opacity:{value:1},center:{value:new Fe(0.5,0.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},Dn={basic:{uniforms:zt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:zt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Le(0)},envMapIntensity:{value:1}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:zt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Le(0)},specular:{value:new Le(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:zt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:zt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:zt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:zt([de.points,de.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:zt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:zt([de.common,de.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:zt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:zt([de.sprite,de.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distance:{uniforms:zt([de.common,de.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1000}}]),vertexShader:Ve.distance_vert,fragmentShader:Ve.distance_frag},shadow:{uniforms:zt([de.lights,de.fog,{color:{value:new Le(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};Dn.physical={uniforms:zt([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new Le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new Le(0)},specularColor:{value:new Le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};var Ma={r:0,b:0,g:0},kg=new Be,Nu=new Oe;Nu.set(-1,0,0,0,1,0,0,0,1);function Hg(e,t,n,i,s,r){let a=new Le(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function p(w){let I=w.isScene===!0?w.background:null;if(I&&I.isTexture){let y=w.backgroundBlurriness>0;I=t.get(I,y)}return I}function _(w){let I=!1,y=p(w);if(y===null)m(a,o);else if(y&&y.isColor)m(y,1),I=!0;let b=e.xr.getEnvironmentBlendMode();if(b==="additive")n.buffers.color.setClear(0,0,0,1,r);else if(b==="alpha-blend")n.buffers.color.setClear(0,0,0,0,r);if(e.autoClear||I)n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)}function S(w,I){let y=p(I);if(y&&(y.isCubeTexture||y.mapping===ks)){if(c===void 0)c=new vt(new gs(1,1,1),new cn({name:"BackgroundCubeMaterial",uniforms:Li(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,E,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c);if(c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=I.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(kg.makeRotationFromEuler(I.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1)c.material.uniforms.backgroundRotation.value.premultiply(Nu);if(c.material.toneMapped=Xe.getTransfer(y.colorSpace)!==ht,h!==y||d!==y.version||u!==e.toneMapping)c.material.needsUpdate=!0,h=y,d=y.version,u=e.toneMapping;c.layers.enableAll(),w.unshift(c,c.geometry,c.material,0,0,null)}else if(y&&y.isTexture){if(l===void 0)l=new vt(new er(2,2),new cn({name:"BackgroundMaterial",uniforms:Li(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l);if(l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=I.backgroundIntensity,l.material.toneMapped=Xe.getTransfer(y.colorSpace)!==ht,y.matrixAutoUpdate===!0)y.updateMatrix();if(l.material.uniforms.uvTransform.value.copy(y.matrix),h!==y||d!==y.version||u!==e.toneMapping)l.material.needsUpdate=!0,h=y,d=y.version,u=e.toneMapping;l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null)}}function m(w,I){w.getRGB(Ma,dl(e)),n.buffers.color.setClear(Ma.r,Ma.g,Ma.b,I,r)}function f(){if(c!==void 0)c.geometry.dispose(),c.material.dispose(),c=void 0;if(l!==void 0)l.geometry.dispose(),l.material.dispose(),l=void 0}return{getClearColor:function(){return a},setClearColor:function(w,I=1){a.set(w),o=I,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(w){o=w,m(a,o)},render:_,addToRenderList:S,dispose:f}}function Gg(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,a=!1;function o(P,C,k,A,F){let V=!1,z=d(P,A,k,C);if(r!==z)r=z,c(r.object);if(V=p(P,A,k,F),V)_(P,A,k,F);if(F!==null)t.update(F,e.ELEMENT_ARRAY_BUFFER);if(V||a){if(a=!1,y(P,C,k,A),F!==null)e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(F).buffer)}}function l(){return e.createVertexArray()}function c(P){return e.bindVertexArray(P)}function h(P){return e.deleteVertexArray(P)}function d(P,C,k,A){let F=A.wireframe===!0,V=i[C.id];if(V===void 0)V={},i[C.id]=V;let z=P.isInstancedMesh===!0?P.id:0,Q=V[z];if(Q===void 0)Q={},V[z]=Q;let W=Q[k.id];if(W===void 0)W={},Q[k.id]=W;let K=W[F];if(K===void 0)K=u(l()),W[F]=K;return K}function u(P){let C=[],k=[],A=[];for(let F=0;F<n;F++)C[F]=0,k[F]=0,A[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:k,attributeDivisors:A,object:P,attributes:{},index:null}}function p(P,C,k,A){let F=r.attributes,V=C.attributes,z=0,Q=k.getAttributes();for(let W in Q)if(Q[W].location>=0){let ee=F[W],Te=V[W];if(Te===void 0){if(W==="instanceMatrix"&&P.instanceMatrix)Te=P.instanceMatrix;if(W==="instanceColor"&&P.instanceColor)Te=P.instanceColor}if(ee===void 0)return!0;if(ee.attribute!==Te)return!0;if(Te&&ee.data!==Te.data)return!0;z++}if(r.attributesNum!==z)return!0;if(r.index!==A)return!0;return!1}function _(P,C,k,A){let F={},V=C.attributes,z=0,Q=k.getAttributes();for(let W in Q)if(Q[W].location>=0){let ee=V[W];if(ee===void 0){if(W==="instanceMatrix"&&P.instanceMatrix)ee=P.instanceMatrix;if(W==="instanceColor"&&P.instanceColor)ee=P.instanceColor}let Te={};if(Te.attribute=ee,ee&&ee.data)Te.data=ee.data;F[W]=Te,z++}r.attributes=F,r.attributesNum=z,r.index=A}function S(){let P=r.newAttributes;for(let C=0,k=P.length;C<k;C++)P[C]=0}function m(P){f(P,0)}function f(P,C){let k=r.newAttributes,A=r.enabledAttributes,F=r.attributeDivisors;if(k[P]=1,A[P]===0)e.enableVertexAttribArray(P),A[P]=1;if(F[P]!==C)e.vertexAttribDivisor(P,C),F[P]=C}function w(){let P=r.newAttributes,C=r.enabledAttributes;for(let k=0,A=C.length;k<A;k++)if(C[k]!==P[k])e.disableVertexAttribArray(k),C[k]=0}function I(P,C,k,A,F,V,z){if(z===!0)e.vertexAttribIPointer(P,C,k,F,V);else e.vertexAttribPointer(P,C,k,A,F,V)}function y(P,C,k,A){S();let F=A.attributes,V=k.getAttributes(),z=C.defaultAttributeValues;for(let Q in V){let W=V[Q];if(W.location>=0){let K=F[Q];if(K===void 0){if(Q==="instanceMatrix"&&P.instanceMatrix)K=P.instanceMatrix;if(Q==="instanceColor"&&P.instanceColor)K=P.instanceColor}if(K!==void 0){let ee=K.normalized,Te=K.itemSize,Se=t.get(K);if(Se===void 0)continue;let{buffer:We,type:He,bytesPerElement:Y}=Se,ie=He===e.INT||He===e.UNSIGNED_INT||K.gpuType===vo;if(K.isInterleavedBufferAttribute){let re=K.data,Re=re.stride,Ne=K.offset;if(re.isInstancedInterleavedBuffer){for(let ae=0;ae<W.locationSize;ae++)f(W.location+ae,re.meshPerAttribute);if(P.isInstancedMesh!==!0&&A._maxInstanceCount===void 0)A._maxInstanceCount=re.meshPerAttribute*re.count}else for(let ae=0;ae<W.locationSize;ae++)m(W.location+ae);e.bindBuffer(e.ARRAY_BUFFER,We);for(let ae=0;ae<W.locationSize;ae++)I(W.location+ae,Te/W.locationSize,He,ee,Re*Y,(Ne+Te/W.locationSize*ae)*Y,ie)}else{if(K.isInstancedBufferAttribute){for(let re=0;re<W.locationSize;re++)f(W.location+re,K.meshPerAttribute);if(P.isInstancedMesh!==!0&&A._maxInstanceCount===void 0)A._maxInstanceCount=K.meshPerAttribute*K.count}else for(let re=0;re<W.locationSize;re++)m(W.location+re);e.bindBuffer(e.ARRAY_BUFFER,We);for(let re=0;re<W.locationSize;re++)I(W.location+re,Te/W.locationSize,He,ee,Te*Y,Te/W.locationSize*re*Y,ie)}}else if(z!==void 0){let ee=z[Q];if(ee!==void 0)switch(ee.length){case 2:e.vertexAttrib2fv(W.location,ee);break;case 3:e.vertexAttrib3fv(W.location,ee);break;case 4:e.vertexAttrib4fv(W.location,ee);break;default:e.vertexAttrib1fv(W.location,ee)}}}}w()}function b(){T();for(let P in i){let C=i[P];for(let k in C){let A=C[k];for(let F in A){let V=A[F];for(let z in V)h(V[z].object),delete V[z];delete A[F]}}delete i[P]}}function E(P){if(i[P.id]===void 0)return;let C=i[P.id];for(let k in C){let A=C[k];for(let F in A){let V=A[F];for(let z in V)h(V[z].object),delete V[z];delete A[F]}}delete i[P.id]}function R(P){for(let C in i){let k=i[C];for(let A in k){let F=k[A];if(F[P.id]===void 0)continue;let V=F[P.id];for(let z in V)h(V[z].object),delete V[z];delete F[P.id]}}}function v(P){for(let C in i){let k=i[C],A=P.isInstancedMesh===!0?P.id:0,F=k[A];if(F===void 0)continue;for(let V in F){let z=F[V];for(let Q in z)h(z[Q].object),delete z[Q];delete F[V]}if(delete k[A],Object.keys(k).length===0)delete i[C]}}function T(){if(O(),a=!0,r===s)return;r=s,c(r.object)}function O(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:T,resetDefaultState:O,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:v,releaseStatesOfProgram:R,initAttributes:S,enableAttribute:m,disableUnusedAttributes:w}}function Vg(e,t,n){let i;function s(l){i=l}function r(l,c){e.drawArrays(i,l,c),n.update(c,i,1)}function a(l,c,h){if(h===0)return;e.drawArraysInstanced(i,l,c,h),n.update(c,i,h)}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let p=0;p<h;p++)u+=c[p];n.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Wg(e,t,n,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){if(R!==Pn&&i.convert(R)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))return!1;return!0}function o(R){let v=R===In&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));if(R!==vn&&R!==qn&&!v&&i.convert(R)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))return!1;return!0}function l(R){if(R==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";R="mediump"}if(R==="mediump"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0)return"mediump"}return"lowp"}let c=n.precision!==void 0?n.precision:"highp",h=l(c);if(h!==c)Ae("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h;let d=n.logarithmicDepthBuffer===!0,u=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control");if(n.reversedDepthBuffer===!0&&u===!1)Ae("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),_=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),f=e.getParameter(e.MAX_VERTEX_ATTRIBS),w=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),I=e.getParameter(e.MAX_VARYING_VECTORS),y=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),b=e.getParameter(e.MAX_SAMPLES),E=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:_,maxTextureSize:S,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:w,maxVaryings:I,maxFragmentUniforms:y,maxSamples:b,samples:E}}function Xg(e){let t=this,n=null,i=0,s=!1,r=!1,a=new wn,o=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let p=d.length!==0||u||i!==0||s;return s=u,i=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){n=h(d,u,0)},this.setState=function(d,u,p){let{clippingPlanes:_,clipIntersection:S,clipShadows:m}=d,f=e.get(d);if(!s||_===null||_.length===0||r&&!m)if(r)h(null);else c();else{let w=r?0:i,I=w*4,y=f.clippingState||null;l.value=y,y=h(_,u,I,p);for(let b=0;b!==I;++b)y[b]=n[b];f.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=w}};function c(){if(l.value!==n)l.value=n,l.needsUpdate=i>0;t.numPlanes=i,t.numIntersection=0}function h(d,u,p,_){let S=d!==null?d.length:0,m=null;if(S!==0){if(m=l.value,_!==!0||m===null){let f=p+S*4,w=u.matrixWorldInverse;if(o.getNormalMatrix(w),m===null||m.length<f)m=new Float32Array(f);for(let I=0,y=p;I!==S;++I,y+=4)a.copy(d[I]).applyMatrix4(w,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,m}}var ys=4,qg=6,Yg=20,Zg=256,sr=new Ui,uu=new Le,Cl=null,Il=0,Pl=0,Ll=!1,Kg=new B,Oi=new B;class Ul{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=0.1,i=100,s={}){let{size:r=256,position:a=Kg}=s;Cl=this._renderer.getRenderTarget(),Il=this._renderer.getActiveCubeFace(),Pl=this._renderer.getActiveMipmapLevel(),Ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let o=this._allocateTargets();if(o.depthBuffer=!0,this._sceneToCubeUV(e,n,i,o,a),t>0)this._blur(o,0,0,t);return this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){if(this._cubemapMaterial===null)this._cubemapMaterial=pu(),this._compileMaterial(this._cubemapMaterial)}compileEquirectangularShader(){if(this._equirectMaterial===null)this._equirectMaterial=fu(),this._compileMaterial(this._equirectMaterial)}dispose(){if(this._dispose(),this._cubemapMaterial!==null)this._cubemapMaterial.dispose();if(this._equirectMaterial!==null)this._equirectMaterial.dispose();if(this._backgroundBox!==null)this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){if(this._blurMaterial!==null)this._blurMaterial.dispose();if(this._ggxMaterial!==null)this._ggxMaterial.dispose();if(this._pingPongRenderTarget!==null)this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Cl,Il,Pl),this._renderer.xr.enabled=Ll,e.scissorTest=!1,vs(e,0,0,e.width,e.height)}_fromTexture(e,t){if(e.mapping===ls||e.mapping===Ti)this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width);else this._setSize(e.image.width/4);Cl=this._renderer.getRenderTarget(),Il=this._renderer.getActiveCubeFace(),Pl=this._renderer.getActiveMipmapLevel(),Ll=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dt,minFilter:Dt,generateMipmaps:!1,type:In,format:Pn,colorSpace:Jt,depthBuffer:!1},i=du(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){if(this._pingPongRenderTarget!==null)this._dispose();this._pingPongRenderTarget=du(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Jg(s)),this._blurMaterial=jg(s,e,t),this._ggxMaterial=$g(s,e,t)}return i}_compileMaterial(e){let t=new vt(new Ct,e);this._renderer.compile(t,sr)}_sceneToCubeUV(e,t,n,i,s){let o=new Rt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,{autoClear:d,toneMapping:u}=h;if(h.getClearColor(uu),h.toneMapping=_n,h.autoClear=!1,h.state.buffers.depth.getReversed())h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null);if(this._backgroundBox===null)this._backgroundBox=new vt(new gs,new ln({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1}));let _=this._backgroundBox,S=_.material,m=!1,f=e.background;if(f){if(f.isColor)S.color.copy(f),e.background=null,m=!0}else S.color.copy(uu),m=!0;for(let w=0;w<6;w++){let I=w%3;if(I===0)o.up.set(0,l[w],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x+c[w],s.y,s.z);else if(I===1)o.up.set(0,0,l[w]),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y+c[w],s.z);else o.up.set(0,l[w],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y,s.z+c[w]);let y=this._cubeSize;if(vs(i,I*y,w>2?y:0,y,y),h.setRenderTarget(i),m)h.render(_,o);h.render(e,o)}h.toneMapping=u,h.autoClear=d,e.background=f}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===ls||e.mapping===Ti;if(i){if(this._cubemapMaterial===null)this._cubemapMaterial=pu();this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1}else if(this._equirectMaterial===null)this._equirectMaterial=fu();let s=i?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=s;let a=s.uniforms;a.envMap.value=e;let o=this._cubeSize;vs(t,0,0,3*o,2*o),n.setRenderTarget(t),n.render(r,sr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,s=this._pingPongRenderTarget,r=this._ggxMaterial,a=this._lodMeshes[n];a.material=r;let o=r.uniforms,l=n/(this._lodMeshes.length-1),c=t/(this._lodMeshes.length-1),h=Math.sqrt(l*l-c*c),d=l*1.25,u=h*d,{_lodMax:p}=this,_=this._sizeLods[n],S=3*_*(n>p-ys?n-p+ys:0),m=4*(this._cubeSize-_);o.envMap.value=e.texture,o.roughness.value=u,o.mipInt.value=p-t,vs(s,S,m,3*_,2*_),i.setRenderTarget(s),i.render(a,sr),o.envMap.value=s.texture,o.roughness.value=0,o.mipInt.value=p-n,vs(e,S,m,3*_,2*_),i.setRenderTarget(e),i.render(a,sr)}_blur(e,t,n,i){let s=this._pingPongRenderTarget,r=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,r),this._blurPass(s,e,n,n,r)}_blurPass(e,t,n,i,s){let r=this._renderer,a=this._blurMaterial,o=this._lodMeshes[i];o.material=a;let l=a.uniforms;l.envMap.value=e.texture,l.sigma.value=s,l.mipInt.value=this._lodMax-n;let c=this._sizeLods[i],h=3*c*(i>this._lodMax-ys?i-this._lodMax+ys:0),d=4*(this._cubeSize-c);vs(t,h,d,3*c,2*c),r.setRenderTarget(t),r.render(o,sr)}}function Jg(e){let t=[],n=[],i=e,s=e-ys+1+qg;for(let r=0;r<s;r++){let a=Math.pow(2,i);t.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,p=3,_=new Float32Array(p*u*d),S=new Float32Array(p*u*d);for(let f=0;f<d;f++){let w=f%3*2/3-1,I=f>2?0:-1,y=[w,I,0,w+0.6666666666666666,I,0,w+0.6666666666666666,I+1,0,w,I,0,w+0.6666666666666666,I+1,0,w,I+1,0];_.set(y,p*u*f);for(let b=0;b<u;b++){let E=h[b*2]*2-1,R=h[b*2+1]*2-1;if(f===0)Oi.set(1,R,E);else if(f===1)Oi.set(-E,1,-R);else if(f===2)Oi.set(-E,R,1);else if(f===3)Oi.set(-1,R,-E);else if(f===4)Oi.set(-E,-1,R);else Oi.set(E,R,-1);Oi.toArray(S,(f*u+b)*p)}}let m=new Ct;if(m.setAttribute("position",new Nt(_,p)),m.setAttribute("outputDirection",new Nt(S,p)),n.push(new vt(m,null)),i>ys)i--}return{lodMeshes:n,sizeLods:t}}function du(e,t,n){let i=new $t(e,t,n);return i.texture.mapping=ks,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function vs(e,t,n,i,s){e.viewport.set(t,n,i,s),e.scissor.set(t,n,i,s)}function $g(e,t,n){return new cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Zg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ta(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function jg(e,t,n){return new cn({name:"SphericalGaussianBlur",defines:{SAMPLES:Yg,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ta(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function fu(){return new cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ta(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function pu(){return new cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ta(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Ta(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Bl extends $t{constructor(e=1,t={}){super(e,e,t);this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ua(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new gs(5,5,5),s=new cn({name:"CubemapFromEquirect",uniforms:Li(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:Rn});s.uniforms.tEquirect.value=t;let r=new vt(i,s),a=t.minFilter;if(t.minFilter===Cn)t.minFilter=Dt;return new bl(1,10,this).update(e,r),t.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,i);e.setRenderTarget(s)}}function Qg(e){let t=new WeakMap,n=new WeakMap,i=null;function s(u,p=!1){if(u===null||u===void 0)return null;if(p)return a(u);return r(u)}function r(u){if(u&&u.isTexture){let p=u.mapping;if(p===Vr||p===Wr)if(t.has(u)){let _=t.get(u).texture;return o(_,u.mapping)}else{let _=u.image;if(_&&_.height>0){let S=new Bl(_.height);return S.fromEquirectangularTexture(e,u),t.set(u,S),u.addEventListener("dispose",c),o(S.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let p=u.mapping,_=p===Vr||p===Wr,S=p===ls||p===Ti;if(_||S){let m=n.get(u),f=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==f){if(i===null)i=new Ul(e);return m=_?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,n.set(u,m),m.texture}else if(m!==void 0)return m.texture;else{let w=u.image;if(_&&w&&w.height>0||S&&w&&l(w)){if(i===null)i=new Ul(e);return m=_?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,n.set(u,m),u.addEventListener("dispose",h),m.texture}else return null}}}return u}function o(u,p){if(p===Vr)u.mapping=ls;else if(p===Wr)u.mapping=Ti;return u}function l(u){let p=0,_=6;for(let S=0;S<_;S++)if(u[S]!==void 0)p++;return p===_}function c(u){let p=u.target;p.removeEventListener("dispose",c);let _=t.get(p);if(_!==void 0)t.delete(p),_.dispose()}function h(u){let p=u.target;p.removeEventListener("dispose",h);let _=n.get(p);if(_!==void 0)n.delete(p),_.dispose()}function d(){if(t=new WeakMap,n=new WeakMap,i!==null)i.dispose(),i=null}return{get:s,dispose:d}}function e0(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s=e.getExtension(i);return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);if(s===null)Mi("WebGLRenderer: "+i+" extension not supported.");return s}}}function t0(e,t,n,i){let s={},r=new WeakMap;function a(d){let u=d.target;if(u.index!==null)t.remove(u.index);for(let _ in u.attributes)t.remove(u.attributes[_]);u.removeEventListener("dispose",a),delete s[u.id];let p=r.get(u);if(p)t.remove(p),r.delete(u);if(i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0)delete u._maxInstanceCount;n.memory.geometries--}function o(d,u){if(s[u.id]===!0)return u;return u.addEventListener("dispose",a),s[u.id]=!0,n.memory.geometries++,u}function l(d){let u=d.attributes;for(let p in u)t.update(u[p],e.ARRAY_BUFFER)}function c(d){let u=[],p=d.index,_=d.attributes.position,S=0;if(_===void 0)return;if(p!==null){let w=p.array;S=p.version;for(let I=0,y=w.length;I<y;I+=3){let b=w[I+0],E=w[I+1],R=w[I+2];u.push(b,E,E,R,R,b)}}else{let w=_.array;S=_.version;for(let I=0,y=w.length/3-1;I<y;I+=3){let b=I+0,E=I+1,R=I+2;u.push(b,E,E,R,R,b)}}let m=new(_.count>=65535?ra:sa)(u,1);m.version=S;let f=r.get(d);if(f)t.remove(f);r.set(d,m)}function h(d){let u=r.get(d);if(u){let p=d.index;if(p!==null){if(u.version<p.version)c(d)}}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function n0(e,t,n){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){e.drawElements(i,u,r,d*a),n.update(u,i,1)}function c(d,u,p){if(p===0)return;e.drawElementsInstanced(i,u,r,d*a,p),n.update(u,i,p)}function h(d,u,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,d,0,p);let S=0;for(let m=0;m<p;m++)S+=u[m];n.update(S,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function i0(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(n.calls++,a){case e.TRIANGLES:n.triangles+=o*(r/3);break;case e.LINES:n.lines+=o*(r/2);break;case e.LINE_STRIP:n.lines+=o*(r-1);break;case e.LINE_LOOP:n.lines+=o*r;break;case e.POINTS:n.points+=o*r;break;default:Ue("WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function s0(e,t,n){let i=new WeakMap,s=new at;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=i.get(o);if(u===void 0||u.count!==d){let T=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",T)};if(u!==void 0)u.texture.dispose();let p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],w=o.morphAttributes.color||[],I=0;if(p===!0)I=1;if(_===!0)I=2;if(S===!0)I=3;let y=o.attributes.position.count*I,b=1;if(y>t.maxTextureSize)b=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize;let E=new Float32Array(y*b*4*d),R=new na(E,y,b,d);R.type=qn,R.needsUpdate=!0;let v=I*4;for(let O=0;O<d;O++){let P=m[O],C=f[O],k=w[O],A=y*b*4*O;for(let F=0;F<P.count;F++){let V=F*v;if(p===!0)s.fromBufferAttribute(P,F),E[A+V+0]=s.x,E[A+V+1]=s.y,E[A+V+2]=s.z,E[A+V+3]=0;if(_===!0)s.fromBufferAttribute(C,F),E[A+V+4]=s.x,E[A+V+5]=s.y,E[A+V+6]=s.z,E[A+V+7]=0;if(S===!0)s.fromBufferAttribute(k,F),E[A+V+8]=s.x,E[A+V+9]=s.y,E[A+V+10]=s.z,E[A+V+11]=k.itemSize===4?s.w:1}}u={count:d,texture:R,size:new Fe(y,b)},i.set(o,u),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",a.morphTexture,n);else{let p=0;for(let S=0;S<c.length;S++)p+=c[S];let _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(e,"morphTargetBaseInfluence",_),l.getUniforms().setValue(e,"morphTargetInfluences",c)}l.getUniforms().setValue(e,"morphTargetsTexture",u.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",u.size)}return{update:r}}function r0(e,t,n,i,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h)t.update(u),r.set(u,h);if(c.isInstancedMesh){if(c.hasEventListener("dispose",l)===!1)c.addEventListener("dispose",l);if(r.get(c)!==h){if(n.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null)n.update(c.instanceColor,e.ARRAY_BUFFER);r.set(c,h)}}if(c.isSkinnedMesh){let p=c.skeleton;if(r.get(p)!==h)p.update(),r.set(p,h)}return u}function o(){r=new WeakMap}function l(c){let h=c.target;if(h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),n.remove(h.instanceMatrix),h.instanceColor!==null)n.remove(h.instanceColor)}return{update:a,dispose:o}}var a0={[uo]:"LINEAR_TONE_MAPPING",[fo]:"REINHARD_TONE_MAPPING",[po]:"CINEON_TONE_MAPPING",[mo]:"ACES_FILMIC_TONE_MAPPING",[_o]:"AGX_TONE_MAPPING",[xo]:"NEUTRAL_TONE_MAPPING",[go]:"CUSTOM_TONE_MAPPING"};function o0(e,t,n,i,s,r){let a=new $t(t,n,{type:e,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Ct;c.setAttribute("position",new yt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new yt([0,2,0,0,2,0],2));let h=new fl({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new vt(c,h),u=new Ui(-1,1,1,-1,0,1),p=null,_=null,S=!1,m,f=null,w=[],I=!1;this.setSize=function(y,b){if(a.setSize(y,b),o!==null)o.setSize(y,b);if(l!==null)l.setSize(y,b);for(let E=0;E<w.length;E++){let R=w[E];if(R.setSize)R.setSize(y,b)}},this.setEffects=function(y){w=y,I=w.length>0&&w[0].isRenderPass===!0;let{width:b,height:E}=a;if(w.length>0&&o===null)o=new $t(b,E,{type:In,depthBuffer:!1,stencilBuffer:!1}),l=new $t(b,E,{type:In,depthBuffer:!1,stencilBuffer:!1});for(let R=0;R<w.length;R++){let v=w[R];if(v.setSize)v.setSize(b,E)}},this.begin=function(y,b){if(S)return!1;if(y.toneMapping===_n&&w.length===0)return!1;if(f=b,b!==null){let{width:E,height:R}=b;if(a.width!==E||a.height!==R)this.setSize(E,R)}if(I===!1)y.setRenderTarget(a);return m=y.toneMapping,y.toneMapping=_n,!0},this.hasRenderPass=function(){return I},this.end=function(y,b){y.toneMapping=m,S=!0;let E=a,R=o;for(let v=0;v<w.length;v++){let T=w[v];if(T.enabled===!1)continue;if(T.render(y,R,E,b),T.needsSwap!==!1)E=R,R=R===o?l:o}if(p!==y.outputColorSpace||_!==y.toneMapping){if(p=y.outputColorSpace,_=y.toneMapping,h.defines={},Xe.getTransfer(p)===ht)h.defines.SRGB_TRANSFER="";let v=a0[_];if(v)h.defines[v]="";h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,y.setRenderTarget(f),y.render(d,u),f=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){if(a.dispose(),o!==null)o.dispose();if(l!==null)l.dispose();c.dispose(),h.dispose()}}var Du=new Et,Fl=new Pi(1,1),Uu=new na,Fu=new hl,Ou=new ua,mu=[],gu=[],_u=new Float32Array(16),xu=new Float32Array(9),vu=new Float32Array(4);function Ss(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,r=mu[s];if(r===void 0)r=new Float32Array(s),mu[s]=r;if(t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=n,e[a].toArray(r,o)}return r}function It(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function Pt(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function Ea(e,t){let n=gu[t];if(n===void 0)n=new Int32Array(t),gu[t]=n;for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function l0(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1f(this.addr,t),n[0]=t}function c0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(It(n,t))return;e.uniform2fv(this.addr,t),Pt(n,t)}}function h0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else if(t.r!==void 0){if(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b}else{if(It(n,t))return;e.uniform3fv(this.addr,t),Pt(n,t)}}function u0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(It(n,t))return;e.uniform4fv(this.addr,t),Pt(n,t)}}function d0(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(It(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Pt(n,t)}else{if(It(n,i))return;vu.set(i),e.uniformMatrix2fv(this.addr,!1,vu),Pt(n,i)}}function f0(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(It(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Pt(n,t)}else{if(It(n,i))return;xu.set(i),e.uniformMatrix3fv(this.addr,!1,xu),Pt(n,i)}}function p0(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(It(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Pt(n,t)}else{if(It(n,i))return;_u.set(i),e.uniformMatrix4fv(this.addr,!1,_u),Pt(n,i)}}function m0(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1i(this.addr,t),n[0]=t}function g0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(It(n,t))return;e.uniform2iv(this.addr,t),Pt(n,t)}}function _0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else{if(It(n,t))return;e.uniform3iv(this.addr,t),Pt(n,t)}}function x0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(It(n,t))return;e.uniform4iv(this.addr,t),Pt(n,t)}}function v0(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1ui(this.addr,t),n[0]=t}function y0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(It(n,t))return;e.uniform2uiv(this.addr,t),Pt(n,t)}}function S0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else{if(It(n,t))return;e.uniform3uiv(this.addr,t),Pt(n,t)}}function M0(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(It(n,t))return;e.uniform4uiv(this.addr,t),Pt(n,t)}}function b0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;let r;if(this.type===e.SAMPLER_2D_SHADOW)Fl.compareFunction=n.isReversedDepthBuffer()?ta:ea,r=Fl;else r=Du;n.setTexture2D(t||r,s)}function T0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTexture3D(t||Fu,s)}function E0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTextureCube(t||Ou,s)}function w0(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTexture2DArray(t||Uu,s)}function A0(e){switch(e){case 5126:return l0;case 35664:return c0;case 35665:return h0;case 35666:return u0;case 35674:return d0;case 35675:return f0;case 35676:return p0;case 5124:case 35670:return m0;case 35667:case 35671:return g0;case 35668:case 35672:return _0;case 35669:case 35673:return x0;case 5125:return v0;case 36294:return y0;case 36295:return S0;case 36296:return M0;case 35678:case 36198:case 36298:case 36306:case 35682:return b0;case 35679:case 36299:case 36307:return T0;case 35680:case 36300:case 36308:case 36293:return E0;case 36289:case 36303:case 36311:case 36292:return w0}}function R0(e,t){e.uniform1fv(this.addr,t)}function C0(e,t){let n=Ss(t,this.size,2);e.uniform2fv(this.addr,n)}function I0(e,t){let n=Ss(t,this.size,3);e.uniform3fv(this.addr,n)}function P0(e,t){let n=Ss(t,this.size,4);e.uniform4fv(this.addr,n)}function L0(e,t){let n=Ss(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function N0(e,t){let n=Ss(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function D0(e,t){let n=Ss(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function U0(e,t){e.uniform1iv(this.addr,t)}function F0(e,t){e.uniform2iv(this.addr,t)}function O0(e,t){e.uniform3iv(this.addr,t)}function B0(e,t){e.uniform4iv(this.addr,t)}function z0(e,t){e.uniform1uiv(this.addr,t)}function k0(e,t){e.uniform2uiv(this.addr,t)}function H0(e,t){e.uniform3uiv(this.addr,t)}function G0(e,t){e.uniform4uiv(this.addr,t)}function V0(e,t,n){let i=this.cache,s=t.length,r=Ea(n,s);if(!It(i,r))e.uniform1iv(this.addr,r),Pt(i,r);let a;if(this.type===e.SAMPLER_2D_SHADOW)a=Fl;else a=Du;for(let o=0;o!==s;++o)n.setTexture2D(t[o]||a,r[o])}function W0(e,t,n){let i=this.cache,s=t.length,r=Ea(n,s);if(!It(i,r))e.uniform1iv(this.addr,r),Pt(i,r);for(let a=0;a!==s;++a)n.setTexture3D(t[a]||Fu,r[a])}function X0(e,t,n){let i=this.cache,s=t.length,r=Ea(n,s);if(!It(i,r))e.uniform1iv(this.addr,r),Pt(i,r);for(let a=0;a!==s;++a)n.setTextureCube(t[a]||Ou,r[a])}function q0(e,t,n){let i=this.cache,s=t.length,r=Ea(n,s);if(!It(i,r))e.uniform1iv(this.addr,r),Pt(i,r);for(let a=0;a!==s;++a)n.setTexture2DArray(t[a]||Uu,r[a])}function Y0(e){switch(e){case 5126:return R0;case 35664:return C0;case 35665:return I0;case 35666:return P0;case 35674:return L0;case 35675:return N0;case 35676:return D0;case 5124:case 35670:return U0;case 35667:case 35671:return F0;case 35668:case 35672:return O0;case 35669:case 35673:return B0;case 5125:return z0;case 36294:return k0;case 36295:return H0;case 36296:return G0;case 35678:case 36198:case 36298:case 36306:case 35682:return V0;case 35679:case 36299:case 36307:return W0;case 35680:case 36300:case 36308:case 36293:return X0;case 36289:case 36303:case 36311:case 36292:return q0}}class Bu{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=A0(t.type)}}class zu{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Y0(t.type)}}class ku{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,r=i.length;s!==r;++s){let a=i[s];a.setValue(e,t[a.id],n)}}}var Nl=/(\w+)(\])?(\[|\.)?/g;function yu(e,t){e.seq.push(t),e.map[t.id]=t}function Z0(e,t,n){let i=e.name,s=i.length;Nl.lastIndex=0;while(!0){let r=Nl.exec(i),a=Nl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l)o=o|0;if(c===void 0||c==="["&&a+2===s){yu(n,c===void 0?new Bu(o,e,t):new zu(o,e,t));break}else{let d=n.map[o];if(d===void 0)d=new ku(o),yu(n,d);n=d}}}class or{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let a=e.getActiveUniform(t,r),o=e.getUniformLocation(t,a.name);Z0(a,o,this)}let i=[],s=[];for(let r of this.seq)if(r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW)i.push(r);else s.push(r);if(i.length>0)this.seq=i.concat(s)}setValue(e,t,n,i){let s=this.map[t];if(s!==void 0)s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];if(i!==void 0)this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,r=t.length;s!==r;++s){let a=t[s],o=n[a.id];if(o.needsUpdate!==!1)a.setValue(e,o.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let r=e[i];if(r.id in t)n.push(r)}return n}}function Su(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var K0=37297,J0=0;function $0(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,n.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}var Mu=new Oe;function j0(e){Xe._getMatrix(Mu,Xe.workingColorSpace,e);let t=`mat3( ${Mu.elements.map((n)=>n.toFixed(4))} )`;switch(Xe.getTransfer(e)){case sl:return[t,"LinearTransferOETF"];case ht:return[t,"sRGBTransferOETF"];default:return Ae("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function bu(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),r=(e.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+$0(e.getShaderSource(t),o)}else return r}function Q0(e,t){let n=j0(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var e_={[uo]:"Linear",[fo]:"Reinhard",[po]:"Cineon",[mo]:"ACESFilmic",[_o]:"AgX",[xo]:"Neutral",[go]:"Custom"};function t_(e,t){let n=e_[t];if(n===void 0)return Ae("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }";return"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var ba=new B;function n_(){Xe.getLuminanceCoefficients(ba);let e=ba.x.toFixed(4),t=ba.y.toFixed(4),n=ba.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"\treturn dot( weights, rgb );","}"].join(`
`)}function i_(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ar).join(`
`)}function s_(e){let t=[];for(let n in e){let i=e[n];if(i===!1)continue;t.push("#define "+n+" "+i)}return t.join(`
`)}function r_(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=e.getActiveAttrib(t,s),a=r.name,o=1;if(r.type===e.FLOAT_MAT2)o=2;if(r.type===e.FLOAT_MAT3)o=3;if(r.type===e.FLOAT_MAT4)o=4;n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ar(e){return e!==""}function Tu(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Eu(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var a_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ol(e){return e.replace(a_,l_)}var o_=new Map;function l_(e,t){let n=Ve[t];if(n===void 0){let i=o_.get(t);if(i!==void 0)n=Ve[i],Ae('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Ol(n)}var c_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wu(e){return e.replace(c_,h_)}function h_(e,t,n,i){let s="";for(let r=parseInt(t);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Au(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`;return t}var u_={[Bs]:"SHADOWMAP_TYPE_PCF",[as]:"SHADOWMAP_TYPE_VSM"};function d_(e){return u_[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var f_={[ls]:"ENVMAP_TYPE_CUBE",[Ti]:"ENVMAP_TYPE_CUBE",[ks]:"ENVMAP_TYPE_CUBE_UV"};function p_(e){if(e.envMap===!1)return"ENVMAP_TYPE_CUBE";return f_[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var m_={[Ti]:"ENVMAP_MODE_REFRACTION"};function g_(e){if(e.envMap===!1)return"ENVMAP_MODE_REFLECTION";return m_[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var __={[Uh]:"ENVMAP_BLENDING_MULTIPLY",[Fh]:"ENVMAP_BLENDING_MIX",[Oh]:"ENVMAP_BLENDING_ADD"};function x_(e){if(e.envMap===!1)return"ENVMAP_BLENDING_NONE";return __[e.combine]||"ENVMAP_BLENDING_NONE"}function v_(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function y_(e,t,n,i){let s=e.getContext(),{defines:r,vertexShader:a,fragmentShader:o}=n,l=d_(n),c=p_(n),h=g_(n),d=x_(n),u=v_(n),p=i_(n),_=s_(r),S=s.createProgram(),m,f,w=n.glslVersion?"#version "+n.glslVersion+`
`:"";if(n.isRawShaderMaterial){if(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ar).join(`
`),m.length>0)m+=`
`;if(f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ar).join(`
`),f.length>0)f+=`
`}else m=[Au(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","\tattribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","\tattribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","\tuniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","\tattribute vec2 uv1;","#endif","#ifdef USE_UV2","\tattribute vec2 uv2;","#endif","#ifdef USE_UV3","\tattribute vec2 uv3;","#endif","#ifdef USE_TANGENT","\tattribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","\tattribute vec4 color;","#elif defined( USE_COLOR )","\tattribute vec3 color;","#endif","#ifdef USE_SKINNING","\tattribute vec4 skinIndex;","\tattribute vec4 skinWeight;","#endif",`
`].filter(ar).join(`
`),f=[Au(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+h:"",n.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==_n?"#define TONE_MAPPING":"",n.toneMapping!==_n?Ve.tonemapping_pars_fragment:"",n.toneMapping!==_n?t_("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,Q0("linearToOutputTexel",n.outputColorSpace),n_(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ar).join(`
`);if(a=Ol(a),a=Tu(a,n),a=Eu(a,n),o=Ol(o),o=Tu(o,n),o=Eu(o,n),a=wu(a),o=wu(o),n.isRawShaderMaterial!==!0)w=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",n.glslVersion===rl?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===rl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f;let I=w+m+a,y=w+f+o,b=Su(s,s.VERTEX_SHADER,I),E=Su(s,s.FRAGMENT_SHADER,y);if(s.attachShader(S,b),s.attachShader(S,E),n.index0AttributeName!==void 0)s.bindAttribLocation(S,0,n.index0AttributeName);else if(n.hasPositionAttribute===!0)s.bindAttribLocation(S,0,"position");s.linkProgram(S);function R(P){if(e.debug.checkShaderErrors){let C=s.getProgramInfoLog(S)||"",k=s.getShaderInfoLog(b)||"",A=s.getShaderInfoLog(E)||"",F=C.trim(),V=k.trim(),z=A.trim(),Q=!0,W=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(Q=!1,typeof e.debug.onShaderError==="function")e.debug.onShaderError(s,S,b,E);else{let K=bu(s,b,"vertex"),ee=bu(s,E,"fragment");Ue("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+K+`
`+ee)}else if(F!=="")Ae("WebGLProgram: Program Info Log:",F);else if(V===""||z==="")W=!1;if(W)P.diagnostics={runnable:Q,programLog:F,vertexShader:{log:V,prefix:m},fragmentShader:{log:z,prefix:f}}}s.deleteShader(b),s.deleteShader(E),v=new or(s,S),T=r_(s,S)}let v;this.getUniforms=function(){if(v===void 0)R(this);return v};let T;this.getAttributes=function(){if(T===void 0)R(this);return T};let O=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){if(O===!1)O=s.getProgramParameter(S,K0);return O},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=J0++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=E,this}var S_=0;class Hu{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);if(i.has(t)===!1)i.add(t),t.usedTimes++;if(i.has(n)===!1)i.add(n),n.usedTimes++;return this}remove(e){let t=this.materialCache.get(e);for(let n of t)if(n.usedTimes--,n.usedTimes===0)this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);if(n===void 0)n=new Set,t.set(e,n);return n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);if(n===void 0)n=new Gu(e),t.set(e,n);return n}}class Gu{constructor(e){this.id=S_++,this.code=e,this.usedTimes=0}}function M_(e){return e===Ri||e===$r||e===jr}function b_(e,t,n,i,s,r){let a=new Ws,o=new Hu,l=new Set,c=[],h=new Map,{logarithmicDepthBuffer:d,precision:u}=i,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){if(l.add(v),v===0)return"uv";return`uv${v}`}function S(v,T,O,P,C,k){let A=P.fog,F=C.geometry,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,z=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,Q=t.get(v.envMap||V,z),W=!!Q&&Q.mapping===ks?Q.image.height:null,K=p[v.type];if(v.precision!==null){if(u=i.getMaxPrecision(v.precision),u!==v.precision)Ae("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead.")}let ee=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Te=ee!==void 0?ee.length:0,Se=0;if(F.morphAttributes.position!==void 0)Se=1;if(F.morphAttributes.normal!==void 0)Se=2;if(F.morphAttributes.color!==void 0)Se=3;let We,He,Y,ie;if(K){let ut=Dn[K];We=ut.vertexShader,He=ut.fragmentShader}else{We=v.vertexShader,He=v.fragmentShader;let ut=o.getVertexShaderStage(v),it=o.getFragmentShaderStage(v);o.update(v,ut,it),Y=ut.id,ie=it.id}let re=e.getRenderTarget(),Re=e.state.buffers.depth.getReversed(),Ne=C.isInstancedMesh===!0,ae=C.isBatchedMesh===!0,Ce=!!v.map,Ie=!!v.matcap,ke=!!Q,qe=!!v.aoMap,Je=!!v.lightMap,_t=!!v.bumpMap&&v.wireframe===!1,Qe=!!v.normalMap,Wt=!!v.displacementMap,wt=!!v.emissiveMap,At=!!v.metalnessMap,N=!!v.roughnessMap,Xt=v.anisotropy>0,nt=v.clearcoat>0,xt=v.dispersion>0,M=v.retroreflectivity>0,g=v.iridescence>0,L=v.sheen>0,X=v.transmission>0,ne=Xt&&!!v.anisotropyMap,oe=nt&&!!v.clearcoatMap,he=nt&&!!v.clearcoatNormalMap,Z=nt&&!!v.clearcoatRoughnessMap,j=g&&!!v.iridescenceMap,ge=g&&!!v.iridescenceThicknessMap,we=L&&!!v.sheenColorMap,ue=L&&!!v.sheenRoughnessMap,se=!!v.specularMap,Pe=!!v.specularColorMap,De=!!v.specularIntensityMap,et=X&&!!v.transmissionMap,U=X&&!!v.thicknessMap,le=!!v.gradientMap,J=!!v.alphaMap,ce=v.alphaTest>0,_e=!!v.alphaHash,te=!!v.extensions,fe=_n;if(v.toneMapped){if(re===null||re.isXRRenderTarget===!0)fe=e.toneMapping}let ze={shaderID:K,shaderType:v.type,shaderName:v.name,vertexShader:We,fragmentShader:He,defines:v.defines,customVertexShaderID:Y,customFragmentShaderID:ie,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:ae,batchingColor:ae&&C._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&C.instanceColor!==null,instancingMorph:Ne&&C.morphTexture!==null,outputColorSpace:re===null?e.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Xe.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ce,matcap:Ie,envMap:ke,envMapMode:ke&&Q.mapping,envMapCubeUVHeight:W,aoMap:qe,lightMap:Je,bumpMap:_t,normalMap:Qe,displacementMap:Wt,emissiveMap:wt,normalMapObjectSpace:Qe&&v.normalMapType===Xh,normalMapTangentSpace:Qe&&v.normalMapType===il,packedNormalMap:Qe&&v.normalMapType===il&&M_(v.normalMap.format),metalnessMap:At,roughnessMap:N,anisotropy:Xt,anisotropyMap:ne,clearcoat:nt,clearcoatMap:oe,clearcoatNormalMap:he,clearcoatRoughnessMap:Z,dispersion:xt,retroreflection:M,iridescence:g,iridescenceMap:j,iridescenceThicknessMap:ge,sheen:L,sheenColorMap:we,sheenRoughnessMap:ue,specularMap:se,specularColorMap:Pe,specularIntensityMap:De,transmission:X,transmissionMap:et,thicknessMap:U,gradientMap:le,opaque:v.transparent===!1&&v.blending===zs&&v.alphaToCoverage===!1,alphaMap:J,alphaTest:ce,alphaHash:_e,combine:v.combine,mapUv:Ce&&_(v.map.channel),aoMapUv:qe&&_(v.aoMap.channel),lightMapUv:Je&&_(v.lightMap.channel),bumpMapUv:_t&&_(v.bumpMap.channel),normalMapUv:Qe&&_(v.normalMap.channel),displacementMapUv:Wt&&_(v.displacementMap.channel),emissiveMapUv:wt&&_(v.emissiveMap.channel),metalnessMapUv:At&&_(v.metalnessMap.channel),roughnessMapUv:N&&_(v.roughnessMap.channel),anisotropyMapUv:ne&&_(v.anisotropyMap.channel),clearcoatMapUv:oe&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:he&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:ge&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:we&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:ue&&_(v.sheenRoughnessMap.channel),specularMapUv:se&&_(v.specularMap.channel),specularColorMapUv:Pe&&_(v.specularColorMap.channel),specularIntensityMapUv:De&&_(v.specularIntensityMap.channel),transmissionMapUv:et&&_(v.transmissionMap.channel),thicknessMapUv:U&&_(v.thicknessMap.channel),alphaMapUv:J&&_(v.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Qe||Xt),vertexNormals:!!F.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!F.attributes.uv&&(Ce||J),fog:!!A,useFog:v.fog===!0,fogExp2:!!A&&A.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||F.attributes.normal===void 0&&Qe===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Re,skinning:C.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:Se,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:e.shadowMap.enabled&&O.length>0,shadowMapType:e.shadowMap.type,toneMapping:fe,decodeVideoTexture:Ce&&v.map.isVideoTexture===!0&&Xe.getTransfer(v.map.colorSpace)===ht,decodeVideoTextureEmissive:wt&&v.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(v.emissiveMap.colorSpace)===ht,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Bt,flipSided:v.side===qt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:te&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(te&&v.extensions.multiDraw===!0||ae)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ze.vertexUv1s=l.has(1),ze.vertexUv2s=l.has(2),ze.vertexUv3s=l.has(3),l.clear(),ze}function m(v){let T=[];if(v.shaderID)T.push(v.shaderID);else T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID);if(v.defines!==void 0)for(let O in v.defines)T.push(O),T.push(v.defines[O]);if(v.isRawShaderMaterial===!1)f(T,v),w(T,v),T.push(e.outputColorSpace);return T.push(v.customProgramCacheKey),T.join()}function f(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numSunLights),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numSunLightShadows),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.numLightProbes),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function w(v,T){if(a.disableAll(),T.instancing)a.enable(0);if(T.instancingColor)a.enable(1);if(T.instancingMorph)a.enable(2);if(T.matcap)a.enable(3);if(T.envMap)a.enable(4);if(T.normalMapObjectSpace)a.enable(5);if(T.normalMapTangentSpace)a.enable(6);if(T.clearcoat)a.enable(7);if(T.iridescence)a.enable(8);if(T.alphaTest)a.enable(9);if(T.vertexColors)a.enable(10);if(T.vertexAlphas)a.enable(11);if(T.vertexUv1s)a.enable(12);if(T.vertexUv2s)a.enable(13);if(T.vertexUv3s)a.enable(14);if(T.vertexTangents)a.enable(15);if(T.anisotropy)a.enable(16);if(T.alphaHash)a.enable(17);if(T.batching)a.enable(18);if(T.dispersion)a.enable(19);if(T.retroreflection)a.enable(24);if(T.batchingColor)a.enable(20);if(T.gradientMap)a.enable(21);if(T.packedNormalMap)a.enable(22);if(T.vertexNormals)a.enable(23);if(v.push(a.mask),a.disableAll(),T.fog)a.enable(0);if(T.useFog)a.enable(1);if(T.flatShading)a.enable(2);if(T.logarithmicDepthBuffer)a.enable(3);if(T.reversedDepthBuffer)a.enable(4);if(T.skinning)a.enable(5);if(T.morphTargets)a.enable(6);if(T.morphNormals)a.enable(7);if(T.morphColors)a.enable(8);if(T.premultipliedAlpha)a.enable(9);if(T.shadowMapEnabled)a.enable(10);if(T.doubleSided)a.enable(11);if(T.flipSided)a.enable(12);if(T.useDepthPacking)a.enable(13);if(T.dithering)a.enable(14);if(T.transmission)a.enable(15);if(T.sheen)a.enable(16);if(T.opaque)a.enable(17);if(T.pointsUvs)a.enable(18);if(T.decodeVideoTexture)a.enable(19);if(T.decodeVideoTextureEmissive)a.enable(20);if(T.alphaToCoverage)a.enable(21);if(T.numLightProbeGrids>0)a.enable(22);if(T.hasPositionAttribute)a.enable(23);v.push(a.mask)}function I(v){let T=p[v.type],O;if(T){let P=Dn[T];O=iu.clone(P.uniforms)}else O=v.uniforms;return O}function y(v,T){let O=h.get(T);if(O!==void 0)++O.usedTimes;else O=new y_(e,T,v,s),c.push(O),h.set(T,O);return O}function b(v){if(--v.usedTimes===0){let T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function E(v){o.remove(v)}function R(){o.dispose()}return{getParameters:S,getProgramCacheKey:m,getUniforms:I,acquireProgram:y,releaseProgram:b,releaseShaderCache:E,programs:c,dispose:R}}function T_(){let e=new WeakMap;function t(a){return e.has(a)}function n(a){let o=e.get(a);if(o===void 0)o={},e.set(a,o);return o}function i(a){e.delete(a)}function s(a,o,l){e.get(a)[o]=l}function r(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:r}}function E_(e,t){if(e.groupOrder!==t.groupOrder)return e.groupOrder-t.groupOrder;else if(e.renderOrder!==t.renderOrder)return e.renderOrder-t.renderOrder;else if(e.material.id!==t.material.id)return e.material.id-t.material.id;else if(e.materialVariant!==t.materialVariant)return e.materialVariant-t.materialVariant;else if(e.z!==t.z)return e.z-t.z;else return e.id-t.id}function Ru(e,t){if(e.groupOrder!==t.groupOrder)return e.groupOrder-t.groupOrder;else if(e.renderOrder!==t.renderOrder)return e.renderOrder-t.renderOrder;else if(e.z!==t.z)return t.z-e.z;else return e.id-t.id}function Cu(){let e=[],t=0,n=[],i=[],s=[];function r(){t=0,n.length=0,i.length=0,s.length=0}function a(u){let p=0;if(u.isInstancedMesh)p+=2;if(u.isSkinnedMesh)p+=1;return p}function o(u,p,_,S,m,f){let w=e[t];if(w===void 0)w={id:u.id,object:u,geometry:p,material:_,materialVariant:a(u),groupOrder:S,renderOrder:u.renderOrder,z:m,group:f},e[t]=w;else w.id=u.id,w.object=u,w.geometry=p,w.material=_,w.materialVariant=a(u),w.groupOrder=S,w.renderOrder=u.renderOrder,w.z=m,w.group=f;return t++,w}function l(u,p,_,S,m,f,w){if(w.reversedDepth===!0)m=-m;let I=o(u,p,_,S,m,f);if(_.transmission>0)i.push(I);else if(_.transparent===!0)s.push(I);else n.push(I)}function c(u,p,_,S,m,f){let w=o(u,p,_,S,m,f);if(_.transmission>0)i.unshift(w);else if(_.transparent===!0)s.unshift(w);else n.unshift(w)}function h(u,p){if(n.length>1)n.sort(u||E_);if(i.length>1)i.sort(p||Ru);if(s.length>1)s.sort(p||Ru)}function d(){for(let u=t,p=e.length;u<p;u++){let _=e[u];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function w_(){let e=new WeakMap;function t(i,s){let r=e.get(i),a;if(r===void 0)a=new Cu,e.set(i,[a]);else if(s>=r.length)a=new Cu,r.push(a);else a=r[s];return a}function n(){e=new WeakMap}return{get:t,dispose:n}}function A_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new B,color:new Le};break;case"SpotLight":n={position:new B,direction:new B,color:new Le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new B,color:new Le,distance:0,decay:0};break;case"HemisphereLight":n={direction:new B,skyColor:new Le,groundColor:new Le};break;case"RectAreaLight":n={color:new Le,position:new B,halfWidth:new B,halfHeight:new B};break}return e[t.id]=n,n}}}function R_(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1000};break}return e[t.id]=n,n}}}var C_=0;function I_(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function P_(e){let t=new A_,n=R_(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new B);let s=new B,r=new Be,a=new Be;function o(c){let h=0,d=0,u=0;for(let C=0;C<9;C++)i.probe[C].set(0,0,0);let p=0,_=0,S=0,m=0,f=0,w=0,I=0,y=0,b=0,E=0,R=0,v=0,T=0,O=0;c.sort(I_);for(let C=0,k=c.length;C<k;C++){let A=c[C],{color:F,intensity:V,distance:z}=A,Q=null;if(A.shadow&&A.shadow.map)if(A.shadow.map.texture.format===Ri)Q=A.shadow.map.texture;else Q=A.shadow.map.depthTexture||A.shadow.map.texture;if(A.isAmbientLight)h+=F.r*V,d+=F.g*V,u+=F.b*V;else if(A.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(A.sh.coefficients[W],V);O++}else if(A.isSunLight){let W=t.get(A);if(W.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let K=A.shadow,ee=n.get(A);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),i.sunShadow[_]=ee,i.sunShadowMap[_]=Q;let Te=K.getViewportCount();for(let Se=0;Se<Te;Se++)i.sunShadowMatrix[S+Se]=K.getMatrix(Se),i.sunShadowCascade[S+Se]=K._cascadeData[Se];S+=Te,_++}i.sun[p]=W,p++}else if(A.isDirectionalLight){let W=t.get(A);if(W.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let K=A.shadow,ee=n.get(A);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize=K.mapSize,i.directionalShadow[m]=ee,i.directionalShadowMap[m]=Q,i.directionalShadowMatrix[m]=A.shadow.matrix,b++}i.directional[m]=W,m++}else if(A.isSpotLight){let W=t.get(A);W.position.setFromMatrixPosition(A.matrixWorld),W.color.copy(F).multiplyScalar(V),W.distance=z,W.coneCos=Math.cos(A.angle),W.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),W.decay=A.decay,i.spot[w]=W;let K=A.shadow;if(A.map){if(i.spotLightMap[v]=A.map,v++,K.updateMatrices(A),A.castShadow)T++}if(i.spotLightMatrix[w]=K.matrix,A.castShadow){let ee=n.get(A);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize=K.mapSize,i.spotShadow[w]=ee,i.spotShadowMap[w]=Q,R++}w++}else if(A.isRectAreaLight){let W=t.get(A);W.color.copy(F).multiplyScalar(V),W.halfWidth.set(A.width*0.5,0,0),W.halfHeight.set(0,A.height*0.5,0),i.rectArea[I]=W,I++}else if(A.isPointLight){let W=t.get(A);if(W.color.copy(A.color).multiplyScalar(A.intensity),W.distance=A.distance,W.decay=A.decay,A.castShadow){let K=A.shadow,ee=n.get(A);ee.shadowIntensity=K.intensity,ee.shadowBias=K.bias,ee.shadowNormalBias=K.normalBias,ee.shadowRadius=K.radius,ee.shadowMapSize=K.mapSize,ee.shadowCameraNear=K.camera.near,ee.shadowCameraFar=K.camera.far,i.pointShadow[f]=ee,i.pointShadowMap[f]=Q,i.pointShadowMatrix[f]=A.shadow.matrix,E++}i.point[f]=W,f++}else if(A.isHemisphereLight){let W=t.get(A);W.skyColor.copy(A.color).multiplyScalar(V),W.groundColor.copy(A.groundColor).multiplyScalar(V),i.hemi[y]=W,y++}}if(I>0)if(e.has("OES_texture_float_linear")===!0)i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2;else i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2;i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;let P=i.hash;if(P.sunLength!==p||P.directionalLength!==m||P.pointLength!==f||P.spotLength!==w||P.rectAreaLength!==I||P.hemiLength!==y||P.numSunShadows!==_||P.numDirectionalShadows!==b||P.numPointShadows!==E||P.numSpotShadows!==R||P.numSpotMaps!==v||P.numLightProbes!==O)i.sun.length=p,i.directional.length=m,i.spot.length=w,i.rectArea.length=I,i.point.length=f,i.hemi.length=y,i.sunShadow.length=_,i.sunShadowMap.length=_,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=R,i.spotShadowMap.length=R,i.spotLightMatrix.length=R+v-T,i.spotLightMap.length=v,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=O,P.sunLength=p,P.directionalLength=m,P.pointLength=f,P.spotLength=w,P.rectAreaLength=I,P.hemiLength=y,P.numSunShadows=_,P.numDirectionalShadows=b,P.numPointShadows=E,P.numSpotShadows=R,P.numSpotMaps=v,P.numLightProbes=O,i.version=C_++}function l(c,h){let d=0,u=0,p=0,_=0,S=0,m=0,f=h.matrixWorldInverse;for(let w=0,I=c.length;w<I;w++){let y=c[w];if(y.isSunLight){let b=i.sun[d];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(f),d++}else if(y.isDirectionalLight){let b=i.directional[u];b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),u++}else if(y.isSpotLight){let b=i.spot[_];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(f),b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),_++}else if(y.isRectAreaLight){let b=i.rectArea[S];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(f),a.identity(),r.copy(y.matrixWorld),r.premultiply(f),a.extractRotation(r),b.halfWidth.set(y.width*0.5,0,0),b.halfHeight.set(0,y.height*0.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),S++}else if(y.isPointLight){let b=i.point[p];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(f),p++}else if(y.isHemisphereLight){let b=i.hemi[m];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(f),m++}}}return{setup:o,setupView:l,state:i}}function Iu(e){let t=new P_(e),n=[],i=[],s=[];function r(u){d.camera=u,n.length=0,i.length=0,s.length=0}function a(u){n.push(u)}function o(u){i.push(u)}function l(u){s.push(u)}function c(){t.setup(n)}function h(u){t.setupView(n,u)}let d={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function L_(e){let t=new WeakMap;function n(s,r=0){let a=t.get(s),o;if(a===void 0)o=new Iu(e),t.set(s,[o]);else if(r>=a.length)o=new Iu(e),a.push(o);else o=a[r];return o}function i(){t=new WeakMap}return{get:n,dispose:i}}var N_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D_=`uniform sampler2D shadow_pass;
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
}`,U_=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],F_=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Pu=new Be,rr=new B,Dl=new B;function O_(e,t,n){let i=new $s,s=new Fe,r=new Fe,a=new at,o=new pl,l=new ml,c={},h=n.maxTextureSize,d={[ai]:qt,[qt]:ai,[Bt]:Bt},u=new cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:N_,fragmentShader:D_}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let _=new Ct;_.setAttribute("position",new Nt(new Float32Array([-1,-1,0.5,3,-1,0.5,-1,3,0.5]),3));let S=new vt(_,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Bs;let f=this.type;this.render=function(E,R,v){if(m.enabled===!1)return;if(m.autoUpdate===!1&&m.needsUpdate===!1)return;if(E.length===0)return;if(this.type===oh)Ae("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Bs;let T=e.getRenderTarget(),O=e.getActiveCubeFace(),P=e.getActiveMipmapLevel(),C=e.state;if(C.setBlending(Rn),C.buffers.depth.getReversed()===!0)C.buffers.color.setClear(0,0,0,0);else C.buffers.color.setClear(1,1,1,1);C.buffers.depth.setTest(!0),C.setScissorTest(!1);let k=f!==this.type;if(k)R.traverse(function(A){if(A.material)if(Array.isArray(A.material))A.material.forEach((F)=>F.needsUpdate=!0);else A.material.needsUpdate=!0});for(let A=0,F=E.length;A<F;A++){let V=E[A],z=V.shadow;if(z===void 0){Ae("WebGLShadowMap:",V,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let Q=z.getFrameExtents();if(s.multiply(Q),r.copy(z.mapSize),s.x>h||s.y>h){if(s.x>h)r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,z.mapSize.x=r.x;if(s.y>h)r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,z.mapSize.y=r.y}let W=e.state.buffers.depth.getReversed();if(z.camera._reversedDepth=W,z.map===null||k===!0){if(z.map!==null){if(z.map.depthTexture!==null)z.map.depthTexture.dispose(),z.map.depthTexture=null;z.map.dispose()}if(this.type===as){if(V.isPointLight){Ae("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new $t(s.x,s.y,{format:Ri,type:In,minFilter:Dt,magFilter:Dt,generateMipmaps:!1}),z.map.texture.name=V.name+".shadowMap",z.map.depthTexture=new Pi(s.x,s.y,qn),z.map.depthTexture.name=V.name+".shadowMapDepth",z.map.depthTexture.format=wi,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=xn,z.map.depthTexture.magFilter=xn}else{if(V.isPointLight)z.map=new Bl(s.x),z.map.depthTexture=new ul(s.x,oi);else z.map=new $t(s.x,s.y),z.map.depthTexture=new Pi(s.x,s.y,oi);if(z.map.depthTexture.name=V.name+".shadowMap",z.map.depthTexture.format=wi,this.type===Bs)z.map.depthTexture.compareFunction=W?ta:ea,z.map.depthTexture.minFilter=Dt,z.map.depthTexture.magFilter=Dt;else z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=xn,z.map.depthTexture.magFilter=xn}z.camera.updateProjectionMatrix()}if(z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y))z.map.setSize(s.x,s.y);let K=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();if(V.isPointLight!==!0)z.updateMatrices(V,v);for(let ee=0;ee<K;ee++){let Te=z.getCamera(ee);if(V.isPointLight){let{camera:Se,matrix:We}=z,He=V.distance||Se.far;if(He!==Se.far)Se.far=He,Se.updateProjectionMatrix();rr.setFromMatrixPosition(V.matrixWorld),Se.position.copy(rr),Dl.copy(Se.position),Dl.add(U_[ee]),Se.up.copy(F_[ee]),Se.lookAt(Dl),Se.updateMatrixWorld(),We.makeTranslation(-rr.x,-rr.y,-rr.z),Pu.multiplyMatrices(Se.projectionMatrix,Se.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Pu,Se.coordinateSystem,Se.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)e.setRenderTarget(z.map,ee),e.clear();else{if(ee===0)e.setRenderTarget(z.map),e.clear();let Se=z.getViewport(ee);a.set(r.x*Se.x,r.y*Se.y,r.x*Se.z,r.y*Se.w),C.viewport(a)}i=z.getFrustum(ee),y(R,v,Te,V,this.type)}if(z.isPointLightShadow!==!0&&this.type===as)w(z,v);z.needsUpdate=!1}f=this.type,m.needsUpdate=!1,e.setRenderTarget(T,O,P)};function w(E,R){let v=t.update(S);if(u.defines.VSM_SAMPLES!==E.blurSamples)u.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0;if(E.mapPass===null)E.mapPass=new $t(s.x,s.y,{format:Ri,type:In});else if(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)E.mapPass.setSize(E.map.width,E.map.height);u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,e.setRenderTarget(E.mapPass),e.clear(),e.renderBufferDirect(R,null,v,u,S,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value.set(E.map.width,E.map.height),p.uniforms.radius.value=E.radius,e.setRenderTarget(E.map),e.clear(),e.renderBufferDirect(R,null,v,p,S,null)}function I(E,R,v,T){let O=null,P=v.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(P!==void 0)O=P;else if(O=v.isPointLight===!0?l:o,e.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let C=O.uuid,k=R.uuid,A=c[C];if(A===void 0)A={},c[C]=A;let F=A[k];if(F===void 0)F=O.clone(),A[k]=F,R.addEventListener("dispose",b);O=F}if(O.visible=R.visible,O.wireframe=R.wireframe,T===as)O.side=R.shadowSide!==null?R.shadowSide:R.side;else O.side=R.shadowSide!==null?R.shadowSide:d[R.side];if(O.alphaMap=R.alphaMap,O.alphaTest=R.alphaToCoverage===!0?0.5:R.alphaTest,O.map=R.map,O.clipShadows=R.clipShadows,O.clippingPlanes=R.clippingPlanes,O.clipIntersection=R.clipIntersection,O.displacementMap=R.displacementMap,O.displacementScale=R.displacementScale,O.displacementBias=R.displacementBias,O.wireframeLinewidth=R.wireframeLinewidth,O.linewidth=R.linewidth,v.isPointLight===!0&&O.isMeshDistanceMaterial===!0){let C=e.properties.get(O);C.light=v}return O}function y(E,R,v,T,O){if(E.visible===!1)return;if(E.layers.test(R.layers)&&(E.isMesh||E.isLine||E.isPoints)){if((E.castShadow||E.receiveShadow&&O===as)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,E.matrixWorld);let k=t.update(E),A=E.material;if(Array.isArray(A)){let F=k.groups;for(let V=0,z=F.length;V<z;V++){let Q=F[V],W=A[Q.materialIndex];if(W&&W.visible){let K=I(E,W,T,O);E.onBeforeShadow(e,E,R,v,k,K,Q),e.renderBufferDirect(v,null,k,K,E,Q),E.onAfterShadow(e,E,R,v,k,K,Q)}}}else if(A.visible){let F=I(E,A,T,O);E.onBeforeShadow(e,E,R,v,k,F,null),e.renderBufferDirect(v,null,k,F,E,null),E.onAfterShadow(e,E,R,v,k,F,null)}}}let C=E.children;for(let k=0,A=C.length;k<A;k++)y(C[k],R,v,T,O)}function b(E){E.target.removeEventListener("dispose",b);for(let v in c){let T=c[v],O=E.target.uuid;if(O in T)T[O].dispose(),delete T[O]}}}function B_(e,t){function n(){let U=!1,le=new at,J=null,ce=new at(0,0,0,0);return{setMask:function(_e){if(J!==_e&&!U)e.colorMask(_e,_e,_e,_e),J=_e},setLocked:function(_e){U=_e},setClear:function(_e,te,fe,ze,ut){if(ut===!0)_e*=ze,te*=ze,fe*=ze;if(le.set(_e,te,fe,ze),ce.equals(le)===!1)e.clearColor(_e,te,fe,ze),ce.copy(le)},reset:function(){U=!1,J=null,ce.set(-1,0,0,0)}}}function i(){let U=!1,le=!1,J=null,ce=null,_e=null;return{setReversed:function(te){if(le!==te){let fe=t.get("EXT_clip_control");if(te)fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.ZERO_TO_ONE_EXT);else fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.NEGATIVE_ONE_TO_ONE_EXT);le=te;let ze=_e;_e=null,this.setClear(ze)}},getReversed:function(){return le},setTest:function(te){if(te)re(e.DEPTH_TEST);else Re(e.DEPTH_TEST)},setMask:function(te){if(J!==te&&!U)e.depthMask(te),J=te},setFunc:function(te){if(le)te=tu[te];if(ce!==te){switch(te){case Rh:e.depthFunc(e.NEVER);break;case Ch:e.depthFunc(e.ALWAYS);break;case Ih:e.depthFunc(e.LESS);break;case ho:e.depthFunc(e.LEQUAL);break;case Ph:e.depthFunc(e.EQUAL);break;case Lh:e.depthFunc(e.GEQUAL);break;case Nh:e.depthFunc(e.GREATER);break;case Dh:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ce=te}},setLocked:function(te){U=te},setClear:function(te){if(_e!==te){if(_e=te,le)te=1-te;e.clearDepth(te)}},reset:function(){U=!1,J=null,ce=null,_e=null,le=!1}}}function s(){let U=!1,le=null,J=null,ce=null,_e=null,te=null,fe=null,ze=null,ut=null;return{setTest:function(it){if(!U)if(it)re(e.STENCIL_TEST);else Re(e.STENCIL_TEST)},setMask:function(it){if(le!==it&&!U)e.stencilMask(it),le=it},setFunc:function(it,bn,On){if(J!==it||ce!==bn||_e!==On)e.stencilFunc(it,bn,On),J=it,ce=bn,_e=On},setOp:function(it,bn,On){if(te!==it||fe!==bn||ze!==On)e.stencilOp(it,bn,On),te=it,fe=bn,ze=On},setLocked:function(it){U=it},setClear:function(it){if(ut!==it)e.clearStencil(it),ut=it},reset:function(){U=!1,le=null,J=null,ce=null,_e=null,te=null,fe=null,ze=null,ut=null}}}let r=new n,a=new i,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},p=new WeakMap,_=[],S=null,m=!1,f=null,w=null,I=null,y=null,b=null,E=null,R=null,v=new Le(0,0,0),T=0,O=!1,P=null,C=null,k=null,A=null,F=null,V=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,Q=0,W=e.getParameter(e.VERSION);if(W.indexOf("WebGL")!==-1)Q=parseFloat(/^WebGL (\d)/.exec(W)[1]),z=Q>=1;else if(W.indexOf("OpenGL ES")!==-1)Q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),z=Q>=2;let K=null,ee={},Te=e.getParameter(e.SCISSOR_BOX),Se=e.getParameter(e.VIEWPORT),We=new at().fromArray(Te),He=new at().fromArray(Se);function Y(U,le,J,ce){let _e=new Uint8Array(4),te=e.createTexture();e.bindTexture(U,te),e.texParameteri(U,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(U,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let fe=0;fe<J;fe++)if(U===e.TEXTURE_3D||U===e.TEXTURE_2D_ARRAY)e.texImage3D(le,0,e.RGBA,1,1,ce,0,e.RGBA,e.UNSIGNED_BYTE,_e);else e.texImage2D(le+fe,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,_e);return te}let ie={};ie[e.TEXTURE_2D]=Y(e.TEXTURE_2D,e.TEXTURE_2D,1),ie[e.TEXTURE_CUBE_MAP]=Y(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[e.TEXTURE_2D_ARRAY]=Y(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ie[e.TEXTURE_3D]=Y(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(e.DEPTH_TEST),a.setFunc(ho),_t(!1),Qe(ao),re(e.CULL_FACE),qe(Rn);function re(U){if(h[U]!==!0)e.enable(U),h[U]=!0}function Re(U){if(h[U]!==!1)e.disable(U),h[U]=!1}function Ne(U,le){if(u[U]!==le){if(e.bindFramebuffer(U,le),u[U]=le,U===e.DRAW_FRAMEBUFFER)u[e.FRAMEBUFFER]=le;if(U===e.FRAMEBUFFER)u[e.DRAW_FRAMEBUFFER]=le;return!0}return!1}function ae(U,le){let J=_,ce=!1;if(U){if(J=p.get(le),J===void 0)J=[],p.set(le,J);let _e=U.textures;if(J.length!==_e.length||J[0]!==e.COLOR_ATTACHMENT0){for(let te=0,fe=_e.length;te<fe;te++)J[te]=e.COLOR_ATTACHMENT0+te;J.length=_e.length,ce=!0}}else if(J[0]!==e.BACK)J[0]=e.BACK,ce=!0;if(ce)e.drawBuffers(J)}function Ce(U){if(S!==U)return e.useProgram(U),S=U,!0;return!1}let Ie={[os]:e.FUNC_ADD,[ch]:e.FUNC_SUBTRACT,[hh]:e.FUNC_REVERSE_SUBTRACT};Ie[uh]=e.MIN,Ie[dh]=e.MAX;let ke={[fh]:e.ZERO,[ph]:e.ONE,[mh]:e.SRC_COLOR,[_h]:e.SRC_ALPHA,[bh]:e.SRC_ALPHA_SATURATE,[Sh]:e.DST_COLOR,[vh]:e.DST_ALPHA,[gh]:e.ONE_MINUS_SRC_COLOR,[xh]:e.ONE_MINUS_SRC_ALPHA,[Mh]:e.ONE_MINUS_DST_COLOR,[yh]:e.ONE_MINUS_DST_ALPHA,[Th]:e.CONSTANT_COLOR,[Eh]:e.ONE_MINUS_CONSTANT_COLOR,[wh]:e.CONSTANT_ALPHA,[Ah]:e.ONE_MINUS_CONSTANT_ALPHA};function qe(U,le,J,ce,_e,te,fe,ze,ut,it){if(U===Rn){if(m===!0)Re(e.BLEND),m=!1;return}if(m===!1)re(e.BLEND),m=!0;if(U!==lh){if(U!==f||it!==O){if(w!==os||b!==os)e.blendEquation(e.FUNC_ADD),w=os,b=os;if(it)switch(U){case zs:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case oo:e.blendFunc(e.ONE,e.ONE);break;case lo:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case co:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ue("WebGLState: Invalid blending: ",U);break}else switch(U){case zs:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case oo:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case lo:Ue("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case co:Ue("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ue("WebGLState: Invalid blending: ",U);break}I=null,y=null,E=null,R=null,v.set(0,0,0),T=0,f=U,O=it}return}if(_e=_e||le,te=te||J,fe=fe||ce,le!==w||_e!==b)e.blendEquationSeparate(Ie[le],Ie[_e]),w=le,b=_e;if(J!==I||ce!==y||te!==E||fe!==R)e.blendFuncSeparate(ke[J],ke[ce],ke[te],ke[fe]),I=J,y=ce,E=te,R=fe;if(ze.equals(v)===!1||ut!==T)e.blendColor(ze.r,ze.g,ze.b,ut),v.copy(ze),T=ut;f=U,O=!1}function Je(U,le){U.side===Bt?Re(e.CULL_FACE):re(e.CULL_FACE);let J=U.side===qt;if(le)J=!J;_t(J),U.blending===zs&&U.transparent===!1?qe(Rn):qe(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);let ce=U.stencilWrite;if(o.setTest(ce),ce)o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass);wt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?re(e.SAMPLE_ALPHA_TO_COVERAGE):Re(e.SAMPLE_ALPHA_TO_COVERAGE)}function _t(U){if(P!==U){if(U)e.frontFace(e.CW);else e.frontFace(e.CCW);P=U}}function Qe(U){if(U!==rh){if(re(e.CULL_FACE),U!==C)if(U===ao)e.cullFace(e.BACK);else if(U===ah)e.cullFace(e.FRONT);else e.cullFace(e.FRONT_AND_BACK)}else Re(e.CULL_FACE);C=U}function Wt(U){if(U!==k){if(z)e.lineWidth(U);k=U}}function wt(U,le,J){if(U){if(re(e.POLYGON_OFFSET_FILL),A!==le||F!==J){if(A=le,F=J,a.getReversed())le=-le;e.polygonOffset(le,J)}}else Re(e.POLYGON_OFFSET_FILL)}function At(U){if(U)re(e.SCISSOR_TEST);else Re(e.SCISSOR_TEST)}function N(U){if(U===void 0)U=e.TEXTURE0+V-1;if(K!==U)e.activeTexture(U),K=U}function Xt(U,le,J){if(J===void 0)if(K===null)J=e.TEXTURE0+V-1;else J=K;let ce=ee[J];if(ce===void 0)ce={type:void 0,texture:void 0},ee[J]=ce;if(ce.type!==U||ce.texture!==le){if(K!==J)e.activeTexture(J),K=J;e.bindTexture(U,le||ie[U]),ce.type=U,ce.texture=le}}function nt(){let U=ee[K];if(U!==void 0&&U.type!==void 0)e.bindTexture(U.type,null),U.type=void 0,U.texture=void 0}function xt(){try{e.compressedTexImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function M(){try{e.compressedTexImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function g(){try{e.texSubImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function L(){try{e.texSubImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function X(){try{e.compressedTexSubImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function ne(){try{e.compressedTexSubImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function oe(){try{e.texStorage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function he(){try{e.texStorage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function Z(){try{e.texImage2D(...arguments)}catch(U){Ue("WebGLState:",U)}}function j(){try{e.texImage3D(...arguments)}catch(U){Ue("WebGLState:",U)}}function ge(U){if(d[U]!==void 0)return d[U];else return e.getParameter(U)}function we(U,le){if(d[U]!==le)e.pixelStorei(U,le),d[U]=le}function ue(U){if(We.equals(U)===!1)e.scissor(U.x,U.y,U.z,U.w),We.copy(U)}function se(U){if(He.equals(U)===!1)e.viewport(U.x,U.y,U.z,U.w),He.copy(U)}function Pe(U,le){let J=c.get(le);if(J===void 0)J=new WeakMap,c.set(le,J);let ce=J.get(U);if(ce===void 0)ce=e.getUniformBlockIndex(le,U.name),J.set(U,ce)}function De(U,le){let ce=c.get(le).get(U);if(l.get(le)!==ce)e.uniformBlockBinding(le,ce,U.__bindingPointIndex),l.set(le,ce)}function et(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),h={},d={},K=null,ee={},u={},p=new WeakMap,_=[],S=null,m=!1,f=null,w=null,I=null,y=null,b=null,E=null,R=null,v=new Le(0,0,0),T=0,O=!1,P=null,C=null,k=null,A=null,F=null,We.set(0,0,e.canvas.width,e.canvas.height),He.set(0,0,e.canvas.width,e.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:re,disable:Re,bindFramebuffer:Ne,drawBuffers:ae,useProgram:Ce,setBlending:qe,setMaterial:Je,setFlipSided:_t,setCullFace:Qe,setLineWidth:Wt,setPolygonOffset:wt,setScissorTest:At,activeTexture:N,bindTexture:Xt,unbindTexture:nt,compressedTexImage2D:xt,compressedTexImage3D:M,texImage2D:Z,texImage3D:j,pixelStorei:we,getParameter:ge,updateUBOMapping:Pe,uniformBlockBinding:De,texStorage2D:oe,texStorage3D:he,texSubImage2D:g,texSubImage3D:L,compressedTexSubImage2D:X,compressedTexSubImage3D:ne,scissor:ue,viewport:se,reset:et}}function z_(e,t,n,i,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Fe,h=new WeakMap,d=new Set,u,p=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(M){}function S(M,g){return _?new OffscreenCanvas(M,g):ss("canvas")}function m(M,g,L){let X=1,ne=xt(M);if(ne.width>L||ne.height>L)X=L/Math.max(ne.width,ne.height);if(X<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){let oe=Math.floor(X*ne.width),he=Math.floor(X*ne.height);if(u===void 0)u=S(oe,he);let Z=g?S(oe,he):u;return Z.width=oe,Z.height=he,Z.getContext("2d").drawImage(M,0,0,oe,he),Ae("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+oe+"x"+he+")."),Z}else{if("data"in M)Ae("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+").");return M}return M}function f(M){return M.generateMipmaps}function w(M){e.generateMipmap(M)}function I(M){if(M.isWebGLCubeRenderTarget)return e.TEXTURE_CUBE_MAP;if(M.isWebGL3DRenderTarget)return e.TEXTURE_3D;if(M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture)return e.TEXTURE_2D_ARRAY;return e.TEXTURE_2D}function y(M,g,L,X,ne,oe=!1){if(M!==null){if(e[M]!==void 0)return e[M];Ae("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let he;if(X){if(he=t.get("EXT_texture_norm16"),!he)Ae("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension")}let Z=g;if(g===e.RED){if(L===e.FLOAT)Z=e.R32F;if(L===e.HALF_FLOAT)Z=e.R16F;if(L===e.UNSIGNED_BYTE)Z=e.R8;if(L===e.UNSIGNED_SHORT&&he)Z=he.R16_EXT;if(L===e.SHORT&&he)Z=he.R16_SNORM_EXT}if(g===e.RED_INTEGER){if(L===e.UNSIGNED_BYTE)Z=e.R8UI;if(L===e.UNSIGNED_SHORT)Z=e.R16UI;if(L===e.UNSIGNED_INT)Z=e.R32UI;if(L===e.BYTE)Z=e.R8I;if(L===e.SHORT)Z=e.R16I;if(L===e.INT)Z=e.R32I}if(g===e.RG){if(L===e.FLOAT)Z=e.RG32F;if(L===e.HALF_FLOAT)Z=e.RG16F;if(L===e.UNSIGNED_BYTE)Z=e.RG8;if(L===e.UNSIGNED_SHORT&&he)Z=he.RG16_EXT;if(L===e.SHORT&&he)Z=he.RG16_SNORM_EXT}if(g===e.RG_INTEGER){if(L===e.UNSIGNED_BYTE)Z=e.RG8UI;if(L===e.UNSIGNED_SHORT)Z=e.RG16UI;if(L===e.UNSIGNED_INT)Z=e.RG32UI;if(L===e.BYTE)Z=e.RG8I;if(L===e.SHORT)Z=e.RG16I;if(L===e.INT)Z=e.RG32I}if(g===e.RGB_INTEGER){if(L===e.UNSIGNED_BYTE)Z=e.RGB8UI;if(L===e.UNSIGNED_SHORT)Z=e.RGB16UI;if(L===e.UNSIGNED_INT)Z=e.RGB32UI;if(L===e.BYTE)Z=e.RGB8I;if(L===e.SHORT)Z=e.RGB16I;if(L===e.INT)Z=e.RGB32I}if(g===e.RGBA_INTEGER){if(L===e.UNSIGNED_BYTE)Z=e.RGBA8UI;if(L===e.UNSIGNED_SHORT)Z=e.RGBA16UI;if(L===e.UNSIGNED_INT)Z=e.RGBA32UI;if(L===e.BYTE)Z=e.RGBA8I;if(L===e.SHORT)Z=e.RGBA16I;if(L===e.INT)Z=e.RGBA32I}if(g===e.RGB){if(L===e.UNSIGNED_SHORT&&he)Z=he.RGB16_EXT;if(L===e.SHORT&&he)Z=he.RGB16_SNORM_EXT;if(L===e.UNSIGNED_INT_5_9_9_9_REV)Z=e.RGB9_E5;if(L===e.UNSIGNED_INT_10F_11F_11F_REV)Z=e.R11F_G11F_B10F}if(g===e.RGBA){let j=oe?sl:Xe.getTransfer(ne);if(L===e.FLOAT)Z=e.RGBA32F;if(L===e.HALF_FLOAT)Z=e.RGBA16F;if(L===e.UNSIGNED_BYTE)Z=j===ht?e.SRGB8_ALPHA8:e.RGBA8;if(L===e.UNSIGNED_SHORT&&he)Z=he.RGBA16_EXT;if(L===e.SHORT&&he)Z=he.RGBA16_SNORM_EXT;if(L===e.UNSIGNED_SHORT_4_4_4_4)Z=e.RGBA4;if(L===e.UNSIGNED_SHORT_5_5_5_1)Z=e.RGB5_A1}if(Z===e.R16F||Z===e.R32F||Z===e.RG16F||Z===e.RG32F||Z===e.RGBA16F||Z===e.RGBA32F)t.get("EXT_color_buffer_float");return Z}function b(M,g){let L;if(M){if(g===null||g===oi||g===ds)L=e.DEPTH24_STENCIL8;else if(g===qn)L=e.DEPTH32F_STENCIL8;else if(g===Hs)L=e.DEPTH24_STENCIL8,Ae("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")}else if(g===null||g===oi||g===ds)L=e.DEPTH_COMPONENT24;else if(g===qn)L=e.DEPTH_COMPONENT32F;else if(g===Hs)L=e.DEPTH_COMPONENT16;return L}function E(M,g){if(f(M)===!0||M.isFramebufferTexture&&M.minFilter!==xn&&M.minFilter!==Dt)return Math.log2(Math.max(g.width,g.height))+1;else if(M.mipmaps!==void 0&&M.mipmaps.length>0)return M.mipmaps.length;else if(M.isCompressedTexture&&Array.isArray(M.image))return g.mipmaps.length;else return 1}function R(M){let g=M.target;if(g.removeEventListener("dispose",R),T(g),g.isVideoTexture)h.delete(g);if(g.isHTMLTexture)d.delete(g)}function v(M){let g=M.target;g.removeEventListener("dispose",v),P(g)}function T(M){let g=i.get(M);if(g.__webglInit===void 0)return;let L=M.source,X=p.get(L);if(X){let ne=X[g.__cacheKey];if(ne.usedTimes--,ne.usedTimes===0)O(M);if(Object.keys(X).length===0)p.delete(L)}i.remove(M)}function O(M){let g=i.get(M);e.deleteTexture(g.__webglTexture);let L=M.source,X=p.get(L);delete X[g.__cacheKey],a.memory.textures--}function P(M){let g=i.get(M);if(M.depthTexture)M.depthTexture.dispose(),i.remove(M.depthTexture);if(M.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(g.__webglFramebuffer[X]))for(let ne=0;ne<g.__webglFramebuffer[X].length;ne++)e.deleteFramebuffer(g.__webglFramebuffer[X][ne]);else e.deleteFramebuffer(g.__webglFramebuffer[X]);if(g.__webglDepthbuffer)e.deleteRenderbuffer(g.__webglDepthbuffer[X])}else{if(Array.isArray(g.__webglFramebuffer))for(let X=0;X<g.__webglFramebuffer.length;X++)e.deleteFramebuffer(g.__webglFramebuffer[X]);else e.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer)e.deleteRenderbuffer(g.__webglDepthbuffer);if(g.__webglMultisampledFramebuffer)e.deleteFramebuffer(g.__webglMultisampledFramebuffer);if(g.__webglColorRenderbuffer){for(let X=0;X<g.__webglColorRenderbuffer.length;X++)if(g.__webglColorRenderbuffer[X])e.deleteRenderbuffer(g.__webglColorRenderbuffer[X])}if(g.__webglDepthRenderbuffer)e.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let L=M.textures;for(let X=0,ne=L.length;X<ne;X++){let oe=i.get(L[X]);if(oe.__webglTexture)e.deleteTexture(oe.__webglTexture),a.memory.textures--;i.remove(L[X])}i.remove(M)}let C=0;function k(){C=0}function A(){return C}function F(M){C=M}function V(){let M=C;if(M>=s.maxTextures)Ae("WebGLTextures: Trying to use "+(M+1)+" texture units while this GPU supports only "+s.maxTextures);return C+=1,M}function z(M){let g=[];return g.push(M.wrapS),g.push(M.wrapT),g.push(M.wrapR||0),g.push(M.magFilter),g.push(M.minFilter),g.push(M.anisotropy),g.push(M.internalFormat),g.push(M.format),g.push(M.type),g.push(M.generateMipmaps),g.push(M.premultiplyAlpha),g.push(M.flipY),g.push(M.unpackAlignment),g.push(M.colorSpace),g.join()}function Q(M,g){let L=i.get(M);if(M.isVideoTexture)Xt(M);if(M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&L.__version!==M.version){let X=M.image;if(X===null)Ae("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ae("WebGLRenderer: Texture marked for update but image is incomplete");else{Re(L,M,g);return}}else if(M.isExternalTexture)L.__webglTexture=M.sourceTexture?M.sourceTexture:null;n.bindTexture(e.TEXTURE_2D,L.__webglTexture,e.TEXTURE0+g)}function W(M,g){let L=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&L.__version!==M.version){Re(L,M,g);return}else if(M.isExternalTexture)L.__webglTexture=M.sourceTexture?M.sourceTexture:null;n.bindTexture(e.TEXTURE_2D_ARRAY,L.__webglTexture,e.TEXTURE0+g)}function K(M,g){let L=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&L.__version!==M.version){Re(L,M,g);return}n.bindTexture(e.TEXTURE_3D,L.__webglTexture,e.TEXTURE0+g)}function ee(M,g){let L=i.get(M);if(M.isCubeDepthTexture!==!0&&M.version>0&&L.__version!==M.version){Ne(L,M,g);return}n.bindTexture(e.TEXTURE_CUBE_MAP,L.__webglTexture,e.TEXTURE0+g)}let Te={[cs]:e.REPEAT,[hs]:e.CLAMP_TO_EDGE,[Xr]:e.MIRRORED_REPEAT},Se={[xn]:e.NEAREST,[qr]:e.NEAREST_MIPMAP_NEAREST,[Ei]:e.NEAREST_MIPMAP_LINEAR,[Dt]:e.LINEAR,[us]:e.LINEAR_MIPMAP_NEAREST,[Cn]:e.LINEAR_MIPMAP_LINEAR},We={[qh]:e.NEVER,[$h]:e.ALWAYS,[Yh]:e.LESS,[ea]:e.LEQUAL,[Zh]:e.EQUAL,[ta]:e.GEQUAL,[Kh]:e.GREATER,[Jh]:e.NOTEQUAL};function He(M,g){if(g.type===qn&&t.has("OES_texture_float_linear")===!1&&(g.magFilter===Dt||g.magFilter===us||g.magFilter===Ei||g.magFilter===Cn||g.minFilter===Dt||g.minFilter===us||g.minFilter===Ei||g.minFilter===Cn))Ae("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.");if(e.texParameteri(M,e.TEXTURE_WRAP_S,Te[g.wrapS]),e.texParameteri(M,e.TEXTURE_WRAP_T,Te[g.wrapT]),M===e.TEXTURE_3D||M===e.TEXTURE_2D_ARRAY)e.texParameteri(M,e.TEXTURE_WRAP_R,Te[g.wrapR]);if(e.texParameteri(M,e.TEXTURE_MAG_FILTER,Se[g.magFilter]),e.texParameteri(M,e.TEXTURE_MIN_FILTER,Se[g.minFilter]),g.compareFunction)e.texParameteri(M,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(M,e.TEXTURE_COMPARE_FUNC,We[g.compareFunction]);if(t.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===xn)return;if(g.minFilter!==Ei&&g.minFilter!==Cn)return;if(g.type===qn&&t.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||i.get(g).__currentAnisotropy){let L=t.get("EXT_texture_filter_anisotropic");e.texParameterf(M,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),i.get(g).__currentAnisotropy=g.anisotropy}}}function Y(M,g){let L=!1;if(M.__webglInit===void 0)M.__webglInit=!0,g.addEventListener("dispose",R);let X=g.source,ne=p.get(X);if(ne===void 0)ne={},p.set(X,ne);let oe=z(g);if(oe!==M.__cacheKey){if(ne[oe]===void 0)ne[oe]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,L=!0;ne[oe].usedTimes++;let he=ne[M.__cacheKey];if(he!==void 0){if(ne[M.__cacheKey].usedTimes--,he.usedTimes===0)O(g)}M.__cacheKey=oe,M.__webglTexture=ne[oe].texture}return L}function ie(M,g,L){return Math.floor(Math.floor(M/L)/g)}function re(M,g,L,X){let oe=M.updateRanges;if(oe.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,g.width,g.height,L,X,g.data);else{oe.sort((we,ue)=>we.start-ue.start);let he=0;for(let we=1;we<oe.length;we++){let ue=oe[he],se=oe[we],Pe=ue.start+ue.count,De=ie(se.start,g.width,4),et=ie(ue.start,g.width,4);if(se.start<=Pe+1&&De===et&&ie(se.start+se.count-1,g.width,4)===De)ue.count=Math.max(ue.count,se.start+se.count-ue.start);else++he,oe[he]=se}oe.length=he+1;let Z=n.getParameter(e.UNPACK_ROW_LENGTH),j=n.getParameter(e.UNPACK_SKIP_PIXELS),ge=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,g.width);for(let we=0,ue=oe.length;we<ue;we++){let se=oe[we],Pe=Math.floor(se.start/4),De=Math.ceil(se.count/4),et=Pe%g.width,U=Math.floor(Pe/g.width),le=De,J=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,et),n.pixelStorei(e.UNPACK_SKIP_ROWS,U),n.texSubImage2D(e.TEXTURE_2D,0,et,U,le,1,L,X,g.data)}M.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,Z),n.pixelStorei(e.UNPACK_SKIP_PIXELS,j),n.pixelStorei(e.UNPACK_SKIP_ROWS,ge)}}function Re(M,g,L){let X=e.TEXTURE_2D;if(g.isDataArrayTexture||g.isCompressedArrayTexture)X=e.TEXTURE_2D_ARRAY;if(g.isData3DTexture)X=e.TEXTURE_3D;let ne=Y(M,g),oe=g.source;n.bindTexture(X,M.__webglTexture,e.TEXTURE0+L);let he=i.get(oe);if(oe.version!==he.__version||ne===!0){if(n.activeTexture(e.TEXTURE0+L),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){let J=Xe.getPrimaries(Xe.workingColorSpace),ce=g.colorSpace===Ci?null:Xe.getPrimaries(g.colorSpace),_e=g.colorSpace===Ci||J===ce?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e)}n.pixelStorei(e.UNPACK_ALIGNMENT,g.unpackAlignment);let j=m(g.image,!1,s.maxTextureSize);j=nt(g,j);let ge=r.convert(g.format,g.colorSpace),we=r.convert(g.type),ue=y(g.internalFormat,ge,we,g.normalized,g.colorSpace,g.isVideoTexture);He(X,g);let se,Pe=g.mipmaps,De=g.isVideoTexture!==!0,et=he.__version===void 0||ne===!0,U=oe.dataReady,le=E(g,j);if(g.isDepthTexture){if(ue=b(g.format===Ai,g.type),et)if(De)n.texStorage2D(e.TEXTURE_2D,1,ue,j.width,j.height);else n.texImage2D(e.TEXTURE_2D,0,ue,j.width,j.height,0,ge,we,null)}else if(g.isDataTexture)if(Pe.length>0){if(De&&et)n.texStorage2D(e.TEXTURE_2D,le,ue,Pe[0].width,Pe[0].height);for(let J=0,ce=Pe.length;J<ce;J++)if(se=Pe[J],De){if(U)n.texSubImage2D(e.TEXTURE_2D,J,0,0,se.width,se.height,ge,we,se.data)}else n.texImage2D(e.TEXTURE_2D,J,ue,se.width,se.height,0,ge,we,se.data);g.generateMipmaps=!1}else if(De){if(et)n.texStorage2D(e.TEXTURE_2D,le,ue,j.width,j.height);if(U)re(g,j,ge,we)}else n.texImage2D(e.TEXTURE_2D,0,ue,j.width,j.height,0,ge,we,j.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){if(De&&et)n.texStorage3D(e.TEXTURE_2D_ARRAY,le,ue,Pe[0].width,Pe[0].height,j.depth);for(let J=0,ce=Pe.length;J<ce;J++)if(se=Pe[J],g.format!==Pn)if(ge!==null)if(De){if(U)if(g.layerUpdates.size>0){let _e=Rl(se.width,se.height,g.format,g.type);for(let te of g.layerUpdates){let fe=se.data.subarray(te*_e/se.data.BYTES_PER_ELEMENT,(te+1)*_e/se.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,te,se.width,se.height,1,ge,fe)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,se.width,se.height,j.depth,ge,se.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,J,ue,se.width,se.height,j.depth,0,se.data,0,0);else Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(De){if(U)n.texSubImage3D(e.TEXTURE_2D_ARRAY,J,0,0,0,se.width,se.height,j.depth,ge,we,se.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,J,ue,se.width,se.height,j.depth,0,ge,we,se.data);if(g.layerUpdates.size>0)g.clearLayerUpdates()}else{if(De&&et)n.texStorage2D(e.TEXTURE_2D,le,ue,Pe[0].width,Pe[0].height);for(let J=0,ce=Pe.length;J<ce;J++)if(se=Pe[J],g.format!==Pn)if(ge!==null)if(De){if(U)n.compressedTexSubImage2D(e.TEXTURE_2D,J,0,0,se.width,se.height,ge,se.data)}else n.compressedTexImage2D(e.TEXTURE_2D,J,ue,se.width,se.height,0,se.data);else Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(De){if(U)n.texSubImage2D(e.TEXTURE_2D,J,0,0,se.width,se.height,ge,we,se.data)}else n.texImage2D(e.TEXTURE_2D,J,ue,se.width,se.height,0,ge,we,se.data)}else if(g.isDataArrayTexture)if(De){if(et)n.texStorage3D(e.TEXTURE_2D_ARRAY,le,ue,j.width,j.height,j.depth);if(U)if(g.layerUpdates.size>0){let J=Rl(j.width,j.height,g.format,g.type);for(let ce of g.layerUpdates){let _e=j.data.subarray(ce*J/j.data.BYTES_PER_ELEMENT,(ce+1)*J/j.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ce,j.width,j.height,1,ge,we,_e)}g.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ge,we,j.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,ue,j.width,j.height,j.depth,0,ge,we,j.data);else if(g.isData3DTexture)if(De){if(et)n.texStorage3D(e.TEXTURE_3D,le,ue,j.width,j.height,j.depth);if(U)n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ge,we,j.data)}else n.texImage3D(e.TEXTURE_3D,0,ue,j.width,j.height,j.depth,0,ge,we,j.data);else if(g.isFramebufferTexture){if(et)if(De)n.texStorage2D(e.TEXTURE_2D,le,ue,j.width,j.height);else{let J=j.width,ce=j.height;for(let _e=0;_e<le;_e++)n.texImage2D(e.TEXTURE_2D,_e,ue,J,ce,0,ge,we,null),J>>=1,ce>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in e){let J=e.canvas;if(!J.hasAttribute("layoutsubtree"))J.setAttribute("layoutsubtree","true");if(j.parentNode!==J){J.appendChild(j),d.add(g),J.onpaint=(ce)=>{let _e=ce.changedElements;for(let te of d)if(_e.includes(te.image))te.needsUpdate=!0},J.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,j);else{let{RGBA:_e,RGBA:te,UNSIGNED_BYTE:fe}=e;e.texElementImage2D(e.TEXTURE_2D,0,_e,te,fe,j)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(De&&et){let J=xt(Pe[0]);n.texStorage2D(e.TEXTURE_2D,le,ue,J.width,J.height)}for(let J=0,ce=Pe.length;J<ce;J++)if(se=Pe[J],De){if(U)n.texSubImage2D(e.TEXTURE_2D,J,0,0,ge,we,se)}else n.texImage2D(e.TEXTURE_2D,J,ue,ge,we,se);g.generateMipmaps=!1}else if(De){if(et){let J=xt(j);n.texStorage2D(e.TEXTURE_2D,le,ue,J.width,J.height)}if(U)n.texSubImage2D(e.TEXTURE_2D,0,0,0,ge,we,j)}else n.texImage2D(e.TEXTURE_2D,0,ue,ge,we,j);if(f(g))w(X);if(he.__version=oe.version,g.onUpdate)g.onUpdate(g)}M.__version=g.version}function Ne(M,g,L){if(g.image.length!==6)return;let X=Y(M,g),ne=g.source;n.bindTexture(e.TEXTURE_CUBE_MAP,M.__webglTexture,e.TEXTURE0+L);let oe=i.get(ne);if(ne.version!==oe.__version||X===!0){n.activeTexture(e.TEXTURE0+L);let he=Xe.getPrimaries(Xe.workingColorSpace),Z=g.colorSpace===Ci?null:Xe.getPrimaries(g.colorSpace),j=g.colorSpace===Ci||he===Z?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,g.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let ge=g.isCompressedTexture||g.image[0].isCompressedTexture,we=g.image[0]&&g.image[0].isDataTexture,ue=[];for(let te=0;te<6;te++){if(!ge&&!we)ue[te]=m(g.image[te],!0,s.maxCubemapSize);else ue[te]=we?g.image[te].image:g.image[te];ue[te]=nt(g,ue[te])}let se=ue[0],Pe=r.convert(g.format,g.colorSpace),De=r.convert(g.type),et=y(g.internalFormat,Pe,De,g.normalized,g.colorSpace),U=g.isVideoTexture!==!0,le=oe.__version===void 0||X===!0,J=ne.dataReady,ce=E(g,se);He(e.TEXTURE_CUBE_MAP,g);let _e;if(ge){if(U&&le)n.texStorage2D(e.TEXTURE_CUBE_MAP,ce,et,se.width,se.height);for(let te=0;te<6;te++){_e=ue[te].mipmaps;for(let fe=0;fe<_e.length;fe++){let ze=_e[fe];if(g.format!==Pn)if(Pe!==null)if(U){if(J)n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,0,0,ze.width,ze.height,Pe,ze.data)}else n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,et,ze.width,ze.height,0,ze.data);else Ae("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()");else if(U){if(J)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,0,0,ze.width,ze.height,Pe,De,ze.data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,et,ze.width,ze.height,0,Pe,De,ze.data)}}}else{if(_e=g.mipmaps,U&&le){if(_e.length>0)ce++;let te=xt(ue[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,ce,et,te.width,te.height)}for(let te=0;te<6;te++)if(we){if(U){if(J)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ue[te].width,ue[te].height,Pe,De,ue[te].data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,et,ue[te].width,ue[te].height,0,Pe,De,ue[te].data);for(let fe=0;fe<_e.length;fe++){let ut=_e[fe].image[te].image;if(U){if(J)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,0,0,ut.width,ut.height,Pe,De,ut.data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,et,ut.width,ut.height,0,Pe,De,ut.data)}}else{if(U){if(J)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Pe,De,ue[te])}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,et,Pe,De,ue[te]);for(let fe=0;fe<_e.length;fe++){let ze=_e[fe];if(U){if(J)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,0,0,Pe,De,ze.image[te])}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,et,Pe,De,ze.image[te])}}}if(f(g))w(e.TEXTURE_CUBE_MAP);if(oe.__version=ne.version,g.onUpdate)g.onUpdate(g)}M.__version=g.version}function ae(M,g,L,X,ne,oe){let he=r.convert(L.format,L.colorSpace),Z=r.convert(L.type),j=y(L.internalFormat,he,Z,L.normalized,L.colorSpace),ge=i.get(g),we=i.get(L);if(we.__renderTarget=g,!ge.__hasExternalTextures){let ue=Math.max(1,g.width>>oe),se=Math.max(1,g.height>>oe);if(ne===e.TEXTURE_3D||ne===e.TEXTURE_2D_ARRAY)n.texImage3D(ne,oe,j,ue,se,g.depth,0,he,Z,null);else n.texImage2D(ne,oe,j,ue,se,0,he,Z,null)}if(n.bindFramebuffer(e.FRAMEBUFFER,M),N(g))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,X,ne,we.__webglTexture,0,At(g));else if(ne===e.TEXTURE_2D||ne>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)e.framebufferTexture2D(e.FRAMEBUFFER,X,ne,we.__webglTexture,oe);n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(M,g,L){if(e.bindRenderbuffer(e.RENDERBUFFER,M),g.depthBuffer){let X=g.depthTexture,ne=X&&X.isDepthTexture?X.type:null,oe=b(g.stencilBuffer,ne),he=g.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(N(g))o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,At(g),oe,g.width,g.height);else if(L)e.renderbufferStorageMultisample(e.RENDERBUFFER,At(g),oe,g.width,g.height);else e.renderbufferStorage(e.RENDERBUFFER,oe,g.width,g.height);e.framebufferRenderbuffer(e.FRAMEBUFFER,he,e.RENDERBUFFER,M)}else{let X=g.textures;for(let ne=0;ne<X.length;ne++){let oe=X[ne],he=r.convert(oe.format,oe.colorSpace),Z=r.convert(oe.type),j=y(oe.internalFormat,he,Z,oe.normalized,oe.colorSpace);if(N(g))o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,At(g),j,g.width,g.height);else if(L)e.renderbufferStorageMultisample(e.RENDERBUFFER,At(g),j,g.width,g.height);else e.renderbufferStorage(e.RENDERBUFFER,j,g.width,g.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Ie(M,g,L){let X=g.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,M),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ne=i.get(g.depthTexture);if(ne.__renderTarget=g,!ne.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0;if(X){if(ne.__webglInit===void 0)ne.__webglInit=!0,g.depthTexture.addEventListener("dispose",R);if(ne.__webglTexture===void 0){ne.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,ne.__webglTexture),He(e.TEXTURE_CUBE_MAP,g.depthTexture);let ge=r.convert(g.depthTexture.format),we=r.convert(g.depthTexture.type),ue;if(g.depthTexture.format===wi)ue=e.DEPTH_COMPONENT24;else if(g.depthTexture.format===Ai)ue=e.DEPTH24_STENCIL8;for(let se=0;se<6;se++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,ue,g.width,g.height,0,ge,we,null)}}else Q(g.depthTexture,0);let oe=ne.__webglTexture,he=At(g),Z=X?e.TEXTURE_CUBE_MAP_POSITIVE_X+L:e.TEXTURE_2D,j=g.depthTexture.format===Ai?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(g.depthTexture.format===wi)if(N(g))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,Z,oe,0,he);else e.framebufferTexture2D(e.FRAMEBUFFER,j,Z,oe,0);else if(g.depthTexture.format===Ai)if(N(g))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,j,Z,oe,0,he);else e.framebufferTexture2D(e.FRAMEBUFFER,j,Z,oe,0);else throw Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ke(M){let g=i.get(M),L=M.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==M.depthTexture){let X=M.depthTexture;if(g.__depthDisposeCallback)g.__depthDisposeCallback();if(X){let ne=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,X.removeEventListener("dispose",ne)};X.addEventListener("dispose",ne),g.__depthDisposeCallback=ne}g.__boundDepthTexture=X}if(M.depthTexture&&!g.__autoAllocateDepthBuffer)if(L)for(let X=0;X<6;X++)Ie(g.__webglFramebuffer[X],M,X);else{let X=M.texture.mipmaps;if(X&&X.length>0)Ie(g.__webglFramebuffer[0],M,0);else Ie(g.__webglFramebuffer,M,0)}else if(L){g.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(n.bindFramebuffer(e.FRAMEBUFFER,g.__webglFramebuffer[X]),g.__webglDepthbuffer[X]===void 0)g.__webglDepthbuffer[X]=e.createRenderbuffer(),Ce(g.__webglDepthbuffer[X],M,!1);else{let ne=M.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,oe=g.__webglDepthbuffer[X];e.bindRenderbuffer(e.RENDERBUFFER,oe),e.framebufferRenderbuffer(e.FRAMEBUFFER,ne,e.RENDERBUFFER,oe)}}else{let X=M.texture.mipmaps;if(X&&X.length>0)n.bindFramebuffer(e.FRAMEBUFFER,g.__webglFramebuffer[0]);else n.bindFramebuffer(e.FRAMEBUFFER,g.__webglFramebuffer);if(g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=e.createRenderbuffer(),Ce(g.__webglDepthbuffer,M,!1);else{let ne=M.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,oe=g.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,oe),e.framebufferRenderbuffer(e.FRAMEBUFFER,ne,e.RENDERBUFFER,oe)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function qe(M,g,L){let X=i.get(M);if(g!==void 0)ae(X.__webglFramebuffer,M,M.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0);if(L!==void 0)ke(M)}function Je(M){let g=M.texture,L=i.get(M),X=i.get(g);M.addEventListener("dispose",v);let ne=M.textures,oe=M.isWebGLCubeRenderTarget===!0,he=ne.length>1;if(!he){if(X.__webglTexture===void 0)X.__webglTexture=e.createTexture();X.__version=g.version,a.memory.textures++}if(oe){L.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(g.mipmaps&&g.mipmaps.length>0){L.__webglFramebuffer[Z]=[];for(let j=0;j<g.mipmaps.length;j++)L.__webglFramebuffer[Z][j]=e.createFramebuffer()}else L.__webglFramebuffer[Z]=e.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){L.__webglFramebuffer=[];for(let Z=0;Z<g.mipmaps.length;Z++)L.__webglFramebuffer[Z]=e.createFramebuffer()}else L.__webglFramebuffer=e.createFramebuffer();if(he)for(let Z=0,j=ne.length;Z<j;Z++){let ge=i.get(ne[Z]);if(ge.__webglTexture===void 0)ge.__webglTexture=e.createTexture(),a.memory.textures++}if(M.samples>0&&N(M)===!1){L.__webglMultisampledFramebuffer=e.createFramebuffer(),L.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let Z=0;Z<ne.length;Z++){let j=ne[Z];L.__webglColorRenderbuffer[Z]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,L.__webglColorRenderbuffer[Z]);let ge=r.convert(j.format,j.colorSpace),we=r.convert(j.type),ue=y(j.internalFormat,ge,we,j.normalized,j.colorSpace,M.isXRRenderTarget===!0),se=At(M);e.renderbufferStorageMultisample(e.RENDERBUFFER,se,ue,M.width,M.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Z,e.RENDERBUFFER,L.__webglColorRenderbuffer[Z])}if(e.bindRenderbuffer(e.RENDERBUFFER,null),M.depthBuffer)L.__webglDepthRenderbuffer=e.createRenderbuffer(),Ce(L.__webglDepthRenderbuffer,M,!0);n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(oe){n.bindTexture(e.TEXTURE_CUBE_MAP,X.__webglTexture),He(e.TEXTURE_CUBE_MAP,g);for(let Z=0;Z<6;Z++)if(g.mipmaps&&g.mipmaps.length>0)for(let j=0;j<g.mipmaps.length;j++)ae(L.__webglFramebuffer[Z][j],M,g,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Z,j);else ae(L.__webglFramebuffer[Z],M,g,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);if(f(g))w(e.TEXTURE_CUBE_MAP);n.unbindTexture()}else if(he){for(let Z=0,j=ne.length;Z<j;Z++){let ge=ne[Z],we=i.get(ge),ue=e.TEXTURE_2D;if(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)ue=M.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY;if(n.bindTexture(ue,we.__webglTexture),He(ue,ge),ae(L.__webglFramebuffer,M,ge,e.COLOR_ATTACHMENT0+Z,ue,0),f(ge))w(ue)}n.unbindTexture()}else{let Z=e.TEXTURE_2D;if(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)Z=M.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY;if(n.bindTexture(Z,X.__webglTexture),He(Z,g),g.mipmaps&&g.mipmaps.length>0)for(let j=0;j<g.mipmaps.length;j++)ae(L.__webglFramebuffer[j],M,g,e.COLOR_ATTACHMENT0,Z,j);else ae(L.__webglFramebuffer,M,g,e.COLOR_ATTACHMENT0,Z,0);if(f(g))w(Z);n.unbindTexture()}if(M.depthBuffer)ke(M)}function _t(M){let g=M.textures;for(let L=0,X=g.length;L<X;L++){let ne=g[L];if(f(ne)){let oe=I(M),he=i.get(ne).__webglTexture;n.bindTexture(oe,he),w(oe),n.unbindTexture()}}}let Qe=[],Wt=[];function wt(M){if(M.samples>0){if(N(M)===!1){let{textures:g,width:L,height:X}=M,ne=e.COLOR_BUFFER_BIT,oe=M.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,he=i.get(M),Z=g.length>1;if(Z)for(let ge=0;ge<g.length;ge++)n.bindFramebuffer(e.FRAMEBUFFER,he.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ge,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,he.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ge,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);let j=M.texture.mipmaps;if(j&&j.length>0)n.bindFramebuffer(e.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]);else n.bindFramebuffer(e.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let ge=0;ge<g.length;ge++){if(M.resolveDepthBuffer){if(M.depthBuffer)ne|=e.DEPTH_BUFFER_BIT;if(M.stencilBuffer&&M.resolveStencilBuffer)ne|=e.STENCIL_BUFFER_BIT}if(Z){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,he.__webglColorRenderbuffer[ge]);let we=i.get(g[ge]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,we,0)}if(e.blitFramebuffer(0,0,L,X,0,0,L,X,ne,e.NEAREST),l===!0){if(Qe.length=0,Wt.length=0,Qe.push(e.COLOR_ATTACHMENT0+ge),M.depthBuffer&&M.storeMultisampledDepthBuffer===!1)Qe.push(oe),Wt.push(oe),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Wt);e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Qe)}}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),Z)for(let ge=0;ge<g.length;ge++){n.bindFramebuffer(e.FRAMEBUFFER,he.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ge,e.RENDERBUFFER,he.__webglColorRenderbuffer[ge]);let we=i.get(g[ge]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,he.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ge,e.TEXTURE_2D,we,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.storeMultisampledDepthBuffer===!1&&l){let g=M.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[g])}}}function At(M){return Math.min(s.maxSamples,M.samples)}function N(M){let g=i.get(M);return M.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Xt(M){let g=a.render.frame;if(h.get(M)!==g)h.set(M,g),M.update()}function nt(M,g){let{colorSpace:L,format:X,type:ne}=M;if(M.isCompressedTexture===!0||M.isVideoTexture===!0)return g;if(L!==Jt&&L!==Ci)if(Xe.getTransfer(L)===ht){if(X!==Pn||ne!==vn)Ae("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.")}else Ue("WebGLTextures: Unsupported texture color space:",L);return g}function xt(M){if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement)c.width=M.naturalWidth||M.width,c.height=M.naturalHeight||M.height;else if(typeof VideoFrame<"u"&&M instanceof VideoFrame)c.width=M.displayWidth,c.height=M.displayHeight;else c.width=M.width,c.height=M.height;return c}this.allocateTextureUnit=V,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=F,this.setTexture2D=Q,this.setTexture2DArray=W,this.setTexture3D=K,this.setTextureCube=ee,this.rebindTextures=qe,this.setupRenderTarget=Je,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=ae,this.useMultisampledRTT=N,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function k_(e,t){function n(i,s=Ci){let r,a=Xe.getTransfer(s);if(i===vn)return e.UNSIGNED_BYTE;if(i===yo)return e.UNSIGNED_SHORT_4_4_4_4;if(i===So)return e.UNSIGNED_SHORT_5_5_5_1;if(i===kh)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===Hh)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Bh)return e.BYTE;if(i===zh)return e.SHORT;if(i===Hs)return e.UNSIGNED_SHORT;if(i===vo)return e.INT;if(i===oi)return e.UNSIGNED_INT;if(i===qn)return e.FLOAT;if(i===In)return e.HALF_FLOAT;if(i===Gh)return e.ALPHA;if(i===Vh)return e.RGB;if(i===Pn)return e.RGBA;if(i===wi)return e.DEPTH_COMPONENT;if(i===Ai)return e.DEPTH_STENCIL;if(i===Wh)return e.RED;if(i===Mo)return e.RED_INTEGER;if(i===Ri)return e.RG;if(i===bo)return e.RG_INTEGER;if(i===To)return e.RGBA_INTEGER;if(i===Yr||i===Zr||i===Kr||i===Jr)if(a===ht)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Yr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Yr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Zr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Kr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Jr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Eo||i===wo||i===Ao||i===Ro)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Eo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===wo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ao)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ro)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Co||i===Io||i===Po||i===Lo||i===No||i===$r||i===Do)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Co||i===Io)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Po)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Lo)return r.COMPRESSED_R11_EAC;if(i===No)return r.COMPRESSED_SIGNED_R11_EAC;if(i===$r)return r.COMPRESSED_RG11_EAC;if(i===Do)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Uo||i===Fo||i===Oo||i===Bo||i===zo||i===ko||i===Ho||i===Go||i===Vo||i===Wo||i===Xo||i===qo||i===Yo||i===Zo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Uo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Fo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Oo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Bo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===zo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ko)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ho)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Go)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Vo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Wo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Xo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===qo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Yo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Zo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ko||i===Jo||i===$o)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Ko)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Jo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$o)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===jo||i===Qo||i===jr||i===el)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===jo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Qo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===jr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===el)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;if(i===ds)return e.UNSIGNED_INT_24_8;return e[i]!==void 0?e[i]:null}return{convert:n}}var H_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,G_=`
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

}`;class Vu{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new da(e.texture);if(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)this.depthNear=e.depthNear,this.depthFar=e.depthFar;this.texture=n}}getMesh(e){if(this.texture!==null){if(this.mesh===null){let t=e.cameras[0].viewport,n=new cn({vertexShader:H_,fragmentShader:G_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new vt(new er(20,20),n)}}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Wu extends Yn{constructor(e,t){super();let n=this,i=null,s=1,r=null,a="local-floor",o=1,l=null,c=null,h=null,d=null,u=null,p=null,_=typeof XRWebGLBinding<"u",S=new Vu,m={},f=t.getContextAttributes(),w=null,I=null,y=[],b=[],E=new Fe,R=null,v=null,T=new Rt;T.viewport=new at;let O=new Rt;O.viewport=new at;let P=[T,O],C=new Tl,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ie=y[Y];if(ie===void 0)ie=new Xs,y[Y]=ie;return ie.getTargetRaySpace()},this.getControllerGrip=function(Y){let ie=y[Y];if(ie===void 0)ie=new Xs,y[Y]=ie;return ie.getGripSpace()},this.getHand=function(Y){let ie=y[Y];if(ie===void 0)ie=new Xs,y[Y]=ie;return ie.getHandSpace()};function F(Y){let ie=b.indexOf(Y.inputSource);if(ie===-1)return;let re=y[ie];if(re!==void 0)re.update(Y.inputSource,Y.frame,l||r),re.dispatchEvent({type:Y.type,data:Y.inputSource})}function V(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",z);for(let Y=0;Y<y.length;Y++){let ie=b[Y];if(ie===null)continue;b[Y]=null,y[Y].disconnect(ie)}k=null,A=null,S.reset();for(let Y in m)delete m[Y];if(e.setRenderTarget(w),u=null,d=null,h=null,i=null,I=null,He.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(E.width,E.height,!1),v!==null){let Y=v.camera;Y.fov=v.fov,Y.zoom=v.zoom,Y.updateProjectionMatrix(),v=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){if(s=Y,n.isPresenting===!0)Ae("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){if(a=Y,n.isPresenting===!0)Ae("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){if(h===null&&_)h=new XRWebGLBinding(i,t);return h},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",V),i.addEventListener("inputsourceschange",z),f.xrCompatible!==!0)await t.makeXRCompatible();if(R=e.getPixelRatio(),e.getSize(E),!(_&&("createProjectionLayer"in XRWebGLBinding.prototype))){let re={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),I=new $t(u.framebufferWidth,u.framebufferHeight,{format:Pn,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let re=null,Re=null,Ne=null;if(f.depth)Ne=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=f.stencil?Ai:wi,Re=f.stencil?ds:oi;let ae={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(ae),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),I=new $t(d.textureWidth,d.textureHeight,{format:Pn,type:vn,depthTexture:new Pi(d.textureWidth,d.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}I.isXRRenderTarget=!0,this.setFoveation(o),l=null,r=await i.requestReferenceSpace(a),He.setContext(i),He.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function z(Y){for(let ie=0;ie<Y.removed.length;ie++){let re=Y.removed[ie],Re=b.indexOf(re);if(Re>=0)b[Re]=null,y[Re].disconnect(re)}for(let ie=0;ie<Y.added.length;ie++){let re=Y.added[ie],Re=b.indexOf(re);if(Re===-1){for(let ae=0;ae<y.length;ae++)if(ae>=b.length){b.push(re),Re=ae;break}else if(b[ae]===null){b[ae]=re,Re=ae;break}if(Re===-1)break}let Ne=y[Re];if(Ne)Ne.connect(re)}}let Q=new B,W=new B;function K(Y,ie,re){Q.setFromMatrixPosition(ie.matrixWorld),W.setFromMatrixPosition(re.matrixWorld);let Re=Q.distanceTo(W),Ne=ie.projectionMatrix.elements,ae=re.projectionMatrix.elements,Ce=Ne[14]/(Ne[10]-1),Ie=Ne[14]/(Ne[10]+1),ke=(Ne[9]+1)/Ne[5],qe=(Ne[9]-1)/Ne[5],Je=(Ne[8]-1)/Ne[0],_t=(ae[8]+1)/ae[0],Qe=Ce*Je,Wt=Ce*_t,wt=Re/(-Je+_t),At=wt*-Je;if(ie.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(At),Y.translateZ(wt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ne[10]===-1)Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{let N=Ce+wt,Xt=Ie+wt,nt=Qe-At,xt=Wt+(Re-At),M=ke*Ie/Xt*N,g=qe*Ie/Xt*N;Y.projectionMatrix.makePerspective(nt,xt,M,g,N,Xt),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ee(Y,ie){if(ie===null)Y.matrixWorld.copy(Y.matrix);else Y.matrixWorld.multiplyMatrices(ie.matrixWorld,Y.matrix);Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let{near:ie,far:re}=Y;if(S.texture!==null){if(S.depthNear>0)ie=S.depthNear;if(S.depthFar>0)re=S.depthFar}if(C.near=O.near=T.near=ie,C.far=O.far=T.far=re,k!==C.near||A!==C.far)i.updateRenderState({depthNear:C.near,depthFar:C.far}),k=C.near,A=C.far;C.layers.mask=Y.layers.mask|6,T.layers.mask=C.layers.mask&-5,O.layers.mask=C.layers.mask&-3;let Re=Y.parent,Ne=C.cameras;ee(C,Re);for(let ae=0;ae<Ne.length;ae++)ee(Ne[ae],Re);if(Ne.length===2)K(C,T,O);else C.projectionMatrix.copy(T.projectionMatrix);if(v===null&&Y.isPerspectiveCamera)v={camera:Y,fov:Y.fov,zoom:Y.zoom};Te(Y,C,Re)};function Te(Y,ie,re){if(re===null)Y.matrix.copy(ie.matrixWorld);else Y.matrix.copy(re.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ie.matrixWorld);if(Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Y.isPerspectiveCamera)Y.fov=bi*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1}this.getCamera=function(){return C},this.getFoveation=function(){if(d===null&&u===null)return;return o},this.setFoveation=function(Y){if(o=Y,d!==null)d.fixedFoveation=Y;if(u!==null&&u.fixedFoveation!==void 0)u.fixedFoveation=Y},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(C)},this.getCameraTexture=function(Y){return m[Y]};let Se=null;function We(Y,ie){if(c=ie.getViewerPose(l||r),p=ie,c!==null){let re=c.views;if(u!==null)e.setRenderTargetFramebuffer(I,u.framebuffer),e.setRenderTarget(I);let Re=!1;if(re.length!==C.cameras.length)C.cameras.length=0,Re=!0;for(let Ie=0;Ie<re.length;Ie++){let ke=re[Ie],qe=null;if(u!==null)qe=u.getViewport(ke);else{let _t=h.getViewSubImage(d,ke);if(qe=_t.viewport,Ie===0)e.setRenderTargetTextures(I,_t.colorTexture,_t.depthStencilTexture),e.setRenderTarget(I)}let Je=P[Ie];if(Je===void 0)Je=new Rt,Je.layers.enable(Ie),Je.viewport=new at,P[Ie]=Je;if(Je.matrix.fromArray(ke.transform.matrix),Je.matrix.decompose(Je.position,Je.quaternion,Je.scale),Je.projectionMatrix.fromArray(ke.projectionMatrix),Je.projectionMatrixInverse.copy(Je.projectionMatrix).invert(),Je.viewport.set(qe.x,qe.y,qe.width,qe.height),Ie===0)C.matrix.copy(Je.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale);if(Re===!0)C.cameras.push(Je)}let Ne=i.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let Ie=h.getDepthInformation(re[0]);if(Ie&&Ie.isValid&&Ie.texture)S.init(Ie,i.renderState)}if(Ne&&Ne.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let Ie=0;Ie<re.length;Ie++){let ke=re[Ie].camera;if(ke){let qe=m[ke];if(!qe)qe=new da,m[ke]=qe;let Je=h.getCameraImage(ke);qe.sourceTexture=Je}}}}for(let re=0;re<y.length;re++){let Re=b[re],Ne=y[re];if(Re!==null&&Ne!==void 0)Ne.update(Re,ie,l||r)}if(Se)Se(Y,ie);if(ie.detectedPlanes)n.dispatchEvent({type:"planesdetected",data:ie});p=null}let He=new Lu;He.setAnimationLoop(We),this.setAnimationLoop=function(Y){Se=Y},this.dispose=function(){}}}var V_=new Be,Xu=new Oe;Xu.set(-1,0,0,0,1,0,0,0,1);function W_(e,t){function n(m,f){if(m.matrixAutoUpdate===!0)m.updateMatrix();f.value.copy(m.matrix)}function i(m,f){if(f.color.getRGB(m.fogColor.value,dl(e)),f.isFog)m.fogNear.value=f.near,m.fogFar.value=f.far;else if(f.isFogExp2)m.fogDensity.value=f.density}function s(m,f,w,I,y){if(f.isNodeMaterial)f.uniformsNeedUpdate=!1;else if(f.isMeshBasicMaterial)r(m,f);else if(f.isMeshLambertMaterial){if(r(m,f),f.envMap)m.envMapIntensity.value=f.envMapIntensity}else if(f.isMeshToonMaterial)r(m,f),d(m,f);else if(f.isMeshPhongMaterial){if(r(m,f),h(m,f),f.envMap)m.envMapIntensity.value=f.envMapIntensity}else if(f.isMeshStandardMaterial){if(r(m,f),u(m,f),f.isMeshPhysicalMaterial)p(m,f,y)}else if(f.isMeshMatcapMaterial)r(m,f),_(m,f);else if(f.isMeshDepthMaterial)r(m,f);else if(f.isMeshDistanceMaterial)r(m,f),S(m,f);else if(f.isMeshNormalMaterial)r(m,f);else if(f.isLineBasicMaterial){if(a(m,f),f.isLineDashedMaterial)o(m,f)}else if(f.isPointsMaterial)l(m,f,w,I);else if(f.isSpriteMaterial)c(m,f);else if(f.isShadowMaterial)m.color.value.copy(f.color),m.opacity.value=f.opacity;else if(f.isShaderMaterial)f.uniformsNeedUpdate=!1}function r(m,f){if(m.opacity.value=f.opacity,f.color)m.diffuse.value.copy(f.color);if(f.emissive)m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity);if(f.map)m.map.value=f.map,n(f.map,m.mapTransform);if(f.alphaMap)m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform);if(f.bumpMap){if(m.bumpMap.value=f.bumpMap,n(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===qt)m.bumpScale.value*=-1}if(f.normalMap){if(m.normalMap.value=f.normalMap,n(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===qt)m.normalScale.value.negate()}if(f.displacementMap)m.displacementMap.value=f.displacementMap,n(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias;if(f.emissiveMap)m.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,m.emissiveMapTransform);if(f.specularMap)m.specularMap.value=f.specularMap,n(f.specularMap,m.specularMapTransform);if(f.alphaTest>0)m.alphaTest.value=f.alphaTest;let w=t.get(f),{envMap:I,envMapRotation:y}=w;if(I){if(m.envMap.value=I,m.envMapRotation.value.setFromMatrix4(V_.makeRotationFromEuler(y)).transpose(),I.isCubeTexture&&I.isRenderTargetTexture===!1)m.envMapRotation.value.premultiply(Xu);m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio}if(f.lightMap)m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,m.lightMapTransform);if(f.aoMap)m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,m.aoMapTransform)}function a(m,f){if(m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map)m.map.value=f.map,n(f.map,m.mapTransform)}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,w,I){if(m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*w,m.scale.value=I*0.5,f.map)m.map.value=f.map,n(f.map,m.uvTransform);if(f.alphaMap)m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform);if(f.alphaTest>0)m.alphaTest.value=f.alphaTest}function c(m,f){if(m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map)m.map.value=f.map,n(f.map,m.mapTransform);if(f.alphaMap)m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform);if(f.alphaTest>0)m.alphaTest.value=f.alphaTest}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,0.0001)}function d(m,f){if(f.gradientMap)m.gradientMap.value=f.gradientMap}function u(m,f){if(m.metalness.value=f.metalness,f.metalnessMap)m.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,m.metalnessMapTransform);if(m.roughness.value=f.roughness,f.roughnessMap)m.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,m.roughnessMapTransform);if(f.envMap)m.envMapIntensity.value=f.envMapIntensity}function p(m,f,w){if(m.ior.value=f.ior,f.sheen>0){if(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap)m.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,m.sheenColorMapTransform);if(f.sheenRoughnessMap)m.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,m.sheenRoughnessMapTransform)}if(f.clearcoat>0){if(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap)m.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,m.clearcoatMapTransform);if(f.clearcoatRoughnessMap)m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform);if(f.clearcoatNormalMap){if(m.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===qt)m.clearcoatNormalScale.value.negate()}}if(f.dispersion>0)m.dispersion.value=f.dispersion;if(f.retroreflectivity>0)m.retroreflectivity.value=f.retroreflectivity;if(f.iridescence>0){if(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap)m.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,m.iridescenceMapTransform);if(f.iridescenceThicknessMap)m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform)}if(f.transmission>0){if(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap)m.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,m.transmissionMapTransform);if(m.thickness.value=f.thickness,f.thicknessMap)m.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,m.thicknessMapTransform);m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)}if(f.anisotropy>0){if(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap)m.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,m.anisotropyMapTransform)}if(m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap)m.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,m.specularColorMapTransform);if(f.specularIntensityMap)m.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,m.specularIntensityMapTransform)}function _(m,f){if(f.matcap)m.matcap.value=f.matcap}function S(m,f){let w=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function X_(e,t,n,i){let s={},r={},a=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,b){let E=b.program;i.uniformBlockBinding(y,E)}function c(y,b){let E=s[y.id];if(E===void 0)m(y),E=h(y),s[y.id]=E,y.addEventListener("dispose",w);let R=b.program;i.updateUBOMapping(y,R);let v=t.render.frame;if(r[y.id]!==v)u(y),r[y.id]=v}function h(y){let b=d();y.__bindingPointIndex=b;let E=e.createBuffer(),{__size:R,usage:v}=y;return e.bindBuffer(e.UNIFORM_BUFFER,E),e.bufferData(e.UNIFORM_BUFFER,R,v),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,b,E),E}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ue("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let b=s[y.id],{uniforms:E,__cache:R}=y;e.bindBuffer(e.UNIFORM_BUFFER,b);for(let v=0,T=E.length;v<T;v++){let O=E[v];if(Array.isArray(O))for(let P=0,C=O.length;P<C;P++)p(O[P],v,P,R);else p(O,v,0,R)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(y,b,E,R){if(S(y,b,E,R)===!0){let{__offset:v,value:T}=y;if(Array.isArray(T)){let O=0;for(let P=0;P<T.length;P++){let C=T[P],k=f(C);if(_(C,y.__data,O),typeof C!=="number"&&typeof C!=="boolean"&&!C.isMatrix3&&!ArrayBuffer.isView(C))O+=k.storage/Float32Array.BYTES_PER_ELEMENT}}else _(T,y.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,v,y.__data)}}function _(y,b,E){if(typeof y==="number"||typeof y==="boolean")b[0]=y;else if(y.isMatrix3)b[0]=y.elements[0],b[1]=y.elements[1],b[2]=y.elements[2],b[3]=0,b[4]=y.elements[3],b[5]=y.elements[4],b[6]=y.elements[5],b[7]=0,b[8]=y.elements[6],b[9]=y.elements[7],b[10]=y.elements[8],b[11]=0;else if(ArrayBuffer.isView(y))b.set(new y.constructor(y.buffer,y.byteOffset,b.length));else y.toArray(b,E)}function S(y,b,E,R){let v=y.value,T=b+"_"+E;if(R[T]===void 0){if(typeof v==="number"||typeof v==="boolean")R[T]=v;else if(ArrayBuffer.isView(v))R[T]=v.slice();else R[T]=v.clone();return!0}else{let O=R[T];if(typeof v==="number"||typeof v==="boolean"){if(O!==v)return R[T]=v,!0}else if(ArrayBuffer.isView(v))return!0;else if(O.equals(v)===!1)return O.copy(v),!0}return!1}function m(y){let b=y.uniforms,E=0,R=16;for(let T=0,O=b.length;T<O;T++){let P=Array.isArray(b[T])?b[T]:[b[T]];for(let C=0,k=P.length;C<k;C++){let A=P[C],F=Array.isArray(A.value)?A.value:[A.value];for(let V=0,z=F.length;V<z;V++){let Q=F[V],W=f(Q),K=E%R,ee=K%W.boundary,Te=K+ee;if(E+=ee,Te!==0&&R-Te<W.storage)E+=R-Te;A.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),A.__offset=E,E+=W.storage}}}let v=E%R;if(v>0)E+=R-v;return y.__size=E,y.__cache={},this}function f(y){let b={boundary:0,storage:0};if(typeof y==="number"||typeof y==="boolean")b.boundary=4,b.storage=4;else if(y.isVector2)b.boundary=8,b.storage=8;else if(y.isVector3||y.isColor)b.boundary=16,b.storage=12;else if(y.isVector4)b.boundary=16,b.storage=16;else if(y.isMatrix3)b.boundary=48,b.storage=48;else if(y.isMatrix4)b.boundary=64,b.storage=64;else if(y.isTexture)Ae("WebGLRenderer: Texture samplers can not be part of an uniforms group.");else if(ArrayBuffer.isView(y))b.boundary=16,b.storage=y.byteLength;else Ae("WebGLRenderer: Unsupported uniform value type.",y);return b}function w(y){let b=y.target;b.removeEventListener("dispose",w);let E=a.indexOf(b.__bindingPointIndex);a.splice(E,1),e.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function I(){for(let y in s)e.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:I}}var q_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Nn=null;function Y_(){if(Nn===null)Nn=new Ks(q_,16,16,Ri,In),Nn.name="DFG_LUT",Nn.minFilter=Dt,Nn.magFilter=Dt,Nn.wrapS=hs,Nn.wrapT=hs,Nn.generateMipmaps=!1,Nn.needsUpdate=!0;return Nn}class zl{constructor(e={}){let{canvas:t=jh(),context:n=null,depth:i=!0,stencil:s=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:u=vn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=r;let _=u,S=new Set([To,bo,Mo]),m=new Set([vn,oi,Hs,ds,yo,So]),f=new Uint32Array(4),w=new Int32Array(4),I=new B,y=null,b=null,E=[],R=[],v=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=_n,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,O=!1,P=null,C=null,k=null,A=null;this._outputColorSpace=li;let F=0,V=0,z=null,Q=-1,W=null,K=new at,ee=new at,Te=null,Se=new Le(0),We=0,{width:He,height:Y}=t,ie=1,re=null,Re=null,Ne=new at(0,0,He,Y),ae=new at(0,0,He,Y),Ce=!1,Ie=new $s,ke=!1,qe=!1,Je=new Be,_t=new B,Qe=new at,Wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},wt=!1;function At(){return z===null?ie:1}let N=n;function Xt(x,D){return t.getContext(x,D)}let nt,xt,M,g,L,X,ne,oe,he,Z,j,ge,we,ue,se,Pe,De,et,U,le,J,ce,_e;try{let x={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:h};if("setAttribute"in t)t.setAttribute("data-engine",`three.js r${sh}`);if(t.addEventListener("webglcontextlost",ze,!1),t.addEventListener("webglcontextrestored",ut,!1),t.addEventListener("webglcontextcreationerror",it,!1),N===null){if(N=Xt("webgl2",x),N===null)if(Xt("webgl2"))throw Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.");else throw Error("THREE.WebGLRenderer: Error creating WebGL context.")}te()}catch(x){throw t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",it,!1),Ue("WebGLRenderer: "+x.message),x}function te(){if(nt=new e0(N),nt.init(),J=new k_(N,nt),xt=new Wg(N,nt,e,J),M=new B_(N,nt),xt.reversedDepthBuffer&&d)M.buffers.depth.setReversed(!0);C=N.createFramebuffer(),k=N.createFramebuffer(),A=N.createFramebuffer(),g=new i0(N),L=new T_,X=new z_(N,nt,M,L,xt,J,g),ne=new Qg(T),oe=new rp(N),ce=new Gg(N,oe),he=new t0(N,oe,g,ce),Z=new r0(N,he,oe,ce,g),et=new s0(N,xt,X),se=new Xg(L),j=new b_(T,ne,nt,xt,ce,se),ge=new W_(T,L),we=new w_,ue=new L_(nt),De=new Hg(T,ne,M,Z,p,o),Pe=new O_(T,Z,xt),_e=new X_(N,g,xt,M),U=new Vg(N,nt,g),le=new n0(N,nt,g),g.programs=j.programs,T.capabilities=xt,T.extensions=nt,T.properties=L,T.renderLists=we,T.shadowMap=Pe,T.state=M,T.info=g}if(_!==vn)v=new o0(_,t.width,t.height,a,i,s);let fe=new Wu(T,N);this.xr=fe,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let x=nt.get("WEBGL_lose_context");if(x)x.loseContext()},this.forceContextRestore=function(){let x=nt.get("WEBGL_lose_context");if(x)x.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(x){if(x===void 0)return;ie=x,this.setSize(He,Y,!1)},this.getSize=function(x){return x.set(He,Y)},this.setSize=function(x,D,q=!0){if(fe.isPresenting){Ae("WebGLRenderer: Can't change size while VR device is presenting.");return}if(He=x,Y=D,t.width=Math.floor(x*ie),t.height=Math.floor(D*ie),q===!0)t.style.width=x+"px",t.style.height=D+"px";if(v!==null)v.setSize(t.width,t.height);this.setViewport(0,0,x,D)},this.getDrawingBufferSize=function(x){return x.set(He*ie,Y*ie).floor()},this.setDrawingBufferSize=function(x,D,q){He=x,Y=D,ie=q,t.width=Math.floor(x*q),t.height=Math.floor(D*q),this.setViewport(0,0,x,D)},this.setEffects=function(x){if(_===vn){Ue("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(x){for(let D=0;D<x.length;D++)if(x[D].isOutputPass===!0){Ae("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}v.setEffects(x||[])},this.getCurrentViewport=function(x){return x.copy(K)},this.getViewport=function(x){return x.copy(Ne)},this.setViewport=function(x,D,q,H){if(x.isVector4)Ne.set(x.x,x.y,x.z,x.w);else Ne.set(x,D,q,H);M.viewport(K.copy(Ne).multiplyScalar(ie).round())},this.getScissor=function(x){return x.copy(ae)},this.setScissor=function(x,D,q,H){if(x.isVector4)ae.set(x.x,x.y,x.z,x.w);else ae.set(x,D,q,H);M.scissor(ee.copy(ae).multiplyScalar(ie).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(x){M.setScissorTest(Ce=x)},this.setOpaqueSort=function(x){re=x},this.setTransparentSort=function(x){Re=x},this.getClearColor=function(x){return x.copy(De.getClearColor())},this.setClearColor=function(){De.setClearColor(...arguments)},this.getClearAlpha=function(){return De.getClearAlpha()},this.setClearAlpha=function(){De.setClearAlpha(...arguments)},this.clear=function(x=!0,D=!0,q=!0){let H=0;if(x){let G=!1;if(z!==null){let me=z.texture.format;G=S.has(me)}if(G){let me=z.texture.type,ve=m.has(me),pe=De.getClearColor(),Me=De.getClearAlpha(),{r:Ee,g:Ge,b:Ze}=pe;if(ve)f[0]=Ee,f[1]=Ge,f[2]=Ze,f[3]=Me,N.clearBufferuiv(N.COLOR,0,f);else w[0]=Ee,w[1]=Ge,w[2]=Ze,w[3]=Me,N.clearBufferiv(N.COLOR,0,w)}else H|=N.COLOR_BUFFER_BIT}if(D)H|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0);if(q)H|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295);if(H!==0)N.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(x){x.setRenderer(this),P=x},this.dispose=function(){t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",it,!1),De.dispose(),we.dispose(),ue.dispose(),L.dispose(),ne.dispose(),Z.dispose(),ce.dispose(),_e.dispose(),j.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",hc),fe.removeEventListener("sessionend",uc),_i.stop()};function ze(x){x.preventDefault(),Os("WebGLRenderer: Context Lost."),O=!0}function ut(){Os("WebGLRenderer: Context Restored."),O=!1;let x=g.autoReset,D=Pe.enabled,q=Pe.autoUpdate,H=Pe.needsUpdate,G=Pe.type;te(),g.autoReset=x,Pe.enabled=D,Pe.autoUpdate=q,Pe.needsUpdate=H,Pe.type=G}function it(x){Ue("WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function bn(x){let D=x.target;D.removeEventListener("dispose",bn),On(D)}function On(x){Kd(x),L.remove(x)}function Kd(x){let D=L.get(x).programs;if(D!==void 0){if(D.forEach(function(q){j.releaseProgram(q)}),x.isShaderMaterial)j.releaseShaderCache(x)}}this.renderBufferDirect=function(x,D,q,H,G,me){if(D===null)D=Wt;let ve=G.isMesh&&G.matrixWorld.determinantAffine()<0,pe=jd(x,D,q,H,G);M.setMaterial(H,ve);let Me=q.index,Ee=1;if(H.wireframe===!0){if(Me=he.getWireframeAttribute(q),Me===void 0)return;Ee=2}let Ge=q.drawRange,Ze=q.attributes.position,be=Ge.start*Ee,st=(Ge.start+Ge.count)*Ee;if(me!==null)be=Math.max(be,me.start*Ee),st=Math.min(st,(me.start+me.count)*Ee);if(Me!==null)be=Math.max(be,0),st=Math.min(st,Me.count);else if(Ze!==void 0&&Ze!==null)be=Math.max(be,0),st=Math.min(st,Ze.count);let bt=st-be;if(bt<0||bt===1/0)return;ce.setup(G,H,pe,q,Me);let pt,ct=U;if(Me!==null)pt=oe.get(Me),ct=le,ct.setIndex(pt);if(G.isMesh)if(H.wireframe===!0)M.setLineWidth(H.wireframeLinewidth*At()),ct.setMode(N.LINES);else ct.setMode(N.TRIANGLES);else if(G.isLine){let Ut=H.linewidth;if(Ut===void 0)Ut=1;if(M.setLineWidth(Ut*At()),G.isLineSegments)ct.setMode(N.LINES);else if(G.isLineLoop)ct.setMode(N.LINE_LOOP);else ct.setMode(N.LINE_STRIP)}else if(G.isPoints)ct.setMode(N.POINTS);else if(G.isSprite)ct.setMode(N.TRIANGLES);if(G.isBatchedMesh)if(!nt.get("WEBGL_multi_draw")){let{_multiDrawStarts:Ut,_multiDrawCounts:xe,_multiDrawCount:Ht}=G,je=Me?oe.get(Me).bytesPerElement:1,sn=L.get(H).currentProgram.getUniforms();for(let Tn=0;Tn<Ht;Tn++)sn.setValue(N,"_gl_DrawID",Tn),ct.render(Ut[Tn]/je,xe[Tn])}else ct.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else if(G.isInstancedMesh)ct.renderInstances(be,bt,G.count);else if(q.isInstancedBufferGeometry){let Ut=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,xe=Math.min(q.instanceCount,Ut);ct.renderInstances(be,bt,xe)}else ct.render(be,bt)};function cc(x,D,q,H){if(P!==null&&x.isNodeMaterial)P.setObject(H,x);if(ke===!0)se.setState(x,q,!1);if(x.transparent===!0&&x.side===Bt&&x.forceSinglePass===!1)x.side=qt,x.needsUpdate=!0,pr(x,D,H),x.side=ai,x.needsUpdate=!0,pr(x,D,H),x.side=Bt;else pr(x,D,H)}this.compile=function(x,D,q=null){if(q===null)q=x;if(P!==null)P.renderStart(x,D,q);if(b=ue.get(q),b.init(D),R.push(b),q.traverseVisible(function(G){if(G.isLight&&G.layers.test(D.layers)){if(b.pushLight(G),G.castShadow)b.pushShadow(G)}}),x!==q)x.traverseVisible(function(G){if(G.isLight&&G.layers.test(D.layers)){if(b.pushLight(G),G.castShadow)b.pushShadow(G)}});if(b.setupLights(),P!==null)P.updateLights(b.state.lightsArray);if(qe=this.localClippingEnabled,ke=se.init(this.clippingPlanes,qe),ke===!0)se.setGlobalState(this.clippingPlanes,D);if(P!==null)Pe.render(b.state.shadowsArray,q,D);let H=new Set;if(x.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let me=G.material;if(me)if(Array.isArray(me))for(let ve=0;ve<me.length;ve++){let pe=me[ve];cc(pe,q,D,G),H.add(pe)}else cc(me,q,D,G),H.add(me)}),b=R.pop(),P!==null)P.renderEnd();return H},this.compileAsync=function(x,D,q=null){let H=this.compile(x,D,q);return new Promise((G)=>{function me(){if(H.forEach(function(ve){let Me=L.get(ve).currentProgram;if(Me===void 0||Me.isReady())H.delete(ve)}),H.size===0){G(x);return}setTimeout(me,10)}if(nt.get("KHR_parallel_shader_compile")!==null)me();else setTimeout(me,10)})};let La=null;function Jd(x){if(La)La(x)}function hc(){_i.stop()}function uc(){_i.start()}let _i=new Lu;if(_i.setAnimationLoop(Jd),typeof self<"u")_i.setContext(self);this.setAnimationLoop=function(x){La=x,fe.setAnimationLoop(x),x===null?_i.stop():_i.start()},fe.addEventListener("sessionstart",hc),fe.addEventListener("sessionend",uc),this.render=function(x,D){if(D!==void 0&&D.isCamera!==!0){Ue("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;if(P!==null)P.renderStart(x,D);let q=fe.enabled===!0&&fe.isPresenting===!0,H=v!==null&&(z===null||q)&&v.begin(T,z);if(x.matrixWorldAutoUpdate===!0)x.updateMatrixWorld();if(D.parent===null&&D.matrixWorldAutoUpdate===!0)D.updateMatrixWorld();if(fe.enabled===!0&&fe.isPresenting===!0&&(v===null||v.isCompositing()===!1)){if(fe.cameraAutoUpdate===!0)fe.updateCamera(D);D=fe.getCamera()}if(x.isScene===!0)x.onBeforeRender(T,x,D,z);if(b=ue.get(x,R.length),b.init(D),b.state.textureUnits=X.getTextureUnits(),R.push(b),Je.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Ie.setFromProjectionMatrix(Je,al,D.reversedDepth),qe=this.localClippingEnabled,ke=se.init(this.clippingPlanes,qe),y=we.get(x,E.length),y.init(),E.push(y),fe.enabled===!0&&fe.isPresenting===!0){let ve=T.xr.getDepthSensingMesh();if(ve!==null)Na(ve,D,-1/0,T.sortObjects)}if(Na(x,D,0,T.sortObjects),y.finish(),P!==null)P.updateLights(b.state.lightsArray);if(T.sortObjects===!0)y.sort(re,Re);if(wt=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,wt)De.addToRenderList(y,x);if(this.info.render.frame++,this.info.autoReset===!0)this.info.reset();if(ke===!0)se.beginShadows();let G=b.state.shadowsArray;if(Pe.render(G,x,D),ke===!0)se.endShadows();if((H&&v.hasRenderPass())===!1){let ve=y.opaque,pe=y.transmissive;if(b.setupLights(),D.isArrayCamera){let Me=D.cameras;if(pe.length>0)for(let Ee=0,Ge=Me.length;Ee<Ge;Ee++){let Ze=Me[Ee];fc(ve,pe,x,Ze)}if(wt)De.render(x);for(let Ee=0,Ge=Me.length;Ee<Ge;Ee++){let Ze=Me[Ee];dc(y,x,Ze,Ze.viewport)}}else{if(pe.length>0)fc(ve,pe,x,D);if(wt)De.render(x);dc(y,x,D)}}if(z!==null&&V===0)X.updateMultisampleRenderTarget(z),X.updateRenderTargetMipmap(z);if(H)v.end(T);if(x.isScene===!0)x.onAfterRender(T,x,D);if(ce.resetDefaultState(),Q=-1,W=null,R.pop(),R.length>0){if(b=R[R.length-1],X.setTextureUnits(b.state.textureUnits),ke===!0)se.setGlobalState(T.clippingPlanes,b.state.camera)}else b=null;if(E.pop(),E.length>0)y=E[E.length-1];else y=null;if(P!==null)P.renderEnd()};function Na(x,D,q,H){if(x.visible===!1)return;if(x.layers.test(D.layers)){if(x.isGroup)q=x.renderOrder;else if(x.isLOD){if(x.autoUpdate===!0)x.update(D)}else if(x.isLightProbeGrid)b.pushLightProbeGrid(x);else if(x.isLight){if(b.pushLight(x),x.castShadow)b.pushShadow(x)}else if(x.isSprite){if(!x.frustumCulled||x.intersectsFrustum(Ie)){if(H)Qe.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Je);let ve=Z.update(x),pe=x.material;if(pe.visible)y.push(x,ve,pe,q,Qe.z,null,D)}}else if(x.isMesh||x.isLine||x.isPoints){if(!x.frustumCulled||x.intersectsFrustum(Ie)){let ve=Z.update(x),pe=x.material;if(H){if(x.boundingSphere!==void 0){if(x.boundingSphere===null)x.computeBoundingSphere();Qe.copy(x.boundingSphere.center)}else{if(ve.boundingSphere===null)ve.computeBoundingSphere();Qe.copy(ve.boundingSphere.center)}Qe.applyMatrix4(x.matrixWorld).applyMatrix4(Je)}if(Array.isArray(pe)){let Me=ve.groups;for(let Ee=0,Ge=Me.length;Ee<Ge;Ee++){let Ze=Me[Ee],be=pe[Ze.materialIndex];if(be&&be.visible)y.push(x,ve,be,q,Qe.z,Ze,D)}}else if(pe.visible)y.push(x,ve,pe,q,Qe.z,null,D)}}}let me=x.children;for(let ve=0,pe=me.length;ve<pe;ve++)Na(me[ve],D,q,H)}function dc(x,D,q,H){let{opaque:G,transmissive:me,transparent:ve}=x;if(b.setupLightsView(q),ke===!0)se.setGlobalState(T.clippingPlanes,q);if(H)M.viewport(K.copy(H));if(G.length>0)fr(G,D,q);if(me.length>0)fr(me,D,q);if(ve.length>0)fr(ve,D,q);M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function fc(x,D,q,H){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){let be=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new $t(1,1,{generateMipmaps:!0,type:be?In:vn,minFilter:Cn,samples:Math.max(4,xt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Xe.workingColorSpace})}let me=b.state.transmissionRenderTarget[H.id],ve=H.viewport||K;me.setSize(ve.z*T.transmissionResolutionScale,ve.w*T.transmissionResolutionScale);let pe=T.getRenderTarget(),Me=T.getActiveCubeFace(),Ee=T.getActiveMipmapLevel();if(T.setRenderTarget(me),T.getClearColor(Se),We=T.getClearAlpha(),We<1)T.setClearColor(16777215,0.5);if(T.clear(),wt)De.render(q);let Ge=T.toneMapping;T.toneMapping=_n;let Ze=H.viewport;if(H.viewport!==void 0)H.viewport=void 0;if(b.setupLightsView(H),ke===!0)se.setGlobalState(T.clippingPlanes,H);if(fr(x,q,H),X.updateMultisampleRenderTarget(me),X.updateRenderTargetMipmap(me),nt.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let st=0,bt=D.length;st<bt;st++){let pt=D[st],{object:ct,geometry:Ut,material:xe,group:Ht}=pt;if(xe.side===Bt&&ct.layers.test(H.layers)){let je=xe.side;xe.side=qt,xe.needsUpdate=!0,pc(ct,q,H,Ut,xe,Ht),xe.side=je,xe.needsUpdate=!0,be=!0}}if(be===!0)X.updateMultisampleRenderTarget(me),X.updateRenderTargetMipmap(me)}if(T.setRenderTarget(pe,Me,Ee),T.setClearColor(Se,We),Ze!==void 0)H.viewport=Ze;T.toneMapping=Ge}function fr(x,D,q){let H=D.isScene===!0?D.overrideMaterial:null;for(let G=0,me=x.length;G<me;G++){let ve=x[G],{object:pe,geometry:Me,group:Ee}=ve,Ge=ve.material;if(Ge.allowOverride===!0&&H!==null)Ge=H;if(pe.layers.test(q.layers))pc(pe,D,q,Me,Ge,Ee)}}function pc(x,D,q,H,G,me){if(P!==null&&G.isNodeMaterial)P.setObject(x,G);if(x.onBeforeRender(T,D,q,H,G,me),x.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),G.onBeforeRender(T,D,q,H,x,me),G.transparent===!0&&G.side===Bt&&G.forceSinglePass===!1)G.side=qt,G.needsUpdate=!0,T.renderBufferDirect(q,D,H,G,x,me),G.side=ai,G.needsUpdate=!0,T.renderBufferDirect(q,D,H,G,x,me),G.side=Bt;else T.renderBufferDirect(q,D,H,G,x,me);x.onAfterRender(T,D,q,H,G,me)}function pr(x,D,q){if(D.isScene!==!0)D=Wt;let H=L.get(x),G=b.state.lights,me=b.state.shadowsArray,ve=G.state.version,pe=j.getParameters(x,G.state,me,D,q,b.state.lightProbeGridArray),Me=j.getProgramCacheKey(pe),Ee=H.programs;H.environment=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;let Ge=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap;if(H.envMap=ne.get(x.envMap||H.environment,Ge),H.envMapRotation=H.environment!==null&&x.envMap===null?D.environmentRotation:x.envMapRotation,Ee===void 0)x.addEventListener("dispose",bn),Ee=new Map,H.programs=Ee;let Ze=Ee.get(Me);if(Ze!==void 0){if(H.currentProgram===Ze&&H.lightsStateVersion===ve)return gc(x,pe),Ze}else{if(pe.uniforms=j.getUniforms(x),P!==null&&x.isNodeMaterial)P.build(x,q,pe);x.onBeforeCompile(pe,T),Ze=j.acquireProgram(pe,Me),Ee.set(Me,Ze),H.uniforms=pe.uniforms}let be=H.uniforms;if(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)be.clippingPlanes=se.uniform;if(gc(x,pe),H.needsLights=ef(x),H.lightsStateVersion=ve,H.needsLights)be.ambientLightColor.value=G.state.ambient,be.lightProbe.value=G.state.probe,be.sunLights.value=G.state.sun,be.sunLightShadows.value=G.state.sunShadow,be.directionalLights.value=G.state.directional,be.directionalLightShadows.value=G.state.directionalShadow,be.spotLights.value=G.state.spot,be.spotLightShadows.value=G.state.spotShadow,be.rectAreaLights.value=G.state.rectArea,be.ltc_1.value=G.state.rectAreaLTC1,be.ltc_2.value=G.state.rectAreaLTC2,be.pointLights.value=G.state.point,be.pointLightShadows.value=G.state.pointShadow,be.hemisphereLights.value=G.state.hemi,be.sunShadowMatrix.value=G.state.sunShadowMatrix,be.sunShadowCascade.value=G.state.sunShadowCascade,be.directionalShadowMatrix.value=G.state.directionalShadowMatrix,be.spotLightMatrix.value=G.state.spotLightMatrix,be.spotLightMap.value=G.state.spotLightMap,be.pointShadowMatrix.value=G.state.pointShadowMatrix;return H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=Ze,H.uniformsList=null,Ze}function mc(x){if(x.uniformsList===null){let D=x.currentProgram.getUniforms();x.uniformsList=or.seqWithValue(D.seq,x.uniforms)}return x.uniformsList}function gc(x,D){let q=L.get(x);q.outputColorSpace=D.outputColorSpace,q.batching=D.batching,q.batchingColor=D.batchingColor,q.instancing=D.instancing,q.instancingColor=D.instancingColor,q.instancingMorph=D.instancingMorph,q.skinning=D.skinning,q.morphTargets=D.morphTargets,q.morphNormals=D.morphNormals,q.morphColors=D.morphColors,q.morphTargetsCount=D.morphTargetsCount,q.numClippingPlanes=D.numClippingPlanes,q.numIntersection=D.numClipIntersection,q.vertexAlphas=D.vertexAlphas,q.vertexTangents=D.vertexTangents,q.toneMapping=D.toneMapping}function $d(x,D){if(x.length===0)return null;if(x.length===1)return x[0].texture!==null?x[0]:null;I.setFromMatrixPosition(D.matrixWorld);for(let q=0,H=x.length;q<H;q++){let G=x[q];if(G.texture!==null&&G.boundingBox.containsPoint(I))return G}return null}function jd(x,D,q,H,G){if(D.isScene!==!0)D=Wt;X.resetTextureUnits();let me=D.fog,ve=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,pe=z===null?T.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:Xe.workingColorSpace,Me=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Ee=ne.get(H.envMap||ve,Me),Ge=H.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ze=!!q.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),be=!!q.morphAttributes.position,st=!!q.morphAttributes.normal,bt=!!q.morphAttributes.color,pt=_n;if(H.toneMapped){if(z===null||z.isXRRenderTarget===!0)pt=T.toneMapping}let ct=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Ut=ct!==void 0?ct.length:0,xe=L.get(H),Ht=b.state.lights;if(ke===!0){if(qe===!0||x!==W){let dt=x===W&&H.id===Q;se.setState(H,x,dt)}}let je=!1;if(H.version===xe.__version){if(xe.needsLights&&xe.lightsStateVersion!==Ht.state.version)je=!0;else if(xe.outputColorSpace!==pe)je=!0;else if(G.isBatchedMesh&&xe.batching===!1)je=!0;else if(!G.isBatchedMesh&&xe.batching===!0)je=!0;else if(G.isBatchedMesh&&xe.batchingColor===!0&&G._colorsTexture===null)je=!0;else if(G.isBatchedMesh&&xe.batchingColor===!1&&G._colorsTexture!==null)je=!0;else if(G.isInstancedMesh&&xe.instancing===!1)je=!0;else if(!G.isInstancedMesh&&xe.instancing===!0)je=!0;else if(G.isSkinnedMesh&&xe.skinning===!1)je=!0;else if(!G.isSkinnedMesh&&xe.skinning===!0)je=!0;else if(G.isInstancedMesh&&xe.instancingColor===!0&&G.instanceColor===null)je=!0;else if(G.isInstancedMesh&&xe.instancingColor===!1&&G.instanceColor!==null)je=!0;else if(G.isInstancedMesh&&xe.instancingMorph===!0&&G.morphTexture===null)je=!0;else if(G.isInstancedMesh&&xe.instancingMorph===!1&&G.morphTexture!==null)je=!0;else if(xe.envMap!==Ee)je=!0;else if(H.fog===!0&&xe.fog!==me)je=!0;else if(xe.numClippingPlanes!==void 0&&(xe.numClippingPlanes!==se.numPlanes||xe.numIntersection!==se.numIntersection))je=!0;else if(xe.vertexAlphas!==Ge)je=!0;else if(xe.vertexTangents!==Ze)je=!0;else if(xe.morphTargets!==be)je=!0;else if(xe.morphNormals!==st)je=!0;else if(xe.morphColors!==bt)je=!0;else if(xe.toneMapping!==pt)je=!0;else if(xe.morphTargetsCount!==Ut)je=!0;else if(!!xe.lightProbeGrid!==b.state.lightProbeGridArray.length>0)je=!0}else je=!0,xe.__version=H.version;let sn=xe.currentProgram;if(je===!0){if(sn=pr(H,D,G),P&&H.isNodeMaterial)P.onUpdateProgram(H,sn,xe)}let Tn=!1,Jn=!1,Hi=!1,lt=sn.getUniforms(),St=xe.uniforms;if(M.useProgram(sn.program))Tn=!0,Jn=!0,Hi=!0;if(H.id!==Q)Q=H.id,Jn=!0;if(xe.needsLights){let dt=$d(b.state.lightProbeGridArray,G);if(xe.lightProbeGrid!==dt)xe.lightProbeGrid=dt,Jn=!0}if(Tn||W!==x){if(M.buffers.depth.getReversed()&&x.reversedDepth!==!0)x._reversedDepth=!0,x.updateProjectionMatrix();lt.setValue(N,"projectionMatrix",x.projectionMatrix),lt.setValue(N,"viewMatrix",x.matrixWorldInverse);let jn=lt.map.cameraPosition;if(jn!==void 0)jn.setValue(N,_t.setFromMatrixPosition(x.matrixWorld));if(xt.logarithmicDepthBuffer)lt.setValue(N,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2));if(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)lt.setValue(N,"isOrthographic",x.isOrthographicCamera===!0);if(W!==x)W=x,Jn=!0,Hi=!0}if(xe.needsLights){if(Ht.state.sunShadowMap.length>0)lt.setValue(N,"sunShadowMap",Ht.state.sunShadowMap,X);if(Ht.state.directionalShadowMap.length>0)lt.setValue(N,"directionalShadowMap",Ht.state.directionalShadowMap,X);if(Ht.state.spotShadowMap.length>0)lt.setValue(N,"spotShadowMap",Ht.state.spotShadowMap,X);if(Ht.state.pointShadowMap.length>0)lt.setValue(N,"pointShadowMap",Ht.state.pointShadowMap,X)}if(G.isSkinnedMesh){lt.setOptional(N,G,"bindMatrix"),lt.setOptional(N,G,"bindMatrixInverse");let dt=G.skeleton;if(dt){if(dt.boneTexture===null)dt.computeBoneTexture();lt.setValue(N,"boneTexture",dt.boneTexture,X)}}if(G.isBatchedMesh){if(lt.setOptional(N,G,"batchingTexture"),lt.setValue(N,"batchingTexture",G._matricesTexture,X),lt.setOptional(N,G,"batchingIdTexture"),lt.setValue(N,"batchingIdTexture",G._indirectTexture,X),lt.setOptional(N,G,"batchingColorTexture"),G._colorsTexture!==null)lt.setValue(N,"batchingColorTexture",G._colorsTexture,X)}let $n=q.morphAttributes;if($n.position!==void 0||$n.normal!==void 0||$n.color!==void 0)et.update(G,q,sn);if(Jn||xe.receiveShadow!==G.receiveShadow)xe.receiveShadow=G.receiveShadow,lt.setValue(N,"receiveShadow",G.receiveShadow);if((H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null)St.envMapIntensity.value=D.environmentIntensity;if(St.dfgLUT!==void 0)St.dfgLUT.value=Y_();if(Jn){if(lt.setValue(N,"toneMappingExposure",T.toneMappingExposure),xe.needsLights)Qd(St,Hi);if(me&&H.fog===!0)ge.refreshFogUniforms(St,me);if(ge.refreshMaterialUniforms(St,H,ie,Y,b.state.transmissionRenderTarget[x.id]),xe.needsLights&&xe.lightProbeGrid){let dt=xe.lightProbeGrid;St.probesSH.value=dt.texture,St.probesMin.value.copy(dt.boundingBox.min),St.probesMax.value.copy(dt.boundingBox.max),St.probesResolution.value.copy(dt.resolution)}or.upload(N,mc(xe),St,X)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0)or.upload(N,mc(xe),St,X),H.uniformsNeedUpdate=!1;if(H.isSpriteMaterial)lt.setValue(N,"center",G.center);if(lt.setValue(N,"modelViewMatrix",G.modelViewMatrix),lt.setValue(N,"normalMatrix",G.normalMatrix),lt.setValue(N,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let dt=H.uniformsGroups;for(let jn=0,Gi=dt.length;jn<Gi;jn++){let xc=dt[jn];_e.update(xc,sn),_e.bind(xc,sn)}}return sn}function Qd(x,D){x.ambientLightColor.needsUpdate=D,x.lightProbe.needsUpdate=D,x.sunLights.needsUpdate=D,x.sunLightShadows.needsUpdate=D,x.directionalLights.needsUpdate=D,x.directionalLightShadows.needsUpdate=D,x.pointLights.needsUpdate=D,x.pointLightShadows.needsUpdate=D,x.spotLights.needsUpdate=D,x.spotLightShadows.needsUpdate=D,x.rectAreaLights.needsUpdate=D,x.hemisphereLights.needsUpdate=D}function ef(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(x,D,q){let H=L.get(x);if(H.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1)H.__useRenderToTexture=!1;L.get(x.texture).__webglTexture=D,L.get(x.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:q,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,D){let q=L.get(x);q.__webglFramebuffer=D,q.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(x,D=0,q=0){z=x,F=D,V=q;let H=null,G=!1,me=!1;if(x){let pe=L.get(x);if(pe.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(N.FRAMEBUFFER,pe.__webglFramebuffer),K.copy(x.viewport),ee.copy(x.scissor),Te=x.scissorTest,M.viewport(K),M.scissor(ee),M.setScissorTest(Te),Q=-1;return}else if(pe.__webglFramebuffer===void 0)X.setupRenderTarget(x);else if(pe.__hasExternalTextures)X.rebindTextures(x,L.get(x.texture).__webglTexture,L.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let Ge=x.depthTexture;if(pe.__boundDepthTexture!==Ge){if(Ge!==null&&L.has(Ge)&&(x.width!==Ge.image.width||x.height!==Ge.image.height))throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(x)}}let Me=x.texture;if(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)me=!0;let Ee=L.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget){if(Array.isArray(Ee[D]))H=Ee[D][q];else H=Ee[D];G=!0}else if(x.samples>0&&X.useMultisampledRTT(x)===!1)H=L.get(x).__webglMultisampledFramebuffer;else if(Array.isArray(Ee))H=Ee[q];else H=Ee;K.copy(x.viewport),ee.copy(x.scissor),Te=x.scissorTest}else K.copy(Ne).multiplyScalar(ie).floor(),ee.copy(ae).multiplyScalar(ie).floor(),Te=Ce;if(q!==0)H=C;if(M.bindFramebuffer(N.FRAMEBUFFER,H))M.drawBuffers(x,H);if(M.viewport(K),M.scissor(ee),M.setScissorTest(Te),G){let pe=L.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+D,pe.__webglTexture,q)}else if(me){let pe=D;for(let Me=0;Me<x.textures.length;Me++){let Ee=L.get(x.textures[Me]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Me,Ee.__webglTexture,q,pe)}}else if(x!==null&&q!==0){let pe=L.get(x.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,pe.__webglTexture,q)}Q=-1};function _c(x){let D=L.get(x);if(D.__readFormat!==x.format||D.__readType!==x.type)D.__readFormat=x.format,D.__readType=x.type,D.__formatReadable=xt.textureFormatReadable(x.format),D.__typeReadable=xt.textureTypeReadable(x.type);return D}if(this.readRenderTargetPixels=function(x,D,q,H,G,me,ve,pe=0){if(!(x&&x.isWebGLRenderTarget)){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=L.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ve!==void 0)Me=Me[ve];if(Me){M.bindFramebuffer(N.FRAMEBUFFER,Me);try{let Ee=x.textures[pe],{format:Ge,type:Ze}=Ee;if(x.textures.length>1)N.readBuffer(N.COLOR_ATTACHMENT0+pe);let be=_c(Ee);if(be.__formatReadable===!1){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(be.__typeReadable===!1){Ue("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}if(D>=0&&D<=x.width-H&&(q>=0&&q<=x.height-G))N.readPixels(D,q,H,G,J.convert(Ge),J.convert(Ze),me)}finally{let Ee=z!==null?L.get(z).__webglFramebuffer:null;M.bindFramebuffer(N.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(x,D,q,H,G,me,ve,pe=0){if(!(x&&x.isWebGLRenderTarget))throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=L.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ve!==void 0)Me=Me[ve];if(Me)if(D>=0&&D<=x.width-H&&(q>=0&&q<=x.height-G)){M.bindFramebuffer(N.FRAMEBUFFER,Me);let Ee=x.textures[pe],{format:Ge,type:Ze}=Ee;if(x.textures.length>1)N.readBuffer(N.COLOR_ATTACHMENT0+pe);let be=_c(Ee);if(be.__formatReadable===!1)throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(be.__typeReadable===!1)throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let st=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,st),N.bufferData(N.PIXEL_PACK_BUFFER,me.byteLength,N.STREAM_READ),N.readPixels(D,q,H,G,J.convert(Ge),J.convert(Ze),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let bt=z!==null?L.get(z).__webglFramebuffer:null;M.bindFramebuffer(N.FRAMEBUFFER,bt);let pt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await eu(N,pt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,st),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,me),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(st),N.deleteSync(pt),me}else throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,D=null,q=0){let H=Math.pow(2,-q),G=Math.floor(x.image.width*H),me=Math.floor(x.image.height*H),ve=D!==null?D.x:0,pe=D!==null?D.y:0;X.setTexture2D(x,0),N.copyTexSubImage2D(N.TEXTURE_2D,q,0,0,ve,pe,G,me),M.unbindTexture()},this.copyTextureToTexture=function(x,D,q=null,H=null,G=0,me=0){let ve,pe,Me,Ee,Ge,Ze,be,st,bt,pt=x.isCompressedTexture?x.mipmaps[me]:x.image;if(q!==null)ve=q.max.x-q.min.x,pe=q.max.y-q.min.y,Me=q.isBox3?q.max.z-q.min.z:1,Ee=q.min.x,Ge=q.min.y,Ze=q.isBox3?q.min.z:0;else{let St=Math.pow(2,-G);if(ve=Math.floor(pt.width*St),pe=Math.floor(pt.height*St),x.isDataArrayTexture)Me=pt.depth;else if(x.isData3DTexture)Me=Math.floor(pt.depth*St);else Me=1;Ee=0,Ge=0,Ze=0}if(H!==null)be=H.x,st=H.y,bt=H.z;else be=0,st=0,bt=0;let ct=J.convert(D.format),Ut=J.convert(D.type),xe;if(D.isData3DTexture)X.setTexture3D(D,0),xe=N.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)X.setTexture2DArray(D,0),xe=N.TEXTURE_2D_ARRAY;else X.setTexture2D(D,0),xe=N.TEXTURE_2D;M.activeTexture(N.TEXTURE0),M.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,D.flipY),M.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),M.pixelStorei(N.UNPACK_ALIGNMENT,D.unpackAlignment);let Ht=M.getParameter(N.UNPACK_ROW_LENGTH),je=M.getParameter(N.UNPACK_IMAGE_HEIGHT),sn=M.getParameter(N.UNPACK_SKIP_PIXELS),Tn=M.getParameter(N.UNPACK_SKIP_ROWS),Jn=M.getParameter(N.UNPACK_SKIP_IMAGES);M.pixelStorei(N.UNPACK_ROW_LENGTH,pt.width),M.pixelStorei(N.UNPACK_IMAGE_HEIGHT,pt.height),M.pixelStorei(N.UNPACK_SKIP_PIXELS,Ee),M.pixelStorei(N.UNPACK_SKIP_ROWS,Ge),M.pixelStorei(N.UNPACK_SKIP_IMAGES,Ze);let Hi=x.isDataArrayTexture||x.isData3DTexture,lt=D.isDataArrayTexture||D.isData3DTexture;if(x.isDepthTexture){let St=L.get(x),$n=L.get(D),dt=L.get(St.__renderTarget),jn=L.get($n.__renderTarget);M.bindFramebuffer(N.READ_FRAMEBUFFER,dt.__webglFramebuffer),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,jn.__webglFramebuffer);for(let Gi=0;Gi<Me;Gi++){if(Hi)N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,L.get(x).__webglTexture,G,Ze+Gi),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,L.get(D).__webglTexture,me,bt+Gi);N.blitFramebuffer(Ee,Ge,ve,pe,be,st,ve,pe,N.DEPTH_BUFFER_BIT,N.NEAREST)}M.bindFramebuffer(N.READ_FRAMEBUFFER,null),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(G!==0||x.isRenderTargetTexture||L.has(x)){let St=L.get(x),$n=L.get(D);M.bindFramebuffer(N.READ_FRAMEBUFFER,k),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,A);for(let dt=0;dt<Me;dt++){if(Hi)N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,St.__webglTexture,G,Ze+dt);else N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,St.__webglTexture,G);if(lt)N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,$n.__webglTexture,me,bt+dt);else N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,$n.__webglTexture,me);if(G!==0)N.blitFramebuffer(Ee,Ge,ve,pe,be,st,ve,pe,N.COLOR_BUFFER_BIT,N.NEAREST);else if(lt)N.copyTexSubImage3D(xe,me,be,st,bt+dt,Ee,Ge,ve,pe);else N.copyTexSubImage2D(xe,me,be,st,Ee,Ge,ve,pe)}M.bindFramebuffer(N.READ_FRAMEBUFFER,null),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(lt)if(x.isDataTexture||x.isData3DTexture)N.texSubImage3D(xe,me,be,st,bt,ve,pe,Me,ct,Ut,pt.data);else if(D.isCompressedArrayTexture)N.compressedTexSubImage3D(xe,me,be,st,bt,ve,pe,Me,ct,pt.data);else N.texSubImage3D(xe,me,be,st,bt,ve,pe,Me,ct,Ut,pt);else if(x.isDataTexture)N.texSubImage2D(N.TEXTURE_2D,me,be,st,ve,pe,ct,Ut,pt.data);else if(x.isCompressedTexture)N.compressedTexSubImage2D(N.TEXTURE_2D,me,be,st,pt.width,pt.height,ct,pt.data);else N.texSubImage2D(N.TEXTURE_2D,me,be,st,ve,pe,ct,Ut,pt);if(M.pixelStorei(N.UNPACK_ROW_LENGTH,Ht),M.pixelStorei(N.UNPACK_IMAGE_HEIGHT,je),M.pixelStorei(N.UNPACK_SKIP_PIXELS,sn),M.pixelStorei(N.UNPACK_SKIP_ROWS,Tn),M.pixelStorei(N.UNPACK_SKIP_IMAGES,Jn),me===0&&D.generateMipmaps)N.generateMipmap(xe);M.unbindTexture()},this.initRenderTarget=function(x){if(L.get(x).__webglFramebuffer===void 0)X.setupRenderTarget(x)},this.initTexture=function(x){if(x.isCubeTexture)X.setTextureCube(x,0);else if(x.isData3DTexture)X.setTexture3D(x,0);else if(x.isDataArrayTexture||x.isCompressedArrayTexture)X.setTexture2DArray(x,0);else X.setTexture2D(x,0);M.unbindTexture()},this.resetState=function(){F=0,V=0,z=null,M.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return al}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}var qu=localStorage.getItem("ct_sid")||"";function yn(){return qu}function Hl(e){if(qu=e,e)localStorage.setItem("ct_sid",e);else localStorage.removeItem("ct_sid")}async function pi(e,t){let n=await fetch(e,{method:t?"POST":"GET",headers:{"Content-Type":"application/json"},body:t?JSON.stringify(t):void 0}),i=null;try{i=await n.json()}catch{}if(!n.ok){let s=i?.error||"http-"+n.status;throw Object.assign(Error(s),{code:n.status})}return i}function Sn(e){return Math.round(e).toLocaleString("ru-RU")}var Z_={"no-money":"не хватает монет",cooldown:"перемотай чуть позже","bad-nick":"ник: 2–20 символов, буквы/цифры/пробел","bad-pass":"пароль: 4–60 символов",taken:"такой ник уже занят","no-such-user":"нет такого ника","no-session":"сессия кончилась — войди снова","inv-full":"инвентарь полон","own-lot":"это твой лот",gone:"лот уже купили",blocked:"там уже есть клетка","too-many":"слишком много попыток, подожди минуту"};function lr(e){let t=e.message||"";if(e.code===401&&t==="bad-pass")return"неверный пароль";return Z_[t]||t}function wa(e){return{common:"обычный",rare:"редкий",epic:"эпик",legendary:"ЛЕГЕНДА"}[e]||e}function Gl(e,t){if(t===nl)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),e;if(t===fs||t===Gs){let n=e.getIndex();if(n===null){let r=[],a=e.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);e.setIndex(r),n=e.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),e}let i=n.count-2,s=[];if(t===fs)for(let r=1;r<=i;r++)s.push(n.getX(0)),s.push(n.getX(r)),s.push(n.getX(r+1));else for(let r=0;r<i;r++)if(r%2===0)s.push(n.getX(r)),s.push(n.getX(r+1)),s.push(n.getX(r+2));else s.push(n.getX(r+2)),s.push(n.getX(r+1)),s.push(n.getX(r));if(s.length/3!==i)console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");return e.setIndex(s),e.clearGroups(),e}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),e}function Yu(e){let t=new Map,n=new Map,i=e.clone();return Zu(e,i,function(s,r){t.set(r,s),n.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=t.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return n.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),i}function Zu(e,t,n){n(e,t);for(let i=0;i<e.children.length;i++)Zu(e.children[i],t.children[i],n)}class Kl extends Kn{constructor(e){super(e);this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new nd(t)}),this.register(function(t){return new id(t)}),this.register(function(t){return new dd(t)}),this.register(function(t){return new fd(t)}),this.register(function(t){return new pd(t)}),this.register(function(t){return new rd(t)}),this.register(function(t){return new ad(t)}),this.register(function(t){return new od(t)}),this.register(function(t){return new ld(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new cd(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new ud(t)}),this.register(function(t){return new hd(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new ql(t,Ye.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new ql(t,Ye.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new md(t)})}load(e,t,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let l=fi.extractUrlBase(e);r=fi.resolveURL(l,this.path)}else r=fi.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){if(i)i(l);else console.error(l);s.manager.itemError(e),s.manager.itemEnd(e)},o=new nr(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){try{s.parse(l,r,function(c){t(c),s.manager.itemEnd(e)},a)}catch(c){a(c)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){if(this.pluginCallbacks.indexOf(e)===-1)this.pluginCallbacks.push(e);return this}unregister(e){if(this.pluginCallbacks.indexOf(e)!==-1)this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1);return this}parse(e,t,n,i){let s,r={},a={},o=new TextDecoder;if(typeof e==="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(o.decode(new Uint8Array(e,0,4))===gd){try{r[Ye.KHR_BINARY_GLTF]=new _d(e)}catch(h){if(i)i(h);return}s=JSON.parse(r[Ye.KHR_BINARY_GLTF].content)}else s=JSON.parse(o.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){if(i)i(Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new Md(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){let h=this.pluginCallbacks[c](l);if(!h.name)console.error("THREE.GLTFLoader: Invalid plugin found: missing name");a[h.name]=h,r[h.name]=!0}if(s.extensionsUsed)for(let c=0;c<s.extensionsUsed.length;++c){let h=s.extensionsUsed[c],d=s.extensionsRequired||[];switch(h){case Ye.KHR_MATERIALS_UNLIT:r[h]=new ed;break;case Ye.KHR_DRACO_MESH_COMPRESSION:r[h]=new xd(s,this.dracoLoader);break;case Ye.KHR_TEXTURE_TRANSFORM:r[h]=new vd;break;case Ye.KHR_MESH_QUANTIZATION:r[h]=new yd;break;default:if(d.indexOf(h)>=0&&a[h]===void 0)console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(r),l.setPlugins(a),l.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function K_(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}function Mt(e,t,n){let i=e.json.materials[t];if(i.extensions&&i.extensions[n])return i.extensions[n];return null}var Ye={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Qu{constructor(e){this.parser=e,this.name=Ye.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];if(s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0)e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,o=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],l,c=new Le(16777215);if(o.color!==void 0)c.setRGB(o.color[0],o.color[1],o.color[2],Jt);let h=o.range!==void 0?o.range:0;switch(o.type){case"directional":l=new va(c),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new xs(c),l.distance=h;break;case"spot":l=new xa(c),l.distance=h,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,l.angle=o.spot.outerConeAngle,l.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}if(l.position.set(0,0,0),Un(l,o),o.intensity!==void 0)l.intensity=o.intensity;return l.name=t.createUniqueName(o.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e!=="light")return;return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;if(a===void 0)return null;return this._loadLight(a).then(function(o){return n._getNodeRef(t.cache,a,o)})}}class ed{constructor(){this.name=Ye.KHR_MATERIALS_UNLIT}getMaterialType(){return ln}extendParams(e,t,n){let i=[];e.color=new Le(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],Jt),e.opacity=r[3]}if(s.baseColorTexture!==void 0)i.push(n.assignTexture(e,"map",s.baseColorTexture,li))}return Promise.all(i)}}class td{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();if(n.emissiveStrength!==void 0)t.emissiveIntensity=n.emissiveStrength;return Promise.resolve()}}class nd{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0)t.clearcoat=n.clearcoatFactor;if(n.clearcoatTexture!==void 0)i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture));if(n.clearcoatRoughnessFactor!==void 0)t.clearcoatRoughness=n.clearcoatRoughnessFactor;if(n.clearcoatRoughnessTexture!==void 0)i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture));if(n.clearcoatNormalTexture!==void 0){if(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Fe(s,s)}}return Promise.all(i)}}class id{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();return t.dispersion=n.dispersion!==void 0?n.dispersion:0,Promise.resolve()}}class sd{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.iridescenceFactor!==void 0)t.iridescence=n.iridescenceFactor;if(n.iridescenceTexture!==void 0)i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture));if(n.iridescenceIor!==void 0)t.iridescenceIOR=n.iridescenceIor;if(t.iridescenceThicknessRange===void 0)t.iridescenceThicknessRange=[100,400];if(n.iridescenceThicknessMinimum!==void 0)t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum;if(n.iridescenceThicknessMaximum!==void 0)t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum;if(n.iridescenceThicknessTexture!==void 0)i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture));return Promise.all(i)}}class rd{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_SHEEN}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new Le(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],Jt)}if(n.sheenRoughnessFactor!==void 0)t.sheenRoughness=n.sheenRoughnessFactor;if(n.sheenColorTexture!==void 0)i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,li));if(n.sheenRoughnessTexture!==void 0)i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture));return Promise.all(i)}}class ad{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.transmissionFactor!==void 0)t.transmission=n.transmissionFactor;if(n.transmissionTexture!==void 0)i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture));return Promise.all(i)}}class od{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_VOLUME}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0)i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture));t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Le().setRGB(s[0],s[1],s[2],Jt),Promise.all(i)}}class ld{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_IOR}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();if(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0)t.ior=1000;return Promise.resolve()}}class cd{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0)i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];if(t.specularColor=new Le().setRGB(s[0],s[1],s[2],Jt),n.specularColorTexture!==void 0)i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,li));return Promise.all(i)}}class hd{constructor(e){this.parser=e,this.name=Ye.EXT_MATERIALS_BUMP}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0)i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture));return Promise.all(i)}}class ud{constructor(e){this.parser=e,this.name=Ye.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Mt(this.parser,e,this.name)!==null?en:null}extendMaterialParams(e,t){let n=Mt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.anisotropyStrength!==void 0)t.anisotropy=n.anisotropyStrength;if(n.anisotropyRotation!==void 0)t.anisotropyRotation=n.anisotropyRotation;if(n.anisotropyTexture!==void 0)i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture));return Promise.all(i)}}class dd{constructor(e){this.parser=e,this.name=Ye.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=t.options.ktx2Loader;if(!r)if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");else return null;return t.loadTextureImage(e,s.source,r)}}class fd{constructor(e){this.parser=e,this.name=Ye.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);if(l!==null)o=l}return n.loadTextureImage(e,r.source,o)}}class pd{constructor(e){this.parser=e,this.name=Ye.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);if(l!==null)o=l}return n.loadTextureImage(e,r.source,o)}}class ql{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported)if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");else return null;return s.then(function(a){let o=i.byteOffset||0,l=i.byteLength||0,{count:c,byteStride:h}=i,d=new Uint8Array(a,o,l);if(r.decodeGltfBufferAsync)return r.decodeGltfBufferAsync(c,h,d,i.mode,i.filter).then(function(u){return u.buffer});else return r.ready.then(function(){let u=new ArrayBuffer(c*h);return r.decodeGltfBuffer(new Uint8Array(u),c,h,d,i.mode,i.filter),u})})}else return null}}class md{constructor(e){this.name=Ye.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let l of i.primitives)if(l.mode!==hn.TRIANGLES&&l.mode!==hn.TRIANGLE_STRIP&&l.mode!==hn.TRIANGLE_FAN&&l.mode!==void 0)return null;let r=n.extensions[this.name].attributes,a=[],o={};for(let l in r)a.push(this.parser.getDependency("accessor",r[l]).then((c)=>(o[l]=c,o[l])));if(a.length<1)return null;return a.push(this.parser.createNodeMesh(e)),Promise.all(a).then((l)=>{let c=l.pop(),h=c.isGroup?c.children:[c],d=l[0].count,u=[];for(let p of h){let _=new Be,S=new B,m=new on,f=new B(1,1,1),w=new oa(p.geometry,p.material,d);for(let y=0;y<d;y++){if(o.TRANSLATION)S.fromBufferAttribute(o.TRANSLATION,y);if(o.ROTATION)m.fromBufferAttribute(o.ROTATION,y);if(o.SCALE)f.fromBufferAttribute(o.SCALE,y);w.setMatrixAt(y,_.compose(S,m,f))}let I=null;for(let y in o)if(y==="_COLOR_0"){let b=o[y];w.instanceColor=new ri(b.array,b.itemSize,b.normalized)}else if(y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"){if(I===null){let E=w.geometry;I=new Ct,I.name=E.name;for(let R in E.attributes)I.setAttribute(R,E.attributes[R]);for(let R in E.morphAttributes)I.morphAttributes[R]=E.morphAttributes[R];if(E.index!==null)I.setIndex(E.index);I.morphTargetsRelative=E.morphTargetsRelative;for(let R of E.groups)I.addGroup(R.start,R.count,R.materialIndex);if(E.boundingBox!==null)I.boundingBox=E.boundingBox.clone();if(E.boundingSphere!==null)I.boundingSphere=E.boundingSphere.clone();I.drawRange.start=E.drawRange.start,I.drawRange.count=E.drawRange.count,I.userData=Object.assign({},E.userData),w.geometry=I}let b=o[y];I.setAttribute(y,new ri(b.array,b.itemSize,b.normalized))}ft.prototype.copy.call(w,p),this.parser.assignFinalMaterial(w),u.push(w)}if(c.isGroup)return c.clear(),c.add(...u),c;return u[0]})}}var gd="glTF",cr=12,Ku={JSON:1313821514,BIN:5130562};class _d{constructor(e){this.name=Ye.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,cr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==gd)throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");else if(this.header.version<2)throw Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-cr,s=new DataView(e,cr),r=0;while(r<i){let a=s.getUint32(r,!0);r+=4;let o=s.getUint32(r,!0);if(r+=4,o===Ku.JSON){let l=new Uint8Array(e,cr+r,a);this.content=n.decode(l)}else if(o===Ku.BIN){let l=cr+r;this.body=e.slice(l,l+a)}r+=a}if(this.content===null)throw Error("THREE.GLTFLoader: JSON content not found.")}}class xd{constructor(e,t){if(!t)throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ye.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,a={},o={},l={};for(let c in r){let h=Yl[c]||c.toLowerCase();a[h]=r[c]}for(let c in e.attributes){let h=Yl[c]||c.toLowerCase();if(r[c]!==void 0){let d=n.accessors[e.attributes[c]],u=Ms[d.componentType];l[h]=u.name,o[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(c){return new Promise(function(h,d){i.decodeDracoFile(c,function(u){for(let p in u.attributes){let _=u.attributes[p],S=o[p];if(S!==void 0)_.normalized=S}h(u)},a,l,Jt,d)})})}}class vd{constructor(){this.name=Ye.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0)e.channel=t.texCoord;if(t.offset!==void 0)e.offset.fromArray(t.offset);if(t.rotation!==void 0)e.rotation=t.rotation;if(t.scale!==void 0)e.repeat.fromArray(t.scale);if(t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class yd{constructor(){this.name=Ye.KHR_MESH_QUANTIZATION}}class Jl extends Zn{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)t[r]=n[s+r];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=a*2,l=a*3,c=i-t,h=(n-t)/c,d=h*h,u=d*h,p=e*l,_=p-l,S=-2*u+3*d,m=u-d,f=1-S,w=m-d+h;for(let I=0;I!==a;I++){let y=r[_+I+a],b=r[_+I+o]*c,E=r[p+I+a],R=r[p+I]*c;s[I]=f*y+w*b+S*E+m*R}return s}}var J_=new on;class Sd extends Jl{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return J_.fromArray(s).normalize().toArray(s),s}}var hn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ms={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ju={9728:xn,9729:Dt,9984:qr,9985:us,9986:Ei,9987:Cn},$u={33071:hs,33648:Xr,10497:cs},Vl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Yl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},mi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},$_={CUBICSPLINE:void 0,LINEAR:Qr,STEP:tl},Wl={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function j_(e){if(e.DefaultMaterial===void 0)e.DefaultMaterial=new _s({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ai});return e.DefaultMaterial}function Bi(e,t,n){for(let i in n.extensions)if(e[i]===void 0)t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[i]=n.extensions[i]}function Un(e,t){if(t.extras!==void 0)if(typeof t.extras==="object")Object.assign(e.userData,t.extras);else console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras)}function Q_(e,t,n){let i=!1,s=!1,r=!1;for(let c=0,h=t.length;c<h;c++){let d=t[c];if(d.POSITION!==void 0)i=!0;if(d.NORMAL!==void 0)s=!0;if(d.COLOR_0!==void 0)r=!0;if(i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(e);let a=[],o=[],l=[];for(let c=0,h=t.length;c<h;c++){let d=t[c];if(i){let u=d.POSITION!==void 0?n.getDependency("accessor",d.POSITION):e.attributes.position;a.push(u)}if(s){let u=d.NORMAL!==void 0?n.getDependency("accessor",d.NORMAL):e.attributes.normal;o.push(u)}if(r){let u=d.COLOR_0!==void 0?n.getDependency("accessor",d.COLOR_0):e.attributes.color;l.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],d=c[1],u=c[2];if(i)e.morphAttributes.position=h;if(s)e.morphAttributes.normal=d;if(r)e.morphAttributes.color=u;return e.morphTargetsRelative=!0,e})}function ex(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,i=t.weights.length;n<i;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let i=0,s=n.length;i<s;i++)e.morphTargetDictionary[n[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function tx(e){let t,n=e.extensions&&e.extensions[Ye.KHR_DRACO_MESH_COMPRESSION];if(n)t="draco:"+n.bufferView+":"+n.indices+":"+Xl(n.attributes);else t=e.indices+":"+Xl(e.attributes)+":"+e.mode;if(e.targets!==void 0)for(let i=0,s=e.targets.length;i<s;i++)t+=":"+Xl(e.targets[i]);return t}function Xl(e){let t="",n=Object.keys(e).sort();for(let i=0,s=n.length;i<s;i++)t+=n[i]+":"+e[n[i]]+";";return t}function Zl(e){switch(e){case Int8Array:return 0.007874015748031496;case Uint8Array:return 0.00392156862745098;case Int16Array:return 0.00003051850947599719;case Uint16Array:return 0.000015259021896696422;default:throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function nx(e){if(e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0)return"image/jpeg";if(e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0)return"image/webp";if(e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0)return"image/ktx2";return"image/png"}var ix=new Be;class Md{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new K_,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let o=a.match(/Version\/(\d+)/);i=n&&o?parseInt(o[1],10):-1,s=a.indexOf("Firefox")>-1,r=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}if(typeof createImageBitmap>"u"||n&&i<17||s&&r<98)this.textureLoader=new ma(this.options.manager);else this.textureLoader=new Sa(this.options.manager);if(this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new nr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials")this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let a={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return Bi(s,a,i),Un(a,i),Promise.all(n._invokeAll(function(o){return o.afterRoot&&o.afterRoot(a)})).then(function(){for(let o of a.scenes)o.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i].joints;for(let a=0,o=r.length;a<o;a++)e[r[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];if(r.mesh!==void 0){if(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0)n[r.mesh].isSkinnedMesh=!0}if(r.camera!==void 0)this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){if(t===void 0)return;if(e.refs[t]===void 0)e.refs[t]=e.uses[t]=0;e.refs[t]++}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(r,a)=>{let o=this.associations.get(r);if(o!=null)this.associations.set(a,o);for(let[l,c]of r.children.entries())s(c,a.children[l])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);if(s)n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ye.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(fi.resolveURL(t.uri,i.path),s,void 0,function(){r(Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=Vl[i.type],a=Ms[i.componentType],o=i.normalized===!0,l=new a(i.count*r);return Promise.resolve(new Nt(l,r,o))}let s=[];if(i.bufferView!==void 0)s.push(this.getDependency("bufferView",i.bufferView));else s.push(null);if(i.sparse!==void 0)s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView));return Promise.all(s).then(function(r){let a=r[0],o=Vl[i.type],l=Ms[i.componentType],c=l.BYTES_PER_ELEMENT,h=c*o,d=i.byteOffset||0,u=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,_,S;if(u&&u!==h){let m=Math.floor(d/u),f="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count,w=t.cache.get(f);if(!w)_=new l(a,m*u,i.count*u/c),w=new Ys(_,u/c),t.cache.add(f,w);S=new ps(w,o,d%u/c,p)}else{if(a===null)_=new l(i.count*o);else _=new l(a,d,i.count*o);S=new Nt(_,o,p)}if(i.sparse!==void 0){let m=Vl.SCALAR,f=Ms[i.sparse.indices.componentType],w=i.sparse.indices.byteOffset||0,I=i.sparse.values.byteOffset||0,y=new f(r[1],w,i.sparse.count*m),b=new l(r[2],I,i.sparse.count*o);if(a!==null)S=new Nt(S.array.slice(),S.itemSize,S.normalized);S.normalized=!1;for(let E=0,R=y.length;E<R;E++){let v=y[E];if(S.setX(v,b[E*o]),o>=2)S.setY(v,b[E*o+1]);if(o>=3)S.setZ(v,b[E*o+2]);if(o>=4)S.setW(v,b[E*o+3]);if(o>=5)throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}S.normalized=p}return S})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,r=t.images[s],a=this.textureLoader;if(r.uri){let o=n.manager.getHandler(r.uri);if(o!==null)a=o}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){let i=this,s=this.json,r=s.textures[e],a=s.images[t],o=(a.uri||a.bufferView)+":"+r.sampler;if(this.textureCache[o])return this.textureCache[o];let l=this.loadImageSource(t,n).then(function(c){if(c.flipY=!1,c.name=r.name||a.name||"",c.name===""&&typeof a.uri==="string"&&a.uri.startsWith("data:image/")===!1)c.name=a.uri;let d=(s.samplers||{})[r.sampler]||{};return c.magFilter=Ju[d.magFilter]||Dt,c.minFilter=Ju[d.minFilter]||Cn,c.wrapS=$u[d.wrapS]||cs,c.wrapT=$u[d.wrapT]||cs,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==xn&&c.minFilter!==Dt,i.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[o]=l,l}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then((h)=>h.clone());let r=i.images[e],a=self.URL||self.webkitURL,o=r.uri||"",l=!1;if(r.bufferView!==void 0)o=n.getDependency("bufferView",r.bufferView).then(function(h){l=!0;let d=new Blob([h],{type:r.mimeType});return o=a.createObjectURL(d),o});else if(r.uri===void 0)throw Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let c=Promise.resolve(o).then(function(h){return new Promise(function(d,u){let p=d;if(t.isImageBitmapLoader===!0)p=function(_){let S=new Et(_);S.needsUpdate=!0,d(S)};t.load(fi.resolveURL(h,s.path),p,void 0,u)})}).then(function(h){if(l===!0)a.revokeObjectURL(o);return Un(h,r),h.userData.mimeType=r.mimeType||nx(r.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),h});return this.sourceCache[e]=c,c}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0)r=r.clone(),r.channel=n.texCoord;if(s.extensions[Ye.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[Ye.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let o=s.associations.get(r);r=s.extensions[Ye.KHR_TEXTURE_TRANSFORM].extendTexture(r,a),s.associations.set(r,o)}}if(i!==void 0)r.colorSpace=i;return e[t]=r,r})}assignFinalMaterial(e){let{geometry:t,material:n}=e,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,o=this.cache.get(a);if(!o)o=new Qs,Qt.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,o.sizeAttenuation=!1,this.cache.add(a,o);n=o}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,o=this.cache.get(a);if(!o)o=new js,Qt.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,this.cache.add(a,o);n=o}if(i||s||r){let a="ClonedMaterial:"+n.uuid+":";if(i)a+="derivative-tangents:";if(s)a+="vertex-colors:";if(r)a+="flat-shading:";let o=this.cache.get(a);if(!o){if(o=n.clone(),s)o.vertexColors=!0;if(r)o.flatShading=!0;if(i){if(o.normalScale)o.normalScale.y*=-1;if(o.clearcoatNormalScale)o.clearcoatNormalScale.y*=-1}this.cache.add(a,o),this.associations.set(o,this.associations.get(n))}n=o}e.material=n}getMaterialType(){return _s}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],r,a={},o=s.extensions||{},l=[];if(o[Ye.KHR_MATERIALS_UNLIT]){let h=i[Ye.KHR_MATERIALS_UNLIT];r=h.getMaterialType(),l.push(h.extendParams(a,s,t))}else{let h=s.pbrMetallicRoughness||{};if(a.color=new Le(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Jt),a.opacity=d[3]}if(h.baseColorTexture!==void 0)l.push(t.assignTexture(a,"map",h.baseColorTexture,li));if(a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0)l.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture));r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}if(s.doubleSided===!0)a.side=Bt;let c=s.alphaMode||Wl.OPAQUE;if(c===Wl.BLEND)a.transparent=!0,a.depthWrite=!1;else if(a.transparent=!1,c===Wl.MASK)a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:0.5;if(s.normalTexture!==void 0&&r!==ln){if(l.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new Fe(1,1),s.normalTexture.scale!==void 0){let h=s.normalTexture.scale;a.normalScale.set(h,h)}}if(s.occlusionTexture!==void 0&&r!==ln){if(l.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0)a.aoMapIntensity=s.occlusionTexture.strength}if(s.emissiveFactor!==void 0&&r!==ln){let h=s.emissiveFactor;a.emissive=new Le().setRGB(h[0],h[1],h[2],Jt)}if(s.emissiveTexture!==void 0&&r!==ln)l.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,li));return Promise.all(l).then(function(){let h=new r(a);if(s.name)h.name=s.name;if(Un(h,s),t.associations.set(h,{materials:e}),s.extensions)Bi(i,h,s);return h})}createUniqueName(e){let t=tt.sanitizeNodeName(e||"");if(t in this.nodeNamesUsed)return t+"_"+ ++this.nodeNamesUsed[t];else return this.nodeNamesUsed[t]=0,t}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[Ye.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(o){return ju(o,a,t)})}let r=[];for(let a=0,o=e.length;a<o;a++){let l=e[a],c=tx(l),h=i[c];if(h)r.push(h.promise);else{let d;if(l.extensions&&l.extensions[Ye.KHR_DRACO_MESH_COMPRESSION])d=s(l);else d=ju(new Ct,l,t);if(l.mode===hn.TRIANGLE_STRIP)d=d.then((u)=>Gl(u,Gs));else if(l.mode===hn.TRIANGLE_FAN)d=d.then((u)=>Gl(u,fs));i[c]={primitive:l,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,a=[];for(let o=0,l=r.length;o<l;o++){let c=r[o].material===void 0?j_(this.cache):this.getDependency("material",r[o].material);a.push(c)}return a.push(t.loadGeometries(r)),Promise.all(a).then(async function(o){let l=o.slice(0,o.length-1),c=o[o.length-1],h=[];for(let u=0,p=c.length;u<p;u++){let _=c[u],S=r[u],m,f=l[u];if(S.mode===hn.TRIANGLES||S.mode===hn.TRIANGLE_STRIP||S.mode===hn.TRIANGLE_FAN||S.mode===void 0){let w=s.isSkinnedMesh===!0,I=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");if(w&&I===!1)console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled.");if(m=w&&I?new aa(_,f):new vt(_,f),m.isSkinnedMesh===!0)m.normalizeSkinWeights()}else if(S.mode===hn.LINES)m=new la(_,f);else if(S.mode===hn.LINE_STRIP)m=new ms(_,f);else if(S.mode===hn.LINE_LOOP)m=new ca(_,f);else if(S.mode===hn.POINTS)m=new ha(_,f);else throw Error("THREE.GLTFLoader: Primitive mode unsupported: "+S.mode);if(Object.keys(m.geometry.morphAttributes).length>0)ex(m,s);if(m.name=t.createUniqueName(s.name||"mesh_"+e),Un(m,s),S.extensions)Bi(i,m,S);t.assignFinalMaterial(m),h.push(m)}for(let u=0,p=h.length;u<p;u++)t.associations.set(h[u],{meshes:e,primitives:u});if(h.length===1){if(s.extensions)Bi(i,h[0],s);return h[0]}let d=new Kt;if(s.extensions)Bi(i,d,s);t.associations.set(d,{meshes:e});for(let u=0,p=h.length;u<p;u++)d.add(h[u]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}if(n.type==="perspective")t=new Rt(Ln.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2000000);else if(n.type==="orthographic")t=new Ui(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar);if(n.name)t.name=this.createUniqueName(n.name);return Un(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));if(t.inverseBindMatrices!==void 0)n.push(this.getDependency("accessor",t.inverseBindMatrices));else n.push(null);return Promise.all(n).then(function(i){let s=i.pop(),r=i,a=[],o=[];for(let l=0,c=r.length;l<c;l++){let h=r[l];if(h){a.push(h);let d=new Be;if(s!==null)d.fromArray(s.array,l*16);o.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Js(a,o)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,r=[],a=[],o=[],l=[],c=[];for(let h=0,d=i.channels.length;h<d;h++){let u=i.channels[h],p=i.samplers[u.sampler],_=u.target,S=_.node,m=i.parameters!==void 0?i.parameters[p.input]:p.input,f=i.parameters!==void 0?i.parameters[p.output]:p.output;if(_.node===void 0)continue;r.push(this.getDependency("node",S)),a.push(this.getDependency("accessor",m)),o.push(this.getDependency("accessor",f)),l.push(p),c.push(_)}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c)]).then(function(h){let d=h[0],u=h[1],p=h[2],_=h[3],S=h[4],m=[];for(let w=0,I=d.length;w<I;w++){let y=d[w],b=u[w],E=p[w],R=_[w],v=S[w];if(y===void 0)continue;if(y.updateMatrix)y.updateMatrix();let T=n._createAnimationTracks(y,b,E,R,v);if(T)for(let O=0;O<T.length;O++)m.push(T[O])}let f=new pa(s,void 0,m);return Un(f,i),f})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];if(i.mesh===void 0)return null;return n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);if(i.weights!==void 0)r.traverse(function(a){if(!a.isMesh)return;for(let o=0,l=i.weights.length;o<l;o++)a.morphTargetInfluences[o]=i.weights[o]});return r})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),r=[],a=i.children||[];for(let l=0,c=a.length;l<c;l++)r.push(n.getDependency("node",a[l]));let o=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),o]).then(function(l){let c=l[0],h=l[1],d=l[2];if(d!==null)c.traverse(function(u){if(!u.isSkinnedMesh)return;u.bind(d,ix)});for(let u=0,p=h.length;u<p;u++)c.add(h[u]);if(c.userData.pivot!==void 0&&h.length>0){let u=c.userData.pivot,p=h[0];c.pivot=new B().fromArray(u),c.position.x-=u[0],c.position.y-=u[1],c.position.z-=u[2],p.position.set(0,0,0),delete c.userData.pivot}return c})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],r=s.name?i.createUniqueName(s.name):"",a=[],o=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});if(o)a.push(o);if(s.camera!==void 0)a.push(i.getDependency("camera",s.camera).then(function(l){return i._getNodeRef(i.cameraCache,s.camera,l)}));return i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let c;if(s.isBone===!0)c=new Zs;else if(l.length>1)c=new Kt;else if(l.length===1)c=l[0];else c=new ft;if(c!==l[0])for(let h=0,d=l.length;h<d;h++)c.add(l[h]);if(s.name)c.userData.name=s.name,c.name=r;if(Un(c,s),s.extensions)Bi(n,c,s);if(s.matrix!==void 0){let h=new Be;h.fromArray(s.matrix),c.applyMatrix4(h)}else{if(s.translation!==void 0)c.position.fromArray(s.translation);if(s.rotation!==void 0)c.quaternion.fromArray(s.rotation);if(s.scale!==void 0)c.scale.fromArray(s.scale)}if(!i.associations.has(c))i.associations.set(c,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let h=i.associations.get(c);i.associations.set(c,{...h})}return i.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new Kt;if(n.name)s.name=i.createUniqueName(n.name);if(Un(s,n),n.extensions)Bi(t,s,n);let r=n.nodes||[],a=[];for(let o=0,l=r.length;o<l;o++)a.push(i.getDependency("node",r[o]));return Promise.all(a).then(function(o){for(let c=0,h=o.length;c<h;c++){let d=o[c];if(d.parent!==null)s.add(Yu(d));else s.add(d)}let l=(c)=>{let h=new Map;for(let[d,u]of i.associations)if(d instanceof Qt||d instanceof Et)h.set(d,u);return c.traverse((d)=>{let u=i.associations.get(d);if(u!=null)h.set(d,u)}),h};return i.associations=l(s),s})}_createAnimationTracks(e,t,n,i,s){let r=[],a=e.name?e.name:e.uuid,o=[];function l(u){if(u.morphTargetInfluences)o.push(u.name?u.name:u.uuid)}if(mi[s.path]===mi.weights){if(l(e),e.isGroup)e.children.forEach(l)}else o.push(a);let c;switch(mi[s.path]){case mi.weights:c=hi;break;case mi.rotation:c=ui;break;case mi.translation:case mi.scale:c=Ni;break;default:switch(n.itemSize){case 1:c=hi;break;case 2:case 3:default:c=Ni;break}break}let h=i.interpolation!==void 0?$_[i.interpolation]:Qr,d=this._getArrayFromAccessor(n);for(let u=0,p=o.length;u<p;u++){let _=new c(o[u]+"."+mi[s.path],t.array,d,h);if(i.interpolation==="CUBICSPLINE")this._createCubicSplineTrackInterpolant(_);r.push(_)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Zl(t.constructor),i=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){return new(this instanceof ui?Sd:Jl)(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function sx(e,t,n){let i=t.attributes,s=new Vt;if(i.POSITION!==void 0){let o=n.json.accessors[i.POSITION],{min:l,max:c}=o;if(l!==void 0&&c!==void 0){if(s.set(new B(l[0],l[1],l[2]),new B(c[0],c[1],c[2])),o.normalized){let h=Zl(Ms[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=t.targets;if(r!==void 0){let o=new B,l=new B;for(let c=0,h=r.length;c<h;c++){let d=r[c];if(d.POSITION!==void 0){let u=n.json.accessors[d.POSITION],{min:p,max:_}=u;if(p!==void 0&&_!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(_[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(_[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(_[2]))),u.normalized){let S=Zl(Ms[u.componentType]);l.multiplyScalar(S)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}e.boundingBox=s;let a=new jt;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,e.boundingSphere=a}function ju(e,t,n){let i=t.attributes,s=[];function r(a,o){return n.getDependency("accessor",a).then(function(l){e.setAttribute(o,l)})}for(let a in i){let o=Yl[a]||a.toLowerCase();if(o in e.attributes)continue;s.push(r(i[a],o))}if(t.indices!==void 0&&!e.index){let a=n.getDependency("accessor",t.indices).then(function(o){e.setIndex(o)});s.push(a)}if(Xe.workingColorSpace!==Jt&&"COLOR_0"in i)console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Xe.workingColorSpace}" not supported.`);return Un(e,t),sx(e,t,n),Promise.all(s).then(function(){return t.targets!==void 0?Q_(e,t.targets,n):e})}var $l={tex:2,refl:1,light:2,res:2,fps:0,draw:2},bd=[0.5,0.75,1],Aa=[14,20,26];var gi={...$l};try{let e=localStorage.getItem("ctgfx");if(e)gi={...$l,...JSON.parse(e)}}catch{gi={...$l}}var Td=[],jl=()=>gi;function Ed(e){Td.push(e)}function rx(e){gi={...gi,...e};try{localStorage.setItem("ctgfx",JSON.stringify(gi))}catch{}for(let t of Td)t(gi)}var ax=[{key:"tex",label:"Качество текстур",note:"меньше — быстрее грузится и меньше память",opts:[["низк",0],["сред",1],["выс",2]]},{key:"refl",label:"Отражения",note:"глянцевые блики на полу и керамике",opts:[["выкл",0],["вкл",1]]},{key:"light",label:"Освещение",note:"лампы в клетках: больше ламп — больше нагрузка",opts:[["низк",0],["сред",1],["выс",2]]},{key:"res",label:"Разрешение",note:"масштаб картинки 3D-сцены",opts:[["50%",0],["75%",1],["100%",2]]},{key:"fps",label:"Лимит FPS",note:"экономит батарею и охлаждение",opts:[["30",30],["60",60],["нет",0]]},{key:"draw",label:"Дальность видимости",note:"дальше стены растворяются в тумане",opts:[["14м",0],["20м",1],["26м",2]]}],bs=null,Ra=!1,wd=[];function Ad(e){wd.push(e)}var Ca=()=>Ra;function ox(){if(!bs)return;let e=bs.querySelector("#gfxRows");if(!e)return;e.innerHTML="";for(let t of ax){let n=document.createElement("div");n.className="gfxRow",n.innerHTML=`<span class="gfxLabel">${t.label}<small>${t.note}</small></span>`;let i=document.createElement("span");i.className="gfxOpts";for(let[s,r]of t.opts){let a=document.createElement("button");a.className="gfxOpt"+(gi[t.key]===r?" on":""),a.textContent=s,a.onclick=()=>rx({[t.key]:r}),i.appendChild(a)}n.appendChild(i),e.appendChild(n)}}function hr(e){if(Ra=e,bs?.classList.toggle("hidden",!e),e)ox();for(let t of wd)t(e)}function Rd(){hr(!Ra)}function Cd(){if(Ra)hr(!1)}function Id(){bs=document.getElementById("gfx"),document.querySelectorAll(".gfxBtn").forEach((e)=>e.addEventListener("click",()=>hr(!0))),document.getElementById("gfxClose")?.addEventListener("click",()=>hr(!1)),bs?.addEventListener("click",(e)=>{if(e.target===bs)hr(!1)})}var nn=2;var lx=1.3,cx=2.2,Pd=5,Ld=6,hx=1.1,Nd=[{dir:"n",dx:0,dz:-1},{dir:"s",dx:0,dz:1},{dir:"e",dx:1,dz:0},{dir:"w",dx:-1,dz:0}];function ux(e){let t=e.getAttribute("position"),n=e.getAttribute("uv"),i=e.getAttribute("uv1"),s=e.getAttribute("normal"),r=[1/0,1/0,1/0],a=[-1/0,-1/0,-1/0];for(let b=0;b<t.count;b++){let E=[t.getX(b),t.getY(b),t.getZ(b)];for(let R=0;R<3;R++)r[R]=Math.min(r[R],E[R]),a[R]=Math.max(a[R],E[R])}let o=[a[0]-r[0],a[1]-r[1],a[2]-r[2]],l=o.indexOf(Math.min(...o)),c=[0,1,2].filter((b)=>b!==l),h=o[c[0]]>o[c[1]]?c[0]:c[1],d=h===c[0]?c[1]:c[0],u=(b,E)=>E===0?t.getX(b):E===1?t.getY(b):t.getZ(b),p=r[d],_=a[d],S=r[h],m=a[h],f=0;for(let b=0;b<t.count;b++)f+=u(b,l);f/=t.count;let w=(b,E,R)=>{let v=0,T=1/0;for(let O=0;O<t.count;O++){let P=u(O,d),C=u(O,h),k=(E?P-p:_-P)+(R?C-S:m-C);if(k<T)T=k,v=O}return b?new Fe(b.getX(v),b.getY(v)):new Fe(E?0:1,R?0:1)},I=(b,E)=>w(n,b,E),y=s?new B(s.getX(0),s.getY(0),s.getZ(0)).normalize():new B(0,1,0);return{nAxis:l,hAxis:d,vAxis:h,h0:p,h1:_,v0:S,v1:m,planePos:f,uvs:[I(!0,!0),I(!1,!0),I(!0,!1),I(!1,!1)],uvs1:[w(i,!0,!0),w(i,!1,!0),w(i,!0,!1),w(i,!1,!1)],normal:y}}function Dd(e,t,n,i=!1){let s=e.h1===e.h0?0:(t-e.h0)/(e.h1-e.h0),r=e.v1===e.v0?0:(n-e.v0)/(e.v1-e.v0),[a,o,l,c]=i?e.uvs1:e.uvs;return new Fe(Ln.lerp(Ln.lerp(a.x,o.x,s),Ln.lerp(l.x,c.x,s),r),Ln.lerp(Ln.lerp(a.y,o.y,s),Ln.lerp(l.y,c.y,s),r))}function Ud(e,t,n=!1){let i=[],s=[],r=[],a=[];for(let l of t){let c=n?e.planePos:0,h=n?(l.h0+l.h1)/2:0,d=n?(l.v0+l.v1)/2:0,u=(p,_)=>{let S=[0,0,0];S[e.nAxis]=e.planePos-c,S[e.hAxis]=p-h,S[e.vAxis]=_-d,i.push(S[0],S[1],S[2]);let m=Dd(e,p,_);s.push(m.x,m.y);let f=Dd(e,p,_,!0);r.push(f.x,f.y),a.push(e.normal.x,e.normal.y,e.normal.z)};u(l.h0,l.v0),u(l.h1,l.v0),u(l.h1,l.v1),u(l.h0,l.v0),u(l.h1,l.v1),u(l.h0,l.v1)}let o=new Ct;return o.setAttribute("position",new yt(i,3)),o.setAttribute("uv",new yt(s,2)),o.setAttribute("uv1",new yt(r,2)),o.setAttribute("normal",new yt(a,3)),o.userData.shared=!0,o}function dx(e){let t=lx/2;return[{h0:e.h0,h1:-t,v0:e.v0,v1:e.v1},{h0:t,h1:e.h1,v0:e.v0,v1:e.v1},{h0:-t,h1:t,v0:e.v0+cx,v1:e.v1}]}function fx(e){let t=[],n=(e.h1-e.h0)/Pd,i=(e.v1-e.v0)/Ld;for(let s=0;s<Pd;s++)for(let r=0;r<Ld;r++)t.push({h0:e.h0+s*n,h1:e.h0+(s+1)*n,v0:e.v0+r*i,v1:e.v0+(r+1)*i});return t}var Ql={floor:"Plane",ceil:"Plane.007",lamp:"Sphere"},Fd={n:"Plane.001",s:"Plane.006",e:"Plane.002",w:"Plane.004"};function Od(){let e=new ia;e.background=new Le(658963),e.fog=new qs(658963,6,26);let t=new Kt;e.add(t);let n=new ya(11451595,1.1),i=new ga(9414333,1316893,0.7);e.add(n,i);let s=null,r=2,a=[],o=new Set,l=new Set,c=new ln({color:5953216,side:Bt,transparent:!0,opacity:0.6}),h=new tr(0.4,0.55,32);h.userData.shared=!0;let d=null,u=null,p=null,_=new B(0,1.6,2),S=[],m=[],f={scene:e,root:t,get toilet(){return p},get spawn(){return _},hasCell(O,P){return S.some((C)=>C.x===O&&C.z===P)},load(){if(!u)u=y();return u},update(O){for(let P=m.length-1;P>=0;P--){let C=m[P];C.t+=O;let k=Math.min(1,C.t/hx);C.mat.opacity=k<0.4?1:1-(k-0.4)/0.6;for(let A=0;A<C.parts.length;A++){let F=C.parts[A],V=C.t;F.mesh.position.set(F.p0.x+F.v.x*V,F.p0.y+F.v.y*V-5*V*V,F.p0.z+F.v.z*V),F.mesh.quaternion.setFromAxisAngle(F.axis,F.speed*V)}if(k>=1)t.remove(C.group),C.mat.dispose(),m.splice(P,1)}},applyGfx(O){if(s=O,!d)return;E(O.tex),R(O.refl),r=O.light,v(),T(O.draw)},rebuild(O){if(!d)return;let P=new Set(S.map((C)=>C.x+","+C.z));S=O.map((C)=>({...C})),p=null;while(t.children.length)t.children.pop().traverse((k)=>{let A=k;if(A.geometry&&!A.geometry.userData.shared)A.geometry.dispose()});a.length=0;for(let C of S){let k=C.x*nn,A=C.z*nn,F=new vt(d.floor.geo,d.floor.mat);F.position.set(k,0,A),t.add(F);let V=new vt(d.ceil.geo,d.ceil.mat);V.position.set(k,0,A),t.add(V);for(let z of Nd){if(f.hasCell(C.x+z.dx,C.z+z.dz))continue;let Q=d.wall[z.dir].geo,W=new vt(Q,d.wall[z.dir].mat);W.position.set(k,0,A),t.add(W)}for(let z of d.lamp){let Q=new vt(z.geo,z.mat);Q.position.set(k,0,A),t.add(Q)}if(C.kind!=="room"){let z=new xs(16773327,7,7,2);z.position.set(k,d.lampY,A),t.add(z),a.push(z)}if(C.kind==="toilet")p=I(d,k,A),t.add(p.group);if(C.kind==="spawn"){_=new B(k,1.6,A);let z=new vt(h,c);z.rotation.x=-Math.PI/2,z.position.set(k,0.02,A),t.add(z)}}for(let C of S)for(let k of Nd){let A=C.x+k.dx,F=C.z+k.dz;if(!f.hasCell(A,F))continue;let V=P.has(C.x+","+C.z),z=P.has(A+","+F);if(V&&z)continue;let Q=V?C:z?{x:A,z:F}:null;if(!Q)continue;let W=Q===C?{x:A,z:F}:C,K=W.z<Q.z?"n":W.z>Q.z?"s":W.x>Q.x?"e":"w";w(d,Q.x*nn,Q.z*nn,K)}v()}};function w(O,P,C,k){let A=O.wall[k].mat,F=(Array.isArray(A)?A[0]:A).clone();F.transparent=!0,F.opacity=1,F.side=Bt;let V=new Kt;V.position.set(P,0,C);let z=()=>Math.random()-0.5,Q=O.fragGeo[k].map((W,K)=>{let ee=new vt(W,F);ee.position.copy(O.fragCenter[k][K]),V.add(ee);let Te=k==="n"||k==="s",Se=new B(Te?z()*1.2:z()*2.6,0.5+Math.random()*1.1,Te?z()*2.6:z()*1.2),We=new B(z(),z(),z()).normalize();if(We.lengthSq()<0.01)We.set(0,1,0);return{mesh:ee,p0:ee.position.clone(),v:Se,axis:We,speed:4+Math.random()*7}});t.add(V),m.push({group:V,mat:F,t:0,parts:Q})}function I(O,P,C){let k=O.toilet.clone();k.updateMatrixWorld(!0);let A=O.toiletBox,F=C+nn/2-0.04-A.max.z;return k.position.set(P,-A.min.y,F),{group:k,box:{x0:P+A.min.x,z0:F+A.min.z,x1:P+A.max.x,z1:F+A.max.z},anim:0}}async function y(){let O=new Kl,P=(ae)=>new Promise((Ce,Ie)=>O.load(ae,Ce,void 0,Ie)),[C,k]=await Promise.all([P("assets/cell.glb"),P("assets/toilet.glb")]);C.scene.updateMatrixWorld(!0),k.scene.updateMatrixWorld(!0);let A=(ae)=>ae.replace(/[\s.]/g,""),F=new Map;C.scene.traverse((ae)=>{let Ce=A(ae.name);if(!F.has(Ce))F.set(Ce,ae)});let V=(ae)=>{let Ce=F.get(A(ae));if(!Ce)throw Error("в cell.glb нет объекта «"+ae+"»; есть: "+[...F.keys()].join(", "));return Ce},z=(ae)=>{let Ce=ae.geometry.clone();return Ce.applyMatrix4(ae.matrixWorld),Ce.computeBoundingBox(),Ce.userData.shared=!0,Ce},Q=(ae)=>{let Ce=[];if(ae.traverse((Ie)=>{let ke=Ie;if(ke.isMesh)Ce.push({geo:z(ke),mat:ke.material})}),!Ce.length)throw Error("объект «"+ae.name+"» в cell.glb без мешей");return Ce},W=new Set;for(let ae of[C.scene,k.scene])ae.traverse((Ce)=>{let Ie=Ce;if(Ie.isMesh)for(let ke of Array.isArray(Ie.material)?Ie.material:[Ie.material])W.add(ke)});for(let ae of W){let Ce=ae;Ce.side=Bt;for(let Ie of[Ce.map,Ce.normalMap,Ce.roughnessMap,Ce.metalnessMap,Ce.emissiveMap])if(Ie)Ie.anisotropy=8;l.add(Ce);for(let Ie of[Ce.map,Ce.normalMap,Ce.roughnessMap,Ce.metalnessMap,Ce.emissiveMap])if(Ie)o.add(Ie)}let K={},ee={},Te={},Se={};for(let ae of["n","s","e","w"]){let Ce=Q(V(Fd[ae]));if(Ce.length!==1)throw Error("стена «"+Fd[ae]+"» состоит из "+Ce.length+" примитивов — нужен один");let{geo:Ie,mat:ke}=Ce[0],qe=ux(Ie);K[ae]={geo:Ie,mat:ke},ee[ae]=Ud(qe,dx(qe));let Je=fx(qe);Te[ae]=[],Se[ae]=[];for(let _t of Je){Te[ae].push(Ud(qe,[_t],!0));let Qe=[0,0,0];Qe[qe.nAxis]=qe.planePos,Qe[qe.hAxis]=(_t.h0+_t.h1)/2,Qe[qe.vAxis]=(_t.v0+_t.v1)/2,Se[ae].push(new B(Qe[0],Qe[1],Qe[2]))}}let We=Q(V(Ql.floor))[0],He=Q(V(Ql.ceil))[0],Y=Q(V(Ql.lamp)),ie=new Vt;for(let ae of Y)ie.union(ae.geo.boundingBox);let re=(ie.min.y+ie.max.y)/2,Re=k.scene.getObjectByName("toilet")||k.scene.children[0];if(!Re)throw Error("в toilet.glb нет унитаза");Re.updateMatrixWorld(!0);let Ne=new Vt().setFromObject(Re);if(d={floor:We,ceil:He,lamp:Y,lampY:re,wall:K,doorGeo:ee,fragGeo:Te,fragCenter:Se,toilet:Re,toiletBox:Ne},s)f.applyGfx(s)}function b(O,P){let{width:C,height:k}=O,A=Math.min(1,P/Math.max(C,k)),F=document.createElement("canvas");return F.width=Math.max(1,Math.round(C*A)),F.height=Math.max(1,Math.round(k*A)),F.getContext("2d").drawImage(O,0,0,F.width,F.height),F}function E(O){let P=[512,1024,0][O]||0,C=[1,4,8][O]||8;for(let k of o){if(k.userData._origImg===void 0)k.userData._origImg=k.image;let A=k.userData._origImg;if(!A||!A.width)continue;let F=A;if(P&&(A.width>P||A.height>P)){let V=k.userData._scaled||(k.userData._scaled={});if(!V[P])V[P]=b(A,P);F=V[P]}if(k.image!==F)k.image=F,k.needsUpdate=!0;k.anisotropy=C}}function R(O){let P=O>0;for(let C of l){if(C.userData._origPBR===void 0)C.userData._origPBR={r:C.roughness,mm:C.metalness,rmap:C.roughnessMap,mmap:C.metalnessMap};let k=C.userData._origPBR;if(P)C.roughness=k.r,C.metalness=k.mm,C.roughnessMap=k.rmap,C.metalnessMap=k.mmap;else C.roughness=1,C.metalness=0,C.roughnessMap=null,C.metalnessMap=null}}function v(){n.intensity=[1.9,1.45,1.1][r]??1.1,i.intensity=[0,0.85,0.7][r]??0.7;for(let O of a)O.visible=r===2}function T(O){if(e.fog)e.fog.far=Aa[O]??26}return f.debugInfo=()=>t.children.map((O,P)=>{let C={i:P,type:O.type,pos:O.position?.toArray?.()?.map((V)=>+V.toFixed(2))},k=[],A=[],F=[];return O.traverse((V)=>{let z=V;if(!z.isMesh)return;for(let K of Array.isArray(z.material)?z.material:[z.material]){let ee=K;k.push((K.name||"?")+(ee.map?"":" NOMAP"))}z.geometry.computeBoundingBox();let Q=z.geometry.boundingBox;F.push(`box[${Q.min.toArray().map((K)=>K.toFixed(1))}..${Q.max.toArray().map((K)=>K.toFixed(1))}]`);let W=z.geometry.getAttribute("uv");if(W){let K=9,ee=-9,Te=9,Se=-9;for(let We=0;We<W.count;We++)K=Math.min(K,W.getX(We)),ee=Math.max(ee,W.getX(We)),Te=Math.min(Te,W.getY(We)),Se=Math.max(Se,W.getY(We));A.push(`uv[${K.toFixed(2)}..${ee.toFixed(2)},${Te.toFixed(2)}..${Se.toFixed(2)}]`)}else A.push("NO_UV")}),C.mats=k,C.uvs=A,C.boxes=F,C}),f.debugFilter=(O)=>{let P=0;return t.traverse((C)=>{let k=C;if(!k.isMesh)return;let A=(Array.isArray(k.material)?k.material:[k.material]).map((V)=>V.name||"").join(","),F=!O||A.includes(O);if(k.visible=F,!F)P++}),P},f.debugRay=(O,P)=>new Fi(new B(...O),new B(...P).normalize(),0,100).intersectObjects(t.children,!0).slice(0,3).map((A)=>{let F=A.object;return{dist:+A.distance.toFixed(3),point:A.point.toArray().map((V)=>+V.toFixed(3)),mat:Array.isArray(F.material)?F.material.map((V)=>V.name).join("|"):F.material?.name}}),f}var ec=1.6,un=0.32,px=3.2,mx=1.7,Bd=0.0022;class tc{world;lockTarget;pos=new B(0,ec,2);yaw=0;pitch=0;bob=0;moving=!1;keys={};enabled=!1;onKeyDown=(e)=>{if(this.keys[e.code]=!0,["Space","Tab","KeyE"].includes(e.code))e.preventDefault()};onKeyUp=(e)=>{this.keys[e.code]=!1};onMouse=(e)=>{if(!this.enabled)return;this.yaw-=e.movementX*Bd,this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch-e.movementY*Bd))};onLockChange=()=>{this.enabled=document.pointerLockElement===this.lockTarget};constructor(e,t){this.world=e;this.lockTarget=t;document.addEventListener("keydown",this.onKeyDown),document.addEventListener("keyup",this.onKeyUp),document.addEventListener("mousemove",this.onMouse),document.addEventListener("pointerlockchange",this.onLockChange)}dispose(){document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("keyup",this.onKeyUp),document.removeEventListener("mousemove",this.onMouse),document.removeEventListener("pointerlockchange",this.onLockChange)}get locked(){return this.enabled}async lock(){try{await this.lockTarget.requestPointerLock()}catch{}}unlock(){if(document.pointerLockElement)document.exitPointerLock();this.enabled=!1}reset(e){this.pos.copy(e),this.pos.y=ec,this.yaw=0,this.pitch=-0.45,this.keys={}}canStand(e,t){let n=[[e-un,t-un],[e+un,t-un],[e-un,t+un],[e+un,t+un]];for(let[s,r]of n){let a=Math.round(s/nn),o=Math.round(r/nn);if(!this.world.hasCell(a,o))return!1}let i=this.world.toilet?.box;if(i){let s=e+un>i.x0&&e-un<i.x1,r=t+un>i.z0&&t-un<i.z1;if(s&&r)return!1}return!0}update(e,t){if(this.moving=!1,this.enabled&&!t){let s=0,r=0;if(this.keys.KeyW||this.keys.ArrowUp)s+=1;if(this.keys.KeyS||this.keys.ArrowDown)s-=1;if(this.keys.KeyA||this.keys.ArrowLeft)r-=1;if(this.keys.KeyD||this.keys.ArrowRight)r+=1;if(s||r){let a=Math.hypot(s,r);s/=a,r/=a;let o=this.keys.ShiftLeft||this.keys.ShiftRight?mx:1,l=px*o*e,c=Math.sin(this.yaw),h=Math.cos(this.yaw),d=(-c*s+h*r)*l,u=(-h*s-c*r)*l;if(this.canStand(this.pos.x+d,this.pos.z))this.pos.x+=d;if(this.canStand(this.pos.x,this.pos.z+u))this.pos.z+=u;this.moving=!0}}let n=this.moving?1:0;this.bob+=(n-this.bob)*Math.min(1,e*8);let i=performance.now()/1000;this.pos.y=ec+Math.sin(i*9)*0.035*this.bob}apply(e){e.position.copy(this.pos),e.rotation.order="YXZ",e.rotation.set(this.pitch,this.yaw,0)}forward(){return new B(-Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch))}}var $e=(e)=>document.getElementById(e),ye=null,ki=null,ot=null,gt=null,kt=null,mt=null,nc=!1,zd=0,Mn=!1,Fn=!1;function Es(e){$e("gate").classList.toggle("hidden",e!=="gate"),$e("menu").classList.toggle("hidden",e!=="menu"),$e("game").classList.toggle("hidden",e!=="game"),$e("side").classList.toggle("hidden",e==="gate")}function zi(e,t){let n=document.createElement("div");n.className="toast "+(t||""),n.textContent=e,$e("toasts").appendChild(n),setTimeout(()=>n.remove(),2600)}async function sc(e){let t=$e("nick").value.trim(),n=$e("pass").value;$e("gateErr").textContent="";try{let i=await pi("/api/"+e,{nick:t,pass:n});Hl(i.sid),ye=i.state,ki=i.catalog,ws(),Pa(),Es("menu"),ac(),oc()}catch(i){$e("gateErr").textContent=lr(i)}}async function gx(){if(!yn())return;try{let e=await pi("/api/state?sid="+encodeURIComponent(yn()));ye=e.state,ki=e.catalog,ws(),Pa(),Es("menu"),ac(),oc()}catch{rc()}}function rc(){if(yn())pi("/api/logout",{sid:yn()}).catch(()=>{});Hl(""),ye=null,Mn=!1,gt?.unlock(),Es("gate")}async function _x(){if(!yn()||!ye)return;try{let e=await pi("/api/state?sid="+encodeURIComponent(yn()));if(ye=e.state,!ki&&e.catalog)ki=e.catalog;ws(),Pa(),$e("online").textContent=String(e.online)}catch(e){if(e.code===401)rc()}}async function Ts(e,t,n){if(nc||!ye)return;nc=!0;try{let i=await pi(e,{sid:yn(),...t});if(i.state){if(ye=i.state,ws(),Pa(),e==="/api/build"&&ot&&ye)ot.rebuild(ye.cells),zi("РљР»РµС‚РєР° РїРѕСЃС‚СЂРѕРµРЅР°","event")}if(i.result){if(zi(i.result.text,i.result.kind==="hurt"||i.result.kind==="dirty"?"hit":i.result.kind==="event"?"event":"loot"),ot?.toilet)ot.toilet.anim=1}else if(n)zi(n,"event");if(e==="/api/market/sell"||e==="/api/market/buy")Wd()}catch(i){zi(lr(i),"hit")}finally{nc=!1}}async function Gd(){if(Date.now()<zd)return;zd=Date.now()+1250,await Ts("/api/pull",{})}function ws(){if(!ye)return;$e("whoami").textContent=ye.login,$e("whoScore").textContent=`СЃС‡С‘С‚ ${Sn(ye.score)} В· СЃРјРµСЂС‚РµР№ ${ye.deaths} В· СЃРјС‹РІРѕРІ ${ye.pulls}`,$e("money").textContent=Sn(ye.money),$e("income").textContent=ye.income.toFixed(2),$e("hp").textContent=ye.hp.toFixed(0),$e("dirty").textContent=ye.dirty.toFixed(1),$e("cells").textContent=String(ye.cells.length),document.querySelector(".chip.hp")?.classList.toggle("low",ye.hp<40),document.querySelector(".chip.dirty")?.classList.toggle("high",ye.dirty>70),Vd()}function Vd(){if(!ye||!gt)return;let e=$e("buildInfo"),t=Math.round(gt.pos.x/nn),n=Math.round(gt.pos.z/nn),i={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]},s=0;for(let r of["n","s","e","w"]){let[a,o]=i[r],l=ye.cells.some((h)=>h.x===t+a&&h.z===n+o),c=document.querySelector(`.btn.dir[data-dir="${r}"]`);if(c)c.disabled=l||ye.money<ye.buildCost;if(!l)s++}e.innerHTML=s?`РїРѕСЃС‚СЂРѕРёС‚СЊ РєР»РµС‚РєСѓ <b>${Sn(ye.buildCost)}</b> <span class="dim">вЂ” РІС‹Р±РµСЂРё СЃС‚РѕСЂРѕРЅСѓ РѕС‚ РєР»РµС‚РєРё [${t}, ${n}]</span>`:'<span class="dim">РІРѕРєСЂСѓРі РєР»РµС‚РєРё РЅРµС‚ РјРµСЃС‚Р°</span>'}function ac(){if(!ye)return;$e("menuStats").innerHTML=`<span>РјРѕРЅРµС‚С‹ <b>${Sn(ye.money)}</b></span>`+`<span>РєР»РµС‚РѕРє <b>${ye.cells.length}</b></span>`+`<span>СЃС‡С‘С‚ <b>${Sn(ye.score)}</b></span>`+`<span>РґРѕС…РѕРґ/СЃРµРє <b>${ye.income.toFixed(2)}</b></span>`}function Pa(){if(!ye)return;xx(),vx(),yx()}function xx(){if(!ye||!ki)return;let e=$e("upgList");e.innerHTML="";for(let t of ki.upgrades){let n=ye.upg[t.id]||0,i=ye.upgCost[t.id],s=document.createElement("div");s.className="row",s.dataset.upg=t.id,s.innerHTML=`<span class="name">${t.name}<small>${t.desc}</small></span>`+`<span class="lvl">СѓСЂ.${n}</span><span class="price">${Sn(i)}</span>`;let r=document.createElement("button");r.className="btn",r.id="buy-"+t.id,r.textContent=n?"РЈР›РЈР§РЁРРўР¬":"РљРЈРџРРўР¬",r.disabled=ye.money<i,r.onclick=()=>Ts("/api/upgrade",{id:t.id},t.name+" СѓР»СѓС‡С€РµРЅ"),s.appendChild(r),e.appendChild(s)}}function vx(){if(!ye)return;let e=$e("invList");if(e.innerHTML="",!ye.inv.length){e.innerHTML='<div class="row empty">РїСѓСЃС‚Рѕ вЂ” СЃРјС‹РІР°Р№ СѓРЅРёС‚Р°Р·</div>';return}ye.inv.forEach((t,n)=>{let i=document.createElement("div");i.className="row "+t.rarity,i.dataset.item=t.id,i.innerHTML=`<span class="name">${ur(t.id)}<small>${wa(t.rarity)}</small></span>`+`<span class="price">в‰€${Sn(t.sell)}</span>`;let s=document.createElement("button");s.className="btn",s.textContent="Р’Р«РЎРўРђР’РРўР¬",s.onclick=()=>Ts("/api/market/sell",{idx:n,price:t.sell},"Р’С‹СЃС‚Р°РІР»РµРЅ Р»РѕС‚: "+ur(t.id)),i.appendChild(s),e.appendChild(i)})}function ur(e){let t=ki?.items.find((n)=>n.id===e);return t?t.name:e}function yx(){if(!ye)return;let e=$e("logList");e.innerHTML="";for(let t of ye.log||[]){let n=document.createElement("div");n.className="logline "+t.kind;let i=new Date(t.ts);n.innerHTML=`<b>${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}</b> ${t.text}`,e.appendChild(n)}}async function Wd(){if(!yn()||!ye)return;try{let e=await pi("/api/market?sid="+encodeURIComponent(yn())),t=$e("myItems");t.innerHTML=e.inv.length?"":'<div class="row empty">РЅРµС‚ РІРµС‰РµР№</div>',e.inv.forEach((i,s)=>{let r=document.createElement("div");r.className="row "+i.rarity,r.innerHTML=`<span class="name">${ur(i.id)}<small>${wa(i.rarity)}</small></span><span class="price">${Sn(i.sell)}</span>`;let a=document.createElement("button");a.className="btn",a.textContent="РџР РћР”РђРўР¬",a.onclick=()=>Ts("/api/market/sell",{idx:s,price:i.sell},"Р›РѕС‚ РІС‹СЃС‚Р°РІР»РµРЅ"),r.appendChild(a),t.appendChild(r)});let n=$e("marketList");n.innerHTML=e.lots.length?"":'<div class="row empty">Р»РѕС‚РѕРІ РЅРµС‚</div>';for(let i of e.lots){let s=document.createElement("div");s.className="row "+i.item.rarity,s.dataset.lot=String(i.id),s.innerHTML=`<span class="name">${ur(i.item.id)}<small>${wa(i.item.rarity)} В· ${i.seller}</small></span><span class="price">${Sn(i.price)}</span>`;let r=document.createElement("button");r.className="btn",r.textContent="РљРЈРџРРўР¬",r.disabled=ye.money<i.price||i.seller===ye.login,r.onclick=()=>Ts("/api/market/buy",{lot:i.id},"РљСѓРїР»РµРЅРѕ: "+ur(i.item.id)),s.appendChild(r),n.appendChild(s)}}catch(e){zi(lr(e),"hit")}}async function Sx(){try{let e=await pi("/api/rating"),t=$e("ratingList");if(t.innerHTML="",$e("online").textContent=String(e.online),e.top.forEach((n,i)=>{let s=document.createElement("div");s.className="row rank"+(ye&&n.login===ye.login?" me":""),s.dataset.nick=n.login,s.innerHTML=`<span class="pos">${i+1}</span><span class="name">${n.login}${ye&&n.login===ye.login?"<small>С‚С‹</small>":""}</span>`+`<span class="lvl">СѓСЂ.${n.levels}</span><span class="price">${Sn(n.score)}</span>`,t.appendChild(s)}),!e.top.length)t.innerHTML='<div class="row empty">РїРѕРєР° РїСѓСЃС‚Рѕ</div>'}catch(e){zi(lr(e),"hit")}}function Xd(){let e=jl();if(kt)kt.setPixelRatio(Math.min(2,window.devicePixelRatio)*bd[e.res]);if(mt)mt.far=Aa[e.draw]+2,mt.updateProjectionMatrix();ot?.applyGfx(e)}function oc(){if(kt)return;let e=$e("gl");kt=new zl({canvas:e,antialias:!0}),kt.setPixelRatio(Math.min(2,window.devicePixelRatio)),mt=new Rt(72,1,0.05,60),ot=Od(),gt=new tc(ot,e);let t=()=>{let{innerWidth:n,innerHeight:i}=window;kt.setSize(n,i,!1),mt.aspect=n/i,mt.updateProjectionMatrix()};window.addEventListener("resize",t),t(),Xd(),e.addEventListener("click",()=>{if(Fn){Ia();return}if(Mn&&!gt.locked)gt.lock()})}var ic=new Fi,Mx=new Fe(0,0),dr=()=>$e("prompt");function bx(){if(!ot?.toilet||!mt||!Mn){dr().classList.add("hidden");return}ic.setFromCamera(Mx,mt),ic.far=2.6;let e=ic.intersectObject(ot.toilet.group,!0);dr().classList.toggle("hidden",e.length===0)}async function qd(){if(!ye)return;oc();try{await ot.load()}catch{zi("РЅРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РєР°СЂС‚Сѓ","hit");return}ot.rebuild(ye.cells),gt.reset(ot.spawn),Mn=!0,Es("game"),ws(),await gt.lock()}function lc(){Mn=!1,gt?.unlock(),dr().classList.add("hidden"),ac(),Es("menu")}function Ia(e){let t=document.querySelectorAll(".tab");if(e){if(t.forEach((n)=>n.classList.toggle("active",n.dataset.tab===e)),document.querySelectorAll(".panel").forEach((n)=>n.classList.toggle("active",n.id==="tab-"+e)),e==="market")Wd();if(e==="rating")Sx()}if(Fn=!Fn||!!e,$e("side").classList.toggle("hidden",!Fn),Mn)if(Fn)gt?.unlock();else gt?.lock()}document.addEventListener("keydown",(e)=>{if(!ye)return;if(e.code==="Tab")e.preventDefault(),Ia();else if(e.code==="Escape"){if(Ca())Cd();else if(Fn)Ia();else if(Mn)lc()}else if(e.code==="KeyG")Rd();else if(e.code==="KeyE"&&Mn&&!Fn&&!Ca()){if(!dr().classList.contains("hidden"))Gd()}});document.addEventListener("pointerlockchange",()=>{if(Mn&&!Fn&&!Ca()&&document.pointerLockElement===null)lc()});document.querySelectorAll(".tab").forEach((e)=>{e.addEventListener("click",()=>Ia(e.dataset.tab))});document.querySelectorAll(".btn.dir").forEach((e)=>{e.addEventListener("click",()=>{if(!ye||!gt)return;let t=Math.round(gt.pos.x/nn),n=Math.round(gt.pos.z/nn);Ts("/api/build",{dir:e.dataset.dir,fx:t,fz:n})})});$e("loginBtn").addEventListener("click",()=>void sc("login"));$e("regBtn").addEventListener("click",()=>void sc("register"));$e("pass").addEventListener("keydown",(e)=>{if(e.key==="Enter")sc("login")});$e("menuLogout").addEventListener("click",rc);$e("startBtn").addEventListener("click",()=>void qd());$e("escBtn").addEventListener("click",lc);setInterval(()=>{if(!ye)return;let e=Math.max(0,Math.round((ye.nextEventIn-(Date.now()-ye.serverTime))/1000));$e("nextEv").textContent=e>0?e+"СЃ":"СЃРµР№С‡Р°СЃ",ye.dirty=Math.min(100,ye.dirty+ye.dirtyRate/60),ye.money+=ye.income/60,ws()},1000);setInterval(()=>void _x(),4000);var kd=performance.now(),Hd=0,Yd=0;function Zd(){requestAnimationFrame(Zd);let e=performance.now(),t=jl().fps;if(t>0&&e-Hd<1000/t-2)return;Hd=e;let n=Math.min(0.05,(e-kd)/1000);if(kd=e,!Mn||!kt||!mt||!ot||!gt)return;if(gt.update(n,Fn),gt.apply(mt),ot.update(n),ot.toilet&&ot.toilet.anim>0){ot.toilet.anim=Math.max(0,ot.toilet.anim-n*1.4);let i=ot.toilet.anim;ot.toilet.group.position.y=Math.sin(i*Math.PI*7)*0.03*i}bx(),Vd(),kt.render(ot.scene,mt),Yd++}Zd();Id();Ed(()=>Xd());Ad((e)=>{if(!Mn)return;if(e)gt?.unlock();else if(!Fn)gt?.lock()});Es("gate");gx();window.__ct={state:()=>ye,sid:()=>yn(),world:()=>ot,player:()=>gt,start:()=>void qd(),pull:()=>void Gd(),promptVisible:()=>!dr().classList.contains("hidden"),look:(e,t)=>{if(gt)gt.yaw=e,gt.pitch=t},money:()=>ye?ye.money:0,frames:()=>Yd,cam:()=>mt?{p:mt.position.toArray().map((e)=>+e.toFixed(2)),r:[mt.rotation.x,mt.rotation.y,mt.rotation.z].map((e)=>+e.toFixed(2))}:null,render:()=>{if(!kt||!mt||!ot)return null;let e=kt.info.render,t=kt.domElement,n={},i=0;return ot.root.traverse((s)=>{let r=s;if(!r.isMesh)return;i++,n[String(r.visible)]=(n[String(r.visible)]||0)+1}),{calls:e.calls,triangles:e.triangles,points:e.points,lines:e.lines,canvas:[t.width,t.height,t.clientWidth,t.clientHeight],camPos:mt.position.toArray().map((s)=>+s.toFixed(2)),camFov:mt.fov,aspect:+mt.aspect.toFixed(3),sceneChildren:ot.scene.children.length,meshes:i,visible:n}},sample:(e)=>{if(!kt||!mt||!ot)return null;kt.render(ot.scene,mt);let t=kt.getContext(),n=kt.domElement.width,i=kt.domElement.height;return e.map(([s,r])=>{let a=Math.max(0,Math.min(n-1,Math.round(s/window.innerWidth*n))),o=Math.max(0,Math.min(i-1,Math.round((1-r/window.innerHeight)*i))),l=new Uint8Array(4);return t.readPixels(a,o,1,1,t.RGBA,t.UNSIGNED_BYTE,l),[l[0],l[1],l[2]]})},rayScreen:(e,t)=>{if(!mt||!ot)return null;let n=ot.root,i=new Fi;return i.setFromCamera(new Fe(e,t),mt),i.far=50,i.intersectObjects(n.children,!0).slice(0,4).map((s)=>({d:+s.distance.toFixed(3),p:s.point.toArray().map((r)=>+r.toFixed(3)),i:n.children.indexOf(s.object.parent&&s.object.parent!==n?s.object.parent:s.object),m:Array.isArray(s.object.material)?s.object.material.map((r)=>r.name).join("|"):s.object.material?.name,uv:(()=>{let r=s.uv;return r?[+r.x.toFixed(3),+r.y.toFixed(3)]:null})()}))}};
