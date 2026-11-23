const engraving = document.querySelector('.practice-engraving');

if (engraving && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  engraving.classList.add('practice-engraving-waiting');
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      engraving.classList.replace('practice-engraving-waiting', 'practice-engraving-visible');
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  observer.observe(engraving);
}

const dialog = document.querySelector('#appointment-dialog');
const form = document.querySelector('#appointment-form');
const draft = document.querySelector('#appointment-draft');
const message = document.querySelector('#appointment-message');
const status = document.querySelector('#appointment-status');
const draftInstructions = 'Copy the request and paste it into a LinkedIn message to send it.';

document.querySelectorAll('[data-open-appointment]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    form.elements.date.min = [year, month, day].join('-');
    dialog.showModal();
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(form);
  const description = fields.get('description').trim();
  const lines = [
    'Hello, I would like to request an appointment.',
    '',
    'Name: ' + fields.get('name').trim(),
    'Mobile: ' + fields.get('phone').trim(),
    'Email: ' + fields.get('email').trim(),
    'Matter type: ' + fields.get('matter'),
    'Preferred date: ' + fields.get('date'),
    'Preferred time (IST): ' + fields.get('time'),
  ];
  if (description) lines.push('', description);
  message.value = lines.join('\n');
  status.textContent = draftInstructions;
  draft.hidden = false;
  message.focus();
});

form.addEventListener('input', () => {
  draft.hidden = true;
  message.value = '';
});

document.querySelector('#appointment-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    status.textContent = 'Request copied. Paste it into a LinkedIn message to send it.';
  } catch {
    message.focus();
    message.select();
    status.textContent = 'The request is selected. Copy it manually to send it via LinkedIn.';
  }
});
