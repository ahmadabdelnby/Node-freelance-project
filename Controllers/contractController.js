//ahmed-dev branch
const contract = require('../Models/Contract');
const jwt = require('jsonwebtoken');
/****************************************************************************************************/
// Create a new contract
const createContract = async (req, res) => {
    try {
        const { job, client, freelancer, proposal, agreedAmount, budgetType } = req.body;
        const newContract = new contract({
            job,
            client,
            freelancer,
            proposal,
            agreedAmount,
            budgetType
        });
        await newContract.save();
        res.status(201).json(newContract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/****************************************************************************************************/
//Get My contracts
const getMyContracts = async (req, res) => {
    try {
        console.log(req.user);
        const userId = req.user.id;
        //my contracts as a client
        const clientContracts = await contract.find({ client: userId });
        //my contracts as a freelancer
        const freelancerContracts = await contract.find({ freelancer: userId });

        if (clientContracts.length === 0 && freelancerContracts.length === 0) {
            return res.status(404).json({ message: "No contracts found for this user" });
        }

        res.status(200).json({
            clientContracts,
            freelancerContracts
        });
    } catch (err) {
        console.error("Error fetching contracts:", err);
        res.status(500).json({ message: "Server error while fetching contracts" });
    }
}
/****************************************************************************************************/
// Get contract by ID
const getContractById = async (req, res) => {
    try {
        const { id } = req.params;
        const foundContract = await contract.findById(id);
        if (!foundContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.status(200).json(foundContract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/****************************************************************************************************/
// Update contract by ID
const updateContractById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedContract = await contract.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.status(200).json(updatedContract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/****************************************************************************************************/
// Delete contract by ID
const deleteContractById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContract = await contract.findByIdAndDelete(id);
        if (!deletedContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        res.status(200).json({ message: 'Contract deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/****************************************************************************************************/
// Get all contracts for admin dashboard
//note: dahboard is only for a logged in admin, make sure to check the role and the id from token
const getAllContracts = async (req, res) => {
    try {
        const contracts = await contract.find()
        .populate("client", "email")
        .populate("freelancer", "email");
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/****************************************************************************************************/
module.exports = {
    createContract,
    getMyContracts,
    getContractById,
    updateContractById,
    deleteContractById,
    getAllContracts
};