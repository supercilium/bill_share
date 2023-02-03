import styled from "styled-components";

export const StyledAside = styled.aside<{ $isVisible: boolean }>`
    position: absolute;
    left: 0;
    right: 20%;
    transform: translateX(${({ $isVisible }) => $isVisible ? 0 : "-100%"});
    transition: transform .3s ease .2s;
`