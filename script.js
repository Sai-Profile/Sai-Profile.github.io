document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  /* =========================
     SLIDE CONTENT (EXACT)
     ========================= */
  const CONTENT = {
    intro: {
      kicker: 'Slide 1 — Introduction',
      h2: 'The Educational Journey: Goals and Methods',
      subtitle: 'Defining Objectives and Maximizing Learning',
      bullets: [
        'Education follows a deliberate progression of goals.',
        'Each stage is designed to prepare learners for the next level.',
        'Learning methods support how objectives are achieved.'
      ],
      script:
        'This presentation explains why education is structured as a journey, focusing on clear goals and effective learning methods.',
      figure: {
        alt: 'Students progressing through different stages of education',
        cap: 'Understanding the purpose of the educational journey'
      }
    },

    baccalaureate: {
      kicker: 'Slide 2 — Degree 1',
      h2: 'Baccalaureate: Foundational Readiness',
      bullets: [
        'Objective: Foundational education and academic readiness.',
        'Key focus: Critical thinking, literacy, and study habits.'
      ],
      script:
        'The objective is to establish our broad academic base and build essential skills like critical thinking, which is the minimum requirement for university admission.',
      figure: {
        alt: 'High school graduation ceremony',
        cap: 'Building the foundation for higher education'
      }
    },

    bachelor: {
      kicker: 'Slide 3 — Degree 2',
      h2: "Bachelor’s: Professional Practice",
      bullets: [
        'Objective: Discipline-specific knowledge and professional practice.',
        'Key focus: Analytical skills, communication, and real-world application.'
      ],
      script:
        'This is where we dive deep into our major, focusing on learning theories and applying knowledge to prepare for entry-level to mid-level professional roles.',
      figure: {
        alt: 'University students working on group projects',
        cap: 'Applying knowledge in professional contexts'
      }
    },

    master: {
      kicker: 'Slide 4 — Degree 3',
      h2: "Master’s: Advanced Specialization",
      bullets: [
        'Objective: Advanced expertise and specialization.',
        'Key focus: Synthesis of knowledge, advanced analytical skills, and thesis or project work.'
      ],
      script:
        'We pursue a Master’s to gain a competitive edge by focusing on advanced analytical skills and synthesis of knowledge, often through a thesis or applied project.',
      figure: {
        alt: 'Graduate student conducting advanced research',
        cap: 'Deepening expertise and specialization'
      }
    },

    doctorate: {
      kicker: 'Slide 5 — Degree 4',
      h2: 'Doctoral: Knowledge Innovation',
      bullets: [
        'Objective: Create new knowledge and original contribution.',
        'Key focus: Independent research, advancing theory, and discipline mastery.'
      ],
      script:
        'A Doctorate is for becoming true leaders in research—it’s about conducting independent, original research and advancing theory to generate new knowledge.',
      figure: {
        alt: 'Researcher analyzing data and academic literature',
        cap: 'Creating original knowledge'
      }
    },

    inclass: {
      kicker: 'Slide 6 — Learning Method 1',
      h2: 'Learning Mode: In-Class (Face-to-Face)',
      bullets: [
        'Benefit: Direct interaction and immediate feedback.',
        'Key focus: Hands-on practice, group discussions, and a structured environment.'
      ],
      script:
        'The classroom gives us the advantage of immediate feedback, hands-on practice, and a fixed schedule, which builds a committed learning community.',
      figure: {
        alt: 'Face-to-face classroom discussion at university',
        cap: 'Structured in-class learning'
      }
    },

    online: {
      kicker: 'Slide 7 — Learning Method 2',
      h2: 'Learning Mode: Online (E-Learning)',
      bullets: [
        'Benefit: Maximum flexibility and self-paced learning.',
        'Key focus: Anywhere-anytime learning, digital tools, and self-discipline.'
      ],
      script:
        'Online learning is perfect for managing our schedules, as it offers maximum flexibility to study at our own pace using digital tools like videos and discussion forums.',
      figure: {
        alt: 'Student studying online using a laptop',
        cap: 'Flexible online learning environment'
      }
    },

    conclusion: {
      kicker: 'Slide 8 — Conclusion',
      h2: 'Summary & Discussion',
      bullets: [
        'Education is a deliberate progression of goals.',
        'Learning mode supports the objective.'
      ],
      script:
        'To conclude, our educational path is all about clear goals. We advance from foundational knowledge to specialized expertise. Whether in a classroom or online, the objective remains the same: to continuously advance our knowledge and achieve our next milestone. I welcome any questions.',
      figure: {
        alt: 'Students celebrating graduation together',
        cap: 'Completing the educational journey'
      }
    }
  };

  /* =========================
     SIMPLE IMAGE MAP
     ========================= */
  const IMAGES = {
    intro: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    baccalaureate: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    bachelor: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    master: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572',
    doctorate: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    inclass: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
    online: 'https://images.unsplash.com/photo-1584697964190-9e44a6c1c62e',
    conclusion: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d'
  };

  /* =========================
     RENDER SLIDES
     ========================= */
  Object.entries(CONTENT).forEach(([id, data]) => {
    const section = document.getElementById(id);
    if (!section) return;

    section.innerHTML = `
      <div class="kicker">${data.kicker}</div>
      <h2 class="slide-title">${data.h2}</h2>
      ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
      <div class="grid">
        <div>
          <ul>
            ${data.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <p class="script">${data.script}</p>
        </div>
        <figure>
          <img src="${IMAGES[id]}" alt="${data.figure.alt}" loading="lazy">
          <figcaption>${data.figure.cap}</figcaption>
        </figure>
      </div>
    `;
  });
});
