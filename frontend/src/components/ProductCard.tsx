import { Link } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  brand?: string;
  images?: string[];
};

interface ProductCardProps {
  product: Product;
  height?: string; // desktop height, e.g. "340px", "400px"
  mobileHeight?: string; // mobile height, e.g. "220px"
}

const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max) + '...' : str;

const ProductCard = ({ product, height = "340px", mobileHeight = "220px" }: ProductCardProps) => (
  <div
    className="group relative bg-white dark:bg-black rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col items-center border-2 border-transparent hover:border-gold-500 product-card-mobile-height"
    style={{
      height: height,
      ...(mobileHeight ? { ['--mobile-height' as any]: mobileHeight } : {}),
    }}
  >
    <style>
      {`
        @media (max-width: 640px) {
          .product-card-mobile-height {
            height: var(--mobile-height) !important;
          }
        }
      `}
    </style>
    <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-contain transition duration-500 group-hover:scale-110"
        />
      ) : (
        <img
          src="/images/placeholder.png"
          alt="No image"
          className="w-3/4 h-3/4 object-contain"
        />
      )}
    </div>
    <div className="p-4 w-full flex flex-col flex-1">
      <h2 className="text-sm md:text-lg font-bold mb-2 dark:text-white">
        {truncate(product.name, 22)}
      </h2>
      {product.brand && (
        <span className="text-xs md:text-sm font-semibold text-gold-500 dark:text-gold-400 mb-4">{product.brand}</span>
      )}
      <div className="flex-1" />
      <Link
        to={`/products/${product._id}`}
        className="w-full px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition duration-300 text-base text-center block"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default ProductCard;