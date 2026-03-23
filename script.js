document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('id-card');
  const container = document.getElementById('card-container');
  const form = document.getElementById('id-form');

  // Input Elements
  const nameInput = document.getElementById('student-name');
  const rollInput = document.getElementById('roll-number');
  const gradeInput = document.getElementById('grade-select');
  const photoInput = document.getElementById('photo-upload');

  // Card Output Elements
  const cardName = document.getElementById('card-name');
  const cardRoll = document.getElementById('card-roll');
  const cardGrade = document.getElementById('card-grade');
  const cardPhoto = document.getElementById('card-photo');
  const placeholderIcon = document.getElementById('placeholder-icon');

  const studentsGrid = document.getElementById('students-grid');

  let uploadedImage = null; // Store base64 image

  /* --- 1. 3D Tilt Effect --- */
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 12; // Lower value = higher tilt
    const rotateY = (x - centerX) / 12;

    // Apply rotation
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Shine effect
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    card.style.setProperty('--shine-deg', `${shineX}% ${shineY}%`);
    
    // Add specular highlight if needed
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    card.style.transition = 'transform 0.5s ease';
  });

  container.addEventListener('mouseenter', () => {
    card.style.transition = 'none'; // Smooth out while moving
    card.style.transform = `scale(1.02)`; // Slight lift on enter
  });

  /* --- 2. Live Update Card Text --- */
  nameInput.addEventListener('input', (e) => {
    cardName.textContent = e.target.value || 'Student Name';
  });

  rollInput.addEventListener('input', (e) => {
    cardRoll.textContent = e.target.value || 'CS-0000';
  });

  gradeInput.addEventListener('change', (e) => {
    cardGrade.textContent = e.target.value;
  });

  /* --- 3. Image Upload Handling --- */
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedImage = event.target.result;
        cardPhoto.src = uploadedImage;
        cardPhoto.style.display = 'block';
        placeholderIcon.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  /* --- 4. Student Management --- */
  let enrolledStudents = JSON.parse(localStorage.getItem('students')) || [];

  function renderStudents() {
    if (enrolledStudents.length === 0) {
      studentsGrid.innerHTML = `
        <div class="student-item">
          <div class="item-photo"><i class="fa-solid fa-user"></i></div>
          <div class="item-info">
            <div class="item-name">No students enrolled yet</div>
            <div class="item-roll">Fill the form to begin</div>
          </div>
        </div>
      `;
      return;
    }

    studentsGrid.innerHTML = enrolledStudents.map(student => `
      <div class="student-item">
        <div class="item-photo">
          ${student.photo ? `<img src="${student.photo}" alt="${student.name}">` : `<i class="fa-solid fa-user" style="padding: 15px; font-size: 1.2rem; opacity: 0.5;"></i>`}
        </div>
        <div class="item-info">
          <div class="item-name">${student.name}</div>
          <div class="item-roll">${student.roll} - ${student.grade}</div>
        </div>
      </div>
    `).join('');
  }

  // Handle Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const roll = rollInput.value;
    const grade = gradeInput.value;

    if (!name || !roll) return;

    const newStudent = {
      id: Date.now(),
      name,
      roll,
      grade,
      photo: uploadedImage
    };

    enrolledStudents.unshift(newStudent); // Add to beginning
    localStorage.setItem('students', JSON.stringify(enrolledStudents));
    
    // Reset Form and Card View
    form.reset();
    uploadedImage = null;
    cardPhoto.style.display = 'none';
    placeholderIcon.style.display = 'block';
    cardName.textContent = 'Student Name';
    cardRoll.textContent = 'CS-0000';
    cardGrade.textContent = 'Computer Science';

    renderStudents();
  });

  // Initial Render
  renderStudents();
});
