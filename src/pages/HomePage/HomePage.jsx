    import React, { useEffect, useRef, useState } from "react";
    import TypeProduct from "../../components/TypeProduct/TypeProduct";
    import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./Style";
    import SliderComponent from "../../components/SliderComponent/SliderComponent";
    import slider1 from '../../assets/images/720-220-720x220-74.webp'
    import slider2 from '../../assets/images/Redmi-3A-720-220-720x220-3.webp'
    import slider3 from '../../assets/images/SW-Xiaomi-720-220-720x220-1.webp'
    import slider4 from '../../assets/images/sac-AVA-720-220-720x220-1.webp'
    import CardComponent from "../../components/CardComponent/CardComponent";
    import { keepPreviousData, useQuery } from "@tanstack/react-query";
    import * as ProductService from '../../services/ProductService'
    import { useSelector } from "react-redux";
    import Loading from "../../components/LoadingComponent/Loading";
    import { useDebounce } from "../../hooks/useDebounce";

    const HomePage = () => {
        const searchProduct = useSelector((state) => state?.product?.search)
        const searchDebounce = useDebounce(searchProduct, 1000)
        const [limit, setLimit] = useState(6)
        const [pending, setPending] = useState(false)
        const [typeProducts, setTypeProducts] = useState([])

        const fetchProductAll = async (context) => {
            const limit = context?.queryKey && context?.queryKey[1]
            const search =context?.queryKey && context?.queryKey[2]
            const  res = await ProductService.getAllProduct(search, limit)

            return res
        }

        const fetchAllTypeProduct = async () => {
            try {
                const res = await ProductService.getAllTypeProduct();
                if (res?.data && Array.isArray(res.data)) {
                    setTypeProducts(res.data);
                } else {
                    console.error('Invalid type product data:', res.data);
                }
            } catch (error) {
                console.error('Error fetching type products:', error);
            }
        };

        const {isPending, data: products, isPreviousData} = useQuery({
            queryKey: ['products' , limit, searchDebounce],
            queryFn: fetchProductAll,
            retry: 3, 
            retryDelay: 1000,
            placeholderData : keepPreviousData
        }) 

        useEffect(() => {
            fetchAllTypeProduct()
        
        }, [])

        console.log('typeProducts', typeProducts)

        
        return (
            <Loading isPending={isPending || pending}>
                <div style={{width: '1270px', margin:' 0 auto', fontSize :'15px'}}>
                    <WrapperTypeProduct>
                        {typeProducts.map((item) =>{
                            return(
                                <TypeProduct name={item} key = {item}/>
                            )
                        })}        
                    </WrapperTypeProduct>
                </div>
                <div className="body" style={{width: ' 100%', backgroundColor: '#efefef'}}>
                    <div id="contrainer" style={{width:'1270px', margin:'0 auto', height: '1000px'}}>
                        <SliderComponent arrImages = {[slider1,slider2,slider3,slider4]}/>
                        <WrapperProducts>
                            {products?.data?.map((product) =>{
                                return (
                                    <CardComponent key={product._id} countInStock = {product.countInStock} 
                                                    decription={product.decription} image={product.image} name={product.name}
                                                    price={product.price} rating={product.rating} type={product.type}
                                                    selled={product.selled} discount={product.discount} id={product._id}/>
                                )
                            })}
                            
                        </WrapperProducts>
                        <div style={{width: '100%', justifyContent: 'center', display:'flex', marginTop: '10px'}}>
                            <WrapperButtonMore textbutton={isPreviousData ? "Loading more" : "Xem thêm"} type="outline" styleButton={{
                                border: '1px solid rgb(11,116,229)',
                                color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11,116,229)'}`,
                                width: '240px',
                                height: '38px',
                                borderRadius: '4px', 
                                }}
                                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                                styleTextButton={{fontWeight: 500, color: products?.total === products?.data?.length && '#fff   '}}
                                onClick= {() => setLimit((prev) => prev +6 )}
                            />
                        </div>
                    </div>
                </div>
            </Loading>
        )
    }

    export default HomePage