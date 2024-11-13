import { Link } from "react-router-dom";
import { groupedBrandData } from "../../constans/allbrands";
groupedBrandData;

const AllBrandts = () => {
  return (
    <div className="mt-20 max-w-[115rem] py-5 mx-auto px-5 md:px-2 flex flex-col justify-center  overflow-x-hidden">
      <div className="px-4 py-4">
        {Object.entries(groupedBrandData).map(([letter, brands]) => (
          <div key={letter} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">#{letter}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.path}
                  to={brand.path}
                  className="text-lg font-medium text-gray-400 hover:text-gray-500 transition-colors duration-300"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBrandts;
