window.addEventListener('scroll', () => {
  const scrollSections = document.querySelectorAll('.scroll-section');

  scrollSections.forEach(section => {
    const textContent = section.querySelector('.text-content');
    const imageContent = section.querySelector('.image-content');
    const sectionTop = section.offsetTop;
    const scrollPosition = window.scrollY;

    if (scrollPosition > sectionTop - window.innerHeight / 2) {
      textContent.style.opacity = 1;
      textContent.style.transform = 'translateY(0)';
      imageContent.style.opacity = 0.8;
    } else {
      textContent.style.opacity = 0;
      textContent.style.transform = 'translateY(20px)';
      imageContent.style.opacity = 0;
    }
  });
});
