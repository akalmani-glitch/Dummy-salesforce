async function loadCase(caseId) {
  if (caseId.startsWith('ACCT:')) {
    const id = caseId.slice(5);
    document.getElementById('dbStatus').textContent = 'Loading ' + id + '…';
    try {
      const res = await fetch(API_BASE + '/' + encodeURIComponent(id));
      if (res.ok) {
        currentRecordData = await res.json();
        document.getElementById('dbStatus').textContent = 'Loaded server record: ' + id + '.';
      } else {
        currentRecordData = JSON.parse(JSON.stringify(SYSTEM_RECORDS.BLANK));
        document.getElementById('dbStatus').textContent = 'No server record found for ' + id + ' — starting blank.';
      }
    } catch (e) {
      currentRecordData = JSON.parse(JSON.stringify(SYSTEM_RECORDS.BLANK));
      document.getElementById('dbStatus').textContent = 'Could not reach the server — starting blank.';
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
savedAccountsGroup.label = 'Saved accounts (server)';
select.appendChild(savedAccountsGroup);
select.addEventListener('change', () => loadCase(select.value));
loadCase(select.value);
initPersistence();
