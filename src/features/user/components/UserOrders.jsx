// src/features/user/components/UserOrders.jsx
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock } from 'lucide-react';

export default function UserOrders() {
  return (
    <div className="mt-8 w-full max-w-md">
      <Link
        to="/orders"
        className="
          group relative block w-full overflow-hidden
          bg-white rounded-2xl border border-gray-200
          shadow-sm hover:shadow-xl
          transition-all duration-300 ease-out
          hover:-translate-y-1 active:scale-[0.98]
        "
      >
        {/* Abstract Background Decor (The "Matte" texture) */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gray-50 transition-all group-hover:bg-gray-100 z-0" />

        <div className="relative z-10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Icon Box - Matte Surface */}
            <div
              className="
              flex h-14 w-14 items-center justify-center 
              rounded-xl bg-gray-100 text-gray-600
              group-hover:bg-black group-hover:text-white
              transition-colors duration-300
            "
            >
              <Package size={28} strokeWidth={1.5} />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                My Orders
              </h3>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Clock size={14} className="text-gray-400" />
                <span>View history & status</span>
              </p>
            </div>
          </div>

          {/* Navigation Arrow */}
          <div
            className="
            text-gray-300 transform translate-x-0 
            group-hover:text-black group-hover:translate-x-1 
            transition-all duration-300
          "
          >
            <ArrowRight size={24} />
          </div>
        </div>
      </Link>
    </div>
  );
}
