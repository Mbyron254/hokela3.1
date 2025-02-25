// 'use client';

// import { DashboardContent } from 'src/layouts/dashboard';

// import { ProductDetailsSkeleton } from 'src/sections/clients/client-skeleton';

// // ----------------------------------------------------------------------

// export default function Loading() {
//   return (
//     <DashboardContent sx={{ pt: 5 }}>
//       <ProductDetailsSkeleton />
//     </DashboardContent>
//   );
// }
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function Loading() {
  return <LoadingScreen />;
}
