const { useEffect, useState } = window.React;
function Logo() {
  const handleLogoClick = (event) => {
    event.preventDefault();
    window.scrollTo(0, 0);
  };

  return (
    <h1 class="logo">
      <a href="/" onClick={handleLogoClick}>
        <span>Atelier</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      </a>
    </h1>
  );
}
