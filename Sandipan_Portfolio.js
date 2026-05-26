document.addEventListener('DOMContentLoaded', function () {
            // Elements
            const menuIcon = document.getElementById('menu-icon');
            const nav = document.getElementById('nav');
            const navLinks = document.querySelectorAll('nav a[href^="#"]');
            const sections = document.querySelectorAll('section[id]');
            const header = document.getElementById('header');

            // 1) Mobile menu toggle
            menuIcon.addEventListener('click', function () {
                nav.classList.toggle('active');
                menuIcon.classList.toggle('bx-x'); // switches icon visually (requires boxicons)
            });

            // Close mobile menu after clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', function () {
                    nav.classList.remove('active');
                    menuIcon.classList.remove('bx-x');
                });
            });

            // 2) Smooth scroll for internal links (nav and buttons)
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href').slice(1);
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // update focus for accessibility
                        targetEl.setAttribute('tabindex', '-1');
                        targetEl.focus({ preventScroll: true });
                    }
                });
            });

            // 3) Scroll spy (highlight active nav link based on section in viewport)
            // Use IntersectionObserver for better performance
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.55 // section considered "active" when >55% visible
            };

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    const id = entry.target.getAttribute('id');
                    const navLink = document.querySelector('nav a[href="#' + id + '"]');
                    if (entry.isIntersecting) {
                        // Remove active class from others first
                        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                        if (navLink) navLink.classList.add('active');
                    } else {
                        if (navLink) navLink.classList.remove('active');
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));

            // 4) Typing effect for the welcome line
            (function typingEffect() {
                const el = document.querySelector('.typing-text');
                if (!el) return;
                const texts = [
                    'Welcome to my portfolio!',
                    'I build responsive websites.',
                    'I love coding and learning new tech.'
                ];
                let charIndex = 0;
                let textIndex = 0;
                let typing = true;
                const speed = 60;
                const pause = 1200;

                function tick() {
                    const full = texts[textIndex];
                    if (typing) {
                        el.textContent = full.slice(0, ++charIndex);
                        if (charIndex === full.length) {
                            typing = false;
                            setTimeout(tick, pause);
                        } else {
                            setTimeout(tick, speed);
                        }
                    } else {
                        el.textContent = full.slice(0, --charIndex);
                        if (charIndex === 0) {
                            typing = true;
                            textIndex = (textIndex + 1) % texts.length;
                            setTimeout(tick, speed);
                        } else {
                            setTimeout(tick, speed / 1.2);
                        }
                    }
                }
                tick();
            })();

            // 5) Image modal (click profile image to open large view)
            (function imageModal() {
                const profileImg = document.getElementById('profile-image');
                const modal = document.getElementById('image-modal');
                const modalImg = modal.querySelector('img');
                const closeBtn = modal.querySelector('.close-btn');

                if (!profileImg || !modal) return;

                function openModal() {
                    const large = profileImg.dataset.large || profileImg.src;
                    modalImg.src = large;
                    modal.classList.add('open');
                    modal.setAttribute('aria-hidden', 'false');
                    // trap focus to close button for accessibility
                    closeBtn.focus();
                }

                function closeModal() {
                    modal.classList.remove('open');
                    modal.setAttribute('aria-hidden', 'true');
                    modalImg.src = '';
                    profileImg.focus();
                }

                profileImg.addEventListener('click', openModal);
                closeBtn.addEventListener('click', closeModal);

                modal.addEventListener('click', function (e) {
                    if (e.target === modal) closeModal();
                });

                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && modal.classList.contains('open')) {
                        closeModal();
                    }
                });
            })();

            // 6) Back to top button
            const backToTop = document.getElementById('back-to-top');
            window.addEventListener('scroll', function () {
                if (window.scrollY > 400) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }

                // Optional: add sticky header class when scrolled
                if (window.scrollY > 50) header.classList.add('sticky');
                else header.classList.remove('sticky');
            });
            backToTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // 7) Lazy-swap src from data-src (if you prefer progressive image loading)
            // Example: if you set data-src on <img>, swap it in when visible
            const lazyImages = document.querySelectorAll('img[data-src]');
            if ('IntersectionObserver' in window && lazyImages.length) {
                const imgObserver = new IntersectionObserver((entries, imgObs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imgObs.unobserve(img);
                        }
                    });
                }, { rootMargin: '50px 0px', threshold: 0.01 });

                lazyImages.forEach(img => imgObserver.observe(img));
            }
        });