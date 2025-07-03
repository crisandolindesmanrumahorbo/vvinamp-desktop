import { useParams, useSearchParams } from "react-router-dom";

function ProductListing() {
  // Path parameters
  const { category, productId } = useParams<{
    category: string;
    productId: string;
  }>();

  // Query parameters
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "price-asc";
  console.log(page, sort, category, productId);

  return (
    <div>
      <h1>{category} Products</h1>
      <p>
        Page: {page}, Sort: {sort}
      </p>
    </div>
  );
}

export default ProductListing;
