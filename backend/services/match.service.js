const calculateMatchScore = async (userA, userB) => {
  let score = 0;

  // 1. Skill Match (40 points)
  const skillIntersection = userA.skills.filter((skill) =>
    userB.skills.includes(skill)
  );

  const skillScore =
    (skillIntersection.length /
      Math.max(userA.skills.length, userB.skills.length, 1)) *
    40;

  score += skillScore;

  // 2. Interest Match (10 points)
  const interestIntersection = userA.interests.filter((interest) =>
    userB.interests.includes(interest)
  );

  const interestScore =
    (interestIntersection.length /
      Math.max(userA.interests.length, userB.interests.length, 1)) *
    10;

  score += interestScore;

  // 3. Trust Score (20 points)
  score += (userB.trustScore / 100) * 20;

  return Math.round(score);
};

module.exports = {
  calculateMatchScore,
};