(() => {
  // Baseline: 5×8 framed = $150. Everything scales from that.
  const PRINT_5X8 = 40;
  const PRINT_8X10 = 65;

  const PRICE = {
    "5×8": { original: 120, framed: 180 },
    "8×10": { original: 230, framed: 295 },
    "16×24": { original: 480, framed: 620 },
  };

  const catalog = [
    {
      id: "window",
      file: "piece-window.jpg",
      title: "Window light",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Looking out — black, yellow, and window blue.",
    },
    {
      id: "pink-blue-acrylic",
      file: "piece-pink-blue-acrylic.jpg",
      title: "Pink and blue light",
      medium: "Acrylic",
      size: "8×10",
      blurb: "Profile in magenta and ice blue. One of one.",
    },
    {
      id: "coloree",
      file: "piece-coloree.jpg",
      title: "Colorée",
      medium: "Acrylic",
      size: "16×24",
      blurb: "Fan, blush, and blue lid — a theatrical study in color.",
    },
    {
      id: "skintones",
      file: "piece-skintones.jpg",
      title: "Skintones",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "A laughing study in light and city night.",
    },
    {
      id: "pink-blue",
      file: "piece-pink-blue.jpg",
      title: "Pastel colors",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Yellow, pink, and blue across a closed gaze.",
    },
    {
      id: "magenta",
      file: "piece-magenta.jpg",
      title: "Magenta light",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Hot magenta against cool blue shadow.",
    },
    {
      id: "headwrap",
      file: "piece-headwrap.jpg",
      title: "Headwrap",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Oil pastel with architectural backdrop.",
    },
    {
      id: "outside",
      file: "piece-outside.jpg",
      title: "Outside light",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Outdoor light on skin.",
    },
    {
      id: "beard-cap",
      file: "piece-beard-cap.jpg",
      title: "Cap & beard",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Blue eyes, white cap, sky behind.",
    },
    {
      id: "orbs",
      file: "piece-orbs.jpg",
      title: "Orbs",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Warm face, floating color orbs on black.",
    },
    {
      id: "silver-beard",
      file: "piece-silver-beard.jpg",
      title: "Silver",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Profile emerging from black — silver light.",
    },
    {
      id: "blue-yellow",
      file: "piece-blue-yellow.jpg",
      title: "Blue & yellow",
      medium: "Acrylic",
      size: "5×8",
      blurb: "Hard split of cool blue and warm yellow.",
    },
    {
      id: "cosmic",
      file: "piece-cosmic.jpg",
      title: "Cosmic gaze",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Profile in fire-orange and deep blue.",
    },
    {
      id: "steps",
      file: "piece-steps.jpg",
      title: "A few steps",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Process portrait — a few steps into the face.",
    },
    {
      id: "foreground",
      file: "piece-foreground.jpg",
      title: "Foreground light",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Light held in the front plane of the portrait.",
    },
  ].map((item) => ({
    ...item,
    original: PRICE[item.size].original,
    framed: PRICE[item.size].framed,
  }));

  const grid = document.getElementById("grid");
  const sheet = document.getElementById("sheet");
  const sheetImg = document.getElementById("sheet-img");
  const sheetTitle = document.getElementById("sheet-title");
  const sheetMeta = document.getElementById("sheet-meta");
  const sheetBlurb = document.getElementById("sheet-blurb");
  const sheetStatus = document.getElementById("sheet-status");
  const priceList = document.getElementById("price-list");
  const morePanel = document.getElementById("more-panel");
  const payNote = document.getElementById("pay-note");
  const applePayBtn = document.getElementById("apple-pay");
  const learnMoreBtn = document.getElementById("learn-more");
  const closeBtn = document.getElementById("sheet-close");

  let active = null;
  let selectedOffer = null;

  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  function offersFor(item) {
    return [
      {
        id: "original",
        label: "Original",
        detail: `${item.size} · unframed`,
        price: item.original,
      },
      {
        id: "framed",
        label: "Original, framed",
        detail: `${item.size} · framed`,
        price: item.framed,
      },
      {
        id: "print-5x8",
        label: "Print",
        detail: "5×8",
        price: PRINT_5X8,
      },
      {
        id: "print-8x10",
        label: "Print",
        detail: "8×10",
        price: PRINT_8X10,
      },
    ];
  }

  function renderGrid() {
    grid.innerHTML = catalog
      .map(
        (item, i) => `
      <li>
        <button type="button" class="card" data-id="${item.id}" style="transition-delay:${(i % 4) * 50}ms">
          <div class="card__frame">
            <img src="assets/${item.file}" alt="${item.title} — ${item.size} original for sale" loading="lazy" width="800" height="1000" />
          </div>
          <div class="card__meta">
            <div class="card__row">
              <span class="card__title">${item.title}</span>
              <span class="card__price">${money(item.framed)}</span>
            </div>
            <span class="card__size">${item.size} · from ${money(item.original)}</span>
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
        { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
      );
      grid.querySelectorAll(".card").forEach((el) => io.observe(el));
    } else {
      grid.querySelectorAll(".card").forEach((el) => el.classList.add("is-in"));
    }
  }

  function renderOffers(item) {
    const offers = offersFor(item);
    selectedOffer = offers[1]; // default framed
    priceList.innerHTML = offers
      .map(
        (o) => `
      <label class="offer ${o.id === "framed" ? "is-selected" : ""}">
        <input type="radio" name="offer" value="${o.id}" ${o.id === "framed" ? "checked" : ""} />
        <span class="offer__text">
          <span class="offer__label">${o.label}</span>
          <span class="offer__detail">${o.detail}</span>
        </span>
        <span class="offer__price">${money(o.price)}</span>
      </label>`
      )
      .join("");

    priceList.querySelectorAll('input[name="offer"]').forEach((input) => {
      input.addEventListener("change", () => {
        selectedOffer = offers.find((o) => o.id === input.value);
        priceList.querySelectorAll(".offer").forEach((el) => el.classList.remove("is-selected"));
        input.closest(".offer").classList.add("is-selected");
      });
    });
  }

  function openSheet(id) {
    active = catalog.find((c) => c.id === id);
    if (!active) return;

    sheetImg.src = `assets/${active.file}`;
    sheetImg.alt = `${active.title} — ${active.size}`;
    sheetTitle.textContent = active.title;
    sheetMeta.textContent = `${active.medium} · ${active.size} · Ann Arbor`;
    sheetBlurb.textContent = active.blurb;
    sheetStatus.textContent = "Available";
    morePanel.hidden = true;
    payNote.hidden = true;
    payNote.textContent = "";
    learnMoreBtn.textContent = "Learn more";
    renderOffers(active);

    document.body.classList.add("sheet-open");
    if (typeof sheet.showModal === "function") sheet.showModal();
    else sheet.setAttribute("open", "");
  }

  function closeSheet() {
    if (typeof sheet.close === "function") sheet.close();
    else sheet.removeAttribute("open");
    document.body.classList.remove("sheet-open");
    active = null;
    selectedOffer = null;
  }

  function runApplePayPlaceholder() {
    if (!active || !selectedOffer) return;

    const label = `${active.title} — ${selectedOffer.label} (${selectedOffer.detail})`;
    const amount = selectedOffer.price;

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
            label: `Basedment Studio — ${label}`,
            amount: amount.toFixed(2),
            type: "final",
          },
        };
        const session = new ApplePaySession(3, request);

        session.onvalidatemerchant = () => {
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
      `Reserve ${label} for ${money(amount)}. Apple Pay checkout is wired for launch — for now, DM @basedmentstudio to buy.`
    );
  }

  function showPayNote(text) {
    payNote.hidden = false;
    payNote.innerHTML = `${text} <a href="https://ig.me/m/basedmentstudio" target="_blank" rel="noopener noreferrer">Open Instagram DM</a>`;
  }

  closeBtn.addEventListener("click", closeSheet);
  sheet.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeSheet();
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
