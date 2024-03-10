const { createBrowserRouter, RouterProvider, Route, Link } =
  window.ReactRouterDOM;
const { useRoutes, useNavigate } = window.ReactRouter;
const { useEffect, useState } = window.React;

async function get(endpoint) {
  return await (await fetch(endpoint)).json();
}

function formatDate(timestamp) {
  console.log(timestamp);
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function timeAgo(timestamp) {
  const intervals = [
    { seconds: 31536000, text: "year" },
    { seconds: 2592000, text: "month" },
    { seconds: 604800, text: "week" },
    { seconds: 86400, text: "day" },
    { seconds: 3600, text: "hour" },
    { seconds: 60, text: "minute" },
  ];

  const now = new Date();
  const elapsed = Math.floor((now - new Date(timestamp)) / 1000);

  if (elapsed < 60) {
    return "New";
  }

  for (let { seconds, text } of intervals) {
    const interval = Math.floor(elapsed / seconds);
    if (interval >= 1) {
      return `${interval} ${text}${interval > 1 ? "s" : ""} ago`;
    }
  }
}

async function copyImageToClipboard(imgId) {
  const img = document.getElementById(imgId);

  // Create an off-screen canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to match the image
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);

  // Convert the canvas to a Blob
  canvas.toBlob(async (blob) => {
    try {
      // Create a new ClipboardItem object
      const item = new ClipboardItem({ "image/png": blob });
      // Copy the ClipboardItem to the clipboard
      await navigator.clipboard.write([item]);
    } catch (err) {
      console.error("Failed to copy image: ", err);
    }
  }, "image/png");
}

async function getTimeline(page = 1, limit = 32) {
  console.log("Fetching page:", page);
  return await get(`/timeline?page=${page}&limit=${limit}`);
}

async function getTimelineSince(when) {
  console.log("Fetching since:", when);
  return await get(`/timeline/since/${when}`);
}

async function deleteArtwork(entry) {
  await fetch(`/delete/${entry.timestamp}`, {
    method: "POST",
  });
}

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

function Pill() {
  return (
    <div class="alert" x-show="$store.atelier.showNewArtworksPill">
      <a
        class="pill"
        href="/"
        // @click.prevent="
        //   window.scrollTo(0, 0);
        //   $store.atelier.showNewArtworksPill = false;
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
          x-show="$store.atelier.newArtworks > 1"
          x-text="`${$store.atelier.newArtworks} new artworks`"
        ></span>
        <span
          class="label"
          x-show="$store.atelier.newArtworks === 1"
          x-text="`${$store.atelier.newArtworks} new artwork`"
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

function Container({ children }) {
  return <div class="container">{children}</div>;
}

function Deck({ children }) {
  return <div class="deck">{children}</div>;
}

// <pre
//   style="
//     display: none;
//     padding: 12px;
//     border-radius: 12px;
//     background: rgba(255, 255, 255, 0.75);
//     font-family: monospace;
//     color: black;
//   "
//   x-text="JSON.stringify(artwork, null, 2)"
// ></pre>

function DownloadAction({ artwork }) {
  return (
    <div class="action">
      <a
        href={
          artwork.screenshot
            ? `/screenshots/${artwork.screenshot}`
            : `/recordings/${artwork.recording}`
        }
        download
        title={`Download ${
          artwork.screenshot ? artwork.screenshot : artwork.recording
        }`}
      >
        <span>Download</span>
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
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      </a>
    </div>
  );
}

function CopyAction({ artwork }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (event) => {
    event.preventDefault();
    setCopied(true);
    copyImageToClipboard(`atelier-screenshot-${artwork.timestamp}`);
  };

  return (
    <div class="action">
      <button onClick={handleCopy}>
        {!copied && <span>Copy</span>}
        {copied && <span>Copied!</span>}
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
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
          />
        </svg>
      </button>
    </div>
  );
}

function DeleteAction({ artwork }) {
  const handleDelete = (event) => {
    event.preventDefault();

    await;
  };

  return (
    <div class="action">
      <button
        type="button"
        // @click.prevent="
        //   await $store.atelier.delete(artwork);
        //   $el.closest('.card').remove();
        // "
      >
        <span>Delete</span>
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
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </button>
    </div>
  );
}

function Card({ artwork }) {
  console.log(artwork);
  return (
    <div class="card" id={`atelier-card-${artwork.timestamp}`}>
      <div class="card-header">
        <div class="time">{timeAgo(artwork.timestamp)}</div>
        <div class="actions">
          {(artwork.screenshot || artwork.recording) && (
            <DownloadAction artwork={artwork} />
          )}
          {artwork.screenshot && <CopyAction artwork={artwork} />}
          {/* <!-- <form
                  class="action"
                  x-show="artwork.commitHash != ''"
                  :action="`/revert/${artwork.commitHash}`"
                  method="get"
                >
                  <button
                    type="submit"
                    @click="
                      $el.closest('.card').remove();
                      timeline = [artwork, ...timeline];
                    "
                  >
                    <span>Revert</span>
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
                        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                      />
                    </svg>
                  </button>
                </form> --> */}
          <DeleteAction artwork={artwork} />
        </div>
      </div>
      <div class="media">
        <template x-if="artwork.screenshot">
          <img
          // :id="`atelier-screenshot-${index}`"
          // :src="`/screenshots/${artwork.screenshot}`"
          // :alt="`Screenshot taken at ${new Date(artwork.timestamp).toLocaleString()}`"
          />
        </template>
        <template x-if="artwork.recording">
          <video
            controls
            // :id="`atelier-recording-${index}`"
            // :title="`Recording taken at ${new Date(artwork.timestamp).toLocaleString()}`"
          >
            <source
              // :src="`/recordings/${artwork.recording}`"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </template>
      </div>
    </div>
  );
}

function Home() {
  const [artworks, setArtworks] = useState([]);

  useEffect(async () => {
    const timeline = await getTimeline();
    setArtworks(timeline.artworks);
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Deck>
          {artworks.map((artwork, index) => (
            <Card key={`artwork-${index}`} artwork={artwork} />
          ))}
        </Deck>
      </Container>
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
