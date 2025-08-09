document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.view-student-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const studentId = btn.getAttribute('data-id');
      const response = await fetch(`/student/${studentId}`);
      if (!response.ok) return alert("Student not found.");
      const data = await response.json();
      showStudentModal(data, false);
    });
  });
});

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper to render the student modal, edit or view mode
function showStudentModal(data, isEditing = false) {
  const modal = document.getElementById('viewStudentModal');
  const birthday = data.birthday
    ? new Date(data.birthday).toISOString().slice(0, 10)
    : '';

  if (isEditing) {
    renderEditMode(modal, data, birthday);
  } else {
    renderViewMode(modal, data, birthday);
  }
  
  modal.style.display = 'block';
}

function renderViewMode(modal, data, birthday) {
  modal.querySelector('.modal-content').innerHTML = `
    <div class="modal-top-header">
      <img src="/images/logo.png" alt="E-TRACKER Logo" class="modal-logo">
      <div>
        <h2 class="modal-title">E-TRACKER</h2>
        <p class="modal-subtitle">Anecdotal Report & Student Record Tracker</p>
      </div>
    </div>
    
    <div class="student-header">
      <div class="student-basic-info">
        <p><strong>Name:</strong> ${data.name || 'Not specified'}</p>
        <p><strong>Grade Level:</strong> Grade ${data.grade_level || 'Not specified'}</p>
        <p><strong>School:</strong> ${data.school_name || 'Not specified'}</p>
      </div>
      
      <div class="student-avatar-container">
        <img src="/uploads/${data.id_picture}" class="student-avatar" alt="Student Photo">
      </div>
    </div>

    <div class="section-header">PERSONAL INFORMATION</div>
    <div class="info-section">
      <p><strong>Birthday:</strong> ${formatDate(data.birthday) || 'Not specified'}</p>
      <p><strong>Age:</strong> ${data.age || 'Not specified'}</p>
      <p><strong>Sex:</strong> ${data.sex || 'Not specified'}</p>
      <p><strong>Address:</strong> ${data.address || 'Not specified'}</p>
      <p><strong>Guardian:</strong> ${data.guardian || 'Not specified'}</p>
      <p><strong>Contact:</strong> ${data.contact || 'Not specified'}</p>
    </div>

    <div class="section-header">ACADEMIC INFORMATION</div>
    <div class="info-section">
      <p><strong>School Year:</strong> ${data.school_year || 'Not specified'}</p>
      <p><strong>LRN:</strong> ${data.lrn || 'Not specified'}</p>
      <p><strong>Section:</strong> ${data.section || 'Not specified'}</p>
      <p><strong>Enrollment Status:</strong> ${data.enrollment_status || 'Not specified'}</p>
      <p><strong>Adviser:</strong> ${data.adviser || 'Not specified'}</p>
      <p><strong>Learning Difficulty:</strong> ${data.learning_difficulty || 'Not specified'}</p>
    </div>

    <div class="modal-actions">
      <button type="button" id="backBtn">Back to Students</button>
      <button type="button" id="editBtn">Edit Information</button>
    </div>
  `;
  
  document.getElementById('backBtn').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  document.getElementById('editBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showStudentModal(data, true);
  });
}

function renderEditMode(modal, data, birthday) {
  modal.querySelector('.modal-content').innerHTML = `
    <div class="modal-top-header">
      <img src="/images/logo.png" alt="E-TRACKER Logo" class="modal-logo">
      <div>
        <h2 class="modal-title">E-TRACKER</h2>
        <p class="modal-subtitle">Anecdotal Report & Student Record Tracker</p>
      </div>
    </div>
    
    <form id="studentEditForm" class="edit-mode">
      <div class="section-header">PERSONAL INFORMATION</div>
      <div class="info-section">
        <div class="data-row">
          <label class="field-label">Name</label>
          <input name="name" value="${data.name || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Grade Level</label>
          <input name="grade_level" value="${data.grade_level || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">School</label>
          <input name="school_name" value="${data.school_name || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Birthday</label>
          <input name="birthday" value="${birthday}" type="date">
        </div>
        <div class="data-row">
          <label class="field-label">Age</label>
          <input name="age" value="${data.age || ''}" type="number">
        </div>
        <div class="data-row">
          <label class="field-label">Sex</label>
          <input name="sex" value="${data.sex || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Address</label>
          <input name="address" value="${data.address || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Guardian</label>
          <input name="guardian" value="${data.guardian || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Contact</label>
          <input name="contact" value="${data.contact || ''}" type="text">
        </div>
      </div>

      <div class="section-header">ACADEMIC INFORMATION</div>
      <div class="info-section">
        <div class="data-row">
          <label class="field-label">School Year</label>
          <input name="school_year" value="${data.school_year || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">LRN</label>
          <input name="lrn" value="${data.lrn || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Section</label>
          <input name="section" value="${data.section || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Enrollment Status</label>
          <input name="enrollment_status" value="${data.enrollment_status || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Adviser</label>
          <input name="adviser" value="${data.adviser || ''}" type="text">
        </div>
        <div class="data-row">
          <label class="field-label">Learning Difficulty</label>
          <input name="learning_difficulty" value="${data.learning_difficulty || ''}" type="text">
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" id="cancelBtn">Cancel</button>
        <button type="submit" id="saveBtn">Save Changes</button>
      </div>
    </form>
  `;
  
  document.getElementById('cancelBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showStudentModal(data, false);
  });
  
  document.getElementById('studentEditForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    
    try {
      const updateRes = await fetch(`/student/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!updateRes.ok) {
        throw new Error("Failed to update student information");
      }
      
      const updated = await updateRes.json();
      showStudentModal(updated, false);
      updateStudentCard(updated); // Update dashboard on save
    } catch (error) {
      alert(error.message || "An error occurred while updating");
    }
  });
}

// Update student card in dashboard
function updateStudentCard(student) {
  // Find the student card using the data-id attribute
  const card = document.querySelector(`.view-student-btn[data-id="${student.id}"]`).closest('.student-card');
  if (!card) return;

  // Update card's avatar, name, grade, sex
  card.querySelector('.student-avatar').src = `/uploads/${student.id_picture}`;
  card.querySelector('.student-info h3').textContent = student.name;
  card.querySelector('.student-info p:nth-child(2)').textContent = `Grade ${student.grade_level} Student`;
  card.querySelector('.student-info p:nth-child(3)').textContent = student.sex;
}