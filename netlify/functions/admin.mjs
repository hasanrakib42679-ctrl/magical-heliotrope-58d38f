const H={"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"};
const out=(s,b)=>new Response(JSON.stringify(b),{status:s,headers:H});
const PASSWORD=process.env.ADMIN_PASSWORD||"ANAMUL";
async function user(api,action,b){
 const base=String(api||"").trim().replace(/\/+$/,"");
 if(!/^https?:\/\//i.test(base))throw new Error("Invalid User API URL");
 const r=await fetch(base+"/.netlify/functions/api?action="+encodeURIComponent(action),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...b,password:PASSWORD})});
 const text=await r.text();let d;try{d=JSON.parse(text)}catch{throw new Error("User API returned non-JSON ("+r.status+"). User Panel Functions deploy করো।")}
 if(!r.ok||d.ok===false)throw new Error(d.error||"User API request failed");return d
}
export default async req=>{
 if(req.method==="OPTIONS")return new Response("",{status:204,headers:H});
 try{
  const b=await req.json(); if(b.password!==PASSWORD)return out(401,{ok:false,error:"Wrong password"});
  const a=b.action||"adminStatus";
  if(a==="adminStatus"||a==="generate"||a==="reset"||a==="setShortLink"){
    return out(200,await user(b.userApi,a,b));
  }
  return out(404,{ok:false,error:"Unknown action"});
 }catch(e){return out(500,{ok:false,error:e.message||"Server error"})}
}