const OPERION = {
  BASE_URL: 'https://YOUR-N8N-INSTANCE.com',
  SECRET: 'YOUR-NETLIFY-WEBHOOK-SECRET'
};

// Generic Intake Function
async function sendToOperion(type, payload) {
  try {
    const res = await fetch(`${OPERION.BASE_URL}/webhook/operion/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-operion-secret': OPERION.SECRET
      },
      body: JSON.stringify({
        source: 'website',
        type: type,
        timestamp: new Date().toISOString(),
        payload: payload,
        meta: {
          user_agent: navigator.userAgent
        }
      })
    });
    return await res.json();
  } catch (err) {
    console.error('Operion error:', err);
  }
}

// Onboard Form Submission
const form = document.getElementById('onboardForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    await sendToOperion('onboard', data);
    window.location.href = 'onboard-success.html';
  });
}

// Dashboard Loader
async function loadDashboard() {
  const el = document.getElementById('dashboard');
  if (!el) return;
  const res = await fetch(`${OPERION.BASE_URL}/webhook/operion/dashboard`, {
    headers: {'x-operion-secret': OPERION.SECRET}
  });
  const data = await res.json();
  el.innerText = JSON.stringify(data, null, 2);
}
loadDashboard();
