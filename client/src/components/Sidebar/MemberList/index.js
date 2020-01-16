import React from "react";
import styled from "styled-components/macro";
import ListItem from "./ListItem";

const StyledContainer = styled.ul`
  margin: 30px 5px 5px 5px;
`;

//
// Displays a list of users
//
function MemberList({ members }) {
  return (
    <StyledContainer>
      {members &&
        members.map((member, i) => <ListItem key={i} member={member} />)}
    </StyledContainer>
  );
}

export default MemberList;