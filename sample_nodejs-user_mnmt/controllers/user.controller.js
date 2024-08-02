const userServices = require('../services/user.services.js');


const getAllUsers = async (req, res) => {
    try {
    const users = await userServices.getAllUsers();
    res.status(200).json(users);
    }
    catch(err){
        res.status(500).send(err.message);
    }

}
const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
    const user = await userServices.getUserById(id);
    res.status(200).json(user);}
    catch(err){
        res.status(500).send(err.message);
    }
}
const createUser =  async (req, res) => {
    const user = req.body;
    try{
    const newUser = await userServices.createUser(user);
    res.status(201).json(newUser);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}
const updateUser = async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    try {
    const updatedUser = await userServices.updateUser(id, user);
    res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(500).send(err.message);
    }
}
const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
    await userServices.deleteUser(id);
    res.status(204).send("User successfully deleted");
    }
    catch(err){
        res.status(500).send(err.message);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
    
}
