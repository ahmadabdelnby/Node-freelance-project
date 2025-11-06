//ahmed-dev branch

const contract = require('../Models/Contract');

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
// Get all contracts
const getAllContracts = async (req, res) => {
    try {
        const contracts = await contract.find();
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

module.exports = {
    createContract,
    getAllContracts,
    getContractById,
    updateContractById,
    deleteContractById
};