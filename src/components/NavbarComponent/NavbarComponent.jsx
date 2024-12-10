import React, { useEffect, useState } from "react";
import { WrapperContent, WrapperLableText } from "./Style";
import * as ProductService from "../../services/ProductService";
import { Radio } from "antd";

const NavBarComponent = ({ onBrandChange, selectedBrand }) => {
  const [typeProducts, setTypeProducts] = useState([]);

  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductService.getAllTypeProduct();
      if (res?.data && Array.isArray(res.data)) {
        setTypeProducts(res.data);
      } else {
        console.error("Invalid type product data:", res.data);
      }
    } catch (error) {
      console.error("Error fetching type products:", error);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  return (
    <div>
      <WrapperLableText>Thương hiệu</WrapperLableText>
      <WrapperContent>
        <Radio.Group
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          onChange={(e) => onBrandChange(e.target.value)}
          value={selectedBrand}
        >
          {typeProducts.map((type) => (
            <Radio key={type} value={type}>
              {type}
            </Radio>
          ))}
          <Radio value='all'>Tất cả</Radio>
        </Radio.Group>
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;
