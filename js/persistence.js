const API_BASE = '/api/accounts';

function sanitizeAccountId(raw) {
  return (raw || '').toUpperCase().replace(/[^A-Z0-9_\-.~:@+]/g, '').slice(0, 190);
}

async function initPersistence() {
  const statusEl = document.getElementById('dbStatus');
  statusEl.textContent = 'Connecting to server…';
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('bad status');
    statusEl.textContent = 'Connected to the server database — saved records are stored centrally and readable by anyone with the account URL.';
  } catch (e) {
    statusEl.textContent = 'Could not reach the server database — check your connection and try again.';
  }
  refreshAccountList();
}

async function refreshAccountList() {
  const group = document.getElementById('savedAccountsGroup');
  group.innerHTML = '';
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('bad status');
    const list = await res.json();
    if (!list.length) {
      const opt = document.createElement('option');
      opt.disabled = true;
      opt.textContent = '(no saved accounts yet — save one below)';
      group.appendChild(opt);
      return;
    }
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = 'ACCT:' + item.id;
      opt.textContent = item.id + ' — ' + (item.clientName || '(unnamed)');
      group.appendChild(opt);
    });
  } catch (e) {
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.textContent = '(could not load saved accounts)';
    group.appendChild(opt);
  }
}

async function saveToSharedRecord() {
  const statusEl = document.getElementById('dbStatus');
  const id = sanitizeAccountId(currentRecordData.accountNumber);
  if (!id) { statusEl.textContent = 'Enter an account number before saving.'; return; }
  currentRecordData.accountNumber = id;
  document.getElementById('acctNumInput').value = id;
  statusEl.textContent = 'Saving…';
  try {
    const res = await fetch(API_BASE + '/' + encodeURIComponent(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentRecordData)
    });
    if (!res.ok) throw new Error('save failed');
    statusEl.textContent = 'Saved to server (' + id + ') at ' + new Date().toLocaleTimeString() + '.';
    refreshAccountList();
  } catch (e) {
    statusEl.textContent = 'Save failed — server unreachable or rejected the request.';
  }
}

async function reloadFromSharedRecord() {
  const statusEl = document.getElementById('dbStatus');
  const id = sanitizeAccountId(currentRecordData.accountNumber);
  if (!id) { statusEl.textContent = 'No account number set to reload.'; return; }
  statusEl.textContent = 'Loading…';
  try {
    const res = await fetch(API_BASE + '/' + encodeURIComponent(id));
    if (res.status === 404) { statusEl.textContent = 'No server record found for ' + id + '.'; return; }
    if (!res.ok) throw new Error('load failed');
    currentRecordData = await res.json();
    statusEl.textContent = 'Reloaded server record (' + id + '). Unsaved edits were discarded.';
    document.getElementById('acctNumInput').value = currentRecordData.accountNumber || id;
    updateAcctBox();
    renderSystemPane();
    renderOwnersRolesPane();
    setMainTab(currentMainTab);
  } catch (e) {
    statusEl.textContent = 'Reload failed — server unreachable.';
  }
}
