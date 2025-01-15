document.addEventListener("DOMContentLoaded", async () => {    
  const editProfileForm = document.getElementById("editProfileForm");    
  const usernameInput = document.getElementById("username");
  const bioTextarea = document.getElementById("bio");
  const token = localStorage.getItem('jwtToken');

  try {    
    // Fetch user profile data from server    
    const response = await fetch("http://localhost:8080/user/profile", {    
      method: "GET",    
      headers: {    
        "Content-Type": "application/json",    
        "Authorization": `Bearer ${token}`    
      }    
    });    
    
    if (response.ok) {    
      const data = await response.json();    
    
      // Populate form with user data    
      usernameInput.value = data.username || "";    
      bioTextarea.value = data.bio || "";    
    } else {    
      const errorText = await response.text();    
      console.error("Failed to fetch profile:", errorText);    
      alert("Failed to load profile data.");    
    }    
  } catch (error) {    
    console.error("Error fetching profile data:", error);    
    alert("An error occurred while fetching profile data.");    
  }    

  // Handle form submission
  editProfileForm.addEventListener("submit", async (event) => {    
    event.preventDefault(); // Prevent default form submission    
    
    const username = usernameInput.value;    
    const bio = bioTextarea.value;    
    
    const data = {    
      username: username,    
      bio: bio    
    };    
    
    try {    
      const response = await fetch("http://localhost:8080/user/edit", {    
        method: "PUT",    
        headers: {    
          "Content-Type": "application/json",    
          'Authorization': `Bearer ${token}`   
        },    
        body: JSON.stringify(data)    
      });    
    
      if (response.ok) {    
        alert("Profile updated successfully!");    
      } else {    
        const errorText = await response.text();    
        let errorMessage;    
    
        try {    
          const error = JSON.parse(errorText);    
          errorMessage = error.message;    
        } catch (e) {    
          errorMessage = errorText;    
        }    
    
        alert(`Error: ${errorMessage}`);    
      }    
    } catch (error) {    
      console.error("Error updating profile:", error);    
      alert("An error occurred while updating the profile.");    
    }    
  });    
});  
