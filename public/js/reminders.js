// reminder.js
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('addReminderModal');
  const openBtn = document.getElementById('openAddReminderModal');
  const closeBtn = document.getElementById('closeAddReminderModal');
  const form = document.getElementById('addReminderForm');
  const toast = document.getElementById('toast');
  const grid = document.getElementById('remindersGrid');

  function showModal() { modal.style.display = 'flex'; }
  function hideModal() { modal.style.display = 'none'; form.reset(); }
  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
  }

  openBtn.onclick = showModal;
  closeBtn.onclick = hideModal;
  modal.onclick = (e) => { if (e.target === modal) hideModal(); };

  form.onsubmit = async function(e) {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    try {
      const resp = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!resp.ok) throw new Error('Failed to add reminder');
      const reminder = await resp.json();
      // Add card to grid (prepend)
      const card = document.createElement('div');
      card.className = 'reminder-card';
      card.innerHTML = `
        <div class="reminder-card-header">
          <span class="reminder-badge">${reminder.title}</span>
          <div class="reminder-actions">
            <button class="card-action-btn" title="Edit"><span>✏️</span></button>
            <button class="card-action-btn" title="Delete"><span>🗑️</span></button>
            <button class="card-action-btn" title="Mark as Done"><span>✔️</span></button>
          </div>
        </div>
        <div class="reminder-card-body">
          <p class="reminder-desc"><strong>Description:</strong> ${reminder.description || ''}</p>
          <p class="reminder-date"><strong>Remind At:</strong> <span>📅 ${(reminder.remind_at ? new Date(reminder.remind_at).toLocaleString() : '-')}</span></p>
          <p class="reminder-date"><strong>Created At:</strong> ${reminder.created_at ? new Date(reminder.created_at).toISOString().slice(0,10) : '-'}</p>
        </div>
      `;
      grid.prepend(card);
      hideModal();
      showToast('Reminder added!');
    } catch (err) {
      showToast('Failed to add reminder.');
    }
  };
});
