/* ---------- Incoming form pane ---------- */
function setEditMode(on) {
  editMode = on;
  document.getElementById('viewBtn').classList.toggle('active', !on);
  document.getElementById('editBtn').classList.toggle('active', on);
  renderFormPane();
}
function handleUpload(evt) {
  const file = evt.target.files[0];
  const status = document.getElementById('uploadStatus');
  if (!file) { status.textContent = ''; return; }
  status.textContent = '"' + file.name + '" received — not parsed in this prototype.';
}
function addFormPrimaryRow() {
  currentFormData.primaries.push({ name:'', relationship:'', ssn:'', dob:'', allocationMethod:'Percentage', allocationValue:0, contingents:[] });
  renderFormPane();
}
function removeFormPrimaryRow(i) { currentFormData.primaries.splice(i,1); renderFormPane(); }
function addFormContingentRow(pi) {
  currentFormData.primaries[pi].contingents.push({ name:'', ssn:'', dob:'', allocationMethod:'Equal', allocationValue:null });
  renderFormPane();
}
function removeFormContingentRow(pi,ci) { currentFormData.primaries[pi].contingents.splice(ci,1); renderFormPane(); }

function formRowHtml(b, pathPrefix, showContingentsCol, contingentCount) {
  const allocSelect = '<select class="sf-cell-select" onchange="' + pathPrefix + '.allocationMethod = this.value; renderFormPane();">' +
    '<option value="Percentage"' + (b.allocationMethod==='Percentage'?' selected':'') + '>Allocate Percentage</option>' +
    '<option value="Equal"' + (b.allocationMethod==='Equal'?' selected':'') + '>Allocate Equal</option></select>';
  const percentCell = b.allocationMethod === 'Equal'
    ? '<span class="sf-cell-computed">Equal %</span>'
    : '<input class="sf-cell-input" style="width:60px" value="' + (b.allocationValue==null?'':b.allocationValue) + '" oninput="' + pathPrefix + '.allocationValue = parseFloat(this.value) || 0;">';
  let html = '<tr><td class="name-cell"><input class="sf-cell-input name-input" value="' + b.name + '" oninput="' + pathPrefix + '.name = this.value">' +
    (b.relationship !== undefined ? '<div class="sf-relationship-line">Rel: <input value="' + (b.relationship||'') + '" oninput="' + pathPrefix + '.relationship = this.value"></div>' : '') + '</td>' +
    '<td><input class="sf-cell-input" value="' + b.ssn + '" oninput="' + pathPrefix + '.ssn = this.value"></td>' +
    '<td><input class="sf-cell-input" style="width:100px" value="' + b.dob + '" oninput="' + pathPrefix + '.dob = this.value"></td>';
  if (showContingentsCol) html += '<td class="sf-cell-computed" style="text-align:center">' + contingentCount + '</td>';
  html += '<td>' + allocSelect + '</td><td>' + percentCell + '</td></tr>';
  return html;
}

function renderFormPane() {
  const pane = document.getElementById('formPane');
  const f = currentFormData;
  let topHtml;
  if (!editMode) {
    topHtml = '<div class="field"><label>Client name (as extracted)</label><div class="ro">' + (f.clientName||'&nbsp;') + '</div></div>' +
      '<div class="field"><label>Signer name (from signature line)</label><div class="ro">' + (f.signerName || '—') + '</div></div>' +
      '<div class="field"><label>Capacity noted beside signature</label><div class="ro">' + (f.capacityNoted || '(none stated)') + '</div></div>' +
      '<div class="sec-label">Section A — form only</div>' +
      '<div class="field"><label>Scan Title</label><div class="ro">' + (f.title||'&nbsp;') + '</div></div>' +
      '<div class="field-grid2"><div class="field"><label>Scan Date</label><div class="ro">' + (f.scanDate||'&nbsp;') + '</div></div>' +
      '<div class="field"><label>Signature Date</label><div class="ro">' + (f.signatureDate||'&nbsp;') + '</div></div></div>' +
      '<div class="field"><label>State Code</label><div class="ro">' + (f.stateCode||'&nbsp;') + '</div></div>';
  } else {
    topHtml = '<div class="field"><label>Client name (as entered)</label><input value="' + f.clientName + '" oninput="currentFormData.clientName = this.value"></div>' +
      '<div class="field"><label>Signer name (from signature line)</label><input value="' + (f.signerName||'') + '" oninput="currentFormData.signerName = this.value"></div>' +
      '<div class="field"><label>Capacity noted beside signature (leave blank if none)</label><input value="' + (f.capacityNoted||'') + '" oninput="currentFormData.capacityNoted = this.value"></div>' +
      '<div class="sec-label">Section A — form only</div>' +
      '<div class="field"><label>Scan Title</label><input value="' + f.title + '" oninput="currentFormData.title = this.value"></div>' +
      '<div class="field-grid2"><div class="field"><label>Scan Date (MM/DD/YYYY)</label><input value="' + f.scanDate + '" oninput="currentFormData.scanDate = this.value"></div>' +
      '<div class="field"><label>Signature Date (MM/DD/YYYY)</label><input value="' + f.signatureDate + '" oninput="currentFormData.signatureDate = this.value"></div></div>' +
      '<div class="field"><label>State Code</label><input value="' + f.stateCode + '" oninput="currentFormData.stateCode = this.value.toUpperCase()" style="width:60px;text-transform:uppercase"></div>';
  }

  let html = topHtml + '<div class="sec-label">Section B — cross-verified against client record</div>';
  html += '<div class="benef-block"><div class="sf-section-title">Primary Beneficiaries <button class="sf-add-row" onclick="addFormPrimaryRow()">+ Add primary</button></div>';
  html += '<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Name</th><th>SSN</th><th>Date of birth</th><th>Contingents</th><th>Allocate</th><th>Percent</th><th></th></tr></thead><tbody>';
  f.primaries.forEach((p, pi) => {
    html += formRowHtml(p, 'currentFormData.primaries[' + pi + ']', true, p.contingents.length)
      .replace('</tr>', '<td><button class="sf-row-rm" onclick="removeFormPrimaryRow(' + pi + ')">×</button></td></tr>');
  });
  html += '<tr class="totals"><td>Totals:</td><td></td><td></td><td></td><td></td><td>' + allocationTotalLabel(f.primaries) + '</td><td></td></tr>';
  html += '</tbody></table></div></div>';

  f.primaries.forEach((p, pi) => {
    html += '<div class="benef-block"><div class="sf-section-title">Contingents for ' + (p.name||'(unnamed)') + ' <button class="sf-add-row" onclick="addFormContingentRow(' + pi + ')">+ Add contingent</button></div>';
    html += '<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Name</th><th>SSN</th><th>Date of birth</th><th>Allocate</th><th>Percent</th><th></th></tr></thead><tbody>';
    p.contingents.forEach((c, ci) => {
      html += formRowHtml(c, 'currentFormData.primaries[' + pi + '].contingents[' + ci + ']', false, 0)
        .replace('</tr>', '<td><button class="sf-row-rm" onclick="removeFormContingentRow(' + pi + ',' + ci + ')">×</button></td></tr>');
    });
    html += '<tr class="totals"><td>Totals:</td><td></td><td></td><td>' + allocationTotalLabel(p.contingents) + '</td><td></td></tr>';
    html += '</tbody></table></div></div>';
  });
  pane.innerHTML = html;
}
