import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: start;
`;

const Wrap = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 20px;
`;

export { Container, Wrap };
