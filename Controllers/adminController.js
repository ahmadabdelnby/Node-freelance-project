const { MongoClient } = require('mongodb');

const Proposal = require("../Controllers/proposalController");
const Category = require("../Controllers/categoriesController");
const Job = require("../Controllers/jobsController");
const Skill = require("../Controllers/skillsController");
const Speciality = require("../Controllers/specialtyController");
const User = require("../Controllers/userController");
const Contract = require('../Controllers/contractController')
//const Portfolio = require("../controllers/portfolioitemController");

const collectionControllers = {
  proposals: Proposal.getAllProposals,
  categories: Category.getAllCategories,
  jobs: Job.getAllJobs,
  skills: Skill.getAllSkills,
  specialties: Speciality.getAllSpecialties,
  users: User.getAllUsers,
  contracts: Contract.getAllContracts
  //portfolioitems: Portfolio.getAllPortfolioItems
};
const uri = process.env.MONGODB_URI || 'mongodb+srv://ahmadalnajar13_db_user:oqo6QG585Cefq2jQ@freelancing-platform.cuwhemv.mongodb.net/freelancing_platform';
const dbName = 'freelancing_platform';


//get all collections' names
async function getCollections(req, res) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();

    const db = mongoClient.db(dbName);

    // List all collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    res.json(collectionNames);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

//get all Docs in a specific collection
async function getCollectionDocs(req, res) {
  const { collectionName } = req.params;

  const controllerFn = collectionControllers[collectionName];
  if (!controllerFn) {
    return res.status(400).json({ error: 'Unknown collection' });
  }

  // Call the specific controller
  return controllerFn(req, res);
}


module.exports = {
  getCollections,
  getCollectionDocs
};
