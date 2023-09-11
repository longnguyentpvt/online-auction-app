import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";

import FixedHeader from "components/fixed-header";

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve: ((value: void | PromiseLike<void>) => void)) =>
    setTimeout(resolve, ms));
};

// mock data to useUserAccount hooks
const name = "Long";
jest.mock('hooks/useUserAccount', () => {
  return () => {
    return [
      {
        id: 1,
        token: "testtoken",
        expiry: "",
        expired: false,
        name,
        balance: 10000
      },
      () => {
      }
    ];
  }
});

describe("Testing Fixed Header Render", () => {
  test("Load Name", async () => {
    // ARRANGE
    const { container } = render(
      <Router>
        <FixedHeader/>
      </Router>
    );

    // wait for lazy load
    await sleep(3000);
    const headerUserNameEl = container.getElementsByClassName("header__user-name");
    expect(headerUserNameEl[0].innerHTML).toBe(name);
  }, 30000);
})

