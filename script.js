const fileInput = document.querySelector("#clips");
const fileList = document.querySelector("#file-list");
const status = document.querySelector("#status p");
const statusDot = document.querySelector(".status-dot");
const form = document.querySelector("#editor-form");

const updateStatus = (message, isReady) => {
  status.textContent = message;
  statusDot.style.background = isReady ? "#4ade80" : "#f97316";
  statusDot.style.boxShadow = isReady
    ? "0 0 12px rgba(74, 222, 128, 0.6)"
    : "0 0 12px rgba(249, 115, 22, 0.6)";
};

const formatFileSize = (size) => {
  const kb = size / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
};

const renderFiles = (files) => {
  fileList.innerHTML = "";
  if (!files.length) {
    const item = document.createElement("li");
    item.textContent = "Nenhum clip carregado.";
    fileList.appendChild(item);
    updateStatus("Pronto para enviar seus clipes e gerar a edição.", true);
    return;
  }

  Array.from(files).forEach((file) => {
    const item = document.createElement("li");
    item.textContent = `${file.name} • ${formatFileSize(file.size)}`;
    fileList.appendChild(item);
  });

  updateStatus(`Pronto para editar ${files.length} clip(s).`, false);
};

fileInput.addEventListener("change", (event) => {
  renderFiles(event.target.files);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const projectName = form.project.value.trim() || "Projeto";
  updateStatus(`Gerando edição de ${projectName}. Aguarde...`, false);

  setTimeout(() => {
    updateStatus(`Edição pronta! ${projectName} está pronto para download.`, true);
  }, 1500);
});
