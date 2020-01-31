import React from "react";
import styled from "styled-components/macro";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { orchestraDocument } from "../../../config/documents";
import DeleteOrchestraForm from "../../../components/_forms/DeleteOrchestraForm";
import PrimaryForm from "../../../components/_miscellaneous/PrimaryForm";

const StyledContainer = styled.div`
  background: white;
  padding: 10px;
`;

function OrchestraDeleteView() {
  const params = useParams();
  const { data } = useQuery(orchestraDocument, {
    variables: { orchestraId: params.id }
  });

  return (
    <StyledContainer>
      {data && (
        <PrimaryForm title="Delete Orchestra">
          <p>
            Confirm by entering the name of the orchestra you want to delete
          </p>
          <DeleteOrchestraForm orchestra={data.orchestraById} />
        </PrimaryForm>
      )}
    </StyledContainer>
  );
}

export default OrchestraDeleteView;
