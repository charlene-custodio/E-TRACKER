document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('anecdotalReportModal');
  const closeBtn = document.getElementById('closeAnecdotalReportModal');
  const form = document.getElementById('anecdotalReportForm');
  const addSessionBtn = document.getElementById('addSessionBtn');
  const sessionsContainer = document.getElementById('sessionsContainer');
  let currentStudentId = null;

  // Open modal
  document.querySelector('.students-grid').addEventListener('click', function(e) {
    const btn = e.target.closest('.add-anecdotal-btn');
    if (!btn) return;
    currentStudentId = btn.dataset.studentId;
    modal.style.display = 'flex';
    resetSessions();
  });

  // Add session input group
  addSessionBtn.onclick = function() {
    const sessionDiv = document.createElement('div');
    sessionDiv.className = 'session-group';
    sessionDiv.innerHTML = `
      <div style="display:flex;gap:16px;">
        <div>
          <label>Time In</label>
          <input type="time" name="time_in[]" required />
        </div>
        <div>
          <label>Time Out</label>
          <input type="time" name="time_out[]" required />
        </div>
        <button type="button" class="remove-session-btn" style="margin-top:20px;">🗑️</button>
      </div>
    `;
    sessionsContainer.appendChild(sessionDiv);
    sessionDiv.querySelector('.remove-session-btn').onclick = function() {
      sessionDiv.remove();
    };
  };

  // Reset sessions on open/close
  function resetSessions() {
    sessionsContainer.innerHTML = `<h3>Anecdotal Sessions</h3>`;
  }

  // Close modal logic
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    form.reset();
    resetSessions();
    currentStudentId = null;
  };
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      form.reset();
      resetSessions();
      currentStudentId = null;
    }
  };

  // Submit with AJAX
  form.onsubmit = async function(e) {
    e.preventDefault();
    if (!currentStudentId) return;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    // Gather sessions
    const sessions = [];
    const timeIns = form.querySelectorAll('input[name="time_in[]"]');
    const timeOuts = form.querySelectorAll('input[name="time_out[]"]');
    for (let i = 0; i < timeIns.length; i++) {
      sessions.push({
        time_in: timeIns[i].value,
        time_out: timeOuts[i].value
      });
    }
    // Build payload
    data.sessions = sessions;
    try {
      const resp = await fetch(`/api/students/${currentStudentId}/anecdotal-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!resp.ok) throw new Error('Failed to save report');
      modal.style.display = 'none';
      form.reset();
      resetSessions();
      currentStudentId = null;
      // Optionally refresh anecdotal list here
    } catch (err) {
      alert("Failed to save report.");
    }
  };
});