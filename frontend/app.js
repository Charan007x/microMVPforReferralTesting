const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const views = {
    'login-view': document.getElementById('login-view'),
    'register-view': document.getElementById('register-view'),
    'dashboard-view': document.getElementById('dashboard-view')
};

const elError = document.getElementById('error-message');
const elSuccess = document.getElementById('success-message');

const authForms = {
    login: document.getElementById('login-form'),
    register: document.getElementById('register-form')
};

// UI Helpers
function showView(viewId) {
    Object.values(views).forEach(el => el.classList.add('hidden'));
    views[viewId].classList.remove('hidden');
    clearMessages();
}

function showMessage(msg, isError = false) {
    if (isError) {
        elError.textContent = msg;
        elError.classList.remove('hidden');
        elSuccess.classList.add('hidden');
    } else {
        elSuccess.textContent = msg;
        elSuccess.classList.remove('hidden');
        elError.classList.add('hidden');
    }
}

function clearMessages() {
    elError.classList.add('hidden');
    elSuccess.classList.add('hidden');
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        showView('dashboard-view');
        loadDashboard();
    } else {
        showView('login-view');
    }
}

// Auth Actions
authForms.login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target['login-username'].value;
    const password = e.target['login-password'].value;
    
    try {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('token', data.token);
            // Store user details for quick access
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            showMessage(data.message);
            checkAuth();
        } else {
            showMessage(data.message || 'Login failed', true);
        }
    } catch (err) {
        showMessage('Server error', true);
    }
});

authForms.register.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target['reg-username'].value;
    const password = e.target['reg-password'].value;
    const referredBy = e.target['reg-referral'].value || undefined;
    
    try {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, referredBy })
        });
        const data = await res.json();
        
        if (res.ok) {
            showMessage('Registered successfully! Please login.');
            showView('login-view');
            authForms.register.reset();
        } else {
            showMessage(data.message || 'Registration failed', true);
        }
    } catch (err) {
        showMessage('Server error', true);
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showView('login-view');
}

// Dashboard Data
async function loadDashboard() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (userStr) {
        const user = JSON.parse(userStr);
        document.getElementById('display-username').textContent = user.username;
        document.getElementById('display-refcode').textContent = user.referralCode;
    }

    try {
        // Fetch wallet balance
        const res = await fetch(`${API_BASE}/wallet`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            const data = await res.json();
            document.getElementById('display-balance').textContent = `₹${data.balance || 0}`;
        } else if (res.status === 401 || res.status === 403) {
            logout();
        }
    } catch (err) {
        console.error('Error fetching wallet', err);
    }
}

// Subscription Feature
async function subscribe() {
    const token = localStorage.getItem('token');
    if (!token) return logout();

    try {
        const res = await fetch(`${API_BASE}/subscription/subscribe`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        
        const data = await res.json();
        
        if (res.ok) {
            showMessage(data.message || 'Subscribed successfully!');
            // Refresh dashboard (especially wallet, in case we are testing two accounts)
            loadDashboard();
        } else {
            showMessage(data.message || 'Subscription failed', true);
        }
    } catch (err) {
        showMessage('Server error during subscription', true);
    }
}

// Initialize
checkAuth();