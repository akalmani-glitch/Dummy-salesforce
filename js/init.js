function loadCase(caseId) {
  if (caseId.startsWith('ACCT:')) {
    const id = caseId.slice(5);
    const raw = localStorage.getItem('br_account:' + id);
    if (raw) {
      try { currentRecordData = JSON.parse(raw); } catch (e) { currentRecordData = JSON.parse(JSON.stringify(SYSTEM_RECORDS.BLANK)); }
      document.getElementById('dbStatus').textContent = 'Loaded local record: ' + id + '.';
    } else {
      currentRecordData = JSON.parse(JSON.stringify(SYSTEM_RECORDS.BLANK));
      document.getElementById('dbStatus').textContent = 'No local record found for ' + id + ' — starting blank.';
    }
    if (!currentRecordData.accountNumber) currentRecordData.accountNumber = id;
    currentFormData = JSON.parse(JSON.stringify(FORM_SCENARIOS.BLANK));
  } else {
    const id = caseId.replace(/^TPL:/, '');
    currentRecordData = JSON.parse(JSON.stringify(SYSTEM_RECORDS[id]));
    currentRecordData.accountNumber = id;
    currentFormData = JSON.parse(JSON.stringify(FORM_SCENARIOS[id]));
  }
  editMode = false;
  document.getElementById('acctNumInput').value = currentRecordData.accountNumber || '';
  document.getElementById('breadcrumbName').textContent = currentRecordData.clientName || '—';
  document.getElementById('topbarLabel').textContent = (currentRecordData.clientName || 'Client') + ' · Financial Account — Work';
  updateAcctBox();
  setMainTab(currentMainTab);
  renderSystemPane();
  renderOwnersRolesPane();
  document.getElementById('viewBtn').classList.add('active');
  document.getElementById('editBtn').classList.remove('active');
  document.getElementById('uploadStatus').textContent = '';
  renderFormPane();
  document.getElementById('verdictShell').classList.remove('show');
}

const select = document.getElementById('caseSelect');
const templatesGroup = document.createElement('optgroup');
templatesGroup.label = 'Templates (in-memory, not yet saved)';
Object.keys(SYSTEM_RECORDS).forEach(id => {
  const opt = document.createElement('option');
  opt.value = 'TPL:' + id;
  opt.textContent = id === 'BLANK' ? '— New / blank template —' : (id + ' — ' + SYSTEM_RECORDS[id].clientName);
  templatesGroup.appendChild(opt);
});
select.appendChild(templatesGroup);
const savedAccountsGroup = document.createElement('optgroup');
savedAccountsGroup.id = 'savedAccountsGroup';
savedAccountsGroup.label = 'Saved local accounts (this browser)';
select.appendChild(savedAccountsGroup);
select.addEventListener('change', () => loadCase(select.value));
loadCase(select.value);
initPersistence();
