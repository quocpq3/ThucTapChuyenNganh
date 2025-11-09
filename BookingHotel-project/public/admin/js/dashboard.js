
    // LocalStorage keys
    const ROOMS_KEY = 'hotel_rooms_v1';
    const BOOKINGS_KEY = 'hotel_bookings_v1';
    const DEPOSIT_RATE = 0.2;

    // Utilities
    function uid(prefix='RM') { return prefix + '-' + Math.random().toString(36).slice(2,9).toUpperCase(); }
    function readJSON(key, fallback) { try { const r = localStorage.getItem(key); return r?JSON.parse(r):fallback; } catch(e){return fallback;} }
    function writeJSON(key, v){ localStorage.setItem(key, JSON.stringify(v)); }

    // Seed if empty
    function seedData(){
    if(!localStorage.getItem(ROOMS_KEY)){
    const rooms = [
{ id: uid('RM'), name:'P101', type:'Standard', price:800000, status:'available', description:'Phòng tiêu chuẩn thoải mái', capacity:2, beds:1, amenities:['Wifi','TV'] },
{ id: uid('RM'), name:'P102', type:'Deluxe', price:1200000, status:'occupied', description:'Phòng Deluxe có ban công', capacity:3, beds:2, amenities:['Wifi','TV','Minibar'] },
{ id: uid('RM'), name:'P201', type:'Suite', price:2200000, status:'maintenance', description:'Suite cao cấp với phòng khách riêng', capacity:4, beds:2, amenities:['Wifi','TV','Minibar','Bếp nhỏ'] }
    ];
    writeJSON(ROOMS_KEY, rooms);
}
    if(!localStorage.getItem(BOOKINGS_KEY)){
    writeJSON(BOOKINGS_KEY, [
{ id:'BK-1001', guest:'Nguyễn Văn A', phone:'0988123456', email:'a@example.com', idNumber:'12345678', roomId: readJSON(ROOMS_KEY,[])[0].id, roomLabel:'P101 · Standard', checkIn: getISODateOffset(1), checkOut:getISODateOffset(3), guests:2, notes:'', status:'confirmed', amount:800000, depositAmount:160000, depositPaid:true, createdAt: new Date().toISOString() }
    ]);
}
}

    function getISODateOffset(offsetDays=0){ const d=new Date(); d.setDate(d.getDate()+offsetDays); return d.toISOString().slice(0,10); }

    // Rendering
    function renderRooms(){
    const rooms = readJSON(ROOMS_KEY,[]);
    const el = document.getElementById('rooms-table'); el.innerHTML='';
    document.getElementById('rooms-count').textContent = rooms.length + ' phòng';
    rooms.forEach(r=>{
    const div = document.createElement('div'); div.className='p-3 border rounded flex items-center justify-between';
    div.innerHTML = `
          <div>
            <div class="font-medium">${r.name} — ${r.type}</div>
            <div class="text-xs text-muted">${r.capacity||'—'} khách • ${r.beds||'—'} giường</div>
            <div class="text-xs text-muted truncate-2">${r.description||''}</div>
            <div class="text-xs text-muted">Tiện nghi: ${(r.amenities||[]).join(', ')}</div>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <div class="px-2 py-1 rounded ${r.status==='available'?'bg-green-50 text-green-600':'bg-gray-100'}">${r.status}</div>
            <button data-id="${r.id}" class="btn-edit-room px-3 py-1 border rounded">Sửa</button>
            <button data-id="${r.id}" class="btn-del-room px-3 py-1 border rounded text-red-600">Xóa</button>
          </div>
        `;
    el.appendChild(div);
});
}

    function renderBookingsList(){
    const arr = readJSON(BOOKINGS_KEY,[]);
    const el = document.getElementById('bookings-list'); el.innerHTML='';
    arr.slice(0,6).forEach(b=>{
    const d = document.createElement('div'); d.className='p-2 border rounded';
    d.innerHTML = `<div class='font-medium'>${b.guest} — ${b.roomLabel}</div>
          <div class='text-xs text-muted'>${b.checkIn} → ${b.checkOut} • ${b.status} • Deposit: ${b.depositAmount?.toLocaleString?.('vi-VN')||0} ₫ (${b.depositPaid? 'Đã':'Chưa'})</div>`;
    el.appendChild(d);
});
}

    function renderCalendar(){
    const calendar = document.getElementById('calendar');
    const now = new Date(); const year=now.getFullYear(), month=now.getMonth();
    const first = new Date(year,month,1); const last = new Date(year,month+1,0); const days = last.getDate();
    calendar.innerHTML='';
    const header = document.createElement('div'); header.className='grid grid-cols-7 gap-1 mb-2 text-xs font-medium text-center text-muted';
    ['CN','T2','T3','T4','T5','T6','T7'].forEach(d=>{ const c=document.createElement('div'); c.textContent=d; header.appendChild(c); });
    calendar.appendChild(header);
    const grid = document.createElement('div'); grid.className='grid grid-cols-7 gap-1';
    // empty cells
    for(let i=0;i<first.getDay();i++){ const e=document.createElement('div'); e.className='calendar-cell bg-white rounded p-2 text-sm text-muted'; grid.appendChild(e);}
    // bookings map
    const bookings = readJSON(BOOKINGS_KEY,[]);
    function isBlocked(dStr){ return bookings.some(b=>{ if(b.status==='cancelled')return false; return (new Date(b.checkIn)<=new Date(dStr) && new Date(b.checkOut)>=new Date(dStr)); }); }
    for(let d=1;d<=days;d++){
    const dateStr = new Date(year,month,d).toISOString().slice(0,10);
    const cell = document.createElement('div'); cell.className='calendar-cell bg-white rounded p-2 text-sm';
    const blocked = isBlocked(dateStr);
    cell.innerHTML = `<div class='text-xs font-medium'>${d}</div>${blocked? '<div class="mt-1 text-xs text-red-600">Blocked</div>':''}`;
    if(blocked) cell.classList.add('bg-red-50');
    grid.appendChild(cell);
}
    calendar.appendChild(grid);
}

    function renderTimeline(){
    const timeline = document.getElementById('timeline'); timeline.innerHTML='';
    const rooms = readJSON(ROOMS_KEY,[]);
    const bookings = readJSON(BOOKINGS_KEY,[]);
    const now = new Date(); const year=now.getFullYear(), month=now.getMonth(); const days = new Date(year,month+1,0).getDate();

    // header row days
    const header = document.createElement('div'); header.className='sticky top-0 bg-white z-10 border-b';
    const headerInner = document.createElement('div'); headerInner.className='flex';
    headerInner.appendChild(createDiv('w-40 shrink-0 p-2 font-medium','Phòng'));
    for(let d=1;d<=days;d++) headerInner.appendChild(createDiv('timeline-cell border-l text-xs text-center p-1',d));
    header.appendChild(headerInner); timeline.appendChild(header);

    rooms.forEach(r=>{
    const row = document.createElement('div'); row.className='flex items-center';
    row.appendChild(createDiv('w-40 shrink-0 p-2 border-b',`${r.name} • ${r.type}`));
    for(let d=1;d<=days;d++){
    const dateStr = new Date(year,month,d).toISOString().slice(0,10);
    const isBooked = bookings.some(b=> b.roomId===r.id && b.status!=='cancelled' && new Date(b.checkIn)<=new Date(dateStr) && new Date(b.checkOut)>=new Date(dateStr));
    const cell = createDiv('timeline-cell border-b text-center', isBooked? '●':'' );
    if(isBooked) cell.classList.add('bg-brand-soft');
    row.appendChild(cell);
}
    timeline.appendChild(row);
});
}

    function createDiv(cls, html){ const d=document.createElement('div'); d.className=cls; d.innerHTML=html; return d; }

    // CRUD rooms
    function openRoomModal(room){
    const root = document.getElementById('modal-root'); root.innerHTML='';
    const overlay = document.createElement('div'); overlay.className='fixed inset-0 bg-black/40 flex items-center justify-center z-50';
    const form = document.createElement('div'); form.className='bg-white rounded-md p-6 w-full max-w-lg';
    form.innerHTML = `
        <h3 class='text-lg font-semibold mb-2'>${room? 'Sửa phòng':'Thêm phòng'}</h3>
        <div class='grid gap-2'>
          <input id='rm-name' class='p-2 border' placeholder='Mã phòng' value='${room?room.name:''}' />
          <input id='rm-type' class='p-2 border' placeholder='Loại' value='${room?room.type:''}' />
          <input id='rm-price' class='p-2 border' placeholder='Giá' value='${room?room.price:''}' />
          <input id='rm-capacity' class='p-2 border' placeholder='Sức chứa' value='${room?room.capacity:''}' />
          <input id='rm-beds' class='p-2 border' placeholder='Số giường' value='${room?room.beds:''}' />
          <textarea id='rm-desc' class='p-2 border' placeholder='Mô tả'>${room?room.description:''}</textarea>
          <input id='rm-amen' class='p-2 border' placeholder='Tiện nghi (phân tách bằng , )' value='${room?(room.amenities||[]).join(', '):''}' />
          <select id='rm-status' class='p-2 border'>
            <option value='available'>Sẵn sàng</option>
            <option value='occupied'>Đang ở</option>
            <option value='maintenance'>Bảo trì</option>
          </select>
          <div class='flex justify-end gap-2 mt-2'>
            <button id='rm-cancel' class='px-3 py-2 border rounded'>Hủy</button>
            <button id='rm-save' class='px-3 py-2 brand rounded'>Lưu</button>
          </div>
        </div>
      `;
    overlay.appendChild(form); root.appendChild(overlay);
    if(room) document.getElementById('rm-status').value = room.status;
    document.getElementById('rm-cancel').onclick = ()=>{ root.innerHTML=''; };
    document.getElementById('rm-save').onclick = ()=>{
    const name = document.getElementById('rm-name').value.trim();
    const type = document.getElementById('rm-type').value.trim();
    const price = parseInt(document.getElementById('rm-price').value||0);
    const capacity = parseInt(document.getElementById('rm-capacity').value||0);
    const beds = parseInt(document.getElementById('rm-beds').value||0);
    const desc = document.getElementById('rm-desc').value.trim();
    const amenities = document.getElementById('rm-amen').value.split(',').map(s=>s.trim()).filter(Boolean);
    const status = document.getElementById('rm-status').value;
    if(!name){ alert('Vui lòng nhập mã phòng'); return; }
    const arr = readJSON(ROOMS_KEY,[]);
    if(room){ // update
    const idx = arr.findIndex(r=>r.id===room.id); if(idx>-1){ arr[idx] = {...arr[idx], name,type,price,status,description:desc,capacity,beds,amenities}; }
} else { arr.unshift({ id: uid('RM'), name,type,price,status,description:desc,capacity,beds,amenities }); }
    writeJSON(ROOMS_KEY,arr); root.innerHTML=''; refreshAll();
};
}

    function refreshAll(){ renderRooms(); renderBookingsList(); renderCalendar(); renderTimeline(); updateStats(); attachRoomHandlers(); }

    function attachRoomHandlers(){
    document.querySelectorAll('.btn-edit-room').forEach(btn=> btn.onclick = (e)=>{
        const id=btn.getAttribute('data-id'); const r = readJSON(ROOMS_KEY,[]).find(x=>x.id===id); openRoomModal(r);
    });
    document.querySelectorAll('.btn-del-room').forEach(btn=> btn.onclick = (e)=>{
    const id=btn.getAttribute('data-id'); if(!confirm('Xác nhận xóa phòng?'))return; const arr = readJSON(ROOMS_KEY,[]).filter(x=>x.id!==id); writeJSON(ROOMS_KEY,arr); refreshAll();
});
}

    // Booking modal
    function openBookingModal(initial){
    const root = document.getElementById('modal-root'); root.innerHTML='';
    const overlay = document.createElement('div'); overlay.className='fixed inset-0 bg-black/40 flex items-center justify-center z-50';
    const form = document.createElement('div'); form.className='bg-white rounded-md p-6 w-full max-w-2xl overflow-auto';
    const rooms = readJSON(ROOMS_KEY,[]);
    form.innerHTML = `
        <h3 class='text-lg font-semibold mb-2'>${initial? 'Sửa đặt phòng':'Đặt phòng mới'}</h3>
        <div class='grid gap-2 sm:grid-cols-2'>
          <input id='bk-guest' class='p-2 border' placeholder='Tên khách' value='${initial?initial.guest:''}' />
          <input id='bk-phone' class='p-2 border' placeholder='Điện thoại' value='${initial?initial.phone:''}' />
          <input id='bk-email' class='p-2 border' placeholder='Email' value='${initial?initial.email:''}' />
          <input id='bk-idnum' class='p-2 border' placeholder='CMND/Passport' value='${initial?initial.idNumber:''}' />
          <select id='bk-room' class='p-2 border'>
            <option value=''>Chọn phòng…</option>
            ${readJSON(ROOMS_KEY,[]).map(r=>`<option value='${r.id}' ${initial && initial.roomId===r.id? 'selected':''}>${r.name} — ${r.type} — ${r.price.toLocaleString('vi-VN')} ₫ — ${r.status}</option>`).join('')}
          </select>
          <input id='bk-checkin' type='date' class='p-2 border' value='${initial?initial.checkIn:''}' />
          <input id='bk-checkout' type='date' class='p-2 border' value='${initial?initial.checkOut:''}' />
          <input id='bk-guests' class='p-2 border' placeholder='Số khách' value='${initial?initial.guests||1:1}' />
          <input id='bk-notes' class='p-2 border sm:col-span-2' placeholder='Ghi chú' value='${initial?initial.notes:''}' />
          <div class='sm:col-span-2 p-2 border rounded'>
            <div id='bk-room-details' class='text-sm'></div>
          </div>
          <div class='sm:col-span-2 flex justify-end gap-2 mt-2'>
            <button id='bk-cancel' class='px-3 py-2 border rounded'>Hủy</button>
            <button id='bk-save' class='px-3 py-2 brand rounded'>Lưu</button>
          </div>
        </div>
      `;
    overlay.appendChild(form); root.appendChild(overlay);
    function updateRoomDetails(){ const rid=document.getElementById('bk-room').value; const r = rooms.find(x=>x.id===rid); const el=document.getElementById('bk-room-details'); if(r){ el.innerHTML = `<div class="font-medium">${r.name} — ${r.type}</div><div>Giá: ${r.price.toLocaleString('vi-VN')} ₫</div><div>Sức chứa: ${r.capacity||'—'}</div><div>Tiện nghi: ${(r.amenities||[]).join(', ')}</div><div class='mt-1'>Deposit: <strong>${Math.round(r.price*DEPOSIT_RATE).toLocaleString('vi-VN')} ₫</strong></div>` } else el.innerHTML='Chưa chọn phòng'; }
    document.getElementById('bk-room').onchange = updateRoomDetails; updateRoomDetails();
    document.getElementById('bk-cancel').onclick = ()=>root.innerHTML='';
    document.getElementById('bk-save').onclick = ()=>{
    const guest = document.getElementById('bk-guest').value.trim();
    const phone = document.getElementById('bk-phone').value.trim();
    const email = document.getElementById('bk-email').value.trim();
    const idnum = document.getElementById('bk-idnum').value.trim();
    const roomId = document.getElementById('bk-room').value;
    const checkIn = document.getElementById('bk-checkin').value;
    const checkOut = document.getElementById('bk-checkout').value;
    const guests = parseInt(document.getElementById('bk-guests').value||1);
    const notes = document.getElementById('bk-notes').value||'';
    if(!guest||!roomId||!checkIn||!checkOut){ alert('Vui lòng điền đầy đủ thông tin'); return; }
    if(!checkAvailability(roomId,checkIn,checkOut, initial? initial.id: null)){ alert('Phòng không khả dụng trong khoảng ngày này'); return; }
    const r = rooms.find(x=>x.id===roomId);
    const booking = initial? Object.assign({}, initial, { guest, phone, email, idNumber:idnum, roomId, roomLabel: r? `${r.name} · ${r.type}`:'', checkIn, checkOut, guests, notes, amount:r? r.price:0, depositAmount: r? Math.round(r.price*DEPOSIT_RATE):0 }) : { id:'BK-'+Math.random().toString(36).slice(2,8).toUpperCase(), guest, phone, email, idNumber:idnum, roomId, roomLabel: r? `${r.name} · ${r.type}`:'', checkIn, checkOut, guests, notes, status:'confirmed', amount:r? r.price:0, depositAmount: r? Math.round(r.price*DEPOSIT_RATE):0, depositPaid:false, createdAt:new Date().toISOString() };
    // save
    const arr = readJSON(BOOKINGS_KEY,[]);
    if(initial){ const idx=arr.findIndex(x=>x.id===initial.id); if(idx>-1) arr[idx]=booking; }
    else arr.unshift(booking);
    writeJSON(BOOKINGS_KEY,arr);
    // mark room occupied
    const rarr = readJSON(ROOMS_KEY,[]); const ridx = rarr.findIndex(x=>x.id===roomId); if(ridx>-1){ rarr[ridx].status='occupied'; writeJSON(ROOMS_KEY,rarr); }
    root.innerHTML=''; refreshAll();
};
}

    function checkAvailability(roomId, checkIn, checkOut, ignoreId){
    const arr = readJSON(BOOKINGS_KEY,[]);
    const A1 = new Date(checkIn), A2=new Date(checkOut);
    return !arr.some(b=>{ if(ignoreId && b.id===ignoreId) return false; if(b.roomId!==roomId) return false; if(b.status==='cancelled') return false; const B1=new Date(b.checkIn), B2=new Date(b.checkOut); return Math.max(A1,B1) <= Math.min(A2,B2); });
}

    // CSV
    function exportBookingsCSV(){ const arr=readJSON(BOOKINGS_KEY,[]); if(!arr.length){ alert('Không có booking'); return;} const headers=Object.keys(arr[0]); const csv=[headers.join(',')].concat(arr.map(r=>headers.map(h=>JSON.stringify(r[h]||'')).join(','))).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='bookings.csv'; a.click(); URL.revokeObjectURL(url); }
    function importBookingsCSV(file){ if(!file) return; const reader=new FileReader(); reader.onload=()=>{ const txt=reader.result+''; const lines=txt.split(/\r?\n/).filter(Boolean); const headers=lines[0].split(','); const rows=lines.slice(1).map(ln=>{ const cols=ln.split(','); const o={}; headers.forEach((h,i)=>{ try{o[h]=JSON.parse(cols[i]||'""')}catch(e){ o[h]=cols[i]||''; } }); return o; }); const arr = rows.concat(readJSON(BOOKINGS_KEY,[])); writeJSON(BOOKINGS_KEY,arr); refreshAll(); }; reader.readAsText(file); }

    // Attach events
    document.getElementById('btn-add-room').onclick = ()=>openRoomModal(null);
    document.getElementById('btn-new-booking').onclick = ()=>openBookingModal(null);
    document.getElementById('export-bookings').onclick = exportBookingsCSV;
    document.getElementById('import-bookings').onchange = (e)=> importBookingsCSV(e.target.files[0]);
    document.getElementById('export-rooms').onclick = ()=>{ const arr=readJSON(ROOMS_KEY,[]); if(!arr.length){alert('Không có phòng')} else{ const h=Object.keys(arr[0]); const csv=[h.join(',')].concat(arr.map(r=>h.map(k=>JSON.stringify(r[k]||'')).join(','))).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='rooms.csv'; a.click(); URL.revokeObjectURL(url);} };
    document.getElementById('import-rooms').onchange = (e)=>{ const file = e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ const txt=reader.result+''; const lines=txt.split(/\r?\n/).filter(Boolean); const headers=lines[0].split(','); const rows=lines.slice(1).map(ln=>{ const cols=ln.split(','); const o={}; headers.forEach((h,i)=>{ try{o[h]=JSON.parse(cols[i]||'""')}catch(e){ o[h]=cols[i]||''; } }); return o; }); const arr=rows.concat(readJSON(ROOMS_KEY,[])); writeJSON(ROOMS_KEY,arr); refreshAll(); }; reader.readAsText(file); };

    // initial
    seedData(); refreshAll();