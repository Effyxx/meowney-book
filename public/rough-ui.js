(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const LAYER_ID = "roughUiLayer";

  const STYLE_PRESETS = {
    singleSoft: {
      stroke: "rgba(201, 155, 88, 0.42)",
      strokeWidth: 1,
      roughness: 0.95,
      bowing: 0.9,
      radius: 30,
      seed: 11
    },
    singleStrong: {
      stroke: "rgba(185, 133, 57, 0.58)",
      strokeWidth: 1.35,
      roughness: 1.55,
      bowing: 1.35,
      radius: 24,
      seed: 12
    },
    singleWild: {
      stroke: "rgba(155, 101, 30, 0.72)",
      strokeWidth: 1.9,
      roughness: 2.25,
      bowing: 2,
      radius: 24,
      seed: 13
    },
    hachure: {
      stroke: "rgba(173, 116, 39, 0.62)",
      strokeWidth: 1.2,
      roughness: 1.25,
      bowing: 1,
      radius: 24,
      seed: 25
    },
    navActive: {
      stroke: "rgba(201, 149, 68, 0.54)",
      strokeWidth: 1.2,
      roughness: 1.25,
      bowing: 1.1,
      radius: 14,
      seed: 16
    },
    tag: {
      stroke: "rgba(221, 183, 129, 0.58)",
      strokeWidth: 1,
      roughness: 1.25,
      bowing: 1,
      radius: 14,
      seed: 17
    }
  };

  let frame = 0;
  let observer = null;
  let drawing = false;
  let drawAgain = false;

  function createSvgElement(tag) {
    return document.createElementNS(SVG_NS, tag);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6D2B79F5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function stableSeed(element, preset, index) {
    const text = element.textContent ? element.textContent.trim().slice(0, 40) : "";
    const key = [
      preset.seed,
      element.id,
      element.name,
      element.dataset.view,
      element.dataset.entryView,
      element.className,
      text,
      index
    ].join("|");
    return hashString(key);
  }

  function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return (
      rect.width > 2 &&
      rect.height > 2 &&
      rect.bottom >= -24 &&
      rect.right >= -24 &&
      rect.top <= window.innerHeight + 24 &&
      rect.left <= window.innerWidth + 24 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) !== 0
    );
  }

  function ensureLayer() {
    let layer = document.getElementById(LAYER_ID);
    if (!layer) {
      layer = createSvgElement("svg");
      layer.id = LAYER_ID;
      layer.classList.add("rough-ui-layer");
      layer.setAttribute("aria-hidden", "true");
      layer.setAttribute("focusable", "false");
      document.body.appendChild(layer);
    }
    layer.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    layer.setAttribute("width", String(window.innerWidth));
    layer.setAttribute("height", String(window.innerHeight));
    return layer;
  }

  function appendPath(layer, d, preset) {
    const path = createSvgElement("path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", preset.stroke);
    path.setAttribute("stroke-width", String(preset.strokeWidth));
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    layer.appendChild(path);
  }

  function appendFilledPath(layer, d, fill) {
    const path = createSvgElement("path");
    path.setAttribute("d", d);
    path.setAttribute("fill", fill);
    path.setAttribute("stroke", "none");
    layer.appendChild(path);
  }

  function addLinePoints(points, x1, y1, x2, y2, steps) {
    const total = Math.max(1, steps);
    for (let index = 0; index <= total; index += 1) {
      const t = index / total;
      points.push({
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t
      });
    }
  }

  function addArcPoints(points, cx, cy, radius, startDeg, endDeg, steps) {
    const total = Math.max(2, steps);
    for (let index = 1; index <= total; index += 1) {
      const t = index / total;
      const angle = (startDeg + (endDeg - startDeg) * t) * Math.PI / 180;
      points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      });
    }
  }

  function roundedRectPoints(rect, preset) {
    const inset = Math.max(3, preset.strokeWidth + 2);
    const left = rect.left + inset;
    const top = rect.top + inset;
    const width = Math.max(1, rect.width - inset * 2);
    const height = Math.max(1, rect.height - inset * 2);
    const right = left + width;
    const bottom = top + height;
    const radius = Math.max(3, Math.min(preset.radius, width / 2, height / 2));
    const horizontalSteps = Math.max(3, Math.round(width / 34));
    const verticalSteps = Math.max(2, Math.round(height / 28));
    const points = [];

    addLinePoints(points, left + radius, top, right - radius, top, horizontalSteps);
    addArcPoints(points, right - radius, top + radius, radius, -90, 0, 5);
    addLinePoints(points, right, top + radius, right, bottom - radius, verticalSteps);
    addArcPoints(points, right - radius, bottom - radius, radius, 0, 90, 5);
    addLinePoints(points, right - radius, bottom, left + radius, bottom, horizontalSteps);
    addArcPoints(points, left + radius, bottom - radius, radius, 90, 180, 5);
    addLinePoints(points, left, bottom - radius, left, top + radius, verticalSteps);
    addArcPoints(points, left + radius, top + radius, radius, 180, 270, 5);
    return points;
  }

  function jitterPoints(points, preset, seed, closePath) {
    const rand = seededRandom(seed);
    const amount = preset.roughness * 1.25;
    return points.map((point, index) => {
      const wave = Math.sin((index / Math.max(1, points.length - 1)) * Math.PI * 4 + seed) * preset.bowing * 0.45;
      return {
        x: point.x + (rand() - 0.5) * amount + wave * 0.18,
        y: point.y + (rand() - 0.5) * amount + wave
      };
    }).concat(closePath ? [] : []);
  }

  function smoothPath(points, closePath) {
    if (!points.length) return "";
    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let index = 1; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      d += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
    }
    const last = points[points.length - 1];
    if (closePath) {
      const first = points[0];
      d += ` Q ${last.x.toFixed(2)} ${last.y.toFixed(2)} ${first.x.toFixed(2)} ${first.y.toFixed(2)} Z`;
    } else {
      d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
    }
    return d;
  }

  function polylinePath(points) {
    if (!points.length) return "";
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");
  }

  function drawBox(layer, element, preset, index) {
    if (!isElementVisible(element)) return;
    const rect = element.getBoundingClientRect();
    const seed = stableSeed(element, preset, index);
    const points = jitterPoints(roundedRectPoints(rect, preset), preset, seed, true);
    appendPath(layer, smoothPath(points, true), preset);
  }

  function presetWith(preset, overrides) {
    return { ...preset, ...overrides };
  }

  function visibleStrokeColor(element, fallback) {
    const style = getComputedStyle(element);
    const categoryInk = style.getPropertyValue("--category-ink").trim();
    if (categoryInk) return categoryInk;
    const background = style.backgroundColor;
    if (background && background !== "rgba(0, 0, 0, 0)" && background !== "transparent") return background;
    return fallback;
  }

  function visibleTrackColor(element, fallback) {
    const style = getComputedStyle(element);
    const categoryBg = style.getPropertyValue("--category-bg").trim();
    if (categoryBg) return categoryBg;
    const background = style.backgroundColor;
    if (background && background !== "rgba(0, 0, 0, 0)" && background !== "transparent") return background;
    return fallback;
  }

  function progressStrokeColor(element) {
    const status = element.dataset.status;
    if (status === "watch") return "rgba(240, 201, 120, 0.78)";
    if (status === "over") return "rgba(215, 154, 142, 0.78)";
    return visibleStrokeColor(element, "rgba(159, 184, 160, 0.78)");
  }

  function linePoints(x1, y1, x2, y2, preset, seed) {
    const rand = seededRandom(seed);
    const length = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(6, Math.min(52, Math.round(length / 44)));
    const dx = x2 - x1;
    const dy = y2 - y1;
    const normalLength = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / normalLength;
    const ny = dx / normalLength;
    const points = [];
    for (let index = 0; index <= steps; index += 1) {
      const t = index / steps;
      const bow = Math.sin(t * Math.PI * 2 + seed) * preset.bowing;
      const jitter = (rand() - 0.5) * preset.roughness * 1.6 + bow * 0.45;
      points.push({
        x: x1 + dx * t + nx * jitter,
        y: y1 + dy * t + ny * jitter
      });
    }
    return points;
  }

  function drawLine(layer, x1, y1, x2, y2, preset, seed) {
    appendPath(layer, polylinePath(linePoints(x1, y1, x2, y2, preset, seed)), preset);
  }

  function drawWeekFillPaint(layer, element, index) {
    if (!isElementVisible(element)) return;
    const rect = element.getBoundingClientRect();
    const baseSeed = stableSeed(element, STYLE_PRESETS.hachure, index + 720);
    const rand = seededRandom(baseSeed);
    const fillPreset = presetWith(STYLE_PRESETS.singleSoft, {
      strokeWidth: 0.2,
      roughness: 2.05,
      bowing: 1.55,
      radius: 18,
      seed: 71
    });
    const washCount = rect.height > 34 ? 3 : 2;

    for (let washIndex = 0; washIndex < washCount; washIndex += 1) {
      const insetX = 3 + rand() * 2.2 + washIndex * 0.5;
      const insetTop = 2 + rand() * 2;
      const insetBottom = 1.5 + rand() * 2;
      const paintRect = {
        left: rect.left + insetX + (rand() - 0.5) * 1.8,
        top: rect.top + insetTop + (rand() - 0.5) * 1.8,
        width: Math.max(2, rect.width - insetX * 2),
        height: Math.max(2, rect.height - insetTop - insetBottom)
      };
      const paintPoints = jitterPoints(
        roundedRectPoints(paintRect, fillPreset),
        fillPreset,
        baseSeed + washIndex * 97,
        true
      );
      const opacity = washIndex === 0 ? 0.22 : 0.14;
      appendFilledPath(layer, smoothPath(paintPoints, true), `rgba(240, 165, 54, ${opacity})`);
    }

    const top = rect.top + Math.max(4, Math.min(8, rect.height * 0.08));
    const bottom = rect.bottom - Math.max(3, Math.min(7, rect.height * 0.08));
    const availableHeight = Math.max(2, bottom - top);
    const verticalCount = Math.max(2, Math.min(5, Math.round(rect.width / 11)));
    const insetX = Math.max(5, Math.min(10, rect.width * 0.16));

    for (let columnIndex = 0; columnIndex < verticalCount; columnIndex += 1) {
      const t = verticalCount === 1 ? 0.5 : columnIndex / (verticalCount - 1);
      const x = rect.left + insetX + (rect.width - insetX * 2) * t + (rand() - 0.5) * 4;
      const lean = (rand() - 0.5) * Math.min(8, rect.width * 0.16);
      const preset = presetWith(STYLE_PRESETS.singleSoft, {
        stroke: columnIndex % 2 ? "rgba(246, 172, 55, 0.42)" : "rgba(238, 151, 31, 0.46)",
        strokeWidth: Math.max(6, Math.min(13, rect.width * 0.28 + rand() * 2)),
        roughness: 1.55 + rand() * 0.5,
        bowing: 1.05 + rand() * 0.65,
        seed: 74
      });
      drawLine(
        layer,
        x - lean * 0.35,
        bottom + (rand() - 0.5) * 2,
        x + lean,
        top + (rand() - 0.5) * 3,
        preset,
        baseSeed + columnIndex * 53 + 31
      );
    }

    const lineCount = Math.max(1, Math.min(14, Math.round(availableHeight / 14)));
    const baseStroke = Math.max(3.5, Math.min(8, rect.width * 0.16, availableHeight * 0.52));

    for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
      const t = lineCount === 1 ? 0.5 : lineIndex / (lineCount - 1);
      const y = bottom - availableHeight * t + (rand() - 0.5) * 3;
      const shortSide = (rand() - 0.5) * Math.min(8, rect.width * 0.12);
      const tilt = (rand() - 0.5) * Math.min(7, rect.width * 0.12);
      const preset = presetWith(STYLE_PRESETS.singleSoft, {
        stroke: lineIndex % 3 === 1 ? "rgba(255, 187, 78, 0.24)" : "rgba(238, 151, 31, 0.26)",
        strokeWidth: Math.max(3.5, baseStroke + (rand() - 0.5) * 3.2),
        roughness: 1.45 + rand() * 0.55,
        bowing: 0.95 + rand() * 0.7,
        seed: 72
      });

      drawLine(
        layer,
        rect.left + insetX + Math.max(0, shortSide),
        y + tilt,
        rect.right - insetX + Math.min(0, shortSide),
        y - tilt * 0.45,
        preset,
        baseSeed + lineIndex * 41 + 17
      );
    }

    if (rect.height > 42) {
      const sidePreset = presetWith(STYLE_PRESETS.singleSoft, {
        stroke: "rgba(255, 190, 84, 0.34)",
        strokeWidth: Math.max(3, Math.min(6, rect.width * 0.12)),
        roughness: 1.35,
        bowing: 1,
        seed: 73
      });
      drawLine(
        layer,
        rect.left + insetX + 2,
        rect.bottom - 8,
        rect.left + insetX + 5 + rand() * 4,
        rect.top + 12,
        sidePreset,
        baseSeed + 909
      );
    }
  }

  function drawDashboardBudgetProgress(layer) {
    forEachVisible("#view-dashboard .metric-primary .budget-progress", (element, index) => {
      const rect = element.getBoundingClientRect();
      const fill = element.querySelector("span");
      const fillRect = fill?.getBoundingClientRect();
      const fillStyle = fill ? getComputedStyle(fill) : null;
      const centerY = rect.top + rect.height / 2;
      const left = rect.left + 2;
      const right = rect.right - 2;
      const trackWidth = Math.max(0, right - left);
      const widthToken = fill?.style.width || element.style.getPropertyValue("--budget-progress-percent") || fillStyle?.width || "";
      let fillWidth = fillRect?.width || 0;
      if (widthToken.endsWith("%")) {
        const percent = Number.parseFloat(widthToken);
        if (Number.isFinite(percent)) fillWidth = trackWidth * Math.min(Math.max(percent, 0), 100) / 100;
      } else if (widthToken.endsWith("px")) {
        const px = Number.parseFloat(widthToken);
        if (Number.isFinite(px)) fillWidth = px;
      }
      const fillRight = Math.max(left, Math.min(left + fillWidth, right));

      const trackPreset = presetWith(STYLE_PRESETS.singleSoft, {
        stroke: "rgba(244, 225, 190, 0.72)",
        strokeWidth: Math.max(6, rect.height * 0.84),
        roughness: 2.2,
        bowing: 2.1,
        seed: 86
      });
      const fillPreset = presetWith(STYLE_PRESETS.singleSoft, {
        stroke: progressStrokeColor(fill || element),
        strokeWidth: Math.max(6, rect.height * 0.96),
        roughness: 2.6,
        bowing: 2.45,
        seed: 87
      });
      const highlightPreset = presetWith(STYLE_PRESETS.singleSoft, {
        stroke: "rgba(255, 242, 205, 0.52)",
        strokeWidth: Math.max(2.4, rect.height * 0.28),
        roughness: 2,
        bowing: 1.85,
        seed: 88
      });

      drawLine(
        layer,
        left,
        centerY + 0.9,
        right,
        centerY - 0.7,
        trackPreset,
        stableSeed(element, trackPreset, index + 860)
      );

      if (fillRight - left < 5) return;
      drawLine(
        layer,
        left,
        centerY + 0.2,
        fillRight,
        centerY - 1.1,
        fillPreset,
        stableSeed(fill || element, fillPreset, index + 870)
      );

      if (fillRight - left > 18) {
        drawLine(
          layer,
          left + 4,
          centerY - 1.9,
          fillRight - 4,
          centerY - 2.8,
          highlightPreset,
          stableSeed(fill || element, highlightPreset, index + 880)
        );
      }
    });
  }

  function rectsIntersect(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function openSelectMenuRects() {
    return Array.from(document.querySelectorAll(".sketch-select-menu:not([hidden])"))
      .filter(isElementVisible)
      .map((menu) => menu.getBoundingClientRect());
  }

  function isCoveredByOpenMenu(element, menuRects = openSelectMenuRects()) {
    if (!menuRects.length || element.matches(".sketch-select-menu") || element.closest(".sketch-select-menu")) return false;
    const rect = element.getBoundingClientRect();
    return menuRects.some((menuRect) => rectsIntersect(rect, menuRect));
  }

  function forEachVisible(selector, callback) {
    const menuRects = openSelectMenuRects();
    document.querySelectorAll(selector).forEach((element, index) => {
      if (isElementVisible(element) && !isCoveredByOpenMenu(element, menuRects)) callback(element, index);
    });
  }

  function drawSelectMenuScrollbars(layer) {
    forEachVisible(".sketch-select-menu:not([hidden])", (element, index) => {
      if (element.scrollHeight <= element.clientHeight + 1) return;
      const rect = element.getBoundingClientRect();
      const trackTop = rect.top + 16;
      const trackBottom = rect.bottom - 16;
      const trackHeight = Math.max(1, trackBottom - trackTop);
      const x = rect.right - 10;
      const ratio = element.clientHeight / element.scrollHeight;
      const thumbHeight = Math.max(42, trackHeight * ratio);
      const maxScroll = Math.max(1, element.scrollHeight - element.clientHeight);
      const scrollRatio = element.scrollTop / maxScroll;
      const thumbTop = trackTop + (trackHeight - thumbHeight) * scrollRatio;

      drawLine(layer, x, trackTop, x, trackBottom, presetWith(STYLE_PRESETS.singleSoft, {
        stroke: "rgba(224, 185, 110, 0.36)",
        strokeWidth: 6,
        roughness: 1.15,
        bowing: 1,
        seed: 82
      }), stableSeed(element, STYLE_PRESETS.singleSoft, index + 820));

      drawLine(layer, x, thumbTop, x, thumbTop + thumbHeight, presetWith(STYLE_PRESETS.singleStrong, {
        stroke: "rgba(185, 133, 57, 0.62)",
        strokeWidth: 5.2,
        roughness: 1.8,
        bowing: 1.35,
        seed: 83
      }), stableSeed(element, STYLE_PRESETS.singleStrong, index + 830));
    });
  }

  function drawControlBoxes(layer) {
    const controlSelector = [
      ".primary-button",
      ".ghost-button",
      ".danger-button",
      ".icon-button",
      ".symbol-button",
      ".dashboard-insight-button",
      ".sketch-select-toggle",
      ".entry-mode-tabs button",
      ".capture-mode-tabs button",
      ".import-mode-tabs button",
      "input:not([type='file'])",
      "select",
      "textarea"
    ].join(",");

    forEachVisible(controlSelector, (element, index) => {
      if (
        element.closest(".auth-card") &&
        (element.matches("input:not([type='file'])") || element.matches(".primary-button"))
      ) {
        drawBox(layer, element, presetWith(STYLE_PRESETS.singleWild, {
          stroke: element.matches(".primary-button") ? "rgba(139, 92, 32, 0.76)" : "rgba(135, 96, 55, 0.74)",
          strokeWidth: 4.2,
          roughness: 2.7,
          bowing: 2.25,
          radius: 30,
          seed: element.matches(".primary-button") ? 94 : 93
        }), index + 930);
        return;
      }

      if (element.matches("#textExpenseInput, textarea")) {
        drawBox(layer, element, STYLE_PRESETS.singleStrong, index);
        return;
      }
      drawBox(layer, element, STYLE_PRESETS.singleWild, index);
    });

    forEachVisible(".template-chip, .category-pill, .capture-file-plus, .import-file-plus", (element, index) => {
      drawBox(layer, element, STYLE_PRESETS.tag, index);
    });

    forEachVisible("#view-capture .entry-paper-panel, #view-import .entry-paper-panel", (element, index) => {
      drawBox(layer, element, presetWith(STYLE_PRESETS.singleStrong, {
        stroke: "rgba(201, 155, 88, 0.44)",
        strokeWidth: 1.15,
        roughness: 1.9,
        bowing: 1.55,
        radius: 28,
        seed: 89
      }), index + 890);
    });

    forEachVisible("#view-capture .capture-file-row, #view-import .import-file-row", (element, index) => {
      drawBox(layer, element, presetWith(STYLE_PRESETS.singleStrong, {
        stroke: "rgba(185, 133, 57, 0.52)",
        strokeWidth: 1.25,
        roughness: 2.1,
        bowing: 1.7,
        radius: 30,
        seed: 90
      }), index + 900);
    });

    forEachVisible(".auth-card, .auth-floating-card, .month-end-banner", (element, index) => {
      const isLoginCard = element.matches(".auth-card");
      drawBox(layer, element, presetWith(STYLE_PRESETS.singleStrong, {
        stroke: isLoginCard ? "rgba(194, 163, 99, 0.76)" : "rgba(201, 155, 88, 0.42)",
        strokeWidth: isLoginCard ? 5.6 : 1.12,
        roughness: isLoginCard ? 2.45 : 1.85,
        bowing: isLoginCard ? 2.15 : 1.45,
        radius: isLoginCard ? 36 : (element.matches(".auth-floating-card") ? 16 : 24),
        seed: 91
      }), index + 910);
    });

    forEachVisible(".receipt-category-mark", (element, index) => {
      drawBox(layer, element, presetWith(STYLE_PRESETS.tag, {
        stroke: visibleStrokeColor(element, STYLE_PRESETS.tag.stroke),
        strokeWidth: 1.05,
        roughness: 1.7,
        bowing: 1.35,
        radius: 8,
        seed: 38
      }), index + 380);
    });

    forEachVisible(".sketch-select-menu:not([hidden])", (element, index) => {
      drawBox(layer, element, presetWith(STYLE_PRESETS.singleStrong, {
        stroke: "rgba(185, 133, 57, 0.46)",
        strokeWidth: 1.08,
        roughness: 1.9,
        bowing: 1.55,
        radius: 16,
        seed: 39
      }), index + 390);
    });

    drawSelectMenuScrollbars(layer);

    forEachVisible(".nav", (element, index) => {
      drawBox(layer, element, presetWith(STYLE_PRESETS.navActive, {
        stroke: "rgba(201, 149, 68, 0.48)",
        strokeWidth: 1.15,
        roughness: 1.7,
        bowing: 1.4,
        radius: 24,
        seed: 84
      }), index + 840);
    });

    forEachVisible(".nav button.active", (element, index) => {
      drawBox(layer, element, STYLE_PRESETS.navActive, index);
    });

    forEachVisible("#view-report .week-fill", (element, index) => {
      drawWeekFillPaint(layer, element, index);
      drawBox(layer, element, presetWith(STYLE_PRESETS.singleStrong, {
        stroke: "rgba(173, 116, 39, 0.58)",
        strokeWidth: 1.15,
        roughness: 1.95,
        bowing: 1.6,
        radius: 18,
        seed: 36
      }), index + 360);
    });

    drawDashboardBudgetProgress(layer);

    forEachVisible(".bar-track, .budget-progress", (element, index) => {
      if (element.matches("#view-dashboard .metric-primary .budget-progress")) return;
      const rect = element.getBoundingClientRect();
      drawLine(layer, rect.left, rect.top + rect.height / 2, rect.right, rect.top + rect.height / 2, presetWith(STYLE_PRESETS.singleSoft, {
        stroke: visibleTrackColor(element, "rgba(224, 185, 110, 0.2)"),
        strokeWidth: Math.max(3, rect.height * 0.72),
        roughness: 0.9,
        bowing: 0.75,
        seed: 31
      }), stableSeed(element, STYLE_PRESETS.singleSoft, index + 310));
    });

    forEachVisible(".bar-fill, .budget-progress span", (element, index) => {
      if (element.closest("#view-dashboard .metric-primary .budget-progress")) return;
      const rect = element.getBoundingClientRect();
      if (rect.width < 5 || rect.height < 3) return;
      drawLine(layer, rect.left, rect.top + rect.height / 2, rect.right, rect.top + rect.height / 2, presetWith(STYLE_PRESETS.singleSoft, {
        stroke: progressStrokeColor(element),
        strokeWidth: Math.max(3, rect.height * 0.76),
        roughness: 1,
        bowing: 0.8,
        seed: 33
      }), stableSeed(element, STYLE_PRESETS.singleSoft, index + 330));
    });
  }

  function drawElementEdge(layer, element, edge, preset, index) {
    const rect = element.getBoundingClientRect();
    const seed = stableSeed(element, preset, index + edge.length);
    if (edge === "top") drawLine(layer, rect.left, rect.top, rect.right, rect.top, preset, seed);
    if (edge === "bottom") drawLine(layer, rect.left, rect.bottom, rect.right, rect.bottom, preset, seed);
    if (edge === "left") drawLine(layer, rect.left, rect.top, rect.left, rect.bottom, preset, seed);
    if (edge === "right") drawLine(layer, rect.right, rect.top, rect.right, rect.bottom, preset, seed);
  }

  function drawTransactionDetailLines(layer) {
    const detailOuter = presetWith(STYLE_PRESETS.singleStrong, {
      stroke: "rgba(185, 133, 57, 0.5)",
      strokeWidth: 1.2,
      roughness: 2,
      bowing: 1.65,
      radius: 10,
      seed: 48
    });
    const detailDivider = presetWith(STYLE_PRESETS.singleStrong, {
      stroke: "rgba(185, 133, 57, 0.46)",
      strokeWidth: 1.1,
      roughness: 1.9,
      bowing: 1.55,
      seed: 49
    });
    const detailSoft = presetWith(STYLE_PRESETS.singleSoft, {
      stroke: "rgba(201, 155, 88, 0.4)",
      strokeWidth: 0.95,
      roughness: 1.55,
      bowing: 1.2,
      seed: 50
    });

    forEachVisible(".transaction-detail-paper", (element, index) => {
      drawBox(layer, element, detailOuter, index + 500);
    });

    forEachVisible(".transaction-detail-head, .transaction-detail-edit-head", (element, index) => {
      drawElementEdge(layer, element, "bottom", detailDivider, index + 520);
    });

    forEachVisible(".transaction-detail-list", (element, index) => {
      drawElementEdge(layer, element, "top", detailDivider, index + 540);
      drawElementEdge(layer, element, "bottom", detailDivider, index + 560);
    });

    forEachVisible(".transaction-detail-total", (element, index) => {
      drawElementEdge(layer, element, "top", detailDivider, index + 580);
    });

    forEachVisible(".transaction-edit-grid", (element, index) => {
      drawElementEdge(layer, element, "bottom", detailDivider, index + 600);
    });

    forEachVisible(".transaction-edit-item", (element, index) => {
      drawElementEdge(layer, element, "top", detailSoft, index + 620);
    });

    document.querySelectorAll(".receipt-leader").forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const visible = (
        rect.width > 2 &&
        rect.bottom >= -24 &&
        rect.right >= -24 &&
        rect.top <= window.innerHeight + 24 &&
        rect.left <= window.innerWidth + 24 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0
      );
      if (!visible) return;
      const y = rect.top + rect.height / 2;
      drawLine(layer, rect.left, y, rect.right, y, detailSoft, stableSeed(element, detailSoft, index + 640));
    });
  }

  function drawEntryPendingLines(layer) {
    const pendingOuter = presetWith(STYLE_PRESETS.singleStrong, {
      stroke: "rgba(185, 133, 57, 0.48)",
      strokeWidth: 1.15,
      roughness: 2.05,
      bowing: 1.75,
      radius: 14,
      seed: 58
    });
    const pendingDivider = presetWith(STYLE_PRESETS.singleSoft, {
      stroke: "rgba(201, 155, 88, 0.42)",
      strokeWidth: 1,
      roughness: 1.65,
      bowing: 1.35,
      seed: 59
    });
    const pendingInner = presetWith(STYLE_PRESETS.singleSoft, {
      stroke: "rgba(201, 155, 88, 0.34)",
      strokeWidth: 0.9,
      roughness: 1.45,
      bowing: 1.2,
      seed: 60
    });

    forEachVisible(".entry-pending-card", (element, index) => {
      drawBox(layer, element, pendingOuter, index + 700);
    });

    forEachVisible(".entry-pending-heading", (element, index) => {
      drawElementEdge(layer, element, "bottom", pendingDivider, index + 720);
    });

    forEachVisible(".entry-pending-empty", (element, index) => {
      drawElementEdge(layer, element, "bottom", pendingInner, index + 760);
    });

    forEachVisible(".entry-pending-receipt", (element, index) => {
      if (!element.previousElementSibling) return;
      drawElementEdge(layer, element, "top", pendingInner, index + 780);
    });

    forEachVisible(".entry-pending-receipt .receipt-card-media, .entry-pending-receipt .receipt-card-actions", (element, index) => {
      drawElementEdge(layer, element, "top", pendingInner, index + 800);
    });
  }

  function drawReportCardLines(layer) {
    const reportCard = presetWith(STYLE_PRESETS.singleStrong, {
      stroke: "rgba(185, 133, 57, 0.46)",
      strokeWidth: 1.1,
      roughness: 2,
      bowing: 1.6,
      radius: 13,
      seed: 62
    });

    forEachVisible("#categoryShareChart, #view-report .weekly-chart, #historyComparison.history-comparison, #view-report .monthly-report, #view-dashboard .dashboard-insight-popover", (element, index) => {
      drawBox(layer, element, reportCard, index + 840);
    });

    forEachVisible("#view-dashboard .dashboard-project-card", (element, index) => {
      drawBox(layer, element, presetWith(STYLE_PRESETS.singleWild, {
        stroke: "rgba(185, 133, 57, 0.58)",
        strokeWidth: 1.35,
        radius: 18,
        seed: 66
      }), index + 870);
    });
  }

  function drawDashboardRecentReceiptLines(layer) {
    const recentOuter = presetWith(STYLE_PRESETS.singleStrong, {
      stroke: "rgba(185, 133, 57, 0.48)",
      strokeWidth: 1.15,
      roughness: 2.05,
      bowing: 1.7,
      radius: 12,
      seed: 64
    });
    const recentDivider = presetWith(STYLE_PRESETS.singleSoft, {
      stroke: "rgba(201, 155, 88, 0.42)",
      strokeWidth: 0.95,
      roughness: 1.65,
      bowing: 1.3,
      seed: 65
    });

    forEachVisible("#view-dashboard .dashboard-recent-panel", (element, index) => {
      drawBox(layer, element, recentOuter, index + 860);
    });

    forEachVisible("#view-dashboard .dashboard-recent-panel .panel-heading", (element, index) => {
      drawElementEdge(layer, element, "bottom", recentDivider, index + 880);
    });

    forEachVisible("#view-dashboard #recentTransactions .list-row, #view-dashboard #recentTransactions .empty-state", (element, index) => {
      if (index > 0) {
        drawElementEdge(layer, element, "top", recentDivider, index + 900);
      }
    });
  }

  function drawDividerLines(layer) {
    const dividerPreset = STYLE_PRESETS.singleStrong;
    const ledgerLine = presetWith(STYLE_PRESETS.singleSoft, {
      stroke: "rgba(201, 155, 88, 0.42)",
      strokeWidth: 0.95,
      roughness: 1.35,
      bowing: 1.3,
      seed: 51
    });

    forEachVisible(".view.active > .panel:first-child:not(.report-hero), .view.active > .recurring-layout > .panel:first-child", (element, index) => {
      if (element.closest("#view-transactions, #view-recurring")) return;
      drawElementEdge(layer, element, "top", dividerPreset, index);
    });

    forEachVisible(".entry-mode-tabs, .transaction-filters", (element, index) => {
      drawElementEdge(layer, element, "bottom", dividerPreset, index + 30);
    });

    forEachVisible(".summary-grid, .report-summary-grid, .dashboard-overview", (element, index) => {
      drawElementEdge(layer, element, "top", dividerPreset, index + 60);
      drawElementEdge(layer, element, "bottom", dividerPreset, index + 80);
      const gridRect = element.getBoundingClientRect();
      const metricSelector = element.matches("#view-dashboard .dashboard-overview")
        ? ":scope > .metric:not(:first-child), :scope > .metric-compact:not(:first-child)"
        : ".metric:not(:first-child), .metric-compact:not(:first-child)";
      element.querySelectorAll(metricSelector).forEach((metric, metricIndex) => {
        if (!isElementVisible(metric)) return;
        const rect = metric.getBoundingClientRect();
        if (rect.top > gridRect.top + 4) {
          drawLine(layer, rect.left, rect.top, rect.right, rect.top, dividerPreset, stableSeed(metric, dividerPreset, metricIndex + 95));
        } else {
          drawLine(layer, rect.left, rect.top, rect.left, rect.bottom, dividerPreset, stableSeed(metric, dividerPreset, metricIndex + 100));
        }
      });
    });

    forEachVisible(".list-row, .receipt-card, .recurring-row, .report-line, .budget-line, .history-row", (element, index) => {
      if (element.closest("#view-dashboard .dashboard-recent-panel")) return;
      drawElementEdge(layer, element, "top", STYLE_PRESETS.singleSoft, index + 140);
    });

    forEachVisible("button.transaction-card", (element, index) => {
      drawElementEdge(layer, element, "top", ledgerLine, index + 155);
      drawElementEdge(layer, element, "bottom", ledgerLine, index + 165);
    });

    forEachVisible(".share-legend-row, .bar-row", (element, index) => {
      drawElementEdge(layer, element, "top", STYLE_PRESETS.singleSoft, index + 180);
    });

    forEachVisible(".report-line[data-category], .recurring-row[data-category], .dashboard-detail-row[data-category], .transaction-item[data-category]", (element, index) => {
      const stroke = visibleStrokeColor(element, "rgba(201, 155, 88, 0.42)");
      drawElementEdge(layer, element, "left", presetWith(STYLE_PRESETS.singleSoft, {
        stroke,
        strokeWidth: 1.15,
        roughness: 1.3,
        bowing: 1.15,
        seed: 41
      }), index + 220);
    });
  }

  function draw() {
    frame = 0;
    drawing = true;
    const layer = ensureLayer();
    layer.replaceChildren();
    drawTransactionDetailLines(layer);
    drawEntryPendingLines(layer);
    drawReportCardLines(layer);
    drawDashboardRecentReceiptLines(layer);
    drawDividerLines(layer);
    drawControlBoxes(layer);
    drawing = false;
    if (drawAgain) {
      drawAgain = false;
      scheduleDraw();
    }
  }

  function scheduleDraw() {
    if (frame) return;
    frame = window.requestAnimationFrame(draw);
  }

  function startObserver() {
    if (observer || !document.body) return;
    observer = new MutationObserver((mutations) => {
      const layer = document.getElementById(LAYER_ID);
      const onlyLayerMutations = layer && mutations.every((mutation) => layer.contains(mutation.target));
      if (onlyLayerMutations) return;
      if (drawing) {
        drawAgain = true;
        return;
      }
      if (!onlyLayerMutations) scheduleDraw();
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "style", "value", "hidden"]
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    startObserver();
    scheduleDraw();
  });
  window.addEventListener("load", scheduleDraw);
  window.addEventListener("resize", scheduleDraw);
  window.addEventListener("scroll", scheduleDraw, true);

  if (document.readyState !== "loading") {
    startObserver();
    scheduleDraw();
  }
})();
