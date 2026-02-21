import React from 'react'

function Loader() {

    const [loading, setLoading] = useState(true);
  return (
    <>
       useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 0.5 second

    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader /> : <MainWebsite />;
    </>
  )
}

export default Loader
