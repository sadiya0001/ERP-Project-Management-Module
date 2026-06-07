<template>
  <div class="login-container">
    <div class="login-left">
      <div class="logo-area">
        <div class="logo-icon"></div>
        <span class="logo-text">AProjectO</span>
      </div>
      
      <div class="illustration-area">
        <div class="login-card-illustration">
          <h2 class="card-title">CREATE ACCOUNT</h2>
          <div class="shield-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </div>
          <div class="form-mockup">
            <div class="input-mockup">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>FULL NAME</span>
            </div>
            <div class="input-mockup">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>EMAIL</span>
            </div>
            <div class="input-mockup">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>--------</span>
            </div>
          </div>
        </div>
        <div class="character-illustration"></div>
      </div>
    </div>
    
    <div class="login-right">
      <div class="top-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line></svg>
        <span>Asite Product System</span>
      </div>
      
      <div class="login-form-container">
        <h1 class="welcome-heading">Create an account</h1>
        <p class="welcome-sub">Get started by filling in your details below.</p>
        
        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSignup" class="login-form">
          <div class="name-row">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" v-model="firstName" placeholder="John" required />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" v-model="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" placeholder="john@example.com" required />
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <div class="password-input">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Min. 6 characters" required minlength="6" />
              <button type="button" @click="showPassword = !showPassword" class="toggle-password">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <div class="password-input">
              <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Re-enter password" required minlength="6" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="toggle-password">
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>
          
          <div class="form-actions">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeTerms" required />
              <span>I agree to the Terms & Conditions</span>
            </label>
          </div>
          
          <button type="submit" class="login-button" :disabled="loading">
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </button>
          
          <p class="signup-prompt">
            Already have an account? <router-link to="/login" class="signup-link">Log in</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeTerms = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const handleSignup = async () => {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.';
    return;
  }

  try {
    loading.value = true;
    const success = await authStore.register({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value
    });
    if (success) {
      alert('Registration successful! Please log in.');
      authStore.logout();
      router.push('/login');
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  } catch (error) {
    console.error('Signup error:', error);
    errorMessage.value = error.message || 'An error occurred during registration.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-color, #f5f7fa);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  overflow: hidden;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
}

.logo-icon {
  width: 24px;
  height: 24px;
  background-color: var(--primary-color, #4a90d9);
  border-radius: 50%;
  position: relative;
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: -8px;
  width: 24px;
  height: 24px;
  background-color: rgba(74, 144, 217, 0.6);
  border-radius: 50%;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark, #1a1d29);
}

.illustration-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.login-card-illustration {
  background: linear-gradient(180deg, #4da4f0 0%, #2974d6 100%);
  width: 280px;
  height: 400px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  color: white;
  z-index: 2;
  position: relative;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

.shield-icon {
  margin-bottom: 30px;
  opacity: 0.9;
}

.form-mockup {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-mockup {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-right {
  flex: 1;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  position: relative;
}

.top-brand {
  position: absolute;
  top: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-dark, #1a1d29);
  font-weight: 500;
}

.login-form-container {
  max-width: 400px;
  margin: auto;
  width: 100%;
}

.welcome-heading {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark, #1a1d29);
  margin-bottom: 8px;
}

.welcome-sub {
  font-size: 15px;
  color: var(--text-gray, #6b7280);
  margin-bottom: 32px;
}

.error-alert {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
}

.name-row {
  display: flex;
  gap: 16px;
}

.name-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dark, #1a1d29);
  margin-bottom: 8px;
}

.form-group input[type="email"],
.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input::placeholder {
  color: #c5c8ce;
}

.form-group input:focus {
  border-bottom-color: var(--primary-color, #4a90d9);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-gray, #6b7280);
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-gray, #6b7280);
  cursor: pointer;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: var(--text-dark, #1a1d29);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 24px;
}

.login-button:hover {
  background-color: #000;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-prompt {
  text-align: center;
  font-size: 14px;
  color: var(--text-gray, #6b7280);
}

.signup-link {
  color: var(--text-dark, #1a1d29);
  font-weight: 600;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .login-left {
    display: none;
  }
}
</style>
