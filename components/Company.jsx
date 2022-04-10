import Router from "next/router";
import ReactMarkdown from "react-markdown";

const Company = ({ company }) => {
  const compName = company.name ? company.name : "Unknown company";
  return (
    <div onClick={() => Router.push("/company/[id]", `/company/${company.id}`)}>
      <h2>{compName}</h2>

      <ReactMarkdown children={compName} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Company;
