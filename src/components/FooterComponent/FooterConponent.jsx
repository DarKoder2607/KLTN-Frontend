import React from "react";
import {
	Box,
	FooterContainer,
	Row,
	Column,
	FooterLinks,
	Headings,
	SocialIcons,
	FooterText,
} from "./Style";

const FooterComponent = () => {
	return (
		<Box>
			<FooterContainer>
				<Row>
					<Column>
						<Headings>Về chúng tôi</Headings>
						<FooterLinks href="#">Giới thiệu</FooterLinks>
						<FooterLinks href="#">Chính sách bảo mật</FooterLinks>
						<FooterLinks href="#">Điều khoản sử dụng</FooterLinks>
					</Column>

					<Column>
						<Headings>Sản phẩm</Headings>
						<FooterLinks href="#">Điện thoại</FooterLinks>
						<FooterLinks href="#">Laptop</FooterLinks>
						<FooterLinks href="#">Phụ kiện</FooterLinks>
						<FooterLinks href="#">Khuyến mãi</FooterLinks>
					</Column>

					<Column>
						<Headings>Hỗ trợ khách hàng</Headings>
						<FooterLinks href="#">Hướng dẫn mua hàng</FooterLinks>
						<FooterLinks href="#">Chính sách đổi trả</FooterLinks>
						<FooterLinks href="#">Bảo hành</FooterLinks>
						<FooterLinks href="#">Liên hệ</FooterLinks>
					</Column>

					<Column>
						<Headings>Kết nối với chúng tôi</Headings>
						<SocialIcons href="#">
							<i className="fab fa-facebook-f"></i>
						</SocialIcons>
						<SocialIcons href="#">
							<i className="fab fa-instagram"></i>
						</SocialIcons>
						<SocialIcons href="#">
							<i className="fab fa-twitter"></i>
						</SocialIcons>
						<SocialIcons href="#">
							<i className="fab fa-youtube"></i>
						</SocialIcons>
					</Column>

					<Column>
						<Headings>Địa chỉ</Headings>
						<FooterText>Điện thoại: (123) 456-7890</FooterText>
						<FooterText>Email: support@dhphonestore.com</FooterText>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.485398611095!2d106.76933817481913!3d10.850637657820982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1698758138198!5m2!1svi!2s"
							width="100%"
							height="200"
							frameBorder="0"
							style={{ border: 0 }}
							allowFullScreen=""
							aria-hidden="false"
							tabIndex="0"
						></iframe>
					</Column>
				</Row>
			</FooterContainer>
			<FooterText style={{ textAlign: "center", marginTop: "20px" , color: "white"}}>
				© 2024 DH PhoneStore. All Rights Reserved.
			</FooterText>
		</Box>
	);
};

export default FooterComponent;
