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
    setProfileData({
      ...profileData,

      [e.target.name]: e.target.value,
    });
  };

  let handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  let handleImageChange = async (e) => {
    let selectedImage = e.target.files?.[0];

    if (!selectedImage) {
      return;
    }

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
        if (isMounted) {
          setProfileData(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-blue-600">My Profile</h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your account details.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
        <div className="flex items-center gap-5 mb-8">
          <img
            src={profileData.profilePhoto || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {profileData.fullname}
            </h2>

            <p className="text-slate-500 dark:text-slate-400">
              {profileData.email}
            </p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
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
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
          >
            {imageUploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-300">
              Fullname
            </label>

            <input
              type="text"
              name="fullname"
              value={profileData.fullname}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
