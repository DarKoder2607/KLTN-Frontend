    import React, { useEffect, useRef, useState } from "react";
    import TypeProduct from "../../components/TypeProduct/TypeProduct";
    import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct , BlinkTitle, WrapperProducts2} from "./Style";
    import SliderComponent from "../../components/SliderComponent/SliderComponent";
    import slider1 from '../../assets/images/banner0.gif'
    import slider2 from '../../assets/images/banner1.png'
    import slider3 from '../../assets/images/banner2.png'
    import slider4 from '../../assets/images/banner3.png'
    import slider5 from '../../assets/images/banner4.png'
    import slider6 from '../../assets/images/banner5.png'
    import slider7 from '../../assets/images/banner6.png'
    import slider8 from '../../assets/images/banner7.png'
    import slider9 from '../../assets/images/banner8.png'
    import slider10 from '../../assets/images/banner9.png'
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
        const [page, setPage] = useState(0);
        const [pending, setPending] = useState(false)
        const [typeProducts, setTypeProducts] = useState([])
        

        const fetchTopSelledProducts = async () => {
            const res = await ProductService.getTopSelledProducts(6);  
            return res;
        };

        const { data: topSelledProducts, isLoading: topSelledLoading } = useQuery({
            queryKey: ['topSelledProducts'],
            queryFn: fetchTopSelledProducts,
            retry: 3,
            retryDelay: 1000,
        });

        const [deviceTypeProducts, setDeviceTypeProducts] = useState({
            phone: [],
            watch: [],
            laptop: [],
            tablet: [],
            headphone: [],
            loudspeaker: []
        });
    
        const [productTypeLimit, setProductTypeLimit] = useState({
            phone: 6,
            watch: 6,
            laptop: 6,
            tablet: 6,
            headphone: 6,
            loudspeaker: 6
        });

        const fetchProductsByDeviceType = async (deviceType, limit) => {
            const res = await ProductService.getProductByDeviceType(deviceType, limit, 0); // 0 for page 1 (you can add pagination if needed)
            return res;
        };
        const { data: phoneProducts, isLoading: phoneLoading } = useQuery({
            queryKey: ['phone', productTypeLimit.phone],
            queryFn: () => fetchProductsByDeviceType('phone', productTypeLimit.phone),
        });
        
        const { data: watchProducts, isLoading: watchLoading } = useQuery({
            queryKey: ['watch', productTypeLimit.watch],
            queryFn: () => fetchProductsByDeviceType('watch', productTypeLimit.watch),
        });
        
        const { data: laptopProducts, isLoading: laptopLoading } = useQuery({
            queryKey: ['laptop', productTypeLimit.laptop],
            queryFn: () => fetchProductsByDeviceType('laptop', productTypeLimit.laptop),
        });
        
        const { data: tabletProducts, isLoading: tabletLoading } = useQuery({
            queryKey: ['tablet', productTypeLimit.tablet],
            queryFn: () => fetchProductsByDeviceType('tablet', productTypeLimit.tablet),
        });
        
        const { data: headphoneProducts, isLoading: headphoneLoading } = useQuery({
            queryKey: ['headphone', productTypeLimit.headphone],
            queryFn: () => fetchProductsByDeviceType('headphone', productTypeLimit.headphone),
        });
        
        const { data: loudspeakerProducts, isLoading: loudspeakerLoading } = useQuery({
            queryKey: ['loudspeaker', productTypeLimit.loudspeaker],
            queryFn: () => fetchProductsByDeviceType('loudspeaker', productTypeLimit.loudspeaker),
        });
        useEffect(() => {
            setDeviceTypeProducts({
                phone: phoneProducts?.data || [],
                watch: watchProducts?.data || [],
                laptop: laptopProducts?.data || [],
                tablet: tabletProducts?.data || [],
                headphone: headphoneProducts?.data || [],
                loudspeaker: loudspeakerProducts?.data || []
            });
        }, [phoneProducts, watchProducts, laptopProducts, tabletProducts, headphoneProducts, loudspeakerProducts]);

        const handleLoadMore = (deviceType) => {
            setProductTypeLimit((prev) => ({
                ...prev,
                [deviceType]: prev[deviceType] + 6
            }));
        };
        
        const fetchProductAll = async (context) => {
            const limit = context?.queryKey && context?.queryKey[1]
            const page = context?.queryKey && context?.queryKey[2]
            const search = context?.queryKey && context?.queryKey[3]
            const res = await ProductService.getAllProduct(search, limit, page) // thêm page vào hàm gọi API
            return res
        }

        const fetchAllTypeProduct = async () => {
            try {
                const res = await ProductService.getAllDeviceTypeProduct();
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
            queryKey: ['products', limit, page, searchDebounce],  
            queryFn: fetchProductAll,
            keepPreviousData: true,  
            retry: 3, 
            retryDelay: 1000,
        })

        useEffect(() => {
            fetchAllTypeProduct()
        
        }, [])

        console.log('typeProducts', typeProducts)

        
        return (
            <Loading isPending={isPending || pending}>
                <div style={{width: '1270px', margin:' 0 auto', fontSize :'24px'}}>
                    <WrapperTypeProduct>
                        {typeProducts.map((item) =>{
                            return(
                                <TypeProduct name={item} key = {item}/>
                            )
                        })}        
                    </WrapperTypeProduct>
                </div>
                <div className="body" style={{width: ' 100%', backgroundColor: '#efefef'}}>
                    <div id="contrainer" style={{width:'1330px', margin:'0 auto' }}>
                        <SliderComponent arrImages = {[slider1, slider2, slider3, slider4, 
                                    slider5, slider6, slider7, slider8, slider9, slider10]}/>
                        <div style={{
                            backgroundColor: '#ffc04d', 
                            padding: '10px', 
                            borderRadius: '8px', 
                            margin: '20px 0' }}>
                            <h2 style={{fontSize: '25px', fontWeight: 'bold', margin: '5px 0' }}>TẤT CẢ SẢN PHẨM</h2>
                            <div style={{ 
                                borderTop: '2px solid #000', 
                                margin: '0px 0', 
                                width: '50%' 
                                }} />
                            <WrapperProducts style={{ backgroundColor: '#2980B9', padding: '20px', borderRadius: '8px'} } >
                                {products?.data && products?.data.map((product, index) =>{
                                    return (
                                        <CardComponent key={product._id} countInStock = {product.countInStock} 
                                                        decription={product.decription} image={product.image} name={product.name}
                                                        price={product.price} rating={product.rating} type={product.type}  
                                                        deviceType={product.deviceType}
                                                        selled={product.selled} discount={product.discount} id={product._id}/>
                                    )
                                })}
                                
                            </WrapperProducts>
                            
                            <div style={{width: '100%', justifyContent: 'center', display:'flex', marginTop: '20px', marginBottom : '10px'}}>
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
                        <div style={{
                            backgroundColor: '#ffc04d', 
                            padding: '10px', 
                            borderRadius: '8px', 
                            margin: '20px 0' }}>
                        
                            <BlinkTitle>SẢN PHẨM BÁN CHẠY</BlinkTitle>
                            <div style={{ 
                                borderTop: '2px solid #000', 
                                margin: '0px 0', 
                                width: '50%' 
                                }} />
                            <WrapperProducts2 style={{ backgroundColor: 'red', padding: '20px', borderRadius: '8px' }}>
                                {topSelledProducts?.data?.map((product) => (
                                    <CardComponent
                                        key={product._id}
                                        countInStock={product.countInStock}
                                        decription={product.decription}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                        rating={product.rating}
                                        type={product.type}
                                        deviceType={product.deviceType}
                                        selled={product.selled}
                                        discount={product.discount}
                                        id={product._id}
                                    />
                                ))}
                            </WrapperProducts2>
                        </div>
                            {['phone', 'watch', 'laptop', 'tablet', 'headphone', 'loudspeaker'].map((deviceType) => (
                            <div style={{
                                backgroundColor: '#ffc04d', 
                                padding: '10px', 
                                borderRadius: '8px', 
                                margin: '20px 0' }} key={deviceType} >  
                                <h2 style={{fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }}>
                                        {deviceType === 'phone' ? 'ĐIỆN THOẠI DI ĐỘNG'  :''}
                                        {deviceType === 'watch' ? 'ĐỒNG HỒ ĐEO TAY'  :''}
                                        {deviceType === 'headphone' ? 'TAI NGHE'  :''}
                                        {deviceType === 'loudspeaker' ? 'LOA ĐIỆN TỬ'  :''}
                                        {deviceType === 'laptop' ? 'MÁY TÍNH XÁCH TAY'  :''}
                                        {deviceType === 'tablet' ? 'MÁY TÍNH BẢNG'  :''}
                                 </h2>
                                 <div style={{ 
                                    borderTop: '2px solid #000', 
                                    margin: '0px 0', 
                                    width: '50%' 
                                    }} />
                                    <WrapperProducts style={{ backgroundColor: '#2980B9', padding: '20px', borderRadius: '8px'} }>
                                        {deviceTypeProducts[deviceType].map((product) => (
                                            <CardComponent
                                                key={product._id} countInStock = {product.countInStock} 
                                                decription={product.decription} image={product.image} name={product.name}
                                                price={product.price} rating={product.rating} type={product.type}  
                                                deviceType={product.deviceType}
                                                selled={product.selled} discount={product.discount} id={product._id}
                                            />
                                        ))}
                                    </WrapperProducts>
                                    <div style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '20px', marginBottom: '10px' }}>
                                    <WrapperButtonMore
                                        textbutton="Xem thêm"
                                        onClick={() => handleLoadMore(deviceType)}
                                        styleButton={{
                                            border: '1px solid rgb(11,116,229)',
                                            color: 'rgb(11,116,229)',
                                            
                                            width: '240px',
                                            height: '38px',
                                            borderRadius: '4px',
                                            background: 'transparent',  
                                        }}
                                    />

                                    </div>
                               
                            </div>
                        ))}
                        
                    </div>
                </div>
            </Loading>
        )
    }

    export default HomePage