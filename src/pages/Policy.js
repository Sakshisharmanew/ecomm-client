import React from "react";
import Layout from "./../components/Layout/Layout";
import "./../styles/Policy.css";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row polict-data ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>

        <div className="col-12 " style={{ height: "auto" }}>
          Privacy Policy for [Your Company Name] Last updated: [Date] 1.
          Introduction Welcome to [Your Company Name] ("we," "us," or "our").
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your personal information when you visit our website,
          [yourwebsite.com] (the "Site").
          <br />
          2. Information We Collect
          <br />
          2.1 Personal Information When you register for an account, place an
          order, or subscribe to our newsletter, we may collect your name, email
          address, mailing address, phone number, and other information.
          <br />
          2.2 Payment Information
          <br />
          We may collect payment information when you make a purchase, including
          credit/debit card details, billing address, and other relevant
          details. Please note that we use secure third-party payment
          processors, and we do not store your payment information.
          <br />
          2.3 Automatically Collected Information
          <br />
          We may automatically collect certain information about your device,
          browsing actions, and patterns, such as your IP address, browser type,
          and referring/exit pages.
          <br />
          3. How We Use Your Information
          <br />
          We use the information we collect for various purposes, including:
          <br />
          <br />
          Processing and fulfilling orders
          <br />
          Providing customer service
          <br />
          Sending promotional emails and newsletters
          <br />
          Improving our website and services
          <br />
          Conducting research and analysis
          <br />
          4. Disclosure of Your Information
          <br />
          We may share your personal information with third parties, including:
          <br />
          <br />
          Service providers who assist us in operating our website and services
          <br />
          Marketing and advertising partners for promotional purposes
          <br />
          Legal authorities if required by law or to protect our rights
          <br />
          5. Cookies
          <br />
          We use cookies and similar technologies to enhance your experience on
          our website. You can adjust your browser settings to disable cookies,
          but this may affect certain functionalities.
          <br />
          <br />
          6. Your Choices
          <br />
          You have the right to:
          <br />
          <br />
          Review and update your personal information
          <br />
          Opt-out of marketing communications
          <br />
          Request deletion of your account
          <br />
          7. Security
          <br />
          We implement reasonable security measures to protect your personal
          information. However, no method of transmission over the internet or
          electronic storage is completely secure.
          <br />
          <br />
          8. Changes to this Privacy Policy
          <br />
          We may update this Privacy Policy periodically. We will notify you of
          any changes by posting the new Privacy Policy on this page.
          <br />
          <br />
          9. Contact Us
          <br />
          If you have any questions or concerns about this Privacy Policy,
          please contact us at [contact@yourcompany.com].
          <br />
          <br />
          By using our website, you consent to the terms of this Privacy Policy.
          <br />
          <br />
          [Your Company Name]
          <br />
          [Your Address]
          <br />
          [City, State, ZIP]
          <br />
          [Phone]
          <br />
          [Email]
          <br />
          [Website]
          <br />
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
