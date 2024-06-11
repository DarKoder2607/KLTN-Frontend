import React from "react";
import {
	Box,
	FooterContainer,
	Row,
	Column,
	FooterLinks,
	Headings,
} from "./Style";

const FooterComponent = () => {
	return (
		<Box>
			<h1
				style={{
					color: "white",
					textAlign: "center",
					marginTop: "10px",
				}}
			>
				CHÀO MỪNG ĐẾN VỚI CỬA HÀNG DH PHONESTORE !
			</h1>
			<FooterContainer>
				<Row>
					<Column>
						<Headings>About Us</Headings>
						<FooterLinks href="#">
							Aim
						</FooterLinks>
						<FooterLinks href="#">
							Vision
						</FooterLinks>
						<FooterLinks href="#">
							Testimonials
						</FooterLinks>
					</Column>
					<Column>
						<Headings>Services</Headings>
						<FooterLinks href="#">
							Writing
						</FooterLinks>
						<FooterLinks href="#">
							Internships
						</FooterLinks>
						<FooterLinks href="#">
							Coding
						</FooterLinks>
						<FooterLinks href="#">
							Teaching
						</FooterLinks>
					</Column>
					<Column>
						<Headings>Contact Us</Headings>
						<FooterLinks href="#">
							Uttar Pradesh
						</FooterLinks>
						<FooterLinks href="#">
							Ahemdabad
						</FooterLinks>
						<FooterLinks href="#">
							Indore
						</FooterLinks>
						<FooterLinks href="#">
							Mumbai
						</FooterLinks>
					</Column>
					<Column>
						<Headings>Social Media</Headings>
						<FooterLinks href="#">
							<i className="fab fa-facebook-f">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Facebook
								</span>
							</i>
						</FooterLinks>
						<FooterLinks href="#">
							<i className="fab fa-instagram">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Instagram
								</span>
							</i>
						</FooterLinks>
						<FooterLinks href="#">
							<i className="fab fa-twitter">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Twitter
								</span>
							</i>
						</FooterLinks>
						<FooterLinks href="#">
							<i className="fab fa-youtube">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Youtube
								</span>
							</i>
						</FooterLinks>
					</Column>
					<Column>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.485398611095!2d106.76933817481913!3d10.850637657820982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1698758138198!5m2!1svi!2s"
						width="470"
						height="280"
						frameBorder="0"
						style={{ border: 0 }}
						allowFullScreen=""
						aria-hidden="false"
						tabIndex="0"
					></iframe>
					</Column>

				
				</Row>
			</FooterContainer>
			
		</Box>
	);
};
export default FooterComponent;
