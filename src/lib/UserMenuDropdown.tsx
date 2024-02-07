import { User } from "firebase/auth";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GoogleIcon from "@mui/icons-material/Google";

import { LifelineRepository } from "../lib/LifelifeRepository";
import { LifelineError } from "./Errors";
import { useAlertContext } from "../components/AlertContext";

function UserInfo({ user }: { user: User | undefined }) {
  //  Work out the user name and info.
  const repository = LifelineRepository.getInstance();
  const userName = user?.displayName;
  const userDetail = user ? user.uid : "Not Logged In";

  //  Based on the state of the user, we will have options to link/logout.
  const showGoogleSignInButton = !user;

  const { setAlertFromError } = useAlertContext();

  const signIn = async () => {
    try {
      await repository.signInWithGoogle();
    } catch (err) {
      setAlertFromError(LifelineError.fromError("Sign In Error", err));
    }
  };

  return (
    <div>
      <MenuItem disabled={true}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            src={user?.photoURL || undefined}
            sx={{
              maxWidth: "32px",
              maxHeight: "32px",
              borderRadius: "50%",
            }}
          />
          <Box sx={{ ml: 1.5 }}>
            <Typography level="title-sm" textColor="text.primary">
              {userName || "Unknown User"}
            </Typography>
            {user?.email && (
              <Typography level="body-xs" textColor="text.tertiary">
                {user.email}
              </Typography>
            )}
            <Typography level="body-xs" textColor="text.tertiary">
              {userDetail}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <ListDivider />
      {showGoogleSignInButton && (
        <MenuItem onClick={signIn}>
          <GoogleIcon />
          Sign In with Google
        </MenuItem>
      )}
    </div>
  );
}

interface UserMenuDropdownProps {
  user?: User;
}

export default function UserMenuDropdown({ user }: UserMenuDropdownProps) {
  const repository = LifelineRepository.getInstance();

  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        size="sm"
        sx={{
          maxWidth: "32px",
          maxHeight: "32px",
          borderRadius: "9999999px",
        }}
      >
        <Avatar
          sx={{ maxWidth: "32px", maxHeight: "32px" }}
          src={user?.photoURL || undefined}
        />
      </MenuButton>
      <Menu
        placement="bottom-end"
        size="sm"
        sx={{
          zIndex: "99999",
          p: 1,
          gap: 1,
          "--ListItem-radius": "var(--joy-radius-sm)",
        }}
      >
        <UserInfo user={user} />
        <ListDivider />
        <MenuItem disabled={true}>
          <SettingsRoundedIcon />
          Settings
        </MenuItem>
        <MenuItem disabled={!user} onClick={() => repository.signOut()}>
          <LogoutRoundedIcon />
          Log out
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
