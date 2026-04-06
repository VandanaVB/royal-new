var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-showcase.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate), .cmp-carousel__item:not(.swiper-slide-duplicate)");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img) return;
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(img);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const paragraphs = slide.querySelectorAll("p, h2, h1");
      paragraphs.forEach((p) => {
        if (p.querySelector("img") && p.textContent.trim() === "") return;
        const text = p.textContent.trim();
        if (text) {
          const heading = document.createElement("h2");
          heading.textContent = text;
          textFrag.appendChild(heading);
        }
      });
      slide.querySelectorAll("button").forEach((btn) => {
        const btnText = btn.textContent.trim();
        if (btnText) {
          const link = document.createElement("a");
          link.href = "#";
          link.textContent = btnText;
          textFrag.appendChild(link);
        }
      });
      slide.querySelectorAll("a").forEach((link) => {
        textFrag.appendChild(link);
      });
      cells.push([imgFrag, textFrag]);
    });
    if (cells.length === 0) {
      cells.push(["", ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-dark.js
  function parse2(element, { document }) {
    const cells = [];
    const isHeadlights = element.classList.contains("herostripe");
    const isMotoculture = element.classList.contains("motoculture");
    const isIride = element.classList.contains("iridegrid");
    const isShop = element.classList.contains("royal-enfield-shop-us");
    let items = [];
    if (isHeadlights) {
      items = element.querySelectorAll(".banner-background-image, .swiper-slide");
      if (items.length === 0) items = element.querySelectorAll("img");
      items.forEach((item) => {
        const img = item.tagName === "IMG" ? item : item.querySelector("img");
        const heading = item.querySelector("h2, h3, .card-title");
        const link = item.querySelector("a");
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        if (img) imgFrag.appendChild(img);
        const textFrag = document.createDocumentFragment();
        textFrag.appendChild(document.createComment(" field:text "));
        if (heading) textFrag.appendChild(heading);
        if (link) textFrag.appendChild(link);
        cells.push([imgFrag, textFrag]);
      });
    } else if (isMotoculture) {
      items = element.querySelectorAll(".swiper-slide, .image-card");
      items.forEach((item) => {
        const img = item.querySelector("img");
        const text = item.querySelector(".text-section, h3, h2, p");
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        if (img) imgFrag.appendChild(img);
        const textFrag = document.createDocumentFragment();
        textFrag.appendChild(document.createComment(" field:text "));
        if (text) textFrag.appendChild(text);
        cells.push([imgFrag, textFrag]);
      });
    } else if (isIride) {
      items = element.querySelectorAll(".swiper-slide.grid-item, .card");
      items.forEach((item) => {
        const img = item.querySelector("img");
        const heading = item.querySelector(".iride-title, h3, h2");
        const content = item.querySelector(".content, p");
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        if (img) imgFrag.appendChild(img);
        const textFrag = document.createDocumentFragment();
        textFrag.appendChild(document.createComment(" field:text "));
        if (heading) textFrag.appendChild(heading);
        if (content) textFrag.appendChild(content);
        cells.push([imgFrag, textFrag]);
      });
    } else if (isShop) {
      items = element.querySelectorAll(".shop-card");
      items.forEach((item) => {
        const img = item.querySelector(".shop-card__image, img");
        const title = item.querySelector(".shop-card__title, h3, h2");
        const desc = item.querySelector(".shop-card__description, p");
        const link = item.querySelector(".shop-card__button a, a");
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        if (img) imgFrag.appendChild(img);
        const textFrag = document.createDocumentFragment();
        textFrag.appendChild(document.createComment(" field:text "));
        if (title) textFrag.appendChild(title);
        if (desc) textFrag.appendChild(desc);
        if (link) textFrag.appendChild(link);
        cells.push([imgFrag, textFrag]);
      });
    } else {
      items = element.querySelectorAll('.swiper-slide, li, [class*="card"]');
      items.forEach((item) => {
        const img = item.querySelector("img");
        const text = item.querySelector("h2, h3, p, a");
        const imgFrag = document.createDocumentFragment();
        imgFrag.appendChild(document.createComment(" field:image "));
        if (img) imgFrag.appendChild(img);
        const textFrag = document.createDocumentFragment();
        textFrag.appendChild(document.createComment(" field:text "));
        if (text) textFrag.appendChild(text);
        cells.push([imgFrag, textFrag]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-browse.js
  function parse3(element, { document }) {
    const cells = [];
    const allCategoryTabs = element.querySelectorAll(".category-tab");
    const categoryNames = [];
    allCategoryTabs.forEach((tab) => {
      const name = tab.textContent.trim();
      if (name && !categoryNames.includes(name)) {
        categoryNames.push(name);
      }
    });
    const allBikeImgEls = element.querySelectorAll(".motorcycle-carousel-bike-images img");
    const bikeImages = [];
    const seenImgAlts = [];
    allBikeImgEls.forEach((img) => {
      const alt = img.getAttribute("alt") || "";
      if (alt && !seenImgAlts.includes(alt)) {
        seenImgAlts.push(alt);
        bikeImages.push(img);
      }
    });
    const allBikeNameEls = element.querySelectorAll(".motorcycle-carousel-bike-names h2");
    const bikeNames = [];
    const seenNames = [];
    allBikeNameEls.forEach((h2) => {
      const name = h2.textContent.trim();
      if (name && !seenNames.includes(name)) {
        seenNames.push(name);
        bikeNames.push(h2);
      }
    });
    const ctaBox = element.querySelector(".cta-box");
    const ctas = ctaBox ? ctaBox.querySelectorAll("a") : [];
    if (categoryNames.length > 0) {
      categoryNames.forEach((catName, idx) => {
        const titleFrag = document.createDocumentFragment();
        titleFrag.appendChild(document.createComment(" field:title "));
        const titleEl = document.createElement("p");
        titleEl.textContent = catName;
        titleFrag.appendChild(titleEl);
        const contentFrag = document.createDocumentFragment();
        contentFrag.appendChild(document.createComment(" field:content_heading "));
        if (bikeNames.length > idx) {
          const headingEl = document.createElement("h3");
          headingEl.textContent = bikeNames[idx] ? bikeNames[idx].textContent.trim() : catName;
          contentFrag.appendChild(headingEl);
        }
        contentFrag.appendChild(document.createComment(" field:content_image "));
        if (bikeImages.length > idx && bikeImages[idx]) {
          contentFrag.appendChild(bikeImages[idx].cloneNode(true));
        }
        contentFrag.appendChild(document.createComment(" field:content_richtext "));
        if (ctas.length > 0) {
          const p = document.createElement("p");
          ctas.forEach((cta) => {
            const clonedLink = cta.cloneNode(true);
            p.appendChild(clonedLink);
            p.appendChild(document.createTextNode(" "));
          });
          contentFrag.appendChild(p);
        }
        cells.push([titleFrag, contentFrag]);
      });
    } else {
      const titleFrag = document.createDocumentFragment();
      titleFrag.appendChild(document.createComment(" field:title "));
      const titleEl = document.createElement("p");
      titleEl.textContent = "Motorcycles";
      titleFrag.appendChild(titleEl);
      const contentFrag = document.createDocumentFragment();
      contentFrag.appendChild(document.createComment(" field:content_heading "));
      contentFrag.appendChild(document.createComment(" field:content_image "));
      const firstImg = element.querySelector(".motorcycle-carousel-bike-images img, img");
      if (firstImg) contentFrag.appendChild(firstImg);
      contentFrag.appendChild(document.createComment(" field:content_richtext "));
      const links = element.querySelectorAll(".cta-box a, a.know-more-cta, a.goldenButton");
      if (links.length > 0) {
        const p = document.createElement("p");
        links.forEach((link) => p.appendChild(link));
        contentFrag.appendChild(p);
      }
      cells.push([titleFrag, contentFrag]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-browse", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-legacy.js
  function parse4(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".legacy, .swiper-slide, .cmp-carousel__item");
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      const heading = slide.querySelector("h2, h3, .heading");
      const description = slide.querySelector("p, .description");
      const link = slide.querySelector("a.read-more, a.button, a");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:media_image "));
      if (img) imgFrag.appendChild(img);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:content_text "));
      if (heading) textFrag.appendChild(heading);
      if (description) textFrag.appendChild(description);
      if (link) textFrag.appendChild(link);
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-legacy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-locate.js
  function parse5(element, { document }) {
    const leftCol = document.createDocumentFragment();
    const heading = element.querySelector(".locate-centre__card-head, h3, h2");
    if (heading) leftCol.appendChild(heading);
    const desc = element.querySelector(".locate-centre__card-desc, p");
    if (desc) leftCol.appendChild(desc);
    const link = element.querySelector(".locate-centre__card-lh a, a.button, a");
    if (link) leftCol.appendChild(link);
    const rightCol = document.createDocumentFragment();
    const label = element.querySelector(".locate-centre__field-label, label");
    if (label) {
      const p = document.createElement("p");
      p.textContent = label.textContent.trim();
      rightCol.appendChild(p);
    }
    const locateIcon = element.querySelector('.locate-centre__locate-icon, img[alt="Locate Us"]');
    if (locateIcon) rightCol.appendChild(locateIcon);
    const cells = [[leftCol, rightCol]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-locate", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/royalenfield-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".cookie-banners--revamp",
        ".re-page-loader",
        "#pageLoader",
        ".motoverse-banner",
        ".loading-ellipsis",
        ".re-revamp-v4-header__header-backdrop-transparent"
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "scroll";
      }
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".re-revamp-v4-header",
        "header",
        ".footer",
        "footer",
        ".cmp-experiencefragment--footer",
        "nav",
        "link",
        "noscript",
        "iframe",
        ".pageloader",
        ".re__revamp-v4__section__login",
        ".country-toast",
        ".re-country-selector",
        ".scrolltoexplore",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-link-accessibility-enabled");
        el.removeAttribute("data-cmp-link-accessibility-text");
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/transformers/royalenfield-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        let sectionEl;
        if (Array.isArray(section.selector)) {
          for (const sel of section.selector) {
            sectionEl = element.querySelector(sel);
            if (sectionEl) break;
          }
        } else {
          sectionEl = element.querySelector(section.selector);
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-showcase": parse,
    "cards-dark": parse2,
    "tabs-browse": parse3,
    "carousel-legacy": parse4,
    "columns-locate": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Royal Enfield India homepage with hero banners, product showcases, and brand content",
    urls: [
      "https://www.royalenfield.com/in/en/home/"
    ],
    blocks: [
      {
        name: "hero-showcase",
        instances: [".swipercarousel.cmp--royal-enfield-swiper"]
      },
      {
        name: "cards-dark",
        instances: [".herostripe", ".motoculture", ".iridegrid", ".royal-enfield-shop-us"]
      },
      {
        name: "tabs-browse",
        instances: [".motorcyclewithcategories"]
      },
      {
        name: "carousel-legacy",
        instances: [".swipercarousel.swiper-container--legacy"]
      },
      {
        name: "columns-locate",
        instances: [".locateservicecentrecard"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".swipercarousel.cmp--royal-enfield-swiper",
        style: null,
        blocks: ["hero-showcase"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "In the Headlights",
        selector: ".herostripe",
        style: "dark",
        blocks: ["cards-dark"],
        defaultContent: ["h2"]
      },
      {
        id: "section-3",
        name: "Motorcycles",
        selector: ".motorcyclewithcategories",
        style: "dark",
        blocks: ["tabs-browse"],
        defaultContent: ["h2"]
      },
      {
        id: "section-4",
        name: "Motoculture",
        selector: ".motoculture",
        style: "dark",
        blocks: ["cards-dark"],
        defaultContent: ["h2"]
      },
      {
        id: "section-5",
        name: "iRide Events",
        selector: ".iridegrid",
        style: "dark",
        blocks: ["cards-dark"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Legacy since 1901",
        selector: ".swipercarousel.swiper-container--legacy",
        style: "dark",
        blocks: ["carousel-legacy"],
        defaultContent: ["h2"]
      },
      {
        id: "section-7",
        name: "Locate Us",
        selector: ".locateservicecentrecard",
        style: "dark",
        blocks: ["columns-locate"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Shop",
        selector: ".royal-enfield-shop-us",
        style: "dark",
        blocks: ["cards-dark"],
        defaultContent: ["h2"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
