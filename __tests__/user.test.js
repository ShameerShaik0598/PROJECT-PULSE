//require sequelize
const { sequelize } = require("../databse/db.config");
//requite super test
const request = require("supertest");
const app = require("../server");

//import user model
const { User } = require("../databse/models/user.model");

beforeAll(async () => {});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {});

//User API

//testing for registration
test("Testing Registration route", async () => {
  let response = await request(app)
    .post("/user/register")
    .send({ name: "suri", email: "suri@westagilelabs.com", password: "suri" });
  console.log(response.status);
  await User.destroy({
    where: {
      email: "suri@westagilelabs.com",
    },
  });
  expect(response.status).toBe(201);
});

//test for sucessfull login
test("Testing for login with valid credentials", async () => {
  let result = await request(app)
    .post("/user/login")
    .send({ email: "shamir", password: "shamir" });
  //console.log(result.body)
  expect(result.body.token).not.toBe(undefined);
  expect(result.status).toBe(200);
});

//Test for failed login
test("Testing for login with some invalid credentials", async () => {
  let result = await request(app)
    .post("/user/login")
    .send({ email: "shamir", password: "shamir" });
  console.log("  - ", result.body);
  expect(result.body.token).toBe(undefined);
  expect(result.status).toBe(401);
});

// Testing Super admin API

//Get all the users that are registered
test("It should return all users that are registered", async () => {
  let response = await request(app).get("/super-admin/role/users");
  expect(response.status).toBe(200);
});
