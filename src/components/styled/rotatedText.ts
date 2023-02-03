import styled from "styled-components";

export const RotatedText = styled.span<{ isRotated?: boolean }>`
  ${({ isRotated }) => isRotated ? 'transform: rotate(-42deg)' : ''};
`;
