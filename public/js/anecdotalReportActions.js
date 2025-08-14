document.addEventListener('DOMContentLoaded', function() {
  // Show edit form
  document.querySelectorAll('.edit-report-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const card = btn.closest('.report-card');
      card.querySelector('.anecdotal-edit-form').style.display = '';
      card.querySelectorAll('.hours-row,.field-value,.session-list-view,.report-actions').forEach(el => el.style.display = 'none');
    });
  });

  // Cancel edit
  document.querySelectorAll('.cancel-edit-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const card = btn.closest('.report-card');
      card.querySelector('.anecdotal-edit-form').style.display = 'none';
      card.querySelectorAll('.hours-row,.field-value,.session-list-view,.report-actions').forEach(el => el.style.display = '');
    });
  });

  // Add session
  document.querySelectorAll('.add-session-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const ul = btn.closest('.sessions-edit-container').querySelector('.sessions-edit-list');
      const idx = ul.children.length;
      const li = document.createElement('li');
      li.className = 'session-edit-row';
      li.innerHTML = `
        <label>Time In
          <input type="time" name="session_time_in_${idx}" required />
        </label>
        <label>Time Out
          <input type="time" name="session_time_out_${idx}" required />
        </label>
        <button type="button" class="remove-session-btn">✖</button>
      `;
      ul.appendChild(li);
      li.querySelector('.remove-session-btn').onclick = () => li.remove();
    });
  });

  // Remove session (on existing rows)
  document.querySelectorAll('.remove-session-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.closest('.session-edit-row').remove();
    });
  });

  // Save (submit) form
  document.querySelectorAll('.anecdotal-edit-form').forEach(function(form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const card = form.closest('.report-card');
      const reportId = card.getAttribute('data-report-id');
      const studentId = card.getAttribute('data-student-id');

      // Gather form data
      const formData = new FormData(form);
      const payload = {
        report_date: formData.get('report_date'),
        learner_difficulties: formData.get('learner_difficulties'),
        intervention: formData.get('intervention'),
        result: formData.get('result'),
        sessions: []
      };
      // Gather sessions
      form.querySelectorAll('.session-edit-row').forEach((li, idx) => {
        payload.sessions.push({
          time_in: li.querySelector(`input[name="session_time_in_${idx}"]`).value,
          time_out: li.querySelector(`input[name="session_time_out_${idx}"]`).value
        });
      });

      // Send to backend
      const res = await fetch(`/api/students/${studentId}/anecdotal-reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) location.reload();
      else alert('Failed to save');
    });
  });
});