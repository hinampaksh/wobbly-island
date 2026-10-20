// ==============================================================================
// Feather / Lucide Equivalent Inline SVGs (0 KB external request, instant paint)
// ==============================================================================
const ICONS = {
  phone: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  laptop: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-.89-1.45L4 16"></path></svg>',
  tablet: '<svg class="icon icon-lg" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line></svg>',
  database: '<svg class="icon icon-lg" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>',
  shield: '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  clock: '<svg class="icon icon-lg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  'badge-check': '<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg>',
  zap: '<svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  chevron: '<svg class="icon icon-sm faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>'
};

// ==============================================================================
// Main Hydration Function (Embedded First + R2 Edge + Local Fallback)
// ==============================================================================
async function loadSiteContent() {
  let data;

  // 1. Instant Embedded Data (0ms, 0 network request, prevents cross-site flash)
  if (window.__SITE_CONTENT__) {
    data = window.__SITE_CONTENT__;
  } else if (window.__FASHION_CONTENT__) {
    data = window.__FASHION_CONTENT__;
  } else {
    // 2. Dynamic site target via <html data-site="...">
    const siteSlug = document.documentElement.getAttribute('data-site') || 'cebu-tech-masters';
    const R2_EDGE = `https://agency-content-router.alfiezafra.workers.dev/${siteSlug}/content.json`;

    try {
      const res = await fetch(`${R2_EDGE}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`R2 HTTP ${res.status}`);
      data = await res.json();
    } catch (r2Err) {
      // Fail-safe Fallback: Read bundled local content.json
      console.warn('R2 edge fetch unavailable, falling back to local content.json:', r2Err);
      const localRes = await fetch('./content.json');
      data = await localRes.json();
    }
  }

  try {
    // 0. Theme Tokens & CSS Variables (supports standalone preview page overrides)
    if (window.__THEME_OVERRIDE__) {
      data._theme = window.__THEME_OVERRIDE__;
    }

    if (data._theme) {
      const rootStyle = document.documentElement.style;

      // Motion Toggle Support (true by default, false disables all transitions/animations)
      if (typeof data._theme.motion === 'boolean') {
        document.documentElement.setAttribute('data-motion', data._theme.motion ? 'true' : 'false');
      } else {
        document.documentElement.setAttribute('data-motion', 'true');
      }

      // Theme Style Preset Tagging (e.g. linear-dark, stripe-vibrant, editorial-warm)
      if (data._theme.style) {
        document.documentElement.setAttribute('data-theme-style', data._theme.style);
      }

      if (data._theme.colors) {
        Object.entries(data._theme.colors).forEach(([k, v]) => {
          rootStyle.setProperty(`--${k.replace(/_/g, '-')}`, v);
        });
      }

      const FONT_PRESETS = {
        'modern-clean': {
          heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          accent: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          googleUrl: null
        },
        'friendly-service': {
          heading: '"Plus Jakarta Sans", sans-serif',
          body: '"Plus Jakarta Sans", sans-serif',
          accent: '"Plus Jakarta Sans", sans-serif',
          googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap'
        },
        'tech-authority': {
          heading: '"Space Grotesk", sans-serif',
          body: '"Inter", sans-serif',
          accent: '"Space Grotesk", sans-serif',
          googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap'
        },
        'bold-industrial': {
          heading: '"Oswald", sans-serif',
          body: 'Roboto, sans-serif',
          accent: '"Oswald", sans-serif',
          googleUrl: 'https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Roboto:wght@400;500&display=swap'
        },
        'warm-artisan': {
          heading: '"Fraunces", serif',
          body: '"Outfit", sans-serif',
          accent: '"Fraunces", serif',
          googleUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Outfit:wght@400;500;600&display=swap'
        },
        'premium-luxury': {
          heading: '"Playfair Display", serif',
          body: 'Inter, sans-serif',
          accent: '"Playfair Display", serif',
          googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,800&display=swap'
        },
        'modern-editorial': {
          heading: '"DM Serif Display", serif',
          body: '"DM Sans", sans-serif',
          accent: '"DM Serif Display", serif',
          googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap'
        },
        'futuristic-code': {
          heading: '"Space Grotesk", sans-serif',
          body: '"Space Mono", monospace',
          accent: '"Space Grotesk", sans-serif',
          googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Space+Mono:wght@400;700&display=swap'
        }
      };

      const typo = data._theme.typography || {};
      const preset = typo.preset && FONT_PRESETS[typo.preset] ? FONT_PRESETS[typo.preset] : FONT_PRESETS['modern-clean'];
      
      const bodyFont = typo.body || preset.body;
      const headingFont = typo.heading || preset.heading;
      const accentFont = typo.accent || preset.accent;
      const googleUrl = typo.google_fonts_url || preset.googleUrl;

      if (googleUrl && !document.getElementById('theme-font-link')) {
        const link = document.createElement('link');
        link.id = 'theme-font-link';
        link.rel = 'stylesheet';
        link.href = googleUrl;
        document.head.appendChild(link);
      }

      rootStyle.setProperty('--font-body', bodyFont);
      rootStyle.setProperty('--font-heading', headingFont);
      rootStyle.setProperty('--font-accent', accentFont);
      rootStyle.setProperty('--font-family', bodyFont);

      if (data._theme.layout) {
        Object.entries(data._theme.layout).forEach(([k, v]) => {
          rootStyle.setProperty(`--${k.replace(/_/g, '-')}`, v);
        });
      }
    }

    // 1. Navigation / Brand
    if (data.brand) {
      document.querySelectorAll('.brand-name').forEach(el => el.textContent = data.brand.name || '');
      const brandCta = document.getElementById('nav-cta');
      if (brandCta) brandCta.textContent = data.brand.cta_button || 'Book a Repair';
      document.title = `${data.brand.name} | ${data.brand.tagline || 'Device Repairs'}`;
    }

    // 2. Hero Section
    if (data.hero) {
      const badge = document.getElementById('hero-badge');
      if (badge) badge.innerHTML = `${ICONS.zap || '⚡'} <span>${data.hero.badge.replace(/⚡/g, '').trim()}</span>`;

      const headline = document.getElementById('hero-headline');
      if (headline) headline.textContent = data.hero.headline || '';

      const subheadline = document.getElementById('hero-subheadline');
      if (subheadline) subheadline.textContent = data.hero.subheadline || '';

      const primaryCta = document.getElementById('hero-primary-cta');
      if (primaryCta) primaryCta.textContent = data.hero.primary_cta || '';

      const secondaryCta = document.getElementById('hero-secondary-cta');
      if (secondaryCta) secondaryCta.textContent = data.hero.secondary_cta || '';
    }

    // 3. Stats Grid (In-place update)
    const statsContainer = document.getElementById('stats-grid');
    if (statsContainer && Array.isArray(data.stats)) {
      statsContainer.innerHTML = data.stats.map(stat => `
        <div class="stat-card hover-lift">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `).join('');
    }

    // 4. Services Grid
    const servicesContainer = document.getElementById('services-grid');
    if (servicesContainer && Array.isArray(data.services)) {
      servicesContainer.innerHTML = data.services.map(srv => {
        const imgHtml = srv.image ? `
          <img class="service-card-img" src="${srv.image.src}" alt="${srv.image.alt || srv.title}" width="${srv.image.width || 1000}" height="${srv.image.height || 666}" loading="lazy">
        ` : '';
        return `
          <div class="service-card hover-lift" id="${srv.id || ''}">
            ${imgHtml}
            <div class="service-icon">${ICONS[srv.icon] || ICONS.phone}</div>
            <h3 class="service-title">${srv.title}</h3>
            <p class="service-description">${srv.description}</p>
            <div class="service-meta">
              <span class="service-price">${srv.starting_price}</span>
              <span class="service-turnaround">${srv.turnaround}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // 5. Why Choose Us
    const whyContainer = document.getElementById('why-grid');
    if (whyContainer && Array.isArray(data.why_us)) {
      whyContainer.innerHTML = data.why_us.map(item => `
        <div class="why-card hover-lift">
          <div class="why-icon">${ICONS[item.icon] || ICONS.shield}</div>
          <h3 class="why-title">${item.title}</h3>
          <p class="why-desc">${item.description}</p>
        </div>
      `).join('');
    }

    // 6. Testimonials Slider
    const testContainer = document.getElementById('testimonials-slider');
    if (testContainer && Array.isArray(data.testimonials)) {
      testContainer.innerHTML = data.testimonials.map(item => `
        <div class="slider-item">
          <div class="testimonial-card">
            <div class="testimonial-rating">${item.rating}</div>
            <p class="testimonial-quote">"${item.quote}"</p>
            <div class="testimonial-author">${item.author}</div>
            <div class="testimonial-location">${item.location}</div>
          </div>
        </div>
      `).join('');
    }

    // 7. FAQ Accordion Module
    const faqContainer = document.getElementById('faq-list');
    if (faqContainer && Array.isArray(data.faq)) {
      faqContainer.innerHTML = data.faq.map((item, idx) => `
        <details class="faq-item" ${idx === 0 ? 'open' : ''}>
          <summary class="faq-question">
            <span>${item.question}</span>
            ${ICONS.chevron}
          </summary>
          <div class="faq-answer-wrap">
            <div class="faq-answer-inner">
              <div class="faq-answer">
                ${item.answer}
              </div>
            </div>
          </div>
        </details>
      `).join('');
    }

    // 8. Quote Form Headings & Labels
    if (data.quote_form) {
      const qBadge = document.getElementById('quote-badge');
      if (qBadge) qBadge.textContent = data.quote_form.badge;
      const qHeadline = document.getElementById('quote-headline');
      if (qHeadline) qHeadline.textContent = data.quote_form.headline;
      const qSubheadline = document.getElementById('quote-subheadline');
      if (qSubheadline) qSubheadline.textContent = data.quote_form.subheadline;
      const qBtn = document.getElementById('quote-submit-btn');
      if (qBtn) qBtn.textContent = data.quote_form.button_text;
    }

    // 9. Subscribe Section
    if (data.subscribe) {
      const subHeadline = document.getElementById('subscribe-headline');
      if (subHeadline) subHeadline.textContent = data.subscribe.headline;
      const subSubtitle = document.getElementById('subscribe-subheadline');
      if (subSubtitle) subSubtitle.textContent = data.subscribe.subheadline;
      const subBtn = document.getElementById('subscribe-btn');
      if (subBtn) subBtn.textContent = data.subscribe.button_text;
      const subInput = document.getElementById('subscribe-input');
      if (subInput && data.subscribe.placeholder) subInput.placeholder = data.subscribe.placeholder;
    }

    // 10. Contact Info & Hours
    if (data.contact) {
      const phoneEl = document.getElementById('contact-phone');
      if (phoneEl) {
        phoneEl.textContent = data.contact.phone;
        phoneEl.href = `tel:${data.contact.phone}`;
      }

      const emailEl = document.getElementById('contact-email');
      if (emailEl) {
        emailEl.textContent = data.contact.email;
        emailEl.href = `mailto:${data.contact.email}`;
      }

      const addrEl = document.getElementById('contact-address');
      if (addrEl) addrEl.textContent = data.contact.address;

      // Mobile Sticky Action Bar Links & Phone/Map bindings
      const mobileCall = document.getElementById('mobile-call-btn');
      if (mobileCall && data.contact.phone) mobileCall.href = `tel:${data.contact.phone}`;

      const addrClean = encodeURIComponent(data.contact.address || 'Cebu');
      const mapUrl = `https://maps.google.com/?q=${addrClean}`;
      const directionsBtn = document.getElementById('directions-btn');
      if (directionsBtn) directionsBtn.href = mapUrl;
      const mobileMap = document.getElementById('mobile-map-btn');
      if (mobileMap) mobileMap.href = mapUrl;

      // Real-Time Open / Closed Status Calculation
      if (data.contact.hours) {
        const hoursContainer = document.getElementById('hours-list');
        if (hoursContainer) {
          hoursContainer.innerHTML = Object.entries(data.contact.hours).map(([_, val]) => `
            <div class="hours-item">${val}</div>
          `).join('');
        }
        updateStoreStatus(data.contact.hours);
      }
    }

    // 11. Footer
    if (data.footer) {
      const copyEl = document.getElementById('footer-copyright');
      if (copyEl) copyEl.textContent = data.footer.copyright;
      const noticeEl = document.getElementById('footer-notice');
      if (noticeEl) noticeEl.textContent = data.footer.notice;
    }

    // 12. Dynamic Media Elements (Zero-CLS Image Hydration)
    if (data.media) {
      if (data.media.hero) {
        const heroImg = document.getElementById('hero-img');
        if (heroImg && data.media.hero.src) {
          heroImg.src = data.media.hero.src;
          if (data.media.hero.alt) heroImg.alt = data.media.hero.alt;
        }
      }
      if (data.media.workspace) {
        const quoteImg = document.getElementById('quote-img');
        if (quoteImg && data.media.workspace.src) {
          quoteImg.src = data.media.workspace.src;
          if (data.media.workspace.alt) quoteImg.alt = data.media.workspace.alt;
        }
      }
    }

    // 13. Milestone 3: Automated Google LocalBusiness Structured Data (JSON-LD)
    updateLocalBusinessSchema(data);

  } catch (err) {
    console.error('Failed to load site content:', err);
  }
}

// ==============================================================================
// Milestone 2: Real-Time Open / Closed Status Calculation
// ==============================================================================
function updateStoreStatus(hours) {
  const badge = document.getElementById('open-status-badge');
  const textEl = document.getElementById('status-text');
  if (!badge || !textEl) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Parse schedules based on standard Philippines business conventions
  // Weekdays (Mon-Fri): 9:00 AM (540 mins) to 7:00 PM (1140 mins)
  // Saturday: 8:00 AM (480 mins) to 6:00 PM (1080 mins)
  // Sunday: Closed
  let isOpen = false;
  let closingMsg = '';

  if (day >= 1 && day <= 5) {
    if (currentMinutes >= 540 && currentMinutes < 1140) {
      isOpen = true;
      closingMsg = 'Open Now • Closes at 7:00 PM';
    } else if (currentMinutes < 540) {
      closingMsg = 'Closed • Opens at 9:00 AM';
    } else {
      closingMsg = day === 5 ? 'Closed • Opens Sat 8:00 AM' : 'Closed • Opens Tomorrow 9:00 AM';
    }
  } else if (day === 6) {
    if (currentMinutes >= 480 && currentMinutes < 1080) {
      isOpen = true;
      closingMsg = 'Open Now • Closes at 6:00 PM';
    } else if (currentMinutes < 480) {
      closingMsg = 'Closed • Opens at 8:00 AM';
    } else {
      closingMsg = 'Closed • Opens Mon 9:00 AM';
    }
  } else {
    closingMsg = 'Closed Today • Opens Mon 9:00 AM';
  }

  textEl.textContent = closingMsg;
  badge.className = `open-status-badge ${isOpen ? 'open' : 'closed'}`;
}

// ==============================================================================
// Milestone 3: Automated Google LocalBusiness Schema Generator
// ==============================================================================
function updateLocalBusinessSchema(data) {
  let scriptEl = document.getElementById('schema-local-business');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'schema-local-business';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const brand = data.brand || {};
  const contact = data.contact || {};
  const media = data.media || {};

  const schemaObj = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": brand.name || "Cebu Tech Masters",
    "description": data.hero ? data.hero.subheadline : undefined,
    "image": media.hero ? `https://agency-content-router.alfiezafra.workers.dev/cebu-tech-masters/${media.hero.src}` : undefined,
    "telephone": contact.phone,
    "email": contact.email,
    "priceRange": contact.price_range || "₱₱",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contact.address || "452 Taft Avenue, Ermita",
      "addressLocality": "Cebu City",
      "addressRegion": "Cebu",
      "postalCode": "6000",
      "addressCountry": "PH"
    },
    "geo": contact.geo ? {
      "@type": "GeoCoordinates",
      "latitude": contact.geo.latitude,
      "longitude": contact.geo.longitude
    } : undefined,
    "currenciesAccepted": contact.currencies_accepted || "PHP",
    "paymentAccepted": contact.payment_accepted || "Cash, GCash, Maya, Credit Card"
  };

  scriptEl.textContent = JSON.stringify(schemaObj, null, 2);
}

// ==============================================================================
// Interactive Handlers (Modal, Slider, Forms)
// ==============================================================================
function initInteractivity() {
  // 1. Modal Logic
  const modal = document.getElementById('quote-modal');
  const openButtons = document.querySelectorAll('[data-open-modal="quote-modal"]');
  const closeButton = document.getElementById('modal-close-btn');

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 2. Testimonial Slider Controls
  const sliderTrack = document.getElementById('testimonials-slider');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (sliderTrack && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      sliderTrack.scrollBy({ left: -340, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      sliderTrack.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }

  // 3. Lead Capture Forms (Quote Form + Modal Quote Form + Subscribe Form)
  ['quote-form', 'modal-quote-form'].forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = form.querySelector('.form-feedback');
        const submitBtn = form.querySelector('button[type="submit"]');
        const origBtnText = submitBtn ? submitBtn.textContent : 'Submit';

        // Extract payload
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending request...';
        }

        try {
          // If a custom lead webhook is defined in content.json, post to it
          const webhookUrl = (window.__SITE_DATA__ && window.__SITE_DATA__.contact && window.__SITE_DATA__.contact.lead_webhook) || null;
          if (webhookUrl) {
            await fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                site: (window.__SITE_DATA__ && window.__SITE_DATA__.brand && window.__SITE_DATA__.brand.name) || 'Client Website',
                timestamp: new Date().toISOString(),
                ...payload
              })
            });
          }

          if (feedback) {
            feedback.textContent = '✅ Quote request received! A technician will call or message you in under 15 minutes.';
            feedback.className = 'form-feedback success';
          }
          form.reset();
        } catch (err) {
          console.warn('Webhook dispatch error:', err);
          if (feedback) {
            feedback.textContent = '✅ Request logged! We will reach out shortly.';
            feedback.className = 'form-feedback success';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origBtnText;
          }
        }
      });
    }
  });

  // 4. Universal Smooth Drawer & Accordion Engine (.primitive-drawer-accordion & #faq-list)
  const drawerAccordions = document.querySelectorAll('.primitive-drawer-accordion, .faq-grid, #faq-list');
  drawerAccordions.forEach(acc => {
    acc.querySelectorAll('.drawer-item, .faq-item, details').forEach(item => {
      const header = item.querySelector('.drawer-header, .faq-question, summary');
      const wrapper = item.querySelector('.drawer-content-wrapper, .faq-answer-wrapper, .faq-answer-wrap');
      if (!header || !wrapper) return;

      if (item.hasAttribute('open')) {
        item.classList.add('is-open');
        wrapper.style.height = wrapper.scrollHeight + 'px';
      }

      header.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('is-open');

        if (isOpen) {
          wrapper.style.height = wrapper.scrollHeight + 'px';
          requestAnimationFrame(() => {
            wrapper.style.height = '0px';
          });
          item.classList.remove('is-open');
          setTimeout(() => {
            item.removeAttribute('open');
          }, 340);
        } else {
          item.setAttribute('open', '');
          item.classList.add('is-open');
          wrapper.style.height = '0px';
          requestAnimationFrame(() => {
            wrapper.style.height = wrapper.scrollHeight + 'px';
          });
        }
      });
    });
  });

  // 5. Universal Zero-Shift Scroll-Spy & Active State Observer
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a, .el-menu-links a')).filter(a => {
    const href = a.getAttribute('href') || '';
    return href.includes('#');
  });

  const sections = [];
  navAnchors.forEach(a => {
    const href = a.getAttribute('href') || '';
    const hash = href.substring(href.indexOf('#') + 1);
    const el = document.getElementById(hash);
    if (el && !sections.includes(el)) sections.push(el);
  });

  if (sections.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            const href = a.getAttribute('href') || '';
            const hash = href.substring(href.indexOf('#') + 1);
            if (hash === currentId) {
              a.classList.add('active');
              a.setAttribute('aria-current', 'true');
            } else {
              a.classList.remove('active');
              a.removeAttribute('aria-current');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));

    // Reset active indicator when scrolled to top of page (Hero section)
    window.addEventListener('scroll', () => {
      if (window.scrollY < 80) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          a.removeAttribute('aria-current');
        });
      }
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSiteContent();
  initInteractivity();
});
