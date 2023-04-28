import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./services/dedicatedWorker.ts", () => ({
  DedicatedWorker: jest.fn(),
}));

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/party bill share/i);
  expect(linkElement).toBeInTheDocument();
});
