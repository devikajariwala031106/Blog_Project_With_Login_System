document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('[data-auto-dismiss]');
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 400);
    }, 4000);
  });

  const deleteForms = document.querySelectorAll('[data-confirm-delete]');
  deleteForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      const confirmed = window.confirm('Are you sure you want to delete this blog?');
      if (!confirmed) {
        event.preventDefault();
      }
    });
  });
});
