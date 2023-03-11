import styled from "styled-components";

export const StyledPanel = styled.nav`
  display: grid;
  grid-template-rows: 55px repeat(10, 41px) 46px;

  .panel-block:hover {
    background-color: #f5f5f5;
  }
`;

export const PaginationBlock = styled.div`
  grid-row-start: 12;
`;

export const MiddleRow = styled.div`
  grid-row-start: 6;
  border-bottom: none !important;
`;
