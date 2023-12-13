import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
  Image,
  Box,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CgProfile } from "react-icons/cg";
import { signOut } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../components/AuthAtom/SignInAtom";
import showToast from "../../components/chakraUi/toastUtils";
import { auth } from "../../Firebase/firebaseConfig";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user }) => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (user) {
      signOut(auth)
        .then(() => {
          showToast(toast, "Logged out successfully", "", "success");
           navigate('/')
        })
        .catch((error) => {
          showToast(toast, "Error logging out", error.message, "error");
        });
    }
  };
  return (
    <Box>
      {/* User image and name in a box */}
      <Menu>
      <MenuButton
        cursor="pointer"
        padding="1px 5px"
        borderRadius={4}
        height='40px'
        _hover={{
          outline: "1px solid ",
          outlineColor: "gray.300",
        }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
               <Image src={user?.photoURL} borderRadius="50%" mr={2}
                 width={{base: '30px', md:"30px"}}/>
                <Flex
                  direction="column"
                 
                  fontSize="8pt"
                  align="flex-start"
                  mr={4}
                >
                  <Text fontWeight={600}>{user?.displayName}</Text>
                </Flex>
              </>
            ) : (
              <Icon as={VscAccount} color="gray.400" fontSize={24} mr={1} />
            )}
          </Flex>
          <ChevronDownIcon mr={1} />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize="1rem"
              fontWeight={800}
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
            >
              <Flex align="center">
                <Icon fontSize={18} mr={2} as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="1rem"
              fontWeight={800}
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
              onClick={handleLogout}
            >
              <Flex align="center">
                <Icon as={RiLogoutCircleLine} fontSize={18} mr={2}  />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="1rem"
              fontWeight={800}
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
              onClick={() => setAuthModalState({ open: true, view: "login" })}
            >
              <Flex align="center">
                <Icon as={IoMdLogIn} fontSize={18} mr={2}  />
                Log In
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
    </Box>
  );
};

export default UserMenu;
