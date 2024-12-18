import axios from "axios";
 
export const getProvinces = async () => {
  try {
    const response = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {},   
      {
        headers: {
          "token": "7d2a53e0-bc7c-11ef-bd59-6a1bcb21a92a",  
        },
      }
    );

    if (response.data && response.data.data) {
        console.log("data city", response.data.data);
      return response.data.data;  
    } else {
      throw new Error("Không có dữ liệu tỉnh thành.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
    throw error;
  }
};
 
export const getDistricts = async (provinceId) => {
  try {
    const response = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      { province_id: provinceId },   
      {
        headers: {
          "token": "7d2a53e0-bc7c-11ef-bd59-6a1bcb21a92a",  
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;  
    } else {
      throw new Error("Không có dữ liệu quận/huyện.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách quận/huyện:", error);
    throw error;
  }
};
 
export const getWards = async (districtId) => {
  try {
    const response = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      { district_id: districtId },  
      {
        headers: {
          "token": "7d2a53e0-bc7c-11ef-bd59-6a1bcb21a92a",  
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;  
    } else {
      throw new Error("Không có dữ liệu xã/phường.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách xã/phường:", error);
    throw error;
  }
};

export const getShippingFee = async (fromDistrictId, toDistrictId, toWardCode, weight) => {
  try {
    const response = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        shop_id: 5530491,
        service_type_id: 2,  //  Standard
        insurance_value: 0,
        coupon: "",           
        to_ward_code: toWardCode,
        to_district_id: toDistrictId,
        from_district_id: fromDistrictId,
        weight: weight,    
        length: 30,          
        width: 30,          
        height: 30,          
      },
      {
        headers: {
          shop_id: 5530491,
          token: "7d2a53e0-bc7c-11ef-bd59-6a1bcb21a92a",
        },
      }
    );
    return response.data.data.total;
  } catch (error) {
    console.error("Lỗi khi lấy phí giao hàng:", error);
    throw error;
  }
};


