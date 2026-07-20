// src/utils/validators.js

export function required(value) {
  return value !== null &&
    value !== undefined &&
    value.toString().trim() !== "";
}

export function minLength(value, min) {
  return value.length >= min;
}

export function maxLength(value, max) {
  return value.length <= max;
}

export function email(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function phone(value = "") {
  return value.replace(/\D/g, "").length === 11;
}

export function cep(value = "") {
  return /^\d{5}-?\d{3}$/.test(value);
}

export function birthDate(date) {
  if (!date) return false;

  const nascimento = new Date(date);

  if (isNaN(nascimento.getTime())) return false;

  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const m =
    hoje.getMonth() - nascimento.getMonth();

  if (
    m < 0 ||
    (m === 0 &&
      hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }

  return idade >= 18;
}

export function password(password = "") {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function confirmPassword(
  password,
  confirmPassword
) {
  return password === confirmPassword;
}

export function file(file) {
  return !!file;
}

export function image(file) {
  if (!file) return false;

  return (
    file.type?.includes("image") ||
    /\.(jpg|jpeg|png)$/i.test(file.name)
  );
}

export function pdf(file) {
  if (!file) return false;

  return (
    file.type === "application/pdf" ||
    /\.pdf$/i.test(file.name)
  );
}