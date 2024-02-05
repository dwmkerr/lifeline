import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";

import UserMenuDropdown from "../lib/UserMenuDropdown";
import { LifelineRepository } from "../lib/LifelifeRepository";
import { User, onAuthStateChanged } from "firebase/auth";

export default function HeaderSection() {
  const repository = new LifelineRepository();
  const [user, setUser] = useState<User | null>(repository.getUser() || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(repository.getAuth(), (user) => {
      setUser(user || null);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        top: 0,
        px: 1.5,
        py: 1,
        zIndex: 10000,
        backgroundColor: "background.body",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <IconButton size="sm" variant="soft">
          <MapsHomeWorkIcon />
        </IconButton>
        <Typography component="h1" fontWeight="xl">
          Lifeline
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <UserMenuDropdown user={user || undefined} />
      </Box>
    </Box>
  );
}
