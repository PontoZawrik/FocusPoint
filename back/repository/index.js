const fs = require("fs").promises;
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");
let data = require("./data.json");

const findUserByUsername = async (username) =>
  data.find((u) => u.username === username);

const findIndexByUsername = async (username) => 
  data.findIndex((u) => u.username === username);

const writeDataToFile = async (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(dataFilePath, jsonData);
};

const getUserData = async (username) => {
  const { passwordHash, ...userData } = await findUserByUsername(username);
  return userData;
};

const getProductById = async (id) => {
  return data.find((product) => +product.id === +id);
};

const addProduct = async (username, task) => {
  const user = await findIndexByUsername(username);
  const tasks = data[user].tasks;

  data[user].tasks.push({ 
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1, 
    ...task 
  });

  await writeDataToFile(data);
};

const deleteProduct = async (username, id) => {
  console.log(id, data);
  const user = await findIndexByUsername(username)

  // const index = user.findIndex((product) => +product.id === +id);
  // if (index === -1) return { success: false };

  data[user].tasks = data[user].tasks.filter((task) => +task.id !== +id);
  await writeDataToFile(data);
  return { success: true };
};



// const bcrypt = require("bcryptjs");
// const saltRounds = 10;

// async function hashPassword(plainPassword) {
//   const salt = await bcrypt.genSalt(saltRounds);
//   const hash = await bcrypt.hash(plainPassword, salt);
//   return hash;
// }

// let users = [];

// const genNew = async () => {
//   users = [
//     {
//       username: "PontoZawrik",
//       passwordHash: await hashPassword("a"),
//       tasks: [
//         {
//           id: 1,
//           name: "Название1",
//           description: "Описание",
//           priority: 1,
//           tags: ["прочитать", "что-либо"]
//         },
//         {
//           id: 2,
//           name: "Название2",
//           description: "Описание",
//           priority: 4,
//           tags: ["прочитать", "что-либо"]
//         },
//         {
//           id: 3,
//           name: "Название3",
//           description: "Описание",
//           priority: 2,
//           tags: ["прочитать", "qwerty"]
//         },
//       ]
//     },
//     {
//       username: "c",
//       passwordHash: await hashPassword("c"),
//       tasks: [
//         {
//           id: 1,
//           name: "Название4",
//           description: "Описание",
//           priority: 3,
//           tags: ["прочитать", "что-либо"]
//         },
//         {
//           id: 2,
//           name: "Название5",
//           description: "Описание",
//           priority: 1,
//           tags: ["прочитать", "что-либо"]
//         },
//         {
//           id: 3,
//           name: "Название6",
//           description: "Описание",
//           priority: 2,
//           tags: ["прочитать", "quack"]
//         },
//       ]
//     },
//   ];

//   writeDataToFile(users)
// };

// genNew();



module.exports = {
  getUserData,
  getProductById,
  addProduct,
  deleteProduct,
  findUserByUsername,
};
