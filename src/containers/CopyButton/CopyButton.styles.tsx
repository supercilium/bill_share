import styled from "styled-components";

export const CopyButtonIcon = styled.span<{
  $isMessageVisible: boolean;
}>`
  position: relative;

  &:after {
    content: "Copied!";
    position: absolute;
    display: ${({ $isMessageVisible }) =>
      $isMessageVisible ? "block" : "none"};
    padding: 4px;
    background-color: #000;
    color: #fff;
    left: -24px;
    bottom: -24px;
    border-radius: 4px;
    width: 80px;
  }
`;
