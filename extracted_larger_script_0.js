
(function(){
'use strict';

/* ── STATE ── */
var state = {
  file: null,
  fileType: null,   // 'pdf' | 'image'
  sortMode: 'courier',
  labels: [],       // [{canvas, courier, sku, orderNum, qty}]
  sorted: []        // sorted copy
};

/* ── ELEMENTS ── */
var fileInput    = document.getElementById('m2-file-input');
var uploadZone   = document.getElementById('m2-upload-zone');
var uploadWrap   = document.getElementById('m2-upload-wrap');
var chip         = document.getElementById('m2-chip');
var chipName     = document.getElementById('m2-chip-name');
var chipRemove   = document.getElementById('m2-chip-remove');
var optionsDiv   = document.getElementById('m2-options');
var processBtn   = document.getElementById('m2-process-btn');
var progressWrap = document.getElementById('m2-progress');
var progressBar  = document.getElementById('m2-progress-bar');
var progressTxt  = document.getElementById('m2-progress-txt');
var resultsDiv   = document.getElementById('m2-results');
var previewGrid  = document.getElementById('m2-preview-grid');
var previewCount = document.getElementById('m2-preview-count');
var courierTbody = document.getElementById('m2-courier-tbody');
var skuTbody     = document.getElementById('m2-sku-tbody');
var dlPdf        = document.getElementById('m2-dl-pdf');
var dlZip        = document.getElementById('m2-dl-zip');
var btnNew       = document.getElementById('m2-new');
var workCanvas   = document.getElementById('m2-work-canvas');
var wCtx         = workCanvas.getContext('2d');
var toast        = document.getElementById('m2-toast');

/* ── SORT BUTTONS ── */
document.querySelectorAll('.mlct2-sort-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.mlct2-sort-btn').forEach(function(b){ b.classList.remove('active'); });
    this.classList.add('active');
    state.sortMode = this.dataset.sort;
  });
});

/* ── DRAG DROP ── */
uploadZone.addEventListener('dragover', function(e){ e.preventDefault(); uploadZone.classList.add('over'); });
uploadZone.addEventListener('dragleave', function(){ uploadZone.classList.remove('over'); });
uploadZone.addEventListener('drop', function(e){
  e.preventDefault(); uploadZone.classList.remove('over');
  var f = e.dataTransfer.files[0];
  if(f) handleFile(f);
});
fileInput.addEventListener('change', function(e){
  if(e.target.files[0]) handleFile(e.target.files[0]);
});

function handleFile(f){
  state.file = f;
  state.fileType = f.type === 'application/pdf' ? 'pdf' : 'image';
  chipName.textContent = f.name + ' (' + (f.size/1024).toFixed(0) + ' KB)';
  chip.style.display = 'flex';
  optionsDiv.style.display = 'block';
  resultsDiv.style.display = 'none';
  progressWrap.style.display = 'none';
}

chipRemove.addEventListener('click', resetAll);

function resetAll(){
  state.file = null; state.labels = []; state.sorted = [];
  fileInput.value = '';
  chip.style.display = 'none';
  optionsDiv.style.display = 'none';
  resultsDiv.style.display = 'none';
  progressWrap.style.display = 'none';
  processBtn.disabled = false;
  processBtn.textContent = '✂️ Prepare Shipping Labels';
}

/* ── PROCESS ── */
processBtn.addEventListener('click', function(){
  if(!state.file) return;
  processBtn.disabled = true;
  resultsDiv.style.display = 'none';
  progressWrap.style.display = 'block';
  setProgress(5, 'Reading file…');

  if(state.fileType === 'pdf'){
    processPDF();
  } else {
    processImage();
  }
});

/* ── PDF PROCESSING ── */
function processPDF(){
  var reader = new FileReader();
  reader.onload = function(e){
    setProgress(15, 'Loading PDF…');
    var typedArray = new Uint8Array(e.target.result);
    pdfjsLib.getDocument(typedArray).promise.then(function(pdf){
      var totalPages = pdf.numPages;
      state.labels = [];
      var processed = 0;

      function doPage(pageNum){
        pdf.getPage(pageNum).then(function(page){
          // Render at 2x scale for quality
          var viewport = page.getViewport({ scale: 2.0 });
          var tempCanvas = document.createElement('canvas');
          tempCanvas.width  = viewport.width;
          tempCanvas.height = viewport.height;
          var tempCtx = tempCanvas.getContext('2d');

          page.render({ canvasContext: tempCtx, viewport: viewport }).promise.then(function(){
            // Extract text for courier/SKU detection
            page.getTextContent().then(function(textContent){
              var allText = textContent.items.map(function(i){ return i.str; }).join(' ');
              var info = extractLabelInfo(allText, pageNum);

              // Determine how many labels per page (A4 = 2 labels of 4x6)
              var labelsPerPage = detectLabelsPerPage(tempCanvas);
              var crops = cropLabelsFromPage(tempCanvas, labelsPerPage);

              crops.forEach(function(cropCanvas, idx){
                state.labels.push({
                  canvas:   cropCanvas,
                  courier:  info.courier,
                  sku:      info.sku,
                  orderNum: info.orderNum || ('Page ' + pageNum + '-' + (idx+1)),
                  qty:      info.qty
                });
              });

              processed++;
              var pct = 15 + Math.round((processed / totalPages) * 70);
              setProgress(pct, 'Processed ' + processed + ' of ' + totalPages + ' pages…');

              if(processed === totalPages){
                setProgress(90, 'Sorting labels…');
                setTimeout(function(){ finalise(); }, 100);
              } else {
                doPage(pageNum + 1);
              }
            });
          });
        });
      }
      doPage(1);
    }).catch(function(err){
      showToast('❌ Could not read PDF. Try a different file.');
      processBtn.disabled = false;
      progressWrap.style.display = 'none';
    });
  };
  reader.readAsArrayBuffer(state.file);
}

/* ── IMAGE PROCESSING ── */
function processImage(){
  var reader = new FileReader();
  reader.onload = function(e){
    setProgress(30, 'Reading image…');
    var img = new Image();
    img.onload = function(){
      setProgress(60, 'Cropping labels…');
      var tempCanvas = document.createElement('canvas');
      tempCanvas.width  = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      var tc = tempCanvas.getContext('2d');
      tc.drawImage(img, 0, 0);

      var labelsPerPage = detectLabelsPerPage(tempCanvas);
      var crops = cropLabelsFromPage(tempCanvas, labelsPerPage);
      state.labels = crops.map(function(c, i){
        return { canvas: c, courier: 'Unknown', sku: 'Unknown', orderNum: 'Label-' + (i+1), qty: 1 };
      });
      setProgress(90, 'Finalising…');
      setTimeout(finalise, 100);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(state.file);
}

/* ── DETECT LABELS PER PAGE ── */
function detectLabelsPerPage(canvas){
  // A4 at 2x = ~1654x2339. Two 4x6 labels stacked = each ~1654x1169
  var ratio = canvas.height / canvas.width;
  if(ratio > 1.8) return 2;   // tall A4 → 2 labels stacked
  if(ratio > 0.9) return 1;   // square-ish or landscape
  return 1;
}

/* ── CROP LABELS FROM PAGE ── */
function cropLabelsFromPage(srcCanvas, count){
  var result = [];
  var w = srcCanvas.width;
  var h = srcCanvas.height;
  for(var i = 0; i < count; i++){
    var labelH = Math.floor(h / count);
    var offsetY = i * labelH;
    var out = document.createElement('canvas');
    // Target 4:6 ratio (w:h = 2:3)
    var targetH = Math.floor(w * 1.5);
    out.width  = w;
    out.height = Math.min(labelH, targetH);
    var oc = out.getContext('2d');
    oc.drawImage(srcCanvas, 0, offsetY, w, out.height, 0, 0, w, out.height);
    result.push(out);
  }
  return result;
}

/* ── EXTRACT TEXT INFO ── */
var COURIERS = [
  'Delhivery','Valmo','Ecom Express','Ekart','XpressBees','Shadowfax',
  'DTDC','Blue Dart','Shiprocket','WareIQ','Pickrr','Nimbus','Smartr',
  'Amazon Logistics','IndiaPost'
];

function extractLabelInfo(text, pageNum){
  var courier = 'Unknown';
  var sku     = 'Unknown';
  var orderNum = '';
  var qty      = 1;

  // Detect courier
  var tu = text.toUpperCase();
  for(var i = 0; i < COURIERS.length; i++){
    if(tu.indexOf(COURIERS[i].toUpperCase()) > -1){
      courier = COURIERS[i]; break;
    }
  }

  // Detect Order ID (Meesho format: starts with digits, 9-14 chars)
  var orderMatch = text.match(/\b(\d{9,14})\b/);
  if(orderMatch) orderNum = orderMatch[1];
  else orderNum = 'Order-' + pageNum;

  // Detect SKU (look for SKU: or Product ID patterns)
  var skuMatch = text.match(/SKU[:\s]+([A-Z0-9\-_]+)/i)
    || text.match(/Product[:\s]+([A-Z0-9\-_]{4,20})/i);
  if(skuMatch) sku = skuMatch[1].trim();
  else {
    // fallback: use first uppercase word-like token 4-12 chars
    var tokens = text.match(/\b([A-Z]{3,4}[0-9]{2,8})\b/);
    if(tokens) sku = tokens[1];
  }

  // Detect qty (Qty: or Pcs: patterns)
  var qtyMatch = text.match(/(?:Qty|Pcs|Pieces?)[:\s]+(\d+)/i);
  if(qtyMatch) qty = parseInt(qtyMatch[1], 10) || 1;

  return { courier: courier, sku: sku, orderNum: orderNum, qty: qty };
}

/* ── SORT & FINALISE ── */
function finalise(){
  state.sorted = state.labels.slice();

  if(state.sortMode === 'courier'){
    state.sorted.sort(function(a, b){ return a.courier.localeCompare(b.courier); });
  } else if(state.sortMode === 'sku'){
    state.sorted.sort(function(a, b){ return a.sku.localeCompare(b.sku); });
  }

  buildSummaryTables();
  buildPreviewGrid();
  setProgress(100, 'Done!');
  setTimeout(function(){
    progressWrap.style.display = 'none';
    resultsDiv.style.display = 'block';
    processBtn.disabled = false;
    showToast('✅ ' + state.sorted.length + ' labels ready!');
  }, 400);
}

/* ── SUMMARY TABLES ── */
function buildSummaryTables(){
  // Courier summary
  var courierMap = {};
  state.sorted.forEach(function(l){
    courierMap[l.courier] = (courierMap[l.courier] || 0) + 1;
  });
  courierTbody.innerHTML = '';
  Object.keys(courierMap).sort().forEach(function(c){
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + c + '</td><td><span class="mlct2-badge-count">' + courierMap[c] + '</span></td>';
    courierTbody.appendChild(tr);
  });
  // Total row
  var totTr = document.createElement('tr');
  totTr.innerHTML = '<td><strong>Total</strong></td><td><strong>' + state.sorted.length + '</strong></td>';
  courierTbody.appendChild(totTr);

  // SKU summary
  var skuMap = {};
  state.sorted.forEach(function(l){
    skuMap[l.sku] = (skuMap[l.sku] || 0) + l.qty;
  });
  skuTbody.innerHTML = '';
  Object.keys(skuMap).sort().forEach(function(s){
    var count = skuMap[s];
    var multi = count > 1 ? '<span class="mlct2-multi-badge">×' + count + '</span>' : '';
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + s + multi + '</td><td><span class="mlct2-badge-count">' + count + '</span></td>';
    skuTbody.appendChild(tr);
  });
  var skuTot = Object.values ? Object.values(skuMap).reduce(function(a,b){return a+b;},0)
    : Object.keys(skuMap).map(function(k){return skuMap[k];}).reduce(function(a,b){return a+b;},0);
  var skuTotTr = document.createElement('tr');
  skuTotTr.innerHTML = '<td><strong>Total</strong></td><td><strong>' + skuTot + '</strong></td>';
  skuTbody.appendChild(skuTotTr);
}

/* ── PREVIEW GRID ── */
function buildPreviewGrid(){
  previewGrid.innerHTML = '';
  previewCount.textContent = 'Cropped Labels (' + state.sorted.length + ')';

  state.sorted.forEach(function(label, idx){
    var div = document.createElement('div');
    div.className = 'mlct2-label-thumb';

    // Thumbnail canvas
    var thumb = document.createElement('canvas');
    var scale = 160 / label.canvas.width;
    thumb.width  = 160;
    thumb.height = Math.round(label.canvas.height * scale);
    var tc = thumb.getContext('2d');
    tc.drawImage(label.canvas, 0, 0, thumb.width, thumb.height);

    var meta = document.createElement('div');
    meta.className = 'mlct2-label-thumb-meta';
    meta.innerHTML = '<strong>#' + (idx+1) + ' · ' + label.orderNum + '</strong>' +
      '🚚 ' + label.courier + '<br>📦 ' + label.sku;

    div.appendChild(thumb);
    div.appendChild(meta);
    previewGrid.appendChild(div);
  });
}

/* ── DOWNLOAD PDF ── */
dlPdf.addEventListener('click', function(){
  if(!state.sorted.length) return;
  showToast('⏳ Generating PDF…');
  setTimeout(function(){
    try {
      var { jsPDF } = window.jspdf;
      // 4x6 inches in points (1 inch = 72pt)
      var pdf = new jsPDF({ orientation:'portrait', unit:'pt', format:[288, 432] });
      state.sorted.forEach(function(label, idx){
        if(idx > 0) pdf.addPage([288, 432]);
        var imgData = label.canvas.toDataURL('image/jpeg', 0.92);
        pdf.addImage(imgData, 'JPEG', 0, 0, 288, 432);
      });
      pdf.save('meesho-labels-' + state.sortMode + '-sorted.pdf');
      showToast('✅ PDF downloaded!');
    } catch(e) {
      showToast('❌ PDF generation failed. Try downloading as images.');
    }
  }, 100);
});

/* ── DOWNLOAD IMAGES (sequential PNG download) ── */
dlZip.addEventListener('click', function(){
  if(!state.sorted.length) return;
  showToast('⏳ Downloading images…');
  var delay = 0;
  state.sorted.forEach(function(label, idx){
    setTimeout(function(){
      var a = document.createElement('a');
      a.href = label.canvas.toDataURL('image/png');
      a.download = 'meesho-label-' + String(idx+1).padStart(3,'0') + '-' + label.courier.replace(/\s+/g,'-') + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if(idx === state.sorted.length - 1) showToast('✅ ' + state.sorted.length + ' images downloaded!');
    }, delay);
    delay += 120;
  });
});

/* ── NEW FILE ── */
btnNew.addEventListener('click', resetAll);

/* ── HELPERS ── */
function setProgress(pct, txt){
  progressBar.style.width = pct + '%';
  progressTxt.textContent = txt;
}
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(function(){ toast.classList.remove('show'); }, 3500);
}

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.mlct2-faq-q').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = this.closest('.mlct2-faq-item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.mlct2-faq-item').forEach(function(i){
      i.classList.remove('open');
      i.querySelector('.mlct2-faq-q').setAttribute('aria-expanded','false');
    });
    if(!wasOpen){ item.classList.add('open'); this.setAttribute('aria-expanded','true'); }
  });
});

})();
