(() => {
  const ICON_SRC = "/assets/streamline/transform-direct-select-freehand.png";
  const SELECTOR = "select:not([multiple]):not([size])";
  const ENHANCED = "data-sketch-select-enhanced";
  let activeSelect = null;
  let globalObserver = null;
  let syncFrame = 0;

  function labelFor(select) {
    if (select.getAttribute("aria-label")) return select.getAttribute("aria-label");
    const label = select.closest("label");
    if (label) {
      const clone = label.cloneNode(true);
      clone.querySelectorAll("select, input, textarea, button, .sketch-select").forEach((node) => node.remove());
      const text = clone.textContent.trim();
      if (text) return text;
    }
    return "选择";
  }

  function selectedOption(select) {
    return select.selectedOptions?.[0] || select.options[select.selectedIndex] || select.options[0] || null;
  }

  function optionLabel(option) {
    return option?.textContent?.trim() || option?.label || option?.value || "";
  }

  function closeSelect(select = activeSelect) {
    if (!select) return;
    const ui = select.__sketchSelect;
    if (!ui) return;
    ui.wrapper.classList.remove("is-open");
    ui.toggle.setAttribute("aria-expanded", "false");
    ui.menu.hidden = true;
    activeSelect = activeSelect === select ? null : activeSelect;
  }

  function closeAll() {
    closeSelect(activeSelect);
  }

  function positionMenu(select) {
    const ui = select.__sketchSelect;
    if (!ui || ui.menu.hidden) return;
    const rect = ui.toggle.getBoundingClientRect();
    const gutter = 12;
    const menuWidth = Math.max(rect.width, Math.min(360, Math.max(220, ui.menu.scrollWidth)));
    const left = Math.min(Math.max(gutter, rect.left), window.innerWidth - menuWidth - gutter);
    const roomBelow = window.innerHeight - rect.bottom - gutter;
    const roomAbove = rect.top - gutter;
    const opensUp = roomBelow < 220 && roomAbove > roomBelow;
    const maxHeight = Math.max(180, Math.min(420, (opensUp ? roomAbove : roomBelow) - 8));

    ui.menu.style.minWidth = `${Math.round(rect.width)}px`;
    ui.menu.style.width = `${Math.round(menuWidth)}px`;
    ui.menu.style.maxHeight = `${Math.round(maxHeight)}px`;
    ui.menu.style.left = `${Math.round(left)}px`;
    ui.menu.style.top = opensUp
      ? `${Math.round(Math.max(gutter, rect.top - Math.min(ui.menu.scrollHeight, maxHeight) - 8))}px`
      : `${Math.round(rect.bottom + 8)}px`;
    ui.menu.classList.toggle("opens-up", opensUp);
  }

  function optionRow(select, option, index) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "sketch-select-option";
    row.id = `${select.__sketchSelect.id}-option-${index}`;
    row.setAttribute("role", "option");
    row.dataset.value = option.value;
    row.disabled = option.disabled;
    if (option.selected) {
      row.classList.add("is-selected");
      row.setAttribute("aria-selected", "true");
    } else {
      row.setAttribute("aria-selected", "false");
    }

    const marker = document.createElement("span");
    marker.className = "sketch-select-marker";
    marker.setAttribute("aria-hidden", "true");
    const icon = document.createElement("img");
    icon.src = ICON_SRC;
    icon.alt = "";
    marker.appendChild(icon);

    const text = document.createElement("span");
    text.className = "sketch-select-option-label";
    text.textContent = optionLabel(option);

    row.append(marker, text);
    row.addEventListener("click", () => chooseOption(select, option.value));
    row.addEventListener("keydown", (event) => handleOptionKeydown(event, select, row));
    return row;
  }

  function syncSelect(select) {
    const ui = select.__sketchSelect;
    if (!ui) return;
    const current = selectedOption(select);
    const disabled = select.disabled;
    ui.wrapper.classList.toggle("is-disabled", disabled);
    ui.toggle.disabled = disabled;
    ui.toggle.setAttribute("aria-label", labelFor(select));
    ui.value.textContent = current ? optionLabel(current) : "";
    ui.menu.replaceChildren(...Array.from(select.options).map((option, index) => optionRow(select, option, index)));
    if (!ui.menu.hidden) positionMenu(select);
  }

  function scheduleSyncAll() {
    if (syncFrame) return;
    syncFrame = window.requestAnimationFrame(() => {
      syncFrame = 0;
      document.querySelectorAll(`[${ENHANCED}="true"]`).forEach(syncSelect);
      enhanceAll();
    });
  }

  function chooseOption(select, value) {
    if (select.value !== value) {
      select.value = value;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    syncSelect(select);
    closeSelect(select);
    select.__sketchSelect.toggle.focus();
  }

  function focusSelected(select) {
    const ui = select.__sketchSelect;
    const selected = ui.menu.querySelector(".sketch-select-option.is-selected");
    const first = ui.menu.querySelector(".sketch-select-option:not(:disabled)");
    (selected || first)?.focus();
  }

  function openSelect(select) {
    if (select.disabled) return;
    if (activeSelect && activeSelect !== select) closeSelect(activeSelect);
    const ui = select.__sketchSelect;
    syncSelect(select);
    ui.wrapper.classList.add("is-open");
    ui.toggle.setAttribute("aria-expanded", "true");
    ui.menu.hidden = false;
    activeSelect = select;
    positionMenu(select);
    window.requestAnimationFrame(() => focusSelected(select));
  }

  function toggleSelect(select) {
    const ui = select.__sketchSelect;
    if (ui.menu.hidden) openSelect(select);
    else closeSelect(select);
  }

  function moveOption(current, direction) {
    const options = Array.from(current.parentElement.querySelectorAll(".sketch-select-option:not(:disabled)"));
    const index = options.indexOf(current);
    const next = options[(index + direction + options.length) % options.length];
    next?.focus();
  }

  function handleOptionKeydown(event, select, row) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveOption(row, 1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveOption(row, -1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      row.parentElement.querySelector(".sketch-select-option:not(:disabled)")?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      Array.from(row.parentElement.querySelectorAll(".sketch-select-option:not(:disabled)")).pop()?.focus();
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseOption(select, row.dataset.value);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeSelect(select);
      select.__sketchSelect.toggle.focus();
    }
  }

  function enhance(select) {
    if (select.getAttribute(ENHANCED) === "true" || select.multiple || Number(select.size) > 1) return;
    const id = `sketch-select-${Math.random().toString(36).slice(2, 9)}`;
    const wrapper = document.createElement("span");
    wrapper.className = "sketch-select";
    if (select.id) wrapper.dataset.selectId = select.id;
    if (select.name) wrapper.dataset.selectName = select.name;

    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add("sketch-native-select");
    select.setAttribute(ENHANCED, "true");

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "sketch-select-toggle";
    toggle.id = `${id}-toggle`;
    toggle.setAttribute("aria-haspopup", "listbox");
    toggle.setAttribute("aria-expanded", "false");

    const value = document.createElement("span");
    value.className = "sketch-select-value";
    const arrow = document.createElement("span");
    arrow.className = "sketch-select-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "⌄";
    toggle.append(value, arrow);

    const menu = document.createElement("div");
    menu.className = "sketch-select-menu";
    menu.id = `${id}-menu`;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-labelledby", toggle.id);
    menu.hidden = true;
    document.body.appendChild(menu);

    select.__sketchSelect = { wrapper, toggle, value, menu, id };
    wrapper.appendChild(toggle);

    toggle.addEventListener("click", () => toggleSelect(select));
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSelect(select);
      }
    });
    select.addEventListener("change", () => syncSelect(select));

    const observer = new MutationObserver(() => syncSelect(select));
    observer.observe(select, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["disabled", "selected", "label", "value"]
    });

    syncSelect(select);
  }

  function enhanceAll(root = document) {
    root.querySelectorAll(SELECTOR).forEach(enhance);
  }

  document.addEventListener("click", (event) => {
    const ui = activeSelect?.__sketchSelect;
    if (!ui) return;
    if (ui.wrapper.contains(event.target) || ui.menu.contains(event.target)) return;
    closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  window.addEventListener("resize", () => activeSelect && positionMenu(activeSelect));
  window.addEventListener("scroll", () => activeSelect && positionMenu(activeSelect), true);
  document.addEventListener("reset", () => window.setTimeout(scheduleSyncAll, 0));

  function start() {
    enhanceAll();
    if (!globalObserver) {
      globalObserver = new MutationObserver((mutations) => {
        const onlySketchSelectMutations = mutations.every((mutation) => {
          const target = mutation.target;
          return target instanceof Element && (
            target.closest(".sketch-select-menu") ||
            target.closest(".sketch-select") ||
            target.closest(".rough-ui-layer")
          );
        });
        if (!onlySketchSelectMutations) scheduleSyncAll();
      });
      globalObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
