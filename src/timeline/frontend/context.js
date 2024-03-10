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

  useEffect(() => {
    const fetchArtworks = async () => {
      const data = await getArtworks();
      setArtworks(data.artworks);
      setStatus(STATUS.INITIALIZED);
    };

    fetchArtworks();
  }, []);

  const polling = async () => {
    const fresh = await getArtworks(1, 32, lastPollingTime);
    if (fresh.artworks.length > 0) {
      setArtworks([...newArtworks, ...artworks]);
      setLastPollingTime(Date.now());
    }
  };

  useEffect(() => {
    if (status !== STATUS.INITIALIZED) {
      return;
    }

    const timer = setInterval(async () => await polling(), 3000);
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
