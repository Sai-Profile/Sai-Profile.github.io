document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  /* =========================
     SLIDE CONTENT (UNCHANGED)
     ========================= */
  const CONTENT = {
    intro: {
      kicker: 'Slide 1 — Introduction',
      h2: 'The Educational Journey: Goals and Methods',
      subtitle: 'Defining Objectives and Maximizing Learning',
      bullets: [
        'Education is a deliberate progression of goals.',
        'Each stage prepares learners for the next level.',
        'Learning methods support achievement of objectives.'
      ],
      script:
        'This slide explains why education is structured as a journey with clear goals and methods.',
      figure: { alt:'Educational journey', cap:'Purpose of education' }
    },

    baccalaureate: {
      kicker: 'Slide 2 — Degree 1',
      h2: 'Baccalaureate: Foundational Readiness',
      bullets: [
        'Objective: Foundational education and academic readiness.',
        'Key focus: Critical thinking, literacy, study habits.'
      ],
      script:
        'The objective is to establish our broad academic base and build essential skills like critical thinking, which is the minimum requirement for university admission.',
      figure: { alt:'Baccalaureate education', cap:'Academic foundation' }
    },

    bachelor: {
      kicker: 'Slide 3 — Degree 2',
      h2: "Bachelor’s: Professional Practice",
      bullets: [
        'Objective: Discipline-specific knowledge and professional practice.',
        'Key focus: Analytical skills, communication, real-world application.'
      ],
      script:
        'This is where we dive deep into our major to prepare for professional roles.',
      figure: { alt:'Bachelor education', cap:'Professional preparation' }
    },

    master: {
      kicker: 'Slide 4 — Degree 3',
      h2: "Master’s: Advanced Specialization",
      bullets: [
        'Objective: Advanced expertise and specialization.',
        'Key focus: Synthesis, advanced analysis, thesis or project.'
      ],
      script:
        'A Master’s develops advanced analytical and synthesis skills.',
      figure: { alt:'Master education', cap:'Advanced specialization' }
    },

    doctorate: {
      kicker: 'Slide 5 — Degree 4',
      h2: 'Doctoral: Knowledge Innovation',
      bullets: [
        'Objective: Create new knowledge and original contribution.',
        'Key focus: Independent research and theory advancement.'
      ],
      script:
        'Doctoral study is about original research and knowledge creation.',
      figure: { alt:'Doctoral research', cap:'Knowledge innovation' }
    },

    inclass: {
      kicker: 'Slide 6 — Learning Method 1',
      h2: 'Learning Mode: In-Class (Face-to-Face)',
      bullets: [
        'Benefit: Direct interaction and immediate feedback.',
        'Key focus: Practice, discussion, structure.'
      ],
      script:
        'In-class learning provides structure and immediate academic support.',
      figure: { alt:'Classroom learning', cap:'Face-to-face learning' }
    },

    online: {
      kicker: 'Slide 7 — Learning Method 2',
      h2: 'Learning Mode: Online (E-Learning)',
      bullets: [
        'Benefit: Maximum flexibility and self-paced learning.',
        'Key focus: Digital tools and self-discipline.'
      ],
      script:
        'Online learning allows flexible and independent study.',
      figure: { alt:'Online learning', cap:'Flexible learning' }
    },

    conclusion: {
      kicker: 'Slide 8 — Conclusion',
      h2: 'Summary & Discussion',
      bullets: [
        'Education progresses from foundation to specialization.',
        'Learning mode supports the objective.'
      ],
      script:
        'Education is a deliberate journey toward continuous advancement.',
      figure: { alt:'Graduation', cap:'Educational journey completed' }
    }
  };

  /* =========================
     5 IMAGES PER SLIDE
     ========================= */
  const IMAGES = {
    intro: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
    ],
    baccalaureate: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
      'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6',
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b'
    ],
    bachelor: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
    ],
    master: [
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      'https://images.unsplash.com/photo-1505666287802-931dc83948e9',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
      'https://images.unsplash.com/photo-1581090700227-1e37b190418e'
    ],
    doctorate: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      'https://images.unsplash.com/photo-1505666287802-931dc83948e9',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998',
      'https://images.unsplash.com/photo-1509223197845-458d87318791',
      'https://images.unsplash.com/photo-1518770660439-4636190af475'
    ],
    inclass: [
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f'
    ],
    online: [
      'https://images.unsplash.com/photo-1584697964190-9e44a6c1c62e',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
    ],
    conclusion: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7'
    ]
  };

  /* =========================
     RENDER + NEXT BUTTON
     ========================= */
  Object.entries(CONTENT).forEach(([id, data]) => {
    const section = document.getElementById(id);
    if (!section) return;

    let index = 0;

    section.innerHTML = `
      <div class="kicker">${data.kicker}</div>
      <h2 class="slide-title">${data.h2}</h2>
      ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
      <div class="grid">
        <div>
          <ul>${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
          <p class="script">${data.script}</p>
        </div>
        <figure>
          <img id="img-${id}" src="${IMAGES[id][0]}" alt="${data.figure.alt}" loading="lazy">
          <figcaption>
            ${data.figure.cap}
            <button class="fig-next-btn" id="btn-${id}">Next</button>
          </figcaption>
        </figure>
      </div>
    `;

    document.getElementById(`btn-${id}`).onclick = () => {
      index = (index + 1) % IMAGES[id].length;
      document.getElementById(`img-${id}`).src = IMAGES[id][index];
    };
  });
});
