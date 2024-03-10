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

  return (
    <AtelierContext.Provider
      value={{ artworks, setArtworks, newArtworks, setNewArtworks }}
    >
      {children}
    </AtelierContext.Provider>
  );
};
