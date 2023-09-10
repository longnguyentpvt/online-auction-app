import React, { memo } from "react";
import {
  Col,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import { PaginationProps } from "types/components";

function Pagination(props: PaginationProps): React.ReactElement {

  const {
    totalPage = 0,
    currentPage = 1,
    numberLimit = 5,
    lastIsActive = true,
    firstIsActive = true,
    onChangePage
  } = props;

  const onChangePageNumber = (page: number): void => {
    onChangePage && onChangePage(page);
  };


  let startPoint = 1;
  let endPoint = numberLimit;

  if (numberLimit > totalPage) {
    startPoint = 1;
    endPoint = totalPage;
  } else if (currentPage <= parseInt(String(numberLimit / 2), 10)) {
    startPoint = 1;
    endPoint = numberLimit;
  } else if (currentPage + parseInt(String(numberLimit / 2), 10) <= totalPage) {
    startPoint = currentPage - parseInt(String(numberLimit / 2), 10);
    endPoint = currentPage + parseInt(String(numberLimit / 2), 10);
  } else {
    startPoint = totalPage - (numberLimit - 1);
    endPoint = totalPage;
  }
  startPoint = startPoint === 0 ? 1 : startPoint;
  const points = [];
  for (let i = startPoint; i <= endPoint; i++) {
    points.push(i);
  }

  const firstPageButtonClassName = currentPage <= 1 ? "disabled" : "";
  const lastPageButtonClassName = currentPage >= totalPage ? "disabled" : "";
  const prevPageButtonClassName = currentPage <= 1 ? "disabled" : "";
  const nextPageButtonClassName = currentPage >= totalPage ? "disabled" : "";
  return totalPage > 1 ? (
    <Col
      xxs="12"
      className="mt-3 pb-4">
      <Nav className="pagination justify-content-center">
        { firstIsActive && (
          <NavItem className={ `page-item ${ firstPageButtonClassName }` }>
            <NavLink
              className="page-link first"
              onClick={ (): void => onChangePageNumber(1) }>
              «
            </NavLink>
          </NavItem>
        ) }

        <NavItem className={ `page-item ${ prevPageButtonClassName }` }>
          <NavLink
            className="page-link prev"
            onClick={ (): void => onChangePageNumber(currentPage - 1) }>
            ‹
          </NavLink>
        </NavItem>
        { points.map((i: number) => {
          return (
            <NavItem
              key={ i }
              className={ `page-item ${ currentPage === i && "active" }` }>
              <NavLink
                className="page-link"
                onClick={ (): void => onChangePageNumber(i) }>
                { i }
              </NavLink>
            </NavItem>
          );
        }) }
        <NavItem className={ `page-item ${ nextPageButtonClassName }` }>
          <NavLink
            className="page-link next"
            onClick={ (): void => onChangePageNumber(currentPage + 1) }>
            ›
          </NavLink>
        </NavItem>
        { lastIsActive && (
          <NavItem className={ `page-item ${ lastPageButtonClassName }` }>
            <NavLink
              className="page-link last"
              onClick={ (): void => onChangePageNumber(totalPage) }>
              »
            </NavLink>
          </NavItem>
        ) }
      </Nav>
    </Col>
  ) : (
    <Col
      xxs="12"
      className="mt-2"/>
  );
}

export default memo(Pagination);
