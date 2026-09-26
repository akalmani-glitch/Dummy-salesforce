/* ---------- Owners & Roles (persistent, interface-level panel) ---------- */
function addOwnerRoleRow() { currentRecordData.ownersRoles.push({ name:'', role:'Power of Attorney' }); renderOwnersRolesPane(); }
function removeOwnerRoleRow(i) { currentRecordData.ownersRoles.splice(i,1); renderOwnersRolesPane(); }

function renderOwnersRolesPane() {
  const rec = currentRecordData;
  const pane = document.getElementById('ownersRolesPane');
  if (!pane) return;
  let html = '<div class="sf-section-title">Owners &amp; Roles (' + rec.ownersRoles.length + ') <button class="sf-add-row" onclick="addOwnerRoleRow()">+ Add person</button></div>';
  rec.ownersRoles.forEach((o, oi) => {
    html += '<div class="sf-owner-row"><div class="sf-owner-square"></div><div class="sf-owner-fields">' +
      '<input class="sf-cell-input name-input" value="' + o.name + '" oninput="currentRecordData.ownersRoles[' + oi + '].name = this.value">' +
      '<div class="sf-owner-role-line">Role: <select class="sf-cell-select" onchange="currentRecordData.ownersRoles[' + oi + '].role = this.value">' +
        ['Owner','Power of Attorney','Trusted Contact','3rd Party Signer for Document'].map(r => '<option' + (o.role===r?' selected':'') + '>' + r + '</option>').join('') + '</select>' +
        (o.role !== 'Owner' ? '<button class="sf-row-rm" onclick="removeOwnerRoleRow(' + oi + ')">×</button>' : '') + '</div></div></div>';
  });
  pane.innerHTML = html;
}
