export const calculateProfileCompletion = (user, extended = {}) => {
  const fields = [
    user?.name,
    user?.email,
    user?.bio,
    user?.location,
    user?.profileImage,
    user?.skills?.length > 0,
    user?.interests?.length > 0,
    extended?.goals?.length > 0,
    extended?.education,
    extended?.experience,
    extended?.github,
    extended?.linkedin,
    extended?.portfolio,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

export const getSkillMatch = (userSkills = [], targetSkills = []) => {
  if (!userSkills.length || !targetSkills.length) return 0;
  const intersection = userSkills.filter((s) =>
    targetSkills.some((t) => t.toLowerCase() === s.toLowerCase())
  );
  return Math.round(
    (intersection.length / Math.max(userSkills.length, targetSkills.length)) * 100
  );
};

export const getGoalMatch = (userGoals = [], targetGoals = []) => {
  if (!userGoals.length || !targetGoals.length) return 0;
  const intersection = userGoals.filter((g) =>
    targetGoals.some((t) => t.toLowerCase() === g.toLowerCase())
  );
  return Math.round(
    (intersection.length / Math.max(userGoals.length, targetGoals.length)) * 100
  );
};
