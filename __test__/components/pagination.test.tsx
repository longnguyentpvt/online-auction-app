import React from "react";

import { render, screen } from "@testing-library/react";

import Pagination from "components/pagination";

test("loads and displays", async () => {
  // ARRANGE
  const { container } = render(
    <Pagination
      currentPage={ 1 }
      totalPage={ 10 }
      numberLimit={ 5 } onChangePage={ () => {
    } }/>
  )

})
