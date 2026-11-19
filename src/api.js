const BASE='/api';
export function token(){return localStorage.getItem('tsapo_token')}
export async function api(path,options={}){const headers={'Content-Type':'application/json',...(token()?{Authorization:`Bearer ${token()}`}:{}) ,...options.headers};const r=await fetch(BASE+path,{...options,headers});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Request failed');return data;}
