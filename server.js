const http=require("http"),fs=require("fs"),path=require("path");
const PORT=process.env.PORT||3000,ROOT=path.join(__dirname,"public"),MODEL=process.env.OPENAI_MODEL||"gpt-5.5";
const schema={type:"object",additionalProperties:false,properties:{
title:{type:"string"},alternative_titles:{type:"array",items:{type:"string"}},duration:{type:"string"},audience:{type:"string"},hook:{type:"string"},voiceover_script:{type:"string"},
scenes:{type:"array",items:{type:"object",additionalProperties:false,properties:{time:{type:"string"},narration_section:{type:"string"},visual_direction:{type:"string"},on_screen_text:{type:"string"},search_keywords:{type:"array",items:{type:"string"}}},required:["time","narration_section","visual_direction","on_screen_text","search_keywords"]}},
thumbnail:{type:"object",additionalProperties:false,properties:{concept:{type:"string"},text:{type:"string"},image_prompt:{type:"string"},layout:{type:"string"}},required:["concept","text","image_prompt","layout"]},
youtube_description:{type:"string"},hashtags:{type:"array",items:{type:"string"}},
shorts:{type:"array",items:{type:"object",additionalProperties:false,properties:{title:{type:"string"},script:{type:"string"},visual_idea:{type:"string"}},required:["title","script","visual_idea"]}},
fact_check_notes:{type:"array",items:{type:"string"}},disclaimer:{type:"string"}},
required:["title","alternative_titles","duration","audience","hook","voiceover_script","scenes","thumbnail","youtube_description","hashtags","shorts","fact_check_notes","disclaimer"]};
const send=(res,s,d,t="application/json; charset=utf-8")=>{res.writeHead(s,{"Content-Type":t,"Cache-Control":"no-store"});res.end(t.startsWith("application/json")?JSON.stringify(d):d)};
function body(req){return new Promise((ok,no)=>{let b="";req.on("data",c=>{b+=c;if(b.length>20000)no(Error("İstek çok büyük."))});req.on("end",()=>{try{ok(JSON.parse(b||"{}"))}catch{no(Error("Geçersiz JSON."))}});req.on("error",no)})}
async function generate(p){
if(!process.env.OPENAI_API_KEY){let e=Error("OPENAI_API_KEY sunucuya eklenmemiş. Replit Secrets bölümüne ekleyin.");e.status=503;throw e}
let topic=String(p.topic||"").trim();if(topic.length<5||topic.length>500){let e=Error("Konu 5-500 karakter arasında olmalı.");e.status=400;throw e}
const instructions=`Sen GarajNotları adlı Türkçe otomobil YouTube kanalının içerik editörüsün. Yüz göstermeyen, yapay zekâ seslendirmeli, samimi ve profesyonel içerik üret. Teknik doğruluk önceliklidir. Bilmediğin ayrıntıyı uydurma; doğrulanması gerekenleri fact_check_notes alanına yaz. Tek belirtiyle kesin arıza teşhisi koyma. Araç/model/şanzıman farklılıklarını belirt. Güvenlik uyarılarını ekle. Senaryo istenen süreye uygun, doğal ve tekrarsız olsun. Telifli kanal görüntüsü önermek yerine stok arama terimleri üret. Marka: GarajNotları. Slogan: Otomobilin her yönünü keşfet.`;
const input=`Konu: ${topic}\nSüre: ${p.duration||"6-8 dakika"}\nAnlatım: ${p.tone||"Samimi ve profesyonel"}\nİzleyici: Türkiye'deki otomobil sahipleri. Türkçe tam yayın paketi hazırla. voiceover_script tam okunabilir metin olsun. scenes zaman kodlu sahne planı olsun. 3 Shorts üret. Thumbnail için görsel üretim promptu yaz. Sadece şemaya uygun JSON döndür.`;
const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+process.env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,instructions,input,text:{format:{type:"json_schema",name:"garajnotlari_video_package",strict:true,schema}},max_output_tokens:10000})});
const d=await r.json();if(!r.ok){let e=Error(d?.error?.message||"OpenAI API hatası");e.status=r.status;throw e}
let out=d.output_text||(d.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("");
if(!out)throw Error("Model boş yanıt döndürdü.");return {result:JSON.parse(out),model:MODEL};
}
http.createServer(async(req,res)=>{let u=new URL(req.url,"http://localhost");
if(req.method==="GET"&&u.pathname==="/api/health")return send(res,200,{ok:true,configured:!!process.env.OPENAI_API_KEY,model:MODEL});
if(req.method==="POST"&&u.pathname==="/api/generate"){try{return send(res,200,await generate(await body(req)))}catch(e){return send(res,e.status||500,{error:e.message})}}
if(req.method==="GET"){let name=u.pathname==="/"?"index.html":decodeURIComponent(u.pathname.slice(1)),f=path.normalize(path.join(ROOT,name));if(!f.startsWith(ROOT))return send(res,403,"Forbidden","text/plain");return fs.readFile(f,(e,b)=>e?send(res,404,"Bulunamadı","text/plain; charset=utf-8"):send(res,200,b,path.extname(f)===".html"?"text/html; charset=utf-8":"application/octet-stream"))}
send(res,404,{error:"Endpoint bulunamadı"});
}).listen(PORT,()=>console.log("GarajNotları AI Studio port "+PORT));
