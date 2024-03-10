const { createBrowserRouter, RouterProvider, Route, Link } =
  window.ReactRouterDOM;
const { useRoutes, useNavigate } = window.ReactRouter;

// Header component

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      <nav>
        <button onClick={() => navigate("/")}>Home (path is /)</button>
        &nbsp;
        <button onClick={() => navigate("/about")}>
          About Us (path is /about)
        </button>
      </nav>
    </header>
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

function Home() {
  return (
    <div>
      <Header />
      <h1>Welcome to the Home Page!</h1>
      <p>This is the home page content.</p>
      {/* <Link to="about">About Us</Link> */}
      <Footer />
    </div>
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
