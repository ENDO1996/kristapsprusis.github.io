const STORAGE_KEY = "promptLaunchpadDestinations";

const defaultDestinations = [
  {
    name: "ChatGPT Images",
    urlTemplate: "https://chatgpt.com/",
    notes: "Paste prompt, choose image model, submit.",
    enabled: true,
  },
  {
    name: "Gemini",
    urlTemplate: "https://gemini.google.com/",
    notes: "Paste prompt and generate.",
    enabled: true,
  },
  {
    name: "Envato (AI Labs)",
    urlTemplate: "https://elements.envato.com/",
    notes: "Open your target AI page and paste prompt.",
    enabled: false,
  },
  {
    name: "Kling",
    urlTemplate: "https://app.klingai.com/global/",
    notes: "Paste prompt into text-to-video or image flow.",
    enabled: false,
  },
  {
    name: "URL-prefill example",
    urlTemplate: "https://example.com/create?prompt={prompt}",
    notes: "Replace with tools that support query prefill.",
    enabled: false,
  },
];

const promptInput = document.getElementById("prompt");
const destinationsWrap = document.getElementById("destinations");
const statusEl = document.getElementById("status");

function loadDestinations() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultDestinations;
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return defaultDestinations;
    }

    return parsed;
  } catch {
    return defaultDestinations;
  }
}

function saveDestinations(destinations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
}

let destinations = loadDestinations();

function renderDestinations() {
  destinationsWrap.innerHTML = "";

  destinations.forEach((destination, index) => {
    const card = document.createElement("article");
    card.className = "card";

    const body = document.createElement("div");
    body.className = "card-body launchpad-destination";

    const top = document.createElement("div");
    top.className = "launchpad-destination-top";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(destination.enabled);
    checkbox.addEventListener("change", () => {
      destinations[index].enabled = checkbox.checked;
      saveDestinations(destinations);
    });

    const title = document.createElement("strong");
    title.textContent = destination.name || "Untitled";

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-ghost btn-small";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      destinations.splice(index, 1);
      saveDestinations(destinations);
      renderDestinations();
    });

    top.append(checkbox, title, deleteButton);

    const nameLabel = document.createElement("label");
    nameLabel.className = "field-label";
    nameLabel.textContent = "Name";

    const nameInput = document.createElement("input");
    nameInput.className = "launchpad-input";
    nameInput.value = destination.name;
    nameInput.addEventListener("input", () => {
      destinations[index].name = nameInput.value;
      saveDestinations(destinations);
      title.textContent = nameInput.value || "Untitled";
    });

    const urlLabel = document.createElement("label");
    urlLabel.className = "field-label";
    urlLabel.textContent = "URL template";

    const urlInput = document.createElement("input");
    urlInput.className = "launchpad-input";
    urlInput.value = destination.urlTemplate;
    urlInput.addEventListener("input", () => {
      destinations[index].urlTemplate = urlInput.value;
      saveDestinations(destinations);
    });

    const notesLabel = document.createElement("label");
    notesLabel.className = "field-label";
    notesLabel.textContent = "Notes";

    const notesInput = document.createElement("input");
    notesInput.className = "launchpad-input";
    notesInput.value = destination.notes || "";
    notesInput.addEventListener("input", () => {
      destinations[index].notes = notesInput.value;
      saveDestinations(destinations);
    });

    body.append(top, nameLabel, nameInput, urlLabel, urlInput, notesLabel, notesInput);
    card.append(body);
    destinationsWrap.append(card);
  });
}

async function copyPromptToClipboard(prompt) {
  if (!prompt.trim()) {
    setStatus("Add a prompt first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(prompt);
    setStatus("Prompt copied.");
  } catch {
    setStatus("Could not copy automatically. Copy manually.");
  }
}

function setStatus(message) {
  statusEl.textContent = message;
}

function applyPrompt(template, prompt) {
  if (!template.includes("{prompt}")) {
    return template;
  }

  return template.replaceAll("{prompt}", encodeURIComponent(prompt));
}

function openSelectedSites() {
  const prompt = promptInput.value;
  const selected = destinations.filter((destination) => destination.enabled);

  if (selected.length === 0) {
    setStatus("Select at least one destination.");
    return;
  }

  selected.forEach((destination) => {
    const targetUrl = applyPrompt(destination.urlTemplate, prompt);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  });

  copyPromptToClipboard(prompt);
  setStatus(`Opened ${selected.length} destination(s).`);
}

document.getElementById("copyPrompt").addEventListener("click", () => {
  copyPromptToClipboard(promptInput.value);
});

document.getElementById("openSelected").addEventListener("click", openSelectedSites);

document.getElementById("addDestination").addEventListener("click", () => {
  destinations.push({
    name: "New destination",
    urlTemplate: "https://",
    notes: "",
    enabled: true,
  });

  saveDestinations(destinations);
  renderDestinations();
});

renderDestinations();
