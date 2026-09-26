/* ---------- Beneficiary tab (client record side) ---------- */
function setRecordStatus(status) { currentRecordData.status = status; renderSystemPane(); }
function addPrimaryRow() {
  currentRecordData.beneficiaryDetail.primaries.push({ name:'', relationship:'', ssn:'', dob:'', type:'Individual', allocationMethod:'Percentage', allocationValue:0, contingents:[] });
  renderSystemPane();
}
function removePrimaryRow(i) { currentRecordData.beneficiaryDetail.primaries.splice(i,1); renderSystemPane(); }
function addContingentRow(pi) {
  currentRecordData.beneficiaryDetail.primaries[pi].contingents.push({ name:'', ssn:'', dob:'', type:'Individual', allocationMethod:'Equal', allocationValue:null });
  renderSystemPane();
}
function removeContingentRow(pi,ci) { currentRecordData.beneficiaryDetail.primaries[pi].contingents.splice(ci,1); renderSystemPane(); }
function addOwnerRoleRow() { currentRecordData.ownersRoles.push({ name:'', role:'Power of Attorney' }); renderSystemPane(); }
function removeOwnerRoleRow(i) { currentRecordData.ownersRoles.splice(i,1); renderSystemPane(); }

function recordRowHtml(b, pathPrefix, showContingentsCol, contingentCount) {
  const allocSelect = '<select class="sf-cell-select" onchange="' + pathPrefix + '.allocationMethod = this.value; renderSystemPane();">' +
    '<option value="Percentage"' + (b.allocationMethod==='Percentage'?' selected':'') + '>Allocate Percentage</option>' +
    '<option value="Equal"' + (b.allocationMethod==='Equal'?' selected':'') + '>Allocate Equal</option></select>';
  const percentCell = b.allocationMethod === 'Equal'
    ? '<span class="sf-cell-computed">Equal %</span>'
    : '<input class="sf-cell-input" style="width:60px" value="' + (b.allocationValue==null?'':b.allocationValue) + '" oninput="' + pathPrefix + '.allocationValue = parseFloat(this.value) || 0;">';
  let html = '<tr><td class="name-cell"><input class="sf-cell-input name-input" value="' + b.name + '" oninput="' + pathPrefix + '.name = this.value">' +
    (b.relationship !== undefined ? '<div class="sf-relationship-line">Rel: <input value="' + (b.relationship||'') + '" oninput="' + pathPrefix + '.relationship = this.value"></div>' : '') + '</td>' +
    '<td><input class="sf-cell-input" value="' + b.ssn + '" oninput="' + pathPrefix + '.ssn = this.value"></td>' +
    '<td><input class="sf-cell-input" style="width:100px" value="' + b.dob + '" oninput="' + pathPrefix + '.dob = this.value"></td>' +
    '<td><select class="sf-cell-select" onchange="' + pathPrefix + '.type = this.value"><option' + (b.type==='Individual'?' selected':'') + '>Individual</option><option' + (b.type==='Trust'?' selected':'') + '>Trust</option></select></td>';
  if (showContingentsCol) html += '<td class="sf-cell-computed" style="text-align:center">' + contingentCount + '</td>';
  html += '<td>' + allocSelect + '</td><td>' + percentCell + '</td></tr>';
  return html;
}

function renderSystemPane() {
  const rec = currentRecordData;
  const pane = document.getElementById('systemPane');
  const primaries = rec.beneficiaryDetail.primaries;

  let html = '<div class="sf-client-header">' +
    '<input class="sf-name-input" value="' + rec.clientName + '" oninput="currentRecordData.clientName = this.value; document.getElementById(\'breadcrumbName\').textContent = this.value || \'—\'; document.getElementById(\'topbarLabel\').textContent = (this.value||\'Client\') + \' · Financial Account · Salesforce — Work\'; updateAcctBox();">' +
    '<div class="sf-subrow">DOB <input value="' + rec.dob + '" oninput="currentRecordData.dob = this.value"> Account Type <select oninput="currentRecordData.accountType = this.value; updateAcctBox();">' +
      ['Individual Brokerage','Joint','IRA','Trust','Other'].map(t => '<option' + (rec.accountType===t?' selected':'') + '>' + t + '</option>').join('') + '</select></div>' +
    '<div class="sf-subrow">Address <input value="' + rec.address + '" oninput="currentRecordData.address = this.value"> State <input class="sf-state" value="' + rec.stateCode + '" oninput="currentRecordData.stateCode = this.value.toUpperCase()"> Marital Status <select oninput="currentRecordData.maritalStatus = this.value">' +
      ['','Single','Married','Divorced','Widowed','Separated'].map(s => '<option value="' + s + '"' + (rec.maritalStatus===s?' selected':'') + '>' + (s||'(blank)') + '</option>').join('') + '</select></div>' +
  '</div>';

  html += '<div class="sf-tabs"><div class="sf-tab' + (rec.status==='Pending'?' active':'') + '" onclick="setRecordStatus(\'Pending\')">Pending TOD Beneficiaries</div>' +
    '<div class="sf-tab' + (rec.status==='Approved'?' active':'') + '" onclick="setRecordStatus(\'Approved\')">Approved TOD Beneficiaries</div></div>';

  html += '<div class="sf-statusbar">Status: <b>' + rec.status + '</b>' +
    '<button class="sf-btn-dec" disabled title="Decorative only in this prototype">Resend/Reprint</button>' +
    '<button class="sf-btn-dec" disabled title="Decorative only in this prototype">Cancel Form and Edit</button>' +
    '<button class="sf-btn-dec" disabled title="Decorative only in this prototype">Approve Group</button></div>';

  if (rec.status === 'Pending') {
    html += '<div class="sf-banner">These beneficiaries are not approved. They are pending a signed Transfer on Death Agreement.</div>';
    html += '<div class="sf-section-title">Primary Beneficiaries <button class="sf-add-row" onclick="addPrimaryRow()">+ Add primary</button></div>';
    html += '<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Name</th><th>SSN/TID</th><th>Date of birth</th><th>Type</th><th>Contingents</th><th>Allocate</th><th>Percent</th><th></th></tr></thead><tbody>';
    primaries.forEach((p, pi) => {
      html += recordRowHtml(p, 'currentRecordData.beneficiaryDetail.primaries[' + pi + ']', true, p.contingents.length)
        .replace('</tr>', '<td><button class="sf-row-rm" onclick="removePrimaryRow(' + pi + ')">×</button></td></tr>');
    });
    html += '<tr class="totals"><td>Totals:</td><td></td><td></td><td></td><td></td><td></td><td>' + allocationTotalLabel(primaries) + '</td><td></td></tr>';
    html += '</tbody></table></div>';

    primaries.forEach((p, pi) => {
      html += '<div class="sf-section-title">Contingent Beneficiaries for ' + (p.name || '(unnamed primary)') + ' <button class="sf-add-row" onclick="addContingentRow(' + pi + ')">+ Add contingent</button></div>';
      html += '<div class="sf-table-wrap"><table class="sf-table"><thead><tr><th>Name</th><th>SSN/TID</th><th>Date of birth</th><th>Type</th><th>Allocate</th><th>Percent</th><th></th></tr></thead><tbody>';
      p.contingents.forEach((c, ci) => {
        html += recordRowHtml(c, 'currentRecordData.beneficiaryDetail.primaries[' + pi + '].contingents[' + ci + ']', false, 0)
          .replace('</tr>', '<td><button class="sf-row-rm" onclick="removeContingentRow(' + pi + ',' + ci + ')">×</button></td></tr>');
      });
      html += '<tr class="totals"><td>Totals:</td><td></td><td></td><td></td><td>' + allocationTotalLabel(p.contingents) + '</td><td></td></tr>';
      html += '</tbody></table></div>';
    });
  } else {
    html += '<div class="sf-approved-note">Approved-vs-Pending comparison is deferred for now — not yet part of this prototype.</div>';
  }

  html += '<div class="sf-owners-panel"><div class="sf-section-title">Owners &amp; Roles (' + rec.ownersRoles.length + ') <button class="sf-add-row" onclick="addOwnerRoleRow()">+ Add person</button></div>';
  rec.ownersRoles.forEach((o, oi) => {
    html += '<div class="sf-owner-row"><div class="sf-owner-square"></div><div class="sf-owner-fields">' +
      '<input class="sf-cell-input name-input" value="' + o.name + '" oninput="currentRecordData.ownersRoles[' + oi + '].name = this.value">' +
      '<div class="sf-owner-role-line">Role: <select class="sf-cell-select" onchange="currentRecordData.ownersRoles[' + oi + '].role = this.value">' +
        ['Owner','Power of Attorney','Trusted Contact','3rd Party Signer for Document'].map(r => '<option' + (o.role===r?' selected':'') + '>' + r + '</option>').join('') + '</select>' +
        (o.role !== 'Owner' ? '<button class="sf-row-rm" onclick="removeOwnerRoleRow(' + oi + ')">×</button>' : '') + '</div></div></div>';
  });
  html += '</div>';
  pane.innerHTML = html;
}

function updateAcctBox() {
  const rec = currentRecordData;
  document.getElementById('acctBoxName').textContent = (rec.clientName || 'Unnamed') + ' — ' + (rec.accountNumber || '(no account #)');
  document.getElementById('acctBoxSub').textContent = rec.accountType + ' · State: ' + (rec.stateCode || '—') + ' · Status: ' + rec.status;
}
