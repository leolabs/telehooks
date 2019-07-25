import React from "react";
import { graphql } from "gatsby";

const Index = ({ data }) => <div>Hello, this is Telehooks!</div>;

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
