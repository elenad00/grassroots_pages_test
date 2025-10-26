import { BrowserRouter, Route, Routes } from "react-router";
import CreateAccount from "../views/user-create-account";
import DataCardPage from "../views/data-card-page";
import Homepage from "../views/homepage";
import SignIn from "../views/user-sign-in";
import { SignInAuth, SignOut } from "../views/user-authentication";
import SingleValuePage from "../views/single-value-page";
import UserPage from "../views/user";
import UnknownPage from "../views/404-page";

export function WebpageRoutes () {
  return(
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage/>}/>
        
        <Route exact path='/artists' element={<DataCardPage dataKey="artists"/>}/>
        <Route exact path='/artists/:artistName' element={<SingleValuePage />}/>

        <Route exact path='/sign-in' element={<SignIn/>} />
        <Route exact path='/sign-in/auth/:authType' element={<SignInAuth />} />
        <Route exact path='/sign-in/create' element={<CreateAccount />} />
        <Route exact path='/sign-out' element={<SignOut/>} />

        <Route path='/user/:subPage' element={<UserPage/>}/>
        
        <Route exact path='/venues' element={<DataCardPage dataKey="venues"/>}/>
        <Route exact path='/venues/:venueName' element={<SingleValuePage />}/>
        
        <Route path="*" element={<UnknownPage />}/>
      </Routes>
    </BrowserRouter>
  )
}