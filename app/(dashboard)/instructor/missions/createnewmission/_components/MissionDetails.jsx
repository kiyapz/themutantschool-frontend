import { Editprofilebtn } from "../../../profile/profilesetting/_components/Editprofilebtn";
import { FaVideo, FaCamera, FaImage } from "react-icons/fa";
import Createnewmission from "../page";
import { useState } from "react";
import Sidebuttons from "../../_components/Sidebuttons";

const MockEditprofilebtn = ({ value, onChange, label }) => (
  <div style={{ marginBottom: "20px" }}>
    <label
      style={{ display: "block", marginBottom: "8px" }}
      className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
    >
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      style={{ padding: "10px", width: "100%" }}
      className="rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white"
      placeholder={label}
    />
  </div>
);

const MockSidebuttons = ({ text, width, items, value, onChange }) => (
  <div className={width}>
    <label
      style={{ display: "block", marginBottom: "8px" }}
      className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
    >
      {text}
    </label>
    <select
      value={value}
      onChange={onChange}
      style={{ padding: "10px", width: "100%" }}
      className="rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white"
    >
      <option value="">Select {text}</option>
      {items.map((item, index) => (
        <option key={index} value={item.label}>
          {item.label}
        </option>
      ))}
    </select>
  </div>
);

export default function MissionDetails() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("English (uk)");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [certificateAvailable, setCertificateAvailable] = useState(true);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [coursePurposes, setCoursePurposes] = useState(["", "", "", ""]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCoursePurposeChange = (index, value) => {
    const newPurposes = [...coursePurposes];
    newPurposes[index] = value;
    setCoursePurposes(newPurposes);
  };

  const validateYouTubeLink = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const CreateNewMission = async () => {
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("login-accessToken");

      console.log("Access token:", accessToken ? "Found" : "Not found");

      if (!accessToken) {
        alert("Please login first to create a mission");
        setLoading(false);
        return;
      }

      if (!title.trim()) {
        alert("Mission title is required");
        setLoading(false);
        return;
      }

      if (!description.trim()) {
        alert("Mission description is required");
        setLoading(false);
        return;
      }

      if (!category) {
        alert("Mission category is required");
        setLoading(false);
        return;
      }

      if (!difficulty) {
        alert("Mission difficulty is required");
        setLoading(false);
        return;
      }

      // Validate YouTube link (required)
      if (!youtubeLink.trim()) {
        alert("Course intro video (YouTube link) is required");
        setLoading(false);
        return;
      }

      if (!validateYouTubeLink(youtubeLink)) {
        alert("Please enter a valid YouTube URL");
        setLoading(false);
        return;
      }

      // Validate course purposes (at least one should be filled)
      const validPurposes = coursePurposes.filter(
        (purpose) => purpose.trim() !== ""
      );
      if (validPurposes.length === 0) {
        alert("Please add at least one course purpose");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      // Validate price
      if (!price || isNaN(price) || price <= 0) {
        alert("Please enter a valid price");
        setLoading(false);
        return;
      }

      // Validate estimated duration
      if (
        !estimatedDuration ||
        isNaN(estimatedDuration) ||
        Number(estimatedDuration) <= 0
      ) {
        alert("Please enter a valid duration in hours (greater than 0)");
        setLoading(false);
        return;
      }

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("shortDescription", description.trim());
      formData.append("estimatedDuration", `${estimatedDuration} hours`);
      formData.append("certificateAvailable", certificateAvailable.toString());
      formData.append("price", price);

      if (detailedDescription.trim()) {
        formData.append("bio", detailedDescription.trim());
      }

      formData.append("category", category);
      formData.append("skillLevel", difficulty);
      formData.append("Language", language);

      const tags = [category.toLowerCase(), "mission", "course"];
      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      if (image) {
        formData.append("thumbnail", image);
      }

      if (video) {
        formData.append("video", video);
      }

      // Add YouTube intro video
      if (youtubeLink.trim()) {
        formData.append("video", youtubeLink);
      }

      // Add learning outcomes
      const coursePurposesToSubmit = coursePurposes.filter(
        (purpose) => purpose.trim() !== ""
      );
      if (coursePurposesToSubmit.length > 0) {
        coursePurposesToSubmit.forEach((outcome, index) => {
          formData.append(`learningOutcomes[${index}]`, outcome);
        });
      }

      console.log("FormData contents being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Sending request to create mission...");
      console.log(
        "Request URL:",
        "https://themutantschool-backend.onrender.com/api/mission/create"
      );
      console.log("Request method: POST");
      console.log(
        "Authorization header:",
        `Bearer ${accessToken ? "Present" : "Missing"}`
      );

      const response = await fetch(
        "https://themutantschool-backend.onrender.com/api/mission/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      console.log(response, "Response received from server");

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (response.status === 401) {
        alert("Authentication failed. Please login again.");

        return;
      }

      if (response.status === 403) {
        alert("You do not have permission to create missions.");
        return;
      }

      if (!response.ok) {
        console.log("Error response:", responseText);
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);

        try {
          const errorData = JSON.parse(responseText);
          console.log("Parsed error data:", errorData);
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${responseText}`
          );
        } catch (parseError) {
          console.log("Failed to parse error response as JSON");
          throw new Error(`HTTP ${response.status}: ${responseText}`);
        }
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid response format from server");
      }

      console.log("Mission created successfully:", result);

      localStorage.removeItem("missionId");

      if (result.data && result.data._id) {
        localStorage.setItem("missionId", result.data._id);
      }

      // Reset all form fields
      setTitle("");
      setDescription("");
      setDetailedDescription("");
      setCategory("");
      setDifficulty("");
      setLanguage("English (uk)");
      setEstimatedDuration("");
      setCertificateAvailable(true);
      setPrice("");
      setImage(null);
      setVideo(null);
      setPreviewUrl(null);
      setYoutubeLink("");
      setCoursePurposes(["", "", "", ""]);

      // Clear any file inputs
      const imageInput = document.getElementById("imageInput");
      if (imageInput) {
        imageInput.value = "";
      }

      const videoInput = document.getElementById("videoInput");
      if (videoInput) {
        videoInput.value = "";
      }

      console.log("Form reset completed");

      alert("Mission created successfully!");
    } catch (error) {
      console.log("Error creating mission:", error);

      if (error.message.includes("402")) {
        alert(
          "Network error. Please check your internet connection and try again."
        );
      } else if (error.message.includes("401")) {
        alert("Authentication failed. Please login again.");
      } else if (error.message.includes("403")) {
        alert("You do not have permission to create missions.");
      } else if (error.message.includes("500")) {
        alert("Server error. Please try again later or contact support.");
      } else {
        alert(`Error creating mission: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    const draftData = {
      title,
      description,
      detailedDescription,
      category,
      difficulty,
      language,
    };

    localStorage.setItem("missionDraft", JSON.stringify(draftData));
    alert("Draft saved successfully!");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDetailedDescription("");
    setCategory("");
    setDifficulty("");
    setLanguage("English (uk)");
    setEstimatedDuration("");
    setCertificateAvailable(true);
    setPrice("");
    setImage(null);
    setVideo(null);
    setPreviewUrl(null);
    setYoutubeLink("");
    setCoursePurposes(["", "", "", ""]);

    // Clear file inputs
    const imageInput = document.getElementById("imageInput");
    if (imageInput) {
      imageInput.value = "";
    }

    const videoInput = document.getElementById("videoInput");
    if (videoInput) {
      videoInput.value = "";
    }

    console.log("Form manually reset");
  };

  return (
    <div
      style={{ padding: "30px" }}
      className="w-full bg-[#0F0F0F] h-fit text-white"
    >
      <div className="w-full xl:flex items-center justify-between ">
        <p
          style={{ marginBottom: "30px" }}
          className="font-[600] text-[28px] leading-[150%] "
        >
          Launch New Mission
        </p>
        <div className="flex items-center gap-2">
          <button
            style={{ padding: "0 15px" }}
            className="bg-[#1D132E] text-[#8660C7] font-[600] text-[18px] leading-[40px] cursor-pointer rounded"
            onClick={CreateNewMission}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Mission"}
          </button>
          <button
            style={{ padding: "15px" }}
            className="text-[#604196] font-[600] text-[18px] leading-[40px] "
            onClick={saveDraft}
          >
            Save Draft
          </button>
          <button
            style={{ padding: "15px" }}
            className="text-[#8C8C8C] font-[600] text-[18px] leading-[40px] "
            onClick={resetForm}
          >
            Reset Form
          </button>
        </div>
      </div>

      <hr className="h-[1px] w-full border-[1px] border-[#4D4D4D] " />

      <div>
        <MockEditprofilebtn
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Mission Title"
        />
        <MockEditprofilebtn
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Short Description"
        />
      </div>

      <div>
        <div className="flex flex-col gap-3">
          <label
            htmlFor="bio"
            className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
          >
            Detailed Description
          </label>
          <textarea
            style={{ padding: "10px" }}
            name="bio"
            placeholder="Enter detailed description for your mission..."
            rows={5}
            value={detailedDescription}
            onChange={(e) => setDetailedDescription(e.target.value)}
            className="w-full rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white resize-none"
          ></textarea>
        </div>
      </div>

      {/* YouTube Link Section */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <MockEditprofilebtn
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          label="Course Intro Video (YouTube Link) *"
        />
        <p style={{ color: "#787878", fontSize: "13px", marginTop: "4px" }}>
          Enter a YouTube URL for your course introduction video
        </p>
      </div>

      {/* Course Purposes Section */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <label
          style={{
            color: "#8C8C8C",
            fontWeight: "600",
            fontSize: "13px",
            lineHeight: "40px",
          }}
        >
          Course Purposes (Add up to 4 key purposes) *
        </label>
        <p style={{ color: "#787878", fontSize: "13px", marginBottom: "12px" }}>
          Describe what students will learn or achieve from this course
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {coursePurposes.map((purpose, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span
                style={{
                  color: "#8C8C8C",
                  fontWeight: "600",
                  fontSize: "13px",
                  minWidth: "20px",
                }}
              >
                {index + 1}.
              </span>
              <input
                value={purpose}
                onChange={(e) =>
                  handleCoursePurposeChange(index, e.target.value)
                }
                placeholder={`Enter purpose ${index + 1}...`}
                style={{
                  flex: 1,
                  borderRadius: "6px",
                  backgroundColor: "#1F1F1F",
                  outline: "none",
                  padding: "12px 16px",
                  color: "white",
                  border: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ marginTop: "20px", marginBottom: "20px" }}
        className="w-full grid xl:grid-cols-3 sm:gap-5 "
      >
        <MockSidebuttons
          text="Mission Category"
          width="w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          items={[
            { label: "Technology" },
            { label: "Education" },
            { label: "Health" },
            { label: "Environment" },
            { label: "Social" },
          ]}
        />

        <MockSidebuttons
          text="Difficulty"
          width="w-full"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          items={[
            { label: "Beginner" },
            { label: "Easy" },
            { label: "Medium" },
            { label: "Hard" },
            { label: "Expert" },
          ]}
        />

        <MockSidebuttons
          text="Language"
          width="w-full"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          items={[
            { label: "English (uk)" },
            { label: "English (us)" },
            { label: "Spanish" },
            { label: "French" },
            { label: "German" },
          ]}
        />
      </div>

      <div className="w-full grid xl:grid-cols-3 sm:gap-5 mt-5">
        <div className="w-full">
          <label className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
            Estimated Duration (hours)
          </label>
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              value={estimatedDuration}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (Number(value) > 0 && Number(value) <= 1000)
                ) {
                  setEstimatedDuration(value);
                }
              }}
              style={{ padding: "12px 16px" }}
              className="rounded-[6px] bg-[#1F1F1F] outline-none text-white w-full"
              placeholder="Enter duration in hours"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
            Certificate Available
          </label>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={certificateAvailable}
              onChange={(e) => setCertificateAvailable(e.target.checked)}
              className="w-5 h-5 rounded bg-[#1F1F1F] border-gray-600"
            />
            <span className="ml-2 text-white">Certificate upon completion</span>
          </div>
        </div>

        <MockEditprofilebtn
          value={price}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              setPrice(value);
            }
          }}
          label="Price (USD)"
        />
      </div>

      <div className="w-full grid gap-5  ">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="image"
            className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
          >
            Mission Thumbnail
          </label>

          <div
            className="w-full h-[301.65px] flexcenter flex-col rounded-[22px] bg-[#131313] cursor-pointer border-2 border-dashed border-gray-600 hover:border-gray-400"
            onClick={() => document.getElementById("imageInput").click()}
          >
            {previewUrl ? (
              <div className="w-full h-full relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-[22px]"
                  style={{ objectPosition: "center" }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewUrl(null);
                    setImage(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <p className="text-center">
                  <FaImage size={90} title="Photo/Image Icon" />
                </p>
                <p className="font-[400] text-[17px] leading-[40px] ">
                  Drag and drop Images, or{" "}
                  <span className="text-[#19569C] "> Browse</span>
                </p>
                <p className="text-[#787878] text-[13px]  ">
                  JPEG, PNG (Maximum 1400px * 1600px)
                </p>
              </>
            )}
          </div>

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
