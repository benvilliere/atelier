const { createContext, useContext, useEffect, useState } = window.React;

const AtelierContext = createContext();

const useAtelier = () => useContext(AtelierContext);

const STATUS = {
  INITIALIZING: 0,
  INITIALIZED: 1,
};

const AtelierProvider = ({ children }) => {
  const [status, setStatus] = useState(STATUS.INITIALIZING);
  const [artworks, setArtworks] = useState([]);
  const [lastPollingTime, setLastPollingTime] = useState(Date.now());
  const [page, setPage] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const [isFetchingMoreEntries, setIsFetchingMoreEntries] = useState(false);

  async function getArtworks(page = 1, limit = 32, since = 0) {
    return await get(`/artworks?page=${page}&limit=${limit}&since=${since}`);
  }

  useEffect(() => {
    const fetchArtworks = async () => {
      const data = await getArtworks();
      setArtworks(data.artworks);
      setPage(data.page);
      setInitialized(true);
    };

    fetchArtworks();
  }, []);

  const polling = async () => {
    const fresh = await getArtworks(1, 32, lastPollingTime);
    if (fresh.artworks.length > 0) {
      setArtworks([...fresh.artworks, ...artworks]);
      setLastPollingTime(Date.now());
    }
  };

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const timer = setInterval(async () => await polling(), 3000);
    return () => clearInterval(timer);
  }, [status]);

  const infiniteScroll = async () => {
    if (isFetchingMoreEntries) {
      return;
    }

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - window.innerHeight
    ) {
      console.log("Infinite scroll fetch data");
      setIsFetchingMoreEntries(true);
      const more = await getArtworks(page + 1);
      setPage(more.page);
      setArtworks([...artworks, ...more.artworks]);
      setIsFetchingMoreEntries(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", infiniteScroll);
    return () => window.removeEventListener("scroll", infiniteScroll);
  }, [isFetchingMoreEntries]);

  return (
    <AtelierContext.Provider
      value={{
        artworks,
        setArtworks,
        status,
        setStatus,
        polling,
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
};
