import React, { useState, useEffect } from "react";
import axios from "axios";
import * as mod from "./../../src/url.js";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const ChatProcess = () => {
  const [user, setUser] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [chatdata, setChatdata] = useState("");
  const Navigate = useNavigate();

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("text", text);
      formDataToSend.append("photo", photo);

      const { data } = await axios.post(
        `${mod.api_url}/api/vi/chatprocess/chatlive`,
        formDataToSend
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success(" created successfully");
      }
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getAllchat = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/vi/chatprocess/getAllchat`
      );

      if (data.success) {
        setChatdata(data.chats);
      }
      console.log("Fetched data:", data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      throw error;
    }
  };
  useEffect(() => {
    getAllchat();
  }, []);

  return (
    <>
      <div>
        <div className="mb-3">
          <label className="btn btn-outline-secondary col-md-12">
            {photo ? photo.name : "Upload photo"}
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              hidden
            />
          </label>
        </div>
        <div className="mb-3">
          {photo && (
            <div className="text-center">
              <img
                src={URL.createObjectURL(photo)}
                alt="Product photo"
                height={"200px"}
                className="img img-responsive"
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Type your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        {chatdata &&
          chatdata?.map((p) => (
            <>
              <div className="card m-2 " style={{ width: "18rem" }}>
                <img
                  src={`${mod.api_url}/api/vi/chatprocess/chatphoto/${p._id}`}
                  className="card-img-top"
                  alt={p.text}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.text}</h5>
                </div>
              </div>
            </>
          ))}
      </div>
    </>
  );
};

export default ChatProcess;
