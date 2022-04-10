import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";

async function publish(id) {
  await fetch(process.env.BASE_URL + `/api/company/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

async function destroy(id) {
  await fetch(process.env.BASE_URL + `/api/company/${id}`, {
    method: "DELETE",
  });
  await Router.push("/");
}

const Company = (props) => {
  const compName = props.name ? props.name : "Unknown company";
  return (
    <Layout>
      <div className="page">
        <h2>{compName}</h2>

        <ReactMarkdown children={props.name} />
        <div className="actions">
          <button onClick={() => destroy(props.id)}>Delete</button>
        </div>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const res = await fetch(
    process.env.BASE_URL + `/api/company/${context.params.id}`
  );
  const data = await res.json();
  return { props: { ...data } };
};

export default Company;
