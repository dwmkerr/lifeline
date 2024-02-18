import * as React from "react";
import { useState } from "react";
import { typographyClasses } from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { useAlertContext } from "../components/AlertContext";
import { LifelineRepository } from "../lib/LifelineRepository";
import { LifelineError } from "../lib/Errors";

import screenshot1 from "../images/screenshot-timeline.png";

function TwoSidedLayout({
  children,
  reversed,
}: React.PropsWithChildren<{ reversed?: boolean }>) {
  return (
    <Container
      sx={(theme) => ({
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: reversed ? "column-reverse" : "column",
        alignItems: "center",
        py: 10,
        gap: 4,
        [theme.breakpoints.up(834)]: {
          flexDirection: "row",
          gap: 6,
        },
        [theme.breakpoints.up(1199)]: {
          gap: 12,
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "50ch",
          textAlign: "center",
          flexShrink: 999,
          [theme.breakpoints.up(834)]: {
            minWidth: 420,
            alignItems: "flex-start",
            textAlign: "initial",
          },
          [`& .${typographyClasses.root}`]: {
            textWrap: "balance",
          },
        })}
      >
        {children}
      </Box>
      <AspectRatio
        ratio={600 / 520}
        variant="outlined"
        maxHeight={300}
        sx={(theme) => ({
          minWidth: 300,
          alignSelf: "stretch",
          [theme.breakpoints.up(834)]: {
            alignSelf: "initial",
            flexGrow: 1,
            "--AspectRatio-maxHeight": "520px",
            "--AspectRatio-minHeight": "400px",
          },
          borderRadius: "sm",
          bgcolor: "background.level2",
          flexBasis: "50%",
        })}
      >
        <img src={screenshot1} alt="" />
      </AspectRatio>
    </Container>
  );
}
function Hero() {
  const repository = LifelineRepository.getInstance();
  const { setAlertFromError } = useAlertContext();
  const [signingUp, setSigningUp] = useState(false);
  const signUp = async () => {
    try {
      setSigningUp(true);
      await repository.signInWithGoogle();
    } catch (err) {
      setAlertFromError(LifelineError.fromError("Sign Up Error", err));
    }
    setSigningUp(false);
  };
  const signIn = async () => {
    try {
      await repository.signInWithGoogle();
    } catch (err) {
      setAlertFromError(LifelineError.fromError("Sign In Error", err));
    }
  };

  return (
    <TwoSidedLayout>
      <Typography color="primary" fontSize="lg" fontWeight="lg">
        Welcome to Lifeline
      </Typography>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        Track, visualize and learn from your life events
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        Lifeline lets you build a timeline of key events in your life so that
        you can visualize your personal history and learn about how it has
        affected you.
      </Typography>
      <Button
        size="lg"
        endDecorator={<ArrowForward />}
        onClick={signUp}
        loading={signingUp}
      >
        Get Started
      </Button>
      <Typography>
        Already signed up?{" "}
        <Link fontWeight="lg" onClick={signIn}>
          Sign in
        </Link>
      </Typography>
    </TwoSidedLayout>
  );
}

export default function WelcomePage() {
  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        "& > div": {
          scrollSnapAlign: "start",
        },
      }}
    >
      <Hero />
    </Box>
  );
}
