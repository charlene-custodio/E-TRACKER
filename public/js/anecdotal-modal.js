// Professional Fullstack DRY: Modern Anecdotal Modal JS
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('anecdotalReportModal');
  const form = document.getElementById('anecdotalReportForm');
  const addSessionBtn = document.getElementById('anec-addSessionBtn');
  const sessionsContainer = document.getElementById('anec-sessionsContainer');
  const closeBtn = document.getElementById('anec-closeAnecdotalReportModal');
  let currentStudentId = null;

  // Show modal (call this from grid or button)
  window.showAnecdotalModal = function(studentId) {
    currentStudentId = studentId;
    modal.style.display = 'flex';
    resetSessions();
    form.reset();
  };

  // Hide modal logic
  function hideModal() {
    modal.style.display = 'none';
    form.reset();
    resetSessions();
    currentStudentId = null;
  }

  closeBtn.onclick = hideModal;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) hideModal();
  });

  // Add Session row
  addSessionBtn.onclick = function () {
    const idx = sessionsContainer.querySelectorAll('.anec-session-row').length;
    const row = document.createElement('div');
    row.className = 'anec-session-row';
    row.innerHTML = `
      <label>Time In
        <input type="time" name="time_in[]" required />
      </label>
      <label>Time Out
        <input type="time" name="time_out[]" required />
      </label>
      <button type="button" class="anec-session-remove-btn" title="Remove session">&times;</button>
    `;
    row.querySelector('.anec-session-remove-btn').onclick = () => row.remove();
    sessionsContainer.appendChild(row);
  };

  // Reset sessions on open/close
  function resetSessions() {
    sessionsContainer.innerHTML = `<h3 class="anec-sessions-title">Anecdotal Sessions</h3>`;
  }

  // Submit Anecdotal Report
  form.onsubmit = async function(e) {
    e.preventDefault();
    if (!currentStudentId) {
      alert("Student not selected.");
      return;
    }
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
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.sessions = sessions;

    try {
      const resp = await fetch(`/api/students/${currentStudentId}/anecdotal-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!resp.ok) throw new Error('Failed to save report');
      hideModal();
      // Optionally refresh report list
    } catch (err) {
      alert("Failed to save report.");
    }
  };

  // Optional: Attach to grid buttons
  document.querySelectorAll('.add-anecdotal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const studentId = btn.getAttribute('data-student-id');
      window.showAnecdotalModal(studentId);
    });
  });
});