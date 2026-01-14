const clipInput = document.getElementById("clip-input");
const clipList = document.getElementById("clip-list");
const emptyState = document.getElementById("empty-state");
const generateButton = document.getElementById("generate");
const statusText = document.getElementById("status");
const tempoSlider = document.getElementById("tempo");
const tempoValue = document.getElementById("tempo-value");
const resultSection = document.getElementById("result");
const downloadButton = document.getElementById("download");
const selectFilesButton = document.getElementById("select-files");
const uploadArea = document.getElementById("upload-area");

const clips = [];
let briefingBlobUrl = null;

const updateTempo = () => {
  tempoValue.textContent = `${tempoSlider.value} BPM`;
};

const updateStatus = () => {
  const hasClips = clips.length > 0;
  generateButton.disabled = !hasClips;
  statusText.textContent = hasClips
    ? "Pronto para gerar a edição."
    : "Carregue clipes para habilitar.";
  emptyState.style.display = hasClips ? "none" : "block";
};

const renderClips = () => {
  clipList.innerHTML = "";
  clips.forEach((clip, index) => {
    const listItem = document.createElement("li");
    listItem.className = "clip-item";

    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${clip.name}`;

    const meta = document.createElement("div");
    meta.className = "clip-meta";
    meta.textContent = `Duração estimada: ${clip.duration}`;

    const note = document.createElement("input");
    note.placeholder = "Adicionar nota para este clipe";
    note.value = clip.note;
    note.addEventListener("input", (event) => {
      clip.note = event.target.value;
    });

    listItem.append(title, meta, note);
    clipList.appendChild(listItem);
  });
};

const addClips = (files) => {
  Array.from(files).forEach((file) => {
    clips.push({
      name: file.name,
      duration: `${Math.ceil(file.size / 1000000)} min`,
      note: "",
    });
  });
  renderClips();
  updateStatus();
};

const handleFiles = (event) => {
  if (event.target.files.length === 0) return;
  addClips(event.target.files);
};

const buildBriefing = () => {
  const style = document.getElementById("style").value;
  const tone = document.getElementById("tone").value;
  const notes = document.getElementById("notes").value;
  const lines = [
    "Briefing de edição - ClipForge",
    `Estilo: ${style}`,
    `BPM: ${tempoSlider.value}`,
    `Tom: ${tone}`,
    "",
    "Clipes:",
  ];

  clips.forEach((clip, index) => {
    lines.push(`${index + 1}. ${clip.name} - ${clip.note || "Sem nota"}`);
  });

  if (notes.trim()) {
    lines.push("", "Observações gerais:", notes.trim());
  }

  return lines.join("\n");
};

const generateEdit = () => {
  if (clips.length === 0) return;

  statusText.textContent = "Gerando edição...";
  generateButton.disabled = true;

  window.setTimeout(() => {
    const briefing = buildBriefing();
    const blob = new Blob([briefing], { type: "text/plain" });
    if (briefingBlobUrl) {
      URL.revokeObjectURL(briefingBlobUrl);
    }
    briefingBlobUrl = URL.createObjectURL(blob);
    resultSection.classList.add("active");
    statusText.textContent = "Edição gerada com sucesso!";
    generateButton.disabled = false;
  }, 900);
};

const triggerDownload = () => {
  if (!briefingBlobUrl) return;
  const link = document.createElement("a");
  link.href = briefingBlobUrl;
  link.download = "briefing-edicao.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

selectFilesButton.addEventListener("click", () => clipInput.click());
clipInput.addEventListener("change", handleFiles);

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("dragging");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragging");
});

uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadArea.classList.remove("dragging");
  if (event.dataTransfer.files.length) {
    addClips(event.dataTransfer.files);
  }
});

tempoSlider.addEventListener("input", updateTempo);

generateButton.addEventListener("click", generateEdit);
downloadButton.addEventListener("click", triggerDownload);

document.getElementById("cta-upload").addEventListener("click", () => {
  clipInput.click();
});

document.getElementById("cta-demo").addEventListener("click", () => {
  document.getElementById("upload-area").scrollIntoView({
    behavior: "smooth",
  });
});

updateTempo();
updateStatus();
