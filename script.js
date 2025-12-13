document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const CONTENT = {
    intro: {
      kicker: 'Slide 1 — Introduction',
      h2: 'The Educational Journey: Goals and Methods',
      bullets: [
        'Education follows a deliberate progression of learning goals.',
        'Each degree level serves a distinct academic and professional purpose.',
        'Learning methods support how these goals are achieved.'
      ],
      script: 'This presentation explains how education progresses across degree levels and how learning modes support each stage.',
      figure: { alt: 'Students progressing through education levels', cap: 'Education as a structured journey' }
    },

    baccalaureate: {
      kicker: 'Slide 2 — Degree 1',
      h2: 'Baccalaureate: Foundational Readiness',
      bullets: [
        'Objective: Foundational education and academic readiness.',
        'Focus on literacy, numeracy, and study skills.',
        'Minimum requirement for entry into higher education.'
      ],
      script: 'The baccalaureate establishes a broad academic base and prepares students for university-level study.',
      figure: { alt: 'High school graduation ceremony', cap: 'Foundational academic preparation' }
    },

    bachelor: {
      kicker: 'Slide 3 — Degree 2',
      h2: "Bachelor’s: Professional Practice",
      bullets: [
        'Objective: Discipline-specific knowledge.',
        'Development of analytical and communication skills.',
        'Preparation for entry-level to mid-level careers.'
      ],
      script: 'At the bachelor’s level, students apply theory to practice within their chosen discipline.',
      figure: { alt: 'University students collaborating on projects', cap: 'Developing professional competence' }
    },

    master: {
      kicker: 'Slide 4 — Degree 3',
      h2: "Master’s: Advanced Specialization",
      bullets: [
        'Objective: Advanced expertise and specialization.',
        'Emphasis on synthesis and advanced analysis.',
        'Often includes a thesis or applied project.'
      ],
      script: 'A master’s degree builds advanced skills and often provides a competitive professional advantage.',
      figure: { alt: 'Graduate student conducting research', cap: 'Advanced academic specialization' }
    },

    doctorate: {
      kicker: 'Slide 5 — Degree 4',
      h2: 'Doctoral: Knowledge Innovation',
      bullets: [
        'Objective: Creation of new knowledge.',
        'Independent and original research.',
        'Advancement of theory and practice.'
      ],
      script: 'Doctoral study focuses on original research that contributes new knowledge to a discipline.',
      figure: { alt: 'Researcher working with academic data', cap: 'Original research and innovation' }
    },

    inclass: {
      kicker: 'Slide 6 — Learning Method',
      h2: 'Learning Mode: In-Class (Face-to-Face)',
      bullets: [
        'Direct interaction with instructors and peers.',
        'Immediate feedback and guided practice.',
        'Structured learning environment.'
      ],
      script: 'Face-to-face learning supports engagement, collaboration, and immediate academic support.',
      figure: { alt: 'Classroom discussion at university', cap: 'In-class learning environment' }
    },

    online: {
      kicker: 'Slide 7 — Learning Method',
      h2: 'Learning Mode: Online (E-Learning)',
      bullets: [
        'Flexible and self-paced learning.',
        'Access from anywhere at any time.',
        'Requires strong self-discipline.'
      ],
      script: 'Online learning offers flexibility and accessibility, especially for working or remote learners.',
      figure: { alt: 'Student studying online with laptop', cap: 'Digital and online learning' }
    },

    conclusion: {
      kicker: 'Slide 8 — Conclusion',
      h2: 'Summary & Discussion',
      bullets: [
        'Education progresses from foundation to specialization.',
        'Each degree level has a clear purpose.',
        'Learning modes support educational goals.'
      ],
      script: 'Education is a structured journey where both degree level and learning mode work together to achieve academic success.',
      figure: { alt: 'Students celebrating graduation', cap: 'Completing the educational journey' }
    }
  };

  const RELATED_IMAGES = {
    intro: [
      { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', credit: 'https://unsplash.com/photos/education-journey' }
    ],
    baccalaureate: [
      { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', credit: 'https://unsplash.com/photos/graduation' }
    ],
    bachelor: [
      { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644', credit: 'https://unsplash.com/photos/university-study' }
    ],
    master: [
      { src: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572', credit: 'https://unsplash.com/photos/research' }
    ],
    doctorate: [
      { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', credit: 'https://unsplash.com/photos/research-data' }
    ],
    inclass: [
      { src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df', credit: 'https://unsplash.com/photos/classroom' }
    ],
    online: [
      { src: 'https://images.unsplash.com/photo-1584697964190-9e44a6c1c62e', credit: 'https://unsplash.com/photos/online-learning' }
    ],
    conclusion: [
      { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d', credit: 'https://unsplash.com/photos/graduation-celebration' }
    ]
  };

  const navMenu = document.getElementById('navMenu');

  Object.entries(CONTENT).forEach(([id, data]) => {
    const sec = document.getElementById(id);
    sec.innerHTML = `
      <div class="kicker">${data.kicker}</div>
      <h2 class="slide-title">${data.h2}</h2>
      <div class="grid">
        <div>
          <ul>${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
          <p class="script">${data.script}</p>
        </div>
        <figure>
          <img src="${RELATED_IMAGES[id][0].src}" alt="${data.figure.alt}">
          <figcaption>${data.figure.cap}</figcaption>
        </figure>
      </div>
    `;

    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = data.h2;
    navMenu.appendChild(link);
  });

  document.getElementById('navToggle').onclick = () => {
    navMenu.hidden = !navMenu.hidden;
  };
});
