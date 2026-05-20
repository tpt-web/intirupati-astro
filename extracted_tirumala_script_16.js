
(function(){
var state={
  crowd:'LOW TO MODERATE',
  waitFree:'12–15 Hours',
  ssdStatus:'Available',
  yesterday:{pilgrims:'73,035',tonsure:'27,090',hundi:'₹4.48 Cr',compartments:'25'}
};

function updateUI(){
  document.getElementById('bdp-crowd').textContent=state.crowd;
  document.getElementById('bdp-wait').textContent=state.waitFree;
  document.getElementById('bdp-ssd').textContent=state.ssdStatus;
  document.getElementById('bdp-sarva-time').textContent=state.waitFree;
  document.getElementById('bdp-divya-time').textContent='5–7 Hours';
  var sarvaS=document.getElementById('bdp-sarva-status');
  sarvaS.textContent=state.crowd.includes('LOW')?'Low':'Moderate';
  sarvaS.className='bdp-badge '+(state.crowd==='LOW'?'green':'amber');
  document.getElementById('bdp-ssd-status').textContent=state.ssdStatus;
  document.getElementById('bdp-pilgrims').textContent=state.yesterday.pilgrims;
  document.getElementById('bdp-tonsure').textContent=state.yesterday.tonsure;
  document.getElementById('bdp-hundi').textContent=state.yesterday.hundi;
  document.getElementById('bdp-comps').textContent=state.yesterday.compartments;
  var now=new Date();
  document.getElementById('bdp-last-update').textContent=now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})+', Today';
}

function showToast(msg){
  var t=document.getElementById('bdp-toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('show');},2800);
}

function fallback(){
  var h=new Date().getHours();
  if(h>=6&&h<9){state.waitFree='8–10 Hours';state.crowd='LOW';}
  else if(h>=9&&h<14){state.waitFree='12–15 Hours';state.crowd='LOW TO MODERATE';}
  else if(h>=14&&h<20){state.waitFree='15–18 Hours';state.crowd='MODERATE';}
  else{state.waitFree='10–12 Hours';state.crowd='LOW TO MODERATE';}
  updateUI();
  showToast('⚠️ Using estimated data');
}

async function fetchData(){
  try{
    var r=await fetch('https://r.jina.ai/http://news.tirumala.org/category/darshan/');
    var txt=await r.text();
    var wm=txt.match(/(?:waiting time|approx|approximately)[:\s]*(\d+[\-–\s]?\d*\s*hours?)/i);
    if(wm){state.waitFree=wm[1].replace(/\s+/g,' ').replace(/hours?/i,'Hours');}
    var h=parseInt(state.waitFree)||0;
    state.crowd=h<=10?'LOW':h<=15?'LOW TO MODERATE':h<=20?'MODERATE':'HIGH';
    updateUI();
    showToast('✅ Live status updated!');
  }catch(e){fallback();}
}

document.getElementById('bdp-refresh').addEventListener('click',function(){
  var btn=this;
  btn.classList.add('loading');
  btn.innerHTML='<i class="fas fa-sync-alt"></i> Updating…';
  setTimeout(function(){
    fetchData();
    btn.classList.remove('loading');
    btn.innerHTML='<i class="fas fa-sync-alt"></i> Refresh Live Status';
  },1200);
});

document.querySelectorAll('.bdp-faq-q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=this.closest('.bdp-faq-item');
    var wasOpen=item.classList.contains('open');
    document.querySelectorAll('.bdp-faq-item').forEach(function(i){i.classList.remove('open');});
    if(!wasOpen)item.classList.add('open');
  });
});

updateUI();
fetchData();
})();
