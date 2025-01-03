import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Css/Pay.css";

const Pay = ({paydescription, settlementHandler }) => {
  
  // console.log("payAmount>>>>>>>>>>>>>>>>>>",paydescription);
  

  return (
    <>
      <div className="scrollable-list">
        {paydescription.map((data, index) => (
          <div className="col-12 col-md-6 mb-3" key={index}>
            <div className="card border-primary shadow-lg fade-in-card">
              <div className="card-body">
                <h6 className="card-title text-info">{data?.username}</h6>
                <p className="card-text">
                  Has to pay{" "}
                  <strong className="text-danger">
                    {Math.round(data?.amount)}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-success">
                    {data?.to}
                    &nbsp;&nbsp;&nbsp;
                    <button
                      style={{ backgroundColor: "#1f5456" }}
                      onClick={() => {
                        settlementHandler(data); 
                      }}
                    >
                      Settle
                    </button>
                  </strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Pay;
