import { RefObject, useCallback, useRef, useState } from "react";
import { User } from "firebase/auth";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";

import UploadIcon from "@mui/icons-material/Upload";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GoogleIcon from "@mui/icons-material/Google";

import { LifelineRepository } from "../lib/LifelifeRepository";
import { LifelineError } from "../lib/Errors";
import { useAlertContext } from "./AlertContext";
import FileUploadButton from "./FileUploadButton";
import { importCsv } from "../lib/LifelineCsv";

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
  //  We have to jump through some hoops to stop the internal file upload button
  //  from closing the menu when the 'input' element is selected to load the
  //  file.
  const fileUploadInputRef: RefObject<HTMLInputElement> = useRef(null);

  //  We must handle the menu open state ourselves - preventing close if the
  //  close event propagated from the upload input element.
  const [open, setOpen] = useState(false);
  const handleOpenChange = useCallback(
    (event: React.SyntheticEvent | null, isOpen: boolean) => {
      //  If a 'close' event is being propagated from the 'input' internally
      //  used in the upload button, prevent the menu from closing (otherwise
      //  we will lose the input and abort the upload).
      const inputEventTarget = event?.target as HTMLInputElement;
      console.log(`handleFileChange tag event target`, event);
      if (isOpen === false && inputEventTarget === fileUploadInputRef.current) {
        console.log(
          `input is closing menu - preventing close`,
          inputEventTarget,
        );
        return;
      }
      setOpen(isOpen);
    },
    [],
  );

  const onFileUploadComplete = async (fileContents: string) => {
    //  Close the menu, as we have prevented it from closing while the file
    //  upload is in operation.
    setOpen(false);
    const events = await importCsv(fileContents);
    await repository.restore(events);
  };

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
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

        <FileUploadButton
          startDecorator={<UploadIcon />}
          color="neutral"
          variant="plain"
          size="sm"
          inputElementRef={fileUploadInputRef}
          onFileUploadComplete={onFileUploadComplete}
        />
      </Menu>
    </Dropdown>
  );
}
