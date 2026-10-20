// import { useProducts } from "../../hooks/useProducts";
// import { useCategories } from "../../hooks/useCategories";
// import { slugify } from "../../utils/slug";

// function ApiDebug() {
//   const products = useProducts();
//   const categories = useCategories();

//   return (
//     <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-slate-700">
//       <p className="mb-2 font-semibold text-amber-800">API debug (temporary, delete later)</p>

//       {products.isPending || categories.isPending ? (
//         <p>Loading from the API...</p>
//       ) : null}

//       {products.isError && (
//         <p className="text-red-600">Products error: {products.error.message}</p>
//       )}
//       {categories.isError && (
//         <p className="text-red-600">Categories error: {categories.error.message}</p>
//       )}

//       {categories.data && (
//         <p className="mb-3">
//           <b>{categories.data.length} categories:</b>{" "}
//           {categories.data.map((c) => `${c.name} (${slugify(c.name)})`).join(", ") || "none yet"}
//         </p>
//       )}

//       {products.data && (
//         <>
//           <p className="mb-2">
//             <b>{products.data.length} products</b>
//             {products.isFetching && " (refreshing...)"}
//           </p>

//           {products.data.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-\[480px] text-left">
//                 <thead>
//                   <tr className="border-b border-amber-200">
//                     <th className="py-1 pr-3">Name</th>
//                     <th className="py-1 pr-3">Price</th>
//                     <th className="py-1 pr-3">Stock</th>
//                     <th className="py-1 pr-3">Category</th>
//                     <th className="py-1">Image</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.data.map((p) => (
//                     <tr key={p._id} className="border-b border-amber-100">
//                       <td className="py-1 pr-3">{p.name}</td>
//                       <td className="py-1 pr-3">{p.price}</td>
//                       <td className="py-1 pr-3">{p.stock}</td>
//                       <td className="py-1 pr-3">
//                         {typeof p.category === "string" ? `id only: ${p.category}` : p.category?.name ?? "missing"}
//                       </td>
//                       <td className="py-1">{p.imageUrl ? "yes" : "no"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <details className="mt-3">
//             <summary className="cursor-pointer font-medium">Raw first product</summary>
//             <pre className="mt-2 overflow-auto rounded bg-white p-3">
//               {JSON.stringify(products.data[0] ?? null, null, 2)}
//             </pre>
//           </details>
//         </>
//       )}
//     </div>
//   );
// }

// export default ApiDebug;