import React from "react";
import Navbar from "./components/Navbar";
import StoryForm from "./components/StoryForm";
import StoryList from "./components/StoryList";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <StoryForm />
        <StoryList />
      </main>
    </>
  );
};

export default App;
