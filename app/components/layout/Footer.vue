<template>
  <footer class="max-w-7xl mx-auto px-8 pt-6 pb-8">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-3">
        <span
            class="text-[12px] font-bold tracking-[0.12em] text-[#191c1d]"
            style="font-family: 'Manrope', sans-serif;"
        >GALLERY</span>
      <div class="flex flex-wrap gap-6">
        <a
            v-for="link in ['Privacy Policy', 'Terms of Service', 'Cookies', 'Accessibility']"
            :key="link"
            href="#"
            class="text-[12px] text-[#191c1d]/40 hover:text-[#191c1d] transition-colors"
        >{{ link }}</a>
      </div>
      <div class="flex gap-4 text-[#191c1d]/30">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
        </svg>
      </div>
    </div>
    <p class="text-[11px] text-[#191c1d]/25">© 2024 Gallery Inc. All rights reserved.</p>
  </footer>
</template>