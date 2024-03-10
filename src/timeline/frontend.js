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
  const { artworks, setArtworks } = useAtelier();

  const handleDelete = async (event) => {
    event.preventDefault();

    // Update artworks state
    setArtworks(artworks.filter((a) => a.timestamp != artwork.timestamp));

    await deleteArtwork(artwork);
  };

  return (
    <div class="action">
      <button type="button" onClick={handleDelete}>
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

function Media({ artwork }) {
  return (
    <div class="media">
      {artwork.screenshot && (
        <img
          id={`atelier-screenshot-${artwork.timestamp}`}
          src={`/screenshots/${artwork.screenshot}`}
          alt={`Screenshot taken at ${new Date(
            artwork.timestamp
          ).toLocaleString()}`}
        />
      )}
      {artwork.recording && (
        <video
          controls
          id={`atelier-recording-${artwork.timestamp}`}
          title={`Recording taken at ${new Date(
            artwork.timestamp
          ).toLocaleString()}`}
        >
          <source src={`/recordings/${artwork.recording}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

function Card({ artwork }) {
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
      <Media artwork={artwork} />
    </div>
  );
}

function App() {
  const { artworks, status, setArtworks } = useAtelier();

  const pollNewArtworks = async () => {
    const when = artworks[0].timestamp;
    const fresh = await getTimelineSince(when);
    console.log("polling new artworks", fresh.artworks.length);

    return fresh.artworks;

    // this.timeline.entries = this.entries;

    // this.timeline = {
    //   ...this.timeline,
    //   entries: entries,
    //   total: entries.length,
    //   // totalPages: Math.ceil(entries.length / limit),
    // };

    // Show only if not viewing the top of the page
    // this.showNewEntriesPill =
    //   window.scrollY >
    //   document.getElementById("atelier-card-1").clientHeight;
    // this.newEntries += fresh.entries.length;
    // this.showNewEntriesPill = true;
  };

  useEffect(() => {
    if (status !== STATUS.INITIALIZED) {
      return;
    }

    const timer = setInterval(async () => {
      const newArtworks = await pollNewArtworks();
      setArtworks(newArtworks);
    }, 3000);
    return () => clearInterval(timer);
  }, [status]);

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

ReactDOM.render(
  <AtelierProvider>
    <App />
  </AtelierProvider>,
  document.getElementById("root")
);
