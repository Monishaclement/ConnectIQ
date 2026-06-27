const Intent = require("../models/Intent");

const userSelect = "name profileImage skills interests location trustScore riskScore";

const getIntentQuery = (req) => {
  const query = {};

  if (req.query.mine === "true") {
    query.user = req.user.id;
  } else if (req.query.mine !== "all") {
    query.isActive = true;
  }

  if (req.query.category) {
    query.type = req.query.category;
  }

  if (req.query.search) {
    const search = req.query.search.trim();
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { requiredSkills: { $regex: search, $options: "i" } },
    ];
  }

  return query;
};

const getIntents = async (req, res) => {
  try {
    const intents = await Intent.find(getIntentQuery(req))
      .populate("user", userSelect)
      .sort({ createdAt: -1 });

    res.status(200).json(intents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIntentById = async (req, res) => {
  try {
    const intent = await Intent.findById(req.params.id).populate("user", userSelect);

    if (!intent) {
      return res.status(404).json({ message: "Intent not found" });
    }

    res.status(200).json(intent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIntent = async (req, res) => {
  try {
    const { type, title, description, requiredSkills } = req.body;

    if (!type || !title?.trim()) {
      return res.status(400).json({ message: "Category and title are required" });
    }

    const intent = await Intent.create({
      user: req.user.id,
      type,
      title: title.trim(),
      description: description?.trim() || "",
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
    });

    await intent.populate("user", userSelect);

    res.status(201).json(intent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIntent = async (req, res) => {
  try {
    const allowedFields = ["type", "title", "description", "requiredSkills", "isActive"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        return res.status(400).json({ message: "Title is required" });
      }
      updates.title = updates.title.trim();
    }

    const intent = await Intent.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    ).populate("user", userSelect);

    if (!intent) {
      return res.status(404).json({ message: "Intent not found" });
    }

    res.status(200).json(intent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteIntent = async (req, res) => {
  try {
    const intent = await Intent.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!intent) {
      return res.status(404).json({ message: "Intent not found" });
    }

    res.status(200).json({ message: "Intent deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIntents,
  getIntentById,
  createIntent,
  updateIntent,
  deleteIntent,
};
