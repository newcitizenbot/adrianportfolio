document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successEl = form.querySelector('.form-success');
  const errorEl = form.querySelector('.form-error');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        form.reset();
        successEl.style.display = 'block';
      } else {
        throw new Error('Network response not ok');
      }
    } catch (err) {
      console.error('Contact send error:', err);
      errorEl.style.display = 'block';
    }
  });
});
