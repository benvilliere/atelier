const { createContext, useContext, useEffect, useState } = window.React;

const AtelierContext = createContext();

const useAtelier = () => useContext(AtelierContext);

const AtelierProvider = ({ children }) => {
  const [artworks, setArtworks] = useState([]);
  const [newArtworks, setNewArtworks] = useState(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getTimeline();
        setArtworks(data.artworks);
      } catch (error) {
        console.error("Failed to fetch artworks", error);
      }
    };

    fetchArtworks();
  }, []);

  const pollLatestArtworks = async () => {
    const when = this.entries[0].timestamp;
    const fresh = await getTimelineSince(when);

    if (fresh.entries.length > 0) {
      this.entries = [...fresh.entries, ...this.entries];
      // console.log();
      this.entries = fresh.entries;
      Alpine.store("atelier").entries = [...fresh.entries, ...this.entries];

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
      this.newEntries += fresh.entries.length;
      this.showNewEntriesPill = true;
    }
  };

  useEffect(() => {
    const timer = setInterval(getAnswer, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AtelierContext.Provider
      value={{ artworks, setArtworks, newArtworks, setNewArtworks }}
    >
      {children}
    </AtelierContext.Provider>
  );
};
