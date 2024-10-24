import { json, defer, useLoaderData, Await } from "react-router-dom";
import { Categories } from "../components/Categories";
import { Suspense } from "react";
function Home() {
    const {categories} = useLoaderData();
    console.log("data");
    console.log(categories);
    
    return (
        <div>
            <h1>Our Menu</h1>
            {/* {categories && categories.length === 0 && <p>No categories found</p>} */}
            <Suspense fallback={<p>Loading...</p>}>
                <Await resolve={categories}>{(loadedCategories) => <Categories categories={loadedCategories} />}</Await>
            </Suspense>
        </div>
    );
};


export default Home;

async function getCategories() {
    console.log("loadCategories");
    
    const response = await  fetch("https://burger-world.com/api/products/categories");
    const data = await response.json();
    console.log(data);
    
    if(!response.ok){
        return json(data, { status: response.status });
    }
    return data;
};

export function loader() {
    return defer({
      categories: getCategories(),
    });
  }