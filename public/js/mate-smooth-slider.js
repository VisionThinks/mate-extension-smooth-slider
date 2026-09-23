/**
 * Contao MATE Smooth Slider
 *
 * Development v0.1
 *
 * - true image crossfade
 * - independent text transition
 * - stable caption background
 * - single scheduler
 *
 * No MATE vendor files are modified.
 */
(function () {
    'use strict';

    const IMAGE_FADE    = 1200;
    const TEXT_FADE_OUT = 1200;
    const TEXT_FADE_IN  = 1200;
    const HOLD_TIME     = 10000;

    function initSlider(slider) {
        const inst = slider.M_Slider;

        if (!inst) {
            return;
        }

        if (slider.dataset.mateSmoothSlider === '1') {
            return;
        }

        const slides = Array.from(
            slider.querySelectorAll('.slides > li')
        );

        if (slides.length < 2) {
            return;
        }

        slider.dataset.mateSmoothSlider = '1';

        // Disable Materialize automatic scheduling.
        inst.pause();

        let current = slides.findIndex(
            slide => slide.classList.contains('active')
        );

        if (current < 0) {
            current = 0;
        }

        let timer = null;
        let running = false;

        /*
         * Image overlay
         */
        const layer = document.createElement('div');
        layer.className = 'mate-smooth-slider__image-layer';

        slider.appendChild(layer);

        function updateImageLayerGeometry() {
            const activeSlide =
                slides.find(slide => slide.classList.contains('active')) ||
                slides[current];

            const imageBox = activeSlide?.querySelector('.img');

            if (!imageBox) {
                return;
            }

            const sliderRect = slider.getBoundingClientRect();
            const imageRect = imageBox.getBoundingClientRect();

            layer.style.left =
                `${imageRect.left - sliderRect.left}px`;

            layer.style.top =
                `${imageRect.top - sliderRect.top}px`;

            layer.style.width =
                `${imageRect.width}px`;

            layer.style.height =
                `${imageRect.height}px`;
        }

        updateImageLayerGeometry();

        window.addEventListener(
            'resize',
            updateImageLayerGeometry
        );

        function makeImage(slide) {
            const source = slide.querySelector('.img img');

            if (!source) {
                return null;
            }

            const clone = source.cloneNode(true);

            // Use the image resource MATE is actually displaying.
            clone.src = source.currentSrc || source.src;
            clone.removeAttribute('width');
            clone.removeAttribute('height');

            clone.classList.add(
                'mate-smooth-slider__image'
            );

            return clone;
        }

        let currentImage = makeImage(slides[current]);

        if (currentImage) {
            layer.appendChild(currentImage);
        }

        /*
         * Scheduler
         */
        function scheduleNext() {
            window.clearTimeout(timer);

            timer = window.setTimeout(
                changeSlide,
                HOLD_TIME
            );
        }

        /*
         * Slide transition
         */
        async function changeSlide() {
            if (running) {
                return;
            }

            running = true;
            window.clearTimeout(timer);

            const next = (current + 1) % slides.length;

            /*
             * Incoming image
             */
            const incomingImage = makeImage(slides[next]);

            let imageAnimation = null;

            if (incomingImage) {
                incomingImage.style.opacity = '0';
                incomingImage.style.zIndex = '2';

                if (currentImage) {
                    currentImage.style.zIndex = '1';
                }

                layer.appendChild(incomingImage);

                imageAnimation = incomingImage.animate(
                    [
                        { opacity: 0 },
                        { opacity: 1 }
                    ],
                    {
                        duration: IMAGE_FADE,
                        easing: 'linear',
                        fill: 'forwards'
                    }
                );
            }

            /*
             * Outgoing text
             */
            const oldContent = slides[current].querySelector(
                '.caption .layout_latest'
            );

            let textOut = null;

            if (oldContent) {
                textOut = oldContent.animate(
                    [
                        { opacity: 1 },
                        { opacity: 0 }
                    ],
                    {
                        duration: TEXT_FADE_OUT,
                        easing: 'linear',
                        fill: 'forwards'
                    }
                );
            }

            /*
             * Image and old text run in parallel.
             */
            const firstPhase = [];

            if (imageAnimation) {
                firstPhase.push(imageAnimation.finished);
            }

            if (textOut) {
                firstPhase.push(textOut.finished);
            }

            await Promise.all(firstPhase);

            /*
             * Switch Materialize internally without its
             * own transition.
             */
            const originalDuration = inst.options.duration;

            inst.options.duration = 0;
            inst.set(next);
            inst.pause();
            inst.options.duration = originalDuration;

            await new Promise(resolve => {
                window.requestAnimationFrame(resolve);
            });

            /*
             * Incoming text
             */
            const newContent = slides[next].querySelector(
                '.caption .layout_latest'
            );

            if (newContent) {
                newContent.style.opacity = '0';

                const textIn = newContent.animate(
                    [
                        { opacity: 0 },
                        { opacity: 1 }
                    ],
                    {
                        duration: TEXT_FADE_IN,
                        easing: 'linear',
                        fill: 'forwards'
                    }
                );

                await textIn.finished;

                newContent.style.opacity = '';
            }

            /*
             * Cleanup
             */
            if (oldContent) {
                oldContent
                    .getAnimations()
                    .forEach(animation => animation.cancel());

                oldContent.style.opacity = '';
            }

            if (currentImage) {
                currentImage.remove();
            }

            currentImage = incomingImage;

            if (currentImage) {
                currentImage
                    .getAnimations()
                    .forEach(animation => animation.cancel());

                currentImage.style.opacity = '1';
                currentImage.style.zIndex = '1';
            }

            current = next;
            running = false;

            scheduleNext();
        }

        scheduleNext();
    }

    function init() {
        document
            .querySelectorAll('.slider.mod_newslist')
            .forEach(initSlider);
    }

    /*
     * MATE initializes Materialize before we take control.
     */
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init, {
            once: true
        });
    }
})();
