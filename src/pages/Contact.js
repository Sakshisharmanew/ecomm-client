import React from "react";
import "./../styles/Contact.css"
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiMailSend /> : www.help@ecommerceapp.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
      <div className="row">
      {/* <div className="col-12"> */}
<div className="col-6">
      <article className="profile">
	<div className="profile-image">
		<img src="https://assets.codepen.io/285131/neongirl.jpg" />
	</div>
	<h2 className="profile-username" style={{color:"white"}}>Elena Zoldado</h2>
	<small className="profile-user-handle" style={{color:"white"}}>@elena_zoldado</small>
	<div className="profile-actions">
		{/* <button className="btn btn--primary" style={{color:"white"}}>Follow</button>
		<button className="btn btn--icon">
			<i className="ph-export" style={{color:"white"}}><BiMailSend /></i>
		</button>
    <button className="btn btn--icon">
			<i className="ph-export" style={{color:"white"}}><BiMailSend /></i>
		</button>
		<button className="btn btn--icon">
			<i className="ph-dots-three-outline-fill" style={{color:"white"}}><BiMailSend /></i>
		</button> */}
	</div>	
</article>
</div>
<div className="col-6">
      <article className="profile">
	<div className="profile-image">
		<img src="https://assets.codepen.io/285131/neongirl.jpg" />
	</div>
	<h2 className="profile-username" style={{color:"white"}}>Elena Zoldado</h2>
	<small className="profile-user-handle" style={{color:"white"}}>@elena_zoldado</small>
	<div className="profile-actions">
		<button className="btn btn--primary" style={{color:"white"}}>Follow</button>
		<button className="btn btn--icon">
			<i className="ph-export" style={{color:"white"}}><BiMailSend /></i>
		</button>
    <button className="btn btn--icon">
			<i className="ph-export" style={{color:"white"}}><BiMailSend /></i>
		</button>
		<button className="btn btn--icon">
			<i className="ph-dots-three-outline-fill" style={{color:"white"}}><BiMailSend /></i>
		</button>
	</div>	
</article>
</div>
      </div>

      {/* </div> */}
        {/* <div className="col-md-2 d-flex align-items-center justify-
        content-start text-white fs-5 fw-bold bg-success rounded-
        start ms-3 ps-3 pt-3 pe-0 pb-0"> */}
        <div className='text-center div-div' style={{marginTop:"20px"}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officiis obcaecati esse tempore unde ratione, eveniet mollitia,
            perferendis eius temporibus dicta blanditiis doloremque explicabo
            quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
            accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
            commodi illum quidem neque tempora nam.
            <br></br>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officiis obcaecati esse tempore unde ratione, eveniet mollitia,
            perferendis eius temporibus dicta blanditiis doloremque explicabo
            quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
            accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
            commodi illum quidem neque tempora nam.<br></br>

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officiis obcaecati esse tempore unde ratione, eveniet mollitia,
            perferendis eius temporibus dicta blanditiis doloremque explicabo
            quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
            accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
            commodi illum quidem neque tempora nam.<br></br>

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officiis obcaecati esse tempore unde ratione, eveniet mollitia,
            perferendis eius temporibus dicta blanditiis doloremque explicabo
            quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
            accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
            commodi illum quidem neque tempora nam.
            
        </div>
    </Layout>
  );
};

export default Contact;
