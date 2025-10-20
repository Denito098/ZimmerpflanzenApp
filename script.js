document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const btn = document.getElementById('testBtn');

  btn.addEventListener('click', () => {
    status.textContent = 'Status: Button geklickt! ✅';
    console.log('Test button clicked');
  });

  // kleiner Selbsttest
  console.log('Script geladen');
});
