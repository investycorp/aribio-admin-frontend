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
	height: 100vh;
	overflow: auto;
`;

const FormRowWrap = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: start;
	margin-left: 40px;
	gap: 15px;
	width: 70%;
`;

const FormLabel = styled.label`
	margin: 10px 0;
`;

const FormInput = styled.input`
	padding: 5px 10px;
	height: fit-content;
	border-radius: 5px;
	border: 1px solid #d9d9d9;
	width: 100%;
`;

export { Container, Wrap, FormInput, FormLabel, FormRowWrap };
