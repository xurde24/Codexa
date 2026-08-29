import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo"
import AdminDelete from "./components/AdminDelete"
import AdminUpload from "./components/AdminUpload"
import AdminUpdate from "./components/AdminUpdate"
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <div className="flex flex-col min-h-screen">
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid #2a2a4a',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#1a1a2e' },
          style: {
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' },
          style: {
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }
        }
      }}
    />
    <Navbar />
    <main className="flex-grow">
    <Routes>
      <Route path="/" element={<Homepage></Homepage>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
      <Route 
  path="/problem/:problemId" 
  element={<ProblemPage/>} 
/>

      
    </Routes>
    </main>
    <Footer />
  </div>
  )
}

export default App;