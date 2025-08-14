// Professional Fullstack DRY: Modern Anecdotal Modal JS
document.addEventListener('DOMContentLoaded', function () {
  // Show modal
  window.showAnecdotalModal = function() {
    document.getElementById('anecdotalReportModal').style.display = 'flex';
  };

  // Hide modal
  function hideModal() {
    document.getElementById('anecdotalReportModal').style.display = 'none';
    document.getElementById('anecdotalReportForm').reset();
    // Remove all session rows
    const container = document.getElementById('anec-sessionsContainer');
    container.querySelectorAll('.anec-session-row').forEach(row => row.remove());
  }

  document.getElementById('anec-closeAnecdotalReportModal').onclick = hideModal;

  // Add Session
  document.getElementById('anec-addSessionBtn').onclick = function () {
    const container = document.getElementById('anec-sessionsContainer');
    const idx = container.querySelectorAll('.anec-session-row').length;
    const row = document.createElement('div');
    row.className = 'anec-session-row';
    row.innerHTML = `
      <label>Time In
        <input type="time" name="session_time_in_${idx}" required />
      </label>
      <label>Time Out
        <input type="time" name="session_time_out_${idx}" required />
      </label>
      <button type="button" class="anec-session-remove-btn" title="Remove session">&times;</button>
    `;
    row.querySelector('.anec-session-remove-btn').onclick = () => row.remove();
    container.appendChild(row);
  };

  // Submit Anecdotal Report
  document.getElementById('anecdotalReportForm').onsubmit = function(e) {
    e.preventDefault();
    // Implement your AJAX or form submission logic here
    // For demo, just hide modal
    hideModal();
    // Optionally show a success message
    // alert('Report submitted!');
  };

  // Optional: Close modal on outside click
  document.getElementById('anecdotalReportModal').addEventListener('click', function(e) {
    if (e.target === this) hideModal();
  });
});