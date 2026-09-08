// ===== Constants =====
const STORAGE_KEY = "registeredUsers";
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== Get HTML elements =====
const form = document.getElementById("signup-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");
const successMessage = document.getElementById("form-success");

const tableBody = document.getElementById("users-table-body");
const userCount = document.getElementById("user-count");
const emptyState = document.getElementById("empty-state");

// ===== Users =====
let users = loadUsers();


// ===== LocalStorage =====

function loadUsers() {
  const savedUsers = localStorage.getItem(STORAGE_KEY);

  if (savedUsers) {
    const users = JSON.parse(savedUsers);

    // Remove old users that stored plain passwords
    if (users.some(user => user.password)) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return users;
  }

  return [];
}

function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}


// ===== Password Hashing =====

async function hashPassword(password) {
  const encoder = new TextEncoder();

  // Create a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Prepare the password
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // Create the hash
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 600000,
      hash: "SHA-256"
    },
    key,
    256
  );

  return {
    passwordHash: Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join(""),

    passwordSalt: Array.from(salt)
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("")
  };
}


// ===== Validation =====

function showError(input, message) {
  const error = document.getElementById(input.id + "-error");

  error.textContent = message;
  input.classList.add("is-invalid");
}

function clearError(input) {
  const error = document.getElementById(input.id + "-error");

  error.textContent = "";
  input.classList.remove("is-invalid");
}

function validateUsername() {
  if (usernameInput.value.trim() === "") {
    showError(usernameInput, "Username is required.");
    return false;
  }

  clearError(usernameInput);
  return true;
}

function validateEmail() {
  const email = emailInput.value.trim().toLowerCase();

  if (email === "") {
    showError(emailInput, "Email is required.");
    return false;
  }

  if (!EMAIL_PATTERN.test(email)) {
    showError(emailInput, "Please enter a valid email address.");
    return false;
  }

  if (users.some(user => user.email === email)) {
    showError(emailInput, "This email is already registered.");
    return false;
  }

  clearError(emailInput);
  return true;
}

function validatePassword() {
  const password = passwordInput.value;

  if (password === "") {
    showError(passwordInput, "Password is required.");
    return false;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    showError(
      passwordInput,
      "Password must be at least 6 characters long."
    );
    return false;
  }

  clearError(passwordInput);
  return true;
}


// ===== Display Users =====

function displayUsers() {
  tableBody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>Protected</td>
      <td>
        <button class="btn btn-delete" onclick="deleteUser(${user.id})">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  userCount.textContent = users.length;

  emptyState.classList.toggle(
    "is-hidden",
    users.length > 0
  );
}


// ===== Add User =====

async function addUser() {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  // Convert password into a hash
  const passwordData = await hashPassword(password);

  users.push({
    id: Date.now(),
    username: username,
    email: email,
    passwordHash: passwordData.passwordHash,
    passwordSalt: passwordData.passwordSalt
  });

  saveUsers();
  displayUsers();
}


// ===== Delete User =====

function deleteUser(id) {
  users = users.filter(user => user.id !== id);

  saveUsers();
  displayUsers();
}


// ===== Form Submit =====

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const usernameValid = validateUsername();
  const emailValid = validateEmail();
  const passwordValid = validatePassword();

  if (!usernameValid || !emailValid || !passwordValid) {
    return;
  }

  await addUser();

  form.reset();

  successMessage.textContent = "Account created successfully!";

  setTimeout(() => {
    successMessage.textContent = "";
  }, 3000);
});


// ===== Clear Errors =====

usernameInput.addEventListener("input", () => {
  clearError(usernameInput);
});

emailInput.addEventListener("input", () => {
  clearError(emailInput);
});

passwordInput.addEventListener("input", () => {
  clearError(passwordInput);
});


// ===== Show / Hide Password =====

togglePasswordBtn.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});


// ===== Start =====

displayUsers();
