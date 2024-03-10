const { createBrowserRouter, RouterProvider, Route, Link } =
  window.ReactRouterDOM;
const { useRoutes, useNavigate } = window.ReactRouter;

function Logo() {
  const handleLogoClick = (event) => {
    event.preventDefault();
    console.log("test");
    window.scrollTo(0, 0);
  };

  return (
    <h1 class="logo">
      <a href="#" onClick={handleLogoClick}>
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

function Pill() {
  return (
    <div class="alert" x-show="$store.atelier.showNewEntriesPill">
      <a
        class="pill"
        href="/"
        // @click.prevent="
        //   window.scrollTo(0, 0);
        //   $store.atelier.showNewEntriesPill = false;
        // "
      >
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
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span
          class="label"
          x-show="$store.atelier.newEntries > 1"
          x-text="`${$store.atelier.newEntries} new artworks`"
        ></span>
        <span
          class="label"
          x-show="$store.atelier.newEntries === 1"
          x-text="`${$store.atelier.newEntries} new artwork`"
        >
          x new artworks
        </span>
      </a>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();

  return (
    <div class="header">
      <Logo />
      <Pill />
    </div>
  );
}

// Footer component

function Footer() {
  return (
    <pre>
      Just view source this page and you will see all of the code there, easy to
      follow and learn
    </pre>
  );
}

// Home component

function Container({ children }) {
  return <div class="container">{childrens}</div>;
}

function Home() {
  return (
    <>
      <Header />
      <div class="container">
        <h1>Welcome to the Home Page!</h1>
        <p>This is the home page content.</p>
        {/* <Link to="about">About Us</Link> */}
        <Footer />
      </div>
    </>
  );
}

// About component

function About() {
  return (
    <div>
      <Header />
      <h1>About Us</h1>
      <p>This is the about page content.</p>
      {/* <Link to="/">Home</Link> */}
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
]);

// Render the router

ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById("root")
);
