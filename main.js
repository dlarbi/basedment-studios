(() => {
  // Baseline: 5×8 framed = $180. Everything scales from that.
  const PRINT_5X8 = 40;
  const PRINT_8X10 = 65;

  const PRICE = {
    "5×8": { original: 120, framed: 180 },
    "8×10": { original: 230, framed: 295 },
    "16×24": { original: 480, framed: 620 },
  };

  // `file` = shop grid crop. `studio` = full uncropped desk photo for the sheet.
  const catalog = [
    {
      id: "window",
      file: "piece-window.jpg",
      studio: "studio-window.jpg",
      title: "Window light",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Looking out — black, yellow, and window blue.",
      alt: "Window light — original oil pastel portrait for sale by Basedment Studio in Ann Arbor",
    },
    {
      id: "pink-blue-acrylic",
      file: "piece-pink-blue-acrylic.jpg",
      studio: "studio-pink-blue-acrylic.jpg",
      title: "Pink and blue light",
      medium: "Acrylic",
      size: "8×10",
      blurb: "Profile in magenta and ice blue. One of one.",
      alt: "Pink and blue light — original acrylic portrait painting for sale in Ann Arbor, Michigan",
    },
    {
      id: "coloree",
      file: "piece-coloree.jpg",
      title: "Colorée",
      medium: "Acrylic",
      size: "16×24",
      blurb: "Fan, blush, and blue lid — a theatrical study in color.",
      alt: "Colorée — large original acrylic figurative painting for sale from Basedment Studio",
    },
    {
      id: "skintones",
      file: "piece-skintones.jpg",
      studio: "studio-skintones.jpg",
      title: "Skintones",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "A laughing study in light and city night.",
      alt: "Skintones — original oil pastel portrait art for sale in Michigan",
    },
    {
      id: "pink-blue",
      file: "piece-pink-blue.jpg",
      studio: "studio-pink-blue.jpg",
      title: "Pastel colors",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Yellow, pink, and blue across a closed gaze.",
      alt: "Pastel colors — colorful oil pastel portrait for sale from Ann Arbor artist",
    },
    {
      id: "magenta",
      file: "piece-magenta.jpg",
      studio: "studio-magenta.jpg",
      title: "Magenta light",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Hot magenta against cool blue shadow.",
      alt: "Magenta light — small original oil pastel portrait for sale",
    },
    {
      id: "headwrap",
      file: "piece-headwrap.jpg",
      studio: "studio-headwrap.jpg",
      title: "Headwrap",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Oil pastel with architectural backdrop.",
      alt: "Headwrap — contemporary oil pastel figurative portrait for sale in Ann Arbor",
    },
    {
      id: "outside",
      file: "piece-outside.jpg",
      studio: "studio-outside.jpg",
      title: "Outside light",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Outdoor light on skin.",
      alt: "Outside light — original oil pastel portrait painting shipping across the Midwest",
    },
    {
      id: "silver-beard",
      file: "piece-silver-beard.jpg",
      title: "Silver",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Profile emerging from black — silver light.",
      alt: "Silver — original oil pastel profile portrait for sale by Basedment Studio",
    },
    {
      id: "blue-yellow",
      file: "piece-blue-yellow.jpg",
      title: "Blue & yellow",
      medium: "Acrylic",
      size: "5×8",
      blurb: "Hard split of cool blue and warm yellow.",
      alt: "Blue and yellow — original acrylic portrait for sale in Ann Arbor, Michigan",
    },
    {
      id: "cosmic",
      file: "piece-cosmic.jpg",
      studio: "studio-cosmic.jpg",
      title: "Cosmic gaze",
      medium: "Oil pastel",
      size: "5×8",
      blurb: "Profile in fire-orange and deep blue.",
      alt: "Cosmic gaze — bold oil pastel portrait for sale from Michigan artist",
    },
    {
      id: "foreground",
      file: "piece-foreground.jpg",
      studio: "studio-foreground.jpg",
      title: "Foreground light",
      medium: "Oil pastel",
      size: "8×10",
      blurb: "Light held in the front plane of the portrait.",
      alt: "Foreground light — original oil pastel figurative art for sale",
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

  function injectProductSchema() {
    const existing = document.getElementById("product-jsonld");
    if (existing) existing.remove();

    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://dlarbi.github.io/basedment-studios/#collection",
      name: "Basedment Studio — original art for sale",
      description:
        "Original oil pastel and acrylic portraits for sale from Ann Arbor, Michigan.",
      numberOfItems: catalog.length,
      itemListElement: catalog.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": ["Product", "VisualArtwork"],
          "@id": `https://dlarbi.github.io/basedment-studios/#work-${item.id}`,
          name: `${item.title} — ${item.medium} portrait`,
          description: `${item.blurb} Original ${item.medium.toLowerCase()} ${item.size} figurative portrait by Basedment Studio in Ann Arbor, Michigan. Available as original, framed, or print.`,
          image: `https://dlarbi.github.io/basedment-studios/assets/${item.file}`,
          sku: item.id,
          brand: {
            "@type": "Brand",
            name: "Basedment Studio",
          },
          artMedium: item.medium,
          artworkSurface: "Paper",
          width: {
            "@type": "Distance",
            name: item.size.split("×")[0] + " in",
          },
          height: {
            "@type": "Distance",
            name: item.size.split("×")[1] + " in",
          },
          creator: {
            "@id": "https://dlarbi.github.io/basedment-studios/#artist",
          },
          offers: [
            {
              "@type": "Offer",
              name: "Original unframed",
              price: item.original,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: "https://dlarbi.github.io/basedment-studios/#shop",
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@id": "https://dlarbi.github.io/basedment-studios/#organization",
              },
            },
            {
              "@type": "Offer",
              name: "Original framed",
              price: item.framed,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: "https://dlarbi.github.io/basedment-studios/#shop",
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@id": "https://dlarbi.github.io/basedment-studios/#organization",
              },
            },
            {
              "@type": "Offer",
              name: "Print 5×8",
              price: PRINT_5X8,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: "https://dlarbi.github.io/basedment-studios/#shop",
            },
            {
              "@type": "Offer",
              name: "Print 8×10",
              price: PRINT_8X10,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: "https://dlarbi.github.io/basedment-studios/#shop",
            },
          ],
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "product-jsonld";
    script.textContent = JSON.stringify(itemList);
    document.head.appendChild(script);
  }

  function renderGrid() {
    grid.innerHTML = catalog
      .map(
        (item, i) => `
      <li>
      <button type="button" class="card" data-id="${item.id}" style="transition-delay:${(i % 4) * 50}ms">
        <div class="card__frame">
          <img src="assets/${item.file}" alt="${item.alt || `${item.title} — ${item.size} original ${item.medium.toLowerCase()} for sale in Ann Arbor`}" loading="lazy" width="800" height="1000" />
        </div>
        <div class="card__meta">
          <div class="card__row">
            <span class="card__title">${item.title}</span>
            <span class="card__price">${money(item.framed)}</span>
          </div>
          <span class="card__size">${item.medium} · ${item.size} · from ${money(item.original)}</span>
          <span class="card__avail">Available · Buy</span>
        </div>
      </button>
      </li>`
      )
      .join("");

    grid.querySelectorAll(".card").forEach((btn) => {
      btn.addEventListener("click", () => openSheet(btn.dataset.id));
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-in");
        });
      },
      { threshold: 0.12 }
    );
    grid.querySelectorAll(".card").forEach((c) => io.observe(c));
    injectProductSchema();
  }

  function fillOffers(item) {
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

    const src = active.studio || active.file;
    sheetImg.src = `assets/${src}`;
    sheetImg.alt =
      active.alt ||
      `${active.title} — ${active.medium} ${active.size} original portrait for sale in Ann Arbor`;
    sheet.classList.toggle("sheet--studio", Boolean(active.studio));
    sheetTitle.textContent = active.title;
    sheetMeta.textContent = `${active.medium} · ${active.size} · Ann Arbor, MI`;
    if (sheetBlurb) {
      sheetBlurb.textContent = active.blurb || "";
      sheetBlurb.hidden = !active.blurb;
    }
    sheetStatus.textContent = "Available";
    fillOffers(active);
    morePanel.hidden = true;
    learnMoreBtn.textContent = "Learn more";
    payNote.hidden = true;

    const moreCopy = document.getElementById("more-copy");
    if (moreCopy) {
      moreCopy.innerHTML = `${active.blurb || "One of one."} Original ${active.medium.toLowerCase()} (${active.size}) made in Ann Arbor — available unframed, framed, or as a print. Ships across Michigan and the Midwest. Questions —
        <a href="https://ig.me/m/basedmentstudio" target="_blank" rel="noopener noreferrer">DM @basedmentstudio</a>.`;
    }

    document.body.classList.add("sheet-open");
    if (typeof sheet.showModal === "function") sheet.showModal();
    else sheet.setAttribute("open", "");
  }

  function closeSheet() {
    if (typeof sheet.close === "function") sheet.close();
    else sheet.removeAttribute("open");
    document.body.classList.remove("sheet-open");
  }

  applePayBtn.addEventListener("click", () => {
    if (!active || !selectedOffer) return;
    const label = `${active.title} — ${selectedOffer.label} (${selectedOffer.detail})`;
    const amount = selectedOffer.price;

    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      try {
        const request = {
          countryCode: "US",
          currencyCode: "USD",
          supportedNetworks: ["visa", "masterCard", "amex", "discover"],
          merchantCapabilities: ["supports3DS"],
          total: { label: "Basedment Studio", amount: String(amount) },
        };
        const session = new ApplePaySession(3, request);
        session.onvalidatemerchant = () => {
          payNote.hidden = false;
          payNote.innerHTML = `Apple Pay is almost ready — for now, DM to buy <strong>${label}</strong> for ${money(amount)}. <a href="https://ig.me/m/basedmentstudio" target="_blank" rel="noopener noreferrer">Message @basedmentstudio</a>`;
          session.abort();
        };
        session.oncancel = () => {};
        session.begin();
        return;
      } catch (_) {
        /* fall through */
      }
    }

    payNote.hidden = false;
    payNote.innerHTML = `To buy <strong>${label}</strong> for ${money(amount)}, DM <a href="https://ig.me/m/basedmentstudio" target="_blank" rel="noopener noreferrer">@basedmentstudio</a>.`;
  });

  learnMoreBtn.addEventListener("click", () => {
    const open = morePanel.hidden;
    morePanel.hidden = !open;
    learnMoreBtn.textContent = open ? "Hide details" : "Learn more";
  });

  closeBtn.addEventListener("click", closeSheet);
  sheet.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeSheet();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sheet.open) closeSheet();
  });

  renderGrid();
})();
