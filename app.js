const $=id=>document.getElementById(id);
let password="";
$("api").value=localStorage.getItem("as_api")||"https://premiumuserpanel.netlify.app";
$("short").value=localStorage.getItem("as_short")||"https://adsfly.in/uhCA";
function msg(t,ok=false){$("status").textContent=t;$("status").style.color=ok?"#1be6a1":"#ff4d86"}
async function call(action,extra={}){
 const r=await fetch("/.netlify/functions/admin",{method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({action,password,userApi:$("api").value.trim(),...extra})});
 const text=await r.text();let d;try{d=JSON.parse(text)}catch{throw new Error("Admin Function deploy হয়নি ("+r.status+")")}
 if(!r.ok||d.ok===false)throw new Error(d.error||"Request failed");return d
}
$("loginBtn").onclick=async()=>{
 password=$("pass").value;if(password!=="ANAMUL"){return $("loginMsg").textContent="Wrong password"}
 try{await call("adminStatus");$("login").classList.add("hidden");$("panel").classList.remove("hidden");await load()}
 catch(e){$("loginMsg").textContent=e.message}
};
$("pass").addEventListener("keydown",e=>{if(e.key==="Enter")$("loginBtn").click()});
async function load(){try{let d=await call("adminStatus");$("keyView").textContent=d.key||"NO ACTIVE KEY";$("short").value=d.shortLink||$("short").value;$("expires").textContent=d.expiresAt?"Expires: "+new Date(d.expiresAt).toLocaleString():"";msg("CONNECTED",true)}catch(e){msg(e.message)}}
$("saveApi").onclick=()=>{localStorage.setItem("as_api",$("api").value.trim());msg("API URL SAVED. Testing...");load()};
$("generate").onclick=async()=>{try{let d=await call("generate",{duration:$("duration").value,unit:$("unit").value});$("keyView").textContent=d.key;$("expires").textContent="Expires: "+new Date(d.expiresAt).toLocaleString();msg("NEW AS_KEY GENERATED",true)}catch(e){msg(e.message)}};
$("copy").onclick=async()=>{let k=$("keyView").textContent;if(!k||k==="NO ACTIVE KEY")return msg("No active key");try{await navigator.clipboard.writeText(k);msg("KEY COPIED",true)}catch{msg("Copy blocked. Long-press the key.")}};
$("reset").onclick=async()=>{if(!confirm("Reset / revoke current key?"))return;try{await call("reset");$("keyView").textContent="NO ACTIVE KEY";$("expires").textContent="";msg("KEY REVOKED",true)}catch(e){msg(e.message)}};
$("saveShort").onclick=async()=>{try{let d=await call("setShortLink",{shortLink:$("short").value.trim()});localStorage.setItem("as_short",d.shortLink);$("short").value=d.shortLink;msg("SHORT LINK SAVED",true);$("shortMsg").textContent="Saved successfully"}catch(e){$("shortMsg").textContent=e.message}};
$("logout").onclick=()=>{password="";$("panel").classList.add("hidden");$("login").classList.remove("hidden");$("pass").value=""};
