import React, { Fragment, useEffect, useState } from "react";
import NavBarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./Style";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import styled from "styled-components";
import { Input, Slider, Radio, Button } from "antd";

const PageContainer = styled.div`
  width: 100%;
  background: #efefef;
  flex: 1;  
`;

const ContentWrapper = styled.div`
  width: 1270px;
  margin: 0 auto;
  padding: 20px 0;
`;

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    
    page: 0,
    limit: 10,
    total: 1,
  });

  const [filters, setFilters] = useState({
    type: null,
    deviceType: state, // Bắt đầu với deviceType hiện tại
    minPrice: 0,
    maxPrice: 100000000,
    minRating: 0,
    maxRating: 5,
  });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await ProductService.filterProducts(filters, panigate.page, panigate.limit);
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPanigate({ ...panigate, total: res?.totalPage });
    } else {
      setLoading(false);
    } 
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, panigate.page, panigate.limit]);

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onChangePagination = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  
  };


  const fetchProductType = async (deviceType, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductDeviceType(
      deviceType,
      page,
      limit
    );
    if (res?.status === "OK") {
      setLoading(false);
      setProducts(res?.data);
      setPanigate({ ...panigate, total: res?.totalPage });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  };

  console.log(filters.type);

  return (
    <Loading isPending={loading}>
      <PageContainer>
        <ContentWrapper>
          <Row gutter={16}>
            {/* Sidebar: Filter */}
            <Col span={4}>
              <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
                <h3>Bộ lọc sản phẩm</h3>

                {/* Thương hiệu */}
                <NavBarComponent
                  onBrandChange={(value) => onFilterChange("type", value)}
                  selectedBrand={filters.type}
                />

                {/* Giá nhập min/max */}
                <div style={{ marginTop: "20px" }}>
                  <h4>Giá (VNĐ)</h4>
                  <div>
                    <div style={{ display: "flex", gap: "10px" }}> Min:
                      <Input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => onFilterChange("minPrice", e.target.value)}
                        placeholder="Min Price"
                      />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}> Max:
                      <Input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                        placeholder="Max Price"
                      />
                    </div>

                  </div>
                  
                </div>

                {/* Đánh giá */}
                <div style={{ marginTop: "20px" }}>
                  <h4>Đánh giá</h4>
                  <Slider
                    range
                    step={0.5}
                    min={0}
                    max={5}
                    defaultValue={[0, 5]}
                    onChange={(value) => onFilterChange("minRating", value[0])}
                    onAfterChange={(value) => onFilterChange("maxRating", value[1])}
                  />
                </div>

                {/* <Button
                  type="primary"
                  style={{ marginTop: "20px", width: "100%" }}
                  onClick={fetchProducts}
                >
                  Áp dụng bộ lọc
                </Button> */}
              </div>
            </Col>

            {/* Products */}
            <Col span={20}>
              <WrapperProducts>
                {products
                  ?.filter((pro) => {
                    if (searchDebounce === "") {
                      return true;
                    } else {
                      return pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase());
                    }
                  })
                  ?.map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      deviceType={product.deviceType}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))}
              </WrapperProducts>
              <Pagination
                defaultCurrent={panigate.page + 1}
                total={panigate.total * panigate.limit}
                onChange={onChangePagination}
                style={{ textAlign: "center", marginTop: "10px" }}
              />
            </Col>
          </Row>
        </ContentWrapper>
      </PageContainer>
    </Loading>
  );
};

export default TypeProductPage;
