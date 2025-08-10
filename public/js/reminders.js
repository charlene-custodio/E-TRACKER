document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('addReminderModal');
  const openBtn = document.getElementById('openAddReminderModal');
  const closeBtn = document.getElementById('closeAddReminderModal');
  const form = document.getElementById('addReminderForm');
  const toast = document.getElementById('toast');
  const grid = document.getElementById('remindersGrid');
  let editingId = null;

  function showModal(reminder) {
    modal.style.display = 'flex';
    if (reminder) {
      form.title.value = reminder.title || '';
      form.description.value = reminder.description || '';
      // Handle remind_at as datetime-local value
      form.remind_at.value = reminder.remind_at ? toDatetimeLocal(reminder.remind_at) : '';
      editingId = reminder.id;
      form.querySelector('.primary-btn').textContent = "Update";
    } else {
      form.reset();
      editingId = null;
      form.querySelector('.primary-btn').textContent = "Save";
    }
  }
  function hideModal() { modal.style.display = 'none'; form.reset(); editingId = null; }
  function showToast(msg) {
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
  }
  function toDatetimeLocal(date) {
    // Accepts ISO/Date string or Date object, returns YYYY-MM-DDTHH:MM
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
  }
  openBtn.onclick = () => showModal();
  closeBtn.onclick = hideModal;
  modal.onclick = (e) => { if (e.target === modal) hideModal(); };

  form.onsubmit = async function(e) {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    let url = '/api/reminders';
    let method = 'POST';
    if (editingId) {
      url = `/api/reminders/${editingId}`;
      method = 'PUT';
    }
    try {
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!resp.ok) throw new Error('Failed to save reminder');
      const reminder = await resp.json();

      // Remove empty state if present
      const emptyEl = document.querySelector('.reminders-empty');
      if (emptyEl) emptyEl.remove();

      if (editingId) {
        // Update card in DOM
        const card = grid.querySelector(`.reminder-card[data-id="${editingId}"]`);
        if (card) card.replaceWith(createReminderCard(reminder));
        showToast('Reminder updated!');
      } else {
        // Add card to grid (prepend)
        grid.prepend(createReminderCard(reminder));
        showToast('Reminder added!');
      }
      hideModal();
    } catch (err) {
      showToast('Failed to save reminder.');
    }
  };

  // Single event delegation for all reminder card actions
  grid.onclick = async function(e) {
    const btn = e.target.closest('.card-action-btn');
    if (!btn) return;
    const card = btn.closest('.reminder-card');
    const id = card.dataset.id;

    // DELETE
    if (btn.title === 'Delete') {
      if (confirm('Delete this reminder?')) {
        const resp = await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
        if (resp.ok) {
          card.remove();
          showToast('Reminder deleted.');
          if (!document.querySelector('.reminder-card')) {
            grid.innerHTML = `<div class="reminders-empty">No reminders yet. Click <strong>+ Add New Reminder</strong> to create one!</div>`;
          }
        } else {
          showToast('Failed to delete.');
        }
      }
      return;
    }

    // EDIT
    if (btn.title === 'Edit') {
      // Optionally, fetch latest from API, here we parse from DOM for brevity
      const title = card.querySelector('.reminder-badge').textContent;
      const desc = card.querySelector('.reminder-desc').innerText.replace('Description: ', '');
      const remindAt = card.querySelector('.reminder-date span').textContent.replace('📅 ','');
      showModal({
        id,
        title,
        description: desc,
        remind_at: remindAt ? new Date(remindAt).toISOString().slice(0,16) : ""
      });
      return;
    }

    // CHECK / MARK AS DONE
    if (btn.title === 'Mark as Done') {
      const resp = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_done: true })
      });
      if (resp.ok) {
        card.classList.add('reminder-done');
        showToast('Marked as done!');
      } else {
        showToast('Failed to mark as done.');
      }
      return;
    }
  };

  // DRY card creation
  function createReminderCard(reminder) {
    const div = document.createElement('div');
    div.className = 'reminder-card';
    div.dataset.id = reminder.id;
    if (reminder.is_done) div.classList.add('reminder-done');
    div.innerHTML = `
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
    return div;
  }
});

