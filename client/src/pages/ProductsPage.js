import { json, defer, useLoaderData, Await } from "react-router-dom";
import { Fragment, Suspense } from "react";
import Products from "../components/Products";
import { Container } from "react-bootstrap";
 function ProductsPage(){
    const {data} = useLoaderData();
    console.log(data);
    return (
        <>
        <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data}>
                {(loadedData) => {
                return (
                    <Container >
                    <h1>{loadedData.category.name}</h1>
                    <p>{loadedData.category.description}</p>
                    <Products products={loadedData.products} />
                    </Container>
                    );
                }
                }
            </Await>
        </Suspense>
        </>
    );
}

export default ProductsPage;

const productsLoader = async (id) => {

    const response = await fetch("https://burger-world.com/api/products/categories/" + id);
    const data = await response.json();
    if(!response.ok){
        return json(data, { status: response.status });
    }
    return data;
}

export const loader = async ({ params }) => defer({ data: productsLoader(params.id) })