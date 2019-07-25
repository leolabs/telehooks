import React from "react";
import { graphql } from "gatsby";

const Index = ({ data }) => <div>404, page not found!</div>;

export const query = graphql`
  {
    site {
      siteMetadata {
        version
        commit
        timestamp
      }
    }
  }
`;

export default Index;
