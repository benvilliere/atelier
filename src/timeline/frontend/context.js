const { createContext, useContext, useEffect, useState } = window.React;

const AtelierContext = createContext();

const useAtelier = () => useContext(AtelierContext);

const STATUS = {
  INITIALIZING: 0,
  INITIALIZED: 1,
  POLLING: 2,
};

const AtelierProvider = ({ children }) => {
  const POLLING_INTERVAL = 3000;
  const [status, setStatus] = useState(STATUS.INITIALIZING);
  const [artworks, setArtworks] = useState([]);
  const [newArtworks, setNewArtworks] = useState(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getTimeline();
        setArtworks(data.artworks);
        setStatus(STATUS.INITIALIZED);
      } catch (error) {
        console.error("Failed to fetch artworks", error);
      }
    };

    fetchArtworks();
  }, []);

  const polling = async () => {
    // const when = artworks[0].timestamp;
    const when = Date.now() - POLLING_INTERVAL;
    const fresh = await getTimelineSince(when);
    console.log("Polling new artworks:", fresh.artworks.length);
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
      const newArtworks = await polling();
      console.log({ newArtworks });
      setArtworks([...newArtworks, ...artworks]);
    }, POLLING_INTERVAL);
    return () => clearInterval(timer);
  }, [status]);

  return (
    <AtelierContext.Provider
      value={{
        artworks,
        setArtworks,
        newArtworks,
        setNewArtworks,
        status,
        setStatus,
        polling,
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
};
