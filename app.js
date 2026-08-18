/* ==========================================================================
   DATA // ARCHITECT - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavigation();
  initCounterAnimations();
  initEmailCopy();
  initModalListeners();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Dynamic Background Motion Engine (Laser Beams, Waves & Data Streams)
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 1. Grid Laser Beams (Speeding light streams)
  const beamCount = 32;
  const beams = [];

  for (let i = 0; i < beamCount; i++) {
    beams.push({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 100 + 50,
      speed: Math.random() * 3 + 1.5,
      dir: Math.random() > 0.4 ? 'horizontal' : 'vertical',
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3
    });
  }

  // 2. Rising Data Nodes
  const nodeCount = 50;
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(Math.random() * 1.2 + 0.4),
      size: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI,
      pulseSpeed: Math.random() * 0.06 + 0.02
    });
  }

  let waveOffset = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    waveOffset += 0.02;

    // A. Flowing Digital Sine Waves
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    for (let x = 0; x < width; x += 4) {
      const y = height * 0.38 + Math.sin(x * 0.005 + waveOffset) * 55 + Math.cos(x * 0.008 + waveOffset * 0.8) * 25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(75, 240, 226, 0.25)';
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1.2;
    for (let x = 0; x < width; x += 4) {
      const y = height * 0.65 + Math.sin(x * 0.006 - waveOffset * 1.1) * 45;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.22)';
    ctx.stroke();

    // B. Speeding Grid Laser Beams
    beams.forEach(b => {
      ctx.beginPath();
      if (b.dir === 'horizontal') {
        const grad = ctx.createLinearGradient(b.x, b.y, b.x - b.len, b.y);
        grad.addColorStop(0, `rgba(249, 115, 22, ${b.alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = b.size;
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - b.len, b.y);
        ctx.stroke();

        b.x += b.speed;
        if (b.x - b.len > width) {
          b.x = 0;
          b.y = Math.random() * height;
        }
      } else {
        const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y - b.len);
        grad.addColorStop(0, `rgba(251, 146, 60, ${b.alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = b.size;
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y - b.len);
        ctx.stroke();

        b.y += b.speed;
        if (b.y - b.len > height) {
          b.y = 0;
          b.x = Math.random() * width;
        }
      }
    });

    // C. Rising Glowing Data Nodes & Constellations
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      n1.y += n1.vy;
      n1.pulse += n1.pulseSpeed;

      if (n1.y < 0) {
        n1.y = height;
        n1.x = Math.random() * width;
      }

      // Constellation links
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.18 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Draw Node
      const currentRadius = n1.size + Math.sin(n1.pulse) * 0.7;
      ctx.beginPath();
      ctx.arc(n1.x, n1.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(249, 115, 22, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Navigation & Mobile Drawer
   -------------------------------------------------------------------------- */
function initNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
    });
  });

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (sectionId) {
        try {
          const targetLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
          if (targetLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
              targetLink.classList.add('active');
            } else {
              targetLink.classList.remove('active');
            }
          }
        } catch (e) {}
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Animated HUD Counters
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const accuracyElem = document.getElementById('accuracy-counter');
  const dataElem = document.getElementById('data-counter');

  if (accuracyElem) {
    let accVal = 95.0;
    const interval = setInterval(() => {
      accVal += 0.2;
      if (accVal >= 99.4) {
        accVal = 99.4;
        clearInterval(interval);
      }
      accuracyElem.textContent = accVal.toFixed(1) + '%';
    }, 40);
  }
}

/* --------------------------------------------------------------------------
   4. Email Clipboard Copy
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const emailBtn = document.getElementById('email-copy-btn');
  if (!emailBtn) return;

  emailBtn.addEventListener('click', () => {
    const emailText = 'hello@data-architect.io';
    navigator.clipboard.writeText(emailText).then(() => {
      showToast('Email address copied to clipboard!');
    }).catch(err => {
      showToast('Copied: hello@data-architect.io');
    });
  });
}

/* --------------------------------------------------------------------------
   5. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-lucide="check-circle-2"></i> <span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* --------------------------------------------------------------------------
   6. Contact Form Submission Handler
   -------------------------------------------------------------------------- */
function handleFormSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('btn-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `TRANSMITTING... <i data-lucide="loader-2" class="spin"></i>`;
    lucide.createIcons();
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `SEND MESSAGE <i data-lucide="arrow-right"></i>`;
      lucide.createIcons();
    }
    document.getElementById('contact-form').reset();
    showToast('Message transmitted successfully! The Architect will contact you soon.');
  }, 1200);
}

/* --------------------------------------------------------------------------
   7. Modal System & Project Data
   -------------------------------------------------------------------------- */
function initModalListeners() {
  document.addEventListener('click', (e) => {
    const resumeBtn = e.target.closest('#btn-resume, #btn-resume-hero, .btn-resume, [data-action="resume"]');
    if (resumeBtn) {
      e.preventDefault();
      openResumeModal();
      return;
    }

    const viewModelsBtn = e.target.closest('#btn-view-models');
    if (viewModelsBtn) {
      e.preventDefault();
      openViewModelsModal();
      return;
    }
  });

  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(htmlContent) {
  try {
    let overlay = document.getElementById('modal-overlay');
    let body = document.getElementById('modal-body');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.id = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-card" id="modal-card">
          <button class="modal-close" id="modal-close" onclick="closeModal()">✕</button>
          <div class="modal-body" id="modal-body"></div>
        </div>
      `;
      document.body.appendChild(overlay);
      body = document.getElementById('modal-body');
    }

    if (body) {
      body.innerHTML = htmlContent;
    }

    overlay.classList.add('active');
    overlay.style.setProperty('display', 'flex', 'important');
    overlay.style.setProperty('opacity', '1', 'important');
    overlay.style.setProperty('pointer-events', 'auto', 'important');
    overlay.style.setProperty('visibility', 'visible', 'important');
    overlay.style.setProperty('z-index', '999999', 'important');

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Error in openModal:', err);
  }
}

function closeModal() {
  try {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.setProperty('display', 'none', 'important');
      overlay.style.setProperty('opacity', '0', 'important');
      overlay.style.setProperty('pointer-events', 'none', 'important');
      overlay.style.setProperty('visibility', 'hidden', 'important');
    }
  } catch (err) {
    console.error('Error in closeModal:', err);
  }
}

/* Modal Content Injectors */
function getResumeHTML() {
  return `
    <div class="resume-modal-content">
      <!-- Top Tag & Header -->
      <div class="cv-tag">CURRICULUM VITAE // OFFICIAL RESUME</div>
      <h1 class="cv-name">SINJINI ROY</h1>
      <div class="cv-subtitle">DATA ARCHITECT & BI ANALYST | COMPUTER SCIENCE ENGINEER</div>

      <!-- Contact Bar -->
      <div class="cv-contact-bar">
        <span class="cv-contact-item"><i data-lucide="map-pin"></i> Kolkata, India</span>
        <span class="cv-contact-item"><i data-lucide="phone"></i> +91 7278119888</span>
        <span class="cv-contact-item"><i data-lucide="mail"></i> i.am.sinjini16@gmail.com</span>
        <span class="cv-contact-item"><i data-lucide="linkedin"></i> <a href="https://linkedin.com/in/sinjini-roy" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
        <span class="cv-contact-item"><i data-lucide="github"></i> <a href="https://github.com/SINjini16" target="_blank" rel="noopener noreferrer">GitHub</a></span>
      </div>

      <!-- Professional Summary -->
      <div class="cv-section-title cv-title-green">PROFESSIONAL SUMMARY</div>
      <p class="cv-text">
        B.Tech graduate in Computer Science Engineering (2026) with a strong focus on Data Analytics and Business Intelligence. Skilled in Python, SQL, Excel, Power BI, data visualization, and statistical analysis, with hands-on experience in data cleaning, EDA, dashboard development, and extracting actionable insights from real-world datasets. Detail-oriented and analytical problem solver with strong communication skills and a passion for transforming data into meaningful business insights.
      </p>

      <!-- Technical Skills -->
      <div class="cv-section-title cv-title-cyan">DESIGN & SOFTWARE SKILLS</div>
      
      <div style="margin-bottom: 8px; font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-dim);">LANGUAGES & CORE DATA</div>
      <div class="cv-skills-group">
        <span class="cv-pill pill-red">Python</span>
        <span class="cv-pill pill-red">C</span>
        <span class="cv-pill pill-cyan">SQL</span>
        <span class="cv-pill pill-cyan">MySQL</span>
        <span class="cv-pill pill-cyan">Pandas</span>
        <span class="cv-pill pill-cyan">NumPy</span>
        <span class="cv-pill pill-purple">Matplotlib</span>
        <span class="cv-pill pill-purple">Seaborn</span>
      </div>

      <div style="margin-bottom: 8px; font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-dim); margin-top: 14px;">BI & ANALYTICS</div>
      <div class="cv-skills-group">
        <span class="cv-pill pill-green">Power BI</span>
        <span class="cv-pill pill-green">MS Excel</span>
        <span class="cv-pill pill-green">DAX</span>
        <span class="cv-pill pill-green">Power Query</span>
        <span class="cv-pill pill-purple">IBM Cognos</span>
        <span class="cv-pill pill-cyan">Data Modeling</span>
      </div>

      <div style="margin-bottom: 8px; font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-dim); margin-top: 14px;">WEB, TOOLS & SOFT SKILLS</div>
      <div class="cv-skills-group">
        <span class="cv-pill pill-yellow">HTML</span>
        <span class="cv-pill pill-yellow">CSS</span>
        <span class="cv-pill pill-yellow">JavaScript</span>
        <span class="cv-pill pill-red">VS Code</span>
        <span class="cv-pill pill-red">PyCharm</span>
        <span class="cv-pill pill-cyan">GitHub</span>
        <span class="cv-pill pill-purple">Google Colab</span>
        <span class="cv-pill pill-green">Communication</span>
        <span class="cv-pill pill-green">Adaptability</span>
        <span class="cv-pill pill-green">Teamwork</span>
      </div>

      <!-- Relevant Projects -->
      <div class="cv-section-title cv-title-pink">RELEVANT PROJECTS</div>

      <div class="cv-project-card">
        <div class="cv-project-header">
          <span class="cv-project-name">Hand Gesture Recognition to Speech System</span>
          <a href="https://github.com/SINjini16" target="_blank" rel="noopener noreferrer" class="cv-project-github"><i data-lucide="github" style="width: 12px; height: 12px;"></i> View on GitHub</a>
        </div>
        <div class="cv-project-tech">Tech: Python, scikit-learn, MediaPipe, OpenCV, pandas, pyttsx3</div>
        <ul class="cv-bullets">
          <li>Developed a real-time computer vision system that detects and classifies hand gestures using MediaPipe hand landmarks and a Random Forest machine learning model.</li>
          <li>Integrated text-to-speech functionality to convert recognized gestures into spoken output, enabling real-time gesture-based communication.</li>
        </ul>
      </div>

      <div class="cv-project-card">
        <div class="cv-project-header">
          <span class="cv-project-name">Diwali Sales Data Analysis</span>
          <a href="https://github.com/SINjini16" target="_blank" rel="noopener noreferrer" class="cv-project-github"><i data-lucide="github" style="width: 12px; height: 12px;"></i> View on GitHub</a>
        </div>
        <div class="cv-project-tech">Tech: Python, Pandas, NumPy, Matplotlib, Seaborn</div>
        <ul class="cv-bullets">
          <li>Cleaned, processed, and analyzed Diwali sales data to identify customer purchasing behavior, demographic patterns, product preferences, and sales trends.</li>
          <li>Created detailed visualizations to identify high-performing states, customer segments, and product categories contributing significantly to overall revenue.</li>
        </ul>
      </div>

      <div class="cv-project-card">
        <div class="cv-project-header">
          <span class="cv-project-name">Blinkit Sales Data Analysis</span>
          <a href="https://github.com/SINjini16" target="_blank" rel="noopener noreferrer" class="cv-project-github"><i data-lucide="github" style="width: 12px; height: 12px;"></i> View on GitHub</a>
        </div>
        <div class="cv-project-tech">Tech: Python, Pandas, NumPy, Matplotlib, Seaborn</div>
        <ul class="cv-bullets">
          <li>Performed exploratory data analysis and preprocessing to evaluate product demand, outlet performance, customer preferences, and key business metrics.</li>
          <li>Analyzed sales KPIs and developed visualizations to identify important sales patterns, product trends, and customer purchasing behavior.</li>
        </ul>
      </div>

      <div class="cv-project-card">
        <div class="cv-project-header">
          <span class="cv-project-name">HR Analytics Dashboard</span>
          <a href="https://github.com/SINjini16" target="_blank" rel="noopener noreferrer" class="cv-project-github"><i data-lucide="github" style="width: 12px; height: 12px;"></i> View on GitHub</a>
        </div>
        <div class="cv-project-tech">Tech: Power BI, DAX, Power Query, Data Modeling</div>
        <ul class="cv-bullets">
          <li>Built an interactive HR analytics dashboard analyzing employee demographics, attrition, retention, salary trends, and departmental KPIs across 1,470 employees.</li>
          <li>Used DAX, Power Query, and data modeling to develop meaningful metrics and identify retention risks, employee tenure trends, and salary disparities.</li>
        </ul>
      </div>

      <div class="cv-project-card">
        <div class="cv-project-header">
          <span class="cv-project-name">Automotive Sales & Service Analytics Dashboard</span>
          <a href="https://github.com/SINjini16" target="_blank" rel="noopener noreferrer" class="cv-project-github"><i data-lucide="github" style="width: 12px; height: 12px;"></i> View on GitHub</a>
        </div>
        <div class="cv-project-tech">Tech: IBM Cognos Analytics, SQL, Data Modules</div>
        <ul class="cv-bullets">
          <li>Developed a two-page business intelligence dashboard combining dealership, sales, and service recall data to evaluate overall performance and post-sales service quality.</li>
          <li>Analyzed $78.4M in profit across 58,118 units while visualizing sales trends, recall patterns, customer sentiment, and key performance indicators.</li>
        </ul>
      </div>

      <!-- Certifications & Education Grid -->
      <div class="cv-grid-2col">
        <div>
          <div class="cv-section-title cv-title-purple">CERTIFICATIONS</div>
          <ul class="cv-list-styled">
            <li><strong>IBM (Coursera):</strong> Data Visualization & Dashboards with Excel and Cognos (2026)</li>
            <li><strong>IBM (Coursera):</strong> Excel Basics for Data Analysis (2026)</li>
            <li><strong>IBM (Coursera):</strong> Introduction to Data Analytics (2026)</li>
            <li><strong>Microsoft (Coursera):</strong> Python Programming Fundamentals (2025)</li>
          </ul>
        </div>

        <div>
          <div class="cv-section-title cv-title-cyan">EDUCATION & ACHIEVEMENTS</div>
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem;">B.Tech in Computer Science & Engineering</div>
            <div style="font-family: var(--font-mono); font-size: 0.82rem; color: #4ade80; margin-top: 2px;">CGPA: 8.02 | 2022–2026</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">Meghnad Saha Institute of Technology, MAKAUT – Kolkata</div>
          </div>
          
          <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-dim); margin-top: 12px; margin-bottom: 6px;">KEY ACHIEVEMENTS</div>
          <ul class="cv-list-styled">
            <li>Member of Technical Club Megatronix – Paridhi 2026</li>
            <li>Smart India Hackathon (SIH) Participant</li>
            <li>SAP-organized College Hackathon Participant</li>
          </ul>
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; gap: 16px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" onclick="showToast('PDF Resume download initiated...');">
          Download PDF Resume <i data-lucide="download"></i>
        </button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Close Window</button>
      </div>
    </div>
  `;
}

window.getResumeHTML = getResumeHTML;
window.resumeHTMLString = getResumeHTML();

function openResumeModal() {
  openModal(getResumeHTML());
}

function openViewModelsModal() {
  const content = `
    <div class="modal-header-tag">// MODEL ENGINE v4.2</div>
    <h2 class="modal-title">Live Production Models</h2>
    <p style="color: var(--text-secondary); margin-bottom: 20px;">
      Real-time overview of active predictive and statistical models currently deployed in enterprise client environments.
    </p>

    <div class="modal-metrics-row">
      <div class="metric-box">
        <div class="metric-val">99.4%</div>
        <div class="metric-lbl">Mean Accuracy</div>
      </div>
      <div class="metric-box">
        <div class="metric-val">12ms</div>
        <div class="metric-lbl">Inference Latency</div>
      </div>
      <div class="metric-box">
        <div class="metric-val">2.4 TB/day</div>
        <div class="metric-lbl">Throughput</div>
      </div>
    </div>

    <h4 style="color: var(--cyan-primary); margin-top: 20px; margin-bottom: 8px;">Sample XGBoost Feature Importances Query</h4>
    <div class="modal-code-block">SELECT 
  feature_name, 
  importance_score, 
  RANK() OVER (ORDER BY importance_score DESC) as feature_rank
FROM ML.FEATURE_IMPORTANCE(MODEL `enterprise_warehouse.revenue_predict_v4`)
LIMIT 5;</div>

    <div style="margin-top: 28px; text-align: right;">
      <button class="btn btn-primary" onclick="closeModal()">Return to Console</button>
    </div>
  `;
  openModal(content);
}

function openProjectModal(projectId) {
  let content = '';

  if (projectId === 'financial') {
    content = `
      <div class="modal-header-tag">// DEPLOYMENT #01</div>
      <h2 class="modal-title">Financial Forecasting Kernel</h2>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        High-precision time-series revenue prediction system built using Python and Meta Prophet, integrated into Snowflake data warehouse.
      </p>

      <div class="modal-metrics-row">
        <div class="metric-box">
          <div class="metric-val">-14%</div>
          <div class="metric-lbl">Variance Reduction</div>
        </div>
        <div class="metric-box">
          <div class="metric-val">$4.2M</div>
          <div class="metric-lbl">CapEx Savings</div>
        </div>
        <div class="metric-box">
          <div class="metric-val">98.8%</div>
          <div class="metric-lbl">Confidence Score</div>
        </div>
      </div>

      <h4 style="color: var(--cyan-primary); margin-bottom: 8px;">Kernel Execution Script</h4>
      <div class="modal-code-block">from prophet import Prophet
import pandas as pd

df = pd.read_sql("SELECT transaction_date AS ds, total_revenue AS y FROM fin_warehouse", conn)
model = Prophet(changepoint_prior_scale=0.05, seasonality_mode='multiplicative')
model.fit(df)
future = model.make_future_dataframe(periods=90)
forecast = model.predict(future)</div>
    `;
  } else if (projectId === 'user-behavior') {
    content = `
      <div class="modal-header-tag">// DEPLOYMENT #02</div>
      <h2 class="modal-title">User Behavior & Clustering Dashboard</h2>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        Unsupervised K-Means clustering model classifying 500,000+ active user cohorts to optimize marketing acquisition spend.
      </p>

      <div class="modal-metrics-row">
        <div class="metric-box">
          <div class="metric-val">500k+</div>
          <div class="metric-lbl">Users Segmented</div>
        </div>
        <div class="metric-box">
          <div class="metric-val">+22%</div>
          <div class="metric-lbl">Campaign ROI</div>
        </div>
        <div class="metric-box">
          <div class="metric-val">4 Cohorts</div>
          <div class="metric-lbl">Optimal K-Clusters</div>
        </div>
      </div>

      <h4 style="color: var(--purple-primary); margin-bottom: 8px;">RFM Segmentation Query</h4>
      <div class="modal-code-block">WITH rfm_score AS (
  SELECT user_id,
    NTILE(4) OVER (ORDER BY max(order_date) DESC) AS recency_score,
    NTILE(4) OVER (ORDER BY count(order_id) ASC) AS frequency_score,
    NTILE(4) OVER (ORDER BY sum(amount) ASC) AS monetary_score
  FROM transactions GROUP BY user_id
)
SELECT *, (recency_score + frequency_score + monetary_score) AS rfm_total 
FROM rfm_score;</div>
    `;
  } else if (projectId === 'supply-chain') {
    content = `
      <div class="modal-header-tag">// DEPLOYMENT #03</div>
      <h2 class="modal-title">Real-Time Supply Chain Data Pipeline</h2>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        Global inventory metrics ingestion pipeline built on Google BigQuery and dbt with streaming updates and sub-minute latency.
      </p>

      <div class="modal-metrics-row">
        <div class="metric-box">
          <div class="metric-val">15 min</div>
          <div class="metric-lbl">Reporting Latency</div>
        </div>
        <div class="metric-box">
          <div class="metric-val">1.2 TB</div>
          <div class="metric-lbl">Daily Event Ingestion</div>
        </div>
        <div class="metric-box">
          <div class="metric-val">100%</div>
          <div class="metric-lbl">dbt Test Pass Rate</div>
        </div>
      </div>

      <h4 style="color: var(--green-primary); margin-bottom: 8px;">dbt Materialized View Model</h4>
      <div class="modal-code-block">{{ config(materialized='materialized_view', partition_by={"field": "event_timestamp", "data_type": "timestamp"}) }}

SELECT 
  warehouse_id,
  sku_code,
  sum(stock_delta) OVER(PARTITION BY warehouse_id, sku_code ORDER BY event_timestamp) as live_stock
FROM {{ ref('stg_inventory_events') }}</div>
    `;
  }

  content += `
    <div style="margin-top: 28px; text-align: right;">
      <button class="btn btn-secondary" onclick="closeModal()">Close Overview</button>
    </div>
  `;

  openModal(content);
}

/* --------------------------------------------------------------------------
   8. Scroll Reveal & Micro Animation Engine
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const cards = document.querySelectorAll('.arsenal-card, .feature-card, .project-card');
  
  cards.forEach((card, index) => {
    card.classList.add('reveal-item');
    card.style.transitionDelay = `${(index % 4) * 0.07}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}

// Global scope bindings for inline HTML handlers
window.openResumeModal = openResumeModal;
window.openViewModelsModal = openViewModelsModal;
window.openProjectModal = openProjectModal;
window.closeModal = closeModal;
