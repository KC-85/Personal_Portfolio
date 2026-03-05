// Dropdown menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const navDropdown = document.querySelector('.nav-dropdown > a');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (navDropdown) {
    navDropdown.addEventListener('click', function(e) {
      // Allow navigation on other pages
      if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        e.preventDefault();
        
        // Toggle dropdown visibility
        if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
          dropdownMenu.style.display = 'block';
        } else {
          dropdownMenu.style.display = 'none';
        }
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        dropdownMenu.style.display = 'none';
      }
    });

    // Close dropdown when a project is clicked
    const projectLinks = dropdownMenu.querySelectorAll('a');
    projectLinks.forEach(link => {
      link.addEventListener('click', function() {
        dropdownMenu.style.display = 'none';
      });
    });
  }
});
