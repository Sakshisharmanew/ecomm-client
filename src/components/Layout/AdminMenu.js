import React from "react";
import { NavLink } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';
import SettingsIcon from '@mui/icons-material/Settings';
import LuggageIcon from '@mui/icons-material/Luggage';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ImageIcon from '@mui/icons-material/Image';
import "../../pages/AdminCss/AdminMenu.css"

const AdminMenu = () => {
  return (
    <>
          <div 
          herf="/admin" className="admin_dashboard"><h1>Dashboard</h1> 
         </div>
      <div className="text">
        <div className="list-group dashboard-menu">

          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-actions"
            // style={{marginLeft:-12}}

          >
            <CreateIcon/>
            Create Category
          </NavLink>
          
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-actions"
          >
            <CreateIcon/>
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-actions"
          ><SettingsIcon/>
            Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-actions"
          ><LuggageIcon/>
            Orders
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-actions"
          ><GroupAddIcon/>
            Users
          </NavLink>
          <NavLink
            to="/dashboard/admin/slider"
            className="list-group-item list-group-item-actions"
          ><ImageIcon/>
            Slider
          </NavLink>
          {/* <NavLink
            to="/dashboard/admin/multiImage"
            className="list-group-item list-group-item-actions"
          ><ImageIcon/>
            image
          </NavLink> */}
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
