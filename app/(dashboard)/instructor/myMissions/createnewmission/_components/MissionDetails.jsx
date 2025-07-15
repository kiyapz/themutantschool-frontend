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
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Added missing state
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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

      // Enhanced validation
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

      const formData = new FormData();

      // Core required fields
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("shortDescription", description.trim());
      formData.append("estimatedDuration", "24 hours");
      formData.append("certificateAvailable", "true");
      formData.append("price", "50");

      // Optional fields with proper validation
      if (detailedDescription.trim()) {
        formData.append("bio", detailedDescription.trim());
      }

      formData.append("category", category);
      formData.append("skillLevel", difficulty);
      formData.append("Language", language);

      // Add tags as JSON string
      const tags = [category.toLowerCase(), "mission", "course"];
      formData.append("tags", JSON.stringify(tags));

      // File uploads
      if (image) {
        formData.append("thumbnail", image);
      }

      if (video) {
        formData.append("video", video);
      }

      // Debug: Log FormData contents
      console.log("FormData contents being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Sending request to create mission...");

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

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Get response text first to see what we're dealing with
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
        console.error("Error response:", responseText);

        // Try to parse as JSON for better error message
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${responseText}`
          );
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${responseText}`);
        }
      }

      // Parse successful response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText);
        throw new Error("Invalid response format from server");
      }

      console.log("Mission created successfully:", result);

      // Store mission ID if available
      if (result.data && result.data._id) {
        localStorage.setItem("missionId", result.data._id);
      }

      // Clear form after successful submission
      setTitle("");
      setDescription("");
      setDetailedDescription("");
      setCategory("");
      setDifficulty("");
      setLanguage("English (uk)");
      setImage(null);
      setVideo(null);
      setPreviewUrl(null);

      alert("Mission created successfully!");
    } catch (error) {
      console.error("Error creating mission:", error);

      // More specific error handling
      if (error.message.includes("Failed to fetch")) {
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

      <div className="w-full grid gap-5 xl:grid-cols-2 ">
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
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-full object-contain rounded-[22px]"
                />
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
            {/* {image && (
              <p className="text-green-500 text-sm mt-2">
                Selected: {image.name}
              </p>
            )} */}
          </div>

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="video"
            className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
          >
            Mission Promo Video (optional)
          </label>

          <div
            className="w-full h-[301.65px] flexcenter flex-col rounded-[22px] bg-[#131313] cursor-pointer border-2 border-dashed border-gray-600 hover:border-gray-400"
            onClick={() => document.getElementById("videoInput").click()}
          >
            <p className="text-center ">
              <FaVideo size={90} title="Video Icon" />
            </p>
            <p className="font-[400] text-[17px] leading-[40px] ">
              Drag and drop a video, or{" "}
              <span className="text-[#19569C] "> Browse</span>
            </p>
            <p className="text-[#787878] text-[13px]  ">
              MP4 (4:3, 60 seconds)
            </p>
            {video && (
              <p className="text-green-500 text-sm mt-2">
                Selected: {video.name}
              </p>
            )}
          </div>

          <input
            id="videoInput"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
