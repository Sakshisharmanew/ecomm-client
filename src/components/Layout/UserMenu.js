import React from "react";
import { Link, NavLink } from "react-router-dom";
import '../../styles/dashboard.css'
import {AiFillHome} from 'react-icons/ai'
import {AiOutlineUserAdd} from 'react-icons/ai'
import {BiUserCircle} from 'react-icons/bi'
import {BsCartCheckFill} from 'react-icons/bs'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  RadioGroup,
  Stack,
  Radio,
  Button,
  WrapItem,
  Wrap,
} from '@chakra-ui/react';
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { IoMdCloseCircle } from "react-icons/io";






const UserMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = React.useState('left')
  
  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>
      <HiMiniBars3BottomLeft />
      </Button>
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Manage Your Account
          </DrawerHeader>
          <DrawerBody>
          <Link to="/dashboard/user">
          <Button width="100%" marginBottom={3} colorScheme='gray'>Dashboard</Button>
          </Link>
          <Link to="/dashboard/user/profile">
          <Button width="100%"  marginBottom={3} colorScheme='gray'>Profile</Button>
          </Link>
          <Link to="/dashboard/user/orders">
          <Button width="100%" marginBottom={3} colorScheme='gray'>Orders</Button>
          </Link>
          </DrawerBody>
          <DrawerFooter>
        <Button colorScheme='red' width="100%" marginLeft={0}  onClick={onClose}>
          Close
          </Button>
        </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
    
  );
};

export default UserMenu;
