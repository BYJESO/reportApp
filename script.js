// Inicializar localStorage si es necesario
if (!localStorage.getItem("loans")) {
  localStorage.setItem("loans", JSON.stringify({}));
}

// Función para cargar los préstamos desde localStorage
function loadLoans() {
  return JSON.parse(localStorage.getItem("loans"));
}

// Función para guardar los préstamos en localStorage
function saveLoans(loans) {
  localStorage.setItem("loans", JSON.stringify(loans));
}

// Función para actualizar la interfaz
function updateUI() {
  const loans = loadLoans();
  const listA = document.getElementById("listA");
  const listB = document.getElementById("listB");
  const loanSummary = document.getElementById("loanSummary");

  // Limpiar las listas y el resumen
  listA.innerHTML = "";
  listB.innerHTML = "";
  loanSummary.innerHTML = "";

  // Objeto para almacenar los totales
  const totals = {};

  // Iterar sobre cada producto
  for (const product in loans) {
    let productTotal = 0;

    // Crear elementos para cada préstamo
    for (const restaurant in loans[product]) {
      const quantity = loans[product][restaurant];
      const li = document.createElement("li");
      li.textContent = `${product}: ${quantity}`;

      if (restaurant === "A") {
        listA.appendChild(li);
        productTotal += quantity;
      } else {
        listB.appendChild(li);
        productTotal -= quantity;
      }
    }

    // Almacenar el total del producto
    if (productTotal !== 0) {
      totals[product] = productTotal;
    }
  }

  // Mostrar el resumen de préstamos
  for (const product in totals) {
    const p = document.createElement("p");
    const debtor = totals[product] > 0 ? "Mr Muu" : "Calera BG";
    const amount = Math.abs(totals[product]);
    p.textContent = `Hamburguesería ${debtor} debe ${amount} de ${product}`;
    loanSummary.appendChild(p);
  }
}

// Función para registrar un nuevo préstamo
function registerLoan(event) {
  event.preventDefault();

  const product = document.getElementById("productName").value;
  const quantity = Number.parseInt(document.getElementById("quantity").value);
  const unit = document.getElementById("unit").value;
  const restaurant = document.getElementById("restaurant").value;

  const loans = loadLoans();

  // Inicializar el producto si no existe
  if (!loans[product]) {
    loans[product] = { A: 0, B: 0 };
  }

  // Actualizar la cantidad del préstamo
  loans[product][restaurant] += quantity;

  // Si la cantidad llega a 0, eliminar el registro
  if (loans[product][restaurant] === 0) {
    delete loans[product][restaurant];
  }
  if (Object.keys(loans[product]).length === 0) {
    delete loans[product];
  }

  saveLoans(loans);

  // Limpiar el formulario
  event.target.reset();

  updateUI();
}

// Escuchar el envío del formulario
document.getElementById("loanForm").addEventListener("submit", registerLoan);

// Actualizar la interfaz al cargar la página
updateUI();
