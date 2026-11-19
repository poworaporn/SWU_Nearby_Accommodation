/* Audio-clock driven animation: pausing and seeking preserve every pose and cue. */
const layer=document.createElement('div');layer.id='motion-layer';get('stage').append(layer);
const board=document.createElement('div');board.id='story-board';get('stage').append(board);
const resultOrder=['S','L','N','SL','SN','LN','SLN'];
const norm=v=>v.replace('S+N+L','SLN').replaceAll('+','');

let revisionKey='',paintedScene='',departure=1;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function actor(file,x=3,ground=94,height=24){const h=file.startsWith('mascot')?height*1.3:height,w=h*.7;x=Math.min(x,98-w);return `<img class="still-actor" src="sprites/${file}.png" style="left:${x}%;top:${ground-h}%;height:${h}%;width:${w}%" alt="${file.startsWith('mascot')?'น้องหมุด':'นิสิต'}">`;}
function walker(who,x,ground=88,height=37,phase=0){if(who==='mascot')height*=1.25;return `<div class="walker ${who}" data-phase="${phase}" style="left:${x}%;top:${ground-height}%;height:${height}%;--ratio:${who==='mascot'?1:0.667}" role="img" aria-label="${who==='mascot'?'น้องหมุด':'นิสิต'}เดินสลับแขนขา"></div>`;}
function panel(h,c){return `<div class="info-panel"><h2>${h}</h2>${c}</div>`;}
function factorCard(code,label){return `<div class="single-factor"><b>${code}</b><span>${label}</span></div>`;}
function factors(){return '<div class="factors"><b>S<small>ห้องและอาคาร</small></b><b>L<small>การเดินทาง</small></b><b>N<small>ส่วนกลางและสภาพแวดล้อม</small></b></div>';}
function route(active=0,mrt=false){const stops=mrt?['เดิน','MRT ใต้ดิน','เดิน']:['เดิน','วิน','BTS','วิน'];return `<div class="route">${stops.map((s,i)=>`<b class="${i===active?'active':''}">${s}</b>`).join('')}</div>`;}
function travelDiagram(t){const k=Math.min(3,Math.floor(t/1.5));return panel('การเดินทาง = มากกว่าระยะทาง',`<div class="route diagram-route">${['เดิน','วิน','รถไฟฟ้า','เดิน'].map((s,i)=>`<b class="${i<=k?'active':''}"><small>${i+1}</small>${s}</b>`).join('')}</div><div class="factors"><b>เวลา<small>TimeAvg · นาที</small></b><b>ค่าใช้จ่าย<small>CostAvg · บาท/เที่ยว</small></b><b>ขั้นตอน<small>StepsAvg · ช่วงการเดินทาง</small></b></div>`);}
function mapGraphic(){return '<div class="map-schematic"><div class="area-diagram"><div class="outer-circle"><div class="inner-circle"><b>มศว<br>ประสานมิตร</b></div></div></div><aside><div><b>วงใน ≤ 3 กม.</b><span>46 ตัวอย่าง</span></div><div><b>วงนอก > 3–6 กม.</b><span>32 ตัวอย่าง</span></div><div><b>วงรวม</b><span>78 ตัวอย่าง</span></div></aside><small>แผนภาพประกอบ ไม่ใช่มาตราส่วนจริง</small></div>';}
function olsChart(){return `<div class="chart"><svg viewBox="0 0 600 260" role="img" aria-label="จุดข้อมูลและเส้นถดถอยค่อย ๆ ปรากฏ"><path d="M50 20v205h510" class="axis"/><text x="8" y="17">ค่าเช่า</text><text x="485" y="255">ขนาดห้อง</text><path d="M65 205L530 50" class="regression" pathLength="1"/>${[[90,190],[165,198],[220,135],[300,145],[380,80],[440,92],[510,45]].map(([x,y],i)=>`<g style="--delay:${i*.5}s"><path class="residual" d="M${x} ${y}V${225-(x-50)*.334}"/><circle cx="${x}" cy="${y}" r="6"/></g>`).join('')}</svg><small>ภาพสาธิตหนึ่งตัวแปร · งานวิจัยใช้หลายตัวแปรร่วมกัน<br>ส่วนเหลือ = ค่าจริง − ค่าทำนาย</small></div>`;}
const visuals={type:'compare',roomSize:'room-urban',floor:'elevator',aircon:'aircon',microwave:'microwave',water_heater:'water-heater',stove:'stove',Bldg_New:'condo-urban',TimeAvg:'transport-city',CostAvg:'travel-cost',StepsAvg:'travel-steps',pool:'pool-clean',WiFi_Free:'room-urban',parking:'parking',SecPoints:'guard'};
function valueText(r){return (r.value>0?'+':'')+r.value.toLocaleString('en-US',{maximumFractionDigits:2});}
function resultCard(r){return `<div class="result-focus" data-variable="${esc(r.variable)}"><span>${esc(r.label.split(' · ')[0])}</span><b class="${r.value<0?'neg':''}">${valueText(r)}</b><small>บาท/เดือน${r.variable==='roomSize'?' ต่อ 1 ตร.ม.':r.variable==='TimeAvg'?' ต่อ 1 นาที':r.variable==='CostAvg'?' ต่อค่าเดินทาง 1 บาท':r.variable==='StepsAvg'?' ต่อ 1 ช่วงการเดินทาง':''}</small><em>ระดับความเชื่อมั่น ${r.stars.length===3?'99':r.stars.length===2?'95':'90'}%</em></div><div class="stat-note">ค่าสัมประสิทธิ์ OLS · คงตัวแปรอื่นในแบบจำลองไว้ · ความสัมพันธ์ ≠ เหตุและผล</div>`;}
const resultCues={S:[4.6,16.74,25.28,29.98],L:[3.16,18.96,30.8,35.36],N:[8,23.12,27.12,42],SL:[5.86,28.12,38.56,46.8],SN:[7.34,16.44,19.26,23.48],LN:[5.96,15.88,18.5,21.3],SLN:[7.18,16.32,23.9,28.88]};
const confidence=r=>r.stars.length===3?'99':r.stars.length===2?'95':'90';
function resultThumb(r){return r.variable==='type'?'compare':['roomSize','floor','aircon','microwave','water_heater','stove','Bldg_New'].includes(r.variable)?'detail/'+r.variable:(visuals[r.variable]==='travel-cost'?'transport-city':visuals[r.variable]==='travel-steps'?'transport-city':visuals[r.variable]);}
function smallNumber(r,i,active){return `<div class="compact-value ${i===active?'current':''}" data-variable="${esc(r.variable)}"><span>${esc(r.label.split(' · ')[0])}</span><b class="${r.value<0?'neg':''}">${valueText(r)}</b><small>ระดับความเชื่อมั่น ${confidence(r)}%</small></div>`;}
function resultFrame(m,t){
 const cues=resultCues[m];let area=t<cues[1]?0:t<cues[2]?1:2;
 if(t<cues[0])return {scene:'swu-gate',title:m+' · '+names[12+resultOrder.indexOf(m)].split(' · ').slice(1).join(' · '),html:panel('พิจารณาปัจจัยร่วมกัน',factorCard(m,{S:'ห้องและอาคาร',L:'การเดินทาง',N:'สิ่งอำนวยความสะดวก',SL:'ห้อง + การเดินทาง',SN:'ห้อง + ส่วนกลาง',LN:'การเดินทาง + ส่วนกลาง',SLN:'ครบทั้งสามกลุ่ม'}[m])),actors:actor('mascot-thinking',3,95,22)};
 const summary=t>=cues[3];if(summary)area=0;
 const rows=coefficients[m+'-'+area]?.rows||[],start=summary?cues[3]:cues[area],end=summary?tracks[12+resultOrder.indexOf(m)].duration:cues[area+1],slot=(end-start)/Math.max(1,rows.length),index=rows.length?clamp(Math.floor((t-start)/Math.max(.5,slot)),0,rows.length-1):0;
 const title=m+' · '+['วงรวม · 78 ตัวอย่าง','วงใน ≤ 3 กม. · 46 ตัวอย่าง','วงนอก > 3–6 กม. · 32 ตัวอย่าง'][area];
 if(!rows.length)return {scene:'swu-gate',title,html:'<aside class="empty-result"><h2>ไม่พบตัวแปรที่มีนัยสำคัญ</h2><p>ที่ระดับความเชื่อมั่น 90% ขึ้นไป<br>ในแบบจำลองและพื้นที่นี้</p><small>ไม่ได้แปลว่าไม่มีความสัมพันธ์ในทุกบริบท</small></aside>',actors:actor('mascot-thinking',3,95,22),cue:m+'-'+area+'-none'};
 const note='<div class="stat-note">ค่าสัมประสิทธิ์ค่าเช่า (บาท/เดือน) · คงตัวแปรอื่นในสมการไว้ · ระดับความเชื่อมั่น 90% / 95% / 99%</div>';
 if(rows.length>=4){const shown=summary?rows.length:index+1;return {scene:'compare',title,html:'<div class="result-gallery count-'+rows.length+'">'+rows.map((r,i)=>`<div class="gallery-item ${i===index?'current':''}" style="visibility:${i<shown?'visible':'hidden'}"><img src="scenes/${resultThumb(r)}.jpg" alt="${esc(r.label)}">${smallNumber(r,i,index)}</div>`).join('')+'</div>'+note,actors:'',cue:m+'-'+area+'-'+shown};}
 const r=rows[index],travel=rows.every(x=>/Time|Cost|Steps/.test(x.variable));let scene=travel?'transport-city':(rows[0].variable==='roomSize'?'room-urban':resultThumb(rows[0])),actors='';
 if(travel)actors='';
 else if(rows[0].variable==='pool')actors=actor('mascot-pool',43,72,23);
 else if(scene==='compare')actors=actor('mascot',45,95,22);
 else if(!['detail/','travel-emotions'].some(x=>scene.includes(x)))actors=actor('mascot-thinking',3,95,22);

 const visible=summary?rows:rows.slice(0,index+1);
 return {scene,title,html:`<div class="compact-results ${rows.length===1?'single':''}">${visible.map((r,i)=>smallNumber(r,i,index)).join('')}</div>`+note,actors,cue:m+'-'+area+'-'+index};
}
function journeyGraphic(){return `<div class="journey-graphic"><h2>การเดินทาง = มากกว่าระยะทาง</h2><p>ตัวชี้วัด L: TimeAvg · CostAvg · StepsAvg</p><svg viewBox="0 0 1000 500" aria-label="เส้นทาง เดิน วิน รถไฟฟ้า เดิน"><path d="M220 250H875" fill="none" stroke="#91bac1" stroke-width="10"/>${[220,440,660,875].map((x,i)=>`<circle cx="${x}" cy="250" r="26" fill="#fff8e8"/><text x="${x}" y="258" text-anchor="middle">${i+1}</text>`).join('')}</svg><div class="journey-stops">${['เดิน','วิน','รถไฟฟ้า','เดิน'].map(v=>`<b>${v}</b>`).join('')}</div><div class="journey-metrics"><b>เวลา<small>นาที</small></b><b>ค่าใช้จ่าย<small>บาท / เที่ยว</small></b><b>ขั้นตอน<small>ช่วงการเดินทาง</small></b></div></div>`;}
function journeyActors(t){return walker('mascot',18+(t%8)/8*61,48.5,16);}
function modelCombinations(i){return '<div class="combination-grid">'+['S','L','N','SL','SN','LN','SLN'].map((v,j)=>`<div class="${j===i?'active':''} ${j>i?'future':''}"><b>${v}</b><small>${j<3?'แยกกลุ่ม':j<6?'จับคู่':'รวมทุกกลุ่ม'}</small></div>`).join('')+'</div>';}
function amenitiesLabels(){return '<div class="amenity-callouts"><b class="wifi">Wi-Fi · ที่จอดรถ · ความปลอดภัย</b><b class="gym">ฟิตเนส</b><b class="pool">สระว่ายน้ำ</b><b class="laundry">เครื่องซักผ้า</b></div>';}
composition=function(n,t){
 departure=1;let scene='campus-urban',title='',html='',actors='',cards=[],cue='',layout='clear',walkTime=t;
 if(n===0){scene='condo-urban';title='ที่พักใกล้ มศว · 8,500 บาท/เดือน';actors=walker('girl',7+t*3,87,26)+walker('boy',23+t*3,87,27,2)+walker('mascot',47+t*2,87,22);}
 if(n===1){scene='room-urban';title='ทีวี · Wi-Fi · ตู้เย็น · เครื่องซักผ้า';actors=actor('mascot',46,91,29);}
 if(n===2){scene='traffic';title='อโศก · ตึก รถ และเวลาเดินทาง';}
 if(n===3){scene='apartment-clean';title='อีกทางเลือก · 5,500 บาท/เดือน';actors=actor('mascot',30,92,24);}
 if(n===4){scene='blue-urban';title=t<5?'ห้องเล็กกว่า · เครื่องใช้ต่างกัน':'เครื่องซักผ้าส่วนกลางใต้ตึก';actors='';}
 if(n===5){scene='compare';title='ค่าเช่าต่างกัน 3,000 บาท/เดือน';html='<div class="comparison-tags"><b>8,500 บาท/เดือน</b><b>5,500 บาท/เดือน</b></div>';actors=actor('mascot-thinking',3,95,20);}
 if(n===6){scene='map-phone';title='สำรวจที่พักรอบ มศว';html='';actors='';layout='clear';}
 if(n===7){scene=t<5.6?'survey-measure':'survey-phone';title=t<5.6?'วัดขนาดห้อง':'สำรวจที่พัก · 78 รายการ';}
 if(n===8){const a=t<2.8?0:t<4.9?1:2;scene=a===0?'transit-clean':a===1?'mrt-underground':'swu-gate';title=a===2?'ถึง มศว · รวม 20 นาที':'เดิน · MRT ใต้ดิน · เดิน';html=route(a,true);actors=walker('girl',a===0?28+t*4:a===1?35+(t-2.8)*5:48+(t-4.9)*3,a===0?91:a===1?91:91,a===2?26:34);}
 if(n===9){let a=t<2?0:t<4?1:t<6.2?2:3;scene=t<2?'apartment-clean':t<4?'bike-road':t<6.2?'train-clean':t<7.8?'traffic':'swu-gate';title=t<7.8?'เดิน · วิน · BTS · วิน':'ถึง มศว · รวม 40 นาที';html=route(a,false);if(t<2)actors='';else if(t<4)actors=`<div class="rider" style="left:${4+(t-2)*13}%;top:43%;height:49%"><img src="sprites/bike.png" alt="นั่งวินมอเตอร์ไซค์ ล้อติดถนน"></div>`;else if(t<6.2)actors=walker('boy',25+(t-4)*6,92,36);else if(t>=7.8)actors=actor('boy-tired',45,91,27);}
 if(n===10){scene=t<5.7?'campus-stadium':'swu-gate';title=t<5.7?'เวลา ค่าใช้จ่าย และจำนวนช่วงเดินทาง':'ใกล้ ไม่ได้แปลว่าสะดวกเสมอไป';if(t<5.7)actors=walker('mascot',7+t*8,93,25);else {html=journeyGraphic();actors=journeyActors(t-5.7);layout='journey';}}
 if(n===11){layout='info';actors=actor('mascot-thinking',3,95,22);title='Hedonic Pricing · OLS';
  if(t<22){scene='cutaway';html=amenitiesLabels();layout='clear';actors='';}
  else if(t<32.3){scene='cutaway';html=panel('หนึ่งแถว = ข้อมูลที่พักหนึ่งรายการ','<table><tr><th>ที่พัก</th><th>Rent (บาท)</th><th>ขนาดห้อง</th></tr><tr><td>1</td><td>5,500</td><td>24 ตร.ม.</td></tr><tr><td>2</td><td>6,500</td><td>28 ตร.ม.</td></tr><tr><td>3</td><td>7,200</td><td>32 ตร.ม.</td></tr><tr><td>4</td><td>8,500</td><td>40 ตร.ม.</td></tr></table><small>ข้อมูลสมมติ เพื่ออธิบายแนวคิด</small>');}
  else if(t<37.3){scene='transport-city';html=journeyGraphic();actors=journeyActors(t-32.3);layout='journey';}
  else if(t<50){html=panel('OLS · วิธีกำลังสองน้อยที่สุด',olsChart());}
  else if(t<68.3){scene='condo-urban';html=panel('ห้องเล็ก อาจมาพร้อมอย่างอื่น',factorCard(['S','S','N'][Math.min(2,Math.floor((t-50)/6))],['ห้องเล็ก','อาคารใหม่','ส่วนกลางพร้อม'][Math.min(2,Math.floor((t-50)/6))]));cue=Math.floor((t-50)/6);}
  else if(t<85){const codes=['S','L','N','SL','SN','LN','SLN'];const i=clamp(Math.floor((t-68.3)/2.38),0,6);html=panel('3 กลุ่ม → 7 รูปแบบ',modelCombinations(i));cue=i;}
  else if(t<99){scene='campus-aerial';html=panel('7 รูปแบบ × 3 พื้นที่ = 21 แบบจำลอง',mapGraphic());}
  else if(t<110.7){const i=Math.floor((t-99)/3.9);html=panel('อ่านผลอย่างเข้าใจ',factorCard(['+ / −','β','90 · 95 · 99%'][Math.min(i,2)],['ทิศทางความสัมพันธ์','ขนาดความสัมพันธ์','ระดับความเชื่อมั่น'][Math.min(i,2)])+'<p>ความสัมพันธ์ ≠ เหตุและผล</p>');cue=i;}
  else {scene='swu-gate';html='<div class="research-transition"><h2>จากคำถาม<br>สู่แบบจำลอง</h2><p>แล้วข้อมูลจริงบอกอะไร?</p>'+factors()+'</div>';layout='clear';title='';actors=actor('mascot-thinking',5,94,25);}
 }
 if(n>=12&&n<=18){const f=resultFrame(resultOrder[n-12],t);({scene,title,html,actors,cue}=f);layout=html.includes('info-panel')?'info':'result';}
 if(n===19){scene=t<10?'closing-wai':'closing';title=t<10?'ค่าเช่าหนึ่งห้อง มีหลายปัจจัยอยู่เบื้องหลัง':'น้องหมุดพาทัวร์ · ขอบคุณที่รับชม';}
 if(['cutaway','closing','closing-wai','travel-emotions','transport-city','blue-room','blue-urban'].includes(scene))actors='';
 const key=[n,scene,title,html,actors.replace(/left:[^;]+/g,'left:dynamic'),cue,layout].join('|');
 if(key!==revisionKey){layer.innerHTML=actors;board.innerHTML=html;board.className=layout;revisionKey=key;get('stage').dataset.scene=scene;get('stage').dataset.track=n;get('stage').dataset.layout=html.includes('result-gallery')?'gallery':layout;if(scene!==paintedScene){get('scene').classList.remove('scene-enter');void get('scene').offsetWidth;get('scene').classList.add('scene-enter');paintedScene=scene;}}
 // Position changes never recreate the elements or restart their entrance animations.
 const temp=document.createElement('template');temp.innerHTML=actors;
 [...layer.children].forEach((el,i)=>{const src=temp.content.children[i];if(src)el.style.cssText=src.style.cssText;});
 layer.querySelectorAll('.walker').forEach(el=>{const f=(Math.floor(walkTime*7)+Number(el.dataset.phase))%4;el.style.backgroundPosition=`${f%2?100:0}% ${f>1?100:0}%`;const baseline=el.classList.contains('girl')?[0.9466, 0.9453, 0.9505, 0.9466][f]:el.classList.contains('boy')?[0.9544, 0.9557, 0.9609, 0.9622][f]:[.8979,.8979,.8963,.8963][f];el.style.transform=`translateY(${(1-baseline)*100}%)`; });
 const focus=board.querySelector('.result-focus');if(focus)focus.style.opacity=departure;const chart=board.querySelector('.chart');if(chart)chart.style.setProperty('--progress',clamp((t-37.3)/6,0,1));
 get('stage').classList.toggle('is-paused',film.paused);get('scene').style.transform='none';
 return picture(scene,title,cards,'');
};
function animateRevision(){if(!film.paused)syncPlayer();requestAnimationFrame(animateRevision);}requestAnimationFrame(animateRevision);
get('model').addEventListener('change',()=>{get('results').querySelector('.illustration').src='scenes/'+({S:'condo-urban',L:'mrt-underground',N:'pool-clean',SL:'room-urban',SN:'pool-clean',LN:'wifi',SLN:'room-urban'})[norm(get('model').value)]+'.jpg';});
get('results').querySelector('.illustration').src='scenes/compare.jpg';
const closingButton=document.createElement('button');closingButton.textContent='บทสรุป';closingButton.dataset.time='512.76';closingButton.addEventListener('click',()=>{film.currentTime=tracks[19]?.start||512.76;syncPlayer();play();});get('chapters').append(closingButton);chapterButtons.push(closingButton);

syncPlayer();
