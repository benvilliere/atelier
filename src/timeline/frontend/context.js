const { createContext, useContext, useEffect, useState } = window.React;

const AtelierContext = createContext();

const useAtelier = () => useContext(AtelierContext);

const STATUS = {
  INITIALIZING: 0,
  INITIALIZED: 1,
  POLLING: 2,
};

const AtelierProvider = ({ children }) => {
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

  return (
    <AtelierContext.Provider
      value={{
        artworks,
        setArtworks,
        newArtworks,
        setNewArtworks,
        status,
        setStatus,
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
};
