import { Editprofilebtn } from "../../../profile/profilesetting/_components/Editprofilebtn";
import { FaVideo, FaCamera, FaImage } from "react-icons/fa";
import Createnewmission from "../page";
import { useState, useEffect } from "react";
import CustomDropdown from "./CustomDropdown";
import Notification from "./Notification";

const MockEditprofilebtn = ({ value, onChange, label, disabled }) => (
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
      disabled={disabled}
      style={{ padding: "10px", width: "100%" }}
      className={`rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      placeholder={label}
    />
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
  const [isFree, setIsFree] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [coursePurposes, setCoursePurposes] = useState(["", "", "", ""]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const draft = localStorage.getItem("missionDraft");
    if (draft) {
      const draftData = JSON.parse(draft);
      setTitle(draftData.title || "");
      setDescription(draftData.description || "");
      setDetailedDescription(draftData.detailedDescription || "");
      setCategory(draftData.category || "");
      setDifficulty(draftData.difficulty || "");
      setLanguage(draftData.language || "English (uk)");
      setEstimatedDuration(draftData.estimatedDuration || "");
      setCertificateAvailable(draftData.certificateAvailable !== false);
      setPrice(draftData.price || "");
      setIsFree(draftData.isFree || false);
      setYoutubeLink(draftData.youtubeLink || "");
      setCoursePurposes(draftData.coursePurposes || ["", "", "", ""]);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      // Clear YouTube link when video file is uploaded
      setYoutubeLink("");
    }
  };

  const handleYouTubeLinkChange = (e) => {
    const link = e.target.value;
    setYoutubeLink(link);
    // Clear video file when YouTube link is entered
    if (link.trim()) {
      setVideo(null);
      setVideoPreviewUrl(null);
      // Clear the file input
      const videoInput = document.getElementById("videoInput");
      if (videoInput) {
        videoInput.value = "";
      }
    }
  };

  const handleCoursePurposeChange = (index, value) => {
    const newPurposes = [...coursePurposes];
    newPurposes[index] = value;
    setCoursePurposes(newPurposes);
  };

  const handleIsFreeChange = (e) => {
    const checked = e.target.checked;
    setIsFree(checked);
    if (checked) {
      setPrice("0");
    }
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

      if (!accessToken) {
        alert("Please login first to create a mission");
        setLoading(false);
        return;
      }

      // --- Validation Checks (remain the same) ---
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
      // Validate: must have either video file OR valid YouTube link (not both)
      if (
        !video &&
        (!youtubeLink.trim() || !validateYouTubeLink(youtubeLink))
      ) {
        alert(
          "Please upload a video file OR provide a valid YouTube intro video link"
        );
        setLoading(false);
        return;
      }
      if (!image) {
        alert("Mission thumbnail is required");
        setLoading(false);
        return;
      }
      const validPurposes = coursePurposes.filter(
        (purpose) => purpose.trim() !== ""
      );
      if (validPurposes.length === 0) {
        alert("Please add at least one course purpose");
        setLoading(false);
        return;
      }
      if (!isFree && (!price || isNaN(price) || price <= 0)) {
        alert("Please enter a valid price");
        setLoading(false);
        return;
      }
      if (
        !estimatedDuration ||
        isNaN(estimatedDuration) ||
        Number(estimatedDuration) <= 0
      ) {
        alert("Please enter a valid duration in hours (greater than 0)");
        setLoading(false);
        return;
      }

      // --- Create FormData for file uploads ---
      const formData = new FormData();

      // Add text fields
      formData.append("title", title.trim());
      formData.append(
        "description",
        detailedDescription.trim() || description.trim()
      );
      formData.append("shortDescription", description.trim());
      formData.append("category", category);
      formData.append("skillLevel", difficulty);
      formData.append("language", language);
      formData.append("price", price || "0");
      formData.append("isFree", isFree.toString());

      // Add learning outcomes as array
      const validOutcomes = coursePurposes.filter((p) => p.trim() !== "");
      validOutcomes.forEach((outcome, index) => {
        formData.append(`learningOutcomes[${index}]`, outcome.trim());
      });

      // Add video file or YouTube link
      if (video) {
        formData.append("video", video);
      } else if (youtubeLink.trim()) {
        formData.append("video", youtubeLink.trim());
      }

      // Add thumbnail image
      if (image) {
        formData.append("thumbnail", image);
      }

      console.log("Sending FormData with files");

      const response = await fetch(
        "https://themutantschool-backend.onrender.com/api/mission/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Don't set Content-Type header - browser will set it with boundary for FormData
          },
          body: formData,
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${responseText}`
          );
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${responseText}`);
        }
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid response format from server");
      }

      console.log("Mission created successfully:", result);

      if (result.data && result.data._id) {
        localStorage.setItem("missionId", result.data._id);
      }

      setNotification({
        message: "Mission created successfully!",
        type: "success",
      });
      resetForm();
    } catch (error) {
      console.error("Error creating mission:", error);
      setNotification({
        message: `Error creating mission: ${error.message}`,
        type: "error",
      });
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
      estimatedDuration,
      certificateAvailable,
      price,
      isFree,
      youtubeLink,
      coursePurposes,
      // Note: Files (video, image) cannot be saved to localStorage
      // They will need to be re-selected when loading the draft
    };

    localStorage.setItem("missionDraft", JSON.stringify(draftData));
    setNotification({
      message: "Draft saved successfully!",
      type: "success",
    });
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
    setIsFree(false);
    setImage(null);
    setPreviewUrl(null);
    setVideo(null);
    setVideoPreviewUrl(null);
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

    localStorage.removeItem("missionDraft");
    console.log("Form manually reset and draft cleared");
  };

  return (
    <div
      style={{ padding: "30px" }}
      className="w-full bg-[#0F0F0F] h-fit text-white"
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
        <CustomDropdown
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
            { label: "Programming" },
          ]}
        />

        <CustomDropdown
          text="Difficulty"
          width="w-full"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          items={[
            { label: "Beginner" },
            { label: "Intermediate" },
            { label: "Advanced" },
          ]}
        />

        <CustomDropdown
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
        <div className="w-full" style={{ marginBottom: "20px" }}>
          <label className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
            Estimated Duration (hours)
          </label>
          <div className="flex items-center h-[50px]">
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

        <div className="w-full" style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", marginBottom: "8px" }}
            className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
          >
            Price (USD)
          </label>
          <div className="relative flex items-center rounded-[6px] bg-[#1F1F1F] h-[50px]">
            <input
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  setPrice(value);
                }
              }}
              disabled={isFree}
              className={`bg-transparent outline-none px-4 py-3 text-white w-full ${
                isFree ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Price (USD)"
            />
            <div className="pr-3 flex items-center">
              <input
                type="checkbox"
                id="isFreeCheckbox"
                checked={isFree}
                onChange={handleIsFreeChange}
                className="w-5 h-5 rounded bg-transparent border-gray-600"
              />
              <label
                htmlFor="isFreeCheckbox"
                className="ml-2 text-white text-sm select-none"
              >
                Free
              </label>
            </div>
          </div>
        </div>

        <div className="w-full" style={{ marginBottom: "20px" }}>
          <label className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
            Certificate Available
          </label>
          <div className="flex items-center h-[50px]">
            <input
              type="checkbox"
              checked={certificateAvailable}
              onChange={(e) => setCertificateAvailable(e.target.checked)}
              className="w-5 h-5 rounded bg-[#1F1F1F] border-gray-600"
            />
            <span className="ml-2 text-white">Certificate upon completion</span>
          </div>
        </div>
      </div>

      {/* Video and Thumbnail Upload Section - Side by Side */}
      <div
        className="w-full grid xl:grid-cols-2 gap-5"
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        {/* Video Upload Section */}
        <div>
          <label
            htmlFor="videoInput"
            className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
          >
            Course Intro Video *
          </label>
          <div
            className={`w-full h-[301.65px] flexcenter flex-col rounded-[22px] bg-[#131313] border-2 border-dashed mt-2 ${
              youtubeLink.trim() && !video
                ? "border-gray-800 opacity-50 cursor-not-allowed"
                : "border-gray-600 hover:border-gray-400 cursor-pointer"
            }`}
            onClick={() => {
              if (!youtubeLink.trim() || video) {
                document.getElementById("videoInput").click();
              }
            }}
          >
            {videoPreviewUrl ? (
              <div className="w-full h-full relative">
                <video
                  src={videoPreviewUrl}
                  controls
                  className="absolute inset-0 w-full h-full object-contain rounded-[22px]"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoPreviewUrl(null);
                    setVideo(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <p className="text-center">
                  <FaVideo size={60} title="Video Icon" />
                </p>
                <p className="font-[400] text-[17px] leading-[40px]">
                  Upload Video File
                </p>
                <p className="text-[#787878] text-[12px] mt-1">
                  (or use YouTube link below)
                </p>
                <p className="text-[#787878] text-[13px]">
                  MP4, MOV, AVI (Maximum 500MB)
                </p>
              </>
            )}
          </div>
          <input
            id="videoInput"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            style={{ display: "none" }}
          />
          <div style={{ marginTop: "12px" }}>
            <p
              style={{
                color: "#8C8C8C",
                fontSize: "13px",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              OR
            </p>
            <MockEditprofilebtn
              value={youtubeLink}
              onChange={handleYouTubeLinkChange}
              label="Enter YouTube Link"
              disabled={!!video}
            />
            <p style={{ color: "#787878", fontSize: "13px", marginTop: "4px" }}>
              {video
                ? "Upload a video file OR enter a YouTube link (not both)"
                : "Enter a YouTube URL instead of uploading a file"}
            </p>
          </div>
        </div>

        {/* Thumbnail Upload Section */}
        <div>
          <label
            htmlFor="imageInput"
            className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
          >
            Mission Thumbnail *
          </label>
          <div
            className="w-full h-[301.65px] flexcenter flex-col rounded-[22px] bg-[#131313] cursor-pointer border-2 border-dashed border-gray-600 hover:border-gray-400 mt-2"
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
