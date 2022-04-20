import React, { useEffect, useState } from "react";
import { FaEllipsisH, FaRegThumbsUp } from "react-icons/fa";
import { useGlobalContext } from "../context";
import axios from "axios";

const Story = ({ _id, name, description, image, likeCount }) => {
  const { storyData, setStoryData, setEditStoryData, storyDataURL } =
    useGlobalContext();
  const [showBtn, setShowBtn] = useState(false);
  const btnRef = React.useRef(null);

  const handleUpdateData = async (id, type = "") => {
    if (type === "like") {
      const newStoryData = storyData.map((story) => {
        if (id === story._id) {
          updateLikeCountDB(story);
        }
        return story;
      });
      setStoryData(newStoryData);
      return;
    }
    // story change
    setEditStoryData(storyData.find((story) => story._id === id));
    setShowBtn(!showBtn);
  };

  const handleDeleteData = async (id) => {
    // delete data from database
    await axios.delete(
      `${storyDataURL}/${id}`,
      storyData.find((story) => story._id !== id)
    );

    // update displayed data
    const newData = storyData.filter((story) => story._id !== id);
    setStoryData(newData);
  };

  const updateLikeCountDB = async (newData) => {
    newData.likeCount += 1;
    const serverURL = `${process.env.REACT_APP_API_URL}/stories/${newData._id}`;
    await axios.patch(serverURL, newData);
  };

  useEffect(() => {
    if (!showBtn) {
      btnRef.current.style.height = "0px";
    } else {
      btnRef.current.style.height = "70px";
    }
  }, [showBtn]);

  return (
    <>
      <div className='story-box'>
        <header className='story-header'>
          <img src={image} alt='Story Cover' className='img story-img' />
          {/* button to show update / delete button */}
          <FaEllipsisH
            className='btn-show-option'
            onClick={() => setShowBtn(!showBtn)}
          />
          {/* hidden update / delete button */}
          <div className='option-links' ref={btnRef}>
            <button
              className='btn-options'
              onClick={() => handleUpdateData(_id)}
            >
              Edit
            </button>
            <button
              className='btn-options'
              onClick={() => handleDeleteData(_id)}
            >
              Delete
            </button>
          </div>
        </header>
        <article className='story-info'>
          {/* display info here */}
          <h5>{name}</h5>
          {/* <h5>Description:</h5> */}
          <p>{description}</p>
        </article>
        <footer className='story-footer'>
          {/* button for like and like count */}
          <button
            className='btn btn-like'
            onClick={() => handleUpdateData(_id, "like")}
          >
            <p className='like-count'>{likeCount}</p>
            <FaRegThumbsUp />
            like
          </button>
        </footer>
      </div>
    </>
  );
};

export default Story;
