import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../firebase";
import Modal from "./Modal";
import Loading from "./Loading";
import axios from "axios";

const StoryForm = () => {
  const { setStoryData, editStoryData, setEditStoryData } = useGlobalContext();

  const [isUploading, setIsUploading] = useState(false);
  const [tempData, setTempData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [tempImage, setTempImage] = useState({});
  const [showModal, setShowModal] = useState({
    type: "",
    message: "",
    show: false,
  });

  const imageRef = useRef(null);

  const modalData = (type, message, show) => {
    setShowModal({
      type,
      message,
      show,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let buttonState = e.target;

    // validation for submitting story
    if (
      buttonState.textContent === "submit" &&
      (!tempImage?.name || tempData.name === "" || tempData.description === "")
    ) {
      modalData("danger", "All fields are required", true);
      return;
    }

    // validation for updating story
    if (
      buttonState.textContent === "save" &&
      (tempData.name === "" || tempData.description === "")
    ) {
      modalData("danger", "All fields are required", true);
      return;
    }

    // show loading
    setIsUploading(true);

    // updating when image didn't change
    if (!tempImage?.name) {
      const serverURL = `${process.env.REACT_APP_API_URL}/stories/${tempData._id}`;
      const { data } = await axios.patch(serverURL, tempData);
      // display new data
      setStoryData((prev) =>
        prev.map((story) => {
          if (story._id === tempData._id) {
            return tempData;
          }
          return story;
        })
      );
      // clear form
      setIsUploading(false);
      modalData("success", data.msg, true);
      setTempData({ name: "", description: "", image: "" });
      setEditStoryData([]);
      buttonState.innerHTML = "submit";
      return;
    }

    // start uploading
    const fileName = `${tempImage.name}${new Date().getTime()}`;
    const storageRef = ref(storage, `images/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, tempImage);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const uploaded = Math.floor(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // );
      },
      (error) => console.log(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        tempData.image = url;

        try {
          let modalMessage = "";
          //  for creating story
          if (buttonState.textContent === "submit") {
            const serverURL = `${process.env.REACT_APP_API_URL}/stories`;
            const { data } = await axios.post(serverURL, tempData);
            // display new data
            setStoryData((prev) => [...prev, data.newStory]);
            modalMessage = data.msg;
          }
          // for updating story
          if (buttonState.textContent === "save") {
            const serverURL = `${process.env.REACT_APP_API_URL}/stories/${tempData._id}`;
            const { data } = await axios.patch(serverURL, tempData);
            // display new data
            setStoryData((prev) =>
              prev.map((story) => {
                if (story._id === tempData._id) {
                  return tempData;
                }
                return story;
              })
            );
            modalMessage = data.msg;
            setEditStoryData([]);
            buttonState.innerHTML = "submit";
          }
          // clear form
          setIsUploading(false);
          modalData("success", modalMessage, true);
          setTempData({ name: "", description: "", image: "" });
          imageRef.current.value = "";
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  const handleInputChange = ({ currentTarget: input }) => {
    setTempData({ ...tempData, [input.name]: input.value });
  };

  const handleInputImage = (e) => {
    const coverImage = e.target.files[0];
    setTempImage(coverImage);
  };

  // submit form to update form
  useEffect(() => {
    if (editStoryData.length === 0) {
      return;
    }
    setTempData(editStoryData);
  }, [editStoryData]);

  return (
    <form action='' className='form'>
      <div className='form-row'>
        <label htmlFor='name' className='form-label'>
          Nickname
        </label>
        {/* input name */}
        <input
          type='text'
          name='name'
          id='name'
          className='form-input'
          placeholder='Aa'
          value={tempData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className='form-row'>
        <label htmlFor='description' className='form-label'>
          Description
        </label>
        {/* input description */}
        <textarea
          type='text'
          name='description'
          id='description'
          className='form-textarea'
          placeholder='Aa'
          value={tempData.description}
          onChange={handleInputChange}
        />
      </div>
      <div className='form-row'>
        <label htmlFor='image' className='form-label'>
          Cover Image
        </label>
        {/* input image */}
        <input
          ref={imageRef}
          type='file'
          name='image'
          accept='image/*'
          className='form-input'
          onChange={handleInputImage}
        />
      </div>
      {/* button submit */}
      <button
        type='button'
        className='btn btn-block btn-submit'
        onClick={handleSubmit}
      >
        {`${editStoryData.length === 0 ? "submit" : "save"}`}
      </button>
      {showModal.show && (
        <Modal
          type={showModal.type}
          message={showModal.message}
          setShowModal={setShowModal}
        />
      )}
      {isUploading && <Loading />}
    </form>
  );
};

export default StoryForm;
