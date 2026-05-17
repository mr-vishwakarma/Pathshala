import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

import api from "../../../../shared/services/api";

const ProfilePage = () => {
  let [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    profilePhoto: "",
  });

  let [loading, setLoading] = useState(false);
  let [imageUploading, setImageUploading] = useState(false);
  let fileInputRef = useRef(null);

  let fetchProfile = async () => {
    let response = await api.get("/profile/me");
    return response.data;
  };

  let handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  let handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  let handleImageChange = async (e) => {
    let selectedImage = e.target.files?.[0];
    if (!selectedImage) return;

    try {
      setImageUploading(true);
      let formData = new FormData();
      formData.append("image", selectedImage);
      let response = await api.post("/profile/upload-photo", formData);
      toast.success(response.data.message);
      let updatedProfile = await fetchProfile();
      setProfileData(updatedProfile);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response = await api.put("/profile/update", profileData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchProfile()
      .then((data) => {
        if (isMounted) setProfileData(data);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--purple)" }}>
          My Profile
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Manage your account details.
        </p>
      </div>

      <div className="card max-w-2xl p-8">
        <div className="flex items-center gap-5 mb-8">
          <img
            src={profileData.profilePhoto || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
            style={{ border: "3px solid var(--purple)" }}
          />

          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {profileData.fullname}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {profileData.email}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleUploadClick}
            disabled={imageUploading}
            className="btn btn-lime"
          >
            {imageUploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={profileData.fullname}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-blue">
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
