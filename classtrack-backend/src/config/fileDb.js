const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");

const databaseFileName = process.env.NODE_ENV === "test"
  ? "test-database.json"
  : "database.json";
const databasePath = path.join(__dirname, "../../data", databaseFileName);

const defaultData = {
  users: [],
  students: [],
  classes: [],
  attendance: []
};

const ensureDatabaseFile = () => {
  const dataDirectory = path.dirname(databasePath);

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  if (!fs.existsSync(databasePath)) {
    writeDB(defaultData);
  }
};

const ensureAdminUser = (parsedData) => {
  let modified = false;
  if (!Array.isArray(parsedData.users)) {
    parsedData.users = [];
    modified = true;
  }

  const adminEmail = "admin@classtrack.com";
  let admin = parsedData.users.find(
    (u) => u.email && u.email.toLowerCase() === adminEmail.toLowerCase()
  );

  if (!admin) {
    admin = {
      id: randomUUID(),
      fullName: "Admin User",
      email: adminEmail,
      password: bcrypt.hashSync("admin123", 10),
      role: "admin",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    parsedData.users.push(admin);
    modified = true;
  } else {
    let isValid = false;
    try {
      isValid = bcrypt.compareSync("admin123", admin.password);
    } catch (e) {
      isValid = false;
    }
    if (!isValid) {
      admin.password = bcrypt.hashSync("admin123", 10);
      admin.updatedAt = new Date().toISOString();
      modified = true;
    }
  }

  return modified;
};

const readDB = () => {
  ensureDatabaseFile();

  const fileData = fs.readFileSync(databasePath, "utf-8");
  const parsedData = JSON.parse(fileData);
  let shouldSave = false;

  Object.keys(defaultData).forEach((collectionName) => {
    if (!Array.isArray(parsedData[collectionName])) {
      parsedData[collectionName] = [];
      shouldSave = true;
    }
  });

  if (ensureAdminUser(parsedData)) {
    shouldSave = true;
  }

  if (shouldSave) {
    writeDB(parsedData);
  }

  return parsedData;
};

const writeDB = (data) => {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
  if (process.env.NODE_ENV !== "test") {
    const altPath = path.join(__dirname, "../../data", "db.json");
    try {
      fs.writeFileSync(altPath, JSON.stringify(data, null, 2));
    } catch (e) {
      // ignore
    }
  }
};

const findAll = (collectionName) => {
  const db = readDB();
  return db[collectionName] || [];
};

const findById = (collectionName, id) => {
  const collection = findAll(collectionName);
  return collection.find((item) => item.id === id) || null;
};

const insertOne = (collectionName, document) => {
  const db = readDB();

  if (!db[collectionName]) {
    db[collectionName] = [];
  }

  const newDocument = {
    ...document,
    id: document.id || randomUUID()
  };

  db[collectionName].push(newDocument);
  writeDB(db);

  return newDocument;
};

const updateById = (collectionName, id, updates) => {
  const db = readDB();
  const collection = db[collectionName] || [];
  const documentIndex = collection.findIndex((item) => item.id === id);

  if (documentIndex === -1) {
    return null;
  }

  collection[documentIndex] = {
    ...collection[documentIndex],
    ...updates,
    id
  };

  db[collectionName] = collection;
  writeDB(db);

  return collection[documentIndex];
};

const deleteById = (collectionName, id) => {
  const db = readDB();
  const collection = db[collectionName] || [];
  const documentToDelete = collection.find((item) => item.id === id);

  if (!documentToDelete) {
    return null;
  }

  db[collectionName] = collection.filter((item) => item.id !== id);
  writeDB(db);

  return documentToDelete;
};

module.exports = {
  readDB,
  writeDB,
  findAll,
  findById,
  insertOne,
  updateById,
  deleteById
};
