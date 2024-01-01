import { Routes, Route } from "react-router-dom";
import SignInWithEmailForm from "./views/Authentication/adminSignin";
import TopRestaurants from "./views/Reports/TopRestaurants";
import TopMenuItems from "./views/Reports/TopMenuItems";
import TopCustomers from "./views/Reports/TopCustomers";
import Reviews from "./views/Reports/Reviews";
import TopPeriods from "./views/Reports/TopPeriods";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<SignInWithEmailForm />} />
      <Route path="/top-restaurants" element={<TopRestaurants />} />
      <Route path="/top-items" element={<TopMenuItems />} />
      <Route path="/top-customers" element={<TopCustomers />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/top-periods" element={<TopPeriods />} />
    </Routes>
  );
};

export default Router;
