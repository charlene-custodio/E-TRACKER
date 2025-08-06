document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.view-student-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const studentId = btn.getAttribute('data-id');
      const response = await fetch(`/student/${studentId}`);
      if (!response.ok) return alert("Student not found.");
      const data = await response.json();
      showStudentModal(data);
    });
  });
});

// Function to show modal and inject HTML
function showStudentModal(data) {
  // Format birthday for modern UX
  const birthday = data.birthday 
    ? new Date(data.birthday).toLocaleDateString('en-CA') // e.g. "2025-08-05"
    : '';

  const modal = document.getElementById('viewStudentModal');
  modal.querySelector('.modal-content').innerHTML = `
    <img src="/uploads/${data.id_picture}" class="student-avatar" alt="Student Avatar"/>
    <div>
      <strong>Name:</strong> ${data.name}<br>
      <strong>Grade Level:</strong> ${data.grade_level}<br>
      <strong>School:</strong> ${data.school_name}
    </div>
    <div>
      <h3>Personal Information</h3>
      <strong>Birthday:</strong> ${birthday}<br>
      <strong>Age:</strong> ${data.age}<br>
      <strong>Sex:</strong> ${data.sex}<br>
      <strong>Address:</strong> ${data.address}<br>
      <strong>Guardian:</strong> ${data.guardian}<br>
      <strong>Contact:</strong> ${data.contact}
    </div>
    <div>
      <h3>Academic Information</h3>
      <strong>School Year:</strong> ${data.school_year}<br>
      <strong>LRN:</strong> ${data.lrn}<br>
      <strong>Section:</strong> ${data.section}<br>
      <strong>Enrollment Status:</strong> ${data.enrollment_status}<br>
      <strong>Adviser:</strong> ${data.adviser}<br>
      <strong>Learning Difficulty:</strong> ${data.learning_difficulty}
    </div>
    <button id="editBtn">Edit Information</button>
    <button id="backBtn">Back to Students</button>
  `;
  modal.style.display = 'block';

  document.getElementById('backBtn').onclick = () => {
    modal.style.display = 'none';
  };
}