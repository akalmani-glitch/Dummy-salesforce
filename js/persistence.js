function sanitizeAccountId(raw) {
  return (raw || '').toUpperCase().replace(/[^A-Z0-9_\-.~:@+]/g, '').slice(0, 190);
}

function initPersistence() {
  const statusEl = document.getElementById('dbStatus');
  try {
    localStorage.setItem('__probe__', '1');
    localStorage.removeItem('__probe__');
    statusEl.textContent = 'Local browser storage connected — saved records stay on this device/browser only, not shared with other users.';
  } catch (e) {
    localStorageOk = false;
    statusEl.textContent = 'Browser storage unavailable (private/incognito mode, or disabled) — running session-only.';
    document.getElementById('saveBtn').disabled = true;
    document.getElementById('reloadBtn').disabled = true;
    return;
  }
  refreshAccountList();
}

function getAccountIndex() {
  try { return JSON.parse(localStorage.getItem('br_account_index') || '[]'); } catch (e) { return []; }
}
function setAccountIndex(list) {
  try { localStorage.setItem('br_account_index', JSON.stringify(list)); } catch (e) { /* ignore */ }
}

function refreshAccountList() {
  const group = document.getElementById('savedAccountsGroup');
  group.innerHTML = '';
  const ids = getAccountIndex();
  if (!ids.length) {
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.textContent = '(no saved accounts yet — save one below)';
    group.appendChild(opt);
    return;
  }
  ids.forEach(id => {
    let data = {};
    try { data = JSON.parse(localStorage.getItem('br_account:' + id) || '{}'); } catch (e) { /* ignore */ }
    const opt = document.createElement('option');
    opt.value = 'ACCT:' + id;
    opt.textContent = id + ' — ' + (data.clientName || '(unnamed)');
    group.appendChild(opt);
  });
}

function saveToSharedRecord() {
  const statusEl = document.getElementById('dbStatus');
  if (!localStorageOk) { statusEl.textContent = 'Browser storage unavailable — cannot save.'; return; }
  const id = sanitizeAccountId(currentRecordData.accountNumber);
  if (!id) { statusEl.textContent = 'Enter an account number before saving.'; return; }
  currentRecordData.accountNumber = id;
  document.getElementById('acctNumInput').value = id;
  try {
    localStorage.setItem('br_account:' + id, JSON.stringify(currentRecordData));
    const idx = getAccountIndex();
    if (!idx.includes(id)) { idx.push(id); setAccountIndex(idx); }
    statusEl.textContent = 'Saved locally (' + id + ') at ' + new Date().toLocaleTimeString() + '. This device/browser only.';
    refreshAccountList();
  } catch (e) {
    statusEl.textContent = 'Save failed — browser storage may be full or disabled.';
  }
}

function reloadFromSharedRecord() {
  const statusEl = document.getElementById('dbStatus');
  const id = sanitizeAccountId(currentRecordData.accountNumber);
  if (!id) { statusEl.textContent = 'No account number set to reload.'; return; }
  const raw = localStorage.getItem('br_account:' + id);
  if (!raw) { statusEl.textContent = 'No local record saved yet for ' + id + '.'; return; }
  try {
    currentRecordData = JSON.parse(raw);
    statusEl.textContent = 'Reloaded local record (' + id + '). Unsaved edits were discarded.';
    document.getElementById('acctNumInput').value = currentRecordData.accountNumber || id;
    updateAcctBox();
    renderSystemPane();
    setMainTab(currentMainTab);
  } catch (e) {
    statusEl.textContent = 'Reload failed — stored data was corrupted.';
  }
}
