/* ---------- Main tab switching ---------- */
function setMainTab(tab) {
  currentMainTab = tab;
  document.querySelectorAll('.main-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  ['docs','notepad','beneficiary','contacts'].forEach(t => {
    document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1)).style.display = (t === tab) ? '' : 'none';
  });
  if (tab === 'docs') renderDocsTab();
  if (tab === 'notepad') renderNotepadTab();
  if (tab === 'contacts') renderContactsTab();
}

/* ---------- Client Docs tab ---------- */
function addDocRow() { currentRecordData.docs.push({ docType:'TOD', name:'', date:'', status:'Pending review' }); renderDocsTab(); }
function removeDocRow(i) { currentRecordData.docs.splice(i,1); renderDocsTab(); }
function renderDocsTab() {
  const rec = currentRecordData;
  let html = '<div class="sf-placeholder-note">Doc log — one account can have multiple doc types (e.g. TOD, POA, Trust). Doc-type-to-form mapping rules and the Individual/Joint-to-Trust conversion exception are not yet built in here — flagged for your input.</div>';
  html += '<div class="sf-section-title">Documents <button class="sf-add-row" onclick="addDocRow()">+ Add document</button></div>';
  html += '<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Doc Type</th><th>Name</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>';
  rec.docs.forEach((d,i) => {
    html += '<tr><td><select class="sf-cell-select" onchange="currentRecordData.docs['+i+'].docType=this.value">' +
      ['TOD','FID','POA','Trust','Other'].map(t=>'<option'+(d.docType===t?' selected':'')+'>'+t+'</option>').join('') + '</select></td>' +
      '<td><input class="sf-cell-input" value="'+d.name+'" oninput="currentRecordData.docs['+i+'].name=this.value"></td>' +
      '<td><input class="sf-cell-input" style="width:100px" value="'+d.date+'" oninput="currentRecordData.docs['+i+'].date=this.value"></td>' +
      '<td><select class="sf-cell-select" onchange="currentRecordData.docs['+i+'].status=this.value">' +
      ['Filed','Pending review','Completed','Rejected'].map(s=>'<option'+(d.status===s?' selected':'')+'>'+s+'</option>').join('') + '</select></td>' +
      '<td><button class="sf-row-rm" onclick="removeDocRow('+i+')">×</button></td></tr>';
  });
  html += '</tbody></table></div>';
  document.getElementById('tabDocs').innerHTML = html;
}

/* ---------- Account Notepad tab ---------- */
function addNote() {
  const dateEl = document.getElementById('noteDateInput');
  const textEl = document.getElementById('noteTextInput');
  if (!textEl.value.trim()) return;
  currentRecordData.notepad.unshift({ date: dateEl.value || document.getElementById('reviewDate').value, author: 'You', note: textEl.value.trim() });
  textEl.value = '';
  renderNotepadTab();
}
function removeNote(i) { currentRecordData.notepad.splice(i,1); renderNotepadTab(); }
function renderNotepadTab() {
  const rec = currentRecordData;
  const poa = rec.poaDetail;
  let html = '<div class="sf-poa-section">' +
    '<div class="sf-section-title">POA Authorization</div>' +
    '<div class="field-grid2">' +
      '<div class="field"><label>POA agent name</label><input value="' + (poa.agentName||'') + '" oninput="currentRecordData.poaDetail.agentName=this.value"></div>' +
      '<div class="field"><label>Owner (who appointed this agent)</label><input value="' + (poa.ownerName||'') + '" oninput="currentRecordData.poaDetail.ownerName=this.value"></div>' +
    '</div>' +
    '<div class="field"><label>Designate or change beneficiary power</label><input value="' + (poa.beneficiaryPower||'') + '" oninput="currentRecordData.poaDetail.beneficiaryPower=this.value"></div>' +
  '</div>';
  html += '<div class="sf-placeholder-note">Central log for review notes, approvals/rejections, and authorizations (e.g. "trustee authorized after trust document review," or "POA powers added after agreement review"). Currently free-text only — linking specific notes to a specific document\'s authorization step is flagged for your input.</div>';
  html += '<div class="sf-section-title">Notes</div>';
  rec.notepad.forEach((n,i) => {
    html += '<div class="note-item"><div class="note-meta"><span>'+n.date+'</span><span>'+n.author+'</span><button class="sf-row-rm" onclick="removeNote('+i+')" style="margin-left:auto">×</button></div><div class="note-text">'+n.note+'</div></div>';
  });
  if (!rec.notepad.length) html += '<div class="note-item" style="color:var(--ink-faint)">No notes yet.</div>';
  html += '<div class="note-add-row"><input id="noteDateInput" placeholder="MM/DD/YYYY" value="'+document.getElementById('reviewDate').value+'">' +
    '<input id="noteTextInput" class="note-text-input" placeholder="Add a note..."><button onclick="addNote()">Add</button></div>';
  document.getElementById('tabNotepad').innerHTML = html;
}

/* ---------- Account Details & Client Info tab ---------- */
function addContactRow() { currentRecordData.contacts.push({ name:'', roleType:'Beneficiary', phone:'', address:'' }); renderContactsTab(); }
function removeContactRow(i) { currentRecordData.contacts.splice(i,1); renderContactsTab(); }
function renderContactsTab() {
  const rec = currentRecordData;
  const role = rec.poaRole;
  let html = '<div class="sf-section-title">People on this account <button class="sf-add-row" onclick="addContactRow()">+ Add person</button></div>';
  html += '<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Name</th><th>Role</th><th>Phone</th><th>Address</th><th></th></tr></thead><tbody>';
  rec.contacts.forEach((c,i) => {
    html += '<tr><td><input class="sf-cell-input name-input" value="'+c.name+'" oninput="currentRecordData.contacts['+i+'].name=this.value"></td>' +
      '<td><select class="sf-cell-select" onchange="currentRecordData.contacts['+i+'].roleType=this.value">' +
      ['Owner','Beneficiary','Settlor','Trustee','Spouse','POA / Beneficiary','Owner / Trustee','Other'].map(r=>'<option'+(c.roleType===r?' selected':'')+'>'+r+'</option>').join('') + '</select></td>' +
      '<td><input class="sf-cell-input" value="'+c.phone+'" oninput="currentRecordData.contacts['+i+'].phone=this.value"></td>' +
      '<td><input class="sf-cell-input" style="min-width:160px" value="'+c.address+'" oninput="currentRecordData.contacts['+i+'].address=this.value"></td>' +
      '<td><button class="sf-row-rm" onclick="removeContactRow('+i+')">×</button></td></tr>';
  });
  html += '</tbody></table></div>';

  html += '<div class="sf-poa-role-section">' +
    '<div class="sf-section-title">POA Agent Role</div>' +
    '<div class="field-grid2">' +
      '<div class="field"><label>Agent (name of POA)</label><input value="' + (role.agentName||'') + '" oninput="currentRecordData.poaRole.agentName=this.value"></div>' +
      '<div class="field"><label>Power of attorney for (account owner)</label><input value="' + (role.powerOfAttorneyFor||'') + '" oninput="currentRecordData.poaRole.powerOfAttorneyFor=this.value"></div>' +
    '</div>' +
    '<div class="field-grid2">' +
      '<div class="field"><label>SSN of the agent</label><input value="' + (role.ssn||'') + '" oninput="currentRecordData.poaRole.ssn=this.value"></div>' +
      '<div class="field"><label>Status</label><input value="' + (role.status||'') + '" oninput="currentRecordData.poaRole.status=this.value"></div>' +
    '</div>' +
    '<div class="field-grid2">' +
      '<div class="field"><label>Effective date</label><input value="' + (role.effectiveDate||'') + '" oninput="currentRecordData.poaRole.effectiveDate=this.value"></div>' +
      '<div class="field"></div>' +
    '</div>' +
    '<div class="field"><label>Additional notes</label><input value="' + (role.notes||'') + '" oninput="currentRecordData.poaRole.notes=this.value"></div>' +
  '</div>';

  document.getElementById('tabContacts').innerHTML = html;
}
