const Skill = require('../Models/Skills');
const Specialty = require('../Models/Specialties');

// Create a new skill
// const createSkill = async (req, res) => {
//     try {
//         const { name, specialty } = req.body;
//         const existingSkill = await skill.findOne({ name });
//         if (existingSkill) {
//             return res.status(400).json({ message: 'Skill already exists' });
//         }

//         const newSkill = new skill({
//             name,
//             specialty
//         });

//         await newSkill.save();
//         res.status(201).json({ message: 'Skill created successfully', skill: newSkill });
//     } catch (error) {
//         console.error('Error creating skill:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

const createSkill = async (req, res) => {
  try {
    const { name, specialty } = req.body;

    // Basic validation
    if (!name || !specialty) {
      return res.status(400).json({ message: "Skill name and specialty are required." });
    }

    // Normalize name (trim, collapse spaces, lowercase)
    const cleanName = name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

    // Check if specialty exists
    const specialtyExists = await Specialty.findById(specialty);
    if (!specialtyExists) {
      return res.status(404).json({ message: "Specialty not found." });
    }

    // Case-insensitive unique check
    const existingSkill = await Skill.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, "i") }
    });

    if (existingSkill) {
      return res.status(409).json({ message: "Skill already exists." });
    }

    // Create the new skill
    const newSkill = new Skill({
      name: cleanName,
      specialty
    });

    await newSkill.save();

    res.status(201).json({
      message: "Skill created successfully.",
      skill:newSkill
    });

  } catch (err) {
    console.error("Error creating skill:", err);
    res.status(500).json({ message: "Server error. Could not create skill." });
  }
};

//get skill by id
const getSkillById = async (req, res) => {
    try {
        const skillId = req.params.id;
        const foundSkill = await skill.findById(skillId).populate('specialty', 'name description');
        if (!foundSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(foundSkill);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//update skill by id
const updateSkillById = async (req, res) => {
    try {
        const skillId = req.params.id;
        const { name, specialty } = req.body;
        const updatedSkill = await skill.findByIdAndUpdate(skillId, { name, specialty }, { new: true });
        if (!updatedSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json({ message: 'Skill updated successfully', skill: updatedSkill });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//delete skill by id
const deleteSkillById = async (req, res) => {
    try {
        const skillId = req.params.id;
        const deletedSkill = await skill.findByIdAndDelete(skillId);
        if (!deletedSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//get all skills for admin dashboard
const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find().populate('specialty', 'name description');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSkill,
    getSkillById,
    updateSkillById,
    deleteSkillById,
    getAllSkills
};
