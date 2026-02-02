const toggleCss = document.getElementById("toggle-css");
let cssEnabled = localStorage.getItem("cssEnabled") !== "false";

function applyCssState() {
  document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style').forEach((el) => {
    el.disabled = !cssEnabled;
  });
  if (toggleCss) {
    toggleCss.textContent = cssEnabled ? "nuke css" : "enable css";
  }
}

// Apply saved state on load
applyCssState();

toggleCss?.addEventListener("click", () => {
  cssEnabled = !cssEnabled;
  localStorage.setItem("cssEnabled", `${cssEnabled}`);
  applyCssState();
});
