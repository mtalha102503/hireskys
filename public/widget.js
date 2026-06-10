(function() {
    const container = document.getElementById('hireskys-jobs-widget');
    
    if (!container) {
        console.error('HireSkys Widget Error: <div id="hireskys-jobs-widget"> not found on this page.');
        return;
    }

    const companySlug = container.getAttribute('data-company');
    
    if (!companySlug) {
        console.error('HireSkys Widget Error: data-company attribute is missing.');
        return;
    }

    container.innerHTML = `
        <div id="hireskys-loader" style="display: flex; justify-content: center; align-items: center; padding: 40px; font-family: sans-serif; color: #64748b;">
            <svg style="animation: hireskys-spin 1s linear infinite; height: 24px; width: 24px; color: #4f46e5; margin-right: 10px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading open positions...
        </div>
    `;

    // 🟢 PRO-TIP 2: Check before adding style to avoid duplicates
    if (!document.getElementById('hireskys-widget-style')) {
        const style = document.createElement('style');
        style.id = 'hireskys-widget-style';
        style.innerHTML = `@keyframes hireskys-spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }

    const iframe = document.createElement('iframe');
    
    // 🟢 Localhost par test karte waqt yahan localhost:3000 kar lena
    iframe.src = `https://www.hireskys.com/embed/${companySlug}`; 
    
    iframe.style.width = '100%';
    iframe.style.height = '200px'; 
    iframe.style.border = 'none';
    iframe.style.borderRadius = '16px';
    iframe.style.overflow = 'hidden';
    iframe.style.background = 'transparent';
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 0.5s ease-in-out, height 0.3s ease-in-out';

    iframe.onload = function() {
        const loader = document.getElementById('hireskys-loader');
        if (loader) loader.remove();
        iframe.style.opacity = '1';
    };

    container.appendChild(iframe);

    // ========================================================
    // 🟢 THE MAGIC: Listen for resize and scroll messages!
    // ========================================================
    window.addEventListener('message', function(event) {
        if (!event.data) return;

        // 1. Height Adjuster
        if (event.data.type === 'hireskys-resize') {
            const newHeight = event.data.height;
            if (newHeight && iframe) {
                iframe.style.height = (newHeight + 10) + 'px'; 
            }
        }

        // 2. Scroll To Top (Ye wala part add kiya hai)
        if (event.data.type === 'hireskys-scroll-to-top') {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
})();
