import Layout from "../components/Layout";
import Company from "../components/Company";
import { useEffect } from "react";
import { useSession, getSession } from "next-auth/react";

const Home = (props) => {
  const session = useSession();
  useEffect(() => {
    console.log(props);
  }, [props]);

  return (
    <Layout>
      <div className="page">
        <h1>My Blog</h1>
        <main>
          {JSON.stringify(session)}
          {JSON.stringify(props.session)}
          {props.company.map((company) => (
            <div key={company.id} className="company">
              <Company company={company} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/company");
  const company = await res.json();
  return {
    props: { company, session: await getSession(context) },
  };
};

export default Home;
