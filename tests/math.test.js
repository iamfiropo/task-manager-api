const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add,
} = require("../src/math");

test("Should calculate total with tip", () => {
  const total = calculateTip(20, 0.3);
  expect(total).toBe(26);
});

test("Should calculate total with default tip", () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});

test("Should convert 32 F to 0 C", () => {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test("Should convert 0 C to 32 F", () => {
  const temp = celsiusToFahrenheit(0);
  expect(temp).toBe(32);
});

test("Should add two numbers", done => {
  add(20, 10).then(sum => {
    expect(sum).toBe(30)
    done()
  })
})

test("Should add two numbers Async/Await", async () => {
  const sum = await add(3, 4)
  expect(sum).toBe(7);
})
