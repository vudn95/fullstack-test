import styled from "@emotion/styled";

export const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;

  form {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    width: 100%;

    h2 {
      text-align: center;
    }

    > div {
      margin: 0 0 12px;
    }

    > button {
      margin: 24px 0 0 0;
    }
  }
`;
