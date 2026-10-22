(() => {
  const catalog = [
    {
      id: "pink-blue",
      file: "piece-pink-blue.jpg",
      title: "Pastel colors",
      subtitle: "Oil pastel",
      price: 180,
      blurb: "Yellow, pink, and blue light across a closed gaze. One of one.",
    },
    {
      id: "coloree",
      file: "piece-coloree.jpg",
      title: "Colorée",
      subtitle: "Acrylic",
      price: 240,
      blurb: "Fan, blush, and blue lid — a theatrical study in color.",
    },
    {
      id: "magenta",
      file: "piece-magenta.jpg",
      title: "Magenta light",
      subtitle: "Oil pastel",
      price: 160,
      blurb: "Hot magenta against cool blue shadow. Sketchbook original.",
    },
    {
      id: "warm",
      file: "piece-warm.jpg",
      title: "Warm light",
      subtitle: "Oil pastel",
      price: 160,
      blurb: "Split light in gold and cobalt. Quiet, closed eyes.",
    },
    {
      id: "headwrap",
      file: "piece-headwrap.jpg",
      title: "Headwrap",
      subtitle: "Oil pastel · 8×10",
      price: 220,
      blurb: "8×10 oil pastel portrait with architectural backdrop.",
    },
    {
      id: "outside",
      file: "piece-outside.jpg",
      title: "Outside light",
      subtitle: "Oil pastel · 8×10",
      price: 220,
      blurb: "8×10 oil pastel — outdoor light on skin.",
    },
    {
      id: "blue-yellow",
      file: "piece-blue-yellow.jpg",
      title: "Blue & yellow",
      subtitle: "Acrylic",
      price: 200,
      blurb: "Hard split of cool blue and warm yellow.",
    },
    {
      id: "window",
      file: "piece-window.jpg",
      title: "Window light",
      subtitle: "Oil pastel",
      price: 180,
      blurb: "Soft daylight falling through a window.",
    },
    {
      id: "cosmic",
      file: "piece-cosmic.jpg",
      title: "Cosmic gaze",
      subtitle: "Oil pastel",
      price: 200,
      blurb: "Profile in fire-orange and deep blue.",
    },
    {
      id: "steps",
      file: "piece-steps.jpg",
      title: "A few steps",
      subtitle: "Oil pastel",
      price: 160,
      blurb: "Process portrait — a few steps into the face.",
    },
    {
      id: "foreground",
      file: "piece-foreground.jpg",
      title: "Foreground light",
      subtitle: "Oil pastel",
      price: 160,
      blurb: "Light held in the front plane of the portrait.",
    },
    {
      id: "skintones",
      file: "piece-skintones.jpg",
      title: "Skintones",
      subtitle: "Oil pastel",
      price: 160,
      blurb: "A study toward natural skintones and light.",
    },
  ];

  const grid = document.getElementById("grid");
  const sheet = document.getElementById("sheet");
  const sheetImg = document.getElementById("sheet-img");
  const sheetTitle = document.getElementById("sheet-title");
  const sheetMeta = document.getElementById("sheet-meta");
  const sheetPrice = document.getElementById("sheet-price");
  const sheetBlurb = document.getElementById("sheet-blurb");
  const sheetStatus = document.getElementById("sheet-status");
  const morePanel = document.getElementById("more-panel");
  const payNote = document.getElementById("pay-note");
  const applePayBtn = document.getElementById("apple-pay");
  const learnMoreBtn = document.getElementById("learn-more");
  const closeBtn = document.getElementById("sheet-close");

  let active = null;

  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  function renderGrid() {
    grid.innerHTML = catalog
      .map(
        (item, i) => `
      <li>
        <button type="button" class="card" data-id="${item.id}" style="transition-delay:${(i % 4) * 60}ms">
          <div class="card__frame">
            <img src="assets/${item.file}" alt="${item.title} — available for sale" loading="lazy" width="800" height="1000" />
          </div>
          <div class="card__meta">
            <div class="card__row">
              <span class="card__title">${item.title}</span>
              <span class="card__price">${money(item.price)}</span>
            </div>
            <span class="card__avail">Available · Buy</span>
          </div>
        </button>
      </li>`
      )
      .join("");

    grid.querySelectorAll(".card").forEach((btn) => {
      btn.addEventListener("click", () => openSheet(btn.dataset.id));
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      grid.querySelectorAll(".card").forEach((el) => io.observe(el));
    } else {
      grid.querySelectorAll(".card").forEach((el) => el.classList.add("is-in"));
    }
  }

  function openSheet(id) {
    active = catalog.find((c) => c.id === id);
    if (!active) return;

    sheetImg.src = `assets/${active.file}`;
    sheetImg.alt = `${active.title} — for sale`;
    sheetTitle.textContent = active.title;
    sheetMeta.textContent = `${active.subtitle} · Original · Ann Arbor`;
    sheetPrice.textContent = money(active.price);
    sheetBlurb.textContent = active.blurb;
    sheetStatus.textContent = "Available";
    morePanel.hidden = true;
    payNote.hidden = true;
    payNote.textContent = "";
    learnMoreBtn.textContent = "Learn more";

    if (typeof sheet.showModal === "function") sheet.showModal();
    else sheet.setAttribute("open", "");
  }

  function closeSheet() {
    if (typeof sheet.close === "function") sheet.close();
    else sheet.removeAttribute("open");
    active = null;
  }

  function runApplePayPlaceholder() {
    if (!active) return;

    // Prefer real Apple Pay when the browser supports it (still placeholder merchant).
    const canApplePay =
      window.ApplePaySession &&
      ApplePaySession.canMakePayments &&
      ApplePaySession.canMakePayments();

    if (canApplePay) {
      try {
        const request = {
          countryCode: "US",
          currencyCode: "USD",
          supportedNetworks: ["visa", "masterCard", "amex", "discover"],
          merchantCapabilities: ["supports3DS"],
          total: {
            label: `Basedment Studio — ${active.title}`,
            amount: active.price.toFixed(2),
            type: "final",
          },
        };
        const session = new ApplePaySession(3, request);

        session.onvalidatemerchant = () => {
          // No merchant ID yet — abort gracefully into placeholder note.
          session.abort();
          showPayNote(
            "Apple Pay is ready on this device. Merchant setup is next — DM @basedmentstudio to complete this purchase now."
          );
        };

        session.oncancel = () => {
          showPayNote("Checkout canceled.");
        };

        session.begin();
        return;
      } catch (_) {
        /* fall through */
      }
    }

    showPayNote(
      `Reserve ${active.title} for ${money(active.price)}. Apple Pay checkout is wired for launch — for now, DM @basedmentstudio to buy.`
    );
  }

  function showPayNote(text) {
    payNote.hidden = false;
    payNote.innerHTML = `${text} <a href="https://ig.me/m/basedmentstudio" target="_blank" rel="noopener noreferrer">Open Instagram DM</a>`;
  }

  closeBtn.addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) closeSheet();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sheet.open) closeSheet();
  });

  applePayBtn.addEventListener("click", runApplePayPlaceholder);
  learnMoreBtn.addEventListener("click", () => {
    const open = morePanel.hidden;
    morePanel.hidden = !open;
    learnMoreBtn.textContent = open ? "Hide details" : "Learn more";
  });

  renderGrid();
})();
