import React, { useEffect, useState } from "react";
import axios from "axios";

export const AppContext = React.createContext();

const storyDataURL = `${process.env.REACT_APP_API_URL}/stories`;

export const AppProvider = ({ children }) => {
  const [storyData, setStoryData] = useState([]);
  const [editStoryData, setEditStoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const { data } = await axios(url);
      setStoryData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(storyDataURL);
  }, []);

  return (
    <AppContext.Provider
      value={{
        storyData,
        setStoryData,
        isLoading,
        editStoryData,
        setEditStoryData,
        storyDataURL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};
