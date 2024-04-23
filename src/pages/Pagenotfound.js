import React from "react";
import { Link } from "react-router-dom";
import Layout from "./../components/Layout/Layout";
import "./../styles/notfound.css";

const Pagenotfound = () => {
  return (
    <Layout title={"go back- page not found"}>
      <div className="pnf">
        <div>
          <section className="page_404">
            <div className="container">
              <div className="row">
                <div className="col-sm-12 ">
                  <div className="col-sm-10 col-sm-offset-1  text-center">
                    <div className="four_zero_four_bg">
                      <h1 className="text-center ">404 ERROR</h1>
                    </div>
                    <div className="contentBox">
                      <h3 className="h2">Something Went Wrong..!</h3>
                      <p>The page Not Available!</p>
                    </div>
                    <Link to="/" className="pnf-btn">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>{" "}
          </section>
          <div className="container"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
