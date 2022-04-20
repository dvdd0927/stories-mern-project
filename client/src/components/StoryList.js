import React from "react";
import { useGlobalContext } from "../context";
import Story from "./Story";
import Loading from "./Loading";

const StoryList = () => {
  const { storyData, isLoading } = useGlobalContext();
  if (isLoading) {
    return <Loading />;
  }
  if (storyData.length === 0) {
    return <h4 className='empty-data-title'>No currently posted story</h4>;
  }
  return (
    <section className='story-container'>
      <header>
        <h4>stories</h4>
      </header>
      <div className='story-list'>
        {storyData.map((story) => {
          return <Story key={story._id} {...story} />;
        })}
      </div>
    </section>
  );
};

export default StoryList;
