import React from "react";
import moment from "moment";
import { Table } from "react-bootstrap";
import "./BillPreview.css"

const BillPreview = ({ orders }) => {
  return (
    <div id="bill-preview">
      <header>
        <div className="invoice_hading" style={{ textAlign: "center" }}>
          <h3>Product Invoice</h3>
        </div>
      </header>
      <main>
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="company_details" style={{ textAlign: "left" }}>
            <h2>SAMAN KI DUKAN</h2>
            135, Shiv Chowk, Near Gurudwara,
            <br />
            New Delhi - 110046
            <br />
            <br />
            Email: samankidukan@gmail.com
            <br />
            Phone: +91 8765432198
            <br />
            GSTIN: 27AABHJ1086Q1ZV
          </div>

          <div className="user_details" style={{ textAlign: "right" }}>
            <h2>Customer Details</h2>
            <h6 className="orders-id">orders ID: {orders._id}</h6>
            <br></br>
            <p>Customer Name:{orders?.shipinginfo?.name}</p>
            <p>Customer Phone: {orders?.shipinginfo?.mobile}</p>
            <p>Customer State: {orders?.shipinginfo?.state}</p>
            <p>Customer City: {orders?.shipinginfo?.city}</p>
            <p>Customer Landmark: {orders?.shipinginfo?.landmark}</p>
            <p>Customer PinCode: {orders?.shipinginfo?.pincode}</p>
            <p>Date: {new Date(orders.createdAt).toLocaleDateString()}</p>
          </div>
        </section>
        <hr></hr>
      </main>
      <h4 className="text-center">Products Details</h4>
      <main>
        <section>
          <div
            className="baki_data"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div>
                <strong>Product Name:</strong>
              </div>
              <div>
                <strong>Total Amount:</strong>
              </div>
              <div>
                <strong>Date:</strong>
              </div>
              <div>
                <strong>Quantity:</strong>
              </div>
              <div>
                <strong>Buyer Name:</strong>
              </div>
              <div>
                <strong>Mobile NO:</strong>
              </div>
              <div>
                <strong>State:</strong>
              </div>
              <div>
                <strong>City:</strong>
              </div>
              <div>
                <strong>Landmark:</strong>
              </div>
              <div>
                <strong>Pincode:</strong>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>{orders.products[0].name}</div>
              <div>{orders.totalPrice}</div>
              <div>
                {orders.createdAt
                  ? moment(orders.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                  : "N/A"}
              </div>
              <div>{orders.products.length}</div>
              <div>{orders.shipinginfo.name}</div>
              <div>{orders.shipinginfo.mobile}</div>
              <div>{orders.shipinginfo.state}</div>
              <div>{orders.shipinginfo.city}</div>
              <div>{orders.shipinginfo.landmark}</div>
              <div>{orders.shipinginfo.pincode}</div>
            </div>
          </div>
          <hr></hr>
        </section>
      </main>

      <footer>
        <div id="bill-preview" className="footer-item">
          <img
            src="logo192.png"
            alt="VEEAAR SOFTTECH PVT. LTD."
            style={{ height: 40, width: 40 }}
          />
          <h6 style={{ marginTop: 6 }}>VEEAAR SOFTTECH PVT. LTD.</h6>
          {/* <button className="button-70" onClick={handlePrint}>
            Print Bill
          </button> */}
        </div>
      </footer>
    </div>
  );
};

export default BillPreview;
