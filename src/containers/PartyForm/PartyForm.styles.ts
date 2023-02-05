import styled from "styled-components";

export const DeleteButton = styled.div`
    height: 2.5rem;
    display: flex;
    align-items: center;
`

export const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    & > input {
        width: 1.5rem;
        height: 1.5rem;
    }
`

export const UserColumnTitle = styled.div<{ hasIcon: boolean }>`
    position: relative;

    & > i {
        position: absolute;
        top: -45%;
        left: 0;
    }
`