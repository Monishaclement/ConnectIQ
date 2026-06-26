import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ProfileCompletionBar from "../components/profile/ProfileCompletionBar";
import { parseTags } from "../utils/formatters";
import { validateUrl } from "../utils/validation";
import "../styles/pages/Profile.css";

export default function EditProfile() {
  const { user, profileExtended, updateProfile } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    bio: user?.bio || "",
    location: user?.location || "",
    skills: user?.skills?.join(", ") || "",
    interests: user?.interests?.join(", ") || "",
    profileImage: user?.profileImage || "",
    goals: profileExtended?.goals?.join(", ") || "",
    education: profileExtended?.education || "",
    experience: profileExtended?.experience || "",
    github: profileExtended?.github || "",
    linkedin: profileExtended?.linkedin || "",
    portfolio: profileExtended?.portfolio || "",
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showError("Image must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, profileImage: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      github: validateUrl(form.github, "GitHub URL"),
      linkedin: validateUrl(form.linkedin, "LinkedIn URL"),
      portfolio: validateUrl(form.portfolio, "Portfolio URL"),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const profileData = {
        bio: form.bio,
        location: form.location,
        skills: parseTags(form.skills),
        interests: parseTags(form.interests),
        profileImage: form.profileImage,
      };
      const extendedData = {
        goals: parseTags(form.goals),
        education: form.education,
        experience: form.experience,
        github: form.github,
        linkedin: form.linkedin,
        portfolio: form.portfolio,
      };
      await updateProfile(profileData, extendedData);
      success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container profile-edit animate-fade-in">
      <div className="page-header">
        <h1>Edit Profile</h1>
        <p>Update your information to improve matches</p>
      </div>

      <ProfileCompletionBar
        user={{ ...user, ...form, skills: parseTags(form.skills), interests: parseTags(form.interests) }}
        extended={{ ...profileExtended, goals: parseTags(form.goals), education: form.education, experience: form.experience, github: form.github, linkedin: form.linkedin, portfolio: form.portfolio }}
      />

      <form className="profile-form card" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Profile Picture</h3>
          <div className="avatar-upload">
            {form.profileImage ? (
              <img src={form.profileImage} alt="Preview" className="avatar-preview" />
            ) : (
              <div className="avatar-placeholder">📷</div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>

        <div className="form-section">
          <h3>Basic Info</h3>
          <Input label="Bio" value={form.bio} onChange={update("bio")} placeholder="Tell us about yourself..." />
          <Input label="Location" value={form.location} onChange={update("location")} placeholder="City, Country" />
        </div>

        <div className="form-section">
          <h3>Skills & Interests</h3>
          <Input label="Skills (comma separated)" value={form.skills} onChange={update("skills")} placeholder="React, Node.js, Python" />
          <Input label="Interests (comma separated)" value={form.interests} onChange={update("interests")} placeholder="AI, Startups, Design" />
          <Input label="Goals (comma separated)" value={form.goals} onChange={update("goals")} placeholder="Find co-founder, Learn ML" />
        </div>

        <div className="form-section">
          <h3>Education & Experience</h3>
          <Input label="Education" value={form.education} onChange={update("education")} placeholder="B.Tech CS, MIT" />
          <Input label="Experience" value={form.experience} onChange={update("experience")} placeholder="Software Engineer at Google" />
        </div>

        <div className="form-section">
          <h3>Social Links</h3>
          <Input label="GitHub" value={form.github} onChange={update("github")} error={errors.github} placeholder="https://github.com/username" />
          <Input label="LinkedIn" value={form.linkedin} onChange={update("linkedin")} error={errors.linkedin} placeholder="https://linkedin.com/in/username" />
          <Input label="Portfolio" value={form.portfolio} onChange={update("portfolio")} error={errors.portfolio} placeholder="https://yourportfolio.com" />
        </div>

        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={() => navigate("/profile")}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Profile</Button>
        </div>
      </form>
    </div>
  );
}
