const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Test",
      email: "test@test.com",
      password: "Testingtesting",
    })
    .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
      user: {
        name: "Test",
        email: "test@test.com"
      },
      token: user.tokens[0].token
    })

    // Assert that a password returned a sign hash
    expect(user.password).not.toBe('Testingtesting');

});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

    // Validate if new token (second token in the tokens array) is saved into the db
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login non-existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "yes@gmail.com",
      password: "ikjjsoposlls",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test("Should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401)
})

test("Should delete user account", async () => {
  await request(app)
    .delete("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test("Should not delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/user/me")
    .send()
    .expect(401)
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async () => {
  const response = await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'John'
    })
    .expect(200)

    
    const user = await User.findById(userOneId)
    expect(response.body.name).toBe(user.name)
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Lagos"
    })
    .expect(400)
})
