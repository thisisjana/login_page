// ===== Constants =====
const STORAGE_KEY = "registeredUsers";
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== DOM elements =====
const form = document.getElementById("signup-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");
const successMessage = document.getElementById("form-success");

const tableBody = document.getElementById("users-table-body");
const userCount = document.getElementById("user-count");
const emptyState = document.getElementById("empty-state");

// ===== State =====
let users = loadUsers();

// ===== LocalStorage helpers =====
function loadUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not read users from LocalStorage:", error);
    return [];
  }
}

function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// ===== Validation helpers =====
function showError(input, message) {
  const errorEl = document.getElementById(input.id + "-error");
  errorEl.textContent = message;
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  const errorEl = document.getElementById(input.id + "-error");
  errorEl.textContent = "";
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
}

function validateUsername() {
  const value = usernameInput.value.trim();
  if (value === "") {
    showError(usernameInput, "Username is required.");
    return false;
  }
  clearError(usernameInput);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim().toLowerCase();
  if (value === "") {
    showError(emailInput, "Email is required.");
    return false;
  }
  if (!EMAIL_PATTERN.test(value)) {
    showError(emailInput, "Please enter a valid email address (e.g. name@example.com).");
    return false;
  }
  const alreadyExists = users.some((user) => user.email.toLowerCase() === value);
  if (alreadyExists) {
    showError(emailInput, "This email is already registered. Please use a different one.");
    return false;
  }
  clearError(emailInput);
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  if (value === "") {
    showError(passwordInput, "Password is required.");
    return false;
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    showError(passwordInput, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    return false;
  }
  clearError(passwordInput);
  return true;
}

// ===== Rendering =====
function renderUsers() {
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");

    const usernameCell = document.createElement("td");
    usernameCell.className = "cell-username";
    usernameCell.textContent = user.username;

    const emailCell = document.createElement("td");
    emailCell.className = "cell-email";
    emailCell.textContent = user.email;

    const passwordCell = document.createElement("td");
    passwordCell.className = "cell-password";
    passwordCell.textContent = user.password;

    const actionCell = document.createElement("td");
    actionCell.className = "cell-action";
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete user ${user.username}`);
    deleteBtn.addEventListener("click", () => deleteUser(user.id));
    actionCell.appendChild(deleteBtn);

    row.append(usernameCell, emailCell, passwordCell, actionCell);
    tableBody.appendChild(row);
  });

  userCount.textContent = users.length;
  emptyState.classList.toggle("is-hidden", users.length > 0);
}

// ===== Actions =====
function addUser(username, email, password) {
  users.push({
    id: Date.now(),
    username,
    email,
    password,
  });
  saveUsers();
  renderUsers();
}

function deleteUser(id) {
  users = users.filter((user) => user.id !== id);
  saveUsers();
  renderUsers();
}

function showSuccess(message) {
  successMessage.textContent = message;
  clearTimeout(showSuccess.timer);
  showSuccess.timer = setTimeout(() => {
    successMessage.textContent = "";
  }, 3000);
}

// ===== Event listeners =====
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Run every validator so all errors show at once.
  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
    return;
  }

  addUser(usernameInput.value.trim(), emailInput.value.trim(), passwordInput.value);
  form.reset();
  usernameInput.focus();
  showSuccess("Account created successfully!");
});

// Clear an error as soon as the user starts fixing that field.
usernameInput.addEventListener("input", () => clearError(usernameInput));
emailInput.addEventListener("input", () => clearError(emailInput));
passwordInput.addEventListener("input", () => clearError(passwordInput));

togglePasswordBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePasswordBtn.classList.toggle("is-visible", isHidden);
  togglePasswordBtn.setAttribute("aria-pressed", String(isHidden));
  togglePasswordBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

// ===== Initial render =====
renderUsers();
