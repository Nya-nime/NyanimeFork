// Select the form element
const editProfileForm = document.getElementById('editProfileForm');

// Mock existing data for demonstration
const mockData = {
  username: "Haekall",
  bio: "This is a sample bio.",
  profilePic: "path/to/current-profile-pic.jpg"
};

// Pre-fill the form with existing data
window.onload = () => {
  document.getElementById('username').value = mockData.username;
  document.getElementById('bio').value = mockData.bio;
};

// Handle form submission
editProfileForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const bio = document.getElementById('bio').value;
  const profilePic = document.getElementById('profilePic').files[0];

  // Create a form data object
  const formData = new FormData();
  formData.append('username', username);
  formData.append('bio', bio);
  if (profilePic) {
    formData.append('profilePic', profilePic);
  }

  // Simulate saving changes
  fetch('/api/user/edit-profile', {
    method: 'POST',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Profile updated successfully!');
      window.location.href = 'profile.html';
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
    });
});
