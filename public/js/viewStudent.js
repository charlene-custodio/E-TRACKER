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

// Helper to render the student modal, edit or view mode
function showStudentModal(data, isEditing = false) {
  const modal = document.getElementById('viewStudentModal');
  const birthday = data.birthday
    ? new Date(data.birthday).toISOString().slice(0, 10)
    : '';

  // Helper for rendering input or plain text
  const field = (key, label, type = "text") => isEditing
    ? `<label><strong>${label}:</strong> <input name="${key}" value="${data[key] ?? ''}" type="${type}" /></label><br>`
    : `<strong>${label}:</strong> ${data[key] ?? ''}<br>`;

  modal.querySelector('.modal-content').innerHTML = `
    <img src="/uploads/${data.id_picture}" class="student-avatar" alt="Student Avatar"/>
    <form id="studentEditForm">
      <div>
        <h3>Personal Information</h3>
        ${field('name', 'Name')}
        ${field('grade_level', 'Grade Level')}
        ${field('school_name', 'School')}
        ${isEditing
          ? `<label><strong>Birthday:</strong> <input name="birthday" value="${birthday}" type="date" /></label><br>`
          : `<strong>Birthday:</strong> ${birthday}<br>`
        }
        ${field('age', 'Age', 'number')}
        ${field('sex', 'Sex')}
        ${field('address', 'Address')}
        ${field('guardian', 'Guardian')}
        ${field('contact', 'Contact')}
      </div>
      <div>
        <h3>Academic Information</h3>
        ${field('school_year', 'School Year')}
        ${field('lrn', 'LRN')}
        ${field('section', 'Section')}
        ${field('enrollment_status', 'Enrollment Status')}
        ${field('adviser', 'Adviser')}
        ${field('learning_difficulty', 'Learning Difficulty')}
      </div>
      <div style="margin-top:20px;">
        ${isEditing
          ? `<button type="submit" id="saveBtn">Save</button>
             <button type="button" id="cancelBtn">Cancel</button>`
          : `<button type="button" id="editBtn">Edit Information</button>`
        }
        <button type="button" id="backBtn">Back to Students</button>
      </div>
    </form>
  `;
  modal.style.display = 'block';

  // Button Events
  document.getElementById('backBtn').onclick = () => {
    modal.style.display = 'none';
  };
  if (isEditing) {
    document.getElementById('cancelBtn').onclick = (e) => {
      e.preventDefault();
      showStudentModal(data, false);
    };
    document.getElementById('studentEditForm').onsubmit = async function(e) {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(this).entries());
      const updateRes = await fetch(`/student/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!updateRes.ok) return alert("Failed to update.");
      const updated = await updateRes.json();
      showStudentModal(updated, false);
    };
  } else {
    document.getElementById('editBtn').onclick = (e) => {
      e.preventDefault();
      showStudentModal(data, true);
    };
  }
}