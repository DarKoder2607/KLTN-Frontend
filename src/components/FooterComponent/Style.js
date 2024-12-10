import styled from "styled-components";

export const Box = styled.div`
	padding: 40px 10px;
	background: #f4f4f4;
	bottom: 0;
	width: 100%;
	border-top: 1px solid #ddd;
	background: rgb(243, 156, 18);
	margin-top: auto; 
`;

export const FooterContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	text-align: left;
	margin: 20px 40px;
	flex: 1;
`;

export const Row = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	width: 100%;
`;

export const FooterLinks = styled.a`
	color: #333;
	margin-bottom: 12px;
	font-size: 16px;
	text-decoration: none;
	&:hover {
		color: white;
	}
`;

export const SocialIcons = styled.a`
	color: #333;
	font-size: 20px;
	margin-right: 15px;
	transition: color 0.3s;

	&:hover {
		color: #f39c12;
	}
`;

export const Headings = styled.h3`
	font-size: 20px;
	color: #333;
	margin-bottom: 15px;
	font-weight: 600;
`;

export const FooterText = styled.p`
	font-size: 14px;
	color: #777;
	margin-bottom: 10px;
	text-align: left;
`;

