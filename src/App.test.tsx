import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

jest.mock("./services/dedicatedWorker.ts", () => ({
  DedicatedWorker: jest.fn(),
}));

test("renders learn react link", async () => {
  render(<App />);
  // eslint-disable-next-line testing-library/prefer-find-by
  await waitFor(() =>
    expect(screen.getByText(/party bill share/i)).toBeInTheDocument()
  );
});
