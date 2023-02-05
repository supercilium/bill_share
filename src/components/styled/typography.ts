import styled from "styled-components";

export const RotatedText = styled.span<{ isRotated?: boolean }>`
  ${({ isRotated }) => isRotated ? 'transform: rotate(-42deg)' : ''};
`;

export const OverflowHidden = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
  max-width: 100%;
`;