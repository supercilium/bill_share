import styled from "styled-components";

export const StyledAside = styled.aside<{ $isVisible: boolean }>`
  z-index: 1;
  position: absolute;
  left: 0;
  top: 3rem;
  transform: translateX(${({ $isVisible }) => ($isVisible ? 0 : "-100%")});
  transition: transform 0.3s ease 0.2s;
`;
