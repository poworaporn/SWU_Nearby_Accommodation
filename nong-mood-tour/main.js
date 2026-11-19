const get = id => document.getElementById(id);
const film = get('film');
const timeLabel = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const names = ['คอนโดใกล้มหาวิทยาลัย','ห้องและส่วนกลาง','เรื่องการเดินทาง','อพาร์ตเมนต์อีกทางเลือก','ห้องเล็กลง มีอะไรบ้าง','ต่างกัน 3,000 บาท','ขอบเขตพื้นที่ศึกษา','ข้อมูลสำรวจ 78 รายการ','เดิน · MRT · เดิน','วิน · BTS · วิน','ระยะทางอย่างเดียวไม่พอ','Hedonic Pricing และ OLS','S · ลักษณะห้องและอาคาร','L · การเดินทาง','N · สิ่งอำนวยความสะดวก','SL · ห้องและการเดินทาง','SN · ห้องและส่วนกลาง','LN · การเดินทางและส่วนกลาง','SLN · พิจารณาปัจจัยครบทั้งสามกลุ่ม','บทสรุปงานวิจัย'];
let tracks=[],lastScene='',lastTrack=-1;
const chapterButtons=[...get('chapters').querySelectorAll('button')];
const picture=(name,label='',cards=[],mode='')=>({name,label,cards,mode});
function composition(n,t){
 switch(n){
 case 0:return picture('condo','คอนโดใกล้มหาวิทยาลัย',[['ค่าเช่ารายเดือน','8,500 บาท']]);
 case 1:return picture(t<4.5?'room':'pool','ห้องกว้าง พร้อมสิ่งอำนวยความสะดวก');
 case 2:return picture('traffic','การเดินทางก็เป็นอีกเรื่องที่ต้องคิด');
 case 3:return picture('apartment','อพาร์ตเมนต์อีกทางเลือก',[['ค่าเช่ารายเดือน','5,500 บาท']]);
 case 4:return picture(t<4?'cutaway':'apartment','ห้องเล็กลง · สิ่งอำนวยความสะดวกต่างกัน');
 case 5:return picture('compare','สองที่พัก สองคำตอบ',[['ส่วนต่างค่าเช่า','3,000 บาท/เดือน']]);
 case 6:return picture('map','ขอบเขตการศึกษา',[],'map');
 case 7:return picture('amenities','ข้อมูลจากผู้พักอาศัยจริง · 78 รายการ');
 case 8:return picture('transit','เดิน → MRT → เดิน',[['เวลาเดินทางรวม','20 นาที']]);
 case 9:return picture(t<8?'traffic':'taxi','เดิน → วิน → BTS → วิน',[['เวลาเดินทางรวม','40 นาที']]);
 case 10:return picture('taxi','เวลา · ค่าเดินทาง · จำนวนช่วงการเดินทาง');
 case 11:
  if(t<9)return picture('cutaway','ค่าเช่าสัมพันธ์กับหลายปัจจัยพร้อมกัน');
  if(t>=32&&t<37)return picture('taxi','ใกล้ ไม่ได้แปลว่าสะดวกเสมอไป');
  if(t>=50&&t<66)return picture('cutaway','ดูปัจจัยร่วมกัน เพื่อแยกความสัมพันธ์ให้ชัดขึ้น');
  return picture('map','',[],'model');
 case 12:return picture(t<27?'amenities':'compare','S · ลักษณะห้องและอาคาร');
 case 13:return picture(t<24?'transit':'traffic','L · การเดินทาง');
 case 14:return picture(t<20?'pool':'guard','N · สิ่งอำนวยความสะดวก');
 case 15:return picture('room','SL · ลักษณะห้องและอาคาร + การเดินทาง');
 case 16:return picture('residence','SN · ลักษณะห้องและอาคาร + สิ่งอำนวยความสะดวก');
 case 17:return picture('wifi','LN · การเดินทาง + สิ่งอำนวยความสะดวก');
 case 18:return picture(t<24?'room-students':'closing',t<24?'SLN · พิจารณาปัจจัยครบทั้งสามกลุ่ม':'น้องหมุด • สองที่พัก สองคำตอบ');
 default:return picture('closing');
 }
}
function syncPlayer(){
 const time=film.currentTime||0,total=Number.isFinite(film.duration)?film.duration:532.96;
 get('seek').max=total;get('seek').value=time;
 get('timer').value=timeLabel(time)+' / '+timeLabel(Math.ceil(total));
 get('play').textContent=film.paused?'▶ เล่น':'Ⅱ พัก';
 const active=chapterButtons.findLast(b=>time>=Number(b.dataset.time));
 chapterButtons.forEach(b=>b.setAttribute('aria-pressed',b===active));
 if(!tracks.length)return;
 const n=Math.max(0,tracks.findLastIndex(s=>time>=s.start));
 if(n!==lastTrack){get('track').value=n;lastTrack=n;}
 const c=composition(n,time-tracks[n].start);
 if(c.name!==lastScene){get('scene').src='scenes/'+c.name+'.jpg';get('scene').alt=names[n];lastScene=c.name;}
 get('scene-label').textContent=c.label;
 get('study-map').hidden=c.mode!=='map';get('model-panel').hidden=c.mode!=='model';
 const signature=JSON.stringify(c.cards);
 if(get('scene-cards').dataset.current!==signature){get('scene-cards').dataset.current=signature;get('scene-cards').replaceChildren(...c.cards.map(([text,value])=>{const el=document.createElement('div');el.className='scene-card';el.textContent=text;const strong=document.createElement('strong');strong.textContent=value;el.append(strong);return el;}));}
}
async function play(){try{await film.play();get('play-status').textContent='';}catch(e){get('play-status').textContent='กดเล่นอีกครั้งเพื่อเริ่มเสียงบรรยาย';syncPlayer();}}
function togglePlay(){if(film.paused)play();else film.pause();}
['timeupdate','pause','play','seeked','ended','loadedmetadata'].forEach(e=>film.addEventListener(e,syncPlayer));
film.addEventListener('error',()=>get('play-status').textContent='โหลดเสียงไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองอีกครั้ง');
get('play').addEventListener('click',togglePlay);get('stage').addEventListener('click',togglePlay);
get('seek').addEventListener('input',e=>{film.currentTime=Number(e.target.value);syncPlayer();});
chapterButtons.forEach(b=>b.addEventListener('click',()=>{film.currentTime=Number(b.dataset.time);syncPlayer();play();}));
get('track').addEventListener('change',e=>{film.currentTime=tracks[Number(e.target.value)].start;syncPlayer();play();});
get('mute').addEventListener('click',()=>{film.muted=!film.muted;get('mute').textContent=film.muted?'✕ ปิดเสียง':'♫ เสียง';get('mute').setAttribute('aria-label',film.muted?'เปิดเสียง':'ปิดเสียง');});
get('full').addEventListener('click',async()=>{if(document.fullscreenElement){await document.exitFullscreen();return;}if(get('player').requestFullscreen){try{await get('player').requestFullscreen();return;}catch(e){}}get('player').classList.toggle('expanded');get('full').textContent=get('player').classList.contains('expanded')?'✕':'⛶';});
Promise.resolve(window.BUNDLED_TRACKS).then(data=>{tracks=data;get('track').replaceChildren(...data.map((a,i)=>{const o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' · '+names[i];return o;}));syncPlayer();}).catch(()=>get('play-status').textContent='โหลดลำดับเสียงไม่สำเร็จ กรุณารีเฟรช');
let coefficients={};
function showModel(){
 const model=get('model').value,area=Number(get('area').value),name=(model==='S+N+L'?'SLN':model.replaceAll('+',''))+' · '+['วงรวม','วงใน','วงนอก'][area];
 const id=models[model][area];get('selection').textContent=name;get('result-label').textContent=name;
 const key=(model==='S+N+L'?'SLN':model.replaceAll('+',''))+'-'+area;
 get('estimate').src='results/'+key+'.png';get('original').href='https://drive.google.com/file/d/'+id+'/view';
 const data=coefficients[key];get('significant').replaceChildren();
 if(data){const h=document.createElement('h3');h.textContent='ตัวแปรที่มีนัยสำคัญทางสถิติ';get('significant').append(h);
 if(!data.rows.length){const p=document.createElement('p');p.textContent='ไม่พบตัวแปรอิสระที่มีนัยสำคัญ ณ ระดับความเชื่อมั่น 90% ขึ้นไปในแบบจำลองนี้';get('significant').append(p);}else{
 const table=document.createElement('table');table.className='result-table';const head=table.createTHead().insertRow();for(const text of ['ตัวแปร','ค่าสัมประสิทธิ์ (บาท/เดือน)']){const th=document.createElement('th');th.textContent=text;head.append(th);}
 const body=table.createTBody();for(const item of data.rows){const row=body.insertRow();row.insertCell().textContent=item.label;const cell=row.insertCell();cell.textContent=(item.value>0?'+':'')+item.value.toLocaleString('en-US',{maximumFractionDigits:2})+item.stars;if(item.value<0)cell.className='neg';}get('significant').append(table);}
 const note=document.createElement('p');note.className='result-note';note.textContent='OLS · ระดับความเชื่อมั่น: *** 99% · ** 95% · * 90%';get('significant').append(note);}
}
get('model').addEventListener('change',showModel);get('area').addEventListener('change',showModel);
get('preview').addEventListener('click',()=>{get('enlarged').src=get('estimate').src;get('zoom').showModal();});
get('zoom').addEventListener('click',e=>{if(e.target===get('zoom'))get('zoom').close();});
Promise.resolve(window.BUNDLED_COEFFICIENTS).then(d=>{coefficients=d;showModel();}).catch(()=>{});
showModel();syncPlayer();
